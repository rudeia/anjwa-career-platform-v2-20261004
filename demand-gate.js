
(function(){
  const PASSWORD_HASH = "116345b63a9ddada441b3bcf09fec1ae3f29ecfbb2dbb2a57d6b97abef6db7e3";
  const PASSWORD_HASH_PREFIX = "anjwa-highschool-curriapp:";
  const SESSION_KEY = "anjwa.teacherDashboard.unlocked";
async function unlock(value){const bytes=new TextEncoder().encode(`${PASSWORD_HASH_PREFIX}${value}`);const digest=await crypto.subtle.digest('SHA-256',bytes);return Array.from(new Uint8Array(digest),x=>x.toString(16).padStart(2,'0')).join('')===PASSWORD_HASH;}
function open(){document.getElementById('teacherGate').hidden=true;document.getElementById('teacherApp').hidden=false;}
const form=document.getElementById('teacherGateForm');form.addEventListener('submit',async event=>{event.preventDefault();const button=form.querySelector('button');button.disabled=true;try{if(await unlock(document.getElementById('teacherPassword').value)){sessionStorage.setItem(SESSION_KEY,'1');document.getElementById('teacherPassword').value='';open();}else document.getElementById('gateError').textContent='비밀번호가 맞지 않습니다.';}catch{document.getElementById('gateError').textContent='접속 확인이 실패했습니다. 이 브라우저의 저장/보안 설정을 확인하세요.';}finally{button.disabled=false;}});if(sessionStorage.getItem(SESSION_KEY)==='1')open();
})();
