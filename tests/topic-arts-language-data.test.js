'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..');
function setup(){
 const c={window:{}};
 vm.runInNewContext(fs.readFileSync(path.join(root,'topic-data.js'),'utf8'),c);
 const before=JSON.stringify(c.window.ANJWA_TOPIC_DATA);
 vm.runInNewContext(fs.readFileSync(path.join(root,'topic-arts-language-data.js'),'utf8'),c);
 return {c,before,topics:c.window.ANJWA_TOPIC_EXTENSION_DATA.topics};
}
test('22 added activities contain distinct questions, usable materials, steps, outputs and bounded claims',()=>{
 const {c,topics}=setup();assert.equal(topics.length,22);
 const existing=c.window.ANJWA_TOPIC_DATA.topics;
 for(const topic of topics){
  assert.ok(!existing.some(t=>t.id===topic.id||t.title===topic.title||t.method===topic.method||t.output===topic.output),topic.id+' must not clone an existing activity');
  for(const key of ['id','area','subject','level','title','question','method','materials','preparation','measure','output','reflection','limits','nextStep','gradeBasis','exampleStatus'])assert.ok(typeof topic[key]==='string'&&topic[key],topic.id+':'+key);
  assert.ok(['기초','심화'].includes(topic.level));
  assert.ok(topic.steps.length>=3&&topic.steps.length<=4);
  assert.ok(topic.concepts.length>=2&&topic.keywords.length>=3&&topic.majors.length>=1);
  assert.equal(topic.careerConnections.length,2,topic.id+' career explanations');
  assert.equal(JSON.stringify(topic.careerConnections.map(connection=>connection.major)),JSON.stringify(topic.majors.slice(0,2)));
  for(const connection of topic.careerConnections){assert.ok(connection.reason.length>=35,topic.id);assert.doesNotMatch(connection.reason,/바탕이 됩니다|도움이 됩니다|출발점이 됩니다|필수로 이수해야|반드시 이수/);}
  assert.ok(topic.steps.every(step=>typeof step==='string'&&step.length>15));
  assert.match(topic.exampleStatus,/앱.*제안/);assert.match(topic.gradeBasis,/학년 미지정/);
  assert.ok(Array.isArray(topic.sourceIds)&&topic.sourceIds.length===0);
 }
 assert.equal(new Set(topics.flatMap(topic=>topic.careerConnections.map(connection=>connection.reason))).size,44);
 for(const key of ['id','title','question','method','output'])assert.equal(new Set(topics.map(t=>t[key])).size,topics.length,key+' must differ');
});
test('source references preserve OCR status, old curriculum and the distinction between sources and app tasks',()=>{
 const {topics}=setup();
 for(const topic of topics){
  const r=topic.reference;assert.ok(r.title&&r.pages&&r.kind&&r.note,topic.id);
  assert.match(r.pages,/인쇄 \d+쪽/);assert.match(r.kind,/OCR 본문 검토/);assert.match(r.note,/2015 개정/);assert.match(r.note,/앱 제안/);
  assert.doesNotMatch(JSON.stringify(topic),/\/Users\/|OCR_TEXT|page_\d+|\.txt|source_refs/);
 }
 const manual=topics.find(t=>t.id==='eng-manual-condition-translation');assert.match(manual.limits,/의약품.*군 장비/);
 const diary=topics.find(t=>t.id==='pe-challenge-process-diary');assert.match(diary.output,/실제.*가상/);
 const tactics=topics.find(t=>t.id==='pe-scenario-strategy-uncertainty');assert.match(tactics.limits,/가상.*실제/);
});
test('extension loading preserves the baseline and portable evidence agrees with the displayed source and page',()=>{
 const {c,before,topics}=setup();assert.equal(JSON.stringify(c.window.ANJWA_TOPIC_DATA),before);
 const evidence=JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures/topic-arts-language-evidence.json'),'utf8'));
 assert.equal(evidence.length,topics.length);
 assert.equal(new Set(evidence.map(record=>record.id)).size,topics.length);
 for(const topic of topics){
  const record=evidence.find(item=>item.id===topic.id);assert.ok(record,topic.id);
  assert.deepEqual(Object.keys(record).sort(),['id','printed_pages','reviewed_kind','title']);
  assert.equal(topic.reference.title,record.title,topic.id+' source title');
  const displayedPages=Array.from(topic.reference.pages.matchAll(/\d+/g),match=>Number(match[0]));
  assert.deepEqual(displayedPages,record.printed_pages,topic.id+' printed pages');
  assert.ok(topic.reference.kind.includes(record.reviewed_kind),topic.id+' reviewed material kind');
  assert.match(topic.reference.note,/2015 개정 자료/);
  assert.match(topic.reference.note,/앱 제안/);
  assert.match(topic.reference.note,/같은 공식 과목으로 확정한 안내는 아닙니다/);
 }
 assert.doesNotMatch(JSON.stringify(evidence),/\/Users\/|OCR_TEXT|page_\d+|\.txt|source_refs/);
});
