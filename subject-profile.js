(function(root){
'use strict';
const norm=name=>String(name||'').normalize('NFC').replace(/^\s*\(온\)\s*/,'').replace(/\s+/g,'').replace(/Ⅰ/g,'I').replace(/Ⅱ/g,'II').replace(/Ⅲ/g,'III');
function resolve(guide,course,revision){
 const name=norm(course.name),explicit=revision||String(course.subjectId||'').match(/^([^:]+):/)?.[1]||(course.cohortPlanKey==='incoming2024'?'2015':undefined);
 const candidates=explicit?[explicit]:['2022','대표','2015'];
 for(const rev of candidates){const extra=guide.additionalProfiles?.[rev+':'+name];if(extra)return extra;}
 if(/고시외|\(전문\)/.test(name))return null;
 const match=Object.entries(guide.subjectProfiles||{}).find(([key,profile])=>norm(key)===name&&(!explicit||profile.curriculum?.startsWith(explicit)));
 return match?.[1]||null;
}
function curriculumLabel(value){const text=String(value||'');if(text.startsWith('2015'))return '2015 개정 · 2024 입학생 적용';if(text.startsWith('2022'))return '2022 개정';return '기존 대표 과목';}
// These are links between learning ideas, not official equivalences between curricula.
const topicSubjectLinks={
 '독서':['주제 탐구 독서','독서와 작문','독서 토론과 글쓰기'],
 '화법과 작문':['화법과 언어','독서와 작문','직무 의사소통'],
 '언어와 매체':['매체 의사소통','언어생활 탐구'],
 '영어 독해와 작문':['심화 영어 독해와 작문','심화 영어','미디어 영어'],
 '영어 발표와 토론':['미디어 영어'],
 '정치와 법':['정치','법과 사회'],
 '사회·문화':['사회와 문화','사회문제 탐구'],
 '한국지리':['한국지리 탐구'],
 '세계지리':['세계시민과 지리','여행지리'],
 '생활과 윤리':['현대사회와 윤리','윤리문제 탐구'],
 '미적분':['미적분Ⅰ','미적분Ⅱ'],
 '수학과제탐구':['수학과제 탐구'],
 '물리학':['물리학Ⅰ'],
 '화학':['화학Ⅰ'],
 '생명과학':['생명과학Ⅰ'],
 '지구과학':['지구과학Ⅰ'],
 '체육':['체육1','체육2','운동과 건강'],
 '스포츠 생활':['스포츠 생활1','스포츠 생활2'],
 '교육학':['교육의 이해'],
 '한국사':['한국사1','한국사2'],
 '역사':['세계사','역사로 탐구하는 현대 세계','동아시아 역사 기행'],
 '통합과학':['통합과학1','통합과학2','과학탐구실험1','과학탐구실험2'],
 '인공지능과 미래사회':['인공지능 기초']
};
const topicConceptLinks={
 'sci-physics-wireless':['전자기와 양자','물리학Ⅱ'],
 'sci-physics-running':['역학과 에너지'],
 'sci-physics-medical-imaging':['전자기와 양자'],
 'sci-chem-corrosion':['화학 반응의 세계'],
 'sci-chem-blood-buffer':['화학Ⅱ','물질과 에너지'],
 'sci-bio-enzyme':['세포와 물질대사','생명과학Ⅱ'],
 'sci-earth-dust':['지구시스템과학','기후변화와 환경생태'],
 'sci-earth-sea-level':['지구시스템과학','기후변화와 지속가능한 세계'],
 'env-school-waste':['기후변화와 환경생태'],
 'info-algorithm-bias':['인공지능 기초','소프트웨어와 생활'],
 'info-ai-error':['데이터 과학'],
 'art-public-health-design':['미술과 매체','미술 창작'],
 'art-color-response':['미술 감상과 비평'],
 'kor-literature-media':['문학과 영상'],
 'music-instrument-emotion':['음악 감상과 비평'],
 'soc-economy-price':['인간과 경제활동','금융과 경제생활'],
 'soc-economy-wage':['인간과 경제활동'],
 'math-calculus-drug-model':['미적분','미적분Ⅰ'],
 'math-stat-poll':['실용 통계'],
 'math-waiting-g2':['실용 통계'],
 'kor-grammar-teaching-cards':['공통국어1','공통국어2'],
 'kor-language-rule-examples':['공통국어2','직무 의사소통'],
 'kor-language-history-evidence':['공통국어2'],
 'kor-negotiation-shared-time':['화법과 작문','직무 의사소통'],
 'kor-citation-self-review':['공통국어2','주제 탐구 독서','독서'],
 'edu-step-hint-design':['교육학'],
 'soc-hypothesis-not-supported':['사회문제 탐구','사회·문화'],
 'soc-sustainability-measurement':['인간과 경제활동','금융과 경제생활'],
 'media-sport-event-portrayal':['언어와 매체','스포츠 문화','미술과 매체'],
 'engineering-scale-space-model':['기하','미술 창작'],
 'earth-forest-change-series':['세계시민과 지리','기후변화와 환경생태','생태와 환경'],
 'ethics-animal-research-alternatives':['현대사회와 윤리','생명과학','보건']
};
function contextRecords(value,key){return Array.isArray(value)?value:value?.[key]||[];}
const careerSubjectPairs=[['수학Ⅰ','대수'],['수학Ⅱ','미적분Ⅰ'],['미적분','미적분Ⅱ'],['물리학Ⅰ','물리학'],['화학Ⅰ','화학'],['생명과학Ⅰ','생명과학'],['지구과학Ⅰ','지구과학'],['화법과 작문','화법과 언어'],['독서','독서와 작문'],['독서','주제 탐구 독서'],['세계지리','세계시민과 지리'],['한국지리','한국지리 탐구'],['심리학','인간과 심리'],['교육학','교육의 이해'],['생활과 윤리','현대사회와 윤리'],['사회·문화','사회와 문화']];
const careerNameIndex=new Map();
for(const pair of careerSubjectPairs)for(const subject of pair){const key=norm(subject);careerNameIndex.set(key,[...new Set([...(careerNameIndex.get(key)||[]),...pair.map(norm)])]);}
function relatedCareerNames(name){return careerNameIndex.get(name)||[];}
const universityIndices=new WeakMap();
function universityIndex(source){
 if(universityIndices.has(source))return universityIndices.get(source);
 const index=new Map();
 for(const record of contextRecords(source,'records'))for(const key of ['coreSubjects','recommendedSubjects'])for(const matchedSubject of record[key]||[]){
  const name=norm(matchedSubject);if(!index.has(name))index.set(name,[]);
  index.get(name).push({...record,matchedSubject,subjectRole:key==='coreSubjects'?'핵심':'권장',matchType:'name'});
 }
 universityIndices.set(source,index);return index;
}
function reasonEntry(reasons,name){
 const entries=Object.entries(reasons),exact=entries.find(([subject])=>norm(subject)===name);if(exact)return {matchedSubject:exact[0],reason:exact[1],matchType:'direct'};
 const related=relatedCareerNames(name),entry=entries.find(([subject])=>related.includes(norm(subject)));return entry?{matchedSubject:entry[0],reason:`관련 과목 「${entry[0]}」의 학습 내용과 비교해 볼 설명입니다. ${entry[1]}`,matchType:'related'}:null;
}
function enrich(profile,course,context={}){
 const name=norm(course.name),designer=context.designer||root.ANJWA_COURSE_DESIGNER||{},topics=context.topics||root.ANJWA_TOPIC_DATA||{},universities=context.universities||root.ANJWA_UNIVERSITY_RECOMMENDATION_DATA||{},fields=context.fields||root.ANJWA_RECOMMENDATION_DATA||{};
 const concept=Object.entries(designer.subjectConcepts||{}).find(([subject])=>norm(subject)===name)?.[1]||'';
 const careerPaths=[];
 for(const [id,reasons] of Object.entries(designer.interestSubjectReasons||{})){
  const entry=reasonEntry(reasons,name);if(!entry)continue;
  const interest=(designer.interests||[]).find(i=>i.id===id);if(!interest)continue;
  const majors=contextRecords(fields,'records').filter(r=>(interest.recordIds||[]).includes(r.id)).flatMap(r=>r.departments||[]);
  careerPaths.push({id,name:interest.label,...entry,majors,basis:'과목별 관심 분야 설명'});
 }
 for(const record of contextRecords(fields,'records')){
  if(!record.note)continue;
  const subjects=['coreSubjects','recommendedSubjects','suggestedSubjects'].flatMap(key=>record[key]||[]),matchedSubject=subjects.find(subject=>norm(subject)===name)||subjects.find(subject=>relatedCareerNames(name).includes(norm(subject)));if(!matchedSubject)continue;
  if(careerPaths.some(path=>(designer.interests||[]).find(i=>i.id===path.id)?.recordIds?.includes(record.id)))continue;
  const matchType=norm(matchedSubject)===name?'direct':'related';
  careerPaths.push({id:record.id,name:record.major||record.field,matchedSubject,matchType,reason:matchType==='direct'?record.note:`관련 과목 「${matchedSubject}」를 포함한 계열 설명입니다. ${record.note}`,majors:record.departments||[],basis:'계열별 학습 안내'});
 }
 const activityGuides=contextRecords(topics,'topics').flatMap(topic=>{
  const direct=norm(topic.subject)===name,related=[...(topicSubjectLinks[topic.subject]||[]),...(topicConceptLinks[topic.id]||[]),...(topic.relatedSubjects||[])].some(subject=>norm(subject)===name);
  if(!direct&&!related)return [];
  return [{...topic,researchSources:(topic.sourceIds||[]).map(id=>topics.researchSources?.[id]).filter(Boolean),matchType:direct?'direct':'related',matchNote:direct?'':(Object.entries(topic.relatedSubjectNotes||{}).find(([subject])=>norm(subject)===name)?.[1]||`「${topic.subject}」에서 배우는 내용도 함께 쓰는 활동입니다. 필요한 개념을 배웠는지 먼저 살펴보세요.`)}];
 }).sort((a,b)=>(a.matchType==='direct'?0:1)-(b.matchType==='direct'?0:1));
 const universityEvidence=universityIndex(universities).get(name)||[];
 const classroom=context.classroom||root.ANJWA_SUBJECT_CLASSROOM_PLANS||{},revision=String(course.subjectId||'').split(':')[0]||(profile.curriculum?.startsWith('2015')?'2015':'2022'),classroomPlan=classroom[course.subjectId]||classroom[revision+':'+name]||null;
 return {...profile,conceptExplanation:concept&&concept!==profile.learning?concept:'',careerPaths,activityGuides,universityEvidence,classroomPlan};
}
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeLink=(url,label)=>{try{if(new URL(url).protocol==='https:')return `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)} ↗</a>`;}catch{}return esc(label);};
function renderActivity(topic){
 return `<article class="subject-context-activity"><h4>${esc(topic.title)}</h4>${topic.matchNote?`<p class="subject-context-note">${esc(topic.matchNote)}</p>`:''}<dl><div><dt>탐구 질문</dt><dd>${esc(topic.question)}</dd></div><div><dt>해볼 방법</dt><dd>${esc(topic.method)}</dd></div><div><dt>결과물</dt><dd>${esc(topic.output)}</dd></div></dl><details><summary>준비 자료·진행 순서·해석</summary>${topic.concepts?.length?`<p><b>먼저 배울 개념</b> ${topic.concepts.map(esc).join(' · ')}</p>`:''}<p><b>준비 자료</b> ${esc(topic.materials||topic.preparation)}</p>${topic.measure?`<p><b>비교할 기준</b> ${esc(topic.measure)}</p>`:''}${topic.steps?.length?`<ol>${topic.steps.map(step=>`<li>${esc(step)}</li>`).join('')}</ol>`:''}${topic.reflection||topic.resultPrompt?`<p><b>돌아볼 질문</b> ${esc(topic.resultPrompt||topic.reflection)}</p>`:''}<p><b>해석할 때 주의할 점</b> ${esc(topic.limits)}</p>${topic.nextStep?`<p><b>다음 탐구</b> ${esc(topic.nextStep)}</p>`:''}${topic.worksheet?`<p>${/^\.\/learning-data\/[\w.-]+\.csv$/.test(topic.worksheet.url)?`<a href="${esc(topic.worksheet.url)}" download>${esc(topic.worksheet.label)}</a>`:safeLink(topic.worksheet.url,topic.worksheet.label)}</p>`:''}${topic.researchSources?.length?`<div><b>비교해 읽을 연구</b>${topic.researchConnection?`<p>${esc(topic.researchConnection)}</p>`:''}${topic.researchSources.map(source=>`<p>${safeLink(source.url,`${source.authors} (${source.year}) · ${source.title}`)}</p><p class="subject-context-note">${esc(source.verificationLevel)} · ${esc(source.transferLimit)}</p>`).join('')}</div>`:''}${renderTopicReference(topic)}<p class="subject-context-note">${esc(topic.gradeBasis)} ${esc(topic.exampleStatus)}</p></details>${topic.majors?.length?`<p><b>활동에서 살펴볼 학과</b> ${topic.majors.map(esc).join(' · ')}</p>`:''}</article>`;
}
function renderTopicReference(topic){
 const ref=topic.reference;if(!ref)return '';
 return `<div class="subject-context-reference"><b>이 활동을 만들 때 참고한 내용</b><p>${esc(ref.title)} · ${esc(ref.pages)}</p><p class="subject-context-note">${esc(ref.kind)} · ${esc(ref.note)}</p></div>`;
}
function renderUniversity(record){
 const condition=record.condition||{},conditionLabel={AND:'표의 과목을 모두 이수',OR:'표의 과목 중 선택',AT_LEAST:'최소 이수 과목 수'}[condition.operator]||'';
 return `<article class="subject-context-university"><h4>${esc(record.university)} · ${esc(record.department)}</h4><p class="subject-context-note">${record.admissionYear?esc(record.admissionYear)+'학년도':'적용 학년도 정보 없음'}${record.verificationStatus==='incomplete-note'?' · 이수 조건 설명을 함께 읽어 보세요.':''}</p>${record.coreSubjects?.length?`<p><b>참고표의 핵심과목</b> ${record.coreSubjects.map(esc).join(' · ')}</p>`:''}${record.recommendedSubjects?.length?`<p><b>참고표의 권장과목</b> ${record.recommendedSubjects.map(esc).join(' · ')}</p>`:''}${conditionLabel||condition.minimumCount!=null?`<p><b>이수 조건</b> ${esc(conditionLabel)}${condition.minimumCount!=null?' · 최소 '+esc(condition.minimumCount)+'개':''}</p>`:''}${record.note?`<p><b>함께 읽을 조건</b> ${esc(record.note)}</p>`:''}${record.originalCategory?`<p>${esc(record.originalCategory)}</p>`:''}${record.sourceUrl?`<p>${safeLink(record.sourceUrl,record.sourceTitle||'대학의 안내')}${record.sourcePage?' · '+esc(record.sourcePage):''}</p>`:''}</article>`;
}
const evidenceRegistry=new Map();
function renderEvidenceRows(records,limit=6){return `<p class="subject-context-note" role="status">${records.length}건 중 ${Math.min(limit,records.length)}건 표시</p>${records.slice(0,limit).map(renderUniversity).join('')}${records.length>limit?`<button type="button" class="ghost-button library-button" data-context-university-more data-context-university-limit="${limit}">다음 ${Math.min(12,records.length-limit)}건 더 보기</button>`:''}`;}
function mergeMajorConnections(profile){
 const merged=new Map(),activityCareers=new Map();
 for(const item of profile.majorConnections||[])merged.set(norm(item.major),item);
 for(const activity of profile.activityGuides||[])for(const item of activity.careerConnections||[]){
  const key=norm(item.major);if(!key||!item.reason||activityCareers.has(key))continue;
  activityCareers.set(key,{...item,activityTitle:activity.title,matchType:activity.matchType});
 }
 if(activityCareers.size)merged.clear();
 for(const [key,item]of activityCareers)merged.set(key,item);
 for(const item of profile.classroomPlan?.careerConnections||[])merged.set(norm(item.major),item);
 return [...merged.values()];
}

function renderClassroom(plan,{classroomIntro=true}={}){
 if(!plan)return '';
 const careers=(plan.careerConnections||[]).map(item=>`<article class="subject-context-career"><h4>${esc(item.major)}</h4><p>${esc(item.reason)}</p></article>`).join('');
 const activities=(plan.activityPlans||[]).map(activity=>`<article class="subject-context-activity"><h4>${esc(activity.title)}</h4><dl><div><dt>탐구 질문</dt><dd>${esc(activity.question)}</dd></div><div><dt>준비 자료</dt><dd>${esc(activity.materials)}</dd></div><div><dt>결과물</dt><dd>${esc(activity.output)}</dd></div></dl>${activity.steps?.length?`<ol>${activity.steps.map(step=>`<li>${esc(step)}</li>`).join('')}</ol>`:''}${activity.reflection?`<p><b>돌아볼 질문</b> ${esc(activity.reflection)}</p>`:''}<p><b>해석할 때 주의할 점</b> ${esc(activity.limits)}</p></article>`).join('');
 return `<section class="subject-context-classroom"><h3>수업 개념으로 해볼 활동</h3>${classroomIntro?`<p>${esc(plan.learningBridge)}</p>${careers}`:''}${activities}<p class="subject-context-note">${esc(plan.basis)}${/이수 조건/.test(plan.basis||"") ? "" : " 대학의 이수 조건이나 학교의 실제 수행평가 계획을 뜻하지 않습니다."}</p></section>`;
}
function renderContext(profile,options={}){
 const career=profile.careerPaths||[],activities=profile.activityGuides||[],evidence=profile.universityEvidence||[],evidenceKey=evidence.length?norm(evidence[0].matchedSubject):'';
 if(evidenceKey)evidenceRegistry.set(evidenceKey,evidence);
 const concept=profile.conceptExplanation?`<p class="subject-context-concept"><b>개념을 더 살펴보면</b> ${esc(profile.conceptExplanation)}</p>`:'';
 const careerHtml=career.length?`<details class="subject-context-section"><summary>관심 분야에 따라 어떻게 쓰이나요 · ${career.length}개</summary><p class="subject-context-note">같은 과목도 관심 분야에 따라 쓰이는 내용이 달라집니다.</p>${career.map(path=>`<article class="subject-context-career"><h4>${esc(path.name)}</h4><p>${esc(path.reason)}</p>${path.majors.length?`<p class="subject-context-note">함께 살펴볼 전공 · ${path.majors.map(esc).join(' · ')}</p>`:''}</article>`).join('')}</details>`:'';
 const activityHtml=activities.length?`<details class="subject-context-section"><summary>더 해볼 탐구 · ${activities.length}개</summary><p class="subject-context-note">질문을 고른 뒤 준비물과 진행 순서를 펼쳐 보세요.</p>${activities.map(renderActivity).join('')}</details>`:'';
 const universityHtml=evidence.length?`<details class="subject-context-section" data-context-university-key="${esc(evidenceKey)}"><summary>대학·학과별 참고 과목 · ${evidence.length}건</summary><p class="subject-context-note">같은 이름의 과목이 등장하는 참고표입니다. 적용 학년도나 대학 원문이 빠진 항목도 있습니다. 지원하려는 학년도의 대학 안내에서 과목의 교육과정과 함께 이수할 조건을 대조하세요.</p><label>대학·학과 찾기<input type="search" class="subject-context-search" data-context-university-search aria-label="${esc(evidence[0].matchedSubject)} 관련 대학·학과 찾기" placeholder="예: 간호, 서울대"></label><div data-context-university-results>${renderEvidenceRows(evidence)}</div></details>`:'';
 if(options.onlyUniversity)return universityHtml;
 return renderClassroom(profile.classroomPlan,options)+concept+careerHtml+activityHtml+universityHtml;
}
function updateEvidence(section,limit){
 const query=norm(section.querySelector('[data-context-university-search]').value),records=(evidenceRegistry.get(section.dataset.contextUniversityKey)||[]).filter(r=>norm([r.university,r.department,r.region,r.local].join(' ')).includes(query));
 section.querySelector('[data-context-university-results]').innerHTML=renderEvidenceRows(records,limit);
}
if(root.document?.addEventListener){
 root.document.addEventListener('input',event=>{const input=event.target.closest?.('[data-context-university-search]');if(input)updateEvidence(input.closest('[data-context-university-key]'),6);});
 root.document.addEventListener('click',event=>{const button=event.target.closest?.('[data-context-university-more]');if(button){event.preventDefault();const section=button.closest('[data-context-university-key]');updateEvidence(section,Number(button.dataset.contextUniversityLimit)+12);}});
}
const api={resolve,curriculumLabel,norm,enrich,renderContext,mergeMajorConnections};root.AnjwaSubjectProfile=api;if(typeof module==='object'&&module.exports)module.exports=api;
})(typeof window==='object'?window:globalThis);
