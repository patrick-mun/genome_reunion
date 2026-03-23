/* ============================================================
   APP.JS — Présentation Génome Réunion
   Navigation, graphiques Chart.js, animations SVG
   ============================================================ */

// ── Constantes de navigation ─────────────────────────────────

const TOTAL_SLIDES = 25;

// Pour chaque slide, indique quelle pill de navigation doit être active.
// 0=Accueil 1=Angle mort 2=Singularité 3=Design 4=Algorithme 5=WGS
const SECTION_MAP = [0, 0, 1, 1, 1, 1, 1, 1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5];

// ── Éléments DOM ─────────────────────────────────────────────

const slideDeck      = document.getElementById('deck');
const slideCounter   = document.getElementById('ctr');
const progressBar    = document.getElementById('pf');
const buttonPrevious = document.getElementById('bp');
const buttonNext     = document.getElementById('bn');
const allSlides      = document.querySelectorAll('.slide');
const navPills       = document.querySelectorAll('.sec-pill');
const slideJumpTargets = document.querySelectorAll('.js-slide-jump');

// ── État ──────────────────────────────────────────────────────

let currentSlide = 0;

// ── Instances Chart.js (null = pas encore initialisé) ─────────

let donutChartInstance = null;
let scoreChartInstance = null;
let radarChartInstance = null;

// ══════════════════════════════════════════════════════════════
//   NAVIGATION
// ══════════════════════════════════════════════════════════════

/**
 * Navigue vers la slide numéro targetIndex.
 * Met à jour le deck, le compteur, la barre de progression,
 * les boutons et les pills de navigation.
 * Déclenche les animations propres à certaines slides.
 */
function goToSlide(targetIndex) {
  targetIndex = Math.max(0, Math.min(TOTAL_SLIDES - 1, targetIndex));

  allSlides[currentSlide].classList.remove('on');
  currentSlide = targetIndex;
  allSlides[currentSlide].classList.add('on');

  slideDeck.style.transform = `translateX(-${currentSlide * 100}vw)`;
  slideCounter.textContent  = `${currentSlide + 1} / ${TOTAL_SLIDES}`;
  progressBar.style.width   = `${((currentSlide + 1) / TOTAL_SLIDES) * 100}%`;

  buttonPrevious.disabled = currentSlide === 0;
  buttonNext.disabled     = currentSlide === TOTAL_SLIDES - 1;

  navPills.forEach(function(pill, index) {
    pill.classList.toggle('on', index === (SECTION_MAP[currentSlide] || 0));
  });

  // Animations déclenchées à l'arrivée sur certaines slides
  if (currentSlide === 3)  { setTimeout(initDonutChart,  200); }
  if (currentSlide === 11) { resetPipelineAnimation(); setTimeout(animatePipeline, 200); }
  if (currentSlide === 16) { setTimeout(initScoreChart,  200); }
  if (currentSlide === 19) { resetROHAnimation(); setTimeout(animateROH, 300); }
  if (currentSlide === 20) { setTimeout(initRadarChart,  200); }
}

// Exposé globalement pour compatibilité avec d'éventuels appels externes.
window.go = goToSlide;

// ── Navigation par boutons et cibles data-target-slide ───────

buttonPrevious.addEventListener('click', function() {
  goToSlide(currentSlide - 1);
});

buttonNext.addEventListener('click', function() {
  goToSlide(currentSlide + 1);
});

slideJumpTargets.forEach(function(target) {
  target.addEventListener('click', function() {
    const targetIndex = Number.parseInt(target.dataset.targetSlide, 10);
    if (!Number.isNaN(targetIndex)) {
      goToSlide(targetIndex);
    }
  });
});

// ── Navigation clavier ────────────────────────────────────────

document.addEventListener('keydown', function(event) {
  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') goToSlide(currentSlide + 1);
  if (event.key === 'ArrowLeft'  || event.key === 'ArrowUp')   goToSlide(currentSlide - 1);
});

// ── Navigation swipe mobile ───────────────────────────────────

let touchStartX = 0;

document.addEventListener('touchstart', function(event) {
  touchStartX = event.touches[0].clientX;
});

document.addEventListener('touchend', function(event) {
  const swipeDistance = event.changedTouches[0].clientX - touchStartX;
  if (Math.abs(swipeDistance) > 50) {
    goToSlide(swipeDistance < 0 ? currentSlide + 1 : currentSlide - 1);
  }
});

// ══════════════════════════════════════════════════════════════
//   GRAPHIQUES CHART.JS
// ══════════════════════════════════════════════════════════════

/**
 * Slide 4 — Donut : biais structurel mondial des données génomiques
 */
function initDonutChart() {
  const canvas = document.getElementById('donutChart');
  if (!canvas || donutChartInstance) return;

  donutChartInstance = new Chart(canvas, {
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
            label: function(context) {
              const value = context.parsed;
              return ` ${context.label} : ${value === 0.4 ? '≈0' : value}%`;
            }
          }
        }
      }
    }
  });
}

/**
 * Slide 17 — Barres horizontales : poids de chaque composante du score S_div
 */
function initScoreChart() {
  const canvas = document.getElementById('scoreBarChart');
  if (!canvas || scoreChartInstance) return;

  const componentDescriptions = [
    'Couverture espace génétique global',
    'Profils ancestraux non représentés',
    'Pénalité de parenté',
    'Bonus strate terrain',
    'Qualité ADN'
  ];

  scoreChartInstance = new Chart(canvas, {
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
        delay: function(context) { return context.dataIndex * 120; },
        easing: 'easeOutQuart'
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label:      function(context) { return `Poids : ${context.parsed.x}%`; },
            afterLabel: function(context) { return componentDescriptions[context.dataIndex]; }
          }
        }
      },
      scales: {
        x: {
          max: 50,
          ticks: { callback: function(v) { return v + '%'; }, color: '#4A5568', font: { size: 14 } },
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

/**
 * Slide 21 — Radar : comparaison des 3 profils candidats
 */
function initRadarChart() {
  const canvas = document.getElementById('radarChart');
  if (!canvas || radarChartInstance) return;

  radarChartInstance = new Chart(canvas, {
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
          borderWidth: 2,
          pointRadius: 4
        },
        {
          label: 'Patient B (apparenté)',
          data: [0.85, 0.70, 0.20, 0.60, 0.90],
          backgroundColor: 'rgba(217,119,6,.12)',
          borderColor: '#D97706',
          pointBackgroundColor: '#D97706',
          borderWidth: 2,
          pointRadius: 4
        },
        {
          label: 'Patient C — sélectionné ✓',
          data: [0.90, 0.80, 0.95, 0.70, 0.85],
          backgroundColor: 'rgba(5,150,105,.15)',
          borderColor: '#059669',
          pointBackgroundColor: '#059669',
          borderWidth: 2.5,
          pointRadius: 5
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
          min: 0,
          max: 1,
          ticks:       { stepSize: .25, font: { size: 12 }, color: '#8896A5', backdropColor: 'transparent' },
          pointLabels: { font: { size: 14, weight: '700' }, color: '#0B1F3A' },
          grid:        { color: 'rgba(0,0,0,.1)' },
          angleLines:  { color: 'rgba(0,0,0,.1)' }
        }
      }
    }
  });
}

// ══════════════════════════════════════════════════════════════
//   ANIMATIONS SVG
// ══════════════════════════════════════════════════════════════

/**
 * Slide 12 — Pipeline SNP → WGS : apparition séquentielle des étapes
 */
function animatePipeline() {
  document.querySelectorAll('#pipeFlow .pipeline-box, #pipeFlow .pipeline-arrow')
    .forEach(function(element) {
      const animationDelay = parseInt(element.dataset.delay || 0) * 130;
      setTimeout(function() { element.classList.add('shown'); }, animationDelay);
    });
}

function resetPipelineAnimation() {
  document.querySelectorAll('#pipeFlow .pipeline-box, #pipeFlow .pipeline-arrow')
    .forEach(function(element) { element.classList.remove('shown'); });
}

/**
 * Slide 20 — Diagramme ROH : apparition progressive des segments chromosomiques
 */
function animateROH() {
  const segments = document.querySelectorAll('#rohDiagram .chromosome-segment');
  segments.forEach(function(segment, index) {
    setTimeout(function() {
      segment.style.opacity    = '1';
      segment.style.transition = 'opacity .5s ease';
    }, index * 90 + 200);
  });
}

function resetROHAnimation() {
  document.querySelectorAll('#rohDiagram .chromosome-segment')
    .forEach(function(segment) {
      segment.style.opacity    = '0';
      segment.style.transition = 'none';
    });
}

// ── Démarrage ─────────────────────────────────────────────────
goToSlide(0);
