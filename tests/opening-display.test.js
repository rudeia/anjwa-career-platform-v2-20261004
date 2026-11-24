'use strict';
const test = require('node:test'), assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
function setup() {
 const elements = new Map();
 const el = key => {
  if (!elements.has(key)) elements.set(key, {value:'',innerHTML:'',textContent:'',hidden:false,addEventListener(){},setAttribute(){}});
  return elements.get(key);
 };
 const context = {window:{},console,document:{addEventListener(){},querySelector:el,querySelectorAll(){return[]},getElementById(id){return el('#'+id)}}};
 for (const file of ['curriculum-data.js','student-data-model.js','app.js']) vm.runInNewContext(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),context);
 const run = code => vm.runInNewContext(code,context);
 const status = (course,terms) => {context.course=course;context.terms=terms;return run('getCourseOpeningStatus(course,terms)')};
 const badge = (course,terms) => {context.course=course;context.terms=terms;return run('renderCurriculumOpeningBadge(course,terms)')};
 return {context,el,run,status,badge};
}
function candidate(statuses,extra={}) {
 return {id:'test-choice',name:'검증용 선택과목',section:'학생선택(2학년)',area:'국어',category:'일반',credits:Object.keys(statuses).length*3,
  semesters:Object.keys(statuses),markers:Object.fromEntries(Object.keys(statuses).map(term=>[term,'3'])),openingStatusBySemester:statuses,
  deliveryMode:'classroom',offeringStatus:'classroom',row:1000,creditTreatment:'regular',...extra};
}
test('school-designated openings are confirmed in both departments including online and designated choices',()=>{
 const {context,status,badge}=setup();let checked=0,online=0,choices=0;
 // Raw workbook rows exercise the operating rule independently of model copies.
 for(const store of ['plans','militaryPlans'])for(const [key,plan]of Object.entries(context.window.ANJWA_CURRICULUM_DATA[store])) {
  if(!/^incoming/.test(key))continue;
  for(const course of plan.courses.filter(c=>/^학교\s*지정/.test(c.section))) {
   for(const term of course.semesters) {
    assert.equal(status(course,[term]),'open',key+':'+course.name+':'+term);
    assert.match(badge(course,[term]),/opening-open.*학교지정 · 개설 확정/);
    assert.doesNotMatch(badge(course,[term]),/미확정|확인 필요|2027 개설/);checked++;
   }
   if(course.deliveryMode==='online')online++;
   if(Object.values(course.markers).some(value=>String(value).includes('택')))choices++;
  }
 }
 assert.ok(checked>0&&online>0&&choices>0);
});
test('student choices distinguish unconfirmed, closed and confirmed openings and escape enrollment notes',()=>{
 const {status,badge}=setup();
 for(const [value,label]of [['unconfirmed','학생선택 · 개설 확인 필요'],['not-open','미개설'],['open','개설 확정']]) {
  const course=candidate({'2-1':value},{enrollmentNote:'<수강 조건>'});
  assert.equal(status(course,['2-1']),value);
  assert.ok(badge(course,['2-1']).includes(label));
  assert.ok(badge(course,['2-1']).includes('&lt;수강 조건&gt;'));
  assert.doesNotMatch(badge(course,['2-1']),/학교지정|2027 개설|2027 미개설/);
 }
 assert.equal(status(candidate({'2-1':undefined}),['2-1']),'unconfirmed');
});
test('online delivery remains separate from opening and participation conditions',()=>{
 const {context,status,badge}=setup();
 const online=Object.values(context.window.ANJWA_STUDENT_MODEL.curriculum.plans).flatMap(p=>p.courses).find(c=>/^학교지정/.test(c.section)&&c.deliveryMode==='online');
 const before=JSON.stringify(online);
 assert.equal(status(online,online.semesters),'open');assert.match(badge(online,online.semesters),/학교지정 · 개설 확정/);
 assert.equal(context.window.ANJWA_STUDENT_MODEL.label(online),'학교 편성 온라인');assert.equal(online.offeringStatus,'online');
 assert.equal(JSON.stringify(online),before);
 const choice=candidate({'2-1':'unconfirmed'},{deliveryMode:'online',offeringStatus:'online'});
 assert.equal(status(choice,['2-1']),'unconfirmed');assert.match(badge(choice,['2-1']),/학생선택 · 개설 확인 필요/);
});
test('multiple-semester views show mixed status while filters inspect each requested term',()=>{
 const {context,run,status,badge}=setup();
 for(const pair of [['open','not-open'],['open','unconfirmed'],['not-open','unconfirmed']]) {
  const course=candidate({'2-1':pair[0],'2-2':pair[1]});
  assert.equal(status(course,['2-1','2-2']),'mixed');
  assert.match(badge(course,['2-1','2-2']),/opening-mixed.*학기별 개설 상태 다름/);
  assert.equal(status(course,['2-1']),pair[0]);assert.equal(status(course,['2-2']),pair[1]);
  context.course=course;
  assert.equal(run("curriculumCourseIsVisible(course,['2-1','2-2'],'open')"),pair.includes('open'));
  assert.equal(run("curriculumCourseIsVisible(course,['2-2'],'open')"),false);
  assert.equal(run("curriculumCourseIsVisible(course,['3-1'],'open')"),false);
  assert.equal(run("curriculumCourseIsVisible(course,['2-1','2-2'],'all')"),true);
  assert.equal(status(course,['3-1']),'unconfirmed');
 }
});
test('confirmed-only rendering excludes closed terms without changing original courses or credit budgets',()=>{
 const {context,el,run}=setup();
 const mixed=candidate({'2-1':'open','2-2':'not-open'});
 const closed=candidate({'2-1':'not-open'},{id:'closed-choice',name:'검증용 미개설과목',row:1001});
 context.mixedCourse=mixed;context.closedCourse=closed;
 run("curriculumData.openingConfirmed=true;curriculumData.plans.incoming2027.courses.push(mixedCourse,closedCourse);state.activeCurriculumPlan='incoming2027';state.activeCurriculumScope='grade';state.curriculumGrade='2';state.curriculumOffering='all';renderCurriculum()");
 const summary=el('#curriculumSummary').innerHTML,before=JSON.stringify(mixed);
 assert.match(el('#curriculumTableBody').innerHTML,/검증용 미개설과목/);assert.match(el('#curriculumTableBody').innerHTML,/학기별 개설 상태 다름/);
 run("state.curriculumOffering='open';renderCurriculum()");
 assert.equal(run('state.curriculumOffering'),'open');assert.equal(el('#curriculumOfferingControl').hidden,false);
 assert.equal(el('#curriculumSummary').innerHTML,summary);assert.match(el('#curriculumTableBody').innerHTML,/검증용 선택과목/);
 assert.doesNotMatch(el('#curriculumTableBody').innerHTML,/검증용 미개설과목|opening-not-open|opening-unconfirmed|opening-mixed/);
 const mobile=el('#curriculumMobileList').innerHTML;
 assert.equal((mobile.match(/<span class="mobile-course-name">검증용 선택과목/g)||[]).length,1);
 assert.doesNotMatch(mobile,/검증용 미개설과목/);assert.equal(JSON.stringify(mixed),before);
 assert.match(el('#curriculumAvailabilityNote').textContent,/학교지정 과목은 개설 확정/);
});
test('all-candidate mode explains confirmation limits when a complete opening table is unavailable',()=>{
 const {el,run}=setup();
 run("state.activeCurriculumPlan='incoming2027';state.activeCurriculumScope='grade';state.curriculumGrade='2';state.curriculumOffering='open';renderCurriculum()");
 assert.equal(run('state.curriculumOffering'),'all');assert.equal(el('#curriculumOfferingControl').hidden,true);
 const note=el('#curriculumAvailabilityNote').textContent,table=el('#curriculumTableBody').innerHTML;
 assert.match(note,/학교지정 과목은 개설 확정/);assert.match(note,/온라인 수업 여부와 선택 묶음의 택N 조건/);
 assert.match(note,/학생선택 과목 중 개설 확인이 필요한 과목/);
 assert.match(table,/data-opening-status="open"/);assert.match(table,/개설 확인 필요/);
 assert.doesNotMatch(table,/2027 개설|2027 미개설|개설 여부 미확정/);
});
