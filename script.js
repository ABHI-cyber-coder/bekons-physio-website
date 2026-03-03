/* ===================================================
   BEKONS PHYSIOTHERAPY — FUTURISTIC GLASSMORPHISM JS
   Micro-interactions · Parallax · Glow Effects
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------
     1. STICKY NAV with transition
     -------------------------------------------------- */
  const nav = document.getElementById('navbar');
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* --------------------------------------------------
     2. MOBILE MENU
     -------------------------------------------------- */
  const toggle = document.getElementById('mobileToggle');
  const menu = document.getElementById('navMenu');

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      menu.classList.toggle('open');
    });

    menu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('open');
        menu.classList.remove('open');
      });
    });
  }

  /* --------------------------------------------------
     3. ACTIVE NAV ON SCROLL
     -------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const updateActive = () => {
    const y = window.scrollY + 120;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const h = sec.offsetHeight;
      const id = sec.id;
      if (y >= top && y < top + h) {
        navLinks.forEach(l => {
          l.classList.toggle('active',
            l.dataset.section === id || l.getAttribute('href') === '#' + id
          );
        });
      }
    });
  };
  window.addEventListener('scroll', updateActive, { passive: true });

  /* --------------------------------------------------
     4. SMOOTH SCROLL
     -------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) {
        e.preventDefault();
        t.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* --------------------------------------------------
     5. INTERSECTION OBSERVER — FADE IN
     -------------------------------------------------- */
  const animEls = document.querySelectorAll('.anim-in');

  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseFloat(entry.target.dataset.delay) || 0;
          entry.target.style.transitionDelay = delay + 's';
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    animEls.forEach(el => obs.observe(el));
  } else {
    animEls.forEach(el => el.classList.add('visible'));
  }

  /* --------------------------------------------------
     6. PARALLAX DEPTH ON MOUSE (Desktop)
     -------------------------------------------------- */
  const depthEls = document.querySelectorAll('[data-depth]');
  const orbs = document.querySelectorAll('.ambient-orb');
  const isDesktop = window.matchMedia('(min-width: 1024px)').matches;

  if (isDesktop) {
    let mx = 0, my = 0, tx = 0, ty = 0;
    const lerp = (a, b, n) => a + (b - a) * n;

    window.addEventListener('mousemove', e => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    const animate = () => {
      tx = lerp(tx, mx, 0.06);
      ty = lerp(ty, my, 0.06);

      depthEls.forEach(el => {
        const d = parseFloat(el.dataset.depth) || 0.2;
        el.style.transform = `translate(${tx * d * 22}px, ${ty * d * 16}px)`;
      });

      orbs.forEach((orb, i) => {
        const s = (i + 1) * 5;
        orb.style.transform = `translate(${tx * s}px, ${ty * s}px)`;
      });

      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }

  /* --------------------------------------------------
     7. CARD TILT ON HOVER (Desktop / Tablet)
     -------------------------------------------------- */
  if (window.matchMedia('(min-width: 768px)').matches) {
    document.querySelectorAll('[data-tilt]').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform =
          `perspective(600px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateY(-5px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform .5s cubic-bezier(.16,1,.3,1)';
        setTimeout(() => { card.style.transition = ''; }, 500);
      });
    });
  }

  /* --------------------------------------------------
     8. LED STRIP LIGHT FOLLOW (Desktop)
     -------------------------------------------------- */
  const ledTop = document.querySelector('.led-top');
  if (ledTop && isDesktop) {
    window.addEventListener('mousemove', e => {
      const pct = (e.clientX / window.innerWidth) * 100;
      ledTop.style.background =
        `linear-gradient(90deg, transparent ${pct - 40}%, #22d3ee ${pct - 8}%, #60a5fa ${pct}%, #a78bfa ${pct + 4}%, #22d3ee ${pct + 8}%, transparent ${pct + 40}%)`;
    }, { passive: true });
  }

  /* --------------------------------------------------
     9. REVIEW CAROUSEL
     -------------------------------------------------- */
  const slider = document.getElementById('reviewSlider');
  if (slider) {
    const track = slider.querySelector('.review-track');
    const cards = track.querySelectorAll('.review-card');
    const dotsWrap = document.getElementById('reviewDots');
    const prevBtn = document.getElementById('reviewPrev');
    const nextBtn = document.getElementById('reviewNext');
    const total = cards.length;
    let current = 0;
    let autoTimer = null;

    // Determine how many cards are visible based on viewport
    const getVisible = () => {
      if (window.innerWidth >= 1024) return 3;
      if (window.innerWidth >= 640) return 2;
      return 1;
    };

    let visible = getVisible();

    // Build dot indicators
    const buildDots = () => {
      dotsWrap.innerHTML = '';
      const count = total - visible + 1;
      for (let i = 0; i < count; i++) {
        const dot = document.createElement('button');
        dot.className = 'review-dot' + (i === current ? ' active' : '');
        dot.setAttribute('aria-label', 'Go to review ' + (i + 1));
        dot.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(dot);
      }
    };

    const updateDots = () => {
      dotsWrap.querySelectorAll('.review-dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    };

    const goTo = (index) => {
      const maxIndex = total - visible;
      current = Math.max(0, Math.min(index, maxIndex));
      const pct = (current / total) * 100;
      track.style.transform = 'translateX(-' + pct + '%)';
      updateDots();
    };

    const goNext = () => goTo(current + 1 >= total - visible + 1 ? 0 : current + 1);
    const goPrev = () => goTo(current - 1 < 0 ? total - visible : current - 1);

    prevBtn.addEventListener('click', () => { goPrev(); resetAuto(); });
    nextBtn.addEventListener('click', () => { goNext(); resetAuto(); });

    // Auto-play
    const startAuto = () => { autoTimer = setInterval(goNext, 4500); };
    const stopAuto = () => { clearInterval(autoTimer); };
    const resetAuto = () => { stopAuto(); startAuto(); };

    slider.addEventListener('mouseenter', stopAuto);
    slider.addEventListener('mouseleave', startAuto);

    // Touch / swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    slider.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    slider.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) goNext(); else goPrev();
        resetAuto();
      }
    }, { passive: true });

    // Handle resize
    window.addEventListener('resize', () => {
      const newVisible = getVisible();
      if (newVisible !== visible) {
        visible = newVisible;
        if (current > total - visible) current = total - visible;
        goTo(current);
        buildDots();
      }
    });

    // Init
    buildDots();
    startAuto();
  }

  /* --------------------------------------------------
     10. GLASS PANEL HOVER GLOW TRACKING
     -------------------------------------------------- */
  if (isDesktop) {
    document.querySelectorAll('.service-tile, .value-tile, .contact-tile, .sidebar-card').forEach(panel => {
      const glowEl = document.createElement('div');
      glowEl.style.cssText = `
        position:absolute;width:180px;height:180px;border-radius:50%;
        background:radial-gradient(circle,rgba(34,211,238,.12),transparent 70%);
        pointer-events:none;opacity:0;transition:opacity .4s;z-index:0;
        transform:translate(-50%,-50%);
      `;
      panel.style.position = 'relative';
      panel.appendChild(glowEl);

      panel.addEventListener('mousemove', e => {
        const rect = panel.getBoundingClientRect();
        glowEl.style.left = (e.clientX - rect.left) + 'px';
        glowEl.style.top = (e.clientY - rect.top) + 'px';
        glowEl.style.opacity = '1';
      });

      panel.addEventListener('mouseleave', () => {
        glowEl.style.opacity = '0';
      });
    });
  }
});
