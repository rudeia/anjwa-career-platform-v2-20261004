(function(root, factory) {
  const api = factory();
  if (typeof module === 'object') module.exports = api;
  if (root) root.AnjwaPlannerValidation = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  'use strict';
  const copy = value => JSON.parse(JSON.stringify(value));
  const credits = (course, term) => {
    const marker = String(course.markers?.[term] || '');
    const choice = marker.match(/택\s*(\d+)\s*\]?\s*\/\s*(\d+)/);
    return choice && Number(choice[1]) > 0 ? Number(choice[2]) / Number(choice[1]) : Number(marker) || Number(course.credits || 0);
  };
  const count = group => Number(group.count ?? String(group.choiceText || '').match(/\d+/)?.[0]);
  const groupFor = (groups, course, term) => groups.find(g => (g.term || g.semesterKey) === term && g.courses.some(c => c.id === course.id));
  function snapshot(course, term, groups) {
    const group = groupFor(groups, course, term);
    return {
      name: course.name, credits: credits(course, term), section: course.section,
      deliveryMode: course.deliveryMode || '', creditTreatment: course.creditTreatment || 'regular',
      group: group ? { count: count(group), ids: group.courses.map(c => c.id).sort() } : null
    };
  }
  function reasons(item, course, term, groups) {
    if (!course) return ['현재 편성에서 찾을 수 없는 과목'];
    const result = [];
    if (!course.semesters?.includes(term)) result.push('학기가 바뀐 과목');
    const group = groupFor(groups, course, term);
    if (course.semesters?.includes(term) && !group && !/선택|공동교육|추가교육/.test(course.section || '')) result.push('학교지정 과목으로 변경됨');
    if (course.creditTreatment === 'separate') result.push('정규 합계와 별도 이수하는 과목');
    if (Number(item.credits) !== credits(course, term)) result.push('학점이 바뀐 과목');
    const old = item.snapshot;
    if (old) {
      const next = snapshot(course, term, groups);
      if (old.name !== next.name) result.push('과목명이 바뀜');
      if (old.section !== next.section || JSON.stringify(old.group) !== JSON.stringify(next.group)) result.push('선택 묶음 또는 선택 수가 바뀜');
      if (old.deliveryMode !== next.deliveryMode || old.creditTreatment !== next.creditTreatment) result.push('수업 또는 이수 방식이 바뀜');
    }
    return result;
  }
  function revalidate(plan, curriculum, groups) {
    const result = {};
    const courses = curriculum?.courses || [];
    for (const grade of ['1', '2', '3']) {
      result[grade] = {};
      for (const semester of ['1', '2']) {
        const term = `${grade}-${semester}`, old = plan?.[grade]?.[semester] || {};
        const next = { regular: [], joint: [], additional: copy(Array.isArray(old.additional) ? old.additional : []), review: copy(Array.isArray(old.review) ? old.review : []) };
        const seen = new Set();
        for (const zone of ['regular', 'joint']) for (const item of Array.isArray(old[zone]) ? old[zone] : []) {
          const course = courses.find(c => c.id === item?.id);
          const issues = reasons(item || {}, course, term, groups);
          if (seen.has(item?.id)) issues.push('같은 학기 중복 선택');
          seen.add(item?.id);
          if (issues.length) next.review.push({ item: copy(item), zone, reasons: issues });
          else next[zone].push({ ...copy(item), snapshot: snapshot(course, term, groups) });
        }
        for (const group of groups.filter(g => (g.term || g.semesterKey) === term)) {
          const ids = new Set(group.courses.map(c => c.id));
          if ([...next.regular, ...next.joint].filter(x => ids.has(x.id)).length > count(group)) {
            for (const zone of ['regular', 'joint']) next[zone] = next[zone].filter(item => {
              if (!ids.has(item.id)) return true;
              next.review.push({ item, zone, reasons: ['선택 묶음의 허용 과목 수 초과'] });
              return false;
            });
          }
        }
        if (next.joint.reduce((sum, item) => sum + Number(item.credits || 0), 0) > 6) {
          next.review.push(...next.joint.map(item => ({ item, zone: 'joint', reasons: ['공동교육과정 학기당 6학점 초과'] })));
          next.joint = [];
        }
        result[grade][semester] = next;
      }
    }
    return result;
  }
  return { revalidate, snapshot, reasons, credits };
});
