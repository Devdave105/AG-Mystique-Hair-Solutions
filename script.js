/* ============================================================
   AG MYSTIQUE v2 — SCRIPT.JS
   ============================================================ */
'use strict';

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

/* ── FOOTER YEAR ── */
const fy = $('#footer-year');
if (fy) fy.textContent = new Date().getFullYear();

/* ── THEME SWITCHER ── */
(function initTheme() {
  const html     = document.documentElement;
  const switcher = $('#theme-switcher');
  const btns     = $$('.theme-btn');
  const STORAGE  = 'agm_theme';

  const saved = localStorage.getItem(STORAGE) || 'light';
  setTheme(saved, false);

  btns.forEach(btn => {
    btn.addEventListener('click', () => setTheme(btn.dataset.theme, true));
  });

  function setTheme(theme, save) {
    html.setAttribute('data-theme', theme);
    btns.forEach(b => b.classList.toggle('active', b.dataset.theme === theme));
    if (save) localStorage.setItem(STORAGE, theme);
  }
})();

/* ── SCROLL REVEAL ── */
(function initReveal() {
  const els = $$('.rv');
  if (!els.length) return;

  // Stagger children in grids
  ['.proof-grid', '.pricing-grid', '.products-grid', '.ing-grid', '.results-grid', '.faq-list'].forEach(sel => {
    const parent = $(sel);
    if (!parent) return;
    $$('.rv', parent).forEach((el, i) => {
      el.style.transitionDelay = (i * 0.08) + 's';
    });
  });

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });

  els.forEach(el => obs.observe(el));
})();

/* ── NAVBAR ── */
(function initNavbar() {
  const nav      = $('#navbar');
  const links    = $$('.nav-link');
  const sections = $$('main section[id]');
  if (!nav) return;

  function update() {
    nav.classList.toggle('scrolled', window.scrollY > 12);
    let cur = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 100) cur = s.id; });
    links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${cur}`));
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* ── HAMBURGER ── */
(function initHamburger() {
  const btn  = $('#hamburger');
  const menu = $('#mob-menu');
  if (!btn || !menu) return;

  const links = $$('.mob-link');

  function open()  { btn.classList.add('open'); btn.setAttribute('aria-expanded','true'); menu.classList.add('open'); menu.setAttribute('aria-hidden','false'); document.body.classList.add('menu-open'); }
  function close() { btn.classList.remove('open'); btn.setAttribute('aria-expanded','false'); menu.classList.remove('open'); menu.setAttribute('aria-hidden','true'); document.body.classList.remove('menu-open'); }

  btn.addEventListener('click', () => menu.classList.contains('open') ? close() : open());
  links.forEach(l => l.addEventListener('click', close));
  $('.mob-bg', menu)?.addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();

/* ── HERO SLIDER ── */
(function initHero() {
  const slides = $$('.slide');
  const dots   = $$('.hdot');
  if (!slides.length) return;

  let cur = 0, timer = null;
  const DUR = 5800;

  function resetText(slide) {
    slide.querySelectorAll('.hero-text > *').forEach(el => {
      el.style.transition = 'none';
      el.style.opacity = '0';
      el.style.transform = 'translateY(22px)';
    });
  }

  function goTo(idx) {
    const leaving = slides[cur];

    // Fade out leaving text
    leaving.querySelectorAll('.hero-text > *').forEach(el => {
      el.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      el.style.transitionDelay = '0s';
      el.style.opacity = '0';
      el.style.transform = 'translateY(-14px)';
    });

    setTimeout(() => {
      leaving.classList.remove('active');
      dots[cur].classList.remove('active');
      dots[cur].setAttribute('aria-selected', 'false');

      cur = idx;
      const entering = slides[cur];
      resetText(entering);
      entering.classList.add('active');
      dots[cur].classList.add('active');
      dots[cur].setAttribute('aria-selected', 'true');

      const delays = [0.18, 0.30, 0.44, 0.56];
      entering.querySelectorAll('.hero-text > *').forEach((el, i) => {
        void el.offsetWidth;
        el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
        el.style.transitionDelay = (delays[i] || 0.2) + 's';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    }, 340);
  }

  function next() { goTo((cur + 1) % slides.length); }
  function startAuto() { clearInterval(timer); timer = setInterval(next, DUR); }

  // Init first slide text
  slides[0].querySelectorAll('.hero-text > *').forEach((el, i) => {
    const delays = [0.18, 0.30, 0.44, 0.56];
    el.style.transitionDelay = (delays[i] || 0.2) + 's';
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  });

  dots.forEach(d => d.addEventListener('click', () => {
    const i = parseInt(d.dataset.i);
    if (i !== cur) { goTo(i); startAuto(); }
  }));

  // Touch swipe
  let tx = 0;
  const hw = $('.hero-slides');
  if (hw) {
    hw.addEventListener('touchstart', e => { tx = e.changedTouches[0].clientX; }, { passive: true });
    hw.addEventListener('touchend',   e => {
      const diff = tx - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 44) { goTo(diff > 0 ? (cur + 1) % slides.length : (cur - 1 + slides.length) % slides.length); startAuto(); }
    }, { passive: true });
  }

  startAuto();
})();

/* ── COUNTDOWN ── */
(function initCountdown() {
  const H = $('#cd-h'), M = $('#cd-m'), S = $('#cd-s');
  if (!H) return;
  const KEY = 'agm_cd_v2';
  const DUR = 12 * 3600 * 1000;
  let end = parseInt(localStorage.getItem(KEY), 10);
  if (!end || end <= Date.now()) { end = Date.now() + DUR; localStorage.setItem(KEY, end); }
  const pad = n => String(n).padStart(2, '0');
  function tick() {
    const d = Math.max(0, end - Date.now());
    H.textContent = pad(Math.floor(d / 3600000));
    M.textContent = pad(Math.floor((d % 3600000) / 60000));
    S.textContent = pad(Math.floor((d % 60000) / 1000));
    if (d === 0) { end = Date.now() + DUR; localStorage.setItem(KEY, end); }
  }
  tick(); setInterval(tick, 1000);
})();

/* ── LIGHTBOX ── */
(function initLightbox() {
  const lb  = $('#lightbox');
  const img = $('#lb-img');
  if (!lb || !img) return;

  function open(src, alt) { img.src = src; img.alt = alt; lb.classList.add('open'); lb.setAttribute('aria-hidden','false'); document.body.style.overflow = 'hidden'; }
  function close() { lb.classList.remove('open'); lb.setAttribute('aria-hidden','true'); document.body.style.overflow = ''; setTimeout(() => { img.src = ''; }, 350); }

  $$('.prod-card[data-lightbox]').forEach(card => {
    card.addEventListener('click', () => { const i = card.querySelector('.prod-img'); if (i) open(i.src, i.alt); });
  });
  $('.lb-close', lb)?.addEventListener('click', close);
  $('.lb-bg', lb)?.addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && lb.classList.contains('open')) close(); });
})();

/* ── INGREDIENTS TOGGLE ── */
(function initIngredients() {
  const btn     = $('#ing-btn');
  const hidden  = $$('.ing-hidden');
  if (!btn || !hidden.length) return;
  let open = false;
  btn.addEventListener('click', () => {
    open = !open;
    hidden.forEach((c, i) => {
      c.classList.toggle('ing-visible', open);
      if (open) setTimeout(() => c.classList.add('in'), i * 70);
      else c.classList.remove('in');
    });
    btn.textContent = open ? 'Show Fewer Ingredients' : 'Show All Ingredients';
  });
})();

/* ── RESULTS TOGGLE ── */
(function initResults() {
  const btn    = $('#results-btn');
  const hidden = $$('.result-hidden');
  if (!btn || !hidden.length) return;
  let open = false;
  btn.addEventListener('click', () => {
    open = !open;
    hidden.forEach((c, i) => {
      c.classList.toggle('result-shown', open);
      if (open) { c.style.transitionDelay = (i * 0.09) + 's'; setTimeout(() => c.classList.add('in'), i * 90 + 40); }
      else { c.classList.remove('in'); c.style.transitionDelay = '0s'; }
    });
    btn.textContent = open ? 'Show Fewer Results' : 'Show More Results';
  });
})();

/* ── TESTIMONIALS ── */
(function initTestis() {
  const track = $('#testi-track');
  const dots  = $$('#t-dots .tdot');
  const prev  = $('#t-prev');
  const next  = $('#t-next');
  if (!track) return;

  const cards = $$('.testi-card', track);
  let cur = 0, timer = null;
  const DUR = 5400;

  function goTo(i) {
    cur = (i + cards.length) % cards.length;
    track.style.transform = `translateX(-${cur * 100}%)`;
    dots.forEach((d, j) => { d.classList.toggle('active', j === cur); d.setAttribute('aria-selected', j === cur ? 'true' : 'false'); });
  }
  function startAuto() { clearInterval(timer); timer = setInterval(() => goTo(cur + 1), DUR); }

  prev?.addEventListener('click', () => { goTo(cur - 1); startAuto(); });
  next?.addEventListener('click', () => { goTo(cur + 1); startAuto(); });
  dots.forEach(d => d.addEventListener('click', () => { goTo(parseInt(d.dataset.i)); startAuto(); }));

  // Swipe
  let tx = 0;
  track.addEventListener('touchstart', e => { tx = e.changedTouches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   e => {
    const diff = tx - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { goTo(diff > 0 ? cur + 1 : cur - 1); startAuto(); }
  }, { passive: true });

  startAuto();
})();

/* ── COMMUNITY REVIEWS ── */
(function initReviews() {
  const list    = $('#reviews-list');
  const nameEl  = $('#r-name');
  const commEl  = $('#r-comment');
  const submit  = $('#r-submit');
  const success = $('#r-success');
  if (!list) return;

  const KEY = 'agm_reviews_v2';
  const escape = s => { const d = document.createElement('div'); d.appendChild(document.createTextNode(s)); return d.innerHTML; };
  const fmt    = ts => new Date(ts).toLocaleDateString('en-NG', { year:'numeric', month:'short', day:'numeric' });

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
  }
  function save(arr) { localStorage.setItem(KEY, JSON.stringify(arr)); }

  function renderOne(r) {
    const el = document.createElement('div');
    el.className = 'review-item';
    el.innerHTML = `<div class="review-meta"><span class="rev-name">${escape(r.name)}</span><span class="rev-date">${fmt(r.timestamp)}</span></div><p class="rev-text">${escape(r.comment)}</p>`;
    return el;
  }

  function renderAll() {
    const reviews = load();
    list.innerHTML = '';
    if (!reviews.length) { list.innerHTML = '<p class="no-reviews">Be the first to share your experience.</p>'; return; }
    [...reviews].reverse().forEach(r => list.appendChild(renderOne(r)));
  }

  submit?.addEventListener('click', () => {
    const name = nameEl?.value.trim();
    const comment = commEl?.value.trim();
    if (!name || !comment) {
      if (success) { success.style.color = '#ef4444'; success.textContent = 'Please fill in both fields.'; }
      return;
    }
    const reviews = load();
    const r = { name, comment, timestamp: Date.now() };
    reviews.push(r);
    save(reviews);
    if (nameEl) nameEl.value = '';
    if (commEl) commEl.value = '';
    if (success) { success.style.color = ''; success.textContent = 'Thank you! Your review has been posted.'; setTimeout(() => { if(success) success.textContent = ''; }, 4000); }
    const existing = list.querySelector('.no-reviews');
    if (existing) existing.remove();
    list.insertBefore(renderOne(r), list.firstChild);
  });

  renderAll();
})();

/* ── FAQ ACCORDION ── */
(function initFaq() {
  $$('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-q');
    const ans = item.querySelector('.faq-a');
    if (!btn || !ans) return;
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      $$('.faq-item').forEach(other => {
        other.querySelector('.faq-q')?.setAttribute('aria-expanded', 'false');
        other.querySelector('.faq-a')?.classList.remove('open');
      });
      if (!open) { btn.setAttribute('aria-expanded', 'true'); ans.classList.add('open'); }
    });
  });
})();

/* ── FLOATING BUTTONS ── */
(function initFloats() {
  const wa  = $('#float-wa');
  const top = $('#float-top');
  const th  = $('#theme-switcher');

  function update() {
    const vis = window.scrollY > 400;
    wa?.classList.toggle('show', vis);
    top?.classList.toggle('show', vis);
    th?.classList.toggle('visible', vis);
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
  top?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ── ANIMATED COUNTERS ── */
(function initCounters() {
  const items = $$('.proof-item');
  if (!items.length) return;

  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function animateCounter(el) {
    const numEl  = el.querySelector('.proof-n');
    if (!numEl || numEl.dataset.done) return;
    numEl.dataset.done = '1';

    const target = parseInt(numEl.dataset.count, 10);
    const suffix = numEl.dataset.suffix || '';
    const dur    = target > 1000 ? 1800 : 1200;
    const start  = performance.now();

    numEl.classList.add('counting');

    function tick(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / dur, 1);
      const current  = Math.floor(easeOut(progress) * target);

      // Format with commas if large
      const formatted = current >= 1000
        ? current.toLocaleString('en-NG')
        : String(current);

      numEl.textContent = formatted + suffix;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        // Final exact value
        const finalFormatted = target >= 1000
          ? target.toLocaleString('en-NG')
          : String(target);
        numEl.textContent = finalFormatted + suffix;
        numEl.classList.remove('counting');
      }
    }

    requestAnimationFrame(tick);
  }

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  items.forEach(item => obs.observe(item));
})();

/* ── COMMUNITY VIDEO CONTROLS ── */
(function initVideoControls() {
  const video      = document.getElementById('comm-video');
  const playBtn    = document.getElementById('vid-playpause');
  const muteBtn    = document.getElementById('vid-mute');
  const fsBtn      = document.getElementById('vid-fullscreen');
  const controls   = document.getElementById('comm-vid-controls');
  if (!video || !playBtn) return;

  // On mobile, always show controls (no hover)
  function applyMobileControls() {
    if (window.innerWidth < 1024) {
      controls.style.opacity = '1';
      controls.style.transform = 'translateY(0)';
    } else {
      controls.style.opacity = '';
      controls.style.transform = '';
    }
  }
  applyMobileControls();
  window.addEventListener('resize', applyMobileControls, { passive: true });

  // Play / Pause
  playBtn.addEventListener('click', () => {
    if (video.paused) {
      video.play();
      playBtn.querySelector('.icon-pause').style.display = '';
      playBtn.querySelector('.icon-play').style.display  = 'none';
      playBtn.setAttribute('aria-label', 'Pause video');
    } else {
      video.pause();
      playBtn.querySelector('.icon-pause').style.display = 'none';
      playBtn.querySelector('.icon-play').style.display  = '';
      playBtn.setAttribute('aria-label', 'Play video');
    }
  });

  // Mute / Unmute
  muteBtn.addEventListener('click', () => {
    video.muted = !video.muted;
    muteBtn.querySelector('.icon-muted').style.display = video.muted ? ''     : 'none';
    muteBtn.querySelector('.icon-sound').style.display = video.muted ? 'none' : '';
    muteBtn.setAttribute('aria-label', video.muted ? 'Unmute video' : 'Mute video');
  });

  // Fullscreen
  fsBtn && fsBtn.addEventListener('click', () => {
    const el = video;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else if (el.requestFullscreen) {
      el.requestFullscreen();
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    } else if (el.webkitEnterFullscreen) {
      // iOS Safari fallback
      el.webkitEnterFullscreen();
    }
  });

  // Keep icon state in sync if video autopauses (e.g. tab hidden)
  video.addEventListener('pause', () => {
    playBtn.querySelector('.icon-pause').style.display = 'none';
    playBtn.querySelector('.icon-play').style.display  = '';
  });
  video.addEventListener('play', () => {
    playBtn.querySelector('.icon-pause').style.display = '';
    playBtn.querySelector('.icon-play').style.display  = 'none';
  });
})();

/* ── PRICING CARD ANIMATIONS ── */
(function initPricingAnim() {
  const cards = $$('.price-card--anim');
  if (!cards.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.25 });

  cards.forEach(c => obs.observe(c));

  // Tilt effect on desktop only
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      if (window.innerWidth < 768) return;
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 10;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -10;
      card.style.transform = `translateY(-8px) scale(1.015) rotateX(${y}deg) rotateY(${x}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ── SMOOTH SCROLL ── */
document.addEventListener('click', e => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  const id = link.getAttribute('href').slice(1);
  if (!id) return;
  const target = document.getElementById(id);
  if (!target) return;
  e.preventDefault();
  const nh = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 72;
  window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - nh, behavior: 'smooth' });
});