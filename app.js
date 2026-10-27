(() => {
  'use strict';
  const cfg = window.WEDDING_CONFIG;
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);
  const setText = (selector, value) => $$(selector).forEach((el) => { el.textContent = value; });
  const escapeText = (value) => String(value ?? '').slice(0, 500);
  const formatDate = (dateStr, includeYear = true) => {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(Date.UTC(y, m - 1, d, 12));
    return new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', ...(includeYear ? { year: 'numeric' } : {}) }).format(date);
  };
  const formatTime = (time) => time ? `${time} WIB` : 'Waktu akan dikonfirmasi';
  setText('[data-bridegroom]', cfg.groom.name); setText('[data-bride]', cfg.bride.name);
  setText('[data-father-groom]', cfg.groom.father); setText('[data-mother-groom]', cfg.groom.mother);
  setText('[data-father-bride]', cfg.bride.father); setText('[data-mother-bride]', cfg.bride.mother);
  setText('[data-venue]', cfg.venue.address);
  setText('[data-akad-date]', formatDate(cfg.akad.date)); setText('[data-resepsi-date]', formatDate(cfg.resepsi.date));
  setText('[data-akad-time]', formatTime(cfg.akad.time));
  setText('[data-date-summary]', `${formatDate(cfg.akad.date, false)} – ${formatDate(cfg.resepsi.date, false)} ${cfg.akad.date.slice(0,4)}`);
  const photo = $('#couple-photo'); if (photo) { photo.src = cfg.couplePhoto; photo.alt = `Foto bersama ${cfg.groom.name} dan ${cfg.bride.name}`; }
  const maps = $('#maps-link'); if (maps) maps.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${cfg.venue.latitude},${cfg.venue.longitude}`)}`;

  $('#open-invitation')?.addEventListener('click', () => $('#pembuka')?.scrollIntoView({ behavior: 'smooth' }));
  const menu = $('#menu-toggle'); menu?.addEventListener('click', () => { const nav = $('.main-nav'); const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); nav?.classList.toggle('nav-open', open); });
  $$('.main-nav a').forEach((a) => a.addEventListener('click', () => { $('.main-nav')?.classList.remove('nav-open'); menu?.setAttribute('aria-expanded', 'false'); }));
  const revealObserver = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-visible'); revealObserver.unobserve(e.target); } }), { threshold: 0.08 }) : null;
  $$('.reveal').forEach((el) => revealObserver ? revealObserver.observe(el) : el.classList.add('is-visible'));

  const dateTimeFor = (date, time) => time ? new Date(`${date}T${time}:00+07:00`) : null;
  // Hitung mundur menuju tanggal resepsi, tanpa bergantung pada jam acara.
  const receptionDate = new Date(`${cfg.resepsi.date}T00:00:00+07:00`);
  const countdown = $('#countdown');
  const countdownStatus = $('#countdown-status');
  if (receptionDate && !Number.isNaN(receptionDate.getTime()) && countdown && countdownStatus) {
    const tick = () => {
      const diff = receptionDate.getTime() - Date.now();
      if (diff <= 0) {
        countdownStatus.hidden = false;
        countdownStatus.textContent = 'Hari resepsi telah tiba.';
        countdown.hidden = true;
        return;
      }
      countdownStatus.hidden = true;
      countdown.hidden = false;
      $('#cd-days').textContent = Math.floor(diff / 86400000).toLocaleString('id-ID');
      $('#cd-hours').textContent = String(Math.floor(diff / 3600000) % 24).padStart(2, '0');
      $('#cd-minutes').textContent = String(Math.floor(diff / 60000) % 60).padStart(2, '0');
      $('#cd-seconds').textContent = String(Math.floor(diff / 1000) % 60).padStart(2, '0');
    };
    tick(); window.setInterval(tick, 1000);
  }
  // Tautan kalender mencatat dua hari acara sebagai acara sepanjang hari; jam tidak diasumsikan.
  const calLink = $('#calendar-link');
  if (calLink) {
    const startDate = cfg.akad.date.replaceAll('-', '');
    const endDate = new Date(`${cfg.resepsi.date}T12:00:00+07:00`);
    endDate.setDate(endDate.getDate() + 1);
    const endStamp = `${endDate.getFullYear()}${String(endDate.getMonth() + 1).padStart(2, '0')}${String(endDate.getDate()).padStart(2, '0')}`;
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: `${cfg.title} — ${cfg.groom.name} & ${cfg.bride.name}`,
      dates: `${startDate}/${endStamp}`,
      details: 'Undangan pernikahan.',
      location: cfg.venue.address
    });
    calLink.href = `https://calendar.google.com/calendar/render?${params.toString()}`;
    calLink.target = '_blank'; calLink.rel = 'noopener noreferrer';
  }

  const form = $('#rsvp-form'); const attendance = $('#attendance'); const count = $('#guest-count'); const status = $('#rsvp-status'); const submit = $('#submit-rsvp');
  const syncCount = () => { if (attendance.value === 'Tidak Hadir') { count.value = '0'; count.disabled = true; } else { count.disabled = false; if (count.value === '0' || !count.value) count.value = '1'; } };
  attendance?.addEventListener('change', syncCount); syncCount();
  const showStatus = (message, type) => { status.textContent = message; status.className = `form-status ${type || ''}`; };
  const apiUrl = () => String(cfg.appsScriptUrl || '').trim();
  const loadGreetings = async () => {
    const list = $('#greetings-list'); const msg = $('#greetings-status');
    if (!apiUrl()) { msg.textContent = 'Ucapan belum dapat dimuat karena layanan RSVP belum dikonfigurasi.'; return; }
    msg.textContent = 'Memuat ucapan…';
    try {
      const url = new URL(apiUrl()); url.searchParams.set('action', 'greetings'); url.searchParams.set('limit', String(cfg.publicGreetingsLimit || 30));
      const response = await fetch(url.toString(), { method: 'GET', cache: 'no-store' });
      if (!response.ok) throw new Error('Layanan tidak merespons dengan baik.');
      const data = await response.json(); if (!data.success || !Array.isArray(data.greetings)) throw new Error(data.message || 'Format data tidak sesuai.');
      list.replaceChildren();
      if (!data.greetings.length) { msg.textContent = 'Belum ada ucapan yang disetujui untuk ditampilkan.'; return; }
      msg.remove();
      data.greetings.slice(0, cfg.publicGreetingsLimit || 30).forEach((item) => {
        const card = document.createElement('article'); card.className = 'greeting-card';
        const name = document.createElement('h3'); name.textContent = escapeText(item.name);
        const text = document.createElement('p'); text.textContent = escapeText(item.message);
        card.append(name, text); list.append(card);
      });
    } catch (err) { msg.textContent = 'Ucapan belum dapat dimuat saat ini. Silakan coba lagi nanti.'; }
  };
  $('#refresh-greetings')?.addEventListener('click', loadGreetings);
  if (apiUrl()) { loadGreetings(); window.setInterval(loadGreetings, Math.max(30000, cfg.refreshIntervalMs || 60000)); }

  form?.addEventListener('submit', async (event) => {
    event.preventDefault(); if (submit.disabled) return;
    if (!apiUrl()) { showStatus('Formulir belum aktif. Layanan RSVP perlu dikonfigurasi terlebih dahulu.', 'error'); return; }
    const name = $('#guest-name').value.trim(); const reply = attendance.value; const guests = reply === 'Tidak Hadir' ? 0 : Number(count.value); const message = $('#guest-message').value.trim(); const honeypot = $('#website-field').value;
    if (name.length < 2 || name.length > 80) { showStatus('Nama harus terdiri dari 2–80 karakter.', 'error'); $('#guest-name').focus(); return; }
    if (!['Hadir', 'Tidak Hadir'].includes(reply)) { showStatus('Silakan pilih konfirmasi kehadiran.', 'error'); attendance.focus(); return; }
    if (!Number.isInteger(guests) || guests < 0 || guests > 10 || (reply === 'Hadir' && guests < 1)) { showStatus('Jumlah tamu harus 1–10 jika hadir, atau 0 jika tidak hadir.', 'error'); count.focus(); return; }
    if (message.length > 500) { showStatus('Ucapan maksimal 500 karakter.', 'error'); return; }
    submit.disabled = true; submit.textContent = 'Mengirim…'; showStatus('Mengirim konfirmasi, mohon tunggu…', 'pending');
    try {
      const response = await fetch(apiUrl(), { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ action: 'rsvp', name, attendance: reply, guestCount: guests, message, website: honeypot, submittedAt: Date.now() }) });
      if (!response.ok) throw new Error('Server tidak dapat dihubungi.');
      const result = await response.json(); if (!result.success) throw new Error(result.message || 'Pengiriman belum berhasil.');
      showStatus('Terima kasih. Konfirmasi Anda berhasil dikirim.', 'success'); form.reset(); syncCount(); await loadGreetings();
    } catch (err) { showStatus('Konfirmasi belum berhasil dikirim. Periksa koneksi lalu coba kembali. Jika masalah berlanjut, hubungi penyelenggara.', 'error'); }
    finally { submit.disabled = false; submit.textContent = 'Kirim Konfirmasi'; }
  });
})();
