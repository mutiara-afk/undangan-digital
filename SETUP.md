# Setup dan publikasi

## 1. Google Sheets
1. Buat spreadsheet baru: https://sheets.google.com
2. Salin ID spreadsheet dari bagian URL.
3. Buka Extensions → Apps Script.
4. Ganti isi `Code.gs` dengan file `apps-script/Code.gs` di proyek.
5. Pada Project Settings → Script properties, tambahkan `SPREADSHEET_ID` = ID spreadsheet. Opsional: tambahkan `PUBLICATION_KEY` untuk validasi tambahan; bila diaktifkan, frontend perlu mengirim key melalui backend yang dirancang untuknya (implementasi dasar saat ini tidak menaruh secret di browser).
6. Jalankan `sheet_` dari editor sekali, setujui izin yang diminta.
7. Deploy → New deployment → Web app. Execute as: Me. Who has access: Anyone (endpoint publik; mitigasi spam masih dasar). Salin URL `/exec`.
8. Tempel URL ke `appsScriptUrl` pada `config.js`. Uji pengiriman dan tab RSVP.

Penting: endpoint publik Apps Script memiliki risiko spam. Untuk produksi klien, pertimbangkan pembatasan lebih kuat (mis. proxy/serverless dengan CAPTCHA dan rate limit). Jangan publikasikan spreadsheet secara terbuka. Endpoint hanya mengeluarkan nama dan pesan ucapan yang memenuhi syarat.

## 2. Foto, hadiah, konfigurasi
- Ganti satu foto bersama dengan file WebP bernama `assets/images/foto-bersama.webp`. Tidak ada foto terpisah/galeri.
- Edit semua tanggal, alamat, rekening, nama, serta URL Apps Script di `config.js`.
- Nomor rekening sudah diatur menjadi `901847248723`; verifikasi kecocokannya sebelum tayang.
- Musik belum dipasang; jika ingin menambahkan, gunakan file yang hak penggunaannya jelas dan implementasikan kontrol play/pause.

## 3. GitHub Pages
1. Buat repositori di https://github.com/new
2. Unggah isi folder proyek (pastikan `index.html` berada di root).
3. Settings → Pages → Build and deployment → Deploy from a branch; pilih `main` dan `/ (root)`, lalu Save. Atau gunakan workflow Pages.
4. Tunggu status deployment selesai dan buka URL yang ditampilkan di Settings → Pages.
5. Periksa website pada ponsel dan desktop. Jalur aset bersifat relatif agar sesuai untuk project pages.
6. Setelah perubahan, commit/push file dan periksa ulang deployment.

Panduan resmi:
- GitHub Pages: https://docs.github.com/pages
- Apps Script web apps: https://developers.google.com/apps-script/guides/web
- Apps Script deployments: https://developers.google.com/apps-script/concepts/deployments

## 4. Kalender, Maps, backup
- Maps dibuat dari koordinat yang ditentukan di `config.js`.
- Kalender membuat event resepsi dua jam dengan zona Asia/Jakarta; durasi bisa diubah di `calendarDurationHours`.
- Backup spreadsheet lewat File → Download; backup proyek dengan mengunduh/menyalin repositori.

## 5. Checklist manual
- [ ] Masukkan nomor rekening yang benar.
- [ ] Tambahkan foto pasangan tunggal (jika sudah tersedia).
- [ ] Konfirmasi alamat dan jam acara.
- [ ] Deploy Apps Script dan masukkan URL.
- [ ] Uji RSVP, ucapan, dan notifikasi error.
- [ ] Publikasikan GitHub Pages dan verifikasi URL.
- [ ] Pastikan tidak ada data privat atau secret dalam repositori.
