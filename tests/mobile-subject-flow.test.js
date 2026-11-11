'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const {readSearchState,searchStateParams}=require('../subject-library.js');
const records=[{area:'수학',revision:'2015'},{area:'과학',revision:'2022'}];
test('search conditions round-trip in the page URL and resetting preserves curriculum context',()=>{
 const original=new URLSearchParams('from=curriculum&dept=military');
 const state={query:'생명과학 Ⅱ',area:'과학',offering:'outside',revision:'2015'};
 const saved=searchStateParams(original,state);assert.deepEqual(readSearchState(saved,records),state);
 assert.equal(original.get('q'),null);
 const reset=searchStateParams(saved,{query:'',area:'all',offering:'all',revision:'all'});
 assert.equal(reset.toString(),'from=curriculum&dept=military');
});
test('unsupported bookmarked filters safely return to all and oversized queries are bounded',()=>{
 assert.deepEqual(readSearchState(new URLSearchParams('area=unknown&offering=bad&revision=2009&q='+ '가'.repeat(250)),records),{query:'가'.repeat(200),area:'all',offering:'all',revision:'all'});
});
test('the curriculum subject popup resets scrolling, traps focus and returns to the triggering explanation button',()=>{
 const events=new Map(),elements=new Map();
 const doc={activeElement:null,addEventListener:(name,fn)=>events.set(name,fn),querySelector(){return null},querySelectorAll(){return []},body:{classList:{add(){},remove(){}}}};
 class Element{constructor(){this.dataset={};this.isConnected=true;this.disabled=false;this.hidden=false;}closest(selector){return selector==='[data-subject-info]'?this:null;}getClientRects(){return [{}];}focus(options){doc.activeElement=this;this.lastFocusOptions=options;}}
 const opener=new Element();opener.dataset={subjectName:'생태와 환경',subjectArea:'교양',subjectCategory:'일반',subjectId:'2022:생태와환경'};
 const close=new Element(),link=new Element(),dialog={scrollTop:400};
 const modal={hidden:true,querySelector:()=>dialog,querySelectorAll:()=>[close,link],contains:e=>e===close||e===link};
 elements.set('#subjectInfoModal',modal);elements.set('.subject-info-close',close);
 const c={window:{},document:doc,Element,console};
 for(const file of ['curriculum-data.js','student-data-model.js','subject-guide-data.js','subject-detail-data.js','subject-supplement-data.js','subject-profile.js','app.js'])vm.runInNewContext(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),c);
 c.$=selector=>{if(!elements.has(selector))elements.set(selector,{innerHTML:'',textContent:''});return elements.get(selector)};
 c.getSubjectRelationInfo=()=>({title:'',tracks:[],description:''});c.getSubjectGuideOfferings=()=>[];
 c.bindSubjectInfoPopup();doc.activeElement=opener;
 events.get('click')({target:opener,preventDefault(){},stopPropagation(){}});
 assert.equal(modal.hidden,false);assert.equal(dialog.scrollTop,0);assert.equal(doc.activeElement,close);
 doc.activeElement=link;let prevented=false;
 events.get('keydown')({key:'Tab',shiftKey:false,preventDefault(){prevented=true}});assert.ok(prevented);assert.equal(doc.activeElement,close);
 events.get('keydown')({key:'Tab',shiftKey:true,preventDefault(){}});assert.equal(doc.activeElement,link);
 events.get('keydown')({key:'Escape',preventDefault(){}});assert.equal(modal.hidden,true);assert.equal(doc.activeElement,opener);assert.equal(opener.lastFocusOptions.preventScroll,true);
});
