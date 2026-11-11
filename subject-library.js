(function(root){
'use strict';
const profileAPI=root.AnjwaSubjectProfile||(typeof require==='function'?require('./subject-profile.js'):null);
const revisionLabel=profileAPI.curriculumLabel;
const norm=s=>String(s||'').normalize('NFC').replace(/^\s*\(온\)\s*/,'').replace(/\s+/g,'').replace(/Ⅰ/g,'I').replace(/Ⅱ/g,'II').replace(/Ⅲ/g,'III');
const areaName=s=>({'기술∙가정/정보':'기술·가정/정보','기술·가정':'기술·가정/정보','교양 선택':'교양','한국사':'사회'}[s]||s||'미기재');
const clean=s=>String(s||'').replace(/^\s*\(온\)\s*/,'').trim();
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function buildCatalogue(curriculum,guide,designer){
 const records=new Map(), profiles=guide.subjectProfiles||{};
 for(const [name,profile] of Object.entries(profiles)){
  const revision=profile.curriculum?.startsWith('2015')?'2015':'2022',id=revision+':'+norm(name);
  records.set(id,{id,name,revision,area:profile.area||'수학',profile,offerings:[]});
 }
 for(const [department,plans] of [['보통과',curriculum.plans||{}],['부사관과',curriculum.militaryPlans||{}]])for(const [key,plan] of Object.entries(plans)){
  if(!/^incoming\d{4}$/.test(key))continue;
  const revision=key==='incoming2024'?'2015':'2022';
  for(const course of plan.courses||[]){
   const name=clean(course.name),id=revision+':'+norm(name);
   if(!records.has(id)){
    const exact=Object.entries(profiles).find(([n,p])=>norm(n)===norm(name)&&p.curriculum?.startsWith(revision));
    const areaProfile=guide.areaProfiles?.[course.area]||{};
    const learning=exact?.[1].learning||designer.subjectConcepts?.[name]||areaProfile.learning||'학교 편성표에 수록된 과목입니다. 세부 수업 내용과 활동은 학교의 과목 안내에서 확인하세요.';
    records.set(id,{id,name,revision,area:areaName(course.area),profile:exact?.[1]||{learning,activities:areaProfile.activities||[]},offerings:[]});
   }
   const record=records.get(id);if(record.area==='미기재'&&course.area)record.area=areaName(course.area);
   record.offerings.push({department,cohort:key.slice(8),semesters:[...(course.semesters||[])],online:/^\s*\(온\)/.test(course.name)});
  }
 }
 for(const [name,learning] of Object.entries(designer.subjectConcepts||{})){
  if([...records.values()].some(r=>norm(r.name)===norm(name)))continue;
  const id='대표:'+norm(name);records.set(id,{id,name,revision:'대표',area:'대표 과목',profile:{learning},offerings:[]});
 }
 for(const record of records.values()){const profile=profileAPI.resolve(guide,{name:record.name,subjectId:record.id},record.revision);if(profile){record.profile=profile;if(profile.area)record.area=areaName(profile.area);if(profile.curriculum?.startsWith('2015'))record.revision='2015';}}
 return [...records.values()].sort((a,b)=>a.name.localeCompare(b.name,'ko')||a.revision.localeCompare(b.revision));
}
function filterCatalogue(records,{query='',area='all',offering='all',revision='all'}={}){
 const words=String(query).split(/[\s,，]+/).map(norm).filter(Boolean);
 return records.filter(r=>(area==='all'||r.area===area)&&(revision==='all'||r.revision===revision)&&(offering==='all'||(offering==='school'?r.offerings.length>0:r.offerings.length===0))&&words.every(word=>norm([r.name,r.area,r.profile.learning,...(r.profile.learningTopics||[]),...(r.profile.relatedMajors||[]),...(r.profile.majorConnections||[]).flatMap(m=>[m.major,m.reason])].join(' ')).includes(word))).sort((a,b)=>{const rank=r=>norm(r.name)===norm(query)?0:norm(query)&&norm(r.name).includes(norm(query))?1:2;return rank(a)-rank(b)||a.name.localeCompare(b.name,'ko');});
}
function readSearchState(params,records){
 const areas=new Set(records.map(r=>r.area)),revisions=new Set(records.map(r=>r.revision));
 return {query:(params.get('q')||'').slice(0,200),area:areas.has(params.get('area'))?params.get('area'):'all',offering:['school','outside'].includes(params.get('offering'))?params.get('offering'):'all',revision:revisions.has(params.get('revision'))?params.get('revision'):'all'};
}
function searchStateParams(params,state){
 const next=new URLSearchParams(params);
 for(const [key,value] of [['q',state.query.trim()],['area',state.area],['offering',state.offering],['revision',state.revision]]){
  if(value&&value!=='all')next.set(key,value);else next.delete(key);
 }
 return next;
}
const api={buildCatalogue,filterCatalogue,norm,readSearchState,searchStateParams};if(typeof module==='object'&&module.exports)module.exports=api;root.AnjwaSubjectLibrary=api;
if(!root.document)return;
function mount(){
 const doc=root.document,$=id=>doc.getElementById(id),guide=root.ANJWA_SUBJECT_GUIDE||{},records=buildCatalogue(root.ANJWA_CURRICULUM_DATA||{},guide,root.ANJWA_COURSE_DESIGNER||{}),params=new URLSearchParams(root.location.search);
 const query=$('libraryQuery'),area=$('libraryArea'),offering=$('libraryOffering'),revision=$('libraryRevision'),results=$('libraryResults'),dialog=$('libraryDialog');let lastTrigger=null;

 if(!records.some(r=>r.revision==='대표'))revision.querySelector('option[value="대표"]')?.remove();
 if(params.get('from')==='curriculum'){
  $('libraryHome').textContent='학교 편성표로';$('libraryHome').href='./index.html#curriculum';
  $('libraryHome').addEventListener('click',event=>{
   if(!doc.referrer||root.history.length<2)return;
   const previous=new URL(doc.referrer);
   if(previous.origin===root.location.origin&&['/','/index.html'].includes(previous.pathname)){event.preventDefault();root.history.back();}
  });
 }else if(params.get('dept')==='military')$('libraryHome').href='./index.html#military';
 for(const value of [...new Set(records.map(r=>r.area))].sort((a,b)=>a.localeCompare(b,'ko'))){const option=doc.createElement('option');option.value=value;option.textContent=value;area.append(option);}
 const restored=readSearchState(params,records);query.value=restored.query;area.value=restored.area;offering.value=restored.offering;revision.value=restored.revision;
 $('libraryScope').textContent=`2022 개정 보통교과 155과목 + 기존 대표·학교 과목`;
 function render(){
  const state={query:query.value,area:area.value,offering:offering.value,revision:revision.value};
  const matches=filterCatalogue(records,state),activeFilters=[state.area,state.offering,state.revision].filter(value=>value!=='all').length;
  $('libraryFilterSummary').textContent=activeFilters?`필터 ${activeFilters}개 적용 · 변경하기`:'교과군·학교 편성·안내 구분 필터';
  $('libraryReset').hidden=!state.query.trim()&&!activeFilters;
  const url=new URL(root.location.href);url.search=searchStateParams(url.searchParams,state).toString();
  root.history.replaceState(root.history.state,'',url.href);
  $('libraryCount').textContent=`전체 ${records.length}개 안내 중 ${matches.length}개`;
  results.innerHTML=matches.length?matches.map(r=>`<article class="library-card"><div class="library-card-title"><h2>${esc(r.name)}</h2><span>${esc(revisionLabel(r.revision))}</span></div><p class="library-card-meta">${esc(r.area)} · ${r.offerings.length?'학교 편성표에 있음':'학교 편성표에 없음'}</p><p>${esc(r.profile.learning)}</p><button class="library-button" type="button" data-subject-id="${esc(r.id)}" aria-label="${esc(r.name+' '+r.revision+' 과목 설명')}">과목 설명·학과 연결 보기 →</button></article>`).join(''):'<p class="library-empty">일치하는 과목이 없습니다. 검색어를 줄이거나 교과군·편성 필터를 전체로 바꿔 보세요.</p>';
 }
 function detail(record,trigger){
  const p=record.profile;lastTrigger=trigger;$('libraryDialogTitle').textContent=record.name;
  const offerings=[...new Set(record.offerings.map(o=>`${o.department} · ${o.cohort} 입학생${o.online?' · 학교 편성 온라인':''}`))];
  $('libraryDetail').innerHTML=`<p class="library-card-meta">${esc(record.area)} · ${esc(revisionLabel(record.revision))}</p>${p.exploratory?`<p class="library-scope">학교 수업계획을 확인하기 위한 과목명 기반 탐색 안내입니다.</p>`:""}<section><h3>무엇을 배우나요</h3><p>${esc(p.learning)}</p></section>${p.learningTopics?.length?`<section><h3>${p.exploratory?"학습 주제 · 예시":"주요 학습 내용"}</h3><ul>${p.learningTopics.map(t=>`<li>${esc(t)}</li>`).join('')}</ul></section>`:''}${p.majorConnections?.length?`<section><h3>학과와 이렇게 연결돼요</h3>${p.majorConnections.map(m=>`<article class="library-major"><strong>${esc(m.major)}</strong><p>${esc(m.reason)}</p></article>`).join('')}<small>${esc(p.majorBasis)}입니다. 대학의 필수·권장 지정은 별도 확인하세요.</small></section>`:''}${p.relatedMajors?.some(m=>!p.majorConnections?.some(c=>c.major===m))?`<details><summary>다른 관련 전공</summary><p>${p.relatedMajors.filter(m=>!p.majorConnections?.some(c=>c.major===m)).map(esc).join(' · ')}</p></details>`:''}${p.militaryConnections?.length?`<section><h3>부사관 진로와 연결해 보기</h3>${p.militaryConnections.map(m=>`<article class="library-major"><strong>${esc(m.role)}</strong><p>${esc(m.reason)}</p></article>`).join('')}<small>특기 배정이나 임용 요건을 뜻하지 않습니다.</small></section>`:''}${p.activities?.length?`<section><h3>학습 활동 · 예시</h3><ul>${p.activities.map(t=>`<li>${esc(t)}</li>`).join('')}</ul></section>`:''}<section><h3>학교 편성·학습 경로</h3><p>${offerings.length?offerings.map(esc).join('<br>'):'수록된 학교 편성표에 없는 과목입니다.'}</p><p>공동교육과정·온라인학교·학교 밖 교육·방과후 수업의 개설과 수강 자격은 담당 선생님과 확인하세요. 이 안내만으로 수강 가능 여부나 학점 인정을 확정하지 않습니다.</p></section><details><summary>자료 출처 · 안내 기준</summary>${p.sourceUrl?`<p><a href="${esc(p.sourceUrl)}" target="_blank" rel="noopener noreferrer">${esc(p.sourceLabel||'네이버 에듀 · 제공 윈드폴리')} ↗</a> · 확인 ${esc(p.sourceCheckedAt)}. ${esc(p.sourceNote||'설명은 자료를 참고해 재작성했으며 학과 연결 이유와 활동은 앱의 해석·제안입니다.')}</p>`:`<p>${esc(p.sourceLabel||'학교 제공 편성표와 기존 대표 과목 안내')}</p><p>${esc(p.sourceNote||'해당 교육과정과 수업 계획에서 상세 내용을 확인하세요.')}</p>`}${p.scopeNote?`<p>${esc(p.scopeNote)}</p>`:''}</details>`;
  dialog.showModal();$('libraryClose').focus({preventScroll:true});dialog.scrollTop=0;
 }
 $('librarySearchForm').addEventListener('submit',event=>{event.preventDefault();render();query.blur();$('libraryCount').focus({preventScroll:true});});query.addEventListener('input',render);for(const element of [area,offering,revision])element.addEventListener('change',render);
 results.addEventListener('click',event=>{const button=event.target.closest('[data-subject-id]');if(button){const record=records.find(r=>r.id===button.dataset.subjectId);if(record)detail(record,button);}});
 $('libraryClose').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>lastTrigger?.focus({preventScroll:true}));dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}});
 $('libraryReset').addEventListener('click',()=>{query.value='';area.value='all';offering.value='all';revision.value='all';render();query.focus({preventScroll:true});});
 render();
}
root.document.addEventListener('DOMContentLoaded',mount,{once:true});
})(typeof window==='object'?window:globalThis);
