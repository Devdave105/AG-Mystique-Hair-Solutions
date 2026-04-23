/* AG MYSTIQUE — SCRIPT */
(function(){
'use strict';

/* ── NAV SCROLL ── */
const nav = document.getElementById('nav');
const btt = document.getElementById('btt');
const allSections = document.querySelectorAll('section[id]');
const navAs = document.querySelectorAll('.nav-links a, .m-menu a');

window.addEventListener('scroll', () => {
  const sy = window.scrollY;
  nav.classList.toggle('stuck', sy > 60);
  btt.classList.toggle('vis', sy > 500);
  let cur = '';
  allSections.forEach(s => { if(sy >= s.offsetTop - 180) cur = s.id; });
  navAs.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
}, { passive: true });

btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ── HAMBURGER ── */
const hbg = document.querySelector('.hbg');
const mm  = document.querySelector('.m-menu');
const mmLinks = mm.querySelectorAll('a');

hbg.addEventListener('click', () => {
  const open = hbg.classList.toggle('on');
  mm.classList.toggle('on', open);
  hbg.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});
mmLinks.forEach(a => a.addEventListener('click', () => {
  hbg.classList.remove('on');
  mm.classList.remove('on');
  hbg.setAttribute('aria-expanded', false);
  document.body.style.overflow = '';
}));

/* ── HERO SLIDER ── */
const slides = document.querySelectorAll('.slide');
const sdots  = document.querySelectorAll('.sdot');
let cur = 0, si;

function goto(n) {
  slides[cur].classList.remove('on');
  sdots[cur].classList.remove('on');
  cur = (n + slides.length) % slides.length;
  slides[cur].classList.add('on');
  sdots[cur].classList.add('on');
}
function run() { si = setInterval(() => goto(cur + 1), 5500); }
sdots.forEach((d, i) => d.addEventListener('click', () => { clearInterval(si); goto(i); run(); }));
run();

/* ── COUNTDOWN ── */
function getTarget() {
  let t = parseInt(localStorage.getItem('agm_cd') || '0');
  if (!t || t < Date.now()) {
    t = Date.now() + (2 * 3600 + 47 * 60 + 33) * 1000;
    localStorage.setItem('agm_cd', t);
  }
  return t;
}
const target = getTarget();
const cdH = document.getElementById('cdH');
const cdM = document.getElementById('cdM');
const cdS = document.getElementById('cdS');
function tick() {
  const d = Math.max(0, target - Date.now());
  const h = Math.floor(d / 3600000);
  const m = Math.floor((d % 3600000) / 60000);
  const s = Math.floor((d % 60000) / 1000);
  if(cdH) cdH.textContent = String(h).padStart(2,'0');
  if(cdM) cdM.textContent = String(m).padStart(2,'0');
  if(cdS) cdS.textContent = String(s).padStart(2,'0');
}
tick(); setInterval(tick, 1000);

/* ── LIGHTBOX ── */
const lb    = document.getElementById('lb');
const lbImg = document.getElementById('lb-img');
const lbX   = document.getElementById('lb-x');

document.querySelectorAll('.prod-card').forEach(c => {
  c.addEventListener('click', () => {
    const src = c.querySelector('img')?.src;
    if (!src || !lb) return;
    lbImg.src = src;
    lb.classList.add('on');
    document.body.style.overflow = 'hidden';
  });
});
function closeLB() { lb.classList.remove('on'); document.body.style.overflow = ''; }
if (lbX) lbX.addEventListener('click', closeLB);
if (lb)  lb.addEventListener('click', e => { if (e.target === lb) closeLB(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLB(); });

/* ── INGREDIENTS SHOW MORE ── */
const ingMoreBtn = document.getElementById('ing-more-btn');
const ingMoreGrid = document.getElementById('ing-more');
if (ingMoreBtn && ingMoreGrid) {
  ingMoreBtn.addEventListener('click', () => {
    const open = ingMoreGrid.classList.toggle('open');
    ingMoreBtn.textContent = open ? 'Show Less' : 'Show All Ingredients';
  });
}

/* ── RESULTS SHOW MORE ── */
const resBtn = document.getElementById('res-more-btn');
const resHidden = document.querySelectorAll('.res-card.hidden');
let resOpen = false;
if (resBtn) {
  resBtn.addEventListener('click', () => {
    resOpen = !resOpen;
    resHidden.forEach((c, i) => {
      if (resOpen) { c.classList.add('show'); c.style.animationDelay = (i * 90) + 'ms'; }
      else { c.classList.remove('show'); }
    });
    resBtn.textContent = resOpen ? 'Show Less' : 'Show More Results';
  });
}

/* ── VIDEO ── */
const vThumb = document.getElementById('vthumb');
const vFrame = document.getElementById('vframe');
if (vThumb && vFrame) {
  vThumb.addEventListener('click', () => {
    vFrame.src = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0';
    vFrame.classList.add('on');
    vThumb.style.display = 'none';
  });
}

/* ── TESTIMONIALS ── */
const tt     = document.querySelector('.ttrack');
const tSlides = document.querySelectorAll('.tslide');
const tPips  = document.querySelectorAll('.tpip');
const tPrev  = document.getElementById('tPrev');
const tNext  = document.getElementById('tNext');
let ti = 0, tAuto;

function tGo(n) {
  ti = (n + tSlides.length) % tSlides.length;
  tt.style.transform = `translateX(-${ti * 100}%)`;
  tPips.forEach((p, i) => p.classList.toggle('on', i === ti));
}
function tRun() { tAuto = setInterval(() => tGo(ti + 1), 5200); }
if (tPrev) tPrev.addEventListener('click', () => { clearInterval(tAuto); tGo(ti - 1); tRun(); });
if (tNext) tNext.addEventListener('click', () => { clearInterval(tAuto); tGo(ti + 1); tRun(); });
tPips.forEach((p, i) => p.addEventListener('click', () => { clearInterval(tAuto); tGo(i); tRun(); }));

let txStart = 0;
if (tt) {
  tt.addEventListener('touchstart', e => { txStart = e.touches[0].clientX; }, { passive: true });
  tt.addEventListener('touchend', e => {
    const d = txStart - e.changedTouches[0].clientX;
    if (Math.abs(d) > 48) { clearInterval(tAuto); tGo(d > 0 ? ti + 1 : ti - 1); tRun(); }
  });
}
tRun();

/* ── REVIEWS ── */
const rForm = document.getElementById('rForm');
const rList = document.getElementById('rList');
const rOk   = document.getElementById('rOk');

function esc(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function renderReviews() {
  const data = JSON.parse(localStorage.getItem('agm_reviews') || '[]');
  if (!rList) return;
  if (!data.length) { rList.innerHTML = '<p class="rev-empty">No reviews yet. Be the first.</p>'; return; }
  rList.innerHTML = '';
  data.slice().reverse().forEach(r => {
    const el = document.createElement('div');
    el.className = 'rev-item';
    el.innerHTML = `<div class="rev-item-top"><span class="rev-item-name">${esc(r.n)}</span><span class="rev-item-date">${r.d}</span></div><p class="rev-item-body">${esc(r.c)}</p>`;
    rList.appendChild(el);
  });
}

if (rForm) {
  rForm.addEventListener('submit', e => {
    e.preventDefault();
    const n = document.getElementById('rName').value.trim();
    const c = document.getElementById('rComment').value.trim();
    if (!n || !c) return;
    const d = JSON.parse(localStorage.getItem('agm_reviews') || '[]');
    d.push({ n, c, d: new Date().toLocaleDateString('en-NG', { day:'numeric', month:'short', year:'numeric' }) });
    localStorage.setItem('agm_reviews', JSON.stringify(d));
    rForm.reset();
    renderReviews();
    if (rOk) { rOk.style.display = 'block'; setTimeout(() => rOk.style.display = 'none', 3000); }
  });
}
renderReviews();

/* ── SIMPLE AOS ── */
const aosEls = document.querySelectorAll('[data-aos]');
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('aos-in'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
aosEls.forEach((el, i) => {
  const delay = el.dataset.aosDelay || 0;
  el.style.transitionDelay = delay + 'ms';
  io.observe(el);
});

})();