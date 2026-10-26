
const SC = {
  userKey:"sc_current_user", usersKey:"sc_users", reportsKey:"sc_reports",
  alertsKey:"sc_alerts", notificationsKey:"sc_notifications", settingsKey:"sc_settings",
  locationKey:"sc_location", trackerKey:"sc_tracker"
};

function getJSON(key, fallback){try{return JSON.parse(localStorage.getItem(key)) ?? fallback}catch(e){return fallback}}
function setJSON(key,val){try{localStorage.setItem(key,JSON.stringify(val));return true}catch(e){toast("Browser storage is unavailable or full.");return false}}
function esc(v=""){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function currentUser(){return getJSON(SC.userKey,null)}
function setCurrentUser(user){setJSON(SC.userKey,user)}
function users(){return getJSON(SC.usersKey,[])}
function saveUsers(list){setJSON(SC.usersKey,list)}
async function hashPassword(password){if(!window.crypto?.subtle)throw new Error("Secure password hashing is unavailable. Run this app on localhost or HTTPS.");const digest=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(password));return Array.from(new Uint8Array(digest)).map(b=>b.toString(16).padStart(2,"0")).join("")}
function toast(message){let t=document.querySelector("#toast");if(!t){t=document.createElement("div");t.id="toast";t.className="toast";document.body.appendChild(t)}t.textContent=message;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2800)}
function requireAuth(){if(!currentUser()){location.href="login.html";return false}return true}
function logout(){localStorage.removeItem(SC.userKey);location.href="login.html"}
function go(page){location.href=page}
function addNotification(title,message,type="info"){
  const preferences=getJSON(SC.settingsKey,{notifications:true,confirmSos:true});
  if(preferences.notifications===false)return;
  const list=getJSON(SC.notificationsKey,[]);
  list.unshift({id:Date.now(),title,message,type,time:new Date().toISOString(),read:false});
  setJSON(SC.notificationsKey,list.slice(0,50));
}
function setupNav(){
  const btn=document.querySelector("#menuBtn"), nav=document.querySelector("#navbar");
  if(btn&&nav) btn.addEventListener("click",()=>nav.classList.toggle("open"));
  document.querySelectorAll("#navbar a").forEach(a=>a.addEventListener("click",()=>nav?.classList.remove("open")));
  document.querySelectorAll("[data-logout]").forEach(b=>b.addEventListener("click",e=>{e.preventDefault();logout()}));
  const user=currentUser();
  document.querySelectorAll("[data-user-name]").forEach(el=>el.textContent=user?.name||"Guest");
  document.querySelectorAll("[data-user-email]").forEach(el=>el.textContent=user?.email||"");
}
function setupAppShell(){
  setupNav();
  document.querySelectorAll("[data-auth-only]").forEach(()=>requireAuth());
}
document.addEventListener("DOMContentLoaded",setupAppShell);
