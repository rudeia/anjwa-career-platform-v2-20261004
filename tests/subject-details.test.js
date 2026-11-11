'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..');
const evidence=JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures/naver-subject-evidence.json'),'utf8'));
const c={window:{},document:{addEventListener(){},querySelector(){return null},querySelectorAll(){return []}},console};
for(const file of ['curriculum-data.js','student-data-model.js','subject-guide-data.js','subject-detail-data.js','app.js'])vm.runInNewContext(fs.readFileSync(path.join(root,file),'utf8'),c);
const run=s=>vm.runInNewContext(s,c);
const profiles=c.window.ANJWA_SUBJECT_GUIDE.subjectProfiles;
test('all 155 reviewed subjects have distinct internal explanations and sourced major examples',()=>{
 assert.equal(evidence.length,155);
 const learnings=new Set();
 for(const source of evidence){
  const p=profiles[source.name];assert.ok(p,source.name);assert.ok(p.learning.length>25);learnings.add(p.learning);
  assert.ok(p.activities.length&&p.learningTopics.length&&p.majorConnections.length);
  assert.equal(p.sourceUrl,source.url);assert.match(p.sourceUrl,/^https:\/\/edu\.naver\.com\/subjects-guide\/subjects\/[A-Z0-9]+$/);
  for(const {major,reason} of p.majorConnections){assert.ok(reason.length>12,source.name);if(source.majors.length)assert.ok(source.majors.includes(major),source.name+major);}
  if(!source.majors.length)assert.match(p.majorBasis,/앱에서 연결/);
 }
 assert.equal(learnings.size,155);
});
test('revised descriptions are not attached to old curricula or school-specific variants',()=>{
 const guide=(name,id='')=>run(`getSubjectGuideInfo(${JSON.stringify({name,area:'교양',subjectId:id})},{title:'',description:'',tracks:[]})`);
 assert.match(guide('(온) 생태와 환경').learning,/환경 갈등/);
 assert.equal(guide('기하','2015:기하').sourceUrl,'');
 assert.equal(guide('(고시외) 생태와 환경').sourceUrl,'');
 assert.equal(guide('군대윤리(광주)').sourceUrl,'');
 assert.equal(profiles['수학Ⅰ'].curriculum,'2015 개정');
});
test('subject popup renders learning and major reasons inside the app',()=>{
 const elements=new Map();c.$=selector=>{if(!elements.has(selector))elements.set(selector,{innerHTML:'',textContent:'',classList:{add(){}},focus(){}});return elements.get(selector)};
 c.document.body={classList:{add(){}}};
 // Isolate the popup's current school-offering lookup; validate its real guide and escaping.
 c.getSubjectRelationInfo=()=>({title:'',description:'',tracks:[]});c.getSubjectGuideOfferings=()=>[];
 run(`openSubjectInfoPopup({name:'생태와 환경',area:'교양',category:'일반'})`);
 const html=elements.get('#subjectInfoContent').innerHTML;
 assert.match(html,/환경 갈등과 기후위기/);assert.match(html,/학과와 이렇게 연결돼요/);assert.match(html,/환경교육과/);assert.match(html,/환경 문제를 이해하고 참여를 이끄는 교육/);
 assert.doesNotMatch(html,/네이버에서 과목 설명.*보기/);
 assert.match(html,/자료 출처 · 안내 기준/);
});
