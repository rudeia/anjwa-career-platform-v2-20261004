/* Subject-specific summaries: the original profiles remain the source record. */
(function(root){
'use strict';
const norm=value=>String(value||'').normalize('NFC').replace(/^\s*\(온\)\s*/,'').replace(/\s+/g,'').replace(/Ⅰ/g,'I').replace(/Ⅱ/g,'II').replace(/Ⅲ/g,'III');
function mergeCollections(...collections){
 const merged={};
 for(const collection of collections)for(const [id,points]of Object.entries(collection||{})){
  if(!Array.isArray(points)||!points.length)continue;
  if(Object.hasOwn(merged,id))throw new Error('Duplicate subject overview: '+id);
  merged[id]=Object.freeze([...points]);
 }
 return Object.freeze(merged);
}
const data=mergeCollections(root.ANJWA_SUBJECT_OVERVIEW_CORE_DATA,root.ANJWA_SUBJECT_OVERVIEW_SCIENCE_SOCIETY_DATA,root.ANJWA_SUBJECT_OVERVIEW_APPLIED_DATA);
function mergeEvidence(...collections){
 const merged={};
 for(const collection of collections)for(const [id,entry]of Object.entries(collection||{})){
  if(Object.hasOwn(merged,id))throw new Error('Duplicate overview evidence: '+id);
  merged[id]=Object.freeze({...entry,sections:Object.freeze([...(entry.sections||[])]),pointSources:Object.freeze([...(entry.pointSources||[])])});
 }
 return Object.freeze(merged);
}
const evidence=mergeEvidence(root.ANJWA_SUBJECT_OVERVIEW_CORE_BASIS,root.ANJWA_SUBJECT_OVERVIEW_SCIENCE_SOCIETY_BASIS,root.ANJWA_SUBJECT_OVERVIEW_APPLIED_BASIS);
function resolveId(course={},guide={}){
 const explicitId=course.subjectId||course.id;
 if(explicitId&&data[explicitId])return explicitId;
 const revision=String(explicitId||'').split(':')[0]||String(guide.curriculum||'').match(/^(2015|2022)/)?.[1];
 const revisions=revision?[revision]:['2022','대표','2015'];
 for(const rev of revisions){const id=rev+':'+norm(course.name);if(data[id])return id;}
 return null;
}
function get(course={},guide={}){
 const id=resolveId(course,guide);if(id)return [...data[id]];
 // A new, unregistered subject can still show its supplied learning topics.
 return [...new Set((guide.learningTopics||[]).filter(Boolean))];
}
function basis(course={},guide={}){
 return evidence[resolveId(course,guide)]||{status:'unverified',scopeNote:'해당 과목의 공식 교육과정 원문을 아직 확인하지 못했습니다.'};
}
const api={get,basis,mergeCollections,mergeEvidence,data,evidence};root.AnjwaSubjectOverview=api;
if(typeof module==='object'&&module.exports)module.exports=api;
})(typeof window==='object'?window:globalThis);
