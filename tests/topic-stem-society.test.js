'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const c={window:{},URL};
for(const file of ['curriculum-data.js','subject-guide-data.js','subject-detail-data.js','subject-supplement-data.js','subject-classroom-data.js','course-designer-data.js','topic-data.js','topic-stem-society-data.js','subject-profile.js'])vm.runInNewContext(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),c);
const w=c.window,extra=w.ANJWA_TOPIC_STEM_SOCIETY_DATA.topics,all=[...w.ANJWA_TOPIC_DATA.topics,...extra];
test('STEM and society activities have distinct processes and complete source-aware teaching plans',()=>{
 assert.ok(extra.length>=20);
 assert.equal(new Set(all.map(t=>t.id)).size,all.length);
 assert.equal(new Set(extra.map(t=>t.method)).size,extra.length);
 for(const t of extra){
  for(const field of ['subject','title','question','method','materials','output','limits','nextStep','measure'])assert.ok(t[field]?.length,t.id+':'+field);
  assert.ok(t.steps.length>=3&&t.concepts.length>=2&&t.relatedSubjects.length,t.id);
  assert.ok(t.reference.title&&t.reference.pages&&t.reference.kind&&t.reference.note,t.id);
  assert.equal(t.careerConnections?.length,2,t.id+':career reasons');
  for(const connection of t.careerConnections){
   assert.ok(t.majors.includes(connection.major),t.id+':major');
   assert.ok(connection.reason.length>=45,t.id+':reason detail');
   assert.doesNotMatch(connection.reason,/바탕|도움|출발점/);
   assert.ok(connection.reason.split(/[.!?]/).filter(s=>s.trim()).length<=2,t.id+':sentence count');
  }
  assert.match(t.careerBasis,/앱의 예시/);assert.match(t.careerBasis,/필수·권장 과목을 뜻하지 않습니다/);
  assert.match(t.reference.note,/아이디어/);
  assert.doesNotMatch(JSON.stringify(t.reference),/\/Users\/|OCR_TEXT|page_\d+|\.txt/);
 }
 assert.ok(extra.some(t=>t.subject==='기본수학1'));
 assert.ok(extra.some(t=>t.subject==='도시의 미래 탐구'));
 assert.ok(extra.some(t=>t.subject==='행성우주과학'));
 assert.ok(extra.some(t=>t.subject==='과학과제 연구'));
});
test('every extension is reachable from an actual catalogue subject and preserves its source limits',()=>{
 const {buildCatalogue}=require('../subject-library.js');
 const records=buildCatalogue(w.ANJWA_CURRICULUM_DATA,w.ANJWA_SUBJECT_GUIDE,w.ANJWA_COURSE_DESIGNER,{topics:{topics:all},classroom:w.ANJWA_SUBJECT_CLASSROOM_PLANS});
 for(const t of extra){
  const primary=records.find(r=>w.AnjwaSubjectProfile.norm(r.name)===w.AnjwaSubjectProfile.norm(t.subject));assert.ok(primary,t.id+':primary subject');
  const matched=primary.profile.activityGuides.find(a=>a.id===t.id);assert.ok(matched,t.id+':activity link');
  assert.equal(matched.limits,t.limits);assert.equal(matched.reference.note,t.reference.note);
 }
});
