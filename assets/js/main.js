/* ==========================================================================
   ALBEDO SOLAR — interactions + bilingual engine (ES default / EN via data-en)
   ========================================================================== */
(function () {
  'use strict';

  /* ======================================================================
     i18n  —  Spanish is the rendered default. English lives in data-en*.
     - [data-en]      : swap textContent (or content= on <meta>, text on <title>)
     - [data-en-ph]   : swap placeholder
     - [data-en-alt]  : swap alt
     - [data-en-aria] : swap aria-label
     ICU note: Latin American Spanish only.
     ====================================================================== */
  const LANG_KEY = 'albedo-lang';
  const SUPPORTED = ['es', 'en'];

  const getInitialLang = () => {
    const url = new URLSearchParams(location.search).get('lang');
    if (url && SUPPORTED.includes(url)) return url;
    const saved = localStorage.getItem(LANG_KEY);
    if (saved && SUPPORTED.includes(saved)) return saved;
    return 'es';
  };

  // Capture the original (Spanish) value once so we can toggle back.
  const cacheEs = (el, prop) => {
    const key = 'es' + prop;
    if (el.dataset[key] === undefined) {
      if (prop === 'Text') {
        if (el.tagName === 'META') el.dataset[key] = el.getAttribute('content');
        else if (el.tagName === 'TITLE') el.dataset[key] = el.textContent;
        else el.dataset[key] = el.innerHTML;
      }
      else if (prop === 'Ph') el.dataset[key] = el.getAttribute('placeholder') || '';
      else if (prop === 'Alt') el.dataset[key] = el.getAttribute('alt') || '';
      else if (prop === 'Aria') el.dataset[key] = el.getAttribute('aria-label') || '';
    }
    return el.dataset[key];
  };

  const applyLang = (lang) => {
    const en = lang === 'en';
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-en]').forEach((el) => {
      const es = cacheEs(el, 'Text');
      const val = en ? el.dataset.en : es;
      if (el.tagName === 'META') el.setAttribute('content', val);
      else if (el.tagName === 'TITLE') { el.textContent = val; document.title = val; }
      else el.innerHTML = val;
    });
    document.querySelectorAll('[data-en-ph]').forEach((el) => {
      const es = cacheEs(el, 'Ph');
      el.setAttribute('placeholder', en ? el.dataset.enPh : es);
    });
    document.querySelectorAll('[data-en-alt]').forEach((el) => {
      const es = cacheEs(el, 'Alt');
      el.setAttribute('alt', en ? el.dataset.enAlt : es);
    });
    document.querySelectorAll('[data-en-aria]').forEach((el) => {
      const es = cacheEs(el, 'Aria');
      el.setAttribute('aria-label', en ? el.dataset.enAria : es);
    });

    document.querySelectorAll('.lang button').forEach((b) => {
      b.classList.toggle('on', b.dataset.lang === lang);
    });
    localStorage.setItem(LANG_KEY, lang);
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
  };

  applyLang(getInitialLang());

  document.querySelectorAll('.lang button').forEach((b) => {
    b.addEventListener('click', () => applyLang(b.dataset.lang));
  });

  const t = (es, en) => (document.documentElement.lang === 'en' ? en : es);

  /* ----- Nav: scroll state ----- */
  const nav = document.querySelector('.nav');
  const onScroll = () => { if (nav) nav.classList.toggle('scrolled', window.scrollY > 24); };
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
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('in'));
  }

  /* ----- Animated counters (wired so live data only needs the data-count attr) ----- */
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const decimals = (String(el.dataset.count).split('.')[1] || '').length;
    const dur = 1500;
    let start = null;
    const tick = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      el.textContent = prefix + (target * easeOut(p)).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = prefix + target.toFixed(decimals) + suffix;
    };
    requestAnimationFrame(tick);
  };
  const counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); } });
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
    const set = (v) => { after.style.clipPath = `inset(0 0 0 ${v}%)`; if (handle) handle.style.left = v + '%'; };
    input.addEventListener('input', () => set(input.value));
    set(input.value || 50);
  });

  /* ----- Video lazy-embed (thumbnail loads the iframe on click) ----- */
  document.querySelectorAll('[data-video]').forEach((wrap) => {
    const btn = wrap.querySelector('.play-btn');
    const id = wrap.dataset.video;
    if (!btn || !id) return;
    btn.addEventListener('click', () => {
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
      iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.loading = 'lazy';
      wrap.innerHTML = '';
      wrap.appendChild(iframe);
    });
  });

  /* ----- Hero parallax on aurora ----- */
  const auroras = document.querySelectorAll('.aurora');
  if (auroras.length && window.matchMedia('(min-width: 980px)').matches) {
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5);
      const y = (e.clientY / window.innerHeight - 0.5);
      auroras.forEach((a, i) => { const f = (i + 1) * 14; a.style.translate = `${x * f}px ${y * f}px`; });
    }, { passive: true });
  }

  /* ----- Savings estimator ----------------------------------------------
     Transparent, conservative model. Assumptions flagged [CONFIRM] with Alex:
       savings rate 90%, payback 3–4 yrs (no financing), 25-yr horizon.
     -------------------------------------------------------------------- */
  const SAVINGS_RATE = 0.90;     // [CONFIRM]
  const YEARS = 25;              // system life
  const fmtQ = (n) => 'Q' + Math.round(n).toLocaleString('es-GT');
  const est = document.querySelector('#estimator');
  if (est) {
    const input = est.querySelector('#bill');
    const out = est.querySelector('.est-out');
    const oMonth = est.querySelector('[data-est="month"]');
    const oYear = est.querySelector('[data-est="year"]');
    const oLife = est.querySelector('[data-est="life"]');
    const quote = est.querySelector('.est-quote');
    const calc = () => {
      const bill = parseFloat(input.value);
      if (!bill || bill <= 0) { if (out) out.hidden = true; return; }
      const m = bill * SAVINGS_RATE;
      if (oMonth) oMonth.textContent = fmtQ(m);
      if (oYear) oYear.textContent = fmtQ(m * 12);
      if (oLife) oLife.textContent = fmtQ(m * 12 * YEARS);
      if (quote) quote.href = `contacto.html?asunto=${encodeURIComponent('Cotización: factura ~' + fmtQ(bill) + '/mes')}&monto=${Math.round(bill)}`;
      if (out) out.hidden = false;
    };
    est.addEventListener('submit', (e) => { e.preventDefault(); calc(); });
    input.addEventListener('input', calc);
  }

  /* ----- Contact form (Formspree). Routes by the "Soy" value. ----------
     SET destination: replace FORM_ENDPOINT with the Formspree form id
     (or a Netlify form). [CONFIRM with Alex]
     -------------------------------------------------------------------- */
  const FORM_ENDPOINT = 'https://formspree.io/f/REPLACE_WITH_FORM_ID';
  const form = document.querySelector('#contact-form');
  if (form) {
    // Pre-fill subject / bill coming from the estimator.
    const params = new URLSearchParams(location.search);
    const asunto = params.get('asunto');
    const monto = params.get('monto');
    const aField = form.querySelector('[name="asunto"]');
    if (asunto && aField) aField.value = asunto;
    if (monto && form.querySelector('[name="mensaje"]')) {
      form.querySelector('[name="mensaje"]').value = t(
        `Pago actual de luz: aprox. Q${monto} al mes. Quiero saber cuánto puedo ahorrar.`,
        `Current power bill: about Q${monto} per month. I'd like to know how much I can save.`
      );
    }

    const note = form.querySelector('.form-note');
    const setNote = (msg, ok) => {
      if (!note) return;
      note.textContent = msg;
      note.style.display = 'block';
      note.style.color = ok ? 'var(--teal-bright)' : '#fca5a5';
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (form.querySelector('[name="_gotcha"]') && form.querySelector('[name="_gotcha"]').value) return; // honeypot
      const btn = form.querySelector('button[type="submit"]');
      const orig = btn ? btn.textContent : '';
      if (btn) { btn.disabled = true; btn.textContent = t('Enviando…', 'Sending…'); }

      const okMsg = t('¡Gracias! Recibimos tu mensaje y te contactamos muy pronto.',
                      'Thanks! We’ve got your message and we’ll be in touch soon.');
      const errMsg = t('Algo salió mal. Escríbenos por WhatsApp y lo resolvemos al toque.',
                       'Something went wrong. Message us on WhatsApp and we’ll sort it out.');

      // If the endpoint hasn't been configured yet, fail gracefully toward WhatsApp.
      if (FORM_ENDPOINT.includes('REPLACE_WITH_FORM_ID')) {
        setNote(errMsg, false);
        if (btn) { btn.disabled = false; btn.textContent = orig; }
        return;
      }
      try {
        const res = await fetch(FORM_ENDPOINT, {
          method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' },
        });
        if (res.ok) { setNote(okMsg, true); form.reset(); }
        else setNote(errMsg, false);
      } catch (_) { setNote(errMsg, false); }
      if (btn) { btn.disabled = false; btn.textContent = orig; }
    });
  }

  /* ----- FAQ accordion ----- */
  document.querySelectorAll('.faq-item .faq-q').forEach((q) => {
    q.addEventListener('click', () => q.parentElement.classList.toggle('open'));
  });

  /* ----- current year ----- */
  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
})();
