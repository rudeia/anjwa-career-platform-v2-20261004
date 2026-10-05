/* Isolated fake-data verification. Start a local HTTP server first.
   PLAYWRIGHT_MODULE can point to an existing Playwright installation. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const base=process.env.STUDENT_TEST_URL || 'http://127.0.0.1:8770/';
if (!/^http:\/\/(127\.0\.0\.1|localhost):\d+\//.test(base)) throw Error('Only a loopback test server is allowed');
const out=path.resolve(__dirname,'../검토/학생관점개선');fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true});const results=[],errors=[],networkErrors=[];
 async function page(width=1440){let context=await browser.newContext({viewport:{width,height:960},serviceWorkers:'block',hasTouch:width<500});await context.addInitScript(()=>{window.print=()=>{};});const p=await context.newPage();p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400&&r.url().startsWith(base))networkErrors.push({url:r.url(),status:r.status()});});p.setDefaultTimeout(7000);await p.goto(base);return p;}
 async function check(name,fn){try{await fn();results.push({name,pass:true});console.log('PASS',name);}catch(e){results.push({name,pass:false,error:e.message});console.error('FAIL',name,e.message);}}
 async function shot(p,name){await p.screenshot({path:path.join(out,name+'.png'),fullPage:false});}
 async function pdf(p,button,name){const pending=p.waitForEvent('popup');await button();const popup=await pending;await popup.waitForLoadState('domcontentloaded');await popup.pdf({path:path.join(out,name+'.pdf'),format:'A4',printBackground:true});assert.ok((await popup.locator('body').innerText()).includes('99001'));assert.ok(fs.statSync(path.join(out,name+'.pdf')).size>4000);await popup.close();}
 let p=await page();
 await check('home three starts and desktop screen',async()=>{assert.equal(await p.locator('[data-student-start]').count(),3);await shot(p,'after-home');});
 await check('34 credits identical, semester changes, reload preserves selection',async()=>{
  await p.locator('.home-area-grid [data-view="curriculum"]').click();
  assert.match(await p.locator('#curriculumSummary').innerText(),/34학점/);
  const before=await p.evaluate(()=>curriculumData.plans.current2026.courses.filter(c=>c.semesters.includes('1-1')).map(c=>c.id).sort());
  await p.selectOption('#curriculumPlan','incoming2026');assert.match(await p.locator('#curriculumSummary').innerText(),/34학점/);
  assert.deepEqual(await p.evaluate(()=>curriculumData.plans.incoming2026.courses.filter(c=>c.semesters.includes('1-1')).map(c=>c.id).sort()),before);
  await shot(p,'after-curriculum');
  await p.locator('[data-curriculum-semester="2"]').click();await p.locator('[data-curriculum-semester="1"]').click();assert.match(await p.locator('#curriculumSummary').innerText(),/32학점/);
  await p.reload();assert.ok(p.url().endsWith('#curriculum'));assert.equal(await p.locator('#curriculumSemester').inputValue(),'2');assert.match(await p.locator('#curriculumSummary').innerText(),/32학점/);
 });
 await check('direct URL, history backward/forward, unknown hash',async()=>{
  await p.locator('.nav-button[data-view="selfEvaluation"]').click();assert.ok(p.url().endsWith('#selfEvaluation'));
  await p.goBack();assert.equal(await p.locator('.view.active').getAttribute('id'),'curriculum');
  await p.goForward();assert.equal(await p.locator('.view.active').getAttribute('id'),'selfEvaluation');
  await p.reload();assert.equal(await p.locator('.view.active').getAttribute('id'),'selfEvaluation');
  await p.goto(base+'#%E0%A4%A');assert.equal(await p.locator('.view.active').getAttribute('id'),'home');
 });
 await p.close();
 let activity=await page(390);
 await check('undecided activity → candidates → cards → reasons → review → save/PDF',async()=>{
  await activity.locator('[data-student-start="activity"]').tap();assert.equal(await activity.locator('[data-course-designer-interest]').count(),0);
  await activity.locator('[data-course-designer-exploration]').first().tap();const fields=await activity.locator('[data-course-designer-interest]').count();assert.ok(fields>0&&fields<36);
  await activity.locator('[data-course-designer-interest]').first().tap();await activity.locator('#courseDesignerGenerateButton').click();
  assert.ok(await activity.locator('.student-course-explanation').count()>0);assert.equal(await activity.locator('.student-course-explanation').first().locator('dt').count(),5);
  await activity.locator('[data-course-designer-decision="priority"]').first().click();await activity.locator('[data-course-designer-reason]').first().fill('가상 검증: 자료를 비교해 보고 싶습니다.');
  await shot(activity,'after-activity-cards-mobile');await activity.locator('#courseDesignerReviewButton').click();
  assert.ok(await activity.locator('#courseDesignerReviewContent').innerText());await activity.locator('#courseDesignerStudentNumber').fill('99001');
  await activity.locator('#courseDesignerReviewSaveButton').click();await pdf(activity,()=>activity.locator('#courseDesignerReviewExportButton').click(),'activity-fake');
  await activity.reload();assert.equal(await activity.locator('.view.active').getAttribute('id'),'courseDesigner');assert.ok((await activity.evaluate(()=>JSON.stringify(state.courseDesignerDecisions))).includes('가상 검증'));
 });
 let interested=await page();
 await check('interest → field/course comparison → decision → review',async()=>{
  await interested.locator('[data-student-start="interest"]').click();assert.equal(await interested.evaluate(()=>state.courseDesignerStatus),'clear');
  await interested.locator('.course-designer-interest-group summary').first().click();await interested.locator('[data-course-designer-interest]').first().click();await interested.locator('#courseDesignerGenerateButton').click();
  assert.ok(await interested.locator('.student-option-difference').innerText());await interested.locator('[data-course-designer-decision="review"]').first().click();
  await interested.locator('#courseDesignerReviewButton').click();await shot(interested,'after-interest-review');
 });
 let planner=await page(390);
 await check('next year → actual choice term → save/restore → PDF; cohorts/online term limits',async()=>{
  await planner.locator('[data-student-start="choices"]').tap();assert.equal(await planner.evaluate(()=>state.activeGrade),'2');assert.equal(await planner.evaluate(()=>state.plannerTargetSemester),'2-1');
  await planner.locator('[data-add-course]:enabled').first().click();await planner.locator('#plannerStudentNumber').fill('99001');await planner.locator('#savePlanButton').click();
  const saved=await planner.evaluate(()=>JSON.stringify(state.plan));await planner.reload();assert.equal(await planner.evaluate(()=>JSON.stringify(state.plan)),saved);assert.equal(await planner.evaluate(()=>state.plannerMode),'choice');
  await shot(planner,'after-planner-mobile');await planner.locator('#plannerMineModeButton').click();assert.match(await planner.locator('#plannerMineView').innerText(),/교과 31 \+ 창체 3 = 총 34학점/);
  await pdf(planner,()=>planner.evaluate(()=>exportMineCurriculumPdf()),'planner-fake');
  assert.equal(await planner.evaluate(()=>getPlannerSemesterCreditSummary('1','1').totalCredits),34);
  await planner.selectOption('#plannerPlanSelect','incoming2025');assert.equal(await planner.evaluate(()=>state.activeGrade),'3');
  await planner.selectOption('#plannerPlanSelect','incoming2024');assert.match(await planner.locator('#plannerNextTarget').innerText(),/ありません|ありません|ありません|ありません|ありません|ありません|ありません|없습니다/);
  await planner.selectOption('#plannerPlanSelect','incoming2026');await planner.locator('#plannerChoiceModeButton').click();await planner.locator('.year-tab[data-grade="2"]').click();
  assert.match(await planner.locator('#coursePool').innerText(),/학교 편성 온라인/);
  assert.equal(await planner.evaluate(()=>{const c=curriculumData.plans.incoming2026.courses.find(c=>c.subjectId==='2022:물질과에너지');return addCourseToPlan(c.id,'1','1','regular');}),false);
 });
 let drafts=await page(390);
 await check('10 labeled optional fields, fake autosave/manual/load, legacy preservation and student isolation',async()=>{
  await drafts.evaluate(()=>{localStorage.setItem(SELF_EVAL_STORAGE_KEY,JSON.stringify({selfEvalEntries:{legacy:{'old':{motivation:'LEGACY-FAKE'}}}}));localStorage.setItem(CREATIVE_EVAL_STORAGE_KEY,'{invalid-fake');});
  await drafts.goto(base+'#selfEvaluation');assert.ok(await drafts.locator('#selfEvalFields textarea').first().isDisabled());assert.equal(await drafts.locator('#selfEvalFields textarea').count(),10);
  assert.equal(await drafts.evaluate(()=>[...document.querySelectorAll('#selfEvalFields textarea')].every(t=>document.querySelector(`label[for="${t.id}"]`)&&document.getElementById(t.getAttribute('aria-describedby'))&&!t.required)),true);
  await drafts.locator('#selfEvalStudentNumber').fill('99001');await drafts.locator('#confirmSelfEvalOwner').click();
  await drafts.locator('#selfEvalFields textarea').first().fill('가상 응답 A: 기사 두 편을 비교했습니다.');await drafts.locator('#selfEvalFields textarea').first().focus();await drafts.keyboard.press('End');await drafts.keyboard.type(' 키보드 입력 검증');await drafts.locator('#saveSelfEvalButton').click();
  await drafts.reload();assert.match(await drafts.locator('#selfEvalFields textarea').first().inputValue(),/가상 응답 A/);
  await pdf(drafts,()=>drafts.locator('#exportSelfEvalButton').click(),'self-evaluation-fake');
  await drafts.locator('#selfEvalSubjectControls .toolbar-more summary').click();await drafts.locator('#loadSelfEvalButton').click();assert.match(await drafts.locator('#selfEvalFields textarea').first().inputValue(),/가상 응답 A/);
  await drafts.locator('#selfEvalCreativeModeButton').click();await drafts.locator('#creativeEvalFields textarea').first().fill('가상 창체 A: 역할을 나누었습니다.');await drafts.locator('#saveCreativeEvalButton').click();await drafts.reload();assert.equal(await drafts.evaluate(()=>state.selfEvalMode),'creative');assert.match(await drafts.locator('#creativeEvalFields textarea').first().inputValue(),/가상 창체 A/);await pdf(drafts,()=>drafts.locator('#exportCreativeEvalButton').click(),'creative-evaluation-fake');
  await drafts.locator('#clearSelfEvalStudentNumberButton').click();await drafts.locator('#selfEvalStudentNumber').fill('99002');await drafts.locator('#confirmSelfEvalOwner').click();assert.equal(await drafts.locator('#creativeEvalFields textarea').first().inputValue(),'');await drafts.locator('#selfEvalSubjectModeButton').click();assert.equal(await drafts.locator('#selfEvalFields textarea').first().inputValue(),'');
  assert.equal(await drafts.evaluate(()=>JSON.parse(localStorage.getItem(SELF_EVAL_STORAGE_KEY)).selfEvalEntries.legacy.old.motivation),'LEGACY-FAKE');assert.equal(await drafts.evaluate(()=>localStorage.getItem(CREATIVE_EVAL_STORAGE_KEY)),'{invalid-fake');
  await drafts.locator('#clearSelfEvalStudentNumberButton').click();await drafts.locator('#selfEvalStudentNumber').fill('99001');await drafts.locator('#confirmSelfEvalOwner').click();assert.match(await drafts.locator('#selfEvalFields textarea').first().inputValue(),/가상 응답 A/);await drafts.locator('#selfEvalSubjectControls .toolbar-more').evaluate(el=>el.open=false);await drafts.evaluate(()=>scrollTo(0,0));await shot(drafts,'after-selfEvaluation-mobile');
 });

 await check('personal device persists after a new tab; legacy import preserves newer text; storage failure reported',async()=>{
  const personal=await page();await personal.goto(base+'#selfEvaluation');await personal.selectOption('#selfEvalDeviceMode','personal');await personal.fill('#selfEvalStudentNumber','99003');await personal.locator('#confirmSelfEvalOwner').click();
  await personal.locator('#selfEvalFields textarea').first().fill('가상 개인 기기 응답');
  const ownId=await personal.evaluate(()=>getSelfEvaluationEntryKey());
  await personal.evaluate(id=>{localStorage.setItem(SELF_EVAL_STORAGE_KEY,JSON.stringify({selfEvalEntries:{incoming2026:{[id]:{motivation:'이전 가상 응답',question:'가져온 가상 질문'}}}}));localStorage.setItem(CREATIVE_EVAL_STORAGE_KEY,JSON.stringify({creativeEvalEntries:{}}));},ownId);
  const legacy=await personal.evaluate(()=>localStorage.getItem(SELF_EVAL_STORAGE_KEY));personal.on('dialog',dialog=>dialog.accept());await personal.locator('#importLegacySelfEval').click();
  assert.equal(await personal.locator('#selfEvalFields textarea').first().inputValue(),'가상 개인 기기 응답');assert.equal(await personal.locator('[data-self-eval-field="question"]').inputValue(),'가져온 가상 질문');assert.equal(await personal.evaluate(()=>localStorage.getItem(SELF_EVAL_STORAGE_KEY)),legacy);
  const other=await personal.context().newPage();other.on('pageerror',e=>errors.push(e.message));await other.goto(base+'#selfEvaluation');assert.ok(await other.locator('#selfEvalFields textarea').first().isDisabled());await other.selectOption('#selfEvalDeviceMode','personal');await other.fill('#selfEvalStudentNumber','99003');await other.locator('#confirmSelfEvalOwner').click();assert.equal(await other.locator('#selfEvalFields textarea').first().inputValue(),'가상 개인 기기 응답');assert.ok(!other.url().includes('99003'));
  await other.evaluate(()=>{const original=Storage.prototype.setItem;Storage.prototype.setItem=function(key,value){if(key.includes(':student-v2:'))throw new Error('fake quota');return original.call(this,key,value);};});await other.locator('#selfEvalFields textarea').first().fill('저장 실패 가상 응답');assert.match(await other.locator('#toast').innerText(),/저장할 공간|저장.*차단/);await other.close();await personal.close();
 });
 await check('15 admissions pages: reveal all answers and preserve sources',async()=>{
  const admissions=await page(320);const vm=require('node:vm'),sourceContext={window:{}};vm.runInNewContext(fs.readFileSync(path.resolve(__dirname,'../admission-pages.js'),'utf8'),sourceContext);const pages=Object.keys(sourceContext.window.ANJWA_ADMISSION_PAGES.pages);
  for(const key of pages){await admissions.goto(base+key+'.html');assert.ok(await admissions.locator('.admission-answer-check').count()>0,key);if(await admissions.locator('details.recommendation-intro:not([open])').count()) await admissions.locator('details.recommendation-intro > summary').click();await admissions.locator('.admission-answer-check summary').first().click();assert.match(await admissions.locator('.admission-answer-check').first().innerText(),/다음 행동/);}
  await admissions.close();
 });
 await check('320/390/1440 layouts, long online name, keyboard navigation/touch sizes',async()=>{
  const narrow=await page(320);for(const view of ['home','curriculum','courseDesigner','planner','topicExplorer','selfEvaluation']){
   await narrow.goto(base+'#'+view);assert.equal(await narrow.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,view+' horizontal overflow');
  }
  await narrow.goto(base);await narrow.keyboard.press('Tab');assert.ok(await narrow.evaluate(()=>document.activeElement.tagName!=='BODY'));assert.equal(await narrow.evaluate(()=>[...document.querySelectorAll('.student-start-card')].every(el=>el.getBoundingClientRect().height>=44)),true);await narrow.locator('[data-student-start="activity"]').tap();
  await narrow.goto(base+'#curriculum');await narrow.locator('#curriculumSearchToggle').click();await narrow.fill('#curriculumSearch','비판적');assert.match(await narrow.locator('#curriculum').innerText(),/비판적 질문과 창의적 해결/);await shot(narrow,'after-long-course-320');await narrow.close();
 });
 const directPlanner=await page();await directPlanner.goto(base+'#planner');await directPlanner.locator('#plannerChoiceModeButton').click();assert.equal(await directPlanner.evaluate(()=>state.activeGrade),'2');await directPlanner.close();
 results.push({name:'no browser execution errors',pass:errors.length===0,errors});results.push({name:'no local HTTP errors',pass:networkErrors.length===0,networkErrors});
 fs.writeFileSync(path.join(out,'browser-results.json'),JSON.stringify(results,null,2));await browser.close();if(results.some(r=>!r.pass))process.exitCode=1;
})();
