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
     9. GLASS PANEL HOVER GLOW TRACKING
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
