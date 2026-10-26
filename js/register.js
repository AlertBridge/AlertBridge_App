document.addEventListener("DOMContentLoaded",()=>{
 const form=document.querySelector("#registerForm");if(!form)return;
 form.addEventListener("submit",async e=>{e.preventDefault();
  const name=document.querySelector("#name").value.trim(),phone=document.querySelector("#phone").value.trim(),email=document.querySelector("#email").value.trim().toLowerCase(),password=document.querySelector("#password").value,confirm=document.querySelector("#confirmPassword").value;
  if(password!==confirm)return toast("Passwords do not match.");
  if(!form.reportValidity())return;
  const list=users();if(list.some(x=>x.email===email))return toast("An account with this email already exists.");
  try{const user={id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),name,phone,email,passwordHash:await hashPassword(password),createdAt:new Date().toISOString()};list.push(user);saveUsers(list);setCurrentUser({id:user.id,name,phone,email,createdAt:user.createdAt});addNotification("Account created","Your SafeCommunity profile is ready on this browser.");location.href="dashboard.html";}catch(err){toast(err.message||"Could not create account.")}
 });
});
