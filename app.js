(()=> {
const c=window.WEDDING_CONFIG, $=s=>document.querySelector(s);
const dateFmt=d=>new Date(d+"T12:00:00+07:00").toLocaleDateString("id-ID",{weekday:"long",day:"numeric",month:"long",year:"numeric"});
document.querySelectorAll("[data-groom]").forEach(e=>e.textContent=c.groom);
document.querySelectorAll("[data-bride]").forEach(e=>e.textContent=c.bride);
document.querySelectorAll("[data-couple]").forEach(e=>e.textContent=c.groom+" & "+c.bride);
document.querySelectorAll("[data-date]").forEach(e=>e.textContent=dateFmt(c.akad.date)+" – "+dateFmt(c.reception.date));
document.querySelectorAll("[data-parents]").forEach(e=>e.textContent=c.groomParents+" • "+c.brideParents);
$("[data-akad]").textContent=dateFmt(c.akad.date);
$("[data-resepsi]").textContent=dateFmt(c.reception.date)+" • "+(c.reception.confirmed?c.reception.time+" WIB":"Waktu akan dikonfirmasi");
$("[data-address]").textContent=c.address;
$("#mapsLink").href="https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(c.coordinates);
const toCalendar=(date,time)=>date.replaceAll("-","")+"T"+time.replace(":","")+"00";
if(c.reception.confirmed){
 const start=toCalendar(c.reception.date,c.reception.time);
 const end=toCalendar(c.reception.date,`${String((+c.reception.time.slice(0,2)+c.calendarDurationHours)%24).padStart(2,"0")}:${c.reception.time.slice(3)}`);
 $("#calendarLink").href="https://calendar.google.com/calendar/render?action=TEMPLATE&text="+encodeURIComponent("Pernikahan "+c.groom+" & "+c.bride)+"&dates="+start+"/"+end+"&ctz=Asia%2FJakarta&location="+encodeURIComponent(c.address)+"&details="+encodeURIComponent("Undangan pernikahan "+c.groom+" dan "+c.bride);
}else{$("#calendarLink").removeAttribute("href");$("#calendarLink").textContent="Lengkapi waktu acara terlebih dahulu";}
$("#openInvite").onclick=()=>document.querySelector(".intro").scrollIntoView({behavior:"smooth"});
const target=new Date(c.reception.date+"T"+c.reception.time+":00+07:00");
function tick(){if(!c.reception.confirmed){$("#countdown").textContent="Waktu resepsi akan dikonfirmasi";return;}let ms=target-Date.now();if(ms<=0){$("#countdown").textContent="Hari bahagia telah tiba";return;}let d=Math.floor(ms/86400000),h=Math.floor(ms%86400000/3600000),m=Math.floor(ms%3600000/60000),s=Math.floor(ms%60000/1000);$("#countdown").textContent=`${d} hari · ${h} jam · ${m} menit · ${s} detik`;}
tick();setInterval(tick,1000);
const form=$("#rsvpForm"),status=$("#formStatus"),btn=$("#submitBtn");
form.elements.attendance.addEventListener("change",()=>{if(form.elements.attendance.value==="Tidak Hadir"){form.elements.guests.value="0";form.elements.guests.disabled=true;}else{form.elements.guests.disabled=false;if(form.elements.guests.value==="0")form.elements.guests.value="1";}});
async function loadMessages(){
 const list=$("#messages");
 if(!c.appsScriptUrl){list.textContent="Belum ada ucapan yang dapat ditampilkan. Layanan ucapan belum dihubungkan.";return;}
 list.textContent="Memuat ucapan…";
 try{
  const r=await fetch(c.appsScriptUrl+"?action=messages");
  if(!r.ok)throw new Error("HTTP "+r.status);
  const j=await r.json();if(!j.success)throw new Error("Backend gagal");
  list.replaceChildren();
  if(!Array.isArray(j.messages)||!j.messages.length){const p=document.createElement("p");p.textContent="Belum ada ucapan. Jadilah yang pertama mengirimkan doa.";list.append(p);return;}
  j.messages.forEach(m=>{const card=document.createElement("article");card.className="message";const name=document.createElement("strong");name.textContent=String(m.name||"Tamu");const p=document.createElement("p");p.textContent=String(m.message||"");card.append(name,p);list.append(card);});
 }catch(e){list.textContent="Ucapan belum dapat dimuat saat ini. Silakan coba kembali nanti.";}
}
form.addEventListener("submit",async e=>{e.preventDefault();if(!form.reportValidity())return;if(!c.appsScriptUrl){status.textContent="Layanan RSVP belum dihubungkan. Pengiriman belum tersimpan.";return;}btn.disabled=true;btn.textContent="Mengirim…";status.textContent="";const payload={name:form.elements.name.value.trim(),attendance:form.elements.attendance.value,guests:Number(form.elements.guests.value),message:form.elements.message.value.trim()};if(payload.attendance==="Tidak Hadir")payload.guests=0;try{const r=await fetch(c.appsScriptUrl,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(payload)});const j=await r.json();if(!r.ok||!j.success)throw Error(j.error||"Pengiriman gagal");status.textContent="RSVP berhasil dikirim. Terima kasih!";form.reset();form.elements.guests.disabled=false;await loadMessages();}catch(err){status.textContent="RSVP gagal dikirim. Periksa koneksi atau coba kembali.";}finally{btn.disabled=false;btn.textContent="Kirim RSVP";}});
loadMessages();setInterval(loadMessages,60000);
})();