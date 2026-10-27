(() => {
 'use strict'; const c=window.WEDDING_CONFIG; const $=s=>document.querySelector(s);
 document.querySelectorAll('[data-config="bankName"]').forEach(el=>el.textContent=c.bank.name);
 document.querySelectorAll('[data-config="accountName"]').forEach(el=>el.textContent=c.bank.accountName);
 const account=(c.bank.accountNumber||'').trim();
 if(account){$('#accountDisplay').textContent=account;$('#copyAccount').disabled=false;}else{$('#accountDisplay').textContent='Nomor rekening belum diisi';$('#copyAccount').disabled=true;$('#copyStatus').textContent='Admin perlu mengisi nomor rekening di file config.js sebelum informasi transfer dapat digunakan.';}
 async function copyValue(value,statusEl,button){if(!value){statusEl.textContent='Data belum tersedia untuk disalin.';return;}try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(value);statusEl.textContent='Berhasil disalin. Silakan periksa kembali sebelum digunakan.';}else{const field=document.createElement('textarea');field.value=value;field.setAttribute('readonly','');field.style.position='fixed';field.style.opacity='0';document.body.append(field);field.select();const ok=document.execCommand('copy');field.remove();statusEl.textContent=ok?'Berhasil disalin. Silakan periksa kembali sebelum digunakan.':'Salin otomatis tidak tersedia. Tekan lama nomor di atas lalu pilih Salin.';}}catch(e){statusEl.textContent='Salin otomatis tidak tersedia. Tekan lama nomor di atas lalu pilih Salin.';}}
 $('#copyAccount').addEventListener('click',()=>copyValue(account,$('#copyStatus'),$('#copyAccount')));
 if(c.ewallet.enabled&&c.ewallet.number){$('#ewalletCard').classList.remove('hidden');$('#ewalletName').textContent=c.ewallet.name;$('#ewalletRecipient').textContent=c.ewallet.recipient;$('#ewalletNumber').textContent=c.ewallet.number;$('#copyEwallet').addEventListener('click',()=>copyValue(c.ewallet.number,$('#copyStatus'),$('#copyEwallet')));}
})();
