(() => {
  'use strict';
  const c = window.WEDDING_CONFIG;
  const $ = (s) => document.querySelector(s);
  const safeText = (el, text) => { if (el) el.textContent = text; };
  document.title = `${c.title} — ${c.groomName} & ${c.brideName}`;
  document.querySelectorAll('[data-config="groomName"]').forEach(el => safeText(el,c.groomName));
  document.querySelectorAll('[data-config="brideName"]').forEach(el => safeText(el,c.brideName));
  safeText($('[data-config="groomParents"]'), `Bapak ${c.groomFather} & Ibu ${c.groomMother}`);
  safeText($('[data-config="brideParents"]'), `Bapak ${c.brideFather} & Ibu ${c.brideMother}`);
  $('#coupleImage').src = c.couplePhoto;
  $('#mapsLink').href = `https://www.google.com/maps?q=${encodeURIComponent(c.latitude + ',' + c.longitude)}`;
  const calendarUrl = (title, date, time, description) => {
    if (!date || !time) return '';
    const start = new Date(`${date}T${time}:00+07:00`);
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
    const fmt = d => d.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');
    const params = new URLSearchParams({action:'TEMPLATE',text:title,dates:`${fmt(start)}/${fmt(end)}`,details:description,location:c.venue,ctz:'Asia/Jakarta'});
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };
  if (!c.akad.time) { $('#calendarAkad').classList.add('hidden'); }
  else $('#calendarAkad').href = calendarUrl(`Akad Nikah ${c.groomName} & ${c.brideName}`, c.akad.date, c.akad.time, 'Undangan akad nikah.');
  if (!c.resepsi.time) { $('#calendarResepsi').classList.add('hidden'); }
  else $('#calendarResepsi').href = calendarUrl(`Resepsi ${c.groomName} & ${c.brideName}`, c.resepsi.date, c.resepsi.time, 'Undangan resepsi pernikahan.');

  $('#openInvitation').addEventListener('click', () => $('#pembuka').scrollIntoView({behavior:'smooth'}));
  const target = new Date(`${c.resepsi.date}T${c.resepsi.time || '08:00'}:00+07:00`);
  const tick = () => {
    const diff = target.getTime() - Date.now();
    if (diff <= 0) { $('#countdown').innerHTML = '<p>Hari resepsi telah tiba atau telah berlalu.</p>'; safeText($('#countdownNote'),'Menuju resepsi.'); return; }
    const units = [['Hari',86400000],['Jam',3600000],['Menit',60000],['Detik',1000]];
    $('#countdown').replaceChildren(...units.map(([label,size]) => { const div=document.createElement('div'); const strong=document.createElement('strong'); strong.textContent=String(Math.floor(diff/size) % (size===86400000?Infinity:size===3600000?24:size===60000?60:60)).padStart(2,'0'); const span=document.createElement('span');span.textContent=label;div.append(strong,span);return div;}));
  };
  tick(); setInterval(tick,1000);
  const form=$('#rsvpForm'), status=$('#formStatus'), submit=$('#submitRsvp'), attendance=$('#attendance'), count=$('#guestCount');
  attendance.addEventListener('change',()=>{ if(attendance.value==='Tidak Hadir'){count.value='0';count.disabled=true;}else{count.disabled=false;if(Number(count.value)===0)count.value='1';} });
  const showStatus=(msg,ok=false)=>{safeText(status,msg);status.style.color=ok?'#356a3c':'#9b382e';};
  async function loadWishes(){
    const host=$('#wishes');
    if(!c.appsScriptUrl){host.replaceChildren();const p=document.createElement('p');p.className='muted';p.textContent='Ucapan akan ditampilkan setelah backend Google Apps Script dikonfigurasi.';host.append(p);return;}
    try{const url=new URL(c.appsScriptUrl);url.searchParams.set('action','wishes');const res=await fetch(url.toString(),{method:'GET',cache:'no-store'});if(!res.ok)throw new Error('Respons server tidak berhasil.');const data=await res.json();if(!data.success||!Array.isArray(data.wishes))throw new Error('Format respons tidak sesuai.');host.replaceChildren();if(!data.wishes.length){const p=document.createElement('p');p.className='muted';p.textContent='Belum ada ucapan yang dipublikasikan.';host.append(p);return;}data.wishes.slice(0,c.wishes.maxDisplayed).forEach(w=>{const card=document.createElement('article');card.className='wish';const h=document.createElement('h3');h.textContent=w.name;const p=document.createElement('p');p.textContent=w.message;card.append(h,p);host.append(card);});}
    catch(e){host.replaceChildren();const p=document.createElement('p');p.className='muted';p.textContent='Ucapan belum dapat dimuat. Silakan coba lagi nanti.';host.append(p);}
  }
  form.addEventListener('submit',async e=>{
    e.preventDefault(); if(submit.disabled)return;
    if(!form.reportValidity())return;
    if(!c.appsScriptUrl){showStatus('Formulir belum terhubung ke server. Admin perlu mengatur URL Apps Script.');return;}
    const n=Number(count.value);if(attendance.value==='Hadir'&&(n<1||n>10)){showStatus('Jumlah tamu yang hadir harus antara 1 dan 10.');return;}if(attendance.value==='Tidak Hadir'&&n!==0){showStatus('Jumlah tamu untuk status Tidak Hadir harus 0.');return;}
    const payload={name:$('#guestName').value.trim(),attendance:attendance.value,count:n,message:$('#message').value.trim(),website:''};
    submit.disabled=true;submit.textContent='Mengirim…';showStatus('Sedang mengirim konfirmasi…',true);
    try{const res=await fetch(c.appsScriptUrl,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(payload)});if(!res.ok)throw new Error('Server tidak merespons dengan baik.');const result=await res.json();if(!result.success)throw new Error(result.message||'Pengiriman gagal.');showStatus('Terima kasih. Konfirmasi Anda berhasil dikirim.',true);form.reset();count.disabled=false;count.value='1';await loadWishes();}
    catch(err){showStatus('Konfirmasi belum dapat dipastikan tersimpan. Periksa koneksi lalu coba kembali.');}
    finally{submit.disabled=false;submit.textContent='Kirim Konfirmasi';}
  });
  $('#refreshWishes').addEventListener('click',loadWishes);loadWishes();if(c.wishes.refreshIntervalMs>0)setInterval(loadWishes,c.wishes.refreshIntervalMs);
})();
