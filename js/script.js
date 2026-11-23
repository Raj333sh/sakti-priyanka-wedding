'use strict';
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const EVENTS = {
    haldi: { name: 'Haldi & Mangalkrutya', date: '20261212', next: '20261213', note: 'Haldi & Mangalkrutya – Wedding of Priyanka & Sakti' },
    marriage: { name: 'Marriage & Panigrahan', date: '20261213', next: '20261214', note: 'Marriage & Panigrahan – Wedding of Priyanka & Sakti' },
    reception: { name: 'Reception', date: '20261213', next: '20261214', note: 'Reception – Dinner from 7:30 PM onwards' },
  };
  const LOCATION = 'SR CROWN, Cuttack Puri Bypass Road, Bhubaneswar, Odisha, India';
  const SHARE_TEXT = 'You are cordially invited to the wedding of Priyanka & Sakti – 12th & 13th December 2026 at SR CROWN, Bhubaneswar.';

  function toast(msg) {
    const t = $('#toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(toast.id); toast.id = setTimeout(() => t.classList.remove('show'), 3200);
  }

  /* Envelope */
  $('#openBtn').addEventListener('click', () => {
    $('#envelope').classList.add('open'); $('#openBtn').disabled = true;
    setTimeout(() => {
      $('#intro').classList.add('done'); document.body.classList.remove('locked');
      startMusic(true); revealInit();
    }, reduce ? 100 : 2400);
  });

  /* Music: uses assets/music/invitation.mp3 if present, else a soft generated drone */
  const musicBtn = $('#musicBtn');
  const audio = new Audio('assets/music/invitation.mp3'); audio.loop = true; audio.volume = 0.5;
  let mode = null, ctx = null, nodes = [], playing = false;
  function drone() {
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) throw new Error('no audio');
    ctx = ctx || new AC(); const g = ctx.createGain(); g.gain.value = 0.05; g.connect(ctx.destination);
    nodes = [130.81, 196, 261.63, 329.63].map(f => { const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = f; o.connect(g); o.start(); return o; });
    nodes.g = g; ctx.resume();
  }
  async function startMusic(auto) {
    try { await audio.play(); mode = 'file'; playing = true; }
    catch (e) {
      try { if (!nodes.length) drone(); else ctx.resume(); mode = 'drone'; playing = true; }
      catch (err) { playing = false; if (!auto) toast('Music is not available in this browser.'); }
    }
    syncMusic();
  }
  function stopMusic() { audio.pause(); if (ctx) ctx.suspend(); playing = false; syncMusic(); }
  function syncMusic() {
    musicBtn.classList.toggle('on', playing); musicBtn.setAttribute('aria-pressed', playing);
    musicBtn.setAttribute('aria-label', playing ? 'Turn music off' : 'Turn music on'); musicBtn.textContent = playing ? '♪' : '♫';
  }
  musicBtn.addEventListener('click', () => (playing ? stopMusic() : startMusic(false)));

  /* Nav, back to top */
  const burger = $('#burger'), menu = $('#menu');
  burger.addEventListener('click', () => { const o = menu.classList.toggle('open'); burger.setAttribute('aria-expanded', o); });
  $$('#menu a').forEach(a => a.addEventListener('click', () => { menu.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }));
  const topBtn = $('#topBtn');
  addEventListener('scroll', () => topBtn.classList.toggle('show', scrollY > 600), { passive: true });
  topBtn.addEventListener('click', () => scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));

  /* Scroll reveal */
  function revealInit() {
    const els = $$('.reveal');
    if (!('IntersectionObserver' in window)) return els.forEach(e => e.classList.add('in'));
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.15 });
    els.forEach(e => io.observe(e));
  }
  if (reduce) $$('.reveal').forEach(e => e.classList.add('in'));

  /* Petals / golden particles */
  if (!reduce) {
    const box = $('.petals'), glyphs = ['✿', '❀', '✦'];
    for (let i = 0; i < 14; i++) {
      const s = document.createElement('span');
      s.textContent = glyphs[i % 3]; s.style.left = Math.random() * 100 + '%';
      s.style.fontSize = 10 + Math.random() * 14 + 'px'; s.style.animationDuration = 9 + Math.random() * 10 + 's';
      s.style.animationDelay = -Math.random() * 15 + 's'; if (i % 3 === 2) s.style.color = '#e8c978';
      box.appendChild(s);
    }
  }

  /* Countdown to 13 Dec 2026, 00:00 Asia/Kolkata (UTC+05:30) */
  const target = new Date('2026-12-13T00:00:00+05:30').getTime();
  const pad = n => String(n).padStart(2, '0');
  function tick() {
    let d = target - Date.now();
    if (d <= 0) { $('#countdown').hidden = true; $('#cdDone').hidden = false; clearInterval(tick.id); return; }
    const s = Math.floor(d / 1000);
    $('#cd-d').textContent = pad(Math.floor(s / 86400)); $('#cd-h').textContent = pad(Math.floor(s % 86400 / 3600));
    $('#cd-m').textContent = pad(Math.floor(s % 3600 / 60)); $('#cd-s').textContent = pad(s % 60);
  }
  tick(); tick.id = setInterval(tick, 1000);

  /* Calendar: all-day entries only (no invented timings) */
  function gcal(key) {
    const e = EVENTS[key];
    return 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent(e.name + ' – Priyanka & Sakti') +
      '&dates=' + e.date + '/' + e.next + '&details=' + encodeURIComponent(e.note) + '&location=' + encodeURIComponent(LOCATION);
  }
  $$('[data-cal]').forEach(a => { a.href = gcal(a.dataset.cal); a.target = '_blank'; a.rel = 'noopener'; });
  $('#icsBtn').addEventListener('click', () => {
    try {
      const stamp = new Date().toISOString().replace(/[-:]|\.\d+/g, '');
      const ev = Object.entries(EVENTS).map(([k, e]) => ['BEGIN:VEVENT', `UID:${k}-priyanka-sakti-2026@wedding-invitation`, `DTSTAMP:${stamp}`,
        `DTSTART;VALUE=DATE:${e.date}`, `DTEND;VALUE=DATE:${e.next}`, `SUMMARY:${e.name} – Priyanka & Sakti`,
        `DESCRIPTION:${e.note}`, `LOCATION:${LOCATION.replace(/,/g, '\\,')}`, 'END:VEVENT'].join('\r\n'));
      const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Priyanka & Sakti//Wedding//EN', ...ev, 'END:VCALENDAR'].join('\r\n');
      const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
      const a = Object.assign(document.createElement('a'), { href: url, download: 'priyanka-sakti-wedding.ics' });
      document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
      toast('Calendar file downloaded.');
    } catch (e) { toast('Could not create the calendar file.'); }
  });

  /* Lightbox */
  const lb = $('#lb'), img = $('#lbImg'), thumbs = $$('.g img');
  let idx = 0, lastFocus = null;
  function show(i) {
    idx = (i + thumbs.length) % thumbs.length;
    img.classList.add('fade');
    setTimeout(() => { img.src = thumbs[idx].src; img.alt = thumbs[idx].alt; img.classList.remove('fade'); }, reduce ? 0 : 200);
  }
  function openLb(i) { lastFocus = document.activeElement; lb.hidden = false; document.body.classList.add('locked'); show(i); $('#lbClose').focus(); }
  function closeLb() { lb.hidden = true; if (document.body.querySelector('#intro.done')) document.body.classList.remove('locked'); lastFocus && lastFocus.focus(); }
  $$('.g').forEach((b, n) => b.addEventListener('click', () => openLb(n)));
  $('#lbClose').addEventListener('click', closeLb);
  $('#lbPrev').addEventListener('click', () => show(idx - 1)); $('#lbNext').addEventListener('click', () => show(idx + 1));
  lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
  addEventListener('keydown', e => {
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLb(); if (e.key === 'ArrowLeft') show(idx - 1); if (e.key === 'ArrowRight') show(idx + 1);
  });
  let sx = 0;
  lb.addEventListener('touchstart', e => { sx = e.changedTouches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1)); }, { passive: true });

  /* Sharing */
  const pageUrl = () => location.href.split('#')[0];
  const wa = $('#waShare');
  wa.href = 'https://wa.me/?text=' + encodeURIComponent(SHARE_TEXT + '\n' + pageUrl());
  $('#shareBtn').addEventListener('click', async () => {
    const data = { title: 'Sakti & Priyanka – Wedding Invitation', text: SHARE_TEXT, url: pageUrl() };
    try {
      if (navigator.share) { await navigator.share(data); return; }
      throw new Error('no share');
    } catch (e) {
      if (e.name === 'AbortError') return;
      try { await navigator.clipboard.writeText(SHARE_TEXT + ' ' + pageUrl()); toast('Invitation link copied to clipboard.'); }
      catch (err) { prompt('Copy this invitation link:', pageUrl()); }
    }
  });
})();
