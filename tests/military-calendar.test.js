'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const C=require('../military-calendar.js'),D=require('../military-calendar-data.js');
const fixed='2026-11-11';const state=(value={},branch='all')=>C.normalize(value,D,branch,fixed);
test('calendar dates are strict, Gregorian and Asia/Seoul based',()=>{
 assert.equal(C.date('2027-02-29'),null);assert.equal(C.date('2026-13-01'),null);assert.equal(C.date('2026-2-01'),null);
 assert.equal(C.monthDays('2027-02').length,28);assert.equal(C.shiftMonth('2026-12',1),'2027-01');assert.equal(C.seoulToday(new Date('2026-11-10T16:00:00Z')),fixed);
});
test('calendar schema rejects invalid dates, duplicate ids and invented unknown-course dates',()=>{
 assert.deepEqual(C.validateData(D),[]);
 for(const bad of [ {...D,events:[...D.events,{...D.events[0],id:'bad',start:'2027-02-30'}]}, {...D,events:[...D.events,D.events[0]]}, {...D,events:[...D.events,{...D.events[0],id:'bad',course:'navy-general'}]}])assert.ok(C.validateData(bad).length);
});
test('individual SW268 dates supersede the conflicting annual notice and keep civilian entry distinct',()=>{
 const list=D.events.filter(e=>e.course==='sw268'),find=kind=>list.find(e=>e.kind===kind);
 assert.equal(find('apply').start,'2026-10-12');assert.equal(find('apply').end,'2026-11-29');assert.equal(find('fitness').start,'2027-02-22');
 assert.equal(find('entry').start,'2027-05-10');assert.equal(find('commission').start,'2027-09-01');assert.equal(list.some(e=>e.kind==='written'),false);
});
test('duration events include endpoints and intersect all months over the year boundary',()=>{
 const event=D.events.find(e=>e.course==='sw268'&&e.kind==='medical');
 assert.ok(C.overlap(event,'2026-12-31','2026-12-31'));assert.ok(C.overlap(event,'2027-01-29','2027-01-29'));assert.equal(C.overlap(event,'2027-01-30','2027-01-30'),false);
});
test('course, branch, stage and annual/individual filters compose without crossing pathways',()=>{
 assert.equal(C.filtered(D,state({kind:'written'}),'airforce').length,1);
 assert.equal(C.filtered(D,state({course:'sart256',kind:'written'}),'airforce').length,0);
 assert.ok(C.filtered(D,state({level:'annual'})).every(e=>D.courses.find(c=>c.id===e.course).level==='annual'));
 assert.equal(C.filtered(D,state({course:'navy-general'}),'navy').length,0);
 assert.equal(C.filtered(D,state({course:'mc-pre2',kind:'entry'}),'marines').length,0);
});
test('restored filter values cannot bypass service/date validation and empty state is explicit',()=>{
 const p=state({course:'sw268',month:'2030-01',day:'2026-11-31',kind:'constructor',level:'verified'},'navy');
 assert.equal(p.course,'all');assert.equal(p.month,'2026-11');assert.equal(p.day,fixed);assert.equal(p.kind,'all');assert.equal(p.level,'all');
 const html=C.renderContent(D,state({course:'navy-general'}),'navy',fixed);assert.match(html,/날짜 미확인/);assert.match(html,/모집이 없다는 뜻은 아닙니다/);assert.doesNotMatch(html,/undefined|NaN/);
});
test('calendar renders every day, accessible selected/today states, escaped text and safe source links',()=>{
 const p=state();const html=C.renderContent(D,p,'all',fixed);assert.equal((html.match(/data-calendar-day=/g)||[]).length,30);assert.match(html,/aria-current="date"/);assert.match(html,/2026-11-11[^>]*aria-pressed="true"/);
 const copy=JSON.parse(JSON.stringify(D));copy.courses[0].name='<script>bad</script>';const escaped=C.renderContent(copy,p,'all',fixed);assert.doesNotMatch(escaped,/<script>/);assert.match(escaped,/&lt;script&gt;/);
 assert.ok([...html.matchAll(/<a\b[^>]+>/g)].every(m=>m[0].includes('rel="noopener noreferrer"')&&m[0].includes('href="https://')));
});
test('blocked storage preserves interactivity and never changes student/teacher records',()=>{
 const values=new Map([['student','original'],['teacher','session']]),events={},root={innerHTML:''};
 const host={document:{addEventListener:(k,fn)=>events[k]=fn,getElementById:id=>id==='military-calendar-root'?root:null,querySelector:()=>null},localStorage:{getItem:()=>null,setItem(key){assert.equal(key,C.storageKey);throw Error('blocked')}}};
 const api=C.mount(host,D);api.renderPage('army');
 const target={dataset:{calendarPref:'month'},value:'2027-01',id:'cal-month',closest:s=>s==='[data-calendar-pref]'?target:null};events.change({target});assert.match(root.innerHTML,/2027-01/);assert.match(root.innerHTML,/선택을 저장할 수 없습니다/);assert.deepEqual([...values.values()],['original','session']);
});
test('UDT and SSU use the amended 296th notice without inventing practical evaluation dates',()=>{
 for(const id of ['udt','ssu']){
  const course=D.courses.find(c=>c.id===id),events=D.events.filter(e=>e.course===id),get=kind=>events.find(e=>e.kind===kind);
  assert.equal(course.level,'individual');assert.match(course.source,/1523182/);assert.match(course.name,/296/);assert.equal(events.length,8);
  assert.equal(get('apply').end,'2026-10-16');assert.match(get('apply').note,/17:00/);
  assert.equal(get('interview').start,'2026-12-07');assert.equal(get('interview').end,'2026-12-18');
  assert.equal(get('entry').start,'2027-03-15');assert.equal(get('commission').start,'2027-05-14');
  assert.match(course.unknown,/실기평가는 별도/);assert.equal(C.filtered(D,state({course:id,kind:'fitness'}),'navy').length,0);
  assert.equal(C.filtered(D,state({course:id,kind:'medical'}),'navy').length,1);
 }
});
test('marine reconnaissance uses its own 26-2 notice and mixed-stage filters without borrowing general dates',()=>{
 const c=D.courses.find(c=>c.id==='recon'),events=D.events.filter(e=>e.course==='recon'),get=kind=>events.find(e=>e.kind===kind);
 assert.equal(c.level,'individual');assert.match(c.source,/rokmc\.mil\.kr/);assert.equal(events.length,7);
 assert.equal(get('apply').start,'2026-08-31');assert.equal(get('apply').end,'2026-09-28');
 assert.equal(get('entry').start,'2026-12-14');assert.equal(get('commission').start,'2027-02-26');
 for(const kind of ['interview','fitness','medical']){const selected=C.filtered(D,state({course:'recon',kind}),'marines');assert.equal(selected.length,1);assert.equal(selected[0].start,'2026-10-06');assert.equal(selected[0].end,'2026-10-23');}
 assert.equal(C.filtered(D,state({course:'recon',kind:'written'}),'marines').length,0);
 const bad={...D,events:[...D.events,{...events[0],id:'bad',alsoKinds:['constructor']}]};assert.ok(C.validateData(bad).length);
 assert.equal(D.events.length,74);
});
