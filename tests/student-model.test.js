'use strict';
const test = require('node:test'), assert = require('node:assert/strict'), fs = require('node:fs'), vm = require('node:vm'), path = require('node:path');
const root = path.join(__dirname,'..');
const c = { window:{}, document:{addEventListener(){},querySelector(){return null},querySelectorAll(){return[]}}, console };
for(const file of ['curriculum-data.js','student-data-model.js','topic-data.js','admission-pages.js','app.js'])vm.runInNewContext(fs.readFileSync(path.join(root,file),'utf8'),c);
const run = code => vm.runInNewContext(code,c);
const source=c.window.ANJWA_CURRICULUM_DATA, model=c.window.ANJWA_STUDENT_MODEL;
test('current grade/cohort views share the same course rows, operating modes and calculated credits',()=>{
 for(const [grade,key] of Object.entries(model.gradeCohorts))for(const sem of ['1','2']){
  const term=grade+'-'+sem;
  const signatures=p=>p.courses.filter(x=>x.semesters.includes(term)).map(x=>[x.id,x.subjectId,x.markers[term],x.deliveryMode]).sort();
  assert.deepEqual(signatures(model.curriculum.plans.current2026),signatures(model.curriculum.plans[key]),term);
  assert.equal(run(`getCurriculumSummaryForScope(curriculumData.plans.current2026,['${term}']).totalCredits`),run(`getCurriculumSummaryForScope(curriculumData.plans.${key},['${term}']).totalCredits`),term);
 }
 assert.equal(run("getCurriculumSummaryForScope(curriculumData.plans.incoming2026,['1-1']).totalCredits"),34);
 assert.equal(run("getCurriculumSummaryForScope(curriculumData.plans.current2026,['1-1']).courseCredits"),31);
 // Raw imported snapshots remain unchanged for provenance; no synthetic credit patch.
 assert.equal(Number(source.plans.current2026.summary['1-1'].totalCredits),32);
});
test('all 24 cohort semesters preserve course IDs, markers and original credit budgets',()=>{
 for(const key of ['incoming2024','incoming2025','incoming2026','incoming2027']){
  const imported=source.plans[key], live=model.curriculum.plans[key];
  assert.equal(JSON.stringify(live.courses.map(({id,name,semesters,markers,credits})=>({id,name,semesters,markers,credits}))),JSON.stringify(imported.courses.map(({id,name,semesters,markers,credits})=>({id,name,semesters,markers,credits}))));
  for(const [term,summary]of Object.entries(imported.summary)){
   const actual=run(`getCurriculumSummaryForScope(curriculumData.plans.${key},['${term}'])`);
   assert.equal(actual.courseCredits,Number(summary.courseCredits),key+':'+term+' course');
   assert.equal(actual.totalCredits,Number(summary.totalCredits),key+':'+term+' total');
  }
 }
});
test('online subject IDs match without making the course selectable outside its cohort/term',()=>{
 for(const name of ['정보','물질과 에너지']){
  c.name=name;const matches=run("getSubjectCurriculumMatches(name,'incoming2026')");
  assert.ok(matches.length,name);assert.ok(matches.every(m=>m.deliveryMode==='online'&&m.modeLabel==='학교 편성 온라인'));
  assert.equal(model.subjectId(name,'incoming2026'),model.subjectId('(온) '+name,'incoming2026'));
 }
 assert.notEqual(model.subjectId('정보','incoming2024'),model.subjectId('정보','incoming2026'));
 assert.equal(model.match('없는 과목','incoming2026').length,0);
 assert.equal(run("getNextChoiceTarget('incoming2026')"),'2-1');
 assert.equal(run("getNextChoiceTarget('incoming2025')"),'3-1');
 assert.equal(run("getNextChoiceTarget('incoming2024')"),'');
 // A future cohort with a first-year choice must start there, not be hardcoded to second year.
 run("curriculumData.plans.incoming2027.courses.push({section:'학생선택',semesters:['1-2'],markers:{'1-2':'[택1] / 2'}})");
 assert.equal(run("getNextChoiceTarget('incoming2027')"),'1-2');
 model.curriculum.plans.incoming2027.courses.pop();
});
test('all comprehension prompts have answers/explanations/actions and English lexical limits are coherent',()=>{
 for(const page of Object.values(c.window.ANJWA_ADMISSION_PAGES.pages)){
  assert.equal(page.understandingChecks.length,page.guide.items.length);
  for(const check of page.understandingChecks)assert.ok(check.answer&&check.explanation&&check.nextAction);
 }
 const english=c.window.ANJWA_TOPIC_DATA.topics.find(t=>t.id==='eng-reading-keywords');
 assert.equal(english.sourceIds.length,0);assert.match(english.limits,/빈도/);assert.doesNotMatch(english.limits,/공유 횟수|후속 실험/);
});

test('per-semester credits use choice budget and do not divide it again across semesters',()=>{
 const plan=model.curriculum.plans.incoming2024;
 const literature=plan.courses.find(c=>c.name==='문학'); c.literature=literature;
 assert.equal(run("getPlannerCourseCredits(literature,'2','1')"),3);
 assert.equal(run("getCurriculumCourseCreditsForScope(literature,['2-1','2-2'])"),6);
 const choice=plan.courses.find(c=>c.markers['3-1']==='[택3] / 12');c.choice=choice;
 assert.equal(run("getPlannerCourseCredits(choice,'3','1')"),4);
 assert.equal(run("getPlannerCourseCredits(choice,'3','2')"),4);
 c.saved={3:{1:{regular:[{id:choice.id,credits:2,reason:'가상 저장 이유'}]}}};
 const restored=run('normalizePlannerPlan(saved)');assert.equal(restored['3']['1'].regular[0].credits,4);assert.equal(restored['3']['1'].regular[0].reason,'가상 저장 이유');assert.equal(c.saved[3][1].regular[0].credits,2);
});
test('identical reordered options are grouped; subset options name omitted subjects',()=>{
 const target={innerHTML:''};c.document.querySelector=()=>target;
 run(`var originalSelections=getCourseDesignerOptionSelections;
 courseDesignerData.optionProfiles=[{id:'deep',label:'집중',code:'A',description:'가상 비교'},{id:'balanced',label:'균형',code:'B',description:'가상 비교'},{id:'explore',label:'탐색',code:'C',description:'가상 비교'}];
 var testCourses=curriculumData.plans.incoming2026.courses.slice(0,2);
 getCourseDesignerOptionSelections=(_,id)=>({'1':(id==='deep'?testCourses:[...testCourses].reverse()).map(course=>({course}))});
 renderCourseDesignerOptionTabs({});`);
 assert.equal((target.innerHTML.match(/role="tab"/g)||[]).length,1);
 assert.match(target.innerHTML,/과목 구성이 같아/);
 run(`getCourseDesignerOptionSelections=(_,id)=>({'1':(id==='deep'?testCourses.slice(0,1):testCourses).map(course=>({course}))});renderCourseDesignerOptionTabs({});`);
 assert.equal((target.innerHTML.match(/role="tab"/g)||[]).length,2);
 assert.match(target.innerHTML,/이 안에서 빠짐 1학년 공통국어2/);
 run('getCourseDesignerOptionSelections=originalSelections');c.document.querySelector=()=>null;
});
test('mixed current-year lookup retains each cohort curriculum revision',()=>{
 const matches=model.match('기하','current2026');assert.ok(matches.length);
 assert.ok(matches.some(c=>c.cohortPlanKey==='incoming2024'&&c.subjectId.startsWith('2015:')));
 for(const match of matches)assert.equal(match.subjectId,model.subjectId('기하',match.cohortPlanKey));
});
