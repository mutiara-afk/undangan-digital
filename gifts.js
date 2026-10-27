(() => {
  'use strict'; const cfg = window.WEDDING_CONFIG; const $ = (s) => document.querySelector(s);
  document.title = `Kirim Hadiah — ${cfg.groom.name} & ${cfg.bride.name}`;
  document.querySelectorAll('[data-bridegroom]').forEach((el) => el.textContent = cfg.groom.name);
  document.querySelectorAll('[data-bride]').forEach((el) => el.textContent = cfg.bride.name);
  $('#bank-name').textContent = cfg.gift.bankName || 'Bank belum dikonfirmasi'; $('#bank-recipient').textContent = cfg.gift.recipient || 'Nama penerima belum dikonfirmasi';
  const account = String(cfg.gift.accountNumber || '').trim(); const accountText = $('#bank-account'); const copyAccount = $('#copy-account');
  if (account) { accountText.textContent = account; copyAccount.disabled = false; } else { accountText.textContent = 'Nomor rekening belum dikonfirmasi'; copyAccount.disabled = true; }
  const copyValue = async (value, statusEl, button, originalLabel, fallbackMessage) => {
    if (!value) return;
    try {
      if (navigator.clipboard && window.isSecureContext) { await navigator.clipboard.writeText(value); statusEl.textContent = 'Berhasil disalin.'; }
      else { const field = document.createElement('textarea'); field.value = value; field.setAttribute('readonly', ''); field.style.position = 'fixed'; field.style.opacity = '0'; document.body.append(field); field.select(); const ok = document.execCommand('copy'); field.remove(); if (!ok) throw new Error('Salin otomatis tidak tersedia.'); statusEl.textContent = 'Berhasil disalin.'; }
    } catch (_) { statusEl.textContent = `${fallbackMessage} ${value}`; }
    button.textContent = 'Selesai'; window.setTimeout(() => { button.textContent = originalLabel; }, 2200);
  };
  copyAccount.addEventListener('click', () => copyValue(account, $('#bank-copy-status'), copyAccount, 'Salin Nomor Rekening', 'Silakan salin secara manual:'));
  const wallet = cfg.gift.wallet;
  if (wallet && wallet.enabled && wallet.number) { $('#wallet-card').hidden = false; $('#wallet-name').textContent = wallet.name || 'Dompet Digital'; $('#wallet-recipient').textContent = wallet.recipient || cfg.gift.recipient; $('#wallet-account').textContent = wallet.number; $('#copy-wallet').addEventListener('click', () => copyValue(wallet.number, $('#wallet-copy-status'), $('#copy-wallet'), 'Salin Nomor Dompet Digital', 'Silakan salin secara manual:')); }
  else { $('#wallet-card').hidden = true; }
})();
