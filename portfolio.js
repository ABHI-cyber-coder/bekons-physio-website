/* ============================================
   PORTFOLIO — Carousel + Mobile Nav
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Mobile Toggle ---- */
  const toggle = document.getElementById('mobileToggle');
  const menu   = document.getElementById('navMenu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      menu.classList.toggle('open');
    });
  }

  /* ---- Navbar scroll ---- */
  const nav = document.getElementById('navbar');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 30);
    }, { passive: true });
  }

  /* ---- Init all carousels ---- */
  document.querySelectorAll('.carousel-card').forEach(initCarousel);
});


function initCarousel(card) {
  const track    = card.querySelector('.carousel-track');
  const slides   = card.querySelectorAll('.carousel-slide');
  const dotsWrap = card.querySelector('.carousel-dots');
  const prevBtn  = card.querySelector('.carousel-prev');
  const nextBtn  = card.querySelector('.carousel-next');

  if (!track || slides.length === 0) return;

  let current = 0;
  const total = slides.length;

  /* Build dots */
  for (let i = 0; i < total; i++) {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Slide ' + (i + 1));
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  }
  const dots = dotsWrap.querySelectorAll('.carousel-dot');

  /* Go to slide */
  function goTo(index) {
    current = Math.max(0, Math.min(index, total - 1));
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
    updateArrows();
  }

  function updateArrows() {
    if (prevBtn) prevBtn.classList.toggle('hidden', current === 0);
    if (nextBtn) nextBtn.classList.toggle('hidden', current === total - 1);
  }

  /* Arrow clicks */
  if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

  /* Touch / swipe */
  let startX  = 0;
  let deltaX  = 0;
  let dragging = false;

  const viewport = card.querySelector('.carousel-viewport');

  viewport.addEventListener('touchstart', (e) => {
    startX  = e.touches[0].clientX;
    deltaX  = 0;
    dragging = true;
    track.style.transition = 'none';
  }, { passive: true });

  viewport.addEventListener('touchmove', (e) => {
    if (!dragging) return;
    deltaX = e.touches[0].clientX - startX;
    const offset = -(current * 100) + (deltaX / viewport.offsetWidth) * 100;
    track.style.transform = 'translateX(' + offset + '%)';
  }, { passive: true });

  viewport.addEventListener('touchend', () => {
    if (!dragging) return;
    dragging = false;
    track.style.transition = '';
    const threshold = viewport.offsetWidth * 0.2;
    if (deltaX < -threshold && current < total - 1) {
      goTo(current + 1);
    } else if (deltaX > threshold && current > 0) {
      goTo(current - 1);
    } else {
      goTo(current); // snap back
    }
  });

  /* Init */
  updateArrows();
}
