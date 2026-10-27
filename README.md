# Undangan Pernikahan Digital — Wari Syahputra & Berliana Fitri Zannah

Website statis berbahasa Indonesia, desain Indonesian Heritage — Modern Elegant Wedding, kompatibel dengan GitHub Pages. Backend RSVP/ucapan memakai Google Apps Script dan Google Sheets.

## Struktur folder

```text
undangan-wari-berliana/
├── index.html                   # Undangan utama
├── hadiah.html                  # Halaman transfer hadiah
├── assets/
│   ├── css/style.css            # Gaya visual responsif
│   ├── js/config.js             # Seluruh data yang mudah diubah
│   ├── js/app.js                # Navigasi, countdown, RSVP, ucapan
│   ├── js/gifts.js              # Kartu transfer dan fungsi salin
│   ├── images/                  # Satu slot foto bersama saja
│   └── music/                   # Musik opsional
├── apps-script/Code.gs          # Backend Google Apps Script
├── TESTING.md                   # Status pengujian
└── README.md                    # Panduan ini
```

## Mulai cepat

1. Ekstrak ZIP proyek.
2. Buka `assets/js/config.js` dan tinjau semua data. Jam acara sengaja kosong hingga dikonfirmasi.
3. Ganti `assets/images/foto-bersama-placeholder.svg` dengan satu foto bersama bernama `foto-bersama.webp`, lalu ubah `couplePhoto` pada konfigurasi ke `assets/images/foto-bersama.webp`. Jangan tambahkan foto pasangan lain.
4. Siapkan Google Sheets dan Apps Script sesuai bagian **Menyiapkan RSVP** di bawah.
5. Tempel URL Web App Apps Script pada `appsScriptUrl` di `assets/js/config.js`.
6. Uji lokal dengan server statis (misalnya ekstensi Live Server di VS Code), bukan hanya membuka file langsung.
7. Publikasikan ke GitHub Pages setelah pemeriksaan checklist.

## Konfigurasi undangan

Edit hanya `assets/js/config.js` untuk mengubah:

- Nama kedua mempelai dan orang tua.
- Tanggal, jam, dan zona waktu acara.
- Alamat serta koordinat Google Maps.
- Jalur satu foto bersama.
- URL backend Apps Script.
- Data rekening dan opsi dompet digital.

Tanggal bawaan adalah akad Sabtu, 14 November 2026 dan resepsi Minggu, 15 November 2026. `time: ''` berarti waktu belum dikonfirmasi. Isi format 24 jam `HH:MM`, contohnya `09:00`, hanya setelah mendapat persetujuan keluarga. Countdown dan tautan kalender baru aktif setelah kedua jam terisi.

## Menyiapkan RSVP — Google Sheets dan Apps Script

1. Buka [Google Sheets](https://sheets.google.com/) dan buat spreadsheet baru, misalnya `RSVP Pernikahan Wari & Berliana`.
2. Dari spreadsheet itu, pilih **Ekstensi → Apps Script**. Ini memastikan script terikat ke spreadsheet yang benar.
3. Ganti isi `Code.gs` dengan seluruh isi file `apps-script/Code.gs` di proyek ini, lalu simpan.
4. Pilih fungsi `setup` di daftar fungsi dan tekan **Jalankan**. Berikan izin kepada akun Anda jika diminta. Fungsi ini menyimpan ID spreadsheet pada Script Properties dan membuat sheet `RSVP` dengan header. Jangan bagikan spreadsheet ke publik.
5. Untuk moderasi, setiap RSVP baru disetel `MENUNGGU`. Buka spreadsheet secara privat dan ubah kolom **Status Publikasi** menjadi `SETUJU` hanya untuk ucapan yang layak ditampilkan. Ucapan dengan status lain tidak akan dipublikasikan.
6. Pilih **Deploy → New deployment → Web app**. Atur **Execute as: Me**. Atur akses sesuai pilihan yang tersedia pada akun Anda; untuk undangan publik, endpoint perlu bisa menerima permintaan pengunjung tanpa login. Jangan gunakan izin yang lebih luas pada spreadsheet itu sendiri.
7. Tekan **Deploy**, selesaikan otorisasi, lalu salin URL Web App yang berakhir dengan `/exec` (bukan URL `/dev`).
8. Tempel URL itu pada `appsScriptUrl` di `assets/js/config.js`, simpan dan publikasikan ulang frontend.
9. Uji kirim RSVP sungguhan dan pastikan baris muncul di sheet. Lalu set satu ucapan uji menjadi `SETUJU` dan pastikan ucapan tersebut tampil di website.

Dokumentasi resmi: [Panduan Apps Script Web Apps](https://developers.google.com/apps-script/guides/web), [Deploy Web Apps](https://developers.google.com/apps-script/concepts/deployments), [Lock Service](https://developers.google.com/apps-script/reference/lock/lock-service), [Cache Service](https://developers.google.com/apps-script/reference/cache/cache-service).

### Kolom spreadsheet

| Kolom | Isi |
|---|---|
| Waktu Pengiriman | Waktu server saat baris disimpan |
| Nama Tamu | Nama yang dikirim tamu |
| Status Kehadiran | Hadir / Tidak Hadir |
| Jumlah Tamu | Nol jika tidak hadir; 1–10 jika hadir |
| Ucapan dan Doa | Pesan tamu, maksimal 500 karakter |
| Status Publikasi | `MENUNGGU` atau `SETUJU`; kolom moderasi internal |

Kolom keenam ditambahkan untuk moderasi, di luar lima kolom yang diminta. Endpoint publik hanya mengembalikan nama dan ucapan yang berstatus `SETUJU`, bukan isi lengkap spreadsheet.

### Catatan keamanan penting

- Apps Script Web App publik tidak memiliki perlindungan anti-spam setingkat layanan formulir khusus. Kode ini menggunakan validasi server, honeypot, jeda pengiriman per nama, batas ukuran pesan, pencegahan formula spreadsheet, dan `LockService`. Batas berbasis nama dapat dilewati dengan nama berbeda; bila undangan menerima trafik besar, tambahkan CAPTCHA/verifikasi lain atau backend dengan rate limiting kuat.
- Apps Script tidak menyediakan header CORS khusus melalui `ContentService` dengan cara yang fleksibel. Perilaku `fetch()` lintas domain harus diuji dari URL GitHub Pages setelah deployment. Jika browser memblokir respons, jangan menyatakan integrasi sukses; gunakan backend/proxy yang mendukung CORS atau sesuaikan arsitektur setelah uji.
- Jangan menambahkan kredensial rahasia ke `config.js` atau repositori publik. URL endpoint web app memang terlihat oleh pengunjung; karena itu validasi server tetap wajib.
- Batasi akses editor spreadsheet kepada pihak tepercaya. Jangan mengaktifkan publikasi spreadsheet.

## Foto bersama

Sediakan **satu foto bersama kedua mempelai saja**. Disarankan WebP dengan lebar sekitar 1200 px dan ukuran yang dioptimalkan. Letakkan di `assets/images/foto-bersama.webp`, kemudian ubah `couplePhoto` pada konfigurasi. Placeholder SVG bawaan dipakai sampai foto tersedia. Jangan membuat galeri, slider, atau foto masing-masing mempelai.

## Google Maps dan Google Calendar

Tautan Google Maps dibentuk dari koordinat pada konfigurasi. Tautan kalender dibangun setelah jam akad dan resepsi terisi. Tamu tetap harus menyimpan acara sendiri; website tidak dapat menyimpan acara ke kalender mereka tanpa tindakan tamu. Periksa alamat dan waktu lokal WIB sebelum publikasi.

## Hadiah digital

Buka `assets/js/config.js`, lalu tinjau `gift`:

- `bankName`: nama bank.
- `recipient`: nama pemilik rekening.
- `accountNumber`: nomor rekening, kosong sampai dikonfirmasi pemilik.
- `wallet.enabled`: ubah ke `true` hanya jika data dompet digital sudah lengkap.

Tombol salin nonaktif saat nomor rekening belum dikonfirmasi. Jangan memasukkan PIN, kata sandi, atau OTP. Halaman ini tidak memproses pembayaran.

## Musik opsional

Musik belum diaktifkan. Jika memiliki musik dengan izin penggunaan yang sesuai, simpan file sebagai `assets/music/musik-latar.mp3`. Implementasikan kontrol putar/jeda secara eksplisit dan jangan memaksa autoplay. File musik tidak diperlukan agar website berjalan.

## Memperbarui website

1. Edit file yang diperlukan dan simpan.
2. Uji lokal menggunakan server statis.
3. Commit dan push ke branch yang dipakai GitHub Pages, biasanya `main`.
4. Buka **Settings → Pages** di repositori untuk melihat sumber dan status publikasi.
5. Setelah deployment selesai, buka URL Pages di ponsel dan komputer serta kirim RSVP uji.

Tautan resmi: [Buat repositori GitHub](https://github.com/new), [Dokumentasi GitHub Pages](https://docs.github.com/pages), [Konfigurasi sumber publikasi](https://docs.github.com/pages/getting-started-with-github-pages/configuring-a-publishing-source).

## Backup dan pemecahan masalah

- Simpan salinan ZIP proyek sebelum mengubah file.
- Unduh salinan spreadsheet RSVP secara berkala melalui **File → Download**. Jangan menaruh hasil ekspor berisi data tamu di repositori publik.
- Jika RSVP gagal: periksa URL `/exec`, status deployment, otorisasi Apps Script, koneksi browser, dan konsol pengembang.
- Jika ucapan tidak muncul: periksa kolom **Status Publikasi** dan pastikan nilainya tepat `SETUJU`.
- Jika countdown/kalender tidak aktif: periksa bahwa `akad.time` dan `resepsi.time` sudah terisi dengan format `HH:MM`.
- Jika foto tidak muncul: periksa nama file, ejaan jalur relatif, dan huruf besar/kecil nama file.
- Jika salin rekening nonaktif: nomor rekening memang belum diisi dan dikonfirmasi di konfigurasi.
