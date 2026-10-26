document.addEventListener("DOMContentLoaded",()=>{
 const form=document.querySelector("#loginForm");if(!form)return;
 form.addEventListener("submit",async e=>{e.preventDefault();const email=document.querySelector("#email").value.trim().toLowerCase(),password=document.querySelector("#password").value;
  try{const passwordHash=await hashPassword(password),list=users();let u=list.find(x=>x.email===email&&(x.passwordHash===passwordHash||x.password===password));if(!u){toast("Email or password is incorrect.");return}if(u.password){u.passwordHash=passwordHash;delete u.password;saveUsers(list)}const {passwordHash:ignored,password:ignoredLegacy,...safeUser}=u;setCurrentUser(safeUser);toast("Signed in successfully.");setTimeout(()=>location.href="dashboard.html",250);}catch(err){toast(err.message||"Unable to sign in.")}
 });
});
