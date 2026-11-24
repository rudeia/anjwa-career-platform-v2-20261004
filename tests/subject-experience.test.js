'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..');
const files=['curriculum-data.js','subject-guide-data.js','subject-detail-data.js','subject-supplement-data.js','subject-classroom-data.js','course-designer-data.js','topic-data.js','topic-stem-society-data.js','topic-arts-language-data.js','topic-data-loader.js','recommendation-data.js','university-recommendation-data.js','subject-profile.js','subject-overview-core-data.js','subject-overview-science-society-data.js','subject-overview-applied-data.js','subject-overview.js','subject-experience.js','subject-library.js'];
function fixture(){
 const context={window:{},URL};
 for(const file of files)vm.runInNewContext(fs.readFileSync(path.join(root,file),'utf8'),context);
 const w=context.window;
 const records=w.AnjwaSubjectLibrary.buildCatalogue(w.ANJWA_CURRICULUM_DATA,w.ANJWA_SUBJECT_GUIDE,w.ANJWA_COURSE_DESIGNER);
 return {w,records,api:w.AnjwaSubjectExperience};
}
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const count=(html,text)=>html.split(text).length-1;
test('all 250 enriched profiles render with the complete 144-topic collection and retain every available activity field',()=>{
 const {w,records,api}=fixture();
 assert.equal(records.length,250);assert.equal(w.ANJWA_TOPIC_DATA.topics.length,144);
 const before=JSON.stringify([w.ANJWA_TOPIC_DATA,w.ANJWA_SUBJECT_GUIDE,w.ANJWA_SUBJECT_CLASSROOM_PLANS]);
 const originalById=new Map(w.ANJWA_TOPIC_DATA.topics.map(topic=>[topic.id,topic]));
 const linked=new Set();let renderedActivities=0,criteria=0,procedures=0;
 for(const record of records){
  const guide=record.profile,html=api.render({course:record,guide});
  if(w.AnjwaSubjectOverview.basis(record,guide).status!=='official-curriculum'&&!w.AnjwaSubjectOverview.basis(record,guide).references?.length)assert.ok(html.includes(esc(guide.learning)),record.id+' exploratory learning');
  assert.doesNotMatch(html,/\bundefined\b|\[object Object\]/,record.id);
  for(const activity of api.activityList(guide)){
   renderedActivities++;
   for(const key of ['title','question','output','limits']){assert.ok(activity[key],record.id+' required:'+key);assert.ok(html.includes(esc(activity[key])),record.id+':'+activity.id+':'+key);}
   const original=originalById.get(activity.id);
   if(original)for(const key of ['question','materials','preparation','measure','method','steps','output','limits','reference'])assert.equal(JSON.stringify(activity[key]),JSON.stringify(original[key]),record.id+' source preservation:'+key);
   const materials=activity.materials||activity.preparation;
   assert.ok(materials&&html.includes(esc(materials)),record.id+' materials');
   if(activity.measure){assert.ok(html.includes(esc(activity.measure)),record.id+' criteria');criteria++;}
   if(activity.method)assert.ok(html.includes(esc(activity.method)),record.id+' method');
   if(activity.steps?.length){procedures++;for(const step of activity.steps)assert.ok(html.includes(esc(step)),record.id+' step');}
   else assert.ok(activity.method,record.id+' procedure must have a method or steps');
   for(const key of ['reflection','resultPrompt','nextStep'])if(activity[key])assert.ok(html.includes(esc(activity[key])),record.id+':'+key);
   if(activity.id)linked.add(activity.id);
   if(activity.reference)for(const key of ['title','pages','note'])if(activity.reference[key])assert.ok(html.includes(esc(activity.reference[key])),record.id+' reference:'+key);
   if(activity.basis)assert.ok(html.includes(esc(activity.basis)),record.id+' inherited classroom basis');
   if(activity.matchNote)assert.ok(html.includes(esc(activity.matchNote)),record.id+' related subject scope');
   if(activity.gradeBasis)assert.ok(html.includes(esc(activity.gradeBasis)),record.id+' grade basis');
   if(activity.exampleStatus)assert.ok(html.includes(esc(activity.exampleStatus)),record.id+' example status');
   if(activity.researchConnection)assert.ok(html.includes(esc(activity.researchConnection)),record.id+' research transfer explanation');
   for(const source of activity.researchSources||[]){
    for(const key of ['title','verificationLevel','transferLimit'])if(source[key])assert.ok(html.includes(esc(source[key])),record.id+' research:'+key);
   }
  }
 }
 assert.equal(linked.size,144);assert.ok(renderedActivities>=144&&criteria>=144&&procedures>22);
 assert.equal(JSON.stringify([w.ANJWA_TOPIC_DATA,w.ANJWA_SUBJECT_GUIDE,w.ANJWA_SUBJECT_CLASSROOM_PLANS]),before);
});
test('classroom source basis and school-specific limitations survive in the new experience',()=>{
 const {records,api}=fixture();let classroomCount=0;
 for(const record of records.filter(r=>r.profile.classroomPlan)){
  classroomCount++;const guide=record.profile,activities=api.activityList(guide),html=api.render({course:record,guide});
  for(const activity of activities.slice(0,guide.classroomPlan.activityPlans.length))assert.equal(activity.basis,guide.classroomPlan.basis);
  assert.ok(html.includes(esc(guide.classroomPlan.basis)),record.id);
 }
 assert.equal(classroomCount,22);
 const military=records.find(r=>r.id==='2022:군리더십(광주)'),html=api.render({course:military,guide:military.profile});
 assert.match(html,/지역 승인 과목의 성취기준이나 실제 수업계획을 확인하지 않았습니다/);
 assert.match(html,/특기 배정이나 임용 요건을 뜻하지 않습니다/);
 const fallback=api.render({course:{name:'예시'},guide:{learning:'설명',activityGuides:[{title:'자료',question:'질문',method:'방법',output:'결과',limits:'범위',gradeBasis:'선수 개념 확인',exampleStatus:'앱의 제안'}]}});
 assert.match(fallback,/참고 자료와 활동 범위/);assert.match(fallback,/선수 개념 확인/);assert.match(fallback,/앱의 제안/);
});
test('activity deduplication and onlyUniversity prevent an activity appearing twice in the subject experience',()=>{
 const {w,api}=fixture(),guide={learning:'기본 학습 설명',majorConnections:[{major:'전공',reason:'전공 이유'}],
  classroomPlan:{learningBridge:'고유 학습 연결',basis:'학교 계획이 아닌 앱의 제안',careerConnections:[],activityPlans:[{title:'고유 활동',question:'같은 질문',materials:'자료',steps:['구체적으로 비교합니다.'],output:'고유 산출물',limits:'정해진 범위'}]},
  activityGuides:[{title:'고유  활동',question:'같은 질문',materials:'다른 자료',method:'중복 방법',output:'중복 산출물',limits:'다른 범위'},{title:'별도 활동',question:'다른 질문',materials:'별도 자료',method:'별도 방법',output:'별도 산출물',limits:'별도 범위'}],
  careerPaths:[{name:'고유 관심 분야',reason:'관심 이유',majors:[]}],
  universityEvidence:[{university:'검증 대학',department:'검증 학과',matchedSubject:'과목',admissionYear:'2028',note:'함께 읽을 조건'}]};
 assert.equal(api.activityList(guide).length,2);
 const only=w.AnjwaSubjectProfile.renderContext(guide,{onlyUniversity:true});
 assert.match(only,/검증 대학/);assert.match(only,/함께 읽을 조건/);
 assert.doesNotMatch(only,/고유 활동|별도 활동|고유 산출물|고유 관심 분야|고유 학습 연결/);
 const html=api.render({course:{name:'과목'},guide});
 assert.equal(count(html,'<h4>고유 활동</h4>'),1);assert.equal(count(html,'<h4>별도 활동</h4>'),1);
 assert.equal(count(html,'고유 학습 연결'),1);assert.equal(count(html,'검증 대학'),1);
 assert.doesNotMatch(html,/중복 방법|중복 산출물/);
});
test('untrusted descriptions and source labels are escaped and unsafe source URLs never become links',()=>{
 const {api}=fixture(),bad='<img src=x onerror="alert(1)">',guide={learning:bad,learningTopics:[bad],conceptExplanation:bad,sourceLabel:bad,sourceUrl:'javascript:alert(1)',sourceNote:bad,
  majorConnections:[{major:bad,reason:bad}],militaryConnections:[{role:bad,reason:bad}],relatedSubjects:[bad],
  activityGuides:[{title:bad,question:bad,method:bad,materials:bad,measure:bad,steps:[bad],output:bad,limits:bad,reflection:bad,nextStep:bad,gradeBasis:bad,exampleStatus:bad,
   reference:{title:bad,pages:bad,note:bad},researchConnection:bad,researchSources:[{authors:bad,year:'2026',title:bad,url:'javascript:alert(1)',verificationLevel:bad,transferLimit:bad}],
   worksheet:{url:'javascript:alert(1)',label:bad}}]};
 const html=api.render({course:{name:bad,area:bad,category:bad},guide});
 assert.ok(html.includes(esc(bad)));assert.doesNotMatch(html,/<img|<script|href="javascript:|onerror="alert/);
 assert.doesNotMatch(html,/class="subject-experience-resource"/);
 const safe=api.render({course:{name:'과목'},guide:{learning:'설명',sourceUrl:'https://example.com/?a=1&b=2',sourceLabel:'공개 자료'}});
 assert.match(safe,/href="https:\/\/example.com\/\?a=1&amp;b=2"/);assert.match(safe,/rel="noopener noreferrer"/);
});
function fakeDOM(){
 const keys=['overview','activities','school'],focus=[];
 const dialog={scrollTop:77},scope={};
 const tabs=keys.map(key=>({dataset:{subjectTab:key},attributes:{},tabIndex:-1,
  setAttribute(name,value){this.attributes[name]=value;},focus(options){focus.push({key,options});},
  closest(selector){if(selector==='.subject-experience')return scope;if(selector.includes('[data-subject-tab]'))return this;return null;}}));
 const panels=keys.map(key=>({dataset:{subjectPanel:key},hidden:key!=='overview'}));
 scope.querySelectorAll=selector=>selector==='[data-subject-tab]'?tabs:selector==='[data-subject-panel]'?panels:[];
 scope.closest=selector=>selector==='.subject-info-dialog,dialog'?dialog:null;
 const handlers={click:[],keydown:[]},doc={addEventListener(name,fn){(handlers[name]||=[]).push(fn);}};
 const event=(key,target)=>({key,target,prevented:false,preventDefault(){this.prevented=true;}});
 return {scope,tabs,panels,dialog,focus,doc,handlers,event};
}
function assertSelection(dom,key){
 for(const tab of dom.tabs){const active=tab.dataset.subjectTab===key;assert.equal(tab.attributes['aria-selected'],String(active));assert.equal(tab.tabIndex,active?0:-1);}
 for(const panel of dom.panels)assert.equal(panel.hidden,panel.dataset.subjectPanel!==key);
}
test('tab markup connects three tabs and panels and begins with only overview visible',()=>{
 const {api}=fixture(),html=api.render({course:{name:'예시'},guide:{learning:'설명'}});
 assert.equal(count(html,'role="tablist"'),1);assert.equal(count(html,'role="tab"'),3);assert.equal(count(html,'role="tabpanel"'),3);
 for(const key of ['overview','activities','school']){
  assert.ok(html.includes('aria-controls="subject-panel-'+key+'"'));
  assert.ok(html.includes('aria-labelledby="subject-tab-'+key+'"'));
 }
 assert.match(html,/data-subject-panel="overview">/);assert.match(html,/data-subject-panel="activities" hidden/);assert.match(html,/data-subject-panel="school" hidden/);
});
test('activate updates selection, roving tabindex, hidden panels, focus and dialog scroll in its own scope',()=>{
 const {api}=fixture(),dom=fakeDOM(),other=fakeDOM();
 api.activate(dom.scope,'activities');assertSelection(dom,'activities');assert.equal(dom.focus.at(-1).key,'activities');assert.equal(dom.focus.at(-1).options.preventScroll,true);assert.equal(dom.dialog.scrollTop,0);
 assert.equal(other.dialog.scrollTop,77);assert.equal(other.focus.length,0);
 const focusCount=dom.focus.length;api.activate(dom.scope,'school',false);assertSelection(dom,'school');assert.equal(dom.focus.length,focusCount);
 dom.dialog.scrollTop=33;api.activate(dom.scope,'unknown');assertSelection(dom,'school');assert.equal(dom.dialog.scrollTop,33);assert.equal(dom.focus.length,focusCount);
});
test('binding once supports click, forward/backward wrapping and Home/End without handling unrelated keys',()=>{
 const {api}=fixture(),dom=fakeDOM();api.bind(dom.doc);api.bind(dom.doc);
 assert.equal(dom.handlers.click.length,1);assert.equal(dom.handlers.keydown.length,1);
 api.activate(dom.scope,'overview',false);
 for(const [from,key,to]of [['overview','ArrowRight','activities'],['activities','ArrowRight','school'],['school','ArrowRight','overview'],['overview','ArrowLeft','school'],['school','Home','overview'],['overview','End','school']]){
  const target=dom.tabs.find(t=>t.dataset.subjectTab===from),event=dom.event(key,target);dom.handlers.keydown[0](event);assert.equal(event.prevented,true);assertSelection(dom,to);assert.equal(dom.focus.at(-1).key,to);
 }
 const untouched=dom.event('ArrowDown',dom.tabs[2]),before=dom.focus.length;dom.handlers.keydown[0](untouched);assert.equal(untouched.prevented,false);assert.equal(dom.focus.length,before);assertSelection(dom,'school');
 const click=dom.event('',dom.tabs[0]);dom.handlers.click[0](click);assert.equal(click.prevented,true);assertSelection(dom,'overview');
 const open={dataset:{subjectOpenTab:'activities'},closest(selector){return selector==='.subject-experience'?dom.scope:selector.includes('[data-subject-open-tab]')?this:null;}};
 const next=dom.event('',open);dom.handlers.click[0](next);assert.equal(next.prevented,true);assertSelection(dom,'activities');
});


test('basic activity ideas remain available beside details, excluding only complete matching titles or questions',()=>{
 const {api}=fixture();
 const title='측정 자료 비교',question='표본의 범위가 평균에 영향을 줄까요?',idea='다른 표본의 평균을 직접 비교하기',hostile='<img src=x onerror="alert(1)">';
 const guide={learning:'설명',learningTopics:['자료의 범위','평균'],activities:[title,question,idea,hostile],activityGuides:[{title,question,method:'범위를 비교합니다.',materials:'공개 표',output:'비교표',limits:'표본의 범위를 밝힙니다.'}]};
 const before=JSON.stringify(guide),html=api.render({course:{name:'예시 과목'},guide});
 assert.equal(count(html,esc(title)),1);assert.equal(count(html,esc(question)),1);
 assert.match(html,/함께 살펴볼 활동 아이디어 · 2개/);
 assert.ok(html.includes('<li>'+esc(idea)+'</li>'));assert.ok(html.includes('<li>'+esc(hostile)+'</li>'));
 assert.doesNotMatch(html,/<img|onerror="alert/);
 assert.match(html,/data-subject-open-tab="activities"/);
 assert.equal(JSON.stringify(guide),before);
 const fallback=api.render({course:{name:'기본 활동 과목'},guide:{learning:'설명',activities:[idea]}});
 assert.equal(count(fallback,esc(idea)),1);assert.doesNotMatch(fallback,/함께 살펴볼 활동 아이디어/);
});

test('every stored basic activity remains reachable after the detailed activity redesign',()=>{
 const {records,api}=fixture();let restored=0;
 for(const record of records){
  const html=api.render({course:{name:record.name,area:record.area},guide:record.profile});
  for(const idea of record.profile.activities||[])assert.ok(html.includes(esc(idea)),record.id+' lost basic activity: '+idea);
  if(api.activityList(record.profile).length&&record.profile.activities?.length)restored++;
 }
 assert.ok(restored>0);
 const economics=records.find(record=>record.name==='경제 수학'&&record.revision==='2022');
 const html=api.render({course:{name:economics.name},guide:economics.profile});
 assert.ok(html.includes(esc('가격 변화에 따른 수요 모형을 함수로 비교하기')));
 assert.match(html,/함께 살펴볼 활동 아이디어/);
});
