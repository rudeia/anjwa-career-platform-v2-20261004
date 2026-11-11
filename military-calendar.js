(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root.document)root.AnjwaRecruitmentCalendar=api.mount(root,root.ANJWA_MILITARY_CALENDAR_DATA);})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const storageKey='anjwa.militaryCalendar.preferences.v1';
const kinds={all:'전체 단계',apply:'접수',written:'필기',fitness:'체력·특별평가',medical:'신체검사',documents:'서류·신원·인성',interview:'면접',result:'합격 발표',entry:'입소·입영',commission:'임관'};
const branches={army:'육군',navy:'해군',airforce:'공군',marines:'해병대'};
const levels={individual:'개별 공고',annual:'연간계획 · 변경 가능',unknown:'날짜 미확인'};
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function date(value){if(!/^\d{4}-\d{2}-\d{2}$/.test(value||''))return null;const d=new Date(value+'T00:00:00Z');return Number.isFinite(+d)&&d.toISOString().slice(0,10)===value?d:null;}
function seoulToday(now=new Date()){const p=Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now).map(x=>[x.type,x.value]));return `${p.year}-${p.month}-${p.day}`;}
function validMonth(m){return /^202[67]-(0[1-9]|1[0-2])$/.test(m||'');}
function monthDays(m){const start=date(m+'-01');if(!start)return[];const days=new Date(Date.UTC(start.getUTCFullYear(),start.getUTCMonth()+1,0)).getUTCDate();return Array.from({length:days},(_,i)=>`${m}-${String(i+1).padStart(2,'0')}`);}
function shiftMonth(m,delta){const d=date(m+'-01');if(!d||!Number.isInteger(delta))return m;d.setUTCMonth(d.getUTCMonth()+delta);return d.toISOString().slice(0,7);}
function validateData(data){
 const errors=[],courses=data?.courses||[],ids=new Set();
 for(const c of courses){if(!c.id||ids.has(c.id)||!Object.hasOwn(branches,c.branch)||!Object.hasOwn(levels,c.level)||!/^https:\/\//.test(c.source||''))errors.push('invalid course '+c.id);ids.add(c.id);}
 const events=new Set();for(const e of data?.events||[]){if(events.has(e.id)||!ids.has(e.course)||!Object.hasOwn(kinds,e.kind)||e.kind==='all'||(e.alsoKinds!==undefined&&(!Array.isArray(e.alsoKinds)||e.alsoKinds.some(k=>!Object.hasOwn(kinds,k)||k==='all')))||!date(e.start)||!date(e.end)||e.start>e.end||courses.find(c=>c.id===e.course)?.level==='unknown')errors.push('invalid event '+e.id);events.add(e.id);}return errors;
}
function normalize(value,data,branch='all',today=seoulToday()){
 const p=value&&typeof value==='object'?value:{};const month=validMonth(p.month)?p.month:validMonth(today.slice(0,7))?today.slice(0,7):'2026-11';
 return{month,day:date(p.day)&&p.day.startsWith(month)?p.day:today.startsWith(month)?today:month+'-01',course:data.courses.some(c=>c.id===p.course&&(branch==='all'||c.branch===branch))?p.course:'all',kind:Object.hasOwn(kinds,p.kind)?p.kind:'all',level:['all','individual','annual'].includes(p.level)?p.level:'all'};
}
function filtered(data,p,branch='all'){
 const courses=data.courses.filter(c=>(branch==='all'||c.branch===branch)&&(p.course==='all'||c.id===p.course)&&(p.level==='all'||c.level===p.level));const ids=new Set(courses.map(c=>c.id));
 return data.events.filter(e=>ids.has(e.course)&&(p.kind==='all'||e.kind===p.kind||e.alsoKinds?.includes(p.kind)));
}
const overlap=(e,start,end)=>e.start<=end&&e.end>=start;
const range=e=>e.start===e.end?e.start:`${e.start} ～ ${e.end}`;
function renderContent(data,p,branch,today,storageFailed=false){
 const days=monthDays(p.month),events=filtered(data,p,branch),byId=Object.fromEntries(data.courses.map(c=>[c.id,c])),visible=events.filter(e=>overlap(e,days[0],days.at(-1))).sort((a,b)=>a.start.localeCompare(b.start)||a.title.localeCompare(b.title));
 const selected=events.filter(e=>overlap(e,p.day,p.day));const courses=data.courses.filter(c=>branch==='all'||c.branch===branch);const selectedCourse=byId[p.course];
 const option=(key,label,current)=>`<option value="${esc(key)}" ${key===current?'selected':''}>${esc(label)}</option>`;
 const control=(id,label,options)=>`<label for="cal-${id}">${label}<select id="cal-${id}" data-calendar-pref="${id}">${options}</select></label>`;
 const eventItem=e=>{const c=byId[e.course];return `<li><span class="calendar-stage" data-kind="${e.kind}">${kinds[e.kind]}</span> <b>${esc(e.title)}</b><p>${esc(c.name)}</p><p><time>${range(e)}</time> · ${levels[c.level]}</p>${e.note?`<p>${esc(e.note)}</p>`:''}<a href="${esc(c.source)}" target="_blank" rel="noopener noreferrer">공고·변경 사항 확인 ↗</a></li>`;};
 return `<p class="military-muted">2026년 하반기부터 2027년 입소·임관까지 비교합니다. 날짜는 한국시간 기준입니다. 확인일 ${data.checkedAt}. 이 달력은 자동 갱신되지 않습니다. 접수 전 최신 변경 공고와 개인별 시간을 확인하세요.</p>
 <div class="calendar-filters"><label for="militaryCalendar-branch">관심 군<select id="militaryCalendar-branch" data-military-pref="branch">${option('all','전체 군',branch)}${Object.entries(branches).map(([k,v])=>option(k,v,branch)).join('')}</select></label>${control('course','모집 과정·기수',option('all','전체 과정',p.course)+courses.map(c=>option(c.id,c.name,p.course)).join(''))}${control('kind','전형 단계',Object.entries(kinds).map(([k,v])=>option(k,v,p.kind)).join(''))}${control('level','자료 구분',option('all','전체 자료',p.level)+option('individual','개별 공고만',p.level)+option('annual','연간계획만',p.level))}</div>
 ${storageFailed?'<p role="status">선택을 저장할 수 없습니다. 현재 화면에서는 계속 이용할 수 있습니다.</p>':''}
 <div class="calendar-toolbar"><button type="button" data-calendar-action="prev" ${p.month==='2026-01'?'disabled':''}>이전 달</button><label for="cal-month">조회 월<input id="cal-month" type="month" min="2026-01" max="2027-12" value="${p.month}" data-calendar-pref="month"></label><button type="button" data-calendar-action="next" ${p.month==='2027-12'?'disabled':''}>다음 달</button><button type="button" data-calendar-action="today">오늘</button></div>
 <p class="military-muted">기간 일정은 시작일부터 종료일까지 매일 표시합니다. 날짜를 누르면 그날에 걸친 일정을 볼 수 있습니다. 개인별 면접일은 표시된 기간 안에서 별도로 정해질 수 있습니다.</p>
 <div class="calendar-layout"><div class="calendar-month-pane"><div class="calendar-grid" role="group" aria-label="${p.month} 모집 일정 달력"><div class="calendar-weekdays" aria-hidden="true">${'일월화수목금토'.split('').map(x=>`<span>${x}</span>`).join('')}</div><div class="calendar-days">${'<span class="calendar-blank" aria-hidden="true"></span>'.repeat(date(days[0]).getUTCDay())}${days.map(d=>{const matches=events.filter(e=>overlap(e,d,d));const badges=[...new Set(matches.map(e=>e.kind))];return `<button type="button" data-calendar-day="${d}" aria-pressed="${d===p.day}" ${d===today?'aria-current="date"':''} aria-label="${d} ${d===today?'오늘, ':''}${matches.length}개 일정"><span>${Number(d.slice(-2))}</span><small>${matches.length?`${matches.length}건`:''}</small><span class="calendar-dots" aria-hidden="true">${badges.map(k=>`<i data-kind="${k}"></i>`).join('')}</span></button>`;}).join('')}</div></div>
 <div class="calendar-legend">${Object.entries(kinds).filter(([k])=>k!=='all').map(([k,v])=>`<span><i data-kind="${k}"></i>${v}</span>`).join('')}</div>
 </div><aside class="calendar-detail-pane"><section class="military-panel calendar-day-details" aria-labelledby="calendar-selected-title" aria-live="polite"><h2 id="calendar-selected-title">${p.day} 일정 · ${selected.length}건</h2>${selected.length?`<ul class="calendar-event-list">${selected.map(eventItem).join('')}</ul>`:'<p>선택한 날짜·필터에 표시할 일정이 없습니다. 모집이 없다는 뜻은 아닙니다. 아래 과정별 확인 상태와 공식 공고를 확인하세요.</p>'}</section>
 </aside></div><details class="military-panel"><summary>${p.month} 월간 일정 목록 · ${visible.length}건</summary>${visible.length?`<ul class="calendar-event-list">${visible.map(eventItem).join('')}</ul>`:'<p>이 달에 등록된 일정이 없습니다.</p>'}</details>
 ${selectedCourse?`<details class="military-panel calendar-course-flow"><summary>${esc(selectedCourse.name)} · 전체 전형 흐름</summary><p>${esc(selectedCourse.note)}</p><ul class="calendar-event-list">${data.events.filter(e=>e.course===p.course).sort((a,b)=>a.start.localeCompare(b.start)).map(eventItem).join('')}</ul><p><b>별도 확인</b> ${esc(selectedCourse.unknown)}</p></details>`:''}
 <details class="military-panel"><summary>과정별 일정 확인 상태</summary><p>일정이 있는 과정과 날짜를 확인하지 못한 과정을 구분합니다. 고3 응시 가능 여부도 기수별 지원 자격에서 확인하세요.</p><ul class="calendar-source-list">${courses.filter(c=>p.course==='all'||c.id===p.course).map(c=>`<li><b>${esc(c.name)}</b><span>${levels[c.level]}</span><p>${esc(c.note)}</p><p>${esc(c.unknown)}</p><a href="${esc(c.source)}" target="_blank" rel="noopener noreferrer">${esc(c.sourceLabel)} ↗</a></li>`).join('')}</ul></details>`;
}
function mount(host,data){
 if(validateData(data).length||!data)return{renderPage(){return'<p>모집 일정 자료를 확인할 수 없습니다. 공식 모집 공고를 확인하세요.</p>';}};
 let branch='all',storageFailed=false,p;const today=()=>seoulToday();try{p=normalize(JSON.parse(host.localStorage.getItem(storageKey)),data,branch,today());}catch{p=normalize(null,data,branch,today());}
 function persist(){try{host.localStorage.setItem(storageKey,JSON.stringify(p));storageFailed=false;}catch{storageFailed=true;}}
 function content(){return renderContent(data,p,branch,today(),storageFailed);}
 function update(focus){const root=host.document.getElementById('military-calendar-root');if(root)root.innerHTML=content();if(focus)host.document.getElementById(focus)?.focus({preventScroll:true});}
 host.document.addEventListener('change',event=>{const t=event.target.closest('[data-calendar-pref]');if(!t)return;const key=t.dataset.calendarPref;if(!['month','course','kind','level'].includes(key))return;p=normalize({...p,[key]:t.value},data,branch,today());persist();update(t.id);});
 host.document.addEventListener('click',event=>{
 const d=event.target.closest('[data-calendar-day]');if(d&&date(d.dataset.calendarDay)&&d.dataset.calendarDay.startsWith(p.month)){p.day=d.dataset.calendarDay;persist();update();host.document.querySelector(`[data-calendar-day="${p.day}"]`)?.focus({preventScroll:true});return;}
 const t=event.target.closest('[data-calendar-action]');if(!t)return;const action=t.dataset.calendarAction;
 if(action==='today')p=normalize({...p,month:today().slice(0,7),day:today()},data,branch,today());else if(['prev','next'].includes(action)){const m=shiftMonth(p.month,action==='prev'?-1:1);if(!validMonth(m))return;p=normalize({...p,month:m,day:m+'-01'},data,branch,today());}else return;persist();update('cal-month');});
 return{renderPage(selectedBranch){branch=Object.hasOwn(branches,selectedBranch)?selectedBranch:'all';p=normalize(p,data,branch,today());return`<div id="military-calendar-root">${content()}</div>`;}};
}
return{storageKey,kinds,date,seoulToday,monthDays,shiftMonth,validateData,normalize,filtered,overlap,renderContent,mount};
});
