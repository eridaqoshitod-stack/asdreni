/* ===== Ndihmës ===== */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ===== Tema (e çelët / e errët) ===== */
const root = document.documentElement;
const themeBtn = $('#themeBtn');
try {
  const saved = localStorage.getItem('asdreni-theme');
  if (saved) root.dataset.theme = saved;
} catch (e) {}
function syncThemeIcon() { themeBtn.textContent = root.dataset.theme === 'dark' ? '☀' : '☾'; }
syncThemeIcon();
themeBtn.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('asdreni-theme', root.dataset.theme); } catch (e) {}
  syncThemeIcon();
});

/* ===== Navbar, progres, menu ===== */
const nav = $('#nav');
const progress = $('#progress');
function onScroll() {
  nav.classList.toggle('scrolled', window.scrollY > 60);
  const h = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = (h > 0 ? (scrollY / h) * 100 : 0) + '%';
}
addEventListener('scroll', onScroll, { passive: true });
onScroll();

const menu = $('#menu');
$('#menuBtn').addEventListener('click', () => menu.classList.toggle('open'));
$$('a', menu).forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));

/* ===== Titulli i hero me animacion shkronjë pas shkronje ===== */
const heroTitle = $('#heroTitle');
const heroText = heroTitle.textContent;
heroTitle.innerHTML = [...heroText].map((c, i) =>
  `<span style="animation-delay:${0.15 + i * 0.09}s" aria-hidden="true">${c}</span>`).join('');

/* ===== Pluhuri i artë në hero ===== */
(function dust() {
  const cv = $('#dust');
  if (!cv || reduceMotion) return;
  const ctx = cv.getContext('2d');
  let w, h, parts = [];
  function size() {
    w = cv.width = cv.offsetWidth;
    h = cv.height = cv.offsetHeight;
    parts = Array.from({ length: Math.min(70, Math.floor(w / 18)) }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: Math.random() * 1.8 + .4, v: Math.random() * .35 + .1,
      a: Math.random() * .6 + .2, red: Math.random() < .25
    }));
  }
  size();
  addEventListener('resize', size);
  (function frame() {
    ctx.clearRect(0, 0, w, h);
    for (const p of parts) {
      p.y -= p.v; p.x += Math.sin(p.y / 40) * .15;
      if (p.y < -5) { p.y = h + 5; p.x = Math.random() * w; }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, 6.283);
      ctx.fillStyle = p.red ? `rgba(224,71,77,${p.a})` : `rgba(212,168,92,${p.a})`;
      ctx.fill();
    }
    requestAnimationFrame(frame);
  })();
})();

/* ===== Reveal + numërues ===== */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('visible');
    io.unobserve(e.target);
  });
}, { threshold: .12 });
$$('.reveal').forEach(el => io.observe(el));

const counters = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, end = +el.dataset.count;
    counters.unobserve(el);
    if (reduceMotion) { el.textContent = end; return; }
    const t0 = performance.now(), dur = 1600;
    (function tick(t) {
      const k = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(tick);
    })(t0);
  });
}, { threshold: .6 });
$$('[data-count]').forEach(el => counters.observe(el));

/* ===== Scrollspy për kapitujt e biografisë ===== */
const chapterLinks = $$('#chapterIndex a');
const spy = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      chapterLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
    }
  });
}, { rootMargin: '-35% 0px -55% 0px' });
$$('.chapter').forEach(c => spy.observe(c));

/* ===== Funksion i përbashkët: animacion ndërrimi ===== */
function swap(el) {
  el.classList.remove('swap');
  void el.offsetWidth;
  el.classList.add('swap');
}

/* ===== KRONOLOGJIA ===== */
const events = [
  { y: '1872', d: '11 prill 1872', tag: 'Lindja', t: 'Lind në Drenovë', x: 'Aleksandër Stavre Drenova lind në Drenovë, pranë Korçës, në një familje fshatare ortodokse. Babai i quhej Stavri Thimiu.' },
  { y: '1885', d: '1885', tag: 'Mërgimi', t: 'Nisja për në Bukuresht', x: 'Pas ndërprerjes së shkollës në Korçë, shkon në Bukuresht te vëllezërit. Studion në Akademinë Tregtare dhe regjistrohet në Fakultetin e Shkencave Politike, pa e mbaruar.' },
  { y: '1889', d: '1889', tag: 'Vizitë', t: 'Vizita e parë në atdhe', x: 'Sipas ObserverKult, vizita e parë në Shqipëri pas nisjes është ajo e vitit 1889; do të vijnë edhe vizita të tjera më 1914 dhe 1937.' },
  { y: '1900', d: 'Rreth 1900', tag: 'Letërsia', t: 'Fillon të botojë', x: 'Fillon të botojë poezi e artikuj. Faik bej Konica e zbulon dhe e boton në revistën Albania; shkruan edhe për Kalendari Kombëtar dhe Drita.' },
  { y: '1904', d: '1904', tag: 'Vepra', t: 'Rreze dielli', x: 'Del përmbledhja e parë: 99 poezi në pesë cikle, kushtuar Skënderbeut. Poeti hyn në radhët e zërave më të rëndësishëm të Rilindjes.' },
  { y: '1912', d: '21 prill 1912', tag: 'Himni', t: 'Betimi mbi Flamur', x: 'Poezia botohet për herë të parë në gazetën Liri e Shqipërisë në Sofje, me titullin Betimi mbi Flamur.' },
  { y: '1912', d: '1912', tag: 'Vepra', t: 'Ëndrra e lotë', x: 'Boton përmbledhjen e dytë, përsëri me 99 poezi, kushtuar Edith Durham. Konsiderohet hap nga Romantizmi drejt Realizmit.' },
  { y: '1912', d: '5 nëntor 1912', tag: 'Historia', t: 'Kuvendi i Bukureshtit', x: 'Merr pjesë në Kuvendin e Bukureshtit, ku shqiptarët e diasporës shpallin pavarësinë e Shqipërisë.' },
  { y: '1912', d: '28 nëntor 1912', tag: 'Himni', t: 'Himn kombëtar', x: 'Poezia e tij, e kënduar me melodinë e Ciprian Porumbescut, pranohet si himn kombëtar shqiptar.' },
  { y: '1913', d: '1913 – 1925', tag: 'Veprimtari', t: 'Sekretar i kolonisë', x: 'Shërben si sekretar i kolonisë shqiptare në Rumani.' },
  { y: '1914', d: '1914', tag: 'Vizitë', t: 'Kthimi i shkurtër', x: 'Kthehet për pak kohë në Shqipëri; sipas disa burimeve, i zhgënjyer nga gjendja, rikthehet në Rumani.' },
  { y: '1922', d: '1922 – 1934', tag: 'Veprimtari', t: 'Sekretar i Konsullatës', x: 'Punon, me ndërprerje, si sekretar i Konsullatës shqiptare në Bukuresht.' },
  { y: '1930', d: '1930', tag: 'Vepra', t: 'Psalme murgu', x: 'Botohet përmbledhja e tretë, në katër cikle, me frymë moderniste dhe simboliste.' },
  { y: '1937', d: '1937', tag: 'Vizitë', t: 'Vizita e fundit', x: 'Vizitë e fundit e njohur në Shqipëri, sipas ObserverKult.' },
  { y: '1947', d: '11 dhjetor 1947', tag: 'Vdekja', t: 'Ndahet nga jeta', x: 'Vdes në Bukuresht në moshën 75-vjeçare dhe varroset te varrezat Sfânta Vineri.' },
  { y: '1974', d: '1974', tag: 'Kujtesa', t: 'Kthimi në Drenovë', x: 'Sipas Wikipedisë, eshtrat e tij transferohen në Drenovë, në vendlindje.' },
  { y: '2021', d: '30 qershor 2021', tag: 'Kujtesa', t: 'Kartëmonedha 10 000 lekëshe', x: 'Banka e Shqipërisë nxjerr në qarkullim kartëmonedhën me portretin e Asdrenit.' }
];
const track = $('#tlTrack'), card = $('#tlCard');
let cur = 0;
events.forEach((ev, i) => {
  const b = document.createElement('button');
  b.className = 'tl-node';
  b.setAttribute('role', 'tab');
  b.innerHTML = `<strong>${ev.y}</strong><small>${ev.tag}</small>`;
  b.addEventListener('click', () => setEvent(i));
  track.appendChild(b);
});
function setEvent(i) {
  cur = Math.max(0, Math.min(events.length - 1, i));
  const ev = events[cur];
  $$('.tl-node', track).forEach((n, k) => {
    n.classList.toggle('on', k === cur);
    n.setAttribute('aria-selected', k === cur);
  });
  $('#tlDate').textContent = ev.d;
  $('#tlTag').textContent = ev.tag;
  $('#tlTitle').textContent = ev.t;
  $('#tlText').textContent = ev.x;
  $('#tlCount').textContent = `${cur + 1} / ${events.length}`;
  $('#tlFill').style.width = ((cur + 1) / events.length * 100) + '%';
  swap(card);
  const node = $$('.tl-node', track)[cur];
  const wrap = track.parentElement;
  wrap.scrollTo({ left: node.offsetLeft - wrap.clientWidth / 2 + node.clientWidth / 2, behavior: reduceMotion ? 'auto' : 'smooth' });
}
$('#tlPrev').addEventListener('click', () => setEvent(cur - 1));
$('#tlNext').addEventListener('click', () => setEvent(cur + 1));
$('#kronologjia').addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') setEvent(cur - 1);
  if (e.key === 'ArrowRight') setEvent(cur + 1);
});
setEvent(0);

/* ===== HARTA ===== */
const places = {
  drenove: { t: 'Drenovë · Korçë', y: '1872 – 1885', x: 'Vendlindja. Këtu kaloi fëmijërinë, mësoi në shkollën fillore greke të fshatit dhe vazhdoi në Korçë, derisa vdekja e babait ia ndërpreu shkollimin. Në vitin 1974 eshtrat e tij u sollën përsëri këtu, sipas Wikipedisë.' },
  vlore: { t: 'Vlorë', y: '28 nëntor 1912', x: 'Në qytetin e Pavarësisë, sipas burimeve, flamuri u ngrit me melodinë që do të bëhej Himni i Flamurit, i cili u pranua si himn më 28 nëntor 1912.' },
  sofje: { t: 'Sofje', y: '21 prill 1912', x: 'Në gazetën shqiptare Liri e Shqipërisë, që dilte në Sofje, u botua për herë të parë poezia Betimi mbi Flamur, nga e cila lindi himni.' },
  bukuresht: { t: 'Bukuresht', y: '1885 – 1947', x: 'Shtëpia e tij e gjatë në mërgim. Studioi, shkroi, mori pjesë në Kuvendin e 5 nëntorit 1912, shërbeu si sekretar i kolonisë shqiptare dhe i konsullatës, dhe vdiq këtu më 11 dhjetor 1947.' }
};
const pins = $$('.pin');
function showPlace(key) {
  const p = places[key];
  $('#miTitle').textContent = p.t;
  $('#miYears').textContent = p.y;
  $('#miText').textContent = p.x;
  pins.forEach(g => g.classList.toggle('sel', g.dataset.pin === key));
  swap($('#mapInfo'));
}
pins.forEach(g => {
  g.addEventListener('click', () => showPlace(g.dataset.pin));
  g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showPlace(g.dataset.pin); } });
});
pins[0].classList.add('sel');

/* ===== VEPRAT ===== */
const works = [
  {
    y: '1904', t: 'Rreze dielli', s: 'Përmbledhja e parë',
    x: 'Vëllimi që e vendosi Asdrenin në letërsinë shqipe. Ndjek traditën e Naim Frashërit, por i jep poezisë atdhetare një zë të ri e më të drejtpërdrejtë.',
    f: ['99 poezi', 'Kushtuar Skënderbeut', 'Pesë cikle tematike'],
    c: ['Atdhetare', 'Luftarake', 'Filozofike', 'Romantike', 'Satirike']
  },
  {
    y: '1912', t: 'Ëndrra e lotë', s: 'Përmbledhja e dytë',
    x: 'Libër i pjekurisë poetike, i botuar në vitin e Pavarësisë. Konsiderohet hap i rëndësishëm nga Romantizmi drejt Realizmit dhe përmban poezinë që u bë himn.',
    f: ['99 poezi', 'Kushtuar Edith Durham', 'Pesë cikle'],
    c: ['Atdheu', 'Natyra', 'Mendimi', 'Bukuria', 'Të përziera']
  },
  {
    y: '1930', t: 'Psalme murgu', s: 'Përmbledhja e tretë',
    x: 'Vëllimi më modern i tij, me një zë më të ndrojtur e më simbolist. Kritika e sheh si hyrjen e frymës moderniste në poezinë shqipe.',
    f: ['Katër cikle', 'Kalim drejt Simbolizmit', 'Strofa e simbole të reja'],
    c: ['Flamuri dhe vatra', 'Vallja e jetës', 'Ngjyrat e ylberit', 'Lule e gjemba']
  },
  {
    y: '—', t: 'Kambana e Krujës', s: 'Vëllim i përgatitur',
    x: 'Një vëllim që poeti e la gati. Burimet nuk bien dakord nëse u botua gjatë jetës së tij: njëri e jep si të pabotuar, tjetri e lidh me vitin 1937.',
    f: ['Botimi mbetet i pasigurt sipas burimeve'],
    c: []
  }
];
const tabs = $('#workTabs'), panel = $('#workPanel');
works.forEach((w, i) => {
  const b = document.createElement('button');
  b.className = 'work-tab';
  b.setAttribute('role', 'tab');
  b.innerHTML = `<strong>${w.t}</strong><small>${w.y} · ${w.s}</small>`;
  b.addEventListener('click', () => showWork(i));
  tabs.appendChild(b);
});
function showWork(i) {
  const w = works[i];
  $$('.work-tab', tabs).forEach((t, k) => t.classList.toggle('on', k === i));
  $('#wYear').textContent = w.y;
  $('#wTitle').textContent = w.t;
  $('#wText').textContent = w.x;
  $('#wFacts').innerHTML = w.f.map(f => `<li>${f}</li>`).join('');
  $('#wCycles').innerHTML = w.c.map((c, k) => `<span class="cycle" style="animation-delay:${k * .09}s">${c}</span>`).join('');
  swap(panel);
}
showWork(0);

/* ===== RRUGA E HIMNIT ===== */
const steps = [
  { t: 'Poezia', x: 'Më 21 prill 1912 poezia “Betimi mbi Flamur” u botua në Sofje, në gazetën Liri e Shqipërisë. Më vonë hyri në vëllimin Ëndrra e lotë. Wikipedia e cilëson si përshtatje të qartë të këngës rumune “Hora Unirii” të Vasile Alecsandrit.' },
  { t: 'Melodia', x: 'Muzika vjen nga kënga patriotike rumune “Pe-al nostru steag e scris Unire” e Ciprian Porumbescut, që besohet të jetë shkruar rreth vitit 1883. Porumbescu kishte studiuar në Vjenë, prandaj melodia ka ngjyrim gjermanik e austriak.' },
  { t: 'Vlora', x: 'Në ditët e Shpalljes së Pavarësisë në Vlorë, flamuri u ngrit me këtë melodi. Dy ditë me parë, më 26 nëntor, ai ishte ngritur nga Ismail Qemali, por burimi ynë flet vetëm për kënduarit e këngës gjatë ngritjes së flamurit.' },
  { t: 'Himni', x: 'Më 28 nëntor 1912 u pranua si himn kombëtar. Sipas kujtimeve, nuk ishte menduar fillimisht si himn, por populli e deshi aq shumë sa u shpall i tillë. Sot këndohet zakonisht vetëm strofa e parë.' }
];
const stepNav = $('#stepNav'), stepBody = $('.step-body');
steps.forEach((s, i) => {
  const b = document.createElement('button');
  b.className = 'step-btn';
  b.innerHTML = `<b>${i + 1}</b>${s.t}`;
  b.addEventListener('click', () => showStep(i));
  stepNav.appendChild(b);
});
function showStep(i) {
  $$('.step-btn', stepNav).forEach((b, k) => b.classList.toggle('on', k === i));
  $('#sTitle').textContent = steps[i].t;
  $('#sText').textContent = steps[i].x;
  $('#sFill').style.width = ((i + 1) / steps.length * 100) + '%';
  swap(stepBody);
}
showStep(0);

/* ===== KUIZI ===== */
const quiz = [
  { q: 'Ku lindi Asdreni?', o: ['Në Vlorë', 'Në Drenovë, pranë Korçës', 'Në Shkodër', 'Në Bukuresht'], a: 1, e: 'Lindi më 11 prill 1872 në Drenovë.' },
  { q: 'Cilit hero i kushtoi përmbledhjen “Rreze dielli”?', o: ['Ismail Qemalit', 'Naim Frashërit', 'Skënderbeut', 'Ali Pashë Tepelenës'], a: 2, e: '“Rreze dielli” (1904) iu kushtua Skënderbeut.' },
  { q: 'Kujt i kushtoi “Ëndrra e lotë” (1912)?', o: ['Edith Durham', 'Faik Konicës', 'Gjergj Fishtës', 'Nënës së tij'], a: 0, e: 'Vëllimi iu kushtua Edith Durham.' },
  { q: 'Kush e ka shkruar melodinë e Himnit të Flamurit?', o: ['Prenkë Jakova', 'Ciprian Porumbescu', 'Çesk Zadeja', 'Vasile Alecsandri'], a: 1, e: 'Melodia vjen nga kënga e Ciprian Porumbescut, rreth vitit 1883.' },
  { q: 'Cila revistë e botoi Asdrenin në fillimet e tij, me ndihmën e Faik Konicës?', o: ['Albania', 'Zëri i Kombit', 'Koha', 'Hylli i Dritës'], a: 0, e: 'Faik bej Konica e zbuloi dhe e botoi në revistën Albania.' },
  { q: 'Në cilin vit u nxor kartëmonedha 10 000 lekëshe me portretin e tij?', o: ['1947', '1974', '2012', '2021'], a: 3, e: 'Më 30 qershor 2021, nga Banka e Shqipërisë.' }
];
let qi = 0, score = 0, answered = false;
const qBox = $('#quiz');
function renderQ() {
  answered = false;
  const q = quiz[qi];
  $('#qNo').textContent = `Pyetja ${qi + 1} / ${quiz.length}`;
  $('#qScore').textContent = `Pikë: ${score}`;
  $('#qText').textContent = q.q;
  $('#qFeedback').textContent = '';
  $('#qNext').hidden = true;
  $('#qNext').textContent = qi === quiz.length - 1 ? 'Shiko rezultatin' : 'Vazhdo';
  const wrap = $('#qOptions');
  wrap.innerHTML = '';
  q.o.forEach((opt, k) => {
    const b = document.createElement('button');
    b.className = 'q-opt';
    b.textContent = opt;
    b.addEventListener('click', () => pick(k, b));
    wrap.appendChild(b);
  });
}
function pick(k, btn) {
  if (answered) return;
  answered = true;
  const q = quiz[qi];
  $$('.q-opt').forEach((b, i) => {
    b.disabled = true;
    if (i === q.a) b.classList.add('right');
  });
  if (k === q.a) { score++; $('#qFeedback').textContent = '✓ Saktë! ' + q.e; }
  else { btn.classList.add('wrong'); $('#qFeedback').textContent = '✗ Jo aq saktë. ' + q.e; }
  $('#qScore').textContent = `Pikë: ${score}`;
  $('#qNext').hidden = false;
}
$('#qNext').addEventListener('click', () => {
  qi++;
  if (qi < quiz.length) { renderQ(); return; }
  const msg = score === quiz.length ? 'Njohës i përsosur i Asdrenit!' : score >= 4 ? 'Shumë mirë! E njeh mirë poetin.' : score >= 2 ? 'Mirë, por ia vlen të lexosh edhe një herë biografinë.' : 'Fillim i mirë. Rilexo biografinë dhe provo përsëri.';
  qBox.innerHTML = `<div class="quiz-end"><strong>${score}/${quiz.length}</strong><p>${msg}</p><button class="btn dark" id="qRestart">Provo përsëri</button></div>`;
  $('#qRestart').addEventListener('click', () => {
    location.hash = '#kuizi';
    qi = 0; score = 0;
    qBox.innerHTML = `<div class="q-top"><span id="qNo"></span><span id="qScore"></span></div><h3 id="qText"></h3><div class="q-options" id="qOptions"></div><p class="q-feedback" id="qFeedback" aria-live="polite"></p><button class="btn dark" id="qNext" hidden>Vazhdo</button>`;
    bindNext();
    renderQ();
  });
});
function bindNext() {
  $('#qNext').addEventListener('click', () => {
    qi++;
    if (qi < quiz.length) renderQ();
    else $('#qNext').dispatchEvent(new Event('finish'));
  });
}
renderQ();

/* ===== LIGHTBOX ===== */
const lb = $('#lightbox');
$$('.g-item').forEach(f => f.addEventListener('click', () => {
  const img = $('img', f);
  $('#lbImg').src = img.src.replace(/width=\d+/, 'width=1400');
  $('#lbImg').alt = img.alt;
  $('#lbCap').textContent = $('figcaption', f).textContent;
  lb.showModal();
}));
$('#lbClose').addEventListener('click', () => lb.close());
lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });
