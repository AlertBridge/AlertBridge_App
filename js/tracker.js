
document.addEventListener("DOMContentLoaded",()=>{
 if(!requireAuth())return;let state=getJSON(SC.trackerKey,{active:false,start:null,checkins:[],destination:"",trustedContact:""}),interval=null;
 const timer=document.querySelector("#timer"),dot=document.querySelector("#trackerDot"),label=document.querySelector("#trackerLabel"),msg=document.querySelector("#trackerMessage"),checkins=document.querySelector("#checkins");
 document.querySelector("#destination").value=state.destination||"";document.querySelector("#trustedContact").value=state.trustedContact||"";
 function save(){setJSON(SC.trackerKey,state)}
 function render(){dot.classList.toggle("on",state.active);label.textContent=state.active?"Tracker is active":"Tracker is inactive";renderTime();checkins.innerHTML=state.checkins.length?state.checkins.map(c=>`<div class="checkin"><b>${esc(c.note)}</b><br><span class="small">${new Date(c.time).toLocaleString()}</span></div>`).join(""):`<div class="empty">No check-ins yet.</div>`}
 function renderTime(){const seconds=state.start?Math.floor((Date.now()-state.start)/1000):0;const h=String(Math.floor(seconds/3600)).padStart(2,"0"),m=String(Math.floor(seconds%3600/60)).padStart(2,"0"),s=String(seconds%60).padStart(2,"0");timer.textContent=`${h}:${m}:${s}`}
 document.querySelector("#startTracker").onclick=()=>{if(state.active)return toast("Tracker is already active.");state.destination=document.querySelector("#destination").value;state.trustedContact=document.querySelector("#trustedContact").value;state.start=Date.now();state.active=true;save();addNotification("Safety tracker started","Your journey tracker is active.");toast("Journey started.");interval=setInterval(renderTime,1000);render()};
 document.querySelector("#checkIn").onclick=()=>{if(!state.active)return toast("Start a journey first.");state.checkins.unshift({time:new Date().toISOString(),note:"Safety check-in completed"});save();addNotification("Safety check-in","Your tracker check-in was recorded.");toast("Check-in recorded.");render()};
 document.querySelector("#stopTracker").onclick=()=>{if(!state.active)return toast("Tracker is not active.");state.active=false;state.start=null;save();clearInterval(interval);addNotification("Safety tracker stopped","Your journey tracker was stopped.");toast("Journey stopped.");render()};
 render();if(state.active)interval=setInterval(renderTime,1000);
});
