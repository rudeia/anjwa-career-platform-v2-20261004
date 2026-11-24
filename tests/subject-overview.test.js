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
test('school and library lookups preserve the same curriculum-specific text and evidence',()=>{
 const {api}=fixture();const expected=Array.from(api.data['2022:공통국어1']);
 assert.deepEqual(Array.from(api.get({subjectId:'2022:공통국어1',name:'공통국어1'})),expected);
 assert.deepEqual(Array.from(api.get({id:'2022:공통국어1',name:'공통국어1'})),expected);
 assert.deepEqual(Array.from(api.get({name:'공통국어1'},{curriculum:'2022 개정'})),expected);
 assert.deepEqual(Array.from(api.get({name:'국어',subjectId:'2015:국어'},{curriculum:'2022 개정'})),Array.from(api.data['2015:국어']));
 assert.equal(api.basis({subjectId:'2022:공통국어1'}),api.basis({id:'2022:공통국어1'}));
 const editable=api.get({subjectId:'2022:공통국어1'});editable[0]='changed';assert.equal(api.data['2022:공통국어1'][0],expected[0]);
});
test('each authored overview either identifies official curriculum evidence or clearly records the missing source',()=>{
 const {api,records}=fixture();assert.deepEqual(Object.keys(api.evidence).sort(),Array.from(records,r=>r.id).sort());
 for(const record of records){
  const basis=api.basis(record,record.profile);assert.ok(['official-curriculum','unverified'].includes(basis.status),record.id);
  assert.doesNotMatch(JSON.stringify(basis),/\/Users\/|\/private\/|\bMD L\d+|\.md(?:\b|:)/,record.id+' private review detail');
  if(basis.status==='official-curriculum'){
   for(const field of ['revision','notice','document','chapter','sourceUrl'])assert.ok(basis[field],record.id+':'+field);
   const url=new URL(basis.sourceUrl);assert.equal(url.protocol,'https:');assert.ok(/(?:^|\.)(?:moe\.go\.kr|ncic\.re\.kr|ne\.go\.kr|law\.go\.kr)$/.test(url.hostname),record.id+' official source');
   assert.equal(basis.pointSources.length,api.data[record.id].length,record.id+' per-point evidence');
   for(const source of basis.pointSources)assert.equal(typeof source,'string',record.id);
   const sections=basis.sections.join(' ');assert.match(sections,/성격/);assert.match(sections,/목표/);assert.match(sections,/내용/);
  }else assert.ok((basis.scopeNote||basis.reason||'').length>=15,record.id+' missing source reason');
 }
});
test('the overview shows one bullet list and exposes the correct source instead of stale secondary descriptions',()=>{
 const {api,w,records}=fixture();
 for(const record of records){
  const html=w.AnjwaSubjectExperience.render({course:record,guide:record.profile});
  const intro=html.match(/<div class="subject-experience-intro">([\s\S]*?)<\/div>/)?.[1];
  assert.ok(intro,record.id);assert.equal((intro.match(/<li>/g)||[]).length,api.data[record.id].length,record.id);
  for(const point of api.data[record.id])assert.ok(intro.includes(escape(point)),record.id+': '+point);
  const detail=html.match(/<details class="subject-experience-sources subject-experience-learning-detail">([\s\S]*?)<\/details>/)?.[1];
  const basis=api.basis(record,record.profile);assert.ok(detail,record.id);
  if(basis.status==='official-curriculum'){
   assert.ok(detail.includes(escape(basis.document))&&detail.includes(escape(basis.chapter)),record.id+' source trace');
   assert.match(detail,/교육과정 근거 확인/);assert.doesNotMatch(detail,/<p>기존 안내/);
   assert.ok(!detail.includes(escape(record.profile.learning)),record.id+' stale description');
  }else{
   assert.match(intro,/승인 교육과정 원문 미확보/);
   for(const ref of basis.references||[])assert.ok(detail.includes(escape(ref.url)),record.id+' reference link');
  }
  assert.doesNotMatch(html,/class="subject-experience-topics"/,record.id+' duplicate learning block');
 }
});
test('checked differences preserve the correct sports categories and the older plane-vector scope',()=>{
 const {api}=fixture();
 assert.match(api.data['2022:스포츠생활2'].join(' '),/필드형/);assert.doesNotMatch(api.data['2022:스포츠생활2'].join(' '),/영역형/);
 assert.match(api.data['2015:기하'].join(' '),/평면\s*벡터/);assert.doesNotMatch(api.data['2015:기하'].join(' '),/공간\s*벡터/);
});
test('library search uses checked curriculum summaries rather than superseded descriptions',()=>{
 const {w}=fixture();
 const sample=[{id:'2022:스포츠생활2',name:'스포츠생활2',area:'체육',revision:'2022',offerings:[],profile:{learning:'폐기설명전용어',learningTopics:['오류단원전용어']}}];
 assert.equal(w.AnjwaSubjectLibrary.filterCatalogue(sample,{query:'필드형'}).length,1);
 for(const query of ['폐기설명전용어','오류단원전용어'])assert.equal(w.AnjwaSubjectLibrary.filterCatalogue(sample,{query}).length,0);
});
test('a new subject can show its supplied topics without inventing a summary or importing another curriculum',()=>{
 const {api}=fixture();
 assert.deepEqual(Array.from(api.get({name:'미등록 과목',subjectId:'2022:미등록과목'},{learningTopics:['첫 단원','둘째 단원','첫 단원']})),['첫 단원','둘째 단원']);
 assert.deepEqual(Array.from(api.get({name:'국어',subjectId:'2022:국어'},{learningTopics:['제공된 범위']})),['제공된 범위']);
 assert.throws(()=>api.mergeCollections({'2022:예시':['a']},{'2022:예시':['b']}),/Duplicate subject overview/);
});

test('all 23 previously missing subjects have reviewed reference learning points without claiming an approved curriculum',()=>{
 const {api}=fixture();const entries=Object.entries(api.evidence).filter(([,b])=>b.status==='unverified');assert.equal(entries.length,23);
 for(const [id,b]of entries){assert.ok(b.references.length,id);assert.equal(b.pointSources.length,api.data[id].length,id);for(const r of b.references){assert.equal(new URL(r.url).protocol,'https:');assert.ok(r.scope.length>20,id);assert.equal(r.checkedAt,'2026-11-25');}}
});
