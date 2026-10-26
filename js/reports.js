
document.addEventListener("DOMContentLoaded",()=>{
 if(!requireAuth())return;const search=document.querySelector("#search"),filter=document.querySelector("#filter"),box=document.querySelector("#reportsList");
 function render(){const q=search.value.toLowerCase(),st=filter.value;const list=getJSON(SC.reportsKey,[]).filter(r=>(!q||[r.title,r.category,r.location,r.description].join(" ").toLowerCase().includes(q))&&(!st||r.status===st));box.innerHTML=list.length?list.map(r=>`<article class="card report-item"><div class="report-top"><h3>${esc(r.title)}</h3><span class="badge ${r.status==="Open"?"warning":r.status==="Resolved"?"success":""}">${esc(r.status)}</span></div><p>${esc(r.description)}</p><div class="meta"><span>${esc(r.category)}</span><span>${esc(r.location)}</span><span>${new Date(r.date).toLocaleString()}</span></div></article>`).join(""):`<div class="card empty">No reports match your search.</div>`}
 search.addEventListener("input",render);filter.addEventListener("change",render);render();
});
