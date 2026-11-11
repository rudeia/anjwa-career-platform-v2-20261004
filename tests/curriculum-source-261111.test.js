'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const c={window:{},document:{addEventListener(){},querySelector(){return null},querySelectorAll(){return[]}},console};
for(const file of ['curriculum-data.js','student-data-model.js','app.js'])vm.runInNewContext(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),c);
const d=c.window.ANJWA_CURRICULUM_DATA,m=c.window.ANJWA_STUDENT_MODEL.curriculum,run=s=>vm.runInNewContext(s,c);
test('six input tables preserve source counts, semester totals and reference locations',()=>{
 for(const [store,counts,totals] of [['plans',[84,84,79],[[32,32,32,34,32,32],[34,32,32,32,32,32],[31,32,33,32,32,32]]],['militaryPlans',[52,51,50],[[32,32,32,32,32,32],[32,32,32,32,32,32],[32,32,32,32,32,32]]]]){
  for(const [index,year] of [2025,2026,2027].entries()){
   const p=d[store]['incoming'+year];assert.equal(p.courses.length,counts[index]);assert.deepEqual(Array.from(Object.values(p.summary),x=>x.totalCredits),totals[index]);assert.match(p.sourceSha256,/^[a-f0-9]{64}$/);
   for(const course of p.courses)for(const term of course.semesters){assert.ok(course.sourceCells[term]?.length);assert.equal(course.openingStatusBySemester[term],'unconfirmed');}
   const fromRows=run(`getCurriculumSummaryForScope(curriculumData.${store}.incoming${year},curriculumSemesterOrder)`);assert.equal(fromRows.unresolvedTerms,undefined);
  }
 }
});
test('2027 general follows H40 and original choice cells without carrying forward separate online credits',()=>{
 const p=d.plans.incoming2027,info=p.courses.find(x=>x.name==='(온) 정보');assert.deepEqual(Array.from(info.semesters),['1-2']);assert.deepEqual(Array.from(info.sourceCells['1-2']),['H40']);assert.equal(info.creditTreatment,'regular');assert.equal(info.markers['1-2'],'3');assert.equal(p.courses.some(x=>x.name==='(온) 인공지능 기초'),false);
 const ecology=p.courses.find(x=>x.name==='생태와 환경');assert.equal(ecology.area,'교양');assert.equal(ecology.markers['3-2'],'[택2] / 6');assert.equal(p.summary['1-1'].separateCredits,0);
 assert.equal(p.sourceSummary.overallTotal.value,196);assert.equal(Object.values(p.summary).reduce((n,x)=>n+x.totalCredits,0),192);assert.equal(p.approvedSummary.courseCredits,174);assert.equal(p.approvedSummary.totalCredits,192);assert.deepEqual(Array.from(p.approvedSummary.annualTotals),[63,65,64]);assert.equal(p.dataQualityNotes.length,0);assert.equal(d.plans.current2027.dataQualityNotes.length,0);
});
test('2026 and military choices preserve moved subjects and merged theory/practice budgets',()=>{
 const p=d.plans.incoming2026,c=p.courses.find(x=>x.name==='융합과학 탐구');assert.deepEqual(Array.from(c.semesters),['3-1']);assert.equal(c.credits,3);assert.equal(p.courses.some(x=>x.name==='과학의 역사와 문화'),true);
 const military=d.militaryPlans.incoming2025,admin=military.courses.find(x=>x.name==='사무 행정');assert.equal(admin.markers['2-1'],'4');assert.equal(admin.markers['2-2'],'5');assert.deepEqual(Array.from(admin.sourceCells['2-1']),['P49']);
 const english=d.militaryPlans.incoming2027.courses.filter(x=>['실생활 영어 회화','영어 독해와 작문'].includes(x.name));assert.equal(english.length,2);assert.ok(english.every(x=>Object.values(x.markers).includes('[택1] / 3')));
 const m26=d.militaryPlans.incoming2026;assert.ok(m26.courses.some(x=>x.name==='논술'));assert.equal(m26.courses.some(x=>x.name==='취업 실무 국어'),false);
});
test('mixed 2027 views project the matching cohort rows and source semester budgets',()=>{
 for(const store of ['plans','militaryPlans'])for(const [i,year] of [2027,2026,2025].entries()){
  const grade=String(i+1),cohort=m[store]['incoming'+year],current=m[store].current2027;
  for(const sem of ['1','2']){const t=grade+'-'+sem;assert.equal(JSON.stringify(current.summary[t]),JSON.stringify(cohort.summary[t]));const ids=p=>p.courses.filter(c=>c.semesters.includes(t)).map(c=>c.id).sort();assert.deepEqual(ids(current),ids(cohort));}
 }
});
test('real previous plans retain moved/changed choices for review and preserve unchanged choices',()=>{
 const V=require('../planner-validation.js'),D=require('../demand-core.js');
 const fixtures=JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures/curriculum-revalidation-261111.json'),'utf8'));
 for(const f of fixtures){const p=m.plans[f.key],groups=['2','3'].flatMap(g=>D.groups(p,g)),rechecked=V.revalidate(f.plan,p,groups),[grade,sem]=f.term.split('-'),original=f.plan[grade][sem].regular[0];
  if(f.key==='incoming2025'){assert.equal(rechecked[grade][sem].regular.length,1);assert.equal(rechecked[grade][sem].review.length,0);}
  else{assert.equal(rechecked[grade][sem].regular.length,0);assert.deepEqual(rechecked[grade][sem].review[0].item,original);assert.ok(rechecked[grade][sem].review[0].reasons.length);}
 }
});
