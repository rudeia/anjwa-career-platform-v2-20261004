(function(root){
'use strict';
const norm=name=>String(name||'').normalize('NFC').replace(/^\s*\(온\)\s*/,'').replace(/\s+/g,'').replace(/Ⅰ/g,'I').replace(/Ⅱ/g,'II').replace(/Ⅲ/g,'III');
function resolve(guide,course,revision){
 const name=norm(course.name),explicit=revision||String(course.subjectId||'').match(/^([^:]+):/)?.[1]||(course.cohortPlanKey==='incoming2024'?'2015':undefined);
 const candidates=explicit?[explicit]:['2022','대표','2015'];
 for(const rev of candidates){const extra=guide.additionalProfiles?.[rev+':'+name];if(extra)return extra;}
 if(/고시외|\(전문\)/.test(name))return null;
 const match=Object.entries(guide.subjectProfiles||{}).find(([key,profile])=>norm(key)===name&&(!explicit||profile.curriculum?.startsWith(explicit)));
 return match?.[1]||null;
}
function curriculumLabel(value){const text=String(value||'');if(text.startsWith('2015'))return '2015 개정 · 2024 입학생 적용';if(text.startsWith('2022'))return '2022 개정';return '기존 대표 과목';}
const api={resolve,curriculumLabel,norm};root.AnjwaSubjectProfile=api;if(typeof module==='object'&&module.exports)module.exports=api;
})(typeof window==='object'?window:globalThis);
