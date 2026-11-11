'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.join(__dirname,'..'),{buildCatalogue}=require('../subject-library.js');
const c={window:{},document:{addEventListener(){},querySelector(){return null},querySelectorAll(){return []}},console};
for(const f of ['curriculum-data.js','student-data-model.js','subject-guide-data.js','subject-detail-data.js','subject-supplement-data.js','subject-profile.js','course-designer-data.js','app.js'])vm.runInNewContext(fs.readFileSync(path.join(root,f),'utf8'),c);
const guide=c.window.ANJWA_SUBJECT_GUIDE,api=c.window.AnjwaSubjectProfile,records=buildCatalogue(c.window.ANJWA_CURRICULUM_DATA,guide,c.window.ANJWA_COURSE_DESIGNER);
test('all 250 existing subject entries now have learning, topics, activities and major reasons',()=>{
 assert.equal(records.length,250);assert.equal(Object.keys(guide.additionalProfiles).length,95);
 for(const r of records){const p=r.profile;assert.ok(p.learning?.length>20,r.id);assert.ok(p.learningTopics?.length>=1,r.id);assert.ok(p.activities?.length,r.id);assert.ok(p.majorConnections?.length,r.id);for(const m of p.majorConnections)assert.ok(m.reason.length>12,r.id);}
});
test('curriculum popups and the subject library resolve identical profiles including military and old revisions',()=>{
 for(const r of records){const course={name:r.name,area:r.area,subjectId:r.id};const popup=vm.runInNewContext(`getSubjectGuideInfo(${JSON.stringify(course)},{title:'',tracks:[],description:''})`,c);assert.equal(popup.learning,r.profile.learning,r.id);assert.equal(JSON.stringify(popup.majorConnections),JSON.stringify(r.profile.majorConnections),r.id);}
 const old=api.resolve(guide,{name:'기하',subjectId:'2015:기하'}),current=api.resolve(guide,{name:'기하',subjectId:'2022:기하'});assert.match(old.learning,/평면벡터/);assert.notEqual(old.learning,current.learning);
 assert.match(api.curriculumLabel('2015'),/2024 입학생 적용/);
 assert.equal(api.resolve(guide,{name:'(고시외) 생태와 환경'}),null);
});
test('military variants keep regional names and disclose the exploratory scope without asserting eligibility',()=>{
 const specific=Object.entries(guide.additionalProfiles).filter(([,p])=>p.militaryConnections?.length);assert.ok(specific.length>=30);
 for(const [id,p] of specific){assert.match(p.sourceNote,/성취기준.*확인한 설명은 아닙니다/);assert.ok(p.majorConnections.length);assert.ok(p.militaryConnections[0].reason);if(/\((광주|경기도|인천|서울)\)/.test(id))assert.match(p.scopeNote,/지역명|원본/);}
 assert.match(guide.additionalProfiles['2022:총기장비'].learning,/실제 취급·조작/);
});

test('school curriculum information inside the popup includes military cohort offerings',()=>{
 const offerings=vm.runInNewContext("getSubjectGuideOfferings('군리더십(광주)')",c);
 assert.ok(offerings.some(o=>o.key==='incoming2027'&&o.shortLabel.includes('부사관과')));
 assert.ok(offerings.every(o=>o.name==='군리더십(광주)'&&!o.relatedMatch));
 const html=vm.runInNewContext("renderSubjectGuideOfferings(getSubjectGuideOfferings('군리더십(광주)'), '군리더십(광주)')",c);
 assert.match(html,/2027 입학생/);assert.doesNotMatch(html,/찾지 못했습니다/);
});
