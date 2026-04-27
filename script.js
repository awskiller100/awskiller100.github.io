const dot  = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
(function loop() {
  dot.style.left  = mx + 'px'; dot.style.top  = my + 'px';
  rx += (mx - rx) * 0.13;     ry += (my - ry) * 0.13;
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(loop);
})();
document.querySelectorAll('a,button,.gc,.pc').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cx'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cx'));
});

const canvas = document.getElementById('snow');
const ctx    = canvas.getContext('2d');
let W, H;
function setSize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
setSize();
window.addEventListener('resize', setSize);
const R = (a,b) => Math.random()*(b-a)+a;

function drawFlake(ctx, x, y, r, rot, opacity) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.strokeStyle = `rgba(210,228,255,${opacity})`;
  ctx.lineWidth = r * 0.18;
  ctx.lineCap = 'round';
  for (let i = 0; i < 6; i++) {
    ctx.save();
    ctx.rotate((Math.PI / 3) * i);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -r);
    ctx.stroke();
 
    const bLen = r * 0.38;
    const bY   = r * 0.52;
    ctx.beginPath();
    ctx.moveTo(0, -bY);
    ctx.lineTo( bLen * 0.7, -bY - bLen * 0.7);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -bY);
    ctx.lineTo(-bLen * 0.7, -bY - bLen * 0.7);
    ctx.stroke();

    const sLen = r * 0.22;
    const sY   = r * 0.28;
    ctx.beginPath();
    ctx.moveTo(0, -sY);
    ctx.lineTo( sLen * 0.7, -sY - sLen * 0.7);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -sY);
    ctx.lineTo(-sLen * 0.7, -sY - sLen * 0.7);
    ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
}

const flakes = Array.from({length: 90}, () => ({
  x:   R(0, window.innerWidth), y: R(-H, H),
  s:   R(3, 9),
  sp:  R(0.3, 1.6), dr: R(-0.15, 0.15),
  op:  R(0.08, 0.45),
  rot: R(0, Math.PI * 2), rspd: R(-0.008, 0.008),
  tw:  R(0, Math.PI * 2), tws: R(0.005, 0.016),
  ly:  Math.floor(R(0, 3))
}));

let scrollY = 0;
window.addEventListener('scroll', () => { scrollY = window.scrollY; }, {passive: true});
let last = 0;
function drawSnow(ts) {
  const dt = Math.min(ts - last, 50); last = ts;
  ctx.clearRect(0, 0, W, H);
  for (let i = 0; i < flakes.length; i++) {
    const f = flakes[i];
    f.tw  += f.tws;
    f.rot += f.rspd;
    const par = f.ly === 0 ? scrollY * 0.01 : f.ly === 1 ? scrollY * 0.022 : scrollY * 0.04;
    const dy  = ((f.y - par % H + H) % (H + 20));
    const pulseOpacity = f.op * (0.75 + 0.25 * Math.sin(f.tw));
    drawFlake(ctx, f.x, dy, f.s, f.rot, pulseOpacity);
    const spd = f.ly === 0 ? 0.5 : f.ly === 1 ? 1 : 1.5;
    f.y += f.sp * spd * (dt / 16);
    f.x += f.dr;
    if (f.y > H + 10) { f.y = -10; f.x = R(0, W); }
    if (f.x >  W + 8) f.x = -8;
    if (f.x < -8)     f.x = W + 8;
  }
  requestAnimationFrame(drawSnow);
}
requestAnimationFrame(drawSnow);
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => { nav.classList.toggle('sc', window.scrollY > 40); }, {passive:true});

const burger  = document.getElementById('burger');
const mobMenu = document.getElementById('mobMenu');
burger.addEventListener('click', () => { burger.classList.toggle('op'); mobMenu.classList.toggle('op'); });
document.querySelectorAll('.mlink').forEach(l => l.addEventListener('click', () => {
  burger.classList.remove('op'); mobMenu.classList.remove('op');
}));

const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('on'); obs.unobserve(e.target); } });
}, {threshold:0.1, rootMargin:'0px 0px -30px 0px'});
document.querySelectorAll('.ru,.rr').forEach(el => obs.observe(el));
setTimeout(() => document.querySelectorAll('#hero .ru, #hero .rr').forEach(el => el.classList.add('on')), 120);

const cobs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { countUp(e.target); cobs.unobserve(e.target); } });
}, {threshold:0.5});
document.querySelectorAll('.cnt').forEach(el => cobs.observe(el));
function countUp(el) {
  const t = +el.dataset.t, d = 1500, t0 = performance.now();
  (function tick(now) {
    const p = Math.min((now-t0)/d,1), e = 1-Math.pow(1-p,3);
    el.textContent = Math.floor(e*t);
    if (p < 1) requestAnimationFrame(tick); else el.textContent = t;
  })(t0);
}

const bobs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('go'); bobs.unobserve(e.target); } });
}, {threshold:0.5});
document.querySelectorAll('.sfill').forEach(b => bobs.observe(b));

const projects = [ //those are the projects, you can change the images, titles, and the type, deliverables, and timeline there.
  {
    num: '01', cat: 'GFX • Branding', title: 'Neon Blade Studios',
    img: 'images/first gfx.jpg',
    desc: 'A nice GFX I made.',
    details: [{label:'Type',value:'GFX'},{label:'Deliverables',value:'Logo, Type, Assets'},{label:'Timeline',value:'5 days'}],
    tags: ['Logo Design','Typography','Brand Guidelines','Asset Kit','Digital']
  },
  {
    num: '02', cat: 'GFX • Digital Art', title: 'Arctic Warfare Series',
    img: 'images/second gfx.jpg',
    desc: 'A nice GFX I made.',
    details: [{label:'Type',value:'GFX'},{label:'Deliverables',value:'8 Thumbnails'},{label:'Timeline',value:'4 days'}],
    tags: ['Thumbnail Design','Roblox GFX','Cinematic','Digital Art','Series']
  },
  {
    num: '03', cat: 'GFX • UI Kit', title: 'Frost UI Framework',
    img: 'images/third gfx.jpg',
    desc: 'A nice GFX I made.',
    details: [{label:'Type',value:'GFX'},{label:'Deliverables',value:'60+ Components'},{label:'Timeline',value:'7 days'}],
    tags: ['UI Design','Component Library','Glassmorphism','Roblox','HUD']
  },
  {
    num: '04', cat: 'GFX • Illustration', title: 'Phantom Protocol',
    img: 'images/forth gfxc.jpg',
    desc: 'A nice GFX I made.',
    details: [{label:'Type',value:'GFX'},{label:'Deliverables',value:'12 Renders'},{label:'Timeline',value:'6 days'}],
    tags: ['Character Art','Renders','Promotional','Dark Theme','Roblox']
  },
  {
    num: '05', cat: 'GFX • Branding', title: 'StarForge Community',
    img: 'images/fifth gfx.jpg',
    desc: 'A nice GFX I made.',
    details: [{label:'Type',value:'GFX'},{label:'Deliverables',value:'Banners, Icons, Badges'},{label:'Timeline',value:'3 days'}],
    tags: ['Discord Branding','Banner Design','Icons','Community','Server Art']
  },
  {
    num: '06', cat: 'GFX • Identity', title: 'CrimsonEdge Esports',
    img: 'images/sixth gfx.jpg',
    desc: 'A nice GFX I made.',
    details: [{label:'Type',value:'GFX'},{label:'Deliverables',value:'Logo, Jersey, Kit'},{label:'Timeline',value:'5 days'}],
    tags: ['Logo Design','Esports','Team Branding','Social Kit','Roblox']
  },
  {
    num: '07', cat: 'GFX • Digital Art', title: 'Project Seven',
    img: 'images/seventh gfx.jpg',
    desc: 'A nice GFX I made.',
    details: [{label:'Type',value:'GFX'},{label:'Deliverables',value:'Custom Asset'},{label:'Timeline',value:'3 days'}],
    tags: ['Roblox GFX','Digital Art']
  },
  {
    num: '08', cat: 'GFX • Branding', title: 'Project Eight',
    img: 'images/eighth gfx.jpg',
    desc: 'A nice GFX I made.',
    details: [{label:'Type',value:'GFX'},{label:'Deliverables',value:'Custom Asset'},{label:'Timeline',value:'3 days'}],
    tags: ['Roblox GFX','Branding']
  },
  {
    num: '09', cat: 'GFX • Identity', title: 'Project Nine',
    img: 'images/ninth gfx.jpg',
    desc: 'A nice GFX I made.',
    details: [{label:'Type',value:'GFX'},{label:'Deliverables',value:'Custom Asset'},{label:'Timeline',value:'3 days'}],
    tags: ['Roblox GFX','Identity']
  },
  {
    num: '10', cat: 'GFX • UI Kit', title: 'Project Ten',
    img: 'images/tenth gfx.jpg',
    desc: 'A nice GFX I made.',
    details: [{label:'Type',value:'GFX'},{label:'Deliverables',value:'Custom Asset'},{label:'Timeline',value:'3 days'}],
    tags: ['Roblox GFX','UI Design']
  },
  {
    num: '11', cat: 'GFX • Digital Art', title: 'Project Eleven',
    img: 'images/eleventh gfx.jpg',
    desc: 'A nice GFX I made.',
    details: [{label:'Type',value:'GFX'},{label:'Deliverables',value:'Custom Asset'},{label:'Timeline',value:'3 days'}],
    tags: ['Roblox GFX','Digital Art']
  },
  {
    num: '12', cat: 'GFX • Branding', title: 'Project Twelve',
    img: 'images/twelfth gfx.jpg',
    desc: 'A nice GFX I made.',
    details: [{label:'Type',value:'GFX'},{label:'Deliverables',value:'Custom Asset'},{label:'Timeline',value:'3 days'}],
    tags: ['Roblox GFX','Branding']
  }
];

function toggleMore() {
  const extras = document.querySelectorAll('.extra-card');
  const btn = document.getElementById('viewMoreBtn');
  const hidden = extras[0].style.display === 'none';
  extras.forEach(c => {
    c.style.display = hidden ? '' : 'none';
    if (hidden) setTimeout(() => c.classList.add('on'), 50);
    else c.classList.remove('on');
  });
  btn.textContent = hidden ? 'View Less ↑' : 'View More ↓';
}

const backdrop = document.getElementById('modalBackdrop');
const mClose   = document.getElementById('modalClose');

document.querySelectorAll('.pc').forEach(card => {
  card.addEventListener('click', () => {
    const p = projects[+card.dataset.project];

    const imgEl      = document.getElementById('mImg');
    const fallbackEl = document.getElementById('mImgFallback');

    imgEl.src = p.img;
    imgEl.style.display = 'block';
    fallbackEl.style.display = 'block';
    imgEl.onload  = () => { fallbackEl.style.display = 'none'; };
    imgEl.onerror = () => { imgEl.style.display = 'none'; fallbackEl.style.display = 'block'; };

    document.getElementById('mNum').textContent   = p.num;
    document.getElementById('mCat').textContent   = p.cat;
    document.getElementById('mTitle').textContent = p.title;
    document.getElementById('mDesc').textContent  = p.desc;
    document.getElementById('mDetails').innerHTML = p.details.map(d =>
      `<div class="modal-detail-item"><div class="detail-label">${d.label}</div><div class="detail-value">${d.value}</div></div>`
    ).join('');
    document.getElementById('mTags').innerHTML = p.tags.map(t => `<span>${t}</span>`).join('');

    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

function closeModal() {
  backdrop.classList.remove('open');
  document.body.style.overflow = '';
}
mClose.addEventListener('click', closeModal);
backdrop.addEventListener('click', e => { if (e.target === backdrop) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({behavior:'smooth'}); }
  });
});