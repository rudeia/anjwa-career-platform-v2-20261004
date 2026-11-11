'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.join(__dirname,'..');
function setup(){const elements=new Map();const el=s=>{if(!elements.has(s))elements.set(s,{value:'',innerHTML:'',textContent:'',addEventListener(){}});return elements.get(s)};const c={window:{},document:{addEventListener(){},querySelector:el,querySelectorAll(){return[]}},console};for(const file of ['curriculum-data.js','student-data-model.js','app.js'])vm.runInNewContext(fs.readFileSync(path.join(root,file),'utf8'),c);return{c,el,run:s=>vm.runInNewContext(s,c)}}
test('all six revised cohort budgets reconcile, and online subjects follow the supplied semester markers',()=>{
 const {run}=setup();
 for(const dept of ['plans','militaryPlans'])for(const year of [2025,2026,2027]){
  const result=run(`getCurriculumSummaryForScope(curriculumData.${dept}.incoming${year},curriculumSemesterOrder)`);
  assert.equal(result.totalCredits,dept==='plans'&&year<2027?194:192,dept+year);
  assert.equal(result.unresolvedTerms,undefined,dept+year);
 }
 assert.equal(run("getCurriculumSummaryForScope(curriculumData.plans.incoming2027,['1-1']).courseCredits"),28);
 assert.equal(run("getCurriculumSummaryForScope(curriculumData.plans.incoming2027,['2-1']).courseCredits"),30);
 assert.equal(run("getCurriculumSummaryForScope(curriculumData.plans.incoming2027,['1-1']).separateCredits"),0);
 assert.equal(run("getCurriculumSummaryForScope(curriculumData.plans.current2027,curriculumSemesterOrder).totalCredits"),191);
 assert.equal(run("getCurriculumSummaryForScope(curriculumData.militaryPlans.current2027,curriculumSemesterOrder).totalCredits"),192);
 run("state.plannerPlan='incoming2027';state.plan=createEmptyPlan()");
 assert.equal(run("getPlannerSemesterCreditSummary('1','1').totalCredits"),31);
});
test('cohort tables never imply confirmed openings; saved open filters safely show all options',()=>{
 const {run,el}=setup();run("state.activeCurriculumPlan='current2027';state.curriculumGrade='3';state.curriculumSemester='1';state.curriculumSemesters=['1'];renderCurriculum()");
 const budget=el('#curriculumSummary').innerHTML;
 run("state.curriculumOffering='open';renderCurriculum()");
 assert.equal(run('state.curriculumOffering'),'all');
 assert.match(el('#curriculumTableBody').innerHTML,/기하/);
 assert.match(el('#curriculumAvailabilityNote').textContent,/실제 개설 확정표는 제공되지 않아/);
 assert.equal(el('#curriculumSummary').innerHTML,budget);
});
test('future semesters are unconfirmed and military curricula remain separate',()=>{
 const {run,el}=setup();run("state.activeCurriculumPlan='incoming2027';state.curriculumGrade='2';state.curriculumSemesters=['1'];state.curriculumOffering='open';renderCurriculum()");
 assert.doesNotMatch(el('#curriculumTableBody').innerHTML,/opening-open[\s"]/);
 assert.match(el('#curriculumAvailabilityNote').textContent,/개설 확정표는 제공되지 않아/);
 run("state.curriculumDepartment='military';state.activeCurriculumPlan='current2027';state.curriculumOffering='all';state.curriculumGrade='1';renderCurriculumPlanOptions();renderCurriculum()");
 assert.match(el('#curriculumTableBody').innerHTML,/기본수학1/);
 assert.doesNotMatch(el('#curriculumTableBody').innerHTML,/공통수학1/);
 assert.match(el('#curriculumSummary').innerHTML,/총 32학점/);
});
test('stable source IDs are retained for the same subjects after row shifts',()=>{
 const {c}=setup();const before=JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures/curriculum-ids-20260921.json'),'utf8'));
 for(const year of [2025,2026,2027]){
  const old=before['incoming'+year];
  for(const course of c.window.ANJWA_CURRICULUM_DATA.plans['incoming'+year].courses){const name=Object.keys(old).find(name=>name.replace(/\s/g,'')===course.name.replace(/\s/g,''));if(name)assert.equal(course.id,old[name])}
 }
 const source=c.window.ANJWA_CURRICULUM_DATA;
 assert.equal(source.plans.incoming2026.courses.find(x=>x.name==='융합과학 탐구').credits,3);
 assert.deepEqual(Array.from(source.plans.incoming2026.courses.find(x=>x.name==='융합과학 탐구').semesters),['3-1']);
});
