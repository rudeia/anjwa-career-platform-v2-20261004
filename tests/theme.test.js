'use strict';
const test=require('node:test'),assert=require('node:assert/strict');const T=require('../theme.js');
function setup({stored=null,systemDark=false,blocked=false}={}){
 const events={},mediaEvents={},values=new Map([['student','unchanged'],['teacher','unchanged']]);if(stored)values.set(T.storageKey,stored);
 const root={dataset:{},style:{}},meta={},select={value:'',addEventListener(k,v){events['select-'+k]=v}},status={textContent:''};let mounted=false;
 const doc={readyState:'complete',documentElement:root,querySelector:()=>({setAttribute:(k,v)=>meta[k]=v}),getElementById(id){if(id==='home')return {};if(id==='siteUtilities')return mounted?{}:null;if(id==='siteTheme')return mounted?select:null;if(id==='themeStorageNote')return mounted?status:null;},createElement:()=>({setAttribute(){}}),body:{prepend(){mounted=true;}}};
 const media={matches:systemDark,addEventListener:(k,v)=>mediaEvents[k]=v};const host={document:doc,matchMedia:()=>media,localStorage:{getItem:k=>values.get(k)||null,setItem(k,v){assert.equal(k,T.storageKey);if(blocked)throw Error('blocked');values.set(k,v);}},addEventListener:(k,v)=>events[k]=v};
 const api=T.mount(host);return{api,root,media,events,mediaEvents,values,meta,select,status};
}
test('theme defaults to system, validates saved choices and sets the first paint scheme',()=>{
 const a=setup({systemDark:true});assert.equal(a.root.dataset.theme,'dark');assert.equal(a.root.style.colorScheme,'dark');assert.equal(a.api.getPreference(),'system');
 const b=setup({stored:'light',systemDark:true});assert.equal(b.root.dataset.theme,'light');assert.equal(b.select.value,'light');assert.equal(setup({stored:'constructor'}).api.getPreference(),'system');
});
test('system changes affect only system preference; explicit choice persists without touching student data',()=>{
 const s=setup();s.media.matches=true;s.mediaEvents.change();assert.equal(s.root.dataset.theme,'dark');s.api.set('light');s.mediaEvents.change();assert.equal(s.root.dataset.theme,'light');assert.equal(s.values.get(T.storageKey),'light');assert.equal(s.values.get('student'),'unchanged');assert.equal(s.values.get('teacher'),'unchanged');
});
test('blocked theme storage still applies changes and explains the lack of persistence',()=>{
 const s=setup({blocked:true});s.api.set('dark');assert.equal(s.root.dataset.theme,'dark');assert.match(s.status.textContent,/저장할 수 없습니다/);
});
test('theme preference synchronizes between pages and clearing storage restores system mode',()=>{
 const s=setup({stored:'light',systemDark:true});s.events.storage({key:T.storageKey,newValue:'dark'});assert.equal(s.root.dataset.theme,'dark');s.events.storage({key:'student',newValue:'private'});assert.equal(s.api.getPreference(),'dark');s.events.storage({key:null,newValue:null});assert.equal(s.api.getPreference(),'system');assert.equal(s.root.dataset.theme,'dark');
});
