# Website Undangan Pernikahan — Wari & Berliana

Website statis berbahasa Indonesia, dirancang untuk GitHub Pages, dengan halaman hadiah terpisah dan backend RSVP opsional melalui Google Apps Script + Google Sheets.

## Struktur

- `index.html` — halaman undangan utama.
- `hadiah.html` — halaman informasi transfer hadiah.
- `config.js` — tempat mengubah nama, tanggal, jam, lokasi, rekening, dan URL Apps Script.
- `styles.css` — desain responsif.
- `app.js` — navigasi, countdown, kalender, RSVP, dan ucapan.
- `gift.js` — salin nomor rekening/dompet digital.
- `assets/images/foto-bersama-placeholder.svg` — satu placeholder foto bersama. Ganti dengan `foto-bersama.webp` dan ubah `couplePhoto` di `config.js`.
- `assets/music/` dan `assets/video/` — folder aset opsional.
- `apps-script/Code.gs` — backend Google Apps Script.
- `docs/PANDUAN.md` — panduan konfigurasi dan publikasi.

## Batasan yang disengaja

Website ini hanya memiliki **satu slot foto bersama kedua mempelai**. Tidak ada foto pria/wanita terpisah, foto pada halaman kedua, carousel, slider, atau galeri kenangan.

## Sebelum publikasi

1. Isi nomor rekening yang benar di `config.js` atau ubah `showWhenEmpty`/tampilan placeholder sesuai kebutuhan. Nomor rekening tidak tersedia dalam brief, sehingga sengaja tidak dikarang.
2. Isi waktu resepsi setelah dikonfirmasi.
3. Buat dan deploy Apps Script, lalu isi `appsScriptUrl` di `config.js`.
4. Ganti placeholder dengan satu foto bersama yang sudah mendapat izin untuk dipublikasikan.
5. Uji CORS pada browser target dan uji RSVP sungguhan sebelum menyebarkan undangan.

## Menjalankan secara lokal

Buka folder menggunakan server statis lokal (misalnya ekstensi Live Server di VS Code). Membuka langsung melalui `file://` dapat membatasi sebagian fitur browser. Frontend statis tetap dapat dipublikasikan di GitHub Pages.
