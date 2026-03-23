/* ============================================================
   NAVIGATION.JS — Gestion des slides, clavier, swipe, progress
   ============================================================ */

// Nombre total de slides
const TOTAL = 25;

// Index de section pour chaque slide (pour les pills de nav)
// Index : 0=Accueil 1=Angle mort 2=Singularité 3=Design 4=Algorithme 5=WGS
const PILL_MAP = [0, 0, 1, 1, 1, 1, 1, 1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5];

// Éléments DOM
const deck   = document.getElementById('deck');
const ctr    = document.getElementById('ctr');
const pf     = document.getElementById('pf');
const bp     = document.getElementById('bp');
const bn     = document.getElementById('bn');
const slides = document.querySelectorAll('.slide');
const pills  = document.querySelectorAll('.sec-pill');

// Slide courant
let current = 0;

/**
 * Navigue vers la slide n.
 * Déclenche aussi les animations spécifiques à certaines slides.
 */
function go(n) {
  n = Math.max(0, Math.min(TOTAL - 1, n));

  slides[current].classList.remove('on');
  current = n;
  slides[current].classList.add('on');

  deck.style.transform = `translateX(-${current * 100}vw)`;
  ctr.textContent      = `${current + 1} / ${TOTAL}`;
  pf.style.width       = `${((current + 1) / TOTAL) * 100}%`;

  bp.disabled = current === 0;
  bn.disabled = current === TOTAL - 1;

  pills.forEach((p, i) => p.classList.toggle('on', i === (PILL_MAP[current] || 0)));

  // Déclenchement des animations par slide
  if (current === 3)  { setTimeout(initDonut,    200); }
  if (current === 11) { resetPipeline(); setTimeout(animPipeline, 200); }
  if (current === 16) { setTimeout(initScore,    200); }
  if (current === 19) { resetROH(); setTimeout(animROH, 300); }
  if (current === 20) { setTimeout(initRadar,    200); }
}

// ── Navigation clavier ──────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') go(current + 1);
  if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   go(current - 1);
});

// ── Navigation swipe mobile ─────────────────────────────────
let touchStartX = 0;
document.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
});
document.addEventListener('touchend', e => {
  const delta = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(delta) > 50) go(delta < 0 ? current + 1 : current - 1);
});

// ── Init ────────────────────────────────────────────────────
go(0);
