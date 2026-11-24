'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..');
const files=['curriculum-data.js','subject-guide-data.js','subject-detail-data.js','subject-supplement-data.js','subject-classroom-data.js','course-designer-data.js','subject-profile.js','subject-overview-core-data.js','subject-overview-science-society-data.js','subject-overview-applied-data.js','subject-overview.js','subject-experience.js','subject-library.js'];
function fixture(){
 const c={window:{},URL};for(const file of files)vm.runInNewContext(fs.readFileSync(path.join(root,file),'utf8'),c);
 const w=c.window,records=w.AnjwaSubjectLibrary.buildCatalogue(w.ANJWA_CURRICULUM_DATA,w.ANJWA_SUBJECT_GUIDE,w.ANJWA_COURSE_DESIGNER);
 return {w,records,api:w.AnjwaSubjectOverview};
}
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
test('all catalogue subjects have three to five distinct, concise learning points under their own curriculum ID',()=>{
 const {api,records}=fixture();assert.equal(records.length,250);
 assert.deepEqual(Object.keys(api.data).sort(),Array.from(records,r=>r.id).sort());
 for(const record of records){
  const points=api.get(record,record.profile);
  assert.ok(points.length>=3&&points.length<=5,record.id);
  assert.equal(new Set(points).size,points.length,record.id+' repeated points');
  assert.deepEqual(Array.from(points),Array.from(api.data[record.id]),record.id+' authored points');
  for(const point of points){
   assert.equal(point,point.trim(),record.id);assert.ok(point.length>=6&&point.length<=95,record.id+': '+point);
   assert.doesNotMatch(point,/합니다[.!]?$|됩니다[.!]?$|있습니다[.!]?$|역량\s*(함양|강화)|기반\s*마련|도움이\s*됩니다|[\r\n]/,record.id+': '+point);
  }
 }
});
test('the approved Korean example is preserved and school and library lookups use the same text',()=>{
 const {api}=fixture();
 const expected=['토론의 주장·근거와 논리 파악','같은 주제를 다룬 글의 관점 비교','문법·문학·매체의 표현 방식 이해','생각을 정리해 말하기·글쓰기'];
 assert.deepEqual(Array.from(api.get({subjectId:'2022:공통국어1',name:'공통국어1'})),expected);
 assert.deepEqual(Array.from(api.get({id:'2022:공통국어1',name:'공통국어1'})),expected);
 assert.deepEqual(Array.from(api.get({name:'공통국어1'},{curriculum:'2022 개정'})),expected);
 assert.deepEqual(Array.from(api.get({name:'국어',subjectId:'2015:국어'},{curriculum:'2022 개정'})),Array.from(api.data['2015:국어']));
 const editable=api.get({subjectId:'2022:공통국어1'});editable[0]='changed';assert.equal(api.data['2022:공통국어1'][0],expected[0]);
});
test('the overview presents one bullet list while preserving the full explanation in an optional disclosure',()=>{
 const {api,w,records}=fixture();
 for(const record of records){
  const html=w.AnjwaSubjectExperience.render({course:record,guide:record.profile});
  const intro=html.match(/<div class="subject-experience-intro">([\s\S]*?)<\/div>/)?.[1];
  assert.ok(intro,record.id);assert.doesNotMatch(intro,/<p\b|subject-experience-topics/,record.id+' duplicated introduction');
  assert.equal((intro.match(/<li>/g)||[]).length,api.data[record.id].length,record.id);
  for(const point of api.data[record.id])assert.ok(intro.includes(escape(point)),record.id+': '+point);
  const detail=html.match(/<details class="subject-experience-sources subject-experience-learning-detail">([\s\S]*?)<\/details>/)?.[1];
  assert.ok(detail?.includes(escape(record.profile.learning)),record.id+' original explanation');
  for(const topic of record.profile.learningTopics||[])assert.ok(detail.includes(escape(topic)),record.id+' original topic');
  assert.doesNotMatch(html,/class="subject-experience-topics"/,record.id+' second learning list');
 }
});
test('a new subject can show its supplied topics without inventing a summary or importing another curriculum',()=>{
 const {api}=fixture();
 assert.deepEqual(Array.from(api.get({name:'미등록 과목',subjectId:'2022:미등록과목'},{learningTopics:['첫 단원','둘째 단원','첫 단원']})),['첫 단원','둘째 단원']);
 assert.deepEqual(Array.from(api.get({name:'국어',subjectId:'2022:국어'},{learningTopics:['제공된 범위']})),['제공된 범위']);
 assert.throws(()=>api.mergeCollections({'2022:예시':['a']},{'2022:예시':['b']}),/Duplicate subject overview/);
});
