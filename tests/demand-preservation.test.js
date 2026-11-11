'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),crypto=require('node:crypto');
const D=require('../demand-core.js'),V=require('../planner-validation.js');
async function setup({storage=new Map(),confirm=true,search='',blocked=false,planner=null}={}){
 const nodes=new Map(),events={},downloads=[],messages=[];
 const node=id=>{if(!nodes.has(id))nodes.set(id,{value:({demandGrade:'2',demandRound:'1',demandStatus:'active'})[id]||'',innerHTML:'',textContent:'',listeners:{},add(){},focus(){},addEventListener(type,fn){(this.listeners[type]??=[]).push(fn)}});return nodes.get(id)};
 const a={id:'a',name:'과목 A',section:'학생선택',semesters:['2-1'],markers:{'2-1':'[택1] / 3'},row:1,deliveryMode:'classroom',offeringStatus:'classroom',credits:3};
 const plans={incoming2026:{courses:[a],summary:{}},incoming2025:{courses:[{...a,id:'b'}],summary:{}}};
 const c={AnjwaDemand:D,AnjwaPlannerValidation:V,AnjwaDemandFiles:{displayDate:s=>s,workbook:(records,ctx)=>({records,ctx}),download:b=>downloads.push(b)},window:{ANJWA_STUDENT_MODEL:{curriculum:{plans},label:()=> '교내 대면'},addEventListener:(type,fn)=>events[type]=fn},document:{body:{hasAttribute:()=>false},getElementById:node,querySelector:()=>({focus(){}})},location:{search},sessionStorage:{getItem:k=>storage.get(k)||null,setItem(k,v){if(blocked)throw Error('storage blocked');storage.set(k,v)},removeItem:k=>storage.delete(k)},localStorage:{getItem:()=>planner?JSON.stringify(planner):null},crypto:crypto.webcrypto,TextEncoder,TextDecoder,structuredClone,URLSearchParams,Option:function(){},CSS:{escape:x=>x},confirm:s=>{messages.push(s);return confirm},console};
 await vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname,'../demand-ui.js'),'utf8'),c);
 const emit=async(id,type)=>{for(const fn of node(id).listeners[type]||[])await fn({target:node(id)})};
 const select=()=>node('demandGroups').onchange({target:{dataset:{course:'a',role:'primary'},checked:true,closest:()=>({dataset:{group:'2-1-choice-1'}})}});
 return {node,emit,select,storage,events,downloads,messages};
}
test('round edits preserve chosen courses, invalidate preview and export the live round',async()=>{
 const s=await setup();s.node('demandNumber').value='99991';s.node('demandName').value='가상';s.select();
 s.node('applicationPreview').innerHTML='old';s.node('demandRound').value='2';await s.emit('demandRound','input');await s.emit('demandRound','change');
 assert.equal(s.node('applicationPreview').innerHTML,'');await s.node('studentXlsx').onclick();assert.deepEqual([...s.downloads[0].records[0].answers[0].primary],['a']);assert.equal(s.downloads[0].records[0].round,'2');
 let warned=false;s.events.beforeunload({preventDefault(){warned=true}});assert.equal(warned,false);
 s.node('demandName').value='가상 수정';await s.emit('demandName','input');s.events.beforeunload({preventDefault(){warned=true}});assert.equal(warned,true);
});
test('reload and cohort round trips restore the draft without mixing cohorts',async()=>{
 const s=await setup();s.select();s.node('demandPlan').value='incoming2025';await s.emit('demandPlan','change');assert.match(s.node('demandGroups').innerHTML,/data-course="b"/);
 s.node('demandPlan').value='incoming2026';await s.emit('demandPlan','change');assert.match(s.node('demandGroups').innerHTML,/data-course="a" data-role="primary" checked/);
 const reloaded=await setup({storage:s.storage});assert.match(reloaded.node('demandGroups').innerHTML,/data-course="a" data-role="primary" checked/);
});
test('cancelled target changes preserve controls, draft and enabled download buttons',async()=>{
 const s=await setup({confirm:false});s.select();s.node('demandPlan').value='incoming2025';await s.emit('demandPlan','change');assert.equal(s.node('demandPlan').value,'incoming2026');assert.equal(s.node('studentXlsx').disabled,false);assert.match(s.node('demandGroups').innerHTML,/data-course="a" data-role="primary" checked/);
});
test('blocked session storage still warns before leaving and permits file export',async()=>{
 const s=await setup({blocked:true});s.select();s.node('demandNumber').value='99991';s.node('demandName').value='가상';await s.emit('demandName','input');assert.match(s.node('draftStatus').textContent,/임시저장을 사용할 수 없습니다/);let warned=false;s.events.beforeunload({preventDefault(){warned=true}});assert.equal(warned,true);s.node('studentXlsx').onclick();assert.equal(s.downloads.length,1);
});
test('student finish clears every cohort draft and identity from this tab',async()=>{
 const s=await setup();s.node('demandNumber').value='99991';s.select();s.node('finishDemand').onclick();await new Promise(resolve=>setImmediate(resolve));const reloaded=await setup({storage:s.storage});assert.equal(reloaded.node('demandNumber').value,'');assert.doesNotMatch(reloaded.node('demandGroups').innerHTML,/data-role="primary" checked/);
});
test('planner import skips changed credits and preserves the original stored plan',async()=>{
 const planner={plannerPlan:'incoming2026',plan:{2:{1:{regular:[{id:'a',credits:2}]}}},plannerStudentNumber:'99991'};
 const s=await setup({planner});s.node('importPlanner').onclick();assert.match(s.node('demandMessage').textContent,/확인이 필요한 1건/);assert.doesNotMatch(s.node('demandGroups').innerHTML,/data-role="primary" checked/);assert.equal(planner.plan[2][1].regular[0].credits,2);
});
test('changed curriculum keeps old tab drafts visible for reference without silently reapplying choices',async()=>{
 const original=await setup();original.node('demandNumber').value='99991';original.select();
 const data=JSON.parse(original.storage.get('anjwa.courseDemand.tabDraft.v1'));const [key,entry]=Object.entries(data.entries)[0],parts=JSON.parse(key);parts[2]='old-curriculum';delete data.entries[key];data.entries[JSON.stringify(parts)]=entry;original.storage.set('anjwa.courseDemand.tabDraft.v1',JSON.stringify(data));
 const fresh=await setup({storage:original.storage});assert.equal(fresh.node('previousDrafts').hidden,false);assert.match(fresh.node('previousDrafts').innerHTML,/과목 A/);assert.doesNotMatch(fresh.node('demandGroups').innerHTML,/data-role="primary" checked/);
 assert.ok(Object.keys(JSON.parse(fresh.storage.get('anjwa.courseDemand.tabDraft.v1')).entries).some(k=>k.includes('old-curriculum')));
});
