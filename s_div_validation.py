#!/usr/bin/env python3
"""
S_div Validation Script for 1000 Genomes

Automated benchmark of S_div selection strategy vs. alternatives
on 1000G ACB+ASW populations (proxy for Réunion admixed population).

Usage:
    python s_div_validation.py --pfile <prefix> --metadata <file> --output_dir <dir>

Example:
    python s_div_validation.py \\
        --pfile 1000g_acb_asw_qc \\
        --metadata igsr_samples.tsv \\
        --output_dir results/
"""

import argparse
import os
import subprocess
import sys
import pandas as pd
import numpy as np
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from scipy.spatial.distance import pdist, squareform
from scipy.stats import ks_2samp, entropy
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime
import logging

# ============================================================================
# LOGGING SETUP
# ============================================================================

def setup_logging(output_dir):
    """Configure logging to file and console."""
    log_file = os.path.join(output_dir, "logs", "validation.log")
    os.makedirs(os.path.dirname(log_file), exist_ok=True)

    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler(log_file),
            logging.StreamHandler(sys.stdout)
        ]
    )
    return logging.getLogger(__name__)

# ============================================================================
# 1. LOAD DATA
# ============================================================================

def load_plink_data(pfile_prefix):
    """Load PLINK binary format (.pgen/.pvar/.psam)."""
    logger.info(f"Loading PLINK data from {pfile_prefix}...")

    # Use plink2 to convert to text (or use pysnptools if available)
    # For now, we'll load via plink and export to text

    subprocess.run(
        ["plink2", "--pfile", pfile_prefix, "--export", "A", "--out", "temp_data"],
        check=True,
        capture_output=True
    )

    # Load genotypes (A = allele count format)
    genotypes = pd.read_csv("temp_data.raw", sep="\s+", index_col=[0, 1, 2, 3, 4])

    # Load sample info
    psam = pd.read_csv(f"{pfile_prefix}.psam", sep="\t")

    logger.info(f"Loaded {genotypes.shape[0]} SNPs, {genotypes.shape[1]} samples")

    return genotypes, psam

def load_metadata(metadata_file):
    """Load 1000 Genomes metadata."""
    logger.info(f"Loading metadata from {metadata_file}...")

    metadata = pd.read_csv(metadata_file, sep="\t")

    logger.info(f"Loaded metadata for {len(metadata)} samples")

    return metadata

# ============================================================================
# 2. COMPONENT 1: PCA
# ============================================================================

def calculate_pca(genotypes, n_components=5):
    """Calculate PCA scores."""
    logger.info("Calculating PCA...")

    # Standardize
    scaler = StandardScaler()
    genotypes_scaled = scaler.fit_transform(genotypes.T)

    # PCA
    pca = PCA(n_components=n_components)
    pca_scores = pca.fit_transform(genotypes_scaled)

    # Calculate distance from centroid
    centroid = np.mean(pca_scores, axis=0)
    pca_distance = np.sqrt(np.sum((pca_scores - centroid) ** 2, axis=1))

    # Normalize 0-1
    pca_score = (pca_distance - pca_distance.min()) / (pca_distance.max() - pca_distance.min())

    logger.info(f"PCA variance explained: {sum(pca.explained_variance_ratio_[:5]):.2%}")

    return pca_score, pca_scores, pca

# ============================================================================
# 3. COMPONENT 2: ADMIXTURE (simulated via PCA ancestry inference)
# ============================================================================

def calculate_admixture_score(pca_scores):
    """
    Approximate ADMIXTURE via PCA entropy.
    In real analysis, use ADMIXTURE software.
    """
    logger.info("Calculating ADMIXTURE scores (via PCA entropy approximation)...")

    # Normalize PCA scores to [0,1] per component
    pca_norm = (pca_scores - pca_scores.min(axis=0)) / (pca_scores.max(axis=0) - pca_scores.min(axis=0))

    # Treat as "ancestry proportions" (this is simplified; real ADMIXTURE does LD pruning + convergence)
    # q_k = normalized PCA component k

    # Calculate entropy per individual
    admix_scores = np.zeros(pca_norm.shape[0])
    for i in range(pca_norm.shape[0]):
        # Entropy: -Σ q_k * log(q_k), where q_k normalized to sum to 1
        q = pca_norm[i, :3] / pca_norm[i, :3].sum()
        # Add small epsilon to avoid log(0)
        admix_scores[i] = -np.sum(q * np.log(q + 1e-10))

    # Normalize 0-1
    admix_score = (admix_scores - admix_scores.min()) / (admix_scores.max() - admix_scores.min())

    logger.info(f"ADMIXTURE entropy range: [{admix_scores.min():.3f}, {admix_scores.max():.3f}]")

    return admix_score

# ============================================================================
# 4. COMPONENT 3: IBD (Identical by Descent)
# ============================================================================

def calculate_ibd_matrix(genotypes):
    """
    Calculate IBD via genome kinship (simplified: Loiselle estimator).
    In real analysis, use PLINK --king-cutoff.
    """
    logger.info("Calculating IBD matrix (kinship estimator)...")

    # Allele frequencies
    allele_freq = genotypes.mean(axis=0) / 2.0

    # Center genotypes
    centered = genotypes - 2 * allele_freq

    # Covariance
    cov = np.cov(centered.values.T)
    diag = np.diag(cov)

    # Kinship matrix
    kinship = cov / np.sqrt(np.outer(diag, diag))

    logger.info(f"Kinship matrix shape: {kinship.shape}")

    return kinship

def calculate_ibd_score(kinship, ibd_threshold=0.125):
    """Calculate IBD score (avoiding related individuals)."""
    logger.info(f"Calculating IBD scores (threshold={ibd_threshold})...")

    # For each individual, calculate mean kinship with others
    ibd_scores = np.zeros(kinship.shape[0])
    for i in range(kinship.shape[0]):
        # Mean kinship with others
        others = np.concatenate([kinship[i, :i], kinship[i, i+1:]])
        ibd_scores[i] = 1.0 - np.mean(np.abs(others[others < ibd_threshold]))

    # Ensure [0, 1]
    ibd_scores = np.clip(ibd_scores, 0, 1)

    return ibd_scores

# ============================================================================
# 5. COMPONENT 4: ROH (Runs of Homozygosity)
# ============================================================================

def calculate_roh_score(genotypes, roh_threshold_mb=100):
    """
    Calculate ROH score (simplified: homozygosity runs).
    In real analysis, use PLINK --homozyg.
    """
    logger.info(f"Calculating ROH scores (threshold={roh_threshold_mb} Mb)...")

    # Simple approach: % homozygous sites
    homozygous_pct = (genotypes == 0).sum(axis=1) / genotypes.shape[1]

    # ROH score = 1 - (homozygosity / threshold)
    roh_scores = 1.0 - (homozygous_pct / (roh_threshold_mb / 1000.0))
    roh_scores = np.clip(roh_scores, 0, 1)

    logger.info(f"Homozygosity range: [{homozygous_pct.min():.2%}, {homozygous_pct.max():.2%}]")

    return roh_scores

# ============================================================================
# 6. AGGREGATE S_div
# ============================================================================

def calculate_s_div(pca_score, admix_score, ibd_score, roh_score,
                    w1=0.30, w2=0.30, w3=0.25, w4=0.15):
    """Aggregate S_div from 4 components."""
    s_div = w1 * pca_score + w2 * admix_score + w3 * ibd_score + w4 * roh_score
    return s_div

# ============================================================================
# 7. SELECTION STRATEGIES
# ============================================================================

def select_random(n_total, n_select, random_state=42):
    """Random selection."""
    np.random.seed(random_state)
    return np.random.choice(n_total, size=n_select, replace=False)

def select_pca_only(pca_scores, n_select):
    """Selection based on PCA diversity only."""
    return np.argsort(pca_scores)[-n_select:]

def select_maximin_ibd(ibd_scores, kinship, n_select, ibd_threshold=0.125):
    """Greedy selection maximizing IBD distance."""
    selected = []
    remaining = set(range(len(ibd_scores)))

    # Start with highest IBD score
    selected.append(np.argmax(ibd_scores))
    remaining.remove(selected[0])

    while len(selected) < n_select:
        # Find remaining with min kinship to selected
        min_kinship = np.inf
        best_candidate = None

        for i in remaining:
            mean_kinship = np.mean([np.abs(kinship[i, j]) for j in selected])
            if mean_kinship < min_kinship:
                min_kinship = mean_kinship
                best_candidate = i

        if best_candidate is not None:
            selected.append(best_candidate)
            remaining.remove(best_candidate)
        else:
            break

    return np.array(selected[:n_select])

def select_s_div_stratified(s_div_scores, kinship, n_select, ibd_threshold=0.125):
    """
    S_div stratified selection (greedy with quintile constraints).
    This is the MAIN METHOD to validate.
    """
    # Divide into quintiles
    quintile_boundaries = np.percentile(s_div_scores, [20, 40, 60, 80, 100])

    quintiles = {
        'Q1': np.where(s_div_scores >= quintile_boundaries[3])[0],  # Top 20%
        'Q2': np.where((s_div_scores >= quintile_boundaries[2]) & (s_div_scores < quintile_boundaries[3]))[0],
        'Q3': np.where((s_div_scores >= quintile_boundaries[1]) & (s_div_scores < quintile_boundaries[2]))[0],  # Median
        'Q4': np.where((s_div_scores >= quintile_boundaries[0]) & (s_div_scores < quintile_boundaries[1]))[0],
        'Q5': np.where(s_div_scores < quintile_boundaries[0])[0],  # Bottom 20%
    }

    # Allocate per quintile
    allocations = {
        'Q1': int(0.20 * n_select),
        'Q2': int(0.20 * n_select),
        'Q3': int(0.30 * n_select),  # Anchor (median)
        'Q4': int(0.20 * n_select),
        'Q5': int(0.10 * n_select),
    }

    # Ensure we select exactly n_select (rounding adjustments)
    total_allocated = sum(allocations.values())
    if total_allocated != n_select:
        allocations['Q3'] += (n_select - total_allocated)

    # Greedy selection within each quintile
    selected = []
    for quintile_name in ['Q1', 'Q2', 'Q3', 'Q4', 'Q5']:
        candidates = quintiles[quintile_name]
        candidates_sorted = candidates[np.argsort(-s_div_scores[candidates])]  # Descending S_div

        n_to_select = allocations[quintile_name]

        for candidate in candidates_sorted:
            if len(selected) >= n_select:
                break

            # Check IBD constraint
            is_unrelated = all(np.abs(kinship[candidate, sel]) < ibd_threshold for sel in selected)

            if is_unrelated:
                selected.append(candidate)

    return np.array(selected[:n_select])

def select_s_div_naive(s_div_scores, kinship, n_select, ibd_threshold=0.125):
    """
    S_div naive selection (greedy, no stratification).
    Used to test biais directionnel.
    """
    candidates_sorted = np.argsort(-s_div_scores)  # Descending S_div

    selected = []
    for candidate in candidates_sorted:
        if len(selected) >= n_select:
            break

        is_unrelated = all(np.abs(kinship[candidate, sel]) < ibd_threshold for sel in selected)

        if is_unrelated:
            selected.append(candidate)

    return np.array(selected[:n_select])

# ============================================================================
# 8. METRICS
# ============================================================================

def metric_allelic_coverage(genotypes, selected_indices):
    """% of variants represented in selection."""
    selected = genotypes.iloc[selected_indices]
    # A variant is "covered" if at least one selected individual carries alt allele
    covered = (selected > 0).any(axis=0).sum()
    total = genotypes.shape[1]
    return covered / total

def metric_rare_variants(genotypes, selected_indices, maf_threshold=0.05):
    """% of rare variants (MAF < maf_threshold) covered."""
    allele_freq = genotypes.mean(axis=0) / 2.0
    rare_mask = (allele_freq < maf_threshold) & (allele_freq > 0.001)
    rare_variants = genotypes.loc[:, rare_mask]

    selected = genotypes.iloc[selected_indices]
    selected_rare = rare_variants.iloc[selected_indices]

    covered = (selected_rare > 0).any(axis=0).sum()
    total = rare_variants.shape[1]

    return covered / total if total > 0 else 0

def metric_ancestry_representation(admix_score, selected_indices):
    """KL divergence of ancestry distribution."""
    # Binning into ancestry categories
    ancestry_full = pd.qcut(admix_score, q=3, labels=['Low', 'Medium', 'High'], duplicates='drop')
    ancestry_selected = pd.qcut(admix_score[selected_indices], q=3, labels=['Low', 'Medium', 'High'], duplicates='drop')

    # Distribution comparison
    full_dist = ancestry_full.value_counts(normalize=True)
    selected_dist = ancestry_selected.value_counts(normalize=True)

    # KL divergence (add small epsilon to avoid log(0))
    kl = np.sum(full_dist * np.log((full_dist + 1e-10) / (selected_dist.reindex(full_dist.index, fill_value=1e-10) + 1e-10)))

    return kl

def metric_ibd_redundancy(kinship, selected_indices, ibd_threshold=0.125):
    """% of selected pairs with IBD > threshold."""
    n_selected = len(selected_indices)
    if n_selected < 2:
        return 0

    selected_kinship = kinship[np.ix_(selected_indices, selected_indices)]
    n_related = np.sum(np.abs(selected_kinship) > ibd_threshold) - n_selected  # Exclude diagonal
    n_pairs = n_selected * (n_selected - 1) / 2

    return n_related / (2 * n_pairs) if n_pairs > 0 else 0

def metric_pca_coverage(pca_scores, selected_indices):
    """% of PCA variance retained in selection."""
    full_var = np.sum(np.var(pca_scores, axis=0))
    selected_var = np.sum(np.var(pca_scores[selected_indices], axis=0))

    return selected_var / full_var

def metric_directional_bias(s_div_full, s_div_selected):
    """Kolmogorov-Smirnov test: distribution S_div (full vs selected)."""
    ks_stat, _ = ks_2samp(s_div_full, s_div_selected)
    return ks_stat

# ============================================================================
# 9. BENCHMARK
# ============================================================================

def run_benchmark(genotypes, psam, pca_score, admix_score, ibd_score, roh_score,
                  s_div_stratified, s_div_naive, kinship, pca_scores):
    """Run full benchmark on all selection strategies."""

    results = []

    # Test different selection percentages
    for pct in [25, 50, 75]:
        n_select = int(genotypes.shape[0] * pct / 100)
        logger.info(f"\n--- Benchmark {pct}% selection (n={n_select}) ---")

        # 5 selection strategies
        strategies = {
            'S_div_stratified': select_s_div_stratified(s_div_stratified, kinship, n_select),
            'S_div_naive': select_s_div_naive(s_div_naive, kinship, n_select),
            'Random_1': select_random(len(genotypes), n_select, random_state=42),
            'Random_2': select_random(len(genotypes), n_select, random_state=43),
            'Random_3': select_random(len(genotypes), n_select, random_state=44),
            'PCA_only': select_pca_only(pca_score, n_select),
            'Maximin_IBD': select_maximin_ibd(ibd_score, kinship, n_select),
        }

        for strategy_name, selected_indices in strategies.items():
            logger.info(f"  {strategy_name}: evaluating metrics...")

            metrics = {
                'Percentage': pct,
                'Strategy': strategy_name,
                'N_selected': len(selected_indices),
                'Allelic_coverage': metric_allelic_coverage(genotypes, selected_indices),
                'Rare_variants': metric_rare_variants(genotypes, selected_indices),
                'Ancestry_KL': metric_ancestry_representation(admix_score, selected_indices),
                'IBD_redundancy': metric_ibd_redundancy(kinship, selected_indices),
                'PCA_coverage': metric_pca_coverage(pca_scores, selected_indices),
                'Directional_bias_KS': metric_directional_bias(s_div_stratified, s_div_stratified[selected_indices]),
            }

            results.append(metrics)

    return pd.DataFrame(results)

# ============================================================================
# 10. VISUALIZATION
# ============================================================================

def create_figures(benchmark_df, output_dir):
    """Create benchmark comparison figures."""
    fig_dir = os.path.join(output_dir, "figures")
    os.makedirs(fig_dir, exist_ok=True)

    # Average metrics per strategy
    strategy_summary = benchmark_df.groupby('Strategy')[
        ['Allelic_coverage', 'Rare_variants', 'Ancestry_KL', 'IBD_redundancy', 'PCA_coverage']
    ].mean()

    # Figure 1: Comparison bar chart
    fig, ax = plt.subplots(figsize=(12, 6))
    strategy_summary.plot(kind='bar', ax=ax)
    ax.set_ylabel('Score')
    ax.set_xlabel('Selection Strategy')
    ax.set_title('S_div Benchmark: Strategy Comparison')
    ax.legend(loc='best', fontsize=8)
    plt.tight_layout()
    plt.savefig(os.path.join(fig_dir, 'comparison_bar_chart.png'), dpi=300)
    logger.info(f"Saved: {os.path.join(fig_dir, 'comparison_bar_chart.png')}")
    plt.close()

    # Figure 2: Directional bias
    fig, ax = plt.subplots(figsize=(10, 6))
    bias_data = benchmark_df.pivot_table(
        values='Directional_bias_KS', index='Strategy', columns='Percentage', aggfunc='mean'
    )
    bias_data.plot(kind='bar', ax=ax)
    ax.axhline(y=0.10, color='r', linestyle='--', label='Seuil (KS=0.10)')
    ax.set_ylabel('Kolmogorov-Smirnov')
    ax.set_xlabel('Selection Strategy')
    ax.set_title('Directional Bias (lower is better)')
    ax.legend()
    plt.tight_layout()
    plt.savefig(os.path.join(fig_dir, 'bias_distribution.png'), dpi=300)
    logger.info(f"Saved: {os.path.join(fig_dir, 'bias_distribution.png')}")
    plt.close()

    # Figure 3: Allelic coverage
    fig, ax = plt.subplots(figsize=(10, 6))
    coverage_data = benchmark_df.pivot_table(
        values='Allelic_coverage', index='Strategy', columns='Percentage', aggfunc='mean'
    )
    coverage_data.plot(kind='bar', ax=ax)
    ax.axhline(y=0.85, color='r', linestyle='--', label='Seuil (85%)')
    ax.set_ylabel('Couverture allélique')
    ax.set_xlabel('Selection Strategy')
    ax.set_title('Allelic Coverage by Strategy')
    ax.set_ylim([0.7, 1.0])
    ax.legend()
    plt.tight_layout()
    plt.savefig(os.path.join(fig_dir, 'allelic_coverage.png'), dpi=300)
    logger.info(f"Saved: {os.path.join(fig_dir, 'allelic_coverage.png')}")
    plt.close()

# ============================================================================
# 11. REPORT GENERATION
# ============================================================================

def generate_report(benchmark_df, output_dir):
    """Generate text report."""
    report_file = os.path.join(output_dir, 'report.txt')

    with open(report_file, 'w') as f:
        f.write("="*70 + "\n")
        f.write("RAPPORT DE VALIDATION S_DIV — 1000 Genomes\n")
        f.write("="*70 + "\n\n")

        f.write(f"Date : {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write(f"Population : ACB + ASW (157 individus, proxy La Réunion)\n\n")

        f.write("RÉSUMÉ EXÉCUTIF\n")
        f.write("-"*70 + "\n")

        # Strategy summary
        strategy_summary = benchmark_df.groupby('Strategy')[
            ['Allelic_coverage', 'Rare_variants', 'Ancestry_KL', 'IBD_redundancy', 'PCA_coverage', 'Directional_bias_KS']
        ].mean()

        f.write("\nMoyennes par stratégie :\n\n")
        f.write(strategy_summary.to_string())
        f.write("\n\n")

        # Validation criteria
        f.write("CRITÈRES DE VALIDATION\n")
        f.write("-"*70 + "\n")

        s_div_strat = strategy_summary.loc['S_div_stratified']

        criteria = [
            ("Biais directionnel KS < 0.10", s_div_strat['Directional_bias_KS'] < 0.10, s_div_strat['Directional_bias_KS']),
            ("Couverture allélique ≥ 85%", s_div_strat['Allelic_coverage'] >= 0.85, s_div_strat['Allelic_coverage']),
            ("Variants rares ≥ 60%", s_div_strat['Rare_variants'] >= 0.60, s_div_strat['Rare_variants']),
            ("Redondance IBD < 5%", s_div_strat['IBD_redundancy'] < 0.05, s_div_strat['IBD_redundancy']),
            ("Représentation ancestrale KL < 0.15", s_div_strat['Ancestry_KL'] < 0.15, s_div_strat['Ancestry_KL']),
        ]

        passed = 0
        for criterion, result, value in criteria:
            status = "✓ PASS" if result else "✗ FAIL"
            f.write(f"{status:8} {criterion:45} ({value:.3f})\n")
            if result:
                passed += 1

        f.write(f"\nScore: {passed}/5 critères passés\n")
        f.write(f"Verdict: {'VALIDÉ ✓' if passed >= 4 else 'À RÉVISER ✗'}\n\n")

        f.write("="*70 + "\n")

    logger.info(f"Rapport généré: {report_file}")
    return report_file

# ============================================================================
# 12. MAIN
# ============================================================================

def main(args):
    global logger

    # Setup
    os.makedirs(args.output_dir, exist_ok=True)
    logger = setup_logging(args.output_dir)

    logger.info("="*70)
    logger.info("S_DIV VALIDATION BENCHMARK — 1000 Genomes")
    logger.info("="*70)
    logger.info(f"Start time: {datetime.now()}")

    try:
        # 1. Load data
        genotypes, psam = load_plink_data(args.pfile)
        metadata = load_metadata(args.metadata)

        # 2. Calculate components
        pca_score, pca_scores, pca = calculate_pca(genotypes)
        admix_score = calculate_admixture_score(pca_scores)
        kinship = calculate_ibd_matrix(genotypes)
        ibd_score = calculate_ibd_score(kinship)
        roh_score = calculate_roh_score(genotypes)

        # 3. Calculate S_div
        logger.info("Calculating S_div (stratified and naive)...")
        s_div_stratified = calculate_s_div(pca_score, admix_score, ibd_score, roh_score)
        s_div_naive = calculate_s_div(pca_score, admix_score, ibd_score, roh_score)  # Same, for comparison

        # 4. Run benchmark
        logger.info("Running benchmark on all selection strategies...")
        benchmark_df = run_benchmark(
            genotypes, psam, pca_score, admix_score, ibd_score, roh_score,
            s_div_stratified, s_div_naive, kinship, pca_scores
        )

        # 5. Save results
        benchmark_file = os.path.join(args.output_dir, '1000g_benchmark_summary.csv')
        benchmark_df.to_csv(benchmark_file, index=False)
        logger.info(f"Benchmark results saved: {benchmark_file}")

        # 6. Create figures
        logger.info("Creating figures...")
        create_figures(benchmark_df, args.output_dir)

        # 7. Generate report
        logger.info("Generating report...")
        generate_report(benchmark_df, args.output_dir)

        logger.info(f"End time: {datetime.now()}")
        logger.info("Validation benchmark completed successfully!")

    except Exception as e:
        logger.error(f"Error: {e}", exc_info=True)
        sys.exit(1)

# ============================================================================

if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description='S_div validation benchmark on 1000 Genomes'
    )
    parser.add_argument('--pfile', required=True,
                        help='PLINK file prefix (without extension)')
    parser.add_argument('--metadata', required=True,
                        help='1000G metadata file (igsr_samples.tsv)')
    parser.add_argument('--output_dir', default='results/',
                        help='Output directory for results')

    args = parser.parse_args()

    main(args)
