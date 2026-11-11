const {test}=require('node:test');
const assert=require('node:assert/strict');
const {subjectUrl,subjectLink}=require('../edu-resources.js');
test('verified subject links distinguish school-specific and old curriculum subjects',()=>{
 assert.equal(subjectUrl('생태와 환경'),'https://edu.naver.com/subjects-guide/subjects/XE87B6J0ZX');
 assert.equal(subjectUrl('(온) 공통국어1'),subjectUrl('공통국어1'));
 for(const name of ['군대윤리','(고시외) 생태와 환경','국어','<script>','constructor','toString']) assert.equal(subjectUrl(name),null);
 assert.equal(subjectLink('군대윤리'),'');
 assert.match(subjectLink('생태와 환경'),/noopener noreferrer/);
});
