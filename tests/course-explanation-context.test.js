'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
function setup(){
 const c={window:{},document:{addEventListener(){},querySelector(){return null},querySelectorAll(){return []}},console};
 for(const file of ['curriculum-data.js','student-data-model.js','subject-guide-data.js','subject-detail-data.js','subject-supplement-data.js','subject-classroom-data.js','subject-profile.js','course-designer-data.js','recommendation-data.js','topic-data.js','university-recommendation-data.js','app.js'])vm.runInNewContext(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),c);
 return source=>vm.runInNewContext(source,c);
}
test('recommendation summaries use a selected interest’s linked field record instead of a generic prompt',()=>{
 const run=setup();
 run("state.courseDesignerInterests=['nursing_health']; const course=curriculumData.plans.incoming2026.courses.find(c=>c.name==='(온) 화학'); const candidate={course,interests:new Set(['간호학']),subjects:new Set(['화학'])}");
 assert.match(run('getCourseDesignerCardConnection(candidate)'),/보건정책|의료 의사소통/);
 assert.match(run('getCourseDesignerCourseReason(candidate)'),/보건정책|의료 의사소통/);
 assert.doesNotMatch(run('getCourseDesignerCardConnection(candidate)'),/분야의 관련 전공과 활동은/);
});
test('detailed classroom plans and existing research activities both reach the school subject guide',()=>{
 const run=setup();
 const core=run("getSubjectGuideInfo(curriculumData.plans.incoming2027.courses.find(c=>c.name==='공통국어1'),getSubjectRelationInfo({name:'공통국어1',area:'국어'}))");
 assert.ok(core.classroomPlan.activityPlans[0].steps.length>=2);
 const science=run("getSubjectGuideInfo(curriculumData.plans.incoming2026.courses.find(c=>c.name==='(온) 화학'),getSubjectRelationInfo({name:'화학',area:'과학'}))");
 assert.ok(science.activityGuides.some(activity=>activity.question&&activity.method&&activity.output));
 assert.ok(science.universityEvidence.some(record=>record.verificationStatus==='needs-source-check'));
});
