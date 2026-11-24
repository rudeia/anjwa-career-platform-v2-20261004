'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const {buildCatalogue,filterCatalogue}=require('../subject-library.js');
function fixture(){
 const handlers={},document={addEventListener(name,fn){handlers[name]=fn;}};
 const c={window:{document},URL};
 for(const f of ['curriculum-data.js','subject-guide-data.js','subject-detail-data.js','subject-supplement-data.js','subject-classroom-data.js','course-designer-data.js','topic-data.js','recommendation-data.js','university-recommendation-data.js','subject-profile.js'])vm.runInNewContext(fs.readFileSync(path.join(__dirname,'..',f),'utf8'),c);
 const w=c.window,context={designer:w.ANJWA_COURSE_DESIGNER,topics:w.ANJWA_TOPIC_DATA,fields:w.ANJWA_RECOMMENDATION_DATA,universities:w.ANJWA_UNIVERSITY_RECOMMENDATION_DATA};
 return {w,handlers,context,records:buildCatalogue(w.ANJWA_CURRICULUM_DATA,w.ANJWA_SUBJECT_GUIDE,context.designer,context)};
}
test('all detailed activity records become accessible from subjects without changing source data',()=>{
 const {w,records,context}=fixture(),before=JSON.stringify([context.topics,context.universities,w.ANJWA_SUBJECT_GUIDE]);
 const linked=new Set(records.flatMap(r=>r.profile.activityGuides.map(t=>t.id)));
 assert.equal(linked.size,context.topics.topics.length);
 for(const t of context.topics.topics){
  const activity=records.flatMap(r=>r.profile.activityGuides).find(a=>a.id===t.id);
  for(const key of ['question','method','output','limits','materials','steps','preparation','sourceIds'])assert.equal(JSON.stringify(activity[key]),JSON.stringify(t[key]),t.id+':'+key);
 }
 assert.ok(records.find(r=>r.name==='생명과학').profile.careerPaths.some(p=>p.id==='nursing_health'));
 assert.ok(records.find(r=>r.name==='생명과학Ⅰ').profile.careerPaths.some(p=>p.id==='nursing_health'&&p.matchType==='related'));
 assert.equal(JSON.stringify([context.topics,context.universities,w.ANJWA_SUBJECT_GUIDE]),before);
});
test('related activities disclose their different subject and do not spread by a broad curriculum area',()=>{
 const {records}=fixture(),ecology=records.find(r=>r.name==='한국지리 탐구').profile,command=records.find(r=>r.name==='군리더십(광주)').profile;
 assert.ok(ecology.activityGuides.some(t=>t.subject==='한국지리'&&t.matchType==='related'&&t.matchNote.includes('필요한 개념')));
 assert.equal(command.activityGuides.length,0);
 assert.ok(filterCatalogue(records,{query:'효소 활성'}).some(r=>r.name==='세포와 물질대사'));
 const chemistry=filterCatalogue(records,{query:'화학'});assert.equal(chemistry[0].name,'화학');assert.ok(chemistry.some(r=>r.name==='화학 반응의 세계'));
 assert.ok(filterCatalogue(records,{query:'컴퓨터·AI·데이터'}).length||filterCatalogue(records,{query:'인공지능'}).length);
});
test('unverified university evidence keeps original subjects, year and conditions and renders six initially',()=>{
 const {w,records,context,handlers}=fixture(),p=records.find(r=>r.name==='확률과 통계').profile,api=w.AnjwaSubjectProfile;
 assert.ok(p.universityEvidence.length>6);
 for(const r of p.universityEvidence){
  const original=context.universities.records.find(o=>o.id===r.id);
  for(const key of ['verificationStatus','admissionYear','condition','coreSubjects','recommendedSubjects','note'])assert.equal(JSON.stringify(r[key]),JSON.stringify(original[key]),r.id+':'+key);
 }
 const html=api.renderContext(p);
 assert.equal((html.match(/class="subject-context-university"/g)||[]).length,6);
 assert.match(html,/적용 학년도 정보 없음/);assert.match(html,/함께 이수할 조건/);assert.match(html,/적용 학년도나 대학 원문이 빠진 항목/);
 const results={innerHTML:''},input={value:'간호'},section={dataset:{contextUniversityKey:api.norm('확률과 통계')},querySelector(s){return s==='[data-context-university-search]'?input:results;}};
 input.closest=()=>section;
 handlers.input({target:{closest:()=>input}});
 assert.match(results.innerHTML,/간호/);assert.ok((results.innerHTML.match(/class="subject-context-university"/g)||[]).length<=6);
 input.value='';handlers.click({target:{closest:()=>({dataset:{contextUniversityLimit:'6'},closest:()=>section})},preventDefault(){}});
 assert.equal((results.innerHTML.match(/class="subject-context-university"/g)||[]).length,18);
 const hostile={careerPaths:[{name:'<img src=x>',reason:'<script>x</script>',majors:[]}],activityGuides:[],universityEvidence:[]};
 assert.doesNotMatch(api.renderContext(hostile),/<img|<script>/);
});
test('new classroom plans attach only to the same curriculum subject and show concrete steps as app proposals',()=>{
 const {w}=fixture(),api=w.AnjwaSubjectProfile,plan={learningBridge:'벡터의 방향과 크기를 경로에 연결합니다.',careerConnections:[{major:'수학과',reason:'벡터의 합으로 이동을 설명합니다.'}],activityPlans:[{title:'두 경로 비교',question:'경로의 합은 같은가요?',materials:'좌표가 있는 모눈종이',steps:['경로를 표시합니다.','벡터의 합을 계산합니다.'],output:'벡터 비교표',reflection:'어떤 조건이 달랐나요?',limits:'가상 좌표의 비교입니다.'}],basis:'과목 학습 내용을 바탕으로 작성한 앱의 수업용 제안입니다.'},context={classroom:{'2022:기하':plan}};
 const current=api.enrich({curriculum:'2022 개정'},{name:'(온) 기하',subjectId:'2022:기하'},context);
 assert.equal(current.classroomPlan,plan);assert.equal(api.enrich({curriculum:'2015 개정'},{name:'기하',subjectId:'2015:기하'},context).classroomPlan,null);
 const html=api.renderContext(current);assert.match(html,/수업 개념으로 해볼 활동/);assert.match(html,/벡터의 합을 계산합니다/);assert.match(html,/실제 수행평가 계획을 뜻하지 않습니다/);
});
