/* ==========================================================================
   ALBEDO SOLAR — interactions
   ========================================================================== */
(function () {
  'use strict';

  /* ----- Nav: scroll state ----- */
  const nav = document.querySelector('.nav');
  const onScroll = () => {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 24);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ----- Mobile drawer ----- */
  const burger = document.querySelector('.burger');
  const drawer = document.querySelector('.drawer');
  if (burger && drawer) {
    const toggle = (force) => {
      const open = force !== undefined ? force : !drawer.classList.contains('open');
      drawer.classList.toggle('open', open);
      burger.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    };
    burger.addEventListener('click', () => toggle());
    drawer.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => toggle(false)));
  }

  /* ----- Scroll reveal ----- */
  const reveals = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('in'));
  }

  /* ----- Animated counters ----- */
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const decimals = (el.dataset.count.split('.')[1] || '').length;
    const dur = 1500;
    let start = null;
    const tick = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      const val = target * easeOut(p);
      el.textContent = prefix + val.toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = prefix + target.toFixed(decimals) + suffix;
    };
    requestAnimationFrame(tick);
  };
  const counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach((el) => cio.observe(el));
  } else {
    counters.forEach((el) => { el.textContent = (el.dataset.prefix || '') + el.dataset.count + (el.dataset.suffix || ''); });
  }

  /* ----- Before / After sliders ----- */
  document.querySelectorAll('.ba').forEach((ba) => {
    const after = ba.querySelector('.after');
    const handle = ba.querySelector('.ba-handle');
    const input = ba.querySelector('input');
    if (!after || !input) return;
    const set = (v) => {
      after.style.clipPath = `inset(0 0 0 ${v}%)`;
      if (handle) handle.style.left = v + '%';
    };
    input.addEventListener('input', () => set(input.value));
    set(input.value || 50);
  });

  /* ----- Video lazy-embed ----- */
  document.querySelectorAll('[data-video]').forEach((wrap) => {
    const btn = wrap.querySelector('.play-btn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const id = wrap.dataset.video;
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
      iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      wrap.innerHTML = '';
      wrap.appendChild(iframe);
    });
  });

  /* ----- Language toggle (visual; site authored in ES) ----- */
  document.querySelectorAll('.lang button').forEach((b) => {
    b.addEventListener('click', () => {
      const group = b.parentElement;
      group.querySelectorAll('button').forEach((x) => x.classList.remove('on'));
      b.classList.add('on');
    });
  });

  /* ----- Hero parallax on aurora ----- */
  const auroras = document.querySelectorAll('.aurora');
  if (auroras.length && window.matchMedia('(min-width: 980px)').matches) {
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5);
      const y = (e.clientY / window.innerHeight - 0.5);
      auroras.forEach((a, i) => {
        const f = (i + 1) * 14;
        a.style.translate = `${x * f}px ${y * f}px`;
      });
    }, { passive: true });
  }

  /* ----- Contact form (front-end only) ----- */
  const form = document.querySelector('#contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const note = form.querySelector('.form-note');
      if (note) {
        note.textContent = '¡Gracias! Tu mensaje fue recibido. Te contactaremos muy pronto. ☀';
        note.style.display = 'block';
      }
      form.reset();
    });
  }

  /* ----- current year ----- */
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
})();
