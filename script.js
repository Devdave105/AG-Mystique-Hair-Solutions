/* ============================================================
   AG MYSTIQUE HAIR SOLUTIONS — SCRIPT.JS
   Vanilla JS — no external libraries
   ============================================================ */

'use strict';

/* ============================================================
   UTILITY
   ============================================================ */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ============================================================
   FOOTER YEAR
   ============================================================ */
const yearEl = $('#footer-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ============================================================
   SCROLL REVEAL — IntersectionObserver
   ============================================================ */
(function initReveal() {
  const items = $$('.reveal-up');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  items.forEach(el => observer.observe(el));
})();

/* ============================================================
   NAVBAR — SCROLL STATE + ACTIVE LINK
   ============================================================ */
(function initNavbar() {
  const navbar = $('#navbar');
  if (!navbar) return;

  const sections = $$('main section[id]');
  const navLinks = $$('.nav-link');

  // Scroll frosted state
  let lastScroll = 0;

  function updateNavbar() {
    const scrollY = window.scrollY;

    if (scrollY > 10) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active section highlight
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });

    lastScroll = scrollY;
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();
})();

/* ============================================================
   HAMBURGER MENU
   ============================================================ */
(function initMobileMenu() {
  const hamburger = $('#hamburger');
  const mobileMenu = $('#mobile-menu');
  if (!hamburger || !mobileMenu) return;

  const mobileLinks = $$('.mobile-nav-link');

  function openMenu() {
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.classList.add('menu-open');
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
  }

  hamburger.addEventListener('click', () => {
    if (mobileMenu.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on overlay tap
  const overlay = mobileMenu.querySelector('.mobile-menu-overlay');
  if (overlay) overlay.addEventListener('click', closeMenu);

  // Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMenu();
  });
})();

/* ============================================================
   HERO SLIDER
   ============================================================ */
(function initHeroSlider() {
  const slides = $$('.slide');
  const dots = $$('.slider-dots .dot');
  if (!slides.length) return;

  let current = 0;
  let timer = null;
  const INTERVAL = 5500;

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    dots[current].setAttribute('aria-selected', 'false');
    current = index;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
    dots[current].setAttribute('aria-selected', 'true');
  }

  function next() {
    goTo((current + 1) % slides.length);
  }

  function startAuto() {
    clearInterval(timer);
    timer = setInterval(next, INTERVAL);
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.dataset.index, 10);
      goTo(idx);
      startAuto();
    });
  });

  startAuto();
})();

/* ============================================================
   COUNTDOWN TIMER — localStorage persisted
   ============================================================ */
(function initCountdown() {
  const hoursEl = $('#cd-hours');
  const minsEl  = $('#cd-mins');
  const secsEl  = $('#cd-secs');
  if (!hoursEl) return;

  const STORAGE_KEY = 'agm_countdown_end';
  const DURATION_MS = 12 * 60 * 60 * 1000; // 12 hours

  let endTime = parseInt(localStorage.getItem(STORAGE_KEY), 10);

  if (!endTime || endTime <= Date.now()) {
    endTime = Date.now() + DURATION_MS;
    localStorage.setItem(STORAGE_KEY, endTime);
  }

  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    const diff = Math.max(0, endTime - Date.now());
    const hours = Math.floor(diff / 3600000);
    const mins  = Math.floor((diff % 3600000) / 60000);
    const secs  = Math.floor((diff % 60000) / 1000);

    hoursEl.textContent = pad(hours);
    minsEl.textContent  = pad(mins);
    secsEl.textContent  = pad(secs);

    if (diff === 0) {
      // Reset timer
      endTime = Date.now() + DURATION_MS;
      localStorage.setItem(STORAGE_KEY, endTime);
    }
  }

  tick();
  setInterval(tick, 1000);
})();

/* ============================================================
   PRODUCT IMAGE LIGHTBOX
   ============================================================ */
(function initLightbox() {
  const lightbox   = $('#lightbox');
  const lightboxImg = $('#lightbox-img');
  const lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;
  const lightboxBg  = lightbox ? lightbox.querySelector('.lightbox-bg') : null;
  if (!lightbox || !lightboxImg) return;

  function open(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(() => { lightboxImg.src = ''; }, 400);
  }

  $$('.product-img-wrap[data-lightbox]').forEach(wrap => {
    wrap.addEventListener('click', () => {
      const img = wrap.querySelector('.product-img');
      if (img) open(img.src, img.alt);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', close);
  if (lightboxBg)    lightboxBg.addEventListener('click', close);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) close();
  });
})();

/* ============================================================
   INGREDIENTS TOGGLE
   ============================================================ */
(function initIngredientsToggle() {
  const btn = $('#ing-toggle-btn');
  const hiddenCards = $$('.hidden-ingredient');
  if (!btn || !hiddenCards.length) return;

  let revealed = false;

  btn.addEventListener('click', () => {
    revealed = !revealed;

    hiddenCards.forEach((card, i) => {
      if (revealed) {
        card.classList.add('revealed');
        // Re-trigger reveal animation with stagger
        setTimeout(() => {
          card.classList.add('visible');
        }, i * 80 + 50);
      } else {
        card.classList.remove('revealed', 'visible');
      }
    });

    btn.textContent = revealed ? 'Show Fewer Ingredients' : 'Show All Ingredients';
  });
})();

/* ============================================================
   BEFORE & AFTER — SHOW MORE RESULTS
   ============================================================ */
(function initResultsToggle() {
  const btn = $('#results-toggle-btn');
  const hiddenResults = $$('.hidden-result');
  if (!btn || !hiddenResults.length) return;

  let revealed = false;

  btn.addEventListener('click', () => {
    revealed = !revealed;

    hiddenResults.forEach((card, i) => {
      if (revealed) {
        card.classList.add('revealed');
        card.style.transitionDelay = `${i * 100}ms`;
        setTimeout(() => {
          card.classList.add('visible');
        }, i * 100 + 50);
      } else {
        card.classList.remove('revealed', 'visible');
        card.style.transitionDelay = '0ms';
      }
    });

    btn.textContent = revealed ? 'Show Fewer Results' : 'Show More Results';
  });
})();

/* ============================================================
   VIDEO EMBED — YOUTUBE
   ============================================================ */
(function initVideo() {
  const videoWrap = $('#video-wrap');
  const playBtn   = $('#play-btn');
  if (!videoWrap || !playBtn) return;

  // Replace with actual YouTube video ID when available
  const YOUTUBE_ID = 'dQw4w9WgXcQ';

  playBtn.addEventListener('click', () => {
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=1&rel=0`;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    iframe.title = 'AG Mystique Hair Solutions — Watch the Story';
    videoWrap.appendChild(iframe);

    // Hide overlay
    const overlay = videoWrap.querySelector('.video-overlay');
    if (overlay) overlay.style.display = 'none';
  });
})();

/* ============================================================
   TESTIMONIALS SLIDER — SWIPE + AUTO
   ============================================================ */
(function initTestimonials() {
  const track  = $('#testimonials-track');
  const dots   = $$('#testi-dots .dot');
  const prevBtn = $('#testi-prev');
  const nextBtn = $('#testi-next');
  if (!track) return;

  const cards = $$('.testimonial-card', track);
  const total = cards.length;
  let current = 0;
  let timer = null;
  const INTERVAL = 5200;

  // Touch / swipe state
  let touchStartX = 0;
  let touchEndX = 0;

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
      dot.setAttribute('aria-selected', i === current ? 'true' : 'false');
    });
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAuto() {
    clearInterval(timer);
    timer = setInterval(next, INTERVAL);
  }

  nextBtn && nextBtn.addEventListener('click', () => { next(); startAuto(); });
  prevBtn && prevBtn.addEventListener('click', () => { prev(); startAuto(); });

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goTo(parseInt(dot.dataset.index, 10));
      startAuto();
    });
  });

  // Swipe support
  track.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? next() : prev();
      startAuto();
    }
  }, { passive: true });

  startAuto();
})();

/* ============================================================
   COMMUNITY REVIEWS — localStorage
   ============================================================ */
(function initCommunityReviews() {
  const form       = $('#review-form');
  const nameInput  = $('#review-name');
  const commentInput = $('#review-comment');
  const submitBtn  = $('#review-submit');
  const successMsg = $('#form-success');
  const list       = $('#reviews-list');
  if (!form || !list) return;

  const STORAGE_KEY = 'agm_reviews';

  function getReviews() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  function saveReviews(reviews) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
  }

  function formatDate(ts) {
    return new Date(ts).toLocaleDateString('en-NG', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  }

  function renderReview(review) {
    const item = document.createElement('div');
    item.className = 'review-item';
    item.innerHTML = `
      <div class="review-meta">
        <span class="review-author-name">${escapeHtml(review.name)}</span>
        <span class="review-date">${formatDate(review.timestamp)}</span>
      </div>
      <p class="review-text">${escapeHtml(review.comment)}</p>
    `;
    return item;
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  function renderAll() {
    const reviews = getReviews();
    list.innerHTML = '';

    if (!reviews.length) {
      list.innerHTML = '<p class="no-reviews">Be the first to share your experience.</p>';
      return;
    }

    // Newest first
    [...reviews].reverse().forEach(r => {
      list.appendChild(renderReview(r));
    });
  }

  submitBtn && submitBtn.addEventListener('click', () => {
    const name    = nameInput.value.trim();
    const comment = commentInput.value.trim();

    if (!name || !comment) {
      successMsg.textContent = 'Please fill in both fields before submitting.';
      successMsg.style.color = '#ff6b6b';
      return;
    }

    const reviews = getReviews();
    const newReview = { name, comment, timestamp: Date.now() };
    reviews.push(newReview);
    saveReviews(reviews);

    // Clear form
    nameInput.value = '';
    commentInput.value = '';

    successMsg.style.color = '#25D366';
    successMsg.textContent = 'Thank you! Your review has been submitted.';
    setTimeout(() => { successMsg.textContent = ''; }, 4000);

    // Prepend new review at top
    const existing = list.querySelector('.no-reviews');
    if (existing) existing.remove();
    list.insertBefore(renderReview(newReview), list.firstChild);
  });

  renderAll();
})();

/* ============================================================
   FLOATING BUTTONS — APPEAR AFTER 400px SCROLL
   ============================================================ */
(function initFloatingBtns() {
  const floatWA    = $('#float-whatsapp');
  const floatTop   = $('#float-backtop');
  if (!floatWA) return;

  function updateFloats() {
    const scrolled = window.scrollY > 400;
    floatWA.classList.toggle('visible', scrolled);
    if (floatTop) floatTop.classList.toggle('visible', scrolled);
  }

  window.addEventListener('scroll', updateFloats, { passive: true });
  updateFloats();

  floatTop && floatTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ============================================================
   SMOOTH SCROLL FOR ANCHOR LINKS
   ============================================================ */
(function initSmoothScroll() {
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const targetId = link.getAttribute('href').slice(1);
    if (!targetId) return;
    const target = document.getElementById(targetId);
    if (!target) return;
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--nav-h'), 10) || 72;
    const top = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: 'smooth' });
  });
})();