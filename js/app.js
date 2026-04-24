/* ============================================================
   APP.JS — Présentation Génome Réunion
   Navigation, graphiques Chart.js, animations SVG
   ============================================================ */

// ── Constantes de navigation ─────────────────────────────────

// ── Éléments DOM ─────────────────────────────────────────────

const slideDeck        = document.getElementById('deck');
const slideCounter     = document.getElementById('ctr');
const progressBar      = document.getElementById('pf');
const buttonPrevious   = document.getElementById('bp');
const buttonNext       = document.getElementById('bn');
const allSlides        = document.querySelectorAll('.slide');
const navPills         = document.querySelectorAll('.sec-pill');
const slideJumpTargets = document.querySelectorAll('.js-slide-jump');

// ── Constantes dérivées du DOM ────────────────────────────────

// Nombre de slides lu depuis le HTML — plus besoin de mettre à jour manuellement.
const TOTAL_SLIDES = allSlides.length;

// Construit le tableau de section depuis les attributs data-section du HTML.
// 0=Accueil 1=Angle mort 2=Singularité 3=Design 4=Algorithme 5=WGS
const SECTION_MAP = Array.from(allSlides).map(function(slide) {
  return parseInt(slide.dataset.section, 10) || 0;
});

// ── État ──────────────────────────────────────────────────────

let currentSlide = 0;
let presenterWindow = null;
let isSlavePresenter = window.parent !== window; // true si dans un iframe

// ── Instances Chart.js (null = pas encore initialisé) ─────────

let scoreChartInstance = null;
let radarChartInstance = null;

// ── Accessibilité du deck ────────────────────────────────────

/**
 * Retourne le meilleur titre/focus-target de la slide :
 * hero, titre standard ou titre d'introduction de section.
 */
function getSlideTitleElement(slide) {
  return slide.querySelector('.hero-title, .slide-title, .section-title');
}

/**
 * Prépare la structure accessible du deck :
 * - chaque slide reçoit un rôle et un lien explicite vers son titre
 * - les cibles cliquables non natives deviennent accessibles au clavier
 */
function setupDeckAccessibility() {
  allSlides.forEach(function(slide, index) {
    var title = getSlideTitleElement(slide);

    slide.id = slide.id || `slide-${index + 1}`;
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');

    if (title) {
      title.id = title.id || `slide-title-${index + 1}`;
      title.setAttribute('tabindex', '-1');
      slide.setAttribute('aria-labelledby', title.id);
    } else {
      slide.setAttribute('aria-label', `Slide ${index + 1} sur ${TOTAL_SLIDES}`);
    }
  });

  slideJumpTargets.forEach(function(target) {
    var isNativeControl = target.matches('button, a[href]');
    if (!isNativeControl) {
      target.setAttribute('role', 'button');
      target.setAttribute('tabindex', '0');
    }
  });
}

/**
 * Les slides inactives restent nécessaires au layout horizontal du deck,
 * mais doivent être masquées sémantiquement et retirées du focus clavier.
 */
function updateSlideAccessibility() {
  allSlides.forEach(function(slide, index) {
    var isActive = index === currentSlide;

    slide.setAttribute('aria-hidden', String(!isActive));

    if (isActive) {
      slide.removeAttribute('inert');
    } else {
      slide.setAttribute('inert', '');
    }

    if ('inert' in slide) {
      slide.inert = !isActive;
    }
  });
}

/**
 * Déplace le focus vers le titre de la slide active après navigation.
 * Cela aide les lecteurs d'écran et les utilisateurs clavier à se repérer.
 */
function focusCurrentSlideTitle() {
  var activeSlide = allSlides[currentSlide];
  var focusTarget = getSlideTitleElement(activeSlide);

  if (!focusTarget) return;

  focusTarget.focus({ preventScroll: true });
}

// ══════════════════════════════════════════════════════════════
//   NAVIGATION
// ══════════════════════════════════════════════════════════════

/**
 * Navigue vers la slide numéro targetIndex.
 * Met à jour le deck, le compteur, la barre de progression,
 * les boutons et les pills de navigation.
 * Déclenche les animations propres à certaines slides.
 */
function goToSlide(targetIndex, options) {
  options = options || {};
  targetIndex = Math.max(0, Math.min(TOTAL_SLIDES - 1, targetIndex));

  allSlides[currentSlide].classList.remove('on');
  currentSlide = targetIndex;
  allSlides[currentSlide].classList.add('on');

  var innerEl = allSlides[currentSlide].querySelector('.inner');
  if (innerEl) innerEl.scrollTop = 0;

  slideDeck.style.transform = `translateX(-${currentSlide * 100}vw)`;
  slideCounter.textContent  = `${currentSlide + 1} / ${TOTAL_SLIDES}`;
  progressBar.style.width   = `${((currentSlide + 1) / TOTAL_SLIDES) * 100}%`;

  buttonPrevious.disabled = currentSlide === 0;
  buttonNext.disabled     = currentSlide === TOTAL_SLIDES - 1;

  navPills.forEach(function(pill, index) {
    var isActive = index === (SECTION_MAP[currentSlide] || 0);
    pill.classList.toggle('on', isActive);
    // aria-current indique la section active aux lecteurs d'écran.
    if (isActive) {
      pill.setAttribute('aria-current', 'true');
    } else {
      pill.removeAttribute('aria-current');
    }
  });

  updateSlideAccessibility();

  // Animations déclenchées à l'arrivée sur certaines slides.
  // La slide active est identifiée via data-animate (plus d'indices hardcodés).
  var animate = allSlides[currentSlide].dataset.animate;
  if (animate === 'pipeline')  { resetPipelineAnimation(); setTimeout(animatePipeline, 200); }
  if (animate === 'archflow')  { initArchFlowCarousel(); }
  if (animate === 'score')     { setTimeout(initScoreChart,  200); }
  if (animate === 'roh')       { resetROHAnimation(); setTimeout(animateROH, 300); }
  if (animate === 'radar')     { setTimeout(initRadarChart,  200); }

  if (!options.skipFocus) {
    focusCurrentSlideTitle();
  }

  // Envoyer un message à la fenêtre presenter si elle est ouverte (sauf si on est en mode slave)
  // NB: L'iframe (slave mode) ne doit PAS broadcaster pour éviter une boucle infinie
  if (!isSlavePresenter && presenterWindow && !presenterWindow.closed) {
    presenterWindow.postMessage({ type: 'SLIDE_CHANGE', slideIndex: currentSlide }, '*');
  }
}

// Exposé globalement pour compatibilité avec d'éventuels appels externes.
window.go = goToSlide;

// ── Navigation par boutons et cibles data-target-slide ───────

// Les event listeners des boutons sont redéfinis dans la section MODE ADAPTATIF

slideJumpTargets.forEach(function(target) {
  target.addEventListener('click', function() {
    const targetIndex = Number.parseInt(target.dataset.targetSlide, 10);
    if (!Number.isNaN(targetIndex)) {
      goToSlide(targetIndex);
    }
  });

  target.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();

      const targetIndex = Number.parseInt(target.dataset.targetSlide, 10);
      if (!Number.isNaN(targetIndex)) {
        goToSlide(targetIndex);
      }
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
 * Slide 23 — Barres horizontales : poids de chaque composante du score S_div
 * Formule v3.8 : PCA 30% · ADMIX 30% · IBD 25% · ROH 15%
 */
function initScoreChart() {
  if (typeof Chart === 'undefined') { console.warn('[app.js] Chart.js non chargé — initScoreChart annulé.'); return; }
  const canvas = document.getElementById('scoreBarChart');
  if (!canvas || scoreChartInstance) return;

  const componentDescriptions = [
    'Distance au centroïde du secteur dans l\'espace PCA global',
    'Entropie de Shannon des proportions ancestrales q_k',
    'Indépendance génétique (1 − max IBD intra-secteur)',
    'Effet fondateur / consanguinité (1 − ROH_total / 100 Mb)'
  ];

  scoreChartInstance = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: ['PCA_score', 'ADMIX_score', 'IBD_score', 'ROH_score'],
      datasets: [{
        label: 'Poids (%)',
        data: [30, 30, 25, 15],
        backgroundColor: ['#0D7377', '#7C3AED', '#EA580C', '#D97706'],
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
 * Slide 26 — Radar : comparaison des 3 profils candidats
 * 4 axes : PCA_score · ADMIX_score · IBD_score · ROH_score
 * Scores cohérents avec la formule S_div v3.8 (0.30/0.30/0.25/0.15)
 */
function initRadarChart() {
  if (typeof Chart === 'undefined') { console.warn('[app.js] Chart.js non chargé — initRadarChart annulé.'); return; }
  const canvas = document.getElementById('radarChart');
  if (!canvas || radarChartInstance) return;

  radarChartInstance = new Chart(canvas, {
    type: 'radar',
    data: {
      labels: ['PCA_score', 'ADMIX_score', 'IBD_score', 'ROH_score'],
      datasets: [
        {
          // S_div = 0.30×0.20 + 0.30×0.15 + 0.25×0.80 + 0.15×0.55 = 0.38
          label: 'Patient A — profil médian',
          data: [0.20, 0.15, 0.80, 0.55],
          backgroundColor: 'rgba(107,114,128,.12)',
          borderColor: '#9CA3AF',
          pointBackgroundColor: '#9CA3AF',
          borderWidth: 2,
          pointRadius: 4
        },
        {
          // S_div = 0.30×0.80 + 0.30×0.70 + 0.25×0.20 + 0.15×0.60 = 0.59
          label: 'Patient B — extrême, apparenté',
          data: [0.80, 0.70, 0.20, 0.60],
          backgroundColor: 'rgba(217,119,6,.12)',
          borderColor: '#D97706',
          pointBackgroundColor: '#D97706',
          borderWidth: 2,
          pointRadius: 4
        },
        {
          // S_div = 0.30×0.90 + 0.30×0.80 + 0.25×0.88 + 0.15×0.80 = 0.84
          label: 'Patient C — sélectionné ✓',
          data: [0.90, 0.80, 0.88, 0.80],
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
// ── Carousel arch-flow (slide 19 mobile) ──────────────────────
// Actif uniquement sous 600px — desktop reste inchangé.
var _archFlowCarouselInit = false;

function initArchFlowCarousel() {
  if (window.innerWidth > 600) return;

  var items = document.querySelectorAll('#archFlow .arch-flow-item');
  var dots  = document.querySelectorAll('.arch-flow-carousel-dot');
  var btnPrev = document.getElementById('archFlowPrev');
  var btnNext = document.getElementById('archFlowNext');
  if (!items.length) return;

  var step = 0;

  function showStep(n) {
    items.forEach(function(item, i) {
      item.classList.remove('arch-flow-active', 'arch-flow-prev');
      if (i === n) item.classList.add('arch-flow-active');
      else if (i < n) item.classList.add('arch-flow-prev');
    });
    dots.forEach(function(dot, i) { dot.classList.toggle('active', i === n); });
    step = n;
  }

  showStep(0);

  if (_archFlowCarouselInit) return;
  _archFlowCarouselInit = true;

  if (btnPrev) btnPrev.addEventListener('click', function() { if (step > 0) showStep(step - 1); });
  if (btnNext) btnNext.addEventListener('click', function() { if (step < items.length - 1) showStep(step + 1); });
  dots.forEach(function(dot) {
    dot.addEventListener('click', function() { showStep(parseInt(dot.dataset.step, 10)); });
  });

  window.addEventListener('resize', function() {
    if (window.innerWidth > 600) {
      items.forEach(function(item) { item.classList.remove('arch-flow-active', 'arch-flow-prev'); });
    } else {
      showStep(step);
    }
  });
}

function animatePipeline() {
  const pipeFlow = document.getElementById('pipeFlow');
  if (!pipeFlow) { console.warn('[app.js] #pipeFlow introuvable — animatePipeline annulé.'); return; }
  pipeFlow.querySelectorAll('.pipeline-box, .pipeline-arrow')
    .forEach(function(element) {
      const animationDelay = parseInt(element.dataset.delay || 0) * 130;
      setTimeout(function() { element.classList.add('shown'); }, animationDelay);
    });
}

function resetPipelineAnimation() {
  const pipeFlow = document.getElementById('pipeFlow');
  if (!pipeFlow) return;
  pipeFlow.querySelectorAll('.pipeline-box, .pipeline-arrow')
    .forEach(function(element) { element.classList.remove('shown'); });
}

/**
 * Slide 20 — Diagramme ROH : apparition progressive des segments chromosomiques.
 * La classe .roh-visible (définie dans main.css) gère opacity et transition.
 */
function animateROH() {
  const segments = document.querySelectorAll('#rohDiagram .chromosome-segment');
  segments.forEach(function(segment, index) {
    setTimeout(function() {
      segment.classList.add('roh-visible');
    }, index * 90 + 200);
  });
}

function resetROHAnimation() {
  document.querySelectorAll('#rohDiagram .chromosome-segment')
    .forEach(function(segment) {
      segment.classList.remove('roh-visible');
    });
}

// ══════════════════════════════════════════════════════════════
//   MODE PRÉSENTATION (DEUX ÉCRANS)
// ══════════════════════════════════════════════════════════════

/**
 * Ouvre la fenêtre presenter.html dans une nouvelle fenêtre
 * et synchronise la navigation via postMessage
 */
function openPresenterMode() {
  // Ouvrir presenter.html dans une nouvelle fenêtre
  // Dimensions : 1400×900 (ou dimension de l'écran disponible)
  const width = Math.min(1400, window.screen.availWidth - 50);
  const height = Math.min(900, window.screen.availHeight - 50);
  const left = window.screen.availWidth - width - 10;
  const top = 10;

  presenterWindow = window.open(
    'presenter.html',
    'GenomeReunion_Presenter',
    'width=' + width + ',height=' + height + ',left=' + left + ',top=' + top +
    ',toolbar=0,menubar=0,location=0,scrollbars=1'
  );

  if (!presenterWindow) {
    alert('Impossible d\'ouvrir la fenêtre presenter. Vérifiez que les pop-ups ne sont pas bloqués.');
    return;
  }

  // Envoyer la slide actuelle à presenter au démarrage
  setTimeout(function() {
    if (presenterWindow && !presenterWindow.closed) {
      presenterWindow.postMessage({ type: 'SLIDE_CHANGE', slideIndex: currentSlide }, '*');
    }
  }, 500);
}

// Événement du bouton presenter
var presenterBtn = document.getElementById('presenter-btn');
if (presenterBtn) {
  presenterBtn.addEventListener('click', openPresenterMode);
}

// ── Burger menu (< 900px) ────────────────────────────────────
var burgerBtn  = document.getElementById('burger-btn');
var navCenter  = document.getElementById('nav-center');

if (burgerBtn && navCenter) {
  burgerBtn.addEventListener('click', function() {
    var isOpen = navCenter.classList.toggle('open');
    burgerBtn.classList.toggle('open', isOpen);
    burgerBtn.setAttribute('aria-expanded', String(isOpen));
  });

  // Fermer le menu quand on clique sur une pill
  navPills.forEach(function(pill) {
    pill.addEventListener('click', function() {
      navCenter.classList.remove('open');
      burgerBtn.classList.remove('open');
      burgerBtn.setAttribute('aria-expanded', 'false');
    });
  });

  // Fermer si clic en dehors du menu
  document.addEventListener('click', function(e) {
    if (!navCenter.contains(e.target) && e.target !== burgerBtn && !burgerBtn.contains(e.target)) {
      navCenter.classList.remove('open');
      burgerBtn.classList.remove('open');
      burgerBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

// ── Logo cliquable → slide 0 ─────────────────────────────────
var navLogo = document.getElementById('nav-logo');
if (navLogo) {
  navLogo.addEventListener('click', function() { goToSlide(0); });
}

// Écouter les messages depuis presenter.html (pour l'iframe slave et requêtes presenter)
window.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'IFRAME_SYNC') {
    // Naviguer vers la slide sans broadcaster (on est en slave mode)
    goToSlide(event.data.slideIndex, { skipFocus: true });
  }

  if (event.data && event.data.type === 'GET_CURRENT_SLIDE') {
    // Presenter.html demande quelle slide on regarde — répondre avec l'index actuel
    if (event.source) {
      event.source.postMessage({
        type: 'CURRENT_SLIDE_INDEX',
        slideIndex: currentSlide,
        visibleIndex: getVisibleIndexFromRealIndex(currentSlide),
        totalVisible: getVisibleSlideCount()
      }, '*');
    }
  }

  if (event.data && event.data.type === 'NAV_COMMAND') {
    // Commande de navigation depuis presenter.html — simuler clic bouton
    if (event.data.direction === 'next') buttonNext.click();
    else if (event.data.direction === 'prev') buttonPrevious.click();
  }
});

// ══════════════════════════════════════════════════════════════
//   MODE ADAPTATIF — S04 (EXPERT / RÉSUMÉ)
// ══════════════════════════════════════════════════════════════

let s04ExpertMode = true; // true = detailed slides, false = summary only

// Indices des slides S04 — ordre DOM après repositionnement des résumés
const S04_INTRO_SLIDE    = 17;
const S04_SUMMARY_START  = 18;
const S04_SUMMARY_END    = 19;
const S04_DETAILED_START = 20;
const S04_DETAILED_END   = 31;
const S05_INTRO_SLIDE    = 32;

// Applique display:none sur les slides cachés, retire-le sur les visibles.
// Indispensable pour que visibleIdx × 100vw corresponde à la position flex réelle.
function updateSlideVisibility() {
  allSlides.forEach(function(slide, index) {
    var hidden;
    if (s04ExpertMode) {
      hidden = index >= S04_SUMMARY_START && index <= S04_SUMMARY_END;
    } else {
      hidden = index >= S04_DETAILED_START && index <= S04_DETAILED_END;
    }
    slide.style.display = hidden ? 'none' : '';
  });
}

// Retourne les indices des slides affichés dans l'ordre courant
function getVisibleSlides() {
  var visible = [];
  allSlides.forEach(function(slide, index) {
    if (slide.style.display !== 'none') visible.push(index);
  });
  return visible;
}

// Retourne le nombre total de slides visibles
function getVisibleSlideCount() {
  return getVisibleSlides().length;
}

// Retourne l'index réel (DOM) d'après le numéro visible
function getRealIndexFromVisibleIndex(visibleIndex) {
  var visible = getVisibleSlides();
  if (visibleIndex >= 0 && visibleIndex < visible.length) {
    return visible[visibleIndex];
  }
  return 0;
}

// Retourne le numéro visible d'après l'index réel
function getVisibleIndexFromRealIndex(realIndex) {
  var visible = getVisibleSlides();
  return visible.indexOf(realIndex);
}

// Cherche le prochain slide visible à partir de targetIndex
function getNextVisibleSlide(targetIndex) {
  var visible = getVisibleSlides();
  for (var i = 0; i < visible.length; i++) {
    if (visible[i] >= targetIndex) {
      return visible[i];
    }
  }
  return visible[visible.length - 1];
}

// Cherche le slide visible précédent à partir de targetIndex
function getPrevVisibleSlide(targetIndex) {
  var visible = getVisibleSlides();
  for (var i = visible.length - 1; i >= 0; i--) {
    if (visible[i] <= targetIndex) {
      return visible[i];
    }
  }
  return visible[0];
}

// Sauvegarde la fonction goToSlide originale
const originalGoToSlide = goToSlide;

// Fonction goToSlide modifiée pour gérer les slides masqués
function goToSlide(targetIndex, options) {
  options = options || {};

  // Déterminer la direction (forward/backward) pour naviguer correctement
  var clampedTarget = Math.max(0, Math.min(TOTAL_SLIDES - 1, targetIndex));
  var realIndex;

  if (clampedTarget > currentSlide) {
    // Navigation forward: chercher le prochain visible >= target
    realIndex = getNextVisibleSlide(clampedTarget);
  } else if (clampedTarget < currentSlide) {
    // Navigation backward: chercher le précédent visible <= target
    realIndex = getPrevVisibleSlide(clampedTarget);
  } else {
    // Même slide, ne rien faire
    realIndex = currentSlide;
  }

  allSlides[currentSlide].classList.remove('on');
  currentSlide = realIndex;
  allSlides[currentSlide].classList.add('on');

  var innerEl = allSlides[currentSlide].querySelector('.inner');
  if (innerEl) innerEl.scrollTop = 0;

  var visibleIdx = getVisibleIndexFromRealIndex(currentSlide);
  slideDeck.style.transform = `translateX(-${visibleIdx * 100}vw)`;

  // Compter les slides visibles
  var visibleCount = getVisibleSlideCount();
  var visibleIndex = getVisibleIndexFromRealIndex(currentSlide) + 1; // +1 pour affichage

  slideCounter.textContent  = `${visibleIndex} / ${visibleCount}`;
  progressBar.style.width   = `${((visibleIndex) / visibleCount) * 100}%`;

  // Mettre à jour les boutons
  var visibleSlides = getVisibleSlides();
  var currentVisiblePos = getVisibleIndexFromRealIndex(currentSlide);
  buttonPrevious.disabled = currentVisiblePos === 0;
  buttonNext.disabled     = currentVisiblePos === visibleSlides.length - 1;

  navPills.forEach(function(pill, index) {
    var isActive = index === (SECTION_MAP[currentSlide] || 0);
    pill.classList.toggle('on', isActive);
    if (isActive) {
      pill.setAttribute('aria-current', 'true');
    } else {
      pill.removeAttribute('aria-current');
    }
  });

  updateSlideAccessibility();

  // Animations
  var animate = allSlides[currentSlide].dataset.animate;
  if (animate === 'pipeline')  { resetPipelineAnimation(); setTimeout(animatePipeline, 200); }
  if (animate === 'archflow')  { initArchFlowCarousel(); }
  if (animate === 'score')     { setTimeout(initScoreChart,  200); }
  if (animate === 'roh')       { resetROHAnimation(); setTimeout(animateROH, 300); }
  if (animate === 'radar')     { setTimeout(initRadarChart,  200); }

  if (!options.skipFocus) {
    focusCurrentSlideTitle();
  }

  // Envoyer à presenter si ouvert
  if (!isSlavePresenter && presenterWindow && !presenterWindow.closed) {
    presenterWindow.postMessage({
      type: 'SLIDE_CHANGE',
      slideIndex: currentSlide,
      visibleIndex: getVisibleIndexFromRealIndex(currentSlide),
      totalVisible: getVisibleSlideCount()
    }, '*');
  }
}

// Gère la navigation avec les boutons (pour sauter les slides masqués)
buttonPrevious.addEventListener('click', function() {
  var visible = getVisibleSlides();
  var currentPos = getVisibleIndexFromRealIndex(currentSlide);
  if (currentPos > 0) {
    goToSlide(visible[currentPos - 1]);
  }
});

buttonNext.addEventListener('click', function() {
  var visible = getVisibleSlides();
  var currentPos = getVisibleIndexFromRealIndex(currentSlide);
  if (currentPos < visible.length - 1) {
    goToSlide(visible[currentPos + 1]);
  }
});

// Toggle S04 mode
var s04ToggleBtn = document.getElementById('s04-toggle-btn');
if (s04ToggleBtn) {
  s04ToggleBtn.addEventListener('click', function() {
    s04ExpertMode = !s04ExpertMode;

    s04ToggleBtn.textContent = s04ExpertMode ? 'Expert' : 'Résumé';
    s04ToggleBtn.setAttribute('aria-pressed', String(s04ExpertMode));
    s04ToggleBtn.classList.toggle('is-resume', !s04ExpertMode);

    updateSlideVisibility();

    // Si la slide actuelle est maintenant cachée, reculer jusqu'à la dernière visible
    var vis = getVisibleSlides();
    var target = currentSlide;
    if (vis.indexOf(target) === -1) {
      for (var j = target - 1; j >= 0; j--) {
        if (vis.indexOf(j) !== -1) { target = j; break; }
      }
    }
    goToSlide(target);
  });
}

// ── Démarrage ─────────────────────────────────────────────────
console.assert(allSlides.length > 0, '[app.js] Aucune .slide trouvée — vérifier le HTML.');
setupDeckAccessibility();
updateSlideVisibility();
goToSlide(0, { skipFocus: true });
