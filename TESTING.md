# Laporan pengujian awal

Tanggal pemeriksaan berkas: 28 Oktober 2026. Ini adalah pemeriksaan statis berkas proyek di lingkungan kerja, bukan pengujian deployment publik atau layanan Google.

| Pemeriksaan | Status | Catatan |
|---|---|---|
| Struktur folder dan berkas utama | Berhasil diuji | File HTML, CSS, JavaScript, konfigurasi, Apps Script, dan dokumentasi dibuat. |
| Bahasa Indonesia pada antarmuka | Berhasil diuji secara statis | Teks utama, navigasi, RSVP, hadiah, dan pesan status berbahasa Indonesia. |
| Hanya satu slot foto pasangan | Berhasil diuji secara statis | Hanya ada satu elemen gambar pada halaman utama, berupa foto bersama/placeholder. |
| Tidak ada foto terpisah atau galeri kenangan | Berhasil diuji secara statis | Tidak ada komponen galeri, slider, atau halaman kenangan. |
| Data undangan terpusat | Berhasil diuji | `assets/js/config.js`. |
| Placeholder jam acara | Berhasil diuji | Jam akad dan resepsi kosong; countdown/kalender dinonaktifkan sampai dikonfirmasi. |
| Nomor rekening tidak dianggap terkonfirmasi | Berhasil diuji | Nomor rekening kosong dan tombol salin nonaktif. |
| Tautan Maps dari koordinat | Berhasil diuji secara statis | URL dibuat dari koordinat konfigurasi; verifikasi lokasi di perangkat nyata tetap diperlukan. |
| Validasi RSVP frontend | Berhasil diuji secara statis | Nama, kehadiran, jumlah tamu, panjang ucapan, dan klik ganda ditangani. |
| Validasi server, moderasi, lock, honeypot | Berhasil diuji secara statis | Kode tersedia; perlu uji langsung di deployment Apps Script. |
| Rendering ucapan aman | Berhasil diuji secara statis | Memakai `textContent`, bukan `innerHTML`. |
| Salin rekening | Belum diuji | Menunggu nomor rekening yang dikonfirmasi. |
| Google Sheets dan Apps Script | Memerlukan tindakan pengguna | Harus dibuat, diberi izin, dan dideploy pada akun Google pemilik. |
| CORS/fetch lintas domain | Belum diuji | Wajib diuji setelah endpoint dan URL GitHub Pages tersedia. |
| Responsif pada perangkat nyata | Belum diuji | CSS memiliki breakpoint mobile; perlu pengujian Android/iPhone/desktop. |
| GitHub Pages | Memerlukan tindakan pengguna | Belum ada akses repositori atau deployment terkonfirmasi dalam sesi ini. |
| Musik | Belum diuji / belum diaktifkan | Opsional; kontrol disembunyikan karena belum ada berkas musik. |
| Aksesibilitas dan performa nyata | Belum diuji | Perlu audit browser/perangkat setelah publikasi. |

## Batasan yang diketahui

- Apps Script Web App publik memiliki perlindungan spam terbatas. Untuk penggunaan publik, pertimbangkan CAPTCHA atau backend dengan rate limiting lebih kuat jika dibutuhkan.
- URL Apps Script perlu diuji lintas origin dari GitHub Pages. Jangan menganggap RSVP bekerja sampai uji pengiriman nyata berhasil dan baris tercatat.
- Google Calendar tidak diberi waktu perkiraan. Setelah jam dikonfirmasi, tautan acara menggunakan waktu akad dengan durasi kalender dua jam; ubah jika durasi resmi berbeda.
