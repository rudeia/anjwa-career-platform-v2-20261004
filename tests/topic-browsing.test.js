'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
function setup(){
 const elements=new Map(),handlers=new Map(),focus=[];
 const node=key=>{if(!elements.has(key))elements.set(key,{value:key==='#topicSearch'?'':'all',innerHTML:'',textContent:'',addEventListener(event,fn){handlers.set(key+':'+event,fn)},querySelectorAll(){return Array.from({length:200},()=>({dataset:{topicId:'test'},querySelector(){return{open:false}},focus(){focus.push('focus')},scrollIntoView(){focus.push('scroll')}}))}});return elements.get(key)};
 const c={window:{},console,document:{addEventListener(){},querySelector:node,querySelectorAll(){return[]}}};
 for(const file of ['curriculum-data.js','student-data-model.js','topic-data.js','app.js'])vm.runInNewContext(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),c);
 return{run:source=>vm.runInNewContext(source,c),node,handlers,focus};
}
const cardCount=html=>(html.match(/class="topic-card"/g)||[]).length;
test('all exploration topics can be reached with more, rather than stopping permanently at eighteen',()=>{
 const {run,node,handlers,focus}=setup();run('bindTopicExplorerControls();renderTopicExplorer()');
 const total=run('getTopicRecords().length');assert.ok(total>79);
 assert.equal(cardCount(node('#topicResultList').innerHTML),18);assert.match(node('#topicResultList').innerHTML,/data-topic-more/);
 while(cardCount(node('#topicResultList').innerHTML)<total)handlers.get('#topicResultList:click')({target:{closest:()=>({})}});
 assert.equal(cardCount(node('#topicResultList').innerHTML),total);assert.doesNotMatch(node('#topicResultList').innerHTML,/data-topic-more/);
 assert.ok(focus.includes('focus'));assert.ok(focus.includes('scroll'));
 node('#topicSearch').value='자료';handlers.get('#topicSearch:input')({target:node('#topicSearch')});assert.equal(run('state.topicVisibleLimit'),36);
 node('#topicSearch').value='';handlers.get('#topicSearch:input')({target:node('#topicSearch')});assert.equal(cardCount(node('#topicResultList').innerHTML),18);
});
test('source references and limitations remain accessible, while deliverables precede the preparation details',()=>{
 const {run}=setup();
 const html=run(`renderTopicCard({area:'국어',subject:'국어',title:'근거 비교',question:'어떤 근거인가요?',method:'두 글을 비교합니다.',output:'근거 비교표',limits:'두 글의 비교에 한정됩니다.',reference:{title:'<자료>',pages:'15쪽',note:'본문을 참고한 수업 제안입니다.'}})`);
 assert.ok(html.indexOf('남길 결과물')<html.indexOf('<details'));
 assert.match(html,/두 글의 비교에 한정됩니다/);assert.match(html,/참고한 자료/);assert.match(html,/&lt;자료&gt; · 15쪽/);assert.doesNotMatch(html,/<자료>/);
});
test('subject popups retain the same comparison criteria as the exploration list',()=>{
 const profile=require('../subject-profile.js');
 const activity={title:'축척 모형 비교',question:'조건에 따라 무엇이 달라지나요?',method:'치수를 기록합니다.',materials:'모눈종이',measure:'가상 치수·축척·배치·통로 조건',output:'비교표',limits:'가상 조건에서 비교합니다.'};
 const html=profile.renderContext({activityGuides:[activity]});
 assert.ok(html.includes(activity.measure));assert.ok(html.includes(activity.limits));assert.ok(html.includes(activity.materials));
});
