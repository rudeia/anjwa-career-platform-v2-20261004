'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const c={window:{},URL};
for(const file of ['curriculum-data.js','subject-guide-data.js','subject-detail-data.js','subject-supplement-data.js','subject-classroom-data.js','course-designer-data.js','topic-data.js','subject-profile.js'])vm.runInNewContext(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),c);
const w=c.window,api=w.AnjwaSubjectProfile,original=require('./fixtures/topic-original-ids.json'),topics=w.ANJWA_TOPIC_DATA.topics,newTopics=topics.filter(t=>!original.includes(t.id));
test('new topics come from distinct source activities across education, society, engineering, arts, natural science and medical ethics',()=>{
 assert.ok(newTopics.length>0);
 for(const topic of newTopics){
  assert.ok(topic.reference?.title&&topic.reference.pages&&topic.reference.kind&&topic.reference.note,topic.id);
  assert.ok(topic.steps.length>=3&&topic.materials&&topic.measure&&topic.output&&topic.limits,topic.id);
  assert.doesNotMatch(JSON.stringify(topic.reference),/\/Users\/|OCR_TEXT|page_\d+|\.txt|\.js/);
  assert.ok(!topics.some(other=>other.id!==topic.id&&other.method===topic.method),topic.id);
  const course={name:topic.subject,subjectId:'2022:'+api.norm(topic.subject)},profile=api.resolve(w.ANJWA_SUBJECT_GUIDE,course)||{};
  assert.ok(api.enrich(profile,course).activityGuides.some(t=>t.id===topic.id&&t.matchType==='direct'),topic.id);
 }
 const titles=newTopics.map(t=>t.reference.title).join(' ');
 for(const kind of ['교육계열','사회계열','예체능계열','자연계열','의학계열','서울과학기술대학교','경희대학교'])assert.ok(titles.includes(kind),kind);
});
test('merged major explanations show the expanded reason once and classroom details can omit repeated introductions',()=>{
 const profile={majorConnections:[{major:'국어교육과',reason:'기존 설명'}],classroomPlan:{learningBridge:'한 번만 보일 설명',careerConnections:[{major:'국어교육과',reason:'더 구체적인 설명'},{major:'교육학과',reason:'추가 설명'}],activityPlans:[{title:'활동 절차',question:'어떻게 할까?',materials:'교과서',steps:['읽습니다.','정리합니다.'],output:'비교표',limits:'범위를 정합니다.'}],basis:'수업용 제안'}};
 const merged=api.mergeMajorConnections(profile);assert.equal(merged.length,2);assert.equal(merged.find(m=>m.major==='국어교육과').reason,'더 구체적인 설명');
 const html=api.renderContext(profile,{classroomIntro:false});assert.match(html,/활동 절차/);assert.doesNotMatch(html,/한 번만 보일 설명|더 구체적인 설명/);
 const example=newTopics.find(t=>t.id==='engineering-scale-space-model'),rendered=api.renderContext({activityGuides:[example]});
 assert.match(rendered,/서울과학기술대학교/);assert.match(rendered,/인쇄 41쪽/);assert.doesNotMatch(rendered,/원기록|needs-source-check|OCR_TEXT/);
});

test('career connections use the concrete matched activity and preserve more specific classroom explanations',()=>{
 const context={window:{}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'..','subject-profile.js'),'utf8'),context);
 const api=context.window.AnjwaSubjectProfile;
 const merged=api.mergeMajorConnections({majorConnections:[{major:'영어교육과',reason:'기초 안내'}],activityGuides:[{title:'인터뷰 근거 구분',matchType:'related',careerConnections:[{major:'영어교육과',reason:'발언 근거와 해석을 구분해 듣기 과제를 설계합니다.'},{major:'신문방송학과',reason:'인용 발언과 기자의 해석을 구분합니다.'}]}],classroomPlan:{careerConnections:[{major:'영어교육과',reason:'학교 과목에 맞는 더 구체적인 설명'}]}});
 assert.equal(merged.length,2);assert.equal(merged.find(m=>m.major==='영어교육과').reason,'학교 과목에 맞는 더 구체적인 설명');assert.equal(merged.find(m=>m.major==='신문방송학과').activityTitle,'인터뷰 근거 구분');assert.equal(merged.find(m=>m.major==='신문방송학과').matchType,'related');
});
