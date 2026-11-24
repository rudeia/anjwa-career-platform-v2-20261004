'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..');
function setup(){
 const context={window:{}};
 for(const name of ['curriculum-data.js','subject-guide-data.js','subject-detail-data.js','subject-supplement-data.js','subject-profile.js'])vm.runInNewContext(fs.readFileSync(path.join(root,name),'utf8'),context);
 const before=JSON.stringify({curriculum:context.window.ANJWA_CURRICULUM_DATA,guide:context.window.ANJWA_SUBJECT_GUIDE});
 vm.runInNewContext(fs.readFileSync(path.join(root,'subject-classroom-data.js'),'utf8'),context);
 return {context,before,plans:context.window.ANJWA_SUBJECT_CLASSROOM_PLANS};
}
const expected=['공통국어1','공통국어2','공통수학1','공통수학2','공통영어1','공통영어2','통합사회1','통합사회2','통합과학1','통합과학2','과학탐구실험1','과학탐구실험2','한국사1','한국사2','진로와직업','영어I','사무행정','군리더십(광주)','대수','세계시민과지리','사회와문화','생태와환경'].map(name=>'2022:'+name);
test('22 classroom plans retain the existing subject identities and include actionable activities',()=>{
 const {context,plans}=setup();
 assert.deepEqual(Object.keys(plans).sort(),expected.slice().sort());
 for(const [id,plan]of Object.entries(plans)){
  const [revision,name]=id.split(':');
  assert.ok(context.window.AnjwaSubjectProfile.resolve(context.window.ANJWA_SUBJECT_GUIDE,{name,subjectId:id},revision),id+' profile');
  assert.ok(typeof plan.learningBridge==='string'&&plan.learningBridge.length>35,id+' learning bridge');
  assert.ok(typeof plan.basis==='string'&&/앱/.test(plan.basis),id+' proposal basis');
  assert.ok(Array.isArray(plan.careerConnections)&&plan.careerConnections.length>=2,id+' career links');
  for(const link of plan.careerConnections){assert.ok(link.major&&link.reason.length>20,id+' career explanation');}
  assert.ok(Array.isArray(plan.activityPlans)&&plan.activityPlans.length,id+' activity');
  for(const activity of plan.activityPlans){
   for(const key of ['title','question','materials','output','reflection','limits'])assert.ok(typeof activity[key]==='string'&&activity[key].length>=8,id+':'+key);
   assert.ok(activity.steps.length>=2&&activity.steps.length<=4,id+' manageable steps');
   assert.ok(activity.steps.every(step=>typeof step==='string'&&step.length>15),id+' concrete steps');
  }
 }
});
test('subjects have distinct learning bridges, questions, methods and deliverables',()=>{
 const {plans}=setup(),values=Object.values(plans),activities=values.flatMap(p=>p.activityPlans);
 for(const [name,texts]of [['bridge',values.map(p=>p.learningBridge)],['title',activities.map(a=>a.title)],['question',activities.map(a=>a.question)],['method',activities.map(a=>a.steps.join(' '))],['deliverable',activities.map(a=>a.output)]]){
  assert.equal(new Set(texts).size,texts.length,name+' must describe the particular subject');
 }
 assert.match(plans['2022:대수'].activityPlans[0].question,/비율/);
 assert.match(plans['2022:세계시민과지리'].activityPlans[0].output,/지도/);
 assert.match(plans['2022:사회와문화'].activityPlans[0].output,/관점별 해석/);
 assert.match(plans['2022:생태와환경'].activityPlans[0].output,/이해관계/);
});
test('loading classroom proposals leaves curriculum and original profiles unchanged',()=>{
 const {context,before,plans}=setup();
 assert.equal(JSON.stringify({curriculum:context.window.ANJWA_CURRICULUM_DATA,guide:context.window.ANJWA_SUBJECT_GUIDE}),before);
 for(const plan of Object.values(plans))assert.match(plan.basis,/제안/);
 for(const key of ['2022:사무행정','2022:군리더십(광주)']){
  assert.match(plans[key].basis,/과목명|명칭/);
  assert.match(plans[key].basis,/확인.*(?:않|아닙)/);
  assert.match(plans[key].activityPlans[0].limits,/실제.*수업|성취기준/);
 }
});
