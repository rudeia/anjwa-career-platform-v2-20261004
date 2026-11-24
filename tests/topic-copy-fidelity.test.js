'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const c={window:{}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'..','topic-data.js'),'utf8'),c);
const topic=id=>c.window.ANJWA_TOPIC_DATA.topics.find(t=>t.id===id);
test('AI score activities keep the supplied threshold, observed findings and synthetic-data scope',()=>{
 const t=topic('info-ai-error');assert.match(t.method,/정해진.*임계값/);assert.doesNotMatch(t.method,/정답으로 분류할/);assert.match(t.method,/가상/);assert.match(t.output,/확인한 점/);assert.match(t.output,/추가로 필요한/);
});
test('writing deliverables retain sources, agreement records and reasons for classification',()=>{
 assert.match(topic('kor-reading-argument').output,/출처/);
 assert.match(topic('kor-media-language').output,/분류 기준표/);assert.match(topic('kor-media-language').output,/일치·불일치/);
 assert.match(topic('edu-feedback-learning').output,/분류와 그 이유/);
});
test('sensitivity results and measurement-error analysis remain required deliverables',()=>{
 assert.match(topic('geo-medical-access').method,/비중을 바꾼.*표시/);
 assert.match(topic('science-salt-g2').output,/오차/);assert.match(topic('science-salt-g2').output,/편차/);
});
