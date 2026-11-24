/* Merge separately reviewed topic collections without changing their source data. */
(function(root,factory){
 'use strict';
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 root.AnjwaTopicDataLoader=api;
 if(root.ANJWA_TOPIC_DATA){
  root.ANJWA_TOPIC_DATA=api.combineTopicData(
   root.ANJWA_TOPIC_DATA,
   root.ANJWA_TOPIC_STEM_SOCIETY_DATA,
   root.ANJWA_TOPIC_EXTENSION_DATA
  );
 }
})(typeof window==='object'?window:globalThis,function(){
 'use strict';
 function copyTopicValue(value){
  if(Array.isArray(value))return value.map(copyTopicValue);
  if(value&&Object.prototype.toString.call(value)==='[object Object]'){
   return Object.fromEntries(Object.entries(value).map(([key,item])=>[key,copyTopicValue(item)]));
  }
  return value;
 }
 function rows(source){return Array.isArray(source)?source:Array.isArray(source?.topics)?source.topics:[];}
 // The baseline owns collection metadata and research sources. The first topic
 // with an ID wins, preserving existing IDs when extensions repeat an entry.
 function combineTopicData(base,...extensions){
  const metadata=base&&typeof base==='object'&&!Array.isArray(base)?base:{};
  const seen=new Set(),topics=[];
  for(const source of [base,...extensions])for(const topic of rows(source)){
   if(!topic||typeof topic.id!=='string'||!topic.id.trim()||seen.has(topic.id))continue;
   seen.add(topic.id);
   topics.push(copyTopicValue(topic));
  }
  return {...metadata,topics};
 }
 return {combineTopicData};
});
