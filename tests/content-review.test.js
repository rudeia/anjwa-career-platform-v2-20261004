"use strict";
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const context = {window:{}, URL, document:{addEventListener(){},querySelector(){return null},querySelectorAll(){return []}}, console};
for (const file of ['curriculum-data.js','admission-pages.js','recommendation-data.js','university-recommendation-data.js','course-designer-data.js','topic-data.js','subject-guide-data.js','app.js']) vm.runInNewContext(fs.readFileSync(path.join(root,file),'utf8'),context);
const run = source => vm.runInNewContext(source,context);
const topics = context.window.ANJWA_TOPIC_DATA.topics;

test('all 79 activities keep unique IDs, individual extensions and valid research references', () => {
 assert.equal(topics.length,79);assert.equal(new Set(topics.map(t=>t.id)).size,79);
 assert.equal(new Set(topics.map(t=>t.nextStep)).size,79);
 for(const t of topics){assert.ok(t.question && t.method && t.output && t.measure && t.limits && t.nextStep,t.id);
  for(const id of t.sourceIds)assert.ok(context.window.ANJWA_TOPIC_DATA.researchSources[id],id);
 }
 assert.equal(run('getTopicGradeLabel({level:"심화"})'),'선수 개념 확인');
 assert.equal(run('getTopicGrades({level:"기초"}).join(",")'),'1,2,3');
 const synthetic = topics.find(t=>t.id==='info-ai-error');assert.match(synthetic.materials,/모의/);assert.match(synthetic.limits,/모의/);
});
test('all university notes survive the course-name filter and are escaped', () => {
 const records=context.window.ANJWA_UNIVERSITY_RECOMMENDATION_DATA.records;
 for(const r of records){context.record=r;assert.equal(run('getUniversityRecommendationNote(record)'),String(r.note||'').trim());}
 assert.equal(records.filter(r=>r.verificationStatus==='incomplete-note').length,11);
 context.record={university:'예시',department:'학과',coreSubjects:[],recommendedSubjects:[],verificationStatus:'incomplete-note',note:'<img src=x onerror=alert(1)> 진로와 적성: 2'};
 const card=run('renderUniversityRecommendationCard(record)');assert.match(card,/등록 원문 일부/);assert.match(card,/&lt;img/);assert.doesNotMatch(card,/<img src=x/);
 assert.equal(run('renderContentSourceLink("javascript:alert(1)","출처")'),'');
 assert.equal(run('renderContentSourceLink("https://example.com/", "<script>")').includes('&lt;script&gt;'),true);
});
test('unverified university records are not promoted to official course evidence',()=>{
 assert.equal(run('buildCourseDesignerOfficialEvidenceMap(courseDesignerData.interests,new Map(recommendationData.records.map(r=>[r.id,r]))).size'),0);
 const records=context.window.ANJWA_UNIVERSITY_RECOMMENDATION_DATA.records;
 assert.equal(records.filter(r=>r.university==='부산대'&&r.department.includes('수학교육과')).length,1);
 assert.equal(records.some(r=>r.department.includes('검퓨터')),false);
 for(const r of records){assert.equal(r.condition.operator,'UNKNOWN');assert.equal(r.condition.minimumCount,null);}
});
test('15 guide pages preserve their functional containers and teach year-specific comparisons',()=>{
 const pages=context.window.ANJWA_ADMISSION_PAGES.pages;assert.equal(Object.keys(pages).length,15);
 const required={ 'holistic-competency':['competencyCards'], 'holistic-sechuk':['sechukFlowGrid','sechukExamplePanel','sechukExampleTitle','sechukExampleText'], 'holistic-subjects':['recommendationModeHelp','majorRecommendationSelect','majorRecommendationSearch','subjectRecommendationSelect','universityRecommendationSearch','universityMajorSearch','recommendationPlanFilter','quickMajorButtons','majorRecommendationResults','subjectRecommendationResults']};
 for(const [key,ids]of Object.entries(required))for(const id of ids)assert.equal(pages[key].body.split(`id="${id}"`).length-1,1,`${key}:${id}`);
 for(const [key,page]of Object.entries(pages)){context.key=key;context.page=page;const text=run('renderAdmissionDetailPage(key,page,[])');assert.doesNotMatch(text,/최근 확인 2026.07.18/);assert.match(text,/이해 점검/);}
 assert.match(pages['subject-calculation'].body,/466.67/);assert.match(pages['subject-calculation'].body,/686/);assert.match(pages['subject-calculation'].body,/2027학년도 고교 신입생/);
});
test('133 formerly generic reasons now have course-specific text without merging field introductions',()=>{
 const rows=fs.readFileSync(path.join(root,'검토/내용개편-작업명세/추천이유133건-집필작업표.csv'),'utf8').split(/\r?\n/).filter(Boolean).slice(1);
 assert.equal(rows.length,133);
 const data=context.window.ANJWA_COURSE_DESIGNER;
 for(const row of rows){const parts=row.split(',');assert.ok(data.interestSubjectReasons[parts[1]]?.[parts[2]],`${parts[1]}:${parts[2]}`);}
 assert.equal(new Set(Object.values(data.interestSubjectReasons).flatMap(Object.values)).size,184);
 context.candidate={course:{name:'미적분Ⅱ'},subjects:new Set(['미적분Ⅱ']),interests:new Set(['공학 일반·융합'])};
 run('state.courseDesignerInterests=["engineering_general"]');
 const text=run('getCourseDesignerCourseReason(candidate)');assert.match(text,/운동·에너지/);assert.doesNotMatch(text,/분야에서는|그 과정의 기초/);
});

test('learning resources distinguish synthetic data and worksheets; AI arithmetic is consistent',()=>{
 const learning=path.join(root,'learning-data');
 for(const topic of topics)if(topic.worksheet){const local=path.resolve(root,topic.worksheet.url);assert.ok(local.startsWith(learning+path.sep));assert.ok(fs.existsSync(local));assert.match(topic.worksheet.note,/모의|가상|빈 기록/);}
 const rows=fs.readFileSync(path.join(learning,'ai-confidence-synthetic.csv'),'utf8').trim().split(/\r?\n/).slice(1).map(row=>row.split(','));
 assert.equal(rows.length,30);
 for(const [confidence,correct]of [['0.6',6],['0.8',8],['0.9',7]]){const bin=rows.filter(row=>row[1]===confidence);assert.equal(bin.length,10);assert.equal(bin.filter(row=>row[2]===row[3]).length,correct);}
});

test('department searches preserve discipline names and math guidance separates curricula', () => {
 context.record={university:'충남대',department:'사회과학대학 사회학과'};
 assert.equal(run('recordMatchesUniversity(record,"충남대",normalizeMajorSearchTerm("사회학"))'),true);
 assert.equal(run('recordMatchesUniversity(record,"충남대",normalizeMajorSearchTerm("사회학과"))'),true);
 assert.equal(run('recordMatchesUniversity(record,"서울대","사회학")'),false);
 assert.match(run('getSubjectGuideInfo({name:"수학Ⅱ",area:"수학"},{title:"대수·수학Ⅰ·수학Ⅱ"}).learning'),/미분/);
 assert.doesNotMatch(run('getSubjectGuideInfo({name:"대수",area:"수학"},{title:"대수·수학Ⅰ·수학Ⅱ"}).learning'),/미분/);
 assert.equal(run('getSubjectGuideInfo({name:"대수",area:"수학"},{title:"대수·수학Ⅰ·수학Ⅱ"}).curriculum'),'2022 개정');
});

test('verified course conditions distinguish eligibility from evaluation recommendations', () => {
 const cases=context.window.ANJWA_ADMISSION_PAGES.verifiedCourseConditionCases;
 const tech=cases.find(c=>c.id==='seoultech-2028'),snu=cases.find(c=>c.id==='snu-2028');
 assert.equal(tech.admissionYear,2028);assert.equal(tech.documentStatus,'시행계획');assert.equal(tech.minimumCredits,80);assert.equal(tech.lastIncludedSemester,'3-1');assert.equal(tech.minimumDomesticGradeSemesters,3);
 assert.equal(snu.admissionEligibilityRequirement,false);assert.equal(snu.minimumCourseCount,1);assert.equal(snu.scope,'유형 ① 모집단위');assert.equal(snu.evaluationUses.length,2);
 const body=context.window.ANJWA_ADMISSION_PAGES.pages['holistic-subjects'].body;
 assert.match(body,/79학점이라면 학점 조건을 충족하지 못합니다/);assert.match(body,/3학년 2학기 과목을 앞선 합계에 더하지 마세요/);assert.match(body,/시행계획은 최종 모집요강에서 변경될 수/);assert.match(body,/2030 대입/);assert.match(body,/수능 제2외국어\/한문 응시 기준과는 구분/);
});
