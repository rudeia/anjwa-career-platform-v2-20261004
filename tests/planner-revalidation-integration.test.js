'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
function setup(){const c={window:{AnjwaPlannerValidation:require('../planner-validation.js'),confirm:()=>true},document:{addEventListener(){},querySelector(){return null},querySelectorAll(){return[]}},console};for(const f of ['curriculum-data.js','student-data-model.js','app.js'])vm.runInNewContext(fs.readFileSync(path.join(__dirname,'..',f),'utf8'),c);const run=x=>vm.runInNewContext(x,c);run(`state.plannerPlan='incoming2026';var oldArt=curriculumData.plans.incoming2026.courses.find(c=>c.name==='미술 창작');state.plan=createEmptyPlan();state.plan['2']['1'].regular=[{id:'removed-fake',name:'가상 삭제 과목',credits:3},{id:oldArt.id,credits:1}];state.plan=normalizePlannerPlan(state.plan);`);return{c,run};}
test('quarantined choices are excluded from app totals and appear in printed warnings',()=>{
 const {run}=setup();assert.equal(run("getPlannerReviewEntries().length"),2);const total=run("getPlannerSemesterCreditSummary('2','1').courseCredits"),fixed=run("getPlannerFixedCourses().filter(c=>c.semesters.includes('2-1')&&c.creditTreatment!=='separate').reduce((n,c)=>n+getPlannerCourseCredits(c,'2','1'),0)");assert.equal(total,fixed);
 const print=run('buildMineCurriculumPrintDocument("99991",{display:"가상 시각"},"가상 인쇄")');assert.match(print,/교육과정 변경 확인 필요 · 2건/);assert.match(print,/가상 삭제 과목/);assert.match(print,/현재 학점 합계에서 제외/);
});
test('reconfirm restores current credits only after acceptance and keeps other original records',()=>{
 const {c,run}=setup();run('saveState=()=>{};renderCoursePool=()=>{};renderPlanner=()=>{};showToast=()=>{};');c.window.confirm=()=>false;assert.equal(run("restorePlannerReviewEntry('2','1',1)"),false);assert.equal(run('getPlannerReviewEntries().length'),2);
 c.window.confirm=()=>true;assert.equal(run("restorePlannerReviewEntry('2','1',1)"),true);assert.equal(run("state.plan['2']['1'].regular[0].credits"),2);assert.equal(run('getPlannerReviewEntries().length'),1);assert.equal(run('getPlannerReviewEntries()[0].item.id'),'removed-fake');assert.equal(run("state.plan['2']['1'].regular[0].snapshot.name"),'미술 창작');
});
test('another cohort cannot validate a saved course and overfull groups cannot be reconfirmed',()=>{
 const {run}=setup();run('saveState=()=>{};renderCoursePool=()=>{};renderPlanner=()=>{};showToast=()=>{};');assert.equal(run("addCourseToPlan('removed-fake','2','1','regular')"),false);
 run(`var otherArt=curriculumData.plans.incoming2026.courses.find(c=>c.name==='음악 연주와 창작');addCourseToPlan(otherArt.id,'2','1','regular')`);assert.equal(run("restorePlannerReviewEntry('2','1',1)"),false);assert.equal(run('getPlannerReviewEntries().length'),2);
});
