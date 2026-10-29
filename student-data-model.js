/* Imported display names are resolved once here. Screens join catalogue IDs,
   while source row IDs remain stable for previously saved choices. */
(() => {
  const source = window.ANJWA_CURRICULUM_DATA;
  if (!source?.plans) return;
  const modes = { classroom: '교내 대면', online: '학교 편성 온라인', review: '개설 검토', unavailable: '미개설' };
  const canonicalName = name => String(name || '').normalize('NFC').replace(/\(온\)|\(고시외\)/g, '').replace(/\s+/g, '').replace(/Ⅰ/g, 'I').replace(/Ⅱ/g, 'II').replace(/Ⅲ/g, 'III');
  const catalogue = new Map();
  const revision = key => key === 'incoming2024' ? '2015' : '2022';
  const subjectId = (name, key) => `${revision(key)}:${canonicalName(name)}`;
  const plans = {};
  for (const [key, plan] of Object.entries(source.plans)) {
    if (key === 'current2026') continue;
    plans[key] = { ...plan, courses: plan.courses.map(course => {
      const id = subjectId(course.name, key);
      if (!catalogue.has(id)) catalogue.set(id, { id, name: course.name.replace(/\(온\)|\(고시외\)/g, '').trim(), revision: revision(key) });
      const deliveryMode = course.deliveryMode || (/\(온\)/.test(course.name.normalize('NFC')) ? 'online' : 'classroom');
      const offeringStatus = /추가|공동교육/.test(course.section) ? 'review' : deliveryMode;
      return { ...course, subjectId: id, cohortPlanKey: course.cohortPlanKey || key, deliveryMode, offeringStatus, authority: /고시외/.test(course.name) ? 'school-approved' : 'national' };
    }) };
  }
  const currentYear = Number(Object.keys(source.plans).find(key => /^current\d{4}$/.test(key)).slice(7));
  const gradeCohorts = Object.fromEntries([1,2,3].map(grade => [String(grade), `incoming${currentYear-grade+1}`]));
  const currentCourses = Object.entries(gradeCohorts).flatMap(([grade, key]) => plans[key].courses.filter(c => c.semesters.some(s => s.startsWith(grade + '-'))).map(c => ({ ...c, semesters: c.semesters.filter(s => s.startsWith(grade + '-')), markers: Object.fromEntries(Object.entries(c.markers).filter(([s]) => s.startsWith(grade + '-'))) })));
  const currentSummary = Object.fromEntries(Object.entries(gradeCohorts).flatMap(([grade, key]) => Object.entries(plans[key].summary).filter(([s]) => s.startsWith(grade + '-'))));
  plans.current2026 = { ...source.plans.current2026, courses: currentCourses, summary: currentSummary, gradeCohorts, description: '2026학년도 1학년은 2026 입학생, 2학년은 2025 입학생, 3학년은 2024 입학생의 편성표를 함께 보여줍니다.' };
  const match = (name, planKey) => (plans[planKey]?.courses || []).filter(c => c.subjectId === subjectId(name, c.cohortPlanKey));
  const label = course => course.creditTreatment === 'separate' ? '온라인학교 · 별도 이수' : modes[course.offeringStatus] || modes.unavailable;
  const militaryPlans = Object.fromEntries(Object.entries(source.militaryPlans || {}).map(([key, plan]) => [key, {...plan, courses: plan.courses.map(course => ({...course, subjectId: subjectId(course.name, key), cohortPlanKey: course.cohortPlanKey || key, deliveryMode: course.deliveryMode || (/\(온\)/.test(course.name) ? 'online' : 'classroom'), offeringStatus: /\(온\)/.test(course.name) ? 'online' : 'classroom'}))}]));
  window.ANJWA_STUDENT_MODEL = { curriculum: { ...source, plans, militaryPlans }, catalogue, subjectId, match, label, canonicalName, gradeCohorts };
})();
