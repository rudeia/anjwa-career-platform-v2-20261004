(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;if(root)root.AnjwaDemand=api;})(typeof globalThis!=='undefined'?globalThis:this,()=>{
  'use strict';
  const format='anjwa-course-demand', schema=2;
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function groups(plan,grade){
    return ['1','2'].flatMap(semester=>{
      const term=`${grade}-${semester}`,out=[];let group=null,previous=null;
      for(const c of plan.courses.filter(c=>c.semesters.includes(term)).sort((a,b)=>a.row-b.row)){
        const marker=String(c.markers[term]||''),m=marker.match(/택\s*(\d+)\s*\]?\s*\/\s*(\d+)/);
        if(!m){group=null;previous=null;continue;}
        const override=c.cohortPlanKey==='incoming2024'&&term==='3-1'&&c.row===58;
        if(!group||group.marker!==marker||group.section!==c.section||c.row!==previous+1||override){
          group={id:`${term}-choice-${out.length+1}`,term,marker,section:c.section,count:Number(m[1]),credits:Number(m[2]),courses:[]};out.push(group);
        }group.courses.push(c);previous=c.row;
      }return out;
    });
  }
  // Store only the fields needed to interpret a historical application.
  function snapshot(ctx){return {surveyId:ctx.surveyId,round:ctx.round,planKey:ctx.planKey,grade:ctx.grade,version:ctx.version,groups:ctx.groups.map(g=>({id:g.id,term:g.term,section:g.section,count:g.count,credits:g.credits,courses:g.courses.map(c=>({id:c.id,name:c.name,subjectId:c.subjectId||'',area:c.area||'',category:c.category||'',deliveryMode:c.deliveryMode,offeringStatus:c.offeringStatus||c.deliveryMode,credits:g.credits/g.count}))}))};}
  function contextKey(ctx){const s=snapshot(ctx);s.groups.sort((a,b)=>a.id.localeCompare(b.id));for(const g of s.groups)g.courses.sort((a,b)=>a.id.localeCompare(b.id));return JSON.stringify(s);}
  function validateContext(ctx){
    const errors=[],str=(v,n=200)=>typeof v==='string'&&v.trim().length>0&&v.length<=n;
    if(!str(ctx.surveyId)||!str(ctx.round,20)||!/^incoming\d{4}$/.test(ctx.planKey)||!['2','3'].includes(ctx.grade)||!str(ctx.version))errors.push('편성의 조사 대상/버전 정보를 확인하세요.');
    if(!Array.isArray(ctx.groups)||!ctx.groups.length||ctx.groups.length>100)return [...errors,'선택 묶음 정보가 없거나 너무 많습니다.'];
    const groupIds=new Set(),offerings=new Set();let total=0;
    for(const g of ctx.groups){
      if(!str(g.id)||groupIds.has(g.id)||![`${ctx.grade}-1`,`${ctx.grade}-2`].includes(g.term)||!str(g.section)||!Number.isInteger(g.count)||g.count<1||!Number.isFinite(g.credits)||g.credits<=0||g.credits>100)errors.push('선택 묶음의 학기/학점/개수 정보가 잘못되었습니다.');groupIds.add(g.id);
      if(!Array.isArray(g.courses)||g.courses.length<g.count||g.courses.length>500){errors.push('선택 묶음의 후보 과목을 확인하세요.');continue;}
      const ids=new Set();total+=g.courses.length;
      for(const c of g.courses){const key=JSON.stringify([g.term,c.id]);if(!str(c.id)||!str(c.name)||ids.has(c.id)||offerings.has(key)||!['classroom','online'].includes(c.deliveryMode)||(!['classroom','online','review'].includes(c.offeringStatus)||(c.offeringStatus!=='review'&&c.offeringStatus!==c.deliveryMode))||typeof c.subjectId!=='string'||typeof c.area!=='string'||typeof c.category!=='string'||[c.subjectId,c.area,c.category].some(x=>x.length>200)||!Number.isFinite(c.credits)||c.credits!==g.credits/g.count)errors.push('과목 식별자/이름/학점/운영 방식 정보가 잘못되었습니다.');ids.add(c.id);offerings.add(key);}
    }if(total>2000)errors.push('편성 과목 수가 너무 많습니다.');return errors;
  }
  function signature(r){const answers=r.answers.map(a=>({...a,primary:[...a.primary].sort(),alternative:[...a.alternative].sort(),conditions:Object.fromEntries(Object.entries(a.conditions).sort(([a],[b])=>a.localeCompare(b)))})).sort((a,b)=>a.groupId.localeCompare(b.groupId));return JSON.stringify([r.surveyId,r.round,r.planKey,r.grade,r.version,r.studentNumber,r.name,r.status,answers]);}
  function key(r){return JSON.stringify([r.surveyId,r.round,r.studentNumber]);}
  function validate(r,ctx){
    const errors=[];
    if(!r.responseId||typeof r.responseId!=='string'||r.responseId.length>100||!Number.isFinite(Date.parse(r.exportedAt)))errors.push('응답 ID 또는 작성 일시를 확인하세요.');
    if(r.format!==format||![1,schema].includes(r.schema))errors.push('신청서 형식/버전이 다릅니다.');
    if(!/^\d{4,12}$/.test(r.studentNumber||''))errors.push('학번을 확인하세요.');
    if(typeof r.name!=='string'||!r.name.trim()||r.name.length>40)errors.push('이름을 확인하세요.');
    for(const field of ['surveyId','round','planKey','grade','version'])if(r[field]!==ctx[field])errors.push(`${field}: 조사 대상 또는 편성 버전이 다릅니다.`);
    if(!['active','withdrawn'].includes(r.status))errors.push('응답 상태가 잘못되었습니다.');
    if(!Array.isArray(r.answers)||r.answers.length!==ctx.groups.length)return [...errors,'선택군 응답이 누락되거나 추가되었습니다.'];
    const seen=new Set();
    for(const a of r.answers){
      const g=ctx.groups.find(g=>g.id===a.groupId);
      if(!g||seen.has(a.groupId)){errors.push('선택군이 없거나 중복되었습니다.');continue;}seen.add(a.groupId);
      if(!['decided','considering','help','unknown'].includes(a.decision))errors.push(`${g.id}: 결정 상태 오류`);
      if(!Array.isArray(a.primary)||!Array.isArray(a.alternative)){errors.push(`${g.id}: 과목 목록 오류`);continue;}
      const ids=new Set(g.courses.map(c=>c.id));
      if(new Set(a.primary).size!==a.primary.length||new Set(a.alternative).size!==a.alternative.length||a.primary.some(id=>!ids.has(id))||a.alternative.some(id=>!ids.has(id)||a.primary.includes(id)))errors.push(`${g.id}: 중복 또는 다른 학기 과목`);
      if(a.decision==='unknown'&&a.primary.length)errors.push(`${g.id}: 미정 응답에는 우선 희망을 넣지 않습니다.`);
      if(a.decision!=='unknown'&&a.primary.length!==g.count)errors.push(`${g.id}: ${g.count}개를 고르거나 미정으로 응답하세요.`);
      if(a.alternative.length>2)errors.push(`${g.id}: 대체 희망은 2개까지입니다.`);
      if(!a.conditions||typeof a.conditions!=='object'||Array.isArray(a.conditions)){errors.push(`${g.id}: 참여 조건 형식 오류`);continue;}
      for(const [id,value] of Object.entries(a.conditions)){const course=g.courses.find(c=>c.id===id);if(!a.primary.includes(id)||!course||(course.deliveryMode!=='online'&&course.offeringStatus!=='review')||!['possible','conditional','unavailable'].includes(value))errors.push(`${g.id}: 참여 조건 대상/값 오류`);}
      for(const id of a.primary){const c=g.courses.find(c=>c.id===id);if(c&&(c.deliveryMode==='online'||c.offeringStatus==='review')&&!['possible','conditional','unavailable'].includes(a.conditions?.[id]))errors.push(`${g.id}: 온라인/검토 과목 참여 조건을 확인하세요.`);}
    }
    return errors;
  }
  function aggregate(records,ctx){
    const active=records.filter(r=>r.status==='active'),stats=ctx.groups.flatMap(g=>g.courses.map(c=>({term:g.term,groupId:g.id,courseId:c.id,name:c.name,mode:c.deliveryMode,primary:0,conditional:0,unavailable:0,alternative:0})));
    for(const r of active)for(const a of r.answers){for(const id of a.primary){const s=stats.find(s=>s.groupId===a.groupId&&s.courseId===id);if(s){const condition=a.conditions?.[id];s[condition==='conditional'?'conditional':condition==='unavailable'?'unavailable':'primary']++;}}for(const id of a.alternative){const s=stats.find(s=>s.groupId===a.groupId&&s.courseId===id);if(s)s.alternative++;}}
    return {active:active.length,withdrawn:records.length-active.length,undecided:active.filter(r=>r.answers.some(a=>a.decision==='unknown')).length,help:active.filter(r=>r.answers.some(a=>a.decision==='help')).length,stats};
  }
  return {format,schema,esc,groups,snapshot,contextKey,validateContext,key,signature,validate,aggregate};
});
