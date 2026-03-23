/* ============================================================
   CHARTS.JS — Initialisation Chart.js et animations SVG
   ============================================================ */

// Instances Chart.js (null = pas encore initialisé)
let donutInst = null;
let scoreInst = null;
let radarInst = null;

/* ── Donut : biais structurel mondial (slide 4) ─────────────── */
function initDonut() {
  const ctx = document.getElementById('donutChart');
  if (!ctx || donutInst) return;

  donutInst = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Ascendance Européenne', 'Données insuffisantes', 'Réunion (absente)'],
      datasets: [{
        data: [81, 19, 0.4],
        backgroundColor: ['#0B1F3A', '#9CA3AF', '#E05A4B'],
        borderWidth: 0,
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      cutout: '62%',
      animation: { animateRotate: true, duration: 900, easing: 'easeInOutQuart' },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => {
              const v = ctx.parsed;
              return ` ${ctx.label} : ${v === 0.4 ? '≈0' : v}%`;
            }
          }
        }
      }
    }
  });
}

/* ── Barres horizontales : poids du score S_div (slide 17) ─── */
function initScore() {
  const ctx = document.getElementById('scoreBarChart');
  if (!ctx || scoreInst) return;

  const tooltipDescriptions = [
    'Couverture espace génétique global',
    'Profils ancestraux non représentés',
    'Pénalité de parenté',
    'Bonus strate terrain',
    'Qualité ADN'
  ];

  scoreInst = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['D_PCA', 'D_ADM', '1 – φmax', 'U (quota)', 'DNAQ'],
      datasets: [{
        label: 'Poids (%)',
        data: [45, 25, 15, 10, 5],
        backgroundColor: ['#0D7377', '#7C3AED', '#EA580C', '#D97706', '#6B7280'],
        borderRadius: 6,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      animation: {
        duration: 800,
        delay: ctx => ctx.dataIndex * 120,
        easing: 'easeOutQuart'
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label:      ctx => `Poids : ${ctx.parsed.x}%`,
            afterLabel: ctx => tooltipDescriptions[ctx.dataIndex]
          }
        }
      },
      scales: {
        x: {
          max: 50,
          ticks: { callback: v => v + '%', color: '#4A5568', font: { size: 14 } },
          grid:  { color: 'rgba(0,0,0,.06)' }
        },
        y: {
          ticks: { color: '#0B1F3A', font: { size: 15, weight: '700', family: "'Courier New',monospace" } },
          grid:  { display: false }
        }
      }
    }
  });
}

/* ── Radar : comparaison des 3 patients (slide 21) ─────────── */
function initRadar() {
  const ctx = document.getElementById('radarChart');
  if (!ctx || radarInst) return;

  radarInst = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['D_PCA', 'D_ADM', '1–φmax', 'U', 'DNAQ'],
      datasets: [
        {
          label: 'Patient A (profil moyen)',
          data: [0.20, 0.15, 0.90, 0.50, 0.80],
          backgroundColor: 'rgba(107,114,128,.12)',
          borderColor: '#9CA3AF',
          pointBackgroundColor: '#9CA3AF',
          borderWidth: 2, pointRadius: 4
        },
        {
          label: 'Patient B (apparenté)',
          data: [0.85, 0.70, 0.20, 0.60, 0.90],
          backgroundColor: 'rgba(217,119,6,.12)',
          borderColor: '#D97706',
          pointBackgroundColor: '#D97706',
          borderWidth: 2, pointRadius: 4
        },
        {
          label: 'Patient C — sélectionné ✓',
          data: [0.90, 0.80, 0.95, 0.70, 0.85],
          backgroundColor: 'rgba(5,150,105,.15)',
          borderColor: '#059669',
          pointBackgroundColor: '#059669',
          borderWidth: 2.5, pointRadius: 5
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 900, easing: 'easeInOutQuart' },
      plugins: {
        legend: {
          position: 'bottom',
          labels: { font: { size: 13 }, padding: 12, boxWidth: 14, color: '#4A5568' }
        }
      },
      scales: {
        r: {
          min: 0, max: 1,
          ticks:       { stepSize: .25, font: { size: 12 }, color: '#8896A5', backdropColor: 'transparent' },
          pointLabels: { font: { size: 14, weight: '700' }, color: '#0B1F3A' },
          grid:        { color: 'rgba(0,0,0,.1)' },
          angleLines:  { color: 'rgba(0,0,0,.1)' }
        }
      }
    }
  });
}

/* ── Pipeline SNP → WGS : animation séquentielle (slide 12) ── */
function animPipeline() {
  document.querySelectorAll('#pipeFlow .pipe-box, #pipeFlow .pipe-arrow-el').forEach(el => {
    const delay = parseInt(el.dataset.delay || 0) * 130;
    setTimeout(() => el.classList.add('shown'), delay);
  });
}

function resetPipeline() {
  document.querySelectorAll('#pipeFlow .pipe-box, #pipeFlow .pipe-arrow-el')
    .forEach(el => el.classList.remove('shown'));
}

/* ── Diagramme ROH : apparition des segments (slide 20) ────── */
function animROH() {
  const segs = document.querySelectorAll('#rohDiagram .chrom-seg');
  segs.forEach((seg, i) => {
    setTimeout(() => {
      seg.style.opacity    = '1';
      seg.style.transition = 'opacity .5s ease';
    }, i * 90 + 200);
  });
}

function resetROH() {
  document.querySelectorAll('#rohDiagram .chrom-seg').forEach(seg => {
    seg.style.opacity    = '0';
    seg.style.transition = 'none';
  });
}
