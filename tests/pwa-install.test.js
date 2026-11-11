'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../pwa-install.js'),'utf8');
function setup({ua='Chrome',protocol='https:',standalone=false}={}){
 const events={},docEvents={},mediaEvents={},panels=[],bodyClasses=new Set();let guide;
 const doc={readyState:'complete',activeElement:null,querySelector:()=>null,querySelectorAll:()=>panels,addEventListener:(k,v)=>docEvents[k]=v,body:{classList:{add:v=>bodyClasses.add(v),remove:v=>bodyClasses.delete(v)},append:n=>guide=n},createElement(){const close={focus(){doc.activeElement=close},addEventListener(){}},content={innerHTML:''};return{hidden:true,querySelector:s=>s==='[data-pwa-guide-content]'?content:close,querySelectorAll:s=>s==='[data-pwa-guide-close]'?[close]:[close],content,close};}};
 for(let i=0;i<2;i++){const handlers={},status={textContent:''},button={disabled:false,textContent:'',isConnected:true,addEventListener:(k,v)=>handlers[k]=v,focus(){doc.activeElement=button;}};panels.push({hidden:false,button,status,handlers,querySelector:s=>s==='[data-pwa-install-button]'?button:status});}
 const media={matches:standalone,addEventListener:(k,v)=>mediaEvents[k]=v};const nav={userAgent:ua,platform:'',maxTouchPoints:0};vm.runInNewContext(source,{navigator:nav,document:doc,window:{navigator:nav,matchMedia:()=>media,location:{protocol},addEventListener:(k,v)=>events[k]=v}});
 const click=(i=0)=>panels[i].handlers.click({currentTarget:panels[i].button});return{events,docEvents,panels,doc,media,mediaEvents,click,guide:()=>guide};
}
test('install fallback is available from each page toolbar with correct platform guidance and focus return',async()=>{
 for(const [options,text] of [[{ua:'iPhone'},/홈 화면에 추가/],[{ua:'Macintosh Safari'},/Dock에 추가/],[{protocol:'file:'},/파일을 직접/],[{},/Chrome·Edge/]]){
  const s=setup(options);await s.click(1);assert.equal(s.guide().hidden,false);assert.match(s.guide().content.innerHTML,text);s.docEvents.keydown({key:'Escape',preventDefault(){}});assert.equal(s.guide().hidden,true);assert.equal(s.doc.activeElement,s.panels[1].button);
 }
});
test('the native prompt is consumed once and an accepted prompt stays pending until appinstalled',async()=>{
 const s=setup();let calls=0,finish;const choice=new Promise(r=>finish=r);s.events.beforeinstallprompt({preventDefault(){},prompt:async()=>calls++,userChoice:choice});const pending=s.click();await s.click();assert.equal(calls,1);assert.equal(s.panels[0].button.disabled,true);finish({outcome:'accepted'});await pending;assert.match(s.panels[0].status.textContent,/진행/);assert.equal(s.panels[0].hidden,false);s.events.appinstalled();assert.ok(s.panels.every(p=>p.hidden));
});
test('a dismissed or failed installation recovers the button and offers manual help',async()=>{
 for(const reject of [false,true]){const s=setup();s.events.beforeinstallprompt({preventDefault(){},prompt:async()=>{if(reject)throw Error('unavailable')},userChoice:Promise.resolve({outcome:'dismissed'})});await s.click();assert.equal(s.panels[0].button.disabled,false);assert.match(s.panels[0].status.textContent,reject?/열지 못했습니다/:/취소/);await s.click();assert.equal(s.guide().hidden,false);}
});
test('installed display mode hides controls and modal keyboard navigation stays inside the dialog',async()=>{
 const s=setup({standalone:true});assert.ok(s.panels.every(p=>p.hidden));s.media.matches=false;s.mediaEvents.change();assert.ok(s.panels.every(p=>!p.hidden));await s.click();let prevented=false;s.docEvents.keydown({key:'Tab',shiftKey:false,preventDefault(){prevented=true}});assert.equal(prevented,true);assert.equal(s.doc.activeElement,s.guide().close);
});
