
document.addEventListener("DOMContentLoaded",()=>{if(!requireAuth())return;const list=getJSON(SC.reportsKey,[]),box=document.querySelector("#mapReports");box.innerHTML=list.length?list.slice(0,8).map(r=>`<div class="map-report"><b>${esc(r.title)}</b><br><span>${esc(r.location)} • ${esc(r.status)}</span></div>`).join(""):`<div class="empty">No report locations yet.</div>`});
