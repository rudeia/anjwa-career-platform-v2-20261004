(function(host,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(host.document)host.AnjwaTheme=api.mount(host);})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const storageKey='anjwa.appearance.v1';
const normalize=value=>['light','dark','system'].includes(value)?value:'system';
const resolve=(preference,systemDark)=>normalize(preference)==='system'?(systemDark?'dark':'light'):normalize(preference);
function mount(host){
 const doc=host.document,media=host.matchMedia('(prefers-color-scheme: dark)');let preference='system',storageFailed=false;
 try{preference=normalize(host.localStorage.getItem(storageKey));}catch{}
 function apply(){const effective=resolve(preference,media.matches);doc.documentElement.dataset.theme=effective;doc.documentElement.dataset.themePreference=preference;doc.documentElement.style.colorScheme=effective;
 doc.querySelector('meta[name="theme-color"]')?.setAttribute('content',effective==='dark'?'#25212b':'#f8f5ee');
 const select=doc.getElementById('siteTheme');if(select)select.value=preference;const status=doc.getElementById('themeStorageNote');if(status)status.textContent=storageFailed?'테마 선택을 저장할 수 없습니다. 현재 화면에는 적용했습니다.':'';
 }
 function set(value){preference=normalize(value);try{host.localStorage.setItem(storageKey,preference);storageFailed=false;}catch{storageFailed=true;}apply();}
 function controls(){if(!doc.getElementById('home')||doc.getElementById('siteUtilities'))return;const toolbar=doc.createElement('div');toolbar.id='siteUtilities';toolbar.className='site-utilities';toolbar.setAttribute('aria-label','화면 설정과 앱 설치');toolbar.innerHTML='<label class="theme-control" for="siteTheme"><span>화면 테마</span><select id="siteTheme"><option value="system">기기 설정</option><option value="light">라이트</option><option value="dark">다크</option></select></label><div data-pwa-install><button type="button" class="pwa-install-button" data-pwa-install-button>앱 설치</button><span data-pwa-install-status aria-live="polite">설치 안내</span></div><span id="themeStorageNote" class="theme-storage-note" role="status"></span>';
 doc.body.prepend(toolbar);doc.getElementById('siteTheme').addEventListener('change',event=>set(event.target.value));apply();}
 apply();if(doc.readyState==='loading')doc.addEventListener('DOMContentLoaded',controls,{once:true});else controls();
 media.addEventListener?.('change',()=>{if(preference==='system')apply();});host.addEventListener('storage',event=>{if(event.key===storageKey||event.key===null){preference=normalize(event.newValue);storageFailed=false;apply();}});
 return{set,getPreference:()=>preference};
}
return{storageKey,normalize,resolve,mount};
});
