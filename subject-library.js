(function(root){
'use strict';
const profileAPI=root.AnjwaSubjectProfile||(typeof require==='function'?require('./subject-profile.js'):null);
const revisionLabel=profileAPI.curriculumLabel;
const norm=s=>String(s||'').normalize('NFC').replace(/^\s*\(온\)\s*/,'').replace(/\s+/g,'').replace(/Ⅰ/g,'I').replace(/Ⅱ/g,'II').replace(/Ⅲ/g,'III');
const areaName=s=>({'기술∙가정/정보':'기술·가정/정보','기술·가정':'기술·가정/정보','교양 선택':'교양','한국사':'사회'}[s]||s||'미기재');
const clean=s=>String(s||'').replace(/^\s*\(온\)\s*/,'').trim();
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function offeringOpeningLabel(offering){
 if(/^학교\s*지정/.test(offering.section||''))return '개설 확정';
 const terms=offering.semesters||[],statuses=terms.map(term=>offering.openingStatusBySemester?.[term]||'unconfirmed');
 if(!statuses.length)return '개설 학기 확인 필요';
 if(statuses.every(status=>status==='open'))return '개설 확정';
 if(statuses.every(status=>status==='not-open'))return '미개설';
 if(statuses.every(status=>status==='unconfirmed'))return '학생선택 · 개설 확인 필요';
 return '학기별 개설 상태 다름 · '+terms.map((term,index)=>`${term.replace('-', '학년 ')}학기 ${{open:'개설 확정','not-open':'미개설',unconfirmed:'확인 필요'}[statuses[index]]||'확인 필요'}`).join(' / ');
}
function buildCatalogue(curriculum,guide,designer,context={}){
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
   record.offerings.push({department,category:course.category||'',cohort:key.slice(8),semesters:[...(course.semesters||[])],online:/^\s*\(온\)/.test(course.name),section:course.section||'',openingStatusBySemester:Object.fromEntries((course.semesters||[]).map(term=>[term,/^학교\s*지정/.test(course.section||'')?'open':course.openingStatusBySemester?.[term]||'unconfirmed']))});
  }
 }
 for(const [name,learning] of Object.entries(designer.subjectConcepts||{})){
  if([...records.values()].some(r=>norm(r.name)===norm(name)))continue;
  const id='대표:'+norm(name);records.set(id,{id,name,revision:'대표',area:'대표 과목',profile:{learning},offerings:[]});
 }
 for(const record of records.values()){const profile=profileAPI.resolve(guide,{name:record.name,subjectId:record.id},record.revision);if(profile){record.profile=profile;if(profile.area)record.area=areaName(profile.area);if(profile.curriculum?.startsWith('2015'))record.revision='2015';}}
 for(const record of records.values())record.profile=profileAPI.enrich(record.profile,{name:record.name,subjectId:record.id},{designer,...context});
 return [...records.values()].sort((a,b)=>a.name.localeCompare(b.name,'ko')||a.revision.localeCompare(b.revision));
}
function overviewPoints(record){return root.AnjwaSubjectOverview?.get?.({id:record.id,name:record.name},record.profile)||[];}
function overviewBasis(record){return root.AnjwaSubjectOverview?.basis?.({id:record.id,name:record.name},record.profile)||{status:'unverified'};}
function overviewSearchFields(record){
 const points=overviewPoints(record);
 return overviewBasis(record).status==='official-curriculum'?points:[record.profile.learning,...(record.profile.learningTopics||[]),...points];
}
function overviewPreview(record){return overviewPoints(record).slice(0,2).join(' · ')||record.profile.learning;}
function filterCatalogue(records,{query='',area='all',offering='all',revision='all'}={}){
 const words=String(query).split(/[\s,，]+/).map(norm).filter(Boolean);
 return records.filter(r=>(area==='all'||r.area===area)&&(revision==='all'||r.revision===revision)&&(offering==='all'||(offering==='school'?r.offerings.length>0:r.offerings.length===0))&&words.every(word=>norm([r.name,r.area,...overviewSearchFields(r),...(r.profile.activities||[]),...(r.profile.classroomPlan?.activityPlans||[]).flatMap(activity=>[activity.title,activity.question,activity.materials,...(activity.steps||[]),activity.output]),...(r.profile.relatedMajors||[]),...(r.profile.majorConnections||[]).flatMap(m=>[m.major,m.reason]),...(r.profile.careerPaths||[]).flatMap(p=>[p.name,p.reason,...p.majors]),...(r.profile.activityGuides||[]).flatMap(t=>[t.title,t.question,t.method,...(t.keywords||[]),...(t.majors||[])])].join(' ')).includes(word))).sort((a,b)=>{const rank=r=>norm(r.name)===norm(query)?0:norm(query)&&norm(r.name).includes(norm(query))?1:2;return rank(a)-rank(b)||a.name.localeCompare(b.name,'ko');});
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
const api={buildCatalogue,filterCatalogue,norm,readSearchState,searchStateParams,offeringOpeningLabel};if(typeof module==='object'&&module.exports)module.exports=api;root.AnjwaSubjectLibrary=api;
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
 $('libraryScope').textContent=`전체 ${records.length}개 과목 · 상세 활동 안내 ${records.filter(r=>r.profile.activityGuides?.length||r.profile.classroomPlan).length}개 · 대학·학과별 참고 과목 ${records.filter(r=>r.profile.universityEvidence?.length).length}개`;
 function render(){
  const state={query:query.value,area:area.value,offering:offering.value,revision:revision.value};
  const matches=filterCatalogue(records,state),activeFilters=[state.area,state.offering,state.revision].filter(value=>value!=='all').length;
  $('libraryFilterSummary').textContent=activeFilters?`필터 ${activeFilters}개 적용 · 변경하기`:'교과군·학교 편성·안내 구분 필터';
  $('libraryReset').hidden=!state.query.trim()&&!activeFilters;
  const url=new URL(root.location.href);url.search=searchStateParams(url.searchParams,state).toString();
  root.history.replaceState(root.history.state,'',url.href);
  $('libraryCount').textContent=`전체 ${records.length}개 안내 중 ${matches.length}개`;
  results.innerHTML=matches.length?matches.map(r=>`<article class="library-card"><div class="library-card-title"><h2>${esc(r.name)}</h2><span>${esc(revisionLabel(r.revision))}</span></div><p class="library-card-meta">${esc(r.area)} · ${r.offerings.length?'학교 편성표에 있음':'학교 편성표에 없음'}${overviewBasis(r).status==='official-curriculum'?'':' · 교육과정 원문 확인 필요'}</p><p>${esc(overviewPreview(r))}</p><button class="library-button" type="button" data-subject-id="${esc(r.id)}" aria-label="${esc(r.name+' '+r.revision+' 과목 설명')}">배우는 내용과 관련 전공 보기 →</button></article>`).join(''):'<p class="library-empty">일치하는 과목이 없습니다. 검색어를 줄이거나 교과군·편성 필터를 전체로 바꿔 보세요.</p>';
 }
 function detail(record,trigger){
  const p=record.profile;lastTrigger=trigger;$('libraryDialogTitle').textContent=record.name;
  const offerings=[...new Set(record.offerings.map(o=>`${o.department} · ${o.cohort} 입학생 · ${(o.semesters||[]).map(term=>term.replace('-', '학년 ')+'학기').join(' · ')} · ${o.section||'학교 편성'} · ${offeringOpeningLabel(o)}${o.online?' · 온라인 수강 조건 확인':''}`))];
  const course={name:record.name,area:record.area,category:[...new Set(record.offerings.map(offering=>offering.category).filter(Boolean))].join(' · ')||p.category||'',subjectId:record.id};
  const guide={...p,curriculum:p.curriculum||revisionLabel(record.revision)};
  const offeringHtml=offerings.map(offering=>`<p>${esc(offering)}</p>`).join('');
  $('libraryDetail').innerHTML=root.AnjwaSubjectExperience.render({course,guide,offeringHtml});
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
