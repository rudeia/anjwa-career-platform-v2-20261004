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
function get(course={},guide={}){
 const explicitId=course.subjectId||course.id;
 if(explicitId&&data[explicitId])return [...data[explicitId]];
 const revision=String(explicitId||'').split(':')[0]||String(guide.curriculum||'').match(/^(2015|2022)/)?.[1];
 const revisions=revision?[revision]:['2022','대표','2015'];
 for(const rev of revisions){const points=data[rev+':'+norm(course.name)];if(points)return [...points];}
 // A new, unregistered subject can still show its supplied learning topics.
 return [...new Set((guide.learningTopics||[]).filter(Boolean))];
}
const api={get,mergeCollections,data};root.AnjwaSubjectOverview=api;
if(typeof module==='object'&&module.exports)module.exports=api;
})(typeof window==='object'?window:globalThis);
