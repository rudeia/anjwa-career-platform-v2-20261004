'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),V=require('../planner-validation.js');
const course=(id,name=id)=>({id,name,section:'학생선택',semesters:['2-1'],markers:{'2-1':'[택1] / 3'},deliveryMode:'classroom'});
const a=course('a'),b=course('b'),g={term:'2-1',count:1,courses:[a,b]};
const plan=items=>({'2':{'1':{regular:items,joint:[],additional:[]}}});
const verify=(p,courses=[a,b],groups=[g])=>V.revalidate(p,{courses},groups);
test('unchanged legacy choices get a current snapshot; repeated saves keep the same plan',()=>{
 const checked=verify(plan([{id:'a',credits:3}]));assert.equal(checked['2']['1'].regular[0].snapshot.name,'a');assert.equal(checked['2']['1'].review.length,0);assert.deepEqual(verify(checked),checked);
});
test('missing or moved choices retain their original value outside counted arrays',()=>{
 for(const courses of [[b],[{...a,semesters:['2-2']},b]]){
  const old={id:'a',name:'원래 과목',credits:3};const p=verify(plan([old]),courses);assert.equal(p['2']['1'].regular.length,0);assert.deepEqual(p['2']['1'].review[0].item,old);assert.deepEqual(verify(JSON.parse(JSON.stringify(p)),courses),p);
 }
});
test('changed credits, names, choice conditions and delivery require review without changing the original',()=>{
 const item=verify(plan([{id:'a',credits:3}]))['2']['1'].regular[0];
 for(const changed of [{...a,markers:{'2-1':'[택1] / 4'}},{...a,name:'새 과목명'},{...a,deliveryMode:'online'},{...a,creditTreatment:'separate'}]){
  const p=verify(plan([item]),[changed,b],[{...g,courses:[changed,b]}]);assert.equal(p['2']['1'].regular.length,0);assert.deepEqual(p['2']['1'].review[0].item,item);
 }
 const p=verify(plan([item]),[a,b],[{...g,count:2}]);assert.match(p['2']['1'].review[0].reasons.join(),/선택 묶음/);
 assert.equal(verify(plan([item]),[b,a],[{...g,courses:[b,a]}])['2']['1'].review.length,0);
});
test('overfull groups, duplicate zones and excessive joint credits cannot count twice',()=>{
 const p=verify(plan([{id:'a',credits:3},{id:'b',credits:3}]));assert.equal(p['2']['1'].regular.length,0);assert.equal(p['2']['1'].review.length,2);
 const d=plan([{id:'a',credits:3}]);d['2']['1'].joint=[{id:'a',credits:3}];const q=verify(d);assert.equal(q['2']['1'].joint.length,0);assert.equal(q['2']['1'].review.length,1);
 const courses=['x','y','z'].map(course),joint=plan([]);joint['2']['1'].joint=courses.map(c=>({id:c.id,credits:3}));const r=verify(joint,courses,[]);assert.equal(r['2']['1'].joint.length,0);assert.equal(r['2']['1'].review.length,3);
});
test('school-fixed choices are removed from selection totals but kept for review',()=>{
 const changed={...a,section:'학교지정',markers:{'2-1':'3'}};const p=verify(plan([{id:'a',credits:3}]),[changed],[]);assert.equal(p['2']['1'].regular.length,0);assert.match(p['2']['1'].review[0].reasons.join(),/학교지정/);
});
