'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {combineTopicData}=require('../topic-data-loader.js');
const root=path.join(__dirname,'..'),loader=fs.readFileSync(path.join(root,'topic-data-loader.js'),'utf8');
function freeze(value){if(value&&typeof value==='object'){Object.freeze(value);for(const item of Object.values(value))freeze(item);}return value;}
test('baseline metadata and ordering survive merging two extension collections',()=>{
 const base={updated:'2026.10.04',note:'자료와 범위를 확인합니다.',researchSources:{study:{title:'연구'}},topics:[{id:'base',title:'기존'}]};
 const result=combineTopicData(base,{topics:[{id:'stem',title:'과학'}]},{topics:[{id:'arts',title:'예술'}]});
 assert.deepEqual(result.topics.map(t=>t.id),['base','stem','arts']);
 assert.equal(result.updated,base.updated);assert.equal(result.note,base.note);assert.deepEqual(result.researchSources,base.researchSources);
 assert.notEqual(result,base);assert.notEqual(result.topics,base.topics);
});
test('duplicate IDs are excluded without throwing and the earliest reviewed entry wins',()=>{
 const result=combineTopicData({topics:[{id:'one',title:'기존'},{id:'one',title:'기존 중복'}]},
  {topics:[{id:'one',title:'확장 중복'},{id:'two',title:'첫 확장'},{id:'two',title:'중복'}]},
  {topics:[{id:'two',title:'뒤의 확장'},{id:'three',title:'세 번째'}]});
 assert.deepEqual(result.topics.map(t=>[t.id,t.title]),[['one','기존'],['two','첫 확장'],['three','세 번째']]);
 assert.deepEqual(combineTopicData(result,{topics:[{id:'three',title:'재로딩'}]}),result);
});
test('frozen source objects and nested activity fields remain unchanged even if the combined copy is edited',()=>{
 const base=freeze({topics:[{id:'base',keywords:['기존'],reference:{title:'출처',pages:'1쪽'},steps:['한 단계']}]});
 const extension=freeze({topics:[{id:'new',materials:{items:['종이']},grades:[1,2]}]});
 const before=JSON.stringify([base,extension]),combined=combineTopicData(base,extension);
 combined.topics[0].title='새 표시';combined.topics[0].keywords.push('추가');combined.topics[0].reference.pages='다른 쪽';combined.topics[0].steps[0]='수정';
 combined.topics[1].materials.items.push('연필');combined.topics[1].grades.pop();combined.topics.pop();
 assert.equal(JSON.stringify([base,extension]),before);
});
test('missing optional collections and malformed entries cannot break the topic list',()=>{
 assert.deepEqual(combineTopicData(undefined,null,{topics:null}),{topics:[]});
 const result=combineTopicData({note:'유지',topics:[null,{},false,{id:''},{id:'   '},{id:5},{id:'ok',title:'정상'}]},undefined,{topics:'not an array'},[{id:'array',title:'배열 확장'}]);
 assert.equal(result.note,'유지');assert.deepEqual(result.topics.map(t=>t.id),['ok','array']);
});
test('browser loading publishes one combined object while retaining the original collections',()=>{
 const base={note:'원본',topics:[{id:'base',title:'원본'}]},stem={topics:[{id:'stem'},{id:'base',title:'중복'}]},arts={topics:[{id:'arts'}]};
 const c={window:{ANJWA_TOPIC_DATA:base,ANJWA_TOPIC_STEM_SOCIETY_DATA:stem,ANJWA_TOPIC_EXTENSION_DATA:arts}};
 const before=JSON.stringify([base,stem,arts]);vm.runInNewContext(loader,c);
 assert.equal(typeof c.window.AnjwaTopicDataLoader.combineTopicData,'function');
 assert.equal(JSON.stringify(c.window.ANJWA_TOPIC_DATA.topics.map(t=>t.id)),JSON.stringify(['base','stem','arts']));
 assert.notEqual(c.window.ANJWA_TOPIC_DATA,base);assert.equal(JSON.stringify([base,stem,arts]),before);
 vm.runInNewContext(loader,c);assert.equal(c.window.ANJWA_TOPIC_DATA.topics.length,3);
});
test('an early browser load exposes the API without replacing an absent baseline',()=>{
 const c={window:{ANJWA_TOPIC_EXTENSION_DATA:{topics:[{id:'optional'}]}}};vm.runInNewContext(loader,c);
 assert.equal(c.window.ANJWA_TOPIC_DATA,undefined);assert.equal(typeof c.window.AnjwaTopicDataLoader.combineTopicData,'function');
});
test('the real baseline and arts extension remain intact and all unique topic IDs are reachable',()=>{
 const c={window:{}};
 for(const file of ['topic-data.js','topic-arts-language-data.js'])vm.runInNewContext(fs.readFileSync(path.join(root,file),'utf8'),c);
 const baseline=c.window.ANJWA_TOPIC_DATA,arts=c.window.ANJWA_TOPIC_EXTENSION_DATA;
 const before=JSON.stringify([baseline,arts]),result=combineTopicData(baseline,undefined,arts);
 const ids=[...baseline.topics,...arts.topics].map(t=>t.id),expected=[...new Set(ids)];
 assert.deepEqual(result.topics.map(t=>t.id),expected);assert.equal(JSON.stringify([baseline,arts]),before);
 assert.equal(result.topics.length,baseline.topics.length+arts.topics.length);
 for(const original of baseline.topics)assert.equal(JSON.stringify(result.topics.find(t=>t.id===original.id)),JSON.stringify(original));
});
