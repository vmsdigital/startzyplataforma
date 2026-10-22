/* Startzy — Google Analytics 4 + Microsoft Clarity.
   >>> Cole abaixo os seus IDs (e só isso) <<< */
const STARTZY_IDS = { ga: 'G-XXXXXXXXXX', clarity: 'XXXXXXXXXX' };

(() => {
  'use strict';
  const ok = v => v && !/X{6,}/.test(v);
  if (!ok(STARTZY_IDS.ga) && !ok(STARTZY_IDS.clarity)) return;
  let loaded = false;
  function load() {
    if (loaded) return; loaded = true;
    if (ok(STARTZY_IDS.ga)) {
      const s = document.createElement('script'); s.async = true;
      s.src = 'https://www.googletagmanager.com/gtag/js?id=' + STARTZY_IDS.ga; document.head.append(s);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { dataLayer.push(arguments); };
      gtag('js', new Date()); gtag('config', STARTZY_IDS.ga, { anonymize_ip: true });
      document.addEventListener('click', e => {
        const a = e.target.closest('a[href*="wa.me"],a[href^="mailto:"]');
        if (a) gtag('event', 'generate_lead', { method: a.href.includes('wa.me') ? 'whatsapp' : 'email' });
      });
    }
    if (ok(STARTZY_IDS.clarity)) {
      (function (c, l, a, r, i, t, y) {
        c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
        t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
        y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
      })(window, document, 'clarity', 'script', STARTZY_IDS.clarity);
    }
  }
  let choice = null;
  try { choice = localStorage.getItem('startzy-cookies'); } catch (_) {}
  if (choice === 'sim') return load();
  if (choice === 'nao') return;
  addEventListener('DOMContentLoaded', () => {
    const b = document.createElement('div'); b.className = 'cookie'; b.setAttribute('role', 'dialog'); b.setAttribute('aria-label', 'Aviso de cookies');
    b.innerHTML = '<p>Usamos cookies de análise (Google Analytics e Microsoft Clarity) para entender como o site é usado. <a href="privacidade.html">Saiba mais</a></p><div><button data-v="nao">Recusar</button><button data-v="sim" class="ok">Aceitar</button></div>';
    b.addEventListener('click', e => {
      const v = e.target.dataset && e.target.dataset.v; if (!v) return;
      try { localStorage.setItem('startzy-cookies', v); } catch (_) {}
      b.remove(); if (v === 'sim') load();
    });
    document.body.append(b);
  });
})();
