// FORZIN CLIPS — web: animaciones e interacción. Sin librerías externas ni rastreadores.
// Lista de espera: cuando tengas el formulario de Google, pega aquí su enlace. Mientras esté vacío, el botón abre un correo.
const WAITLIST_URL = '';
const CONTACT = 'Jordanmarmolejosanchez@gmail.com';
const LANCH = new Date('2027-01-15T00:00:00-05:00'); // fecha orientativa del lanzamiento (enero 2027)

(() => {
  const es = document.documentElement.lang !== 'en';
  // Cabecera con fondo al bajar
  const top = document.querySelector('.top');
  const onScroll = () => top && top.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  // Menú en móvil
  const mb = document.querySelector('.menu-btn'), nav = document.querySelector('.nav');
  if (mb && nav) { mb.addEventListener('click', () => { const o = nav.classList.toggle('open'); mb.setAttribute('aria-expanded', String(o)); }); nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open'))); }

  // Lista de espera
  document.querySelectorAll('[data-waitlist]').forEach(a => {
    if (WAITLIST_URL) { a.href = WAITLIST_URL; a.target = '_blank'; a.rel = 'noopener'; }
    else a.href = `mailto:${CONTACT}?subject=${encodeURIComponent(es ? 'Avísame del lanzamiento de FORZIN CLIPS' : 'Notify me when FORZIN CLIPS launches')}&body=${encodeURIComponent(es ? 'Hola, quiero saber cuándo sale FORZIN CLIPS.' : 'Hi, I would like to know when FORZIN CLIPS is released.')}`;
  });

  // Palabras que rotan en el titular
  const rot = document.querySelector('.rotator');
  if (rot) {
    const words = (rot.dataset.words || '').split('|'); let i = 0;
    setInterval(() => { i = (i + 1) % words.length; rot.innerHTML = `<span>${words[i]}</span>`; }, 2200);
    // La palabra va en su propia línea de alto fijo; si la más larga no cabe a lo ancho, se encoge un poco para que nada se mueva
    const fit = () => {
      rot.style.fontSize = '';
      const probe = document.createElement('span'); probe.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;animation:none';
      rot.append(probe); let max = 0; words.forEach(w => { probe.textContent = w; max = Math.max(max, probe.getBoundingClientRect().width); }); probe.remove();
      const avail = rot.getBoundingClientRect().width;
      if (max > avail) rot.style.fontSize = `${(avail / max) * 0.98}em`;
    };
    fit(); window.addEventListener('resize', fit); if (document.fonts) document.fonts.ready.then(fit);
  }

  // Aparecer al bajar
  const io = new IntersectionObserver(es2 => es2.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  // Línea de los pasos
  const steps = document.querySelector('.steps');
  if (steps) new IntersectionObserver(e => { if (e[0].isIntersecting) steps.style.setProperty('--prog', '1'); }, { threshold: 0.4 }).observe(steps);

  // La captura principal empieza inclinada y se endereza (y crece) al bajar
  const hs = document.querySelector('.hero .shot');
  if (hs) {
    if (matchMedia('(prefers-reduced-motion:reduce)').matches) { hs.style.setProperty('--tilt', '0deg'); hs.style.setProperty('--sc', '1'); }
    else {
      let raf = 0;
      const upd = () => { raf = 0; const r = hs.getBoundingClientRect(); const k = Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight * 0.75))); hs.style.setProperty('--tilt', `${22 * (1 - k)}deg`); hs.style.setProperty('--sc', String(0.92 + 0.08 * k)); };
      window.addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(upd); }, { passive: true });
      window.addEventListener('resize', upd); upd();
    }
  }
  // Brillo de las tarjetas que sigue al ratón
  document.querySelectorAll('.card').forEach(c => c.addEventListener('pointermove', e => {
    const r = c.getBoundingClientRect(); c.style.setProperty('--mx', `${e.clientX - r.left}px`); c.style.setProperty('--my', `${e.clientY - r.top}px`);
  }));

  // Pestañas de funciones (también con flechas del teclado)
  const tabs = [...document.querySelectorAll('.tab')];
  const show = t => {
    tabs.forEach(x => { const on = x === t; x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1; const p = document.getElementById(x.getAttribute('aria-controls')); if (p) { p.hidden = !on; p.classList.toggle('show', on); } });
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => { show(t); auto = false; });
    t.addEventListener('keydown', e => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { const n = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length]; show(n); n.focus(); auto = false; } });
  });
  // Recorrido automático de las pestañas hasta que el usuario toque una
  let auto = true, ti = 0;
  const feats = document.querySelector('#funciones, #features');
  if (tabs.length && feats) {
    let visible = false;
    new IntersectionObserver(e => { visible = e[0].isIntersecting; }, { threshold: 0.3 }).observe(feats);
    setInterval(() => { if (auto && visible && !matchMedia('(prefers-reduced-motion:reduce)').matches) { ti = (tabs.findIndex(t => t.getAttribute('aria-selected') === 'true') + 1) % tabs.length; show(tabs[ti]); } }, 5000);
  }

  // Cuenta atrás al lanzamiento
  const cd = document.querySelector('.count');
  if (cd) {
    const set = (k, v) => { const el = cd.querySelector(`[data-k="${k}"]`); if (el) el.textContent = String(v).padStart(2, '0'); };
    const tick = () => { let s = Math.max(0, Math.floor((LANCH - Date.now()) / 1000)); set('d', Math.floor(s / 86400)); s %= 86400; set('h', Math.floor(s / 3600)); s %= 3600; set('m', Math.floor(s / 60)); set('s', s % 60); };
    tick(); setInterval(tick, 1000);
  }
  // Momentos en directo: chat que sube y espectadores que cambian (solo decorativo)
  const live = document.querySelectorAll('.lv');
  if (live.length) {
    const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
    const nicks = ['nachoX', 'lu_gamer', 'kevo.tv', 'sofi_99', 'elprofe', 'mika', 'dani_rx', 'vale.live', 'tito23', 'zoe_k', 'rulo', 'pau.fps'];
    const msgs = es ? ['JAJAJA 😂', '¡CLIP ESO!', 'NO PUEDE SER 😱', '🔥🔥🔥', 'otra vez!!', 'qué crack', 'FORZIN 👀', 'me muero 💀', 'GG', 'eso va a TikTok', 'LOCURA', '¿lo viste??']
                     : ['LMAO 😂', 'CLIP IT!', 'NO WAY 😱', '🔥🔥🔥', 'again!!', 'what a legend', 'FORZIN 👀', "I'm dead 💀", 'GG', 'that goes on TikTok', 'INSANE', 'did you see that??'];
    const cols = ['#FFB347', '#7DF9FF', '#FF6A2E', '#D4FF3A', '#FF8FB1', '#B9A8FF'];
    const pick = a => a[Math.floor(Math.random() * a.length)];
    const fmt = n => es ? (n >= 1000 ? (n / 1000).toFixed(1).replace('.', ',') + ' mil' : String(n)) : (n >= 1000 ? (n / 1000).toFixed(1) + 'K' : String(n));
    const add = chat => {
      const p = document.createElement('p'); const b = document.createElement('b');
      b.textContent = pick(nicks); b.style.color = pick(cols); p.append(b, ' ' + pick(msgs));
      chat.append(p); while (chat.children.length > 4) chat.firstElementChild.remove();
    };
    live.forEach(card => {
      const chat = card.querySelector('.chat'), v = card.querySelector('.views b');
      let n = +card.dataset.v || 1200, on = false;
      for (let i = 0; i < 3; i++) add(chat);
      v.textContent = fmt(n);
      if (reduce) return;
      new IntersectionObserver(e => { on = e[0].isIntersecting; }, { threshold: 0.2 }).observe(card);
      setInterval(() => { if (on) add(chat); }, 1300 + Math.random() * 1400);
      setInterval(() => { if (on) { n = Math.max(200, n + Math.round((Math.random() - 0.35) * n * 0.02)); v.textContent = fmt(n); } }, 2000);
    });
  }

  // Año del pie
  document.querySelectorAll('[data-year]').forEach(y => { y.textContent = new Date().getFullYear(); });
})();
