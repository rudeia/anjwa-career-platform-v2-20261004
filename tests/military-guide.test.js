'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const G=require('../military-guide.js'),ctx={window:{}};
for(const f of ['curriculum-data.js','student-data-model.js'])vm.runInNewContext(fs.readFileSync(path.join(__dirname,'..',f),'utf8'),ctx);
const plans=ctx.window.ANJWA_STUDENT_MODEL.curriculum.militaryPlans;
function setup({blocked=false,seed=null}={}){
 const values=new Map([['anjwa-career-platform-plan-v1','existing-planner'],['anjwa.teacherDashboard.unlocked','existing-session']]);if(seed)values.set(G.storageKey,JSON.stringify(seed));
 const nodes=new Map(),events={},sent=[],focus=[];
 const get=id=>{if(!nodes.has(id))nodes.set(id,{innerHTML:'',textContent:'',focus(){focus.push(id)}});return nodes.get(id)};
 const storage={getItem:k=>values.get(k)||null,setItem(k,v){if(blocked)throw Error('blocked');values.set(k,v)}};
 const host={ANJWA_STUDENT_MODEL:{curriculum:{militaryPlans:plans}},localStorage:storage,document:{getElementById:get,addEventListener:(name,fn)=>events[name]=fn,querySelectorAll:()=>[get('notice')]},CustomEvent:class{constructor(type,{detail}){this.type=type;this.detail=detail}},dispatchEvent:event=>sent.push(event)};
 const api=G.mount(host),target=(dataset,value='',id='test-control')=>({dataset,value,id,closest(selector){const key={'[data-military-pref]':'militaryPref','[data-military-tab]':'militaryTab','[data-military-view]':'militaryView'}[selector];return key in dataset?this:null}});
 return{api,values,nodes,events,sent,focus,get,target};
}
test('preferences reject unknown branches and mixed/foreign cohorts without losing usability',()=>{
 for(const value of [{branch:'constructor',cohort:'current2027',tab:'unsafe'},null]){const p=G.normalizePreferences(value,plans);assert.equal(p.branch,'all');assert.equal(p.cohort,'incoming2026');assert.equal(p.tab,'work')}
 assert.equal(G.readPreferences({getItem(){throw Error('blocked')}},plans).branch,'all');
});
test('school links only contain actual courses from the selected military cohort',()=>{
 const a=G.schoolCourses(plans,'incoming2025',['항공드론']),b=G.schoolCourses(plans,'incoming2027',['항공드론']);assert.equal(a.length,0);assert.equal(b.length,1);assert.equal(b[0].name,'항공 드론(서울)');
 for(const p of ['incoming2025','incoming2026','incoming2027']){const list=G.schoolCourses(plans,p,['사무관리','사무행정','인사']);assert.ok(list.length);assert.ok(list.every(c=>plans[p].courses.some(x=>x.id===c.id)))}
});
test('branch/cohort changes propagate across pages, restore and leave student/teacher keys intact',()=>{
 const s=setup();s.events.change({target:s.target({militaryPref:'branch'},'airforce')});s.events.change({target:s.target({militaryPref:'cohort'},'incoming2027')});
 for(const view of G.views.filter(v=>v!=='militaryCalendar')){assert.match(s.get(view).innerHTML,/<option value="airforce" selected>/);assert.match(s.get(view).innerHTML,/<option value="incoming2027" selected>/)}
 const restored=setup({seed:JSON.parse(s.values.get(G.storageKey))});assert.match(restored.get('militaryCertificates').innerHTML,/공군 지원/);
 assert.equal(s.values.get('anjwa-career-platform-plan-v1'),'existing-planner');assert.equal(s.values.get('anjwa.teacherDashboard.unlocked'),'existing-session');
 s.events.change({target:s.target({militaryPref:'branch'},'navy')});assert.doesNotMatch(s.get('militaryCertificates').innerHTML,/공군 특기분류 기준|공군 지원/);assert.match(s.get('militaryCertificates').innerHTML,/해군 지원/);
});
test('keyboard tabs support arrows and Home/End with correct selected panel and focus',()=>{
 const s=setup(),event=key=>({key,target:s.target({militaryTab:'work'}),preventDefault(){}});
 s.events.keydown(event('ArrowRight'));assert.match(s.get('militarySpecialties').innerHTML,/id="military-ranks-tab"[^>]*aria-selected="true"/);assert.equal(s.focus.at(-1),'military-ranks-tab');
 s.events.keydown(event('Home'));assert.match(s.get('militarySpecialties').innerHTML,/id="military-work-tab"[^>]*aria-selected="true"/);assert.equal(s.focus.at(-1),'military-work-tab');
});
test('navigation passes only allowed views with the selected cohort, including dynamically rendered buttons',()=>{
 const s=setup({seed:{branch:'army',cohort:'incoming2025',tab:'work'}});s.events.click({target:s.target({militaryView:'curriculum'})});assert.equal(s.sent[0].type,'anjwa-military-navigate');assert.equal(s.sent[0].detail.cohort,'incoming2025');
 s.events.click({target:s.target({militaryView:'https://evil.invalid'})});assert.equal(s.sent.length,1);
 s.api.setCohort('incoming2027');s.events.click({target:s.target({militaryView:'militaryEntry'})});assert.equal(s.sent[1].detail.cohort,'incoming2027');
});
test('blocked preference storage still permits switching and navigation with a visible notice',()=>{
 const s=setup({blocked:true});s.events.change({target:s.target({militaryPref:'branch'},'marines')});assert.match(s.get('notice').textContent,/저장할 수 없습니다/);assert.match(s.get('militaryEntry').innerHTML,/해병대/);s.events.click({target:s.target({militaryView:'militaryCertificates'})});assert.equal(s.sent.length,1);
});
test('rendered course and cohort names are escaped and outbound sources use safe protocols and rel',()=>{
 const changed=JSON.parse(JSON.stringify(plans));changed.incoming2026.label='<img src=x onerror=alert(1)>';changed.incoming2026.courses.push({id:'fake',name:'사무 관리 (<script>malicious</script>)'});
 const html=G.renderPage('militarySpecialties',{branch:'army',cohort:'incoming2026',tab:'work'},changed);assert.ok(html.includes('&lt;img'));assert.ok(html.includes('&lt;script&gt;'));assert.doesNotMatch(html,/<script>|<img/);
 for(const v of G.views){const body=G.renderPage(v,{branch:'airforce',cohort:'incoming2027',tab:'ranks'},plans);assert.ok([...body.matchAll(/href="([^"]+)"/g)].every(m=>m[1].startsWith('https://')));assert.ok([...body.matchAll(/<a\b[^>]+>/g)].every(m=>m[0].includes('rel="noopener noreferrer"')));}
});
test('special forces routes follow the chosen service and preserve the grade-3 eligibility distinction',()=>{
 const render=branch=>G.renderPage('militarySpecialties',{branch,cohort:'incoming2027',tab:'work'},plans);
 assert.equal((render('all').match(/data-special-route=/g)||[]).length,6);
 assert.match(render('navy'),/data-special-route="udt"/);assert.match(render('navy'),/data-special-route="ssu"/);assert.doesNotMatch(render('navy'),/data-special-route="swc"/);
 assert.match(render('army'),/data-special-route="swc"/);assert.doesNotMatch(render('army'),/data-special-route="udt"/);
 assert.match(render('airforce'),/data-special-route="sart"/);assert.match(render('airforce'),/data-special-route="cct"/);assert.doesNotMatch(render('airforce'),/data-special-route="udt"/);assert.match(render('marines'),/data-special-route="recon"/);assert.match(render('all'),/모든 특수부대 모집 과정에 일괄 적용하지 않습니다/);assert.match(render('navy'),/병 모집과 부사관 모집/);
});
test('entry shortcut opens the work tab even when the rank tab was saved',()=>{
 const s=setup({seed:{branch:'navy',cohort:'incoming2027',tab:'ranks'}});
 s.events.click({target:s.target({militaryView:'militarySpecialties',militaryOpenSpecial:'true'})});
 assert.equal(s.sent[0].detail.view,'militarySpecialties');assert.equal(s.sent[0].detail.cohort,'incoming2027');assert.match(s.get('militarySpecialties').innerHTML,/id="military-work-tab"[^>]*aria-selected="true"/);
 assert.equal(s.values.get('anjwa-career-platform-plan-v1'),'existing-planner');
});
