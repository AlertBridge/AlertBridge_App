
document.addEventListener("DOMContentLoaded",()=>{if(!requireAuth())return;const list=getJSON(SC.alertsKey,[]),box=document.querySelector("#alertsList");box.innerHTML=list.map(a=>`<article class="card alert ${esc(a.level)}"><h3>${esc(a.title)}</h3><p>${esc(a.message)}</p><small>${new Date(a.date).toLocaleString()}</small></article>`).join("")||`<div class="card empty">No alerts.</div>`});
