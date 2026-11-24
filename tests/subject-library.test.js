'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const {buildCatalogue,filterCatalogue,offeringOpeningLabel}=require('../subject-library.js');
const c={window:{}};for(const f of ['curriculum-data.js','subject-guide-data.js','subject-detail-data.js','subject-supplement-data.js','subject-profile.js','course-designer-data.js'])vm.runInNewContext(fs.readFileSync(path.join(__dirname,'..',f),'utf8'),c);
const source=c.window.ANJWA_CURRICULUM_DATA,guide=c.window.ANJWA_SUBJECT_GUIDE,designer=c.window.ANJWA_COURSE_DESIGNER;
const before=JSON.stringify(source),records=buildCatalogue(source,guide,designer);
test('library includes all 155 reviewed subjects and school-external options without changing plans',()=>{
 assert.equal(records.filter(r=>r.profile.sourceUrl?.includes("edu.naver.com")).length,155);
 const outside=filterCatalogue(records,{query:'데이터 과학',offering:'outside'});assert.equal(outside.length,1);assert.equal(outside[0].name,'데이터 과학');assert.ok(outside[0].profile.majorConnections.length);
 assert.ok(!filterCatalogue(records,{query:'데이터 과학',offering:'school'}).some(r=>r.name==='데이터 과학'));
 assert.equal(JSON.stringify(source),before);
 assert.equal(new Set(records.map(r=>r.id)).size,records.length);
});
test('search matches learning topics and all sourced majors and separates revisions',()=>{
 assert.ok(filterCatalogue(records,{query:'유전공학과'}).some(r=>r.name==='생물의 유전'));
 assert.ok(filterCatalogue(records,{query:'인공지능 수학',revision:'2022'}).length);
 const legacyMatches=filterCatalogue(records,{query:'인공지능 수학',revision:'2015'});
 assert.ok(legacyMatches.every(r=>r.revision==='2015'));assert.ok(!legacyMatches.some(r=>r.name==='인공지능 수학'));
 assert.ok(records.some(r=>r.revision==='2015'&&!r.profile.sourceUrl?.includes('edu.naver.com')));
 assert.ok(filterCatalogue(records,{query:'미적분 II'}).some(r=>r.name==='미적분Ⅱ'));
 assert.equal(filterCatalogue(records,{query:'<script>없음'}).length,0);
});
test('school offerings retain department and cohort and do not assert external course availability',()=>{
 const ecology=records.find(r=>r.name==='생태와 환경'&&r.revision==='2022');assert.equal(ecology.area,'교양');assert.ok(ecology.offerings.some(o=>o.cohort==='2027'&&o.department==='보통과'));
 assert.ok(records.some(r=>r.offerings.some(o=>o.department==='부사관과')));
 for(const r of records)for(const o of r.offerings){assert.match(o.cohort,/^20\d{2}$/);assert.ok(!('enrollmentOpen' in o));}
});
test('library distinguishes confirmed, cancelled, mixed and missing semester information',()=>{
 const offering={section:'학생선택',semesters:['2-1','2-2'],openingStatusBySemester:{'2-1':'not-open','2-2':'not-open'}};
 assert.equal(offeringOpeningLabel(offering),'미개설');
 assert.equal(offeringOpeningLabel({...offering,section:'학교지정'}),'개설 확정');
 assert.equal(offeringOpeningLabel({...offering,semesters:[]}),'개설 학기 확인 필요');
 const mixed=offeringOpeningLabel({...offering,openingStatusBySemester:{'2-1':'open','2-2':'not-open'}});
 assert.match(mixed,/2학년 1학기 개설 확정/);assert.match(mixed,/2학년 2학기 미개설/);assert.match(mixed,/학기별 개설 상태 다름/);
 assert.equal(offeringOpeningLabel({...offering,openingStatusBySemester:{}}),'학생선택 · 개설 확인 필요');
});
console.log('catalogue',records.length,'nationally reviewed',records.filter(r=>r.profile.sourceUrl?.includes("edu.naver.com")).length,'outside',records.filter(r=>!r.offerings.length).length);
