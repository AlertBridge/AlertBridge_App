document.addEventListener("DOMContentLoaded",()=>{
 if(!requireAuth())return;
 const reports=getJSON(SC.reportsKey,[]);document.querySelector("#openReports").textContent=reports.filter(r=>r.status!=="Resolved").length;
 const tr=getJSON(SC.trackerKey,{active:false});document.querySelector("#trackerStatus").textContent=tr.active?"Active":"Inactive";
 const ns=getJSON(SC.notificationsKey,[]);document.querySelector("#unreadCount").textContent=ns.filter(n=>!n.read).length;
 const box=document.querySelector("#recentActivity"),recent=[...reports].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,4);
 box.innerHTML=recent.length?recent.map(r=>`<div class="activity"><b>${esc(r.title)}</b><br><span>${esc(r.location)} • ${esc(r.status)}</span></div>`).join(""):`<div class="empty">No reports have been submitted yet.</div>`;
 document.querySelector("#sosButton")?.addEventListener("click",()=>{const prefs=getJSON(SC.settingsKey,{confirmSos:true});if(prefs.confirmSos&&!confirm("This button does not dispatch help. Open emergency guidance?"))return;alert("Emergency support is not connected. If you are in immediate danger, call your local emergency number or contact a trusted person now. Do not rely on this app to dispatch help.")});
});
