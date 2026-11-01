# Undangan Pernikahan Wari Syahputra & Berliana Fitri Zannah

Website statis HTML/CSS/JS bernuansa Indonesian Heritage (aksen batik kawung dan ornamen wayang) yang dapat dipublikasikan di GitHub Pages. Backend RSVP menggunakan Google Apps Script + Google Sheets.

## Catatan data
- Akad: Sabtu, 14 November 2026, 08.00 WIB.
- Resepsi: Minggu, 15 November 2026, 08.00 WIB.
- Nomor rekening SeaBank pada konfigurasi: `901847248723`.
- Satu slot foto bersama saja: `assets/images/foto-bersama.webp`. Tidak ada galeri, foto individual, atau bagian kenangan.
- Data acara dan identitas dapat diedit dari `config.js`.

## Struktur
- `index.html`, `hadiah.html`: halaman undangan dan hadiah.
- `styles.css`: gaya responsif.
- `config.js`: data yang mudah diedit.
- `app.js`, `gift.js`: fungsi frontend.
- `apps-script/Code.gs`: backend Apps Script.
- `assets/images/`: satu foto pasangan.
- `assets/music/`: musik opsional (belum ada kontrol musik aktif).
- `docs/SETUP.md`: setup Sheets, Apps Script, GitHub Pages, dan pemeriksaan.

## Jalankan lokal
Buka `index.html` di browser. Untuk pengujian fetch/backend, jalankan melalui server lokal (mis. ekstensi Live Server) karena beberapa browser membatasi permintaan dari `file://`.

## Status
Proyek starter dibentuk, tetapi Google Sheet/Apps Script deployment/GitHub Pages belum dihubungkan atau dipublikasikan. Lihat panduan setup.
