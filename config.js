/* KONFIGURASI UTAMA — ubah data di file ini saja untuk informasi undangan. */
window.WEDDING_CONFIG = {
  title: 'Pernikahan',
  groom: { name: 'Wari Syahputra', father: 'Seswoto', mother: 'Yustiawati (Atik)' },
  bride: { name: 'Berliana Fitri Zannah', father: 'Syaiful Bahri', mother: 'Sarila' },
  quote: 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan-pasangan dari jenismu sendiri, agar kamu merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.',
  quoteReference: 'QS. Ar-Rum: 21',
  timezone: 'Asia/Jakarta',
  akad: { date: '2026-11-14', time: '' }, // Isi HH:MM setelah jam akad dikonfirmasi.
  resepsi: { date: '2026-11-15', time: '' }, // Hitung mundur memakai tanggal resepsi, tanpa asumsi jam.
  venue: { name: 'Gang Afra Florist, Dusun Dahlia, Desa Teluk Bakung', address: 'Gang Afra Florist, Dusun Dahlia, Desa Teluk Bakung', latitude: 3.9258680, longitude: 98.4265480 },
  couplePhoto: 'assets/images/foto-bersama-placeholder.svg', // Ganti dengan assets/images/foto-bersama.webp setelah foto tersedia.
  appsScriptUrl: '', // Tempel URL Web App Apps Script setelah deployment.
  gift: {
    bankName: 'SeaBank',
    recipient: 'Berliana Fitri Zannah',
    accountNumber: '', // Isi hanya setelah nomor rekening dikonfirmasi pemilik.
    showUnconfirmedBankCard: true,
    wallet: { enabled: false, name: '', recipient: '', number: '' }
  },
  music: { enabled: false, src: 'assets/music/musik-latar.mp3' },
  publicGreetingsLimit: 30,
  refreshIntervalMs: 60000
};
