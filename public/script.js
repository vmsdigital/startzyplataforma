(() => {
  'use strict';
  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const motionButton = document.getElementById('motion-toggle');
  let savedMotion = null;
  try { savedMotion = localStorage.getItem('startzy-motion'); } catch (_) {}
  let reduceMotion = savedMotion === null ? reduced.matches : savedMotion === 'reduced';
  function setMotion(value, persist = false) {
    reduceMotion = value;
    root.classList.toggle('reduce-motion', value);
    if (motionButton) {
      motionButton.setAttribute('aria-pressed', String(value));
      motionButton.textContent = value ? 'Movimento reduzido' : 'Reduzir movimento';
    }
    if (value) document.querySelectorAll('.reveal').forEach(el => el.classList.remove('waiting'));
    if (persist) { savedMotion = value ? 'reduced' : 'full'; try { localStorage.setItem('startzy-motion', savedMotion); } catch (_) {} }
  }
  setMotion(reduceMotion);
  motionButton?.addEventListener('click', () => setMotion(!reduceMotion, true));
  reduced.addEventListener?.('change', e => { if (savedMotion === null) setMotion(e.matches); });

  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.nav-links');
  function closeMenu(returnFocus = false) {
    menu?.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Abrir menu');
    document.body.classList.remove('menu-open');
    if (returnFocus) menuButton?.focus();
  }
  menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    menu.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
  });
  document.addEventListener('click', e => {
    if (menu?.classList.contains('open') && !e.target.closest('.nav-capsule')) closeMenu();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu?.classList.contains('open')) closeMenu(true);
  });
  document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', () => closeMenu()));
  window.matchMedia('(min-width:651px)').addEventListener?.('change', e => { if (e.matches) closeMenu(); });

  function wireTabs(listSelector, tabSelector, onSelect) {
    const list = document.querySelector(listSelector);
    if (!list) return;
    const tabs = Array.from(list.querySelectorAll(tabSelector));
    function activate(tab, focus = false) {
      tabs.forEach(item => {
        const selected = item === tab;
        item.setAttribute('aria-selected', String(selected));
        item.tabIndex = selected ? 0 : -1;
        item.classList.toggle('active', selected);
        const panel = document.getElementById(item.getAttribute('aria-controls'));
        if (panel) {
          clearTimeout(panel._t);
          if (selected) {
            panel.hidden = false;
            panel.classList.remove('leaving');
            panel.classList.remove('panel-enter');
            void panel.offsetWidth;
            panel.classList.toggle('panel-enter', !reduceMotion);
          } else if (!panel.hidden && !reduceMotion && panel.classList.contains('service-panel')) {
            panel.classList.remove('panel-enter');
            panel.classList.add('leaving');
            panel._t = setTimeout(() => { panel.hidden = true; panel.classList.remove('leaving'); }, 1000);
          } else {
            panel.hidden = true;
          }
        }
      });
      if (focus) tab.focus();
      onSelect?.(tab);
    }
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => activate(tab));
      tab.addEventListener('keydown', e => {
        let next = index;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (index + 1) % tabs.length;
        else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
        else if (e.key === 'Home') next = 0;
        else if (e.key === 'End') next = tabs.length - 1;
        else return;
        e.preventDefault();
        activate(tabs[next], true);
      });
    });
  }
  wireTabs('.service-tabs', '.service-tab');
  wireTabs('.review-selectors', '.review-selector');

  if ('IntersectionObserver' in window && !reduceMotion) {
    root.classList.add('js-animate');
    const reveals = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('waiting');
        entry.target.classList.add('in-view');
        reveals.unobserve(entry.target);
      }
    }), {threshold: .08, rootMargin: '0px 0px -20px 0px'});
    document.querySelectorAll('.reveal').forEach(el => {
      if (el.getBoundingClientRect().top > window.innerHeight) el.classList.add('waiting');
      reveals.observe(el);
    });
  }

  const form = document.getElementById('brief-form');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const name = String(data.get('nome') || '').trim();
    const company = String(data.get('empresa') || '').trim();
    const message = String(data.get('mensagem') || '').trim();
    const interest = String(data.get('interesse') || '').trim();
    if (!name || !message) {
      document.getElementById('form-status').textContent = 'Preencha seu nome e conte um pouco da sua ideia.';
      return;
    }
    const text = `Oi, Startzy! Meu nome é ${name}.${company ? `\nMinha empresa: ${company}.` : ''}\nInteresse: ${interest}.\n\n${message}`;
    const url = `https://wa.me/5511997513044?text=${encodeURIComponent(text)}`;
    const status = document.getElementById('form-status');
    status.replaceChildren(document.createTextNode('Conversa preparada. '));
    const fallback = document.createElement('a');
    fallback.href = url;
    fallback.target = '_blank';
    fallback.rel = 'noopener noreferrer';
    fallback.textContent = 'Abrir no WhatsApp';
    status.append(fallback);
    window.open(url, '_blank', 'noopener,noreferrer');
  });
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();

(() => {
  'use strict';
  const root = document.documentElement;
  root.classList.add('js');
  const reduce = () => root.classList.contains('reduce-motion');
  const body = document.body;
  const loader = document.querySelector('.loader');
  let started = performance.now(), finished = false;
  function finish() {
    if (finished) return; finished = true;
    body.classList.remove('loading');
    if (loader) { loader.classList.add('done'); setTimeout(() => root.classList.add('ready'), 500); setTimeout(() => loader.classList.add('gone'), 1800); }
    else root.classList.add('ready');
  }
  if (!loader || reduce()) finish();
  else {
    const go = () => setTimeout(finish, Math.max(0, 2600 - (performance.now() - started)));
    if (document.readyState === 'complete') go(); else window.addEventListener('load', go);
    setTimeout(finish, 5000);
  }
  const inView = el => { const r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight; };

  // Soluções: a seção fica fixa e troca de parte conforme a rolagem
  const track = document.querySelector('.svc-track');
  const stabs = Array.from(document.querySelectorAll('.service-tab'));
  const wide = window.matchMedia('(min-width:861px)');
  document.getElementById('tab-sites')?.click();
  function svcTotal() { return track.offsetHeight - innerHeight; }
  function svc() {
    if (!track || !wide.matches) return;
    const r = track.getBoundingClientRect();
    const p = Math.min(.999, Math.max(0, -r.top / svcTotal()));
    const i = Math.floor(p * stabs.length);
    if (!stabs[i].classList.contains('active')) stabs[i].click();
  }
  stabs.forEach((tab, i) => tab.addEventListener('click', e => {
    if (!e.isTrusted || !track || !wide.matches) return;
    const y = track.getBoundingClientRect().top + scrollY + svcTotal() * ((i + .5) / stabs.length);
    (window.__smoothTo ? window.__smoothTo(y, .08) : scrollTo({top: y, behavior: 'smooth'}));
  }));

  // Projetos: o card de baixo recua enquanto o próximo sobe por cima
  const cards = Array.from(document.querySelectorAll('.project-card'));
  function stack() {
    cards.forEach((card, i) => {
      const next = cards[i + 1];
      if (!next || !wide.matches || reduce()) { card.style.scale = ''; card.style.filter = ''; return; }
      const top = parseFloat(getComputedStyle(next).top) || 0;
      const q = Math.min(1, Math.max(0, 1 - (next.getBoundingClientRect().top - top) / (innerHeight * .8)));
      card.style.scale = String(1 - .05 * q);
      card.style.filter = 'brightness(' + (1 - .28 * q) + ')';
    });
  }

  // Parallax da hero
  const heroImg = document.querySelector('.hero-image');
  function hero() { if (heroImg && !reduce() && scrollY < innerHeight * 1.2) heroImg.style.setProperty('--py', (scrollY * .25) + 'px'); }

  let ticking = false;
  function onScroll() { if (ticking) return; ticking = true; requestAnimationFrame(() => { ticking = false; svc(); stack(); hero(); }); }
  addEventListener('scroll', onScroll, {passive: true});
  addEventListener('resize', onScroll);
  onScroll();

  // Avaliações em rotação automática
  const rl = document.querySelector('.review-layout');
  const rsel = Array.from(document.querySelectorAll('.review-selector'));
  if (rl && rsel.length) {
    let paused = false;
    const setPause = v => { paused = v; rl.classList.toggle('paused', v); };
    rl.addEventListener('pointerenter', () => setPause(true));
    rl.addEventListener('pointerleave', () => setPause(false));
    rl.addEventListener('focusin', () => setPause(true));
    rl.addEventListener('focusout', () => setPause(false));
    setInterval(() => {
      if (paused || document.hidden || reduce() || !inView(rl)) return;
      const cur = rsel.findIndex(t => t.classList.contains('active'));
      rsel[(cur + 1) % rsel.length].click();
    }, 7500);
  }

  // Rodapé: a linha azul se desenha ao chegar
  const footer = document.querySelector('.footer');
  if (footer && 'IntersectionObserver' in window) {
    new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { footer.classList.add('ribbon-on'); o.disconnect(); } }), {threshold: .15}).observe(footer);
  } else footer?.classList.add('ribbon-on');
})();

(() => {
  'use strict';
  const root = document.documentElement;
  const reduce = () => root.classList.contains('reduce-motion');
  const fine = window.matchMedia('(pointer:fine)').matches;
  let target = scrollY, current = scrollY, raf = 0, ease = .07;
  const max = () => root.scrollHeight - innerHeight;
  const clamp = v => Math.max(0, Math.min(max(), v));
  function loop() {
    const d = target - current;
    if (Math.abs(d) < .4) { current = target; scrollTo(0, current); raf = 0; return; }
    current += d * ease; scrollTo(0, current); raf = requestAnimationFrame(loop);
  }
  function smoothTo(y, e) { ease = e || .09; target = clamp(y); if (!raf) { current = scrollY; raf = requestAnimationFrame(loop); } }
  window.__smoothTo = smoothTo;
  if (fine) {
    root.classList.add('lerp');
    addEventListener('wheel', e => {
      if (e.ctrlKey || reduce() || document.body.classList.contains('loading') || document.body.classList.contains('menu-open')) return;
      if (e.target.closest && e.target.closest('textarea,select')) return;
      e.preventDefault();
      const dy = e.deltaY * (e.deltaMode === 1 ? 16 : 1);
      if (!raf) current = target = scrollY;
      ease = .11; target = clamp(target + dy * .9);
      if (!raf) raf = requestAnimationFrame(loop);
    }, {passive: false});
    addEventListener('scroll', () => { if (!raf) current = target = scrollY; }, {passive: true});
    document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
      const id = a.getAttribute('href'); if (!id || id.length < 2) return;
      const el = document.querySelector(id); if (!el) return;
      e.preventDefault();
      smoothTo(el.getBoundingClientRect().top + scrollY - (id === '#solucoes' ? 0 : 96), .08);
    }));
  }

  // Rodapé: "startzy" ocupa toda a largura da tela
  const fd = document.querySelector('.footer-display');
  function fit() {
    if (!fd) return;
    fd.style.fontSize = '100px';
    const rg = document.createRange(); rg.selectNodeContents(fd);
    const w = rg.getBoundingClientRect().width;
    if (w) fd.style.fontSize = (100 * innerWidth * .97 / w) + 'px';
  }
  fit(); addEventListener('resize', fit); addEventListener('load', fit);
  document.fonts && document.fonts.ready.then(fit);

  // Frase especial: "O futuro é glorioso!"
  const targets = document.querySelectorAll('.manifesto-signature, .founder-signoff span, .footer-top>p');
  const io = 'IntersectionObserver' in window ? new IntersectionObserver((es, o) => es.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('in'); o.unobserve(en.target); }
  }), {threshold: .5}) : null;
  targets.forEach(el => {
    const node = Array.from(el.childNodes).find(n => n.nodeType === 3 && n.textContent.trim().includes('glorioso'));
    if (!node) return;
    const text = node.textContent.trim();
    const wrap = document.createElement('span');
    wrap.className = 'gl'; wrap.setAttribute('aria-label', text);
    Array.from(text).forEach((ch, i) => {
      const s = document.createElement('span');
      s.className = ch === ' ' ? 'gl-char gl-sp' : 'gl-char';
      s.style.setProperty('--c', i); s.setAttribute('aria-hidden', 'true');
      s.textContent = ch === ' ' ? '\u00a0' : ch;
      wrap.append(s);
    });
    node.replaceWith(wrap);
    const host = el.classList.contains('gl') ? el : el;
    host.classList.add('gl-host');
    if (!host.classList.contains('manifesto-signature')) { if (io) io.observe(host); else host.classList.add('in'); }
  });
})();

(() => {
  'use strict';
  const root = document.documentElement;
  const reduce = () => root.classList.contains('reduce-motion');
  const track = document.querySelector('.mf-track');
  const card = document.querySelector('.manifesto');
  const h2 = card && card.querySelector('h2');
  if (!track || !h2) return;
  const words = [];
  Array.from(h2.childNodes).forEach(n => {
    if (n.nodeType !== 3) return;
    const frag = document.createDocumentFragment();
    n.textContent.split(/(\s+)/).forEach(p => {
      if (!p) return;
      if (/^\s+$/.test(p)) { frag.append(' '); return; }
      const s = document.createElement('span'); s.className = 'mf-w'; s.textContent = p; words.push(s); frag.append(s);
    });
    n.replaceWith(frag);
  });
  const sub = card.querySelector('.manifesto-copy>p:last-child');
  const rib = card.querySelector('.ribbon-art');
  const sig = card.querySelector('.manifesto-signature');
  const wide = window.matchMedia('(min-width:861px)');
  const clamp = v => Math.min(1, Math.max(0, v));
  function upd() {
    let p;
    if (reduce()) p = 1;
    else if (wide.matches) {
      const r = track.getBoundingClientRect();
      p = clamp((clamp(-r.top / (track.offsetHeight - innerHeight)) - .04) / .8);
    } else {
      const r = h2.getBoundingClientRect();
      p = clamp((innerHeight * .9 - r.top) / (innerHeight * .55 + r.height));
    }
    const n = words.length;
    words.forEach((w, i) => {
      const wp = clamp(p * (n + 3) - i);
      w.style.opacity = reduce() ? 1 : (.14 + .86 * wp).toFixed(3);
      w.style.transform = reduce() ? '' : 'translateY(' + ((1 - wp) * .45).toFixed(3) + 'em)';
      w.style.filter = reduce() ? '' : 'blur(' + ((1 - wp) * 7).toFixed(2) + 'px)';
    });
    if (sub) { const s = clamp((p - .8) / .15); sub.style.opacity = s; sub.style.transform = 'translateY(' + ((1 - s) * 24) + 'px)'; }
    if (rib && !reduce()) { rib.style.scale = (1 + p * .35).toFixed(3); rib.style.rotate = (-p * 12).toFixed(2) + 'deg'; }
    if (sig && p > .9) sig.classList.add('in');
  }
  let t = false;
  const run = () => { if (t) return; t = true; requestAnimationFrame(() => { t = false; upd(); }); };
  addEventListener('scroll', run, {passive: true}); addEventListener('resize', run);
  upd();
})();

(() => {
  'use strict';
  const root = document.documentElement, reduce = () => root.classList.contains('reduce-motion');
  const $$ = s => Array.from(document.querySelectorAll(s));
  // progresso de rolagem
  const bar = Object.assign(document.createElement('div'), {className: 'progress'}); document.body.append(bar);
  const upd = () => bar.style.setProperty('--p', (scrollY / Math.max(1, root.scrollHeight - innerHeight)).toFixed(4));
  addEventListener('scroll', upd, {passive: true}); upd();
  // títulos palavra por palavra
  $$('.section-heading h2, .founder h2, .faq-section h2, .contact h2, .care-copy h2, .pg-hero h1, .pg-cta h2').forEach(h => {
    let i = 0;
    (function walk(n) {
      Array.from(n.childNodes).forEach(c => {
        if (c.nodeType === 3) {
          const f = document.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach(t => { if (!t) return; if (/^\s+$/.test(t)) f.append(' '); else { const s = document.createElement('span'); s.className = 'w'; s.style.setProperty('--i', i++); s.textContent = t; f.append(s); } });
          c.replaceWith(f);
        } else if (c.nodeType === 1 && c.tagName !== 'BR') walk(c);
      });
    })(h);
  });
  // gatilhos de entrada
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) {
    const t = e.target; t.classList.add('on', 'words-in');
    t.querySelectorAll('.count').forEach(c => countUp(c)); io.unobserve(t);
  }}), {threshold: .2});
  $$('.section-heading h2, .founder h2, .faq-section h2, .contact h2, .care-copy h2, .pg-hero h1, .pg-cta h2, .care, .bento-grid').forEach(el => io.observe(el));
  function countUp(el) {
    const to = +el.dataset.to, suf = el.dataset.suf || '', t0 = performance.now(), d = 1900;
    const fmt = v => Math.round(v).toLocaleString('pt-BR') + suf;
    if (reduce()) { el.textContent = fmt(to); return; }
    (function f(t) { const p = Math.min(1, (t - t0) / d), e = 1 - Math.pow(1 - p, 3); el.textContent = fmt(to * e); if (p < 1) requestAnimationFrame(f); })(t0);
  }
  // inclinação 3D + holofote
  if (matchMedia('(pointer:fine)').matches) {
    $$('[data-tilt]').forEach(c => {
      c.addEventListener('pointermove', e => { if (reduce()) return; const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        c.style.setProperty('--mx', x * 100 + '%'); c.style.setProperty('--my', y * 100 + '%'); c.style.setProperty('--ry', ((x - .5) * 7) + 'deg'); c.style.setProperty('--rx', ((.5 - y) * 7) + 'deg'); });
      c.addEventListener('pointerleave', () => { c.style.setProperty('--rx', '0deg'); c.style.setProperty('--ry', '0deg'); });
    });
    // botões magnéticos
    $$('.button').forEach(b => {
      b.addEventListener('pointermove', e => { if (reduce()) return; const r = b.getBoundingClientRect(); b.style.translate = ((e.clientX - r.left - r.width / 2) * .22) + 'px ' + ((e.clientY - r.top - r.height / 2) * .3) + 'px'; });
      b.addEventListener('pointerleave', () => { b.style.translate = ''; });
    });
  }
  // parallax das fotos dos cards
  const ph = $$('.bcard.photo');
  addEventListener('scroll', () => { if (reduce()) return; ph.forEach(p => { const r = p.getBoundingClientRect(); if (r.bottom > 0 && r.top < innerHeight) p.style.setProperty('--ty', ((r.top + r.height / 2 - innerHeight / 2) * -.06).toFixed(1) + 'px'); }); }, {passive: true});
  // SEO: digitação ao abrir o painel
  const typed = document.querySelector('.typed'), seoPanel = document.getElementById('panel-seo');
  if (typed && seoPanel) {
    const full = typed.dataset.text; typed.textContent = full; let timer;
    const run = () => { clearInterval(timer); if (reduce()) { typed.textContent = full; return; } let i = 0; typed.textContent = ''; timer = setInterval(() => { typed.textContent = full.slice(0, ++i); if (i >= full.length) clearInterval(timer); }, 55); };
    new MutationObserver(() => { if (!seoPanel.hidden && seoPanel.classList.contains('panel-enter')) run(); }).observe(seoPanel, {attributes: true, attributeFilter: ['hidden', 'class']});
  }
})();
