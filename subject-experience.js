(function(root){
'use strict';
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clean=value=>String(value||'').normalize('NFC').replace(/\s+/g,'');
const tabs=[['overview','과목 이해'],['activities','활동·진로'],['school','학교 편성']];
function link(url,label){
 try{if(new URL(url).protocol==='https:')return `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)} ↗</a>`;}catch{}
 return esc(label);
}
function activityList(guide){
 const seen=new Set(),list=[];
 for(const activity of [...(guide.classroomPlan?.activityPlans||[]).map(activity=>({...activity,basis:guide.classroomPlan.basis})),...(guide.activityGuides||[])]){
  const key=clean(activity.title)+'|'+clean(activity.question);
  if(seen.has(key))continue;seen.add(key);list.push(activity);
 }
 return list;
}
function reference(activity){
 const ref=activity.reference,sources=activity.researchSources||[];
 if(!ref&&!sources.length&&!activity.matchNote&&!activity.basis&&!activity.gradeBasis&&!activity.exampleStatus)return '';
 return `<details class="subject-experience-sources"><summary>참고 자료와 활동 범위</summary>${ref?`<p><strong>${esc(ref.title)}</strong>${ref.pages?' · '+esc(ref.pages):''}</p><p>${esc(ref.note||ref.kind)}</p>`:''}${activity.researchConnection?`<p>${esc(activity.researchConnection)}</p>`:''}${sources.map(source=>`<p>${link(source.url,`${source.authors} (${source.year}) · ${source.title}`)}</p><p>${esc(source.verificationLevel)} · ${esc(source.transferLimit)}</p>`).join('')}${activity.basis?`<p>${esc(activity.basis)}</p>`:''}${activity.matchNote?`<p>${esc(activity.matchNote)}</p>`:''}${activity.gradeBasis||activity.exampleStatus?`<p>${esc(activity.gradeBasis)} ${esc(activity.exampleStatus)}</p>`:''}</details>`;
}
function renderActivity(activity,index){
 const materials=activity.materials||activity.preparation||'';
 return `<article><details${index===0?' open':''}><summary class="subject-experience-activity-toggle"><span class="subject-experience-activity-number">${String(index+1).padStart(2,'0')}</span><h4>${esc(activity.title)}</h4><span class="subject-experience-activity-arrow" aria-hidden="true">⌄</span></summary>
  <p class="subject-experience-question">${esc(activity.question)}</p>
  ${activity.method?`<p>${esc(activity.method)}</p>`:''}
  ${activity.concepts?.length?`<p class="subject-experience-note"><strong>먼저 익힐 개념</strong> ${activity.concepts.map(esc).join(' · ')}</p>`:''}
  <dl>${materials?`<div><dt>준비 자료</dt><dd>${esc(materials)}</dd></div>`:''}${activity.measure?`<div><dt>비교할 기준</dt><dd>${esc(activity.measure)}</dd></div>`:''}</dl>
  ${activity.steps?.length?`<ol>${activity.steps.map(step=>`<li>${esc(step)}</li>`).join('')}</ol>`:''}
  <dl><div><dt>남길 결과물</dt><dd>${esc(activity.output)}</dd></div></dl>
  ${activity.limits?`<p class="subject-experience-note"><strong>해석할 때</strong> ${esc(activity.limits)}</p>`:''}
  ${activity.reflection||activity.resultPrompt?`<p class="subject-experience-note"><strong>돌아볼 질문</strong> ${esc(activity.reflection||activity.resultPrompt)}</p>`:''}
  ${activity.nextStep?`<p class="subject-experience-note"><strong>다음 탐구</strong> ${esc(activity.nextStep)}</p>`:''}
  ${activity.worksheet&&/^\.\/learning-data\/[\w.-]+\.csv$/.test(activity.worksheet.url)?`<p><a class="subject-experience-resource" href="${esc(activity.worksheet.url)}" download>${esc(activity.worksheet.label)}</a>${activity.worksheet.note?`<small>${esc(activity.worksheet.note)}</small>`:''}</p>`:''}
  ${activity.majors?.length?`<p class="subject-experience-note"><strong>함께 살펴볼 전공</strong> ${activity.majors.map(esc).join(' · ')}</p>`:''}
  ${reference(activity)}
 </details></article>`;
}
function renderCareer(item){
 return `<article><h4>${esc(item.major)}</h4><p>${esc(item.reason)}</p>${item.activityTitle?`<p class="subject-experience-note">${item.matchType==='related'?'관련 활동':'활동'} · ${esc(item.activityTitle)}</p>`:''}</article>`;
}
function render({course,guide,offeringHtml=''}){
 const profile=root.AnjwaSubjectProfile;
 const majors=profile?.mergeMajorConnections?.(guide)||guide.majorConnections||[];
 const activities=activityList(guide),topics=guide.learningTopics||[];
 const understanding=root.AnjwaSubjectOverview?.get(course,guide)||topics;
 const detailedActivityTexts=new Set(activities.flatMap(activity=>[clean(activity.title),clean(activity.question)]));
 const activityIdeas=(guide.activities||[]).filter(idea=>!detailedActivityTexts.has(clean(idea)));
 const metadata=[course.area,course.category,guide.curriculum].filter(Boolean);
 const extraMajors=[...new Set([...(guide.relatedMajors||[]),...(guide.majorConnections||[]).map(item=>item.major)])].filter(name=>!majors.some(m=>clean(m.major)===clean(name)));
 const universityHtml=profile?.renderContext?.(guide,{onlyUniversity:true})||'';
 return `<div class="subject-experience">
  <p class="subject-experience-meta">${metadata.map(esc).join('<span aria-hidden="true"> · </span>')}</p>
  <div class="subject-experience-tabs" role="tablist" aria-label="과목 안내 내용">${tabs.map(([id,label],index)=>`<button type="button" role="tab" id="subject-tab-${id}" aria-controls="subject-panel-${id}" aria-selected="${index===0}" tabindex="${index===0?'0':'-1'}" data-subject-tab="${id}">${label}</button>`).join('')}</div>
  <section class="subject-experience-panel" role="tabpanel" id="subject-panel-overview" aria-labelledby="subject-tab-overview" data-subject-panel="overview">
   <div class="subject-experience-intro"><h4>무엇을 배우나요</h4><ul class="subject-experience-understanding">${understanding.map(point=>`<li>${esc(point)}</li>`).join('')}</ul></div>
   <details class="subject-experience-sources subject-experience-learning-detail"><summary>학습 내용 자세히 보기</summary><p>${esc(guide.learning)}</p>${guide.classroomPlan?.learningBridge?`<p>${esc(guide.classroomPlan.learningBridge)}</p>`:''}${guide.conceptExplanation?`<p>${esc(guide.conceptExplanation)}</p>`:''}${topics.length?`<p class="subject-experience-note">학습 범위 · ${topics.map(esc).join(' · ')}</p>`:''}</details>
   ${guide.learningMethods?.length||guide.competencies?.length?`<details class="subject-experience-sources"><summary>함께 익히는 학습 방법</summary><p>${(guide.competencies||[]).map(esc).join(' · ')}</p><ul>${(guide.learningMethods||[]).map(method=>`<li>${esc(method)}</li>`).join('')}</ul></details>`:''}
   ${guide.relatedSubjects?.length?`<details class="subject-experience-sources"><summary>함께 살펴볼 과목</summary><p>${guide.relatedSubjects.map(esc).join(' · ')}</p></details>`:''}
   ${guide.exploratory?`<p class="subject-experience-note">학교·전문 과목의 탐색 안내입니다. 실제 수업 주제와 실습 내용은 학교 수업계획에서 확인하세요.</p>`:''}
   <div class="subject-experience-next"><p>활동 예시 · 준비 자료 · 결과물</p><button type="button" data-subject-open-tab="activities">활동과 진로 살펴보기 <span aria-hidden="true">→</span></button></div>
  </section>
  <section class="subject-experience-panel" role="tabpanel" id="subject-panel-activities" aria-labelledby="subject-tab-activities" data-subject-panel="activities" hidden>
   <section class="subject-experience-section"><h4>수업에서 해볼 활동</h4>${activities.length?`<div class="subject-experience-activities">${activities.map(renderActivity).join('')}</div>`:`<ul>${(guide.activities||[]).map(item=>`<li>${esc(item)}</li>`).join('')}</ul>`}</section>
   ${activities.length&&activityIdeas.length?`<details class="subject-experience-sources"><summary>함께 살펴볼 활동 아이디어 · ${activityIdeas.length}개</summary><ul>${activityIdeas.map(idea=>`<li>${esc(idea)}</li>`).join('')}</ul></details>`:''}
   ${majors.length?`<section class="subject-experience-section"><h4>어떤 전공에서 활용하나요</h4><p class="subject-experience-note">수업과 활동에서 쓰는 개념을 전공 공부와 연결한 예시입니다.</p><div class="subject-experience-careers">${majors.slice(0,6).map(renderCareer).join('')}</div>${majors.length>6?`<details class="subject-experience-sources"><summary>다른 전공 연결 ${majors.length-6}개 더 보기</summary><div class="subject-experience-careers">${majors.slice(6).map(renderCareer).join('')}</div></details>`:''}</section>`:''}
   ${guide.militaryConnections?.length?`<section class="subject-experience-section"><h4>부사관 진로에서 살펴볼 일</h4><div class="subject-experience-careers">${guide.militaryConnections.map(m=>`<article><h4>${esc(m.role)}</h4><p>${esc(m.reason)}</p></article>`).join('')}</div><p class="subject-experience-note">특기 배정이나 임용 요건을 뜻하지 않습니다.</p></section>`:''}
   ${extraMajors.length?`<details class="subject-experience-sources"><summary>함께 살펴볼 다른 전공</summary><p>${extraMajors.map(esc).join(' · ')}</p></details>`:''}
   ${guide.careerPaths?.length?`<details class="subject-experience-sources"><summary>관심 분야별 활용 방법 · ${guide.careerPaths.length}개</summary><div class="subject-experience-careers">${guide.careerPaths.map(path=>`<article><h4>${esc(path.name)}</h4><p>${esc(path.reason)}</p></article>`).join('')}</div></details>`:''}
  </section>
  <section class="subject-experience-panel" role="tabpanel" id="subject-panel-school" aria-labelledby="subject-tab-school" data-subject-panel="school" hidden>
   <section class="subject-experience-section"><h4>우리학교 편성</h4><div class="subject-experience-offerings">${offeringHtml||'<p>수록된 학교 편성표에 없는 과목입니다. 다른 수강 방법은 담당 선생님과 상담하세요.</p>'}</div></section>
   <p class="subject-experience-note">학교지정 과목은 개설 확정입니다. 학생선택 과목의 개설과 온라인 수강 시간·신청 조건은 해당 학기 학교 안내를 확인하세요.</p>
   ${universityHtml}
   <details class="subject-experience-sources"><summary>과목 안내의 출처와 기준</summary><p>${guide.sourceUrl?link(guide.sourceUrl,guide.sourceLabel||'과목 안내 자료'):esc(guide.sourceLabel||'학교 편성표와 과목별 학습 안내')}${guide.sourceCheckedAt?' · 확인 '+esc(guide.sourceCheckedAt):''}</p>${guide.sourceNote?`<p>${esc(guide.sourceNote)}</p>`:''}${guide.scopeNote?`<p>${esc(guide.scopeNote)}</p>`:''}<p>전공과 활동의 연결은 학습 내용을 바탕으로 구성한 예시입니다. 대학의 필수·권장 과목과 이수 조건은 해당 학년도의 대학 안내에서 확인하세요.</p><p>교육과정이 다른 과목은 내용이 관련되더라도 같은 공식 과목으로 간주하지 않습니다.</p></details>
  </section>
 </div>`;
}
function activate(scope,key,focus=true){
 if(!tabs.some(([id])=>id===key))return;
 for(const tab of scope.querySelectorAll('[data-subject-tab]')){
  const active=tab.dataset.subjectTab===key;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;
  if(active&&focus)tab.focus({preventScroll:true});
 }
 for(const panel of scope.querySelectorAll('[data-subject-panel]'))panel.hidden=panel.dataset.subjectPanel!==key;
 const dialog=scope.closest('.subject-info-dialog,dialog');if(dialog)dialog.scrollTop=0;
}
const bound=new WeakSet();
function bind(doc){
 if(bound.has(doc))return;bound.add(doc);
 doc.addEventListener('click',event=>{
  const button=event.target.closest?.('[data-subject-tab],[data-subject-open-tab]');
  if(!button)return;const scope=button.closest('.subject-experience');if(!scope)return;
  event.preventDefault();activate(scope,button.dataset.subjectTab||button.dataset.subjectOpenTab);
 });
 doc.addEventListener('keydown',event=>{
  const tab=event.target.closest?.('[data-subject-tab]');if(!tab||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
  const scope=tab.closest('.subject-experience');if(!scope)return;
  const index=tabs.findIndex(([id])=>id===tab.dataset.subjectTab);
  const next=event.key==='Home'?0:event.key==='End'?tabs.length-1:(index+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
  event.preventDefault();activate(scope,tabs[next][0]);
 });
}
const api={render,activate,bind,activityList};root.AnjwaSubjectExperience=api;
if(root.document)bind(root.document);
if(typeof module==='object'&&module.exports)module.exports=api;
})(typeof window==='object'?window:globalThis);
