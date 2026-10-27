/**
 * Google Apps Script backend untuk RSVP dan ucapan.
 * Jalankan setup() sekali dari editor Apps Script setelah membuat spreadsheet.
 * Deploy sebagai Web App: Execute as Me, access Anyone (sesuai kebijakan akun).
 * Jangan menyimpan rahasia apa pun di frontend. ID spreadsheet disimpan di Script Properties.
 */
const SHEET_NAME = 'RSVP';
const HEADERS = ['Waktu Pengiriman', 'Nama Tamu', 'Status Kehadiran', 'Jumlah Tamu', 'Ucapan dan Doa', 'Status Publikasi'];
const MAX_NAME = 80;
const MAX_MESSAGE = 500;
const MAX_GUESTS = 10;
const MAX_PUBLIC_GREETINGS = 50;
const MIN_SUBMIT_INTERVAL_SECONDS = 8;

function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('Buka Apps Script dari spreadsheet yang akan digunakan, lalu jalankan setup().');
  PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID', ss.getId());
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  sheet.autoResizeColumns(1, HEADERS.length);
  return 'Setup selesai. Spreadsheet ID tersimpan di Script Properties.';
}

function doGet(e) {
  const action = String((e && e.parameter && e.parameter.action) || '');
  if (action !== 'greetings') return json_({ success: false, message: 'Permintaan tidak dikenali.' });
  try {
    const limit = clampInt_(e.parameter.limit, 1, MAX_PUBLIC_GREETINGS, 30);
    const sheet = getSheet_();
    const lastRow = sheet.getLastRow();
    if (lastRow < 2) return json_({ success: true, greetings: [] });
    // Baca hanya kolom yang dibutuhkan; tidak mengirimkan waktu, jumlah tamu, atau kolom internal.
    const rows = sheet.getRange(2, 2, lastRow - 1, 5).getDisplayValues();
    const greetings = [];
    for (let i = rows.length - 1; i >= 0 && greetings.length < limit; i--) {
      const name = cleanText_(rows[i][0], MAX_NAME);
      const message = cleanText_(rows[i][3], MAX_MESSAGE);
      const publicationStatus = String(rows[i][4] || '').trim().toUpperCase();
      if (publicationStatus === 'SETUJU' && name && message) greetings.push({ name: name, message: message });
    }
    return json_({ success: true, greetings: greetings });
  } catch (err) {
    console.error(err);
    return json_({ success: false, message: 'Ucapan belum dapat dimuat.' });
  }
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    const raw = e && e.postData && e.postData.contents;
    if (!raw || raw.length > 12000) return json_({ success: false, message: 'Data kosong atau terlalu besar.' });
    const data = JSON.parse(raw);
    if (String(data.website || '').trim() !== '') return json_({ success: true, message: 'Terima kasih.' }); // honeypot
    if (data.action !== 'rsvp') return json_({ success: false, message: 'Permintaan tidak dikenali.' });

    // Waktu di browser hanya indikator anti-replay ringan; waktu pencatatan resmi dibuat server.
    const submittedAt = Number(data.submittedAt || 0);
    const now = Date.now();
    if (!Number.isFinite(submittedAt) || submittedAt > now + 60000 || now - submittedAt > 24 * 60 * 60 * 1000) {
      return json_({ success: false, message: 'Formulir kedaluwarsa. Muat ulang halaman dan coba lagi.' });
    }
    const name = cleanText_(data.name, MAX_NAME);
    const attendance = String(data.attendance || '');
    const message = cleanText_(data.message, MAX_MESSAGE);
    const guestCount = attendance === 'Tidak Hadir' ? 0 : Number(data.guestCount);
    if (name.length < 2 || !['Hadir', 'Tidak Hadir'].includes(attendance)) return json_({ success: false, message: 'Nama atau status kehadiran tidak valid.' });
    if (!Number.isInteger(guestCount) || guestCount < 0 || guestCount > MAX_GUESTS || (attendance === 'Hadir' && guestCount < 1)) {
      return json_({ success: false, message: 'Jumlah tamu tidak valid.' });
    }
    if (String(data.message || '').length > MAX_MESSAGE) return json_({ success: false, message: 'Ucapan maksimal 500 karakter.' });

    // Cache berbasis nama yang dinormalisasi mengurangi spam berulang; bukan pengganti CAPTCHA/WAF.
    const normalizedName = name.toLowerCase().replace(/\s+/g, ' ');
    const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, normalizedName);
    const key = 'rsvp_' + Utilities.base64EncodeWebSafe(digest).slice(0, 36);
    const cache = CacheService.getScriptCache();
    if (cache.get(key)) return json_({ success: false, message: 'Konfirmasi dengan nama ini baru saja dikirim. Tunggu sebentar sebelum mencoba lagi.' });

    lock.waitLock(15000);
    try {
      const sheet = getSheet_();
      sheet.appendRow([new Date(), safeCell_(name), attendance, guestCount, safeCell_(message), 'MENUNGGU']);
      cache.put(key, '1', MIN_SUBMIT_INTERVAL_SECONDS);
    } finally {
      lock.releaseLock();
    }
    return json_({ success: true, message: 'Konfirmasi berhasil disimpan.' });
  } catch (err) {
    console.error(err);
    return json_({ success: false, message: 'Terjadi kesalahan server. Silakan coba lagi nanti.' });
  }
}

function getSheet_() {
  const id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (!id) throw new Error('SPREADSHEET_ID belum diatur. Jalankan setup() terlebih dahulu.');
  const ss = SpreadsheetApp.openById(id);
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('Sheet RSVP tidak ditemukan. Jalankan setup() kembali.');
  return sheet;
}

function cleanText_(value, maxLength) {
  return String(value == null ? '' : value)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/\r\n?/g, '\n')
    .trim()
    .slice(0, maxLength);
}

// Cegah input spreadsheet yang diawali karakter formula agar tidak dieksekusi sebagai rumus.
function safeCell_(value) {
  const s = String(value == null ? '' : value);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function clampInt_(value, min, max, fallback) {
  const n = Number(value);
  return Number.isInteger(n) ? Math.min(max, Math.max(min, n)) : fallback;
}

function json_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
