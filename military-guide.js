(function(root, factory) {
  'use strict';
  const api = factory(root);
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root.document?.getElementById('military')) root.AnjwaMilitaryGuide = api.mount(root);
})(typeof globalThis !== 'undefined' ? globalThis : this, function(root) {
  'use strict';
  const views = ['military', 'militaryEntry', 'militarySpecialties', 'militaryCertificates', 'militaryCalendar'];
  const storageKey = 'anjwa.militaryGuide.preferences.v1';
  const portal = 'https://m-recruit.mnd.go.kr/';
  const rankSource = 'https://www.moleg.go.kr/board.es?act=view&bid=0017&cg_code=&keyField=&keyWord=&list_no=152052&mid=a20304000000&nPage=1&tag=';
  const airSource = 'https://www.airforce.mil.kr/user/indexSub.action?codyMenuSeq=249872711&menuUIType=sub&siteId=atc';
  const branches = {all:'아직 정하지 않았어요',army:'육군',navy:'해군',airforce:'공군',marines:'해병대'};
  const titles = {military:'무엇을 알아볼까요?',militaryEntry:'부사관 되는 길',militarySpecialties:'주특기·계급 알아보기',militaryCertificates:'자격증 준비하기',militaryCalendar:'부사관 모집 일정 달력'};
  const summaries = {
    military:'배울 과목은 ‘학교 교육과정’, 시험 날짜는 ‘모집 일정 달력’에서 확인하세요.',
    militaryEntry:'지원할 수 있는 과정을 찾고, 공고에서 확인할 내용과 준비 순서를 알아봅니다.',
    militarySpecialties:'군에서 하는 일과 계급·직책의 차이를 나누어 살펴봅니다.',
    militaryCertificates:'관심 분야와 학교 공부에 맞는 자격을 찾아보고, 군 지원에서의 인정 여부를 확인합니다.',
    militaryCalendar:'접수부터 필기·면접·합격 발표·입소·임관까지 군과 기수별 일정을 비교하세요.'
  };
  const fields = [
    {id:'admin',title:'행정·인사·회계',description:'문서와 기록, 인력 관련 자료, 회계자료를 다루는 일에 관심이 있나요?',question:'자료를 정확하게 정리하고 다시 확인하는 일이 나와 맞나요?',subjects:['사무관리','사무행정','인사','회계원리','회계실무','회계정보처리시스템']},
    {id:'supply',title:'보급·수송',description:'필요한 물품과 이동을 계획하고 관리하는 일을 살펴봅니다.',question:'수량과 일정, 준비 상태를 꼼꼼하게 확인할 수 있나요?',subjects:['사무관리','사무행정','상업경제'],note:'표시한 과목은 자료 관리의 기초를 비교하는 예시입니다. 운전·수송 등의 자격 인정은 공고에서 따로 확인하세요.'},
    {id:'it',title:'통신·전산',description:'통신이나 컴퓨터 관련 업무를 찾아봅니다.',question:'컴퓨터와 정보기술의 원리를 더 배우고 싶나요?',subjects:['정보처리와관리','디지털과직업생활'],note:'학교 수업의 디지털 기초와 비교해보세요. 통신·프로그래밍 분야는 관심 업무에 맞는 별도 학습도 필요합니다.'},
    {id:'maintenance',title:'장비·정비',description:'장비의 구조를 이해하고 상태를 점검하는 일을 살펴봅니다.',question:'기계와 장비를 배우고 문제의 원인을 찾는 일이 흥미로운가요?',subjects:['항공드론','총기장비','화포장비'],note:'과목과 직무의 학습 내용을 비교하는 예시입니다. 군의 정비 특기 배정이나 자격 인정을 뜻하지 않습니다.'},
    {id:'seaair',title:'함정·항공 관련 업무',description:'함정과 항공 분야에 어떤 세부 업무가 있는지 찾아봅니다.',question:'관심 있는 분야의 실제 하는 일을 더 알아보고 싶나요?',subjects:['항공드론','군사영어'],note:'영어와 장비 관련 공부를 관심 분야와 비교해보세요. 군별 공식 특기·직별의 내용은 별도로 확인합니다.'},
    {id:'field',title:'전투·현장 임무',description:'현장에서 팀과 협력하며 임무를 수행하는 일을 살펴봅니다.',question:'보고와 협력, 규칙 준수가 중요한 일임을 이해하고 있나요?',subjects:['군리더십','군대윤리','국방체육','전쟁사'],note:'체력뿐 아니라 의사소통과 책임 있는 판단을 함께 생각해보세요.'}
  ];
  // 공개된 임무 소개만 요약. 해당 기수의 자격·교육 순서는 모집 공고에서 확인한다.
  const specialRoutes = [
    {id:'udt',branch:'navy',title:'해군 특전 부사관 · UDT/SEAL',description:'해군의 특수작전 분야에 관심이 있다면 살펴볼 경로입니다.',keyword:'특전 부사관, UDT/SEAL',source:'https://kookbang.dema.mil.kr/newsWeb/20250225/2/ATCE_CTGR_0010040000/view.do',sourceLabel:'국방일보 UDT/SEAL 임무 소개'},
    {id:'ssu',branch:'navy',title:'해군 잠수 부사관 · SSU',description:'심해잠수와 해난구조 분야에 관심이 있다면 살펴볼 경로입니다. 특수작전 분야인 UDT/SEAL과 하는 일을 구분해 비교하세요.',keyword:'잠수 부사관, 심해잠수, SSU',source:'https://kookbang.dema.mil.kr/newsWeb/20240612/6/ATCE_CTGR_0010040000/view.do',sourceLabel:'국방일보 SSU 임무 소개'},
    {id:'swc',branch:'army',title:'육군 특전부사관 · 특전사',description:'육군의 특수전 분야에 관심이 있다면 특전부사관 모집 과정을 살펴보세요.',keyword:'특전부사관',source:'https://mp.mil.kr/goarmy/index.do',sourceLabel:'육군 모집 · 특전부사관 메뉴'},
    {id:'recon',branch:'marines',title:'해병대 수색 부사관',description:'해병대의 수색·정찰 분야에 관심이 있다면 살펴볼 경로입니다. 부사관 선발과 수색교육 수료를 구분해 준비하세요.',keyword:'수색 부사관, 수색 별도선발',path:'지원할 기수에 수색 부사관을 별도로 모집하는지 확인하세요. 모집 단계에서 수색을 지원하는 경우와 입영 후 별도 선발·교육을 거치는 경우를 공고에서 구분하고, 수색부대 배치를 보장하는 것으로 이해하지 마세요.',source:'https://kookbang.dema.mil.kr/newsWeb/20260521/2/ATCE_CTGR_0010040000/view.do',sourceLabel:'국방일보 해병대 수색교육 소개',evidence:'https://inje.go.kr/mobile/notice/notification?articleSeq=221097',evidenceLabel:'과거 수색 별도선발 사례 · 제408기'},
    {id:'sart',branch:'airforce',title:'공군 항공구조사 · SART',description:'조난 인원 탐색·구조 분야에 관심이 있다면 살펴볼 경로입니다. 항공구조사 선발과 전문교육 수료를 구분하세요.',keyword:'항공구조사, 항공구조, SART, 특별전형Ⅰ',path:'제256기 공군 부사관 모집에는 항공구조사 특별전형Ⅰ 자료가 있습니다. 지원할 기수의 특별전형 모집 여부와 지원 자격, 신체검사·육상 및 수상 평가·응급처치 등의 기준을 확인하세요.',source:'https://www.korea.kr/archive/recruitInfoView.do?dataId=374214',sourceLabel:'공군 제256기 공식 공고 · 항공구조사 첨부',evidence:'https://www.youtube.com/watch?v=UotXdnD1MTM',evidenceLabel:'공군 공식 SART 소개'},
    {id:'cct',branch:'airforce',title:'공군 항공특수통제사 · CCT',description:'항공기 유도와 특수임무 분야에 관심이 있다면 살펴볼 경로입니다. 항공구조사(SART)와 하는 일과 선발 기준을 구분해 비교하세요.',keyword:'항공특수통제사, CCT, 공정통제사, 특별전형Ⅰ',path:'제256기 공군 부사관 모집에는 항공특수통제사 특별전형Ⅰ 자료가 있습니다. 지원할 기수의 특별전형 모집 여부와 지원 자격, 신체검사·체력평가·면접 등의 기준을 확인하세요. 과거 자료의 공정통제사 명칭도 함께 찾아보세요.',source:'https://www.korea.kr/archive/recruitInfoView.do?dataId=374214',sourceLabel:'공군 제256기 공식 공고 · 항공특수통제사 첨부',evidence:'https://kookbang.dema.mil.kr/newsWeb/20260514/3/ATCE_CTGR_0010050000/view.do',evidenceLabel:'국방일보 CCT 임무 소개'}
  ];
  const certificates = [
    {id:'computer',name:'컴퓨터활용능력',description:'표와 데이터를 정리하고 활용하는 능력을 공부합니다.',subjects:['사무관리','사무행정'],connection:'학교에서 문서와 자료를 다루는 공부에 관심이 있다면 함께 살펴볼 만합니다.',next:'공식 안내에서 급수별 내용을 비교하고, 현재 배운 수준에 맞는 준비 범위를 선생님과 정하세요.',url:'https://ml.korcham.net/co/examguide.do?cd=01&jmcd=0103',source:'대한상공회의소 자격 안내'},
    {id:'accounting',name:'전산회계운용사',description:'회계시스템으로 회계정보를 처리하는 능력을 확인하는 자격입니다.',subjects:['회계원리','회계실무','회계정보처리시스템'],connection:'학교의 회계 공부와 회계자료를 시스템으로 처리하는 내용을 비교해볼 수 있습니다.',next:'급수별 평가 내용과 응시할 연도의 실기 프로그램을 확인하고, 학교 실습 환경과 비교하세요.',url:'https://ml.korcham.net/co/examguide.do?cd=03&jmcd=0104',source:'대한상공회의소 자격 안내'},
    {id:'programming',name:'프로그래밍기능사',description:'프로그램 작성과 화면 구현, 데이터 조회, 테스트 등 정보시스템을 만드는 기초 업무와 관련된 자격입니다.',subjects:[],connection:'컴퓨터 분야에 관심이 있고 코딩을 더 배우고 싶은 학생의 추가 학습 후보입니다. 사무·회계 공부 외에 별도의 프로그래밍 학습이 필요합니다.',next:'공식 출제기준을 먼저 확인하세요. 군의 인정표에 구명칭만 있다면 새 명칭 자격의 인정 여부도 모집기관에 확인하세요.',url:'https://www.q-net.or.kr/crf005.do?gId=&gSite=Q&id=crf00503s02&jmCd=6921&jmInfoDivCcd=A0',source:'Q-Net 종목 안내',note:'2026년부터 정보처리기능사의 종목명이 프로그래밍기능사로 바뀌었습니다.'}
  ];
  const esc = value => String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const canonical = name => String(name || '').normalize('NFC').replace(/\s|\([^)]*\)/g,'');
  const link = (url, label, className='military-link') => `<a class="${className}" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)}<span class="military-sr-only">（새 탭）</span> ↗</a>`;
  function normalizePreferences(value, plans) {
    return {branch:Object.hasOwn(branches,value?.branch)?value.branch:'all',cohort:/^incoming\d{4}$/.test(value?.cohort||'')&&Object.hasOwn(plans,value.cohort)?value.cohort:plans.incoming2026?'incoming2026':Object.keys(plans).find(k=>/^incoming/.test(k))||'',tab:['work','ranks'].includes(value?.tab)?value.tab:'work'};
  }
  function readPreferences(storage, plans) {
    try { return normalizePreferences(JSON.parse(storage.getItem(storageKey)||'null'),plans); }
    catch { return normalizePreferences(null,plans); }
  }
  function schoolCourses(plans, cohort, subjects) {
    return (plans[cohort]?.courses || []).filter(c=>subjects.some(name=>canonical(c.name)===name));
  }
  function subjectChips(plans, preferences, subjects) {
    const courses=schoolCourses(plans,preferences.cohort,subjects);
    return courses.length?`<ul class="military-chips">${courses.map(c=>`<li>${esc(c.name)}</li>`).join('')}</ul>`:'<p class="military-muted">이 입학년도 편성에서 직접 연결한 과목은 없습니다. 관심 분야에 필요한 공부를 선생님과 확인하세요.</p>';
  }
  function sharedControls(id,prefs,plans) {
    return `<div class="military-controls"><label for="${id}-branch">관심 군<select id="${id}-branch" data-military-pref="branch">${Object.entries(branches).map(([key,name])=>`<option value="${key}" ${prefs.branch===key?'selected':''}>${name}</option>`).join('')}</select></label><label for="${id}-cohort">내 입학년도<select id="${id}-cohort" data-military-pref="cohort">${Object.entries(plans).filter(([key])=>/^incoming\d{4}$/.test(key)).sort(([a],[b])=>b.localeCompare(a)).map(([key,plan])=>`<option value="${key}" ${prefs.cohort===key?'selected':''}>${esc(plan.label)}</option>`).join('')}</select></label></div>`;
  }
  function navButton(view,label,extra='') {return `<button type="button" class="military-button" data-military-view="${view}" ${extra}>${label}</button>`;}
  function officialPanel(prefs) {
    const branch=prefs.branch==='all'?'관심 군':branches[prefs.branch];
    const extra=prefs.branch==='army'?link('https://goarmy.mil.kr/goarmy/index.do','육군 모집 안내'):prefs.branch==='airforce'?link(airSource,'공군 특기분류 안내'):'';
    return `<section class="military-official"><h3>${esc(branch)}의 공식 안내 확인</h3><p>${prefs.branch==='all'?'관심 군을 고른 뒤 해당 군의 부사관 모집 공고를 찾아보세요.':`통합모집포털에서 ${esc(branch)}의 부사관 모집 공고를 찾아보세요.`} 적용 연도·기수와 모집 과정이 맞는지 확인합니다.</p><div class="military-actions">${link(portal,'공식 모집 공고 확인','military-primary')}${extra}</div></section>`;
  }
  function pageStart(id,prefs,plans) {
    return `<header class="military-header"><div class="military-brand">안좌고 · 부사관과</div></header><div class="military-heading"><div class="section-title-row"><h1 id="${id}-title" tabindex="-1">${titles[id]}</h1>${navButton(id==='military'?'departments':'military',id==='military'?'학과 선택으로':'부사관과 홈으로')}</div><p>${summaries[id]}</p></div>${['militaryCalendar','military'].includes(id)?'':sharedControls(id,prefs,plans)}<p class="military-storage-note" data-military-storage-note></p>${id==='military'?'':`<nav class="military-subnav" aria-label="부사관과 안내">${views.map(view=>`<button type="button" data-military-view="${view}" ${view===id?'aria-current="page"':''}>${view==='military'?'홈':view==='militaryEntry'?'되는 길':view==='militarySpecialties'?'주특기·계급':view==='militaryCalendar'?'모집 달력':'자격증'}</button>`).join('')}</nav>`}`;
  }
  function home(prefs,plans) {
    const cards=[['curriculum','학교 교육과정','학년·학기별 과목과 학점을 확인합니다.'],['militaryCalendar','모집 일정 달력','접수·필기·면접과 2027년 입소·임관 일정을 비교합니다.'],['militaryEntry','부사관 되는 길','지원 경로와 공고에서 확인할 내용을 알아봅니다.'],['militarySpecialties','주특기·계급 알아보기','육·해·공군과 해병대의 특수부대 부사관 경로, 하는 일과 계급을 살펴봅니다.'],['militaryCertificates','자격증 준비하기','학교 공부와 연결되는 자격을 찾아봅니다.']];
    return `<div class="military-cards">${cards.map(([view,title,text],i)=>`<button type="button" class="military-home-card ${i<2?'is-primary':'is-secondary'}" data-military-view="${view}"><span class="military-card-index">${String(i+1).padStart(2,'0')}</span><strong>${title}</strong><span>${text}</span><span class="military-card-action">${view==='curriculum'?'과목 확인':view==='militaryCalendar'?'일정 보기':view==='militaryEntry'?'지원 방법 보기':view==='militarySpecialties'?'하는 일 보기':'자격증 보기'} <span aria-hidden="true">→</span></span></button>`).join('')}</div><section class="military-mini"><h2>처음이라면 이렇게 시작하세요</h2><p>관심 군을 아직 정하지 않았다면 하는 일부터 살펴보세요. 관심 분야가 있다면 지원 공고와 학교에서 준비할 공부를 함께 확인합니다.</p>${navButton('militarySpecialties','하는 일부터 알아보기')}</section><details class="military-preferences military-panel"><summary>관심 군·입학년도 설정</summary>${sharedControls('military',prefs,plans)}</details>`;
  }
  function entry(prefs) {
    const steps=[['관심 군과 분야 찾기','어느 군에서 어떤 일을 해보고 싶은지 생각합니다.'],['모집 과정 확인하기','고3 재학 중 응시할 수 있는 과정인지, 그해 훈련 입소와 다음 해 이후 임관 일정이 어떻게 이어지는지 확인합니다.'],['공고의 조건 읽기','지원 자격, 평가 방법, 제출 서류와 인정 기한을 확인합니다.'],['지원과 평가 준비하기','공고에서 요구하는 서류와 평가를 준비합니다.'],['합격 후 절차 확인하기','교육과 임관 일정 등 해당 과정의 후속 절차를 확인합니다.']];
    return `<section class="military-panel"><h2>부사관은 어떻게 되나요?</h2><p>부사관과에서 공부하는 것과 각 군의 선발 절차를 거쳐 임관하는 것은 별개입니다. 관심 군의 공고에서 지원할 수 있는 과정과 필요한 조건을 확인하세요.</p><section class="military-mini"><h3>우리학교 학생의 준비 일정</h3><p>우리학교 학생은 고3 재학 중 시험에 응시하고, 선발 절차를 거쳐 그해 훈련에 들어가는 경로를 준비할 수 있습니다. 임관은 그다음 해부터 이어집니다.</p><p><b>고3 재학 중 응시·선발 → 그해 훈련 입소 → 다음 해부터 임관</b></p><p class="military-muted">응시·훈련 입소·임관은 서로 다른 시점입니다. 지원할 군과 모집 과정의 공고에서 지원 조건과 각 일정을 확인하고, 학교 선생님과 학사 일정을 함께 점검하세요.</p></section><ol class="military-steps">${steps.map(([title,text])=>`<li><h3>${title}</h3><p>${text}</p></li>`).join('')}</ol><p class="military-muted">평가 항목과 순서는 선택한 군과 모집 과정의 공고를 기준으로 확인합니다.</p></section><section class="military-panel"><h2>특수부대 부사관을 희망하나요?</h2><p>해군 UDT/SEAL·SSU, 육군 특전부사관, 해병대 수색 부사관, 공군 항공구조사(SART)·항공특수통제사(CCT)를 함께 살펴볼 수 있습니다. 지원할 기수의 졸업예정자 지원 조건, 훈련 입소일과 임관일을 각각 확인하세요.</p>${navButton('militarySpecialties','특수부대 부사관 살펴보기','data-military-open-special="true"')}${navButton('militaryCalendar','접수·필기·면접 달력 보기')}</section><section class="military-panel"><h2>공고에서 먼저 확인할 네 가지</h2><ul class="military-checklist"><li><b>누가 지원하나요?</b> 학력·연령 등 지원 조건과 기준일을 확인합니다.</li><li><b>무엇을 평가하나요?</b> 선발 평가와 특기분류 기준을 구분합니다.</li><li><b>언제까지 무엇을 내나요?</b> 접수 기한과 증빙서류 인정 기한을 확인합니다.</li><li><b>합격 후 어떤 과정이 있나요?</b> 교육·임관 등 후속 절차를 확인합니다.</li></ul></section><details class="military-panel"><summary>학년별로 지금 준비할 일</summary><ul class="military-checklist"><li><b>1학년</b> 학교 과목을 배우며 관심 있는 일의 종류를 찾아보세요.</li><li><b>2학년</b> 고3 응시를 염두에 두고 관심 군과 분야를 비교하며 필요한 준비를 선생님과 정리하세요.</li><li><b>3학년</b> 재학 중 응시할 모집 공고를 확인하고, 접수·평가·그해 훈련 입소 일정과 서류 제출 기한을 준비하세요. 임관은 다음 해부터 이어지는 일정으로 구분해 확인하세요.</li></ul><p class="military-muted">학습 순서에 대한 제안입니다. 군의 지원 자격은 해당 공고에서 확인하세요.</p></details>${officialPanel(prefs)}`;
  }
  function specialForces(prefs,plans) {
    const routes=specialRoutes.filter(route=>prefs.branch==='all'||route.branch===prefs.branch);
    return `<section class="military-panel" aria-labelledby="military-special-title"><h2 id="military-special-title">특수부대 부사관도 살펴보세요</h2><p>UDT/SEAL·SSU·특전사·해병대 수색·SART·CCT 등 관심 분야의 부사관 경로를 비교합니다. 부대 이름과 모집 과정의 명칭을 함께 확인하세요.</p><p><b>고3 때 지원하려면</b> 해당 과정이 졸업예정자를 받는지 먼저 확인하세요. 우리학교 학생의 고3 응시·그해 훈련 입소 경로를 모든 특수부대 모집 과정에 일괄 적용하지 않습니다.</p>${routes.length?`<div class="military-field-grid">${routes.map(route=>`<article class="military-panel" data-special-route="${route.id}"><span class="military-label">${branches[route.branch]} · 부사관 경로</span><h3>${route.title}</h3><p>${route.description}</p><p><b>공고에서 찾을 말</b> ${route.keyword}</p><p class="military-muted">${route.path || '모집하는 기수인지, 민간 지원이 가능한 부사관 과정인지 확인하세요. 선발 후 교육 순서와 수료 조건도 함께 읽어보세요.'}</p><div class="military-actions">${link(portal,'부사관 모집 공고 찾기')}${link(route.source,route.sourceLabel)}${route.evidence?link(route.evidence,route.evidenceLabel):''}</div></article>`).join('')}</div>`:'<p class="military-muted">선택한 군의 경로를 준비 중입니다. 다른 관심 군을 선택하면 현재 정리한 경로를 볼 수 있습니다.</p>'}<h3>지원 전에 나눠서 확인할 것</h3><ul class="military-checklist"><li><b>병 모집과 부사관 모집</b> 같은 UDT·SSU 명칭이 있어도 모집 신분과 지원 절차가 다릅니다. 부사관 공고인지 확인하세요.</li><li><b>응시·입소·임관·전문교육</b> 각 일정과 순서를 공고에서 따로 확인하세요. 임관과 특수부대 전문교육 수료도 구분합니다.</li><li><b>별도 평가와 기준</b> 체력·수영·신체검사 등의 평가 여부와 기준, 자격·무도 단증 등의 인정 여부를 지원할 과정에서 확인하세요.</li></ul><h3>학교에서 연결해볼 공부</h3>${subjectChips(plans,prefs,['국방체육','군리더십','군대윤리','군사영어'])}<p class="military-muted">학교 과목을 준비에 연결하는 제안입니다. 과목 이수나 자격증 취득이 합격·특기 배정·교육 수료를 보장하지 않습니다.</p><details class="military-source"><summary>자료의 범위 확인</summary><p>자료 확인 2026.11.11. 국방일보·공군 공식 영상은 임무 이해에, 육군 모집 메뉴는 과정 탐색에 활용했습니다. 공군 제256기 공고의 항공구조사·항공특수통제사 특별전형 첨부자료를 확인했습니다. 제408기 해병대 수색 별도선발 사례는 과거 자료입니다. 각 자료의 기수와 현재 지원할 기수를 구분하세요. 이번 안내는 최신 기수의 모집 여부·고3 지원 가능 여부·평가 수치를 확정한 모집요강이 아닙니다.</p></details></section>`;
  }
  function specialties(prefs,plans) {
    const work=prefs.tab==='work';
    return `<div class="military-tabs" role="tablist" aria-label="주특기와 계급"><button id="military-work-tab" role="tab" type="button" aria-selected="${work}" aria-controls="military-work-panel" tabindex="${work?0:-1}" data-military-tab="work">하는 일·주특기</button><button id="military-ranks-tab" role="tab" type="button" aria-selected="${!work}" aria-controls="military-ranks-panel" tabindex="${work?-1:0}" data-military-tab="ranks">계급·직책</button></div><div id="military-work-panel" role="tabpanel" aria-labelledby="military-work-tab" ${work?'':'hidden'}><section class="military-panel"><h2>군에서 어떤 일을 하나요?</h2><p>아래는 하는 일을 이해하기 위한 탐색 분류입니다. 관심 분야를 찾은 뒤 선택한 군의 공식 병과·특기·직별 안내와 비교해보세요.</p><p class="military-muted">이 분류를 군의 공식 특기명이나 코드로 사용하지 않습니다. 학교 과목과의 연결은 학습 내용을 비교하는 제안입니다.</p></section>${specialForces(prefs,plans)}<div class="military-field-grid">${fields.map(f=>`<details class="military-panel military-field"><summary>${f.title}</summary><p>${f.description}</p><p class="military-question">${f.question}</p><h3>내 입학년도의 학교 과목</h3>${subjectChips(plans,prefs,f.subjects)}${f.note?`<p class="military-muted">${f.note}</p>`:''}<div class="military-actions">${navButton('curriculum','학교 교육과정 확인')}${navButton('militaryCertificates','자격증 준비 방법')}</div></details>`).join('')}</div>${officialPanel(prefs)}</div><div id="military-ranks-panel" role="tabpanel" aria-labelledby="military-ranks-tab" ${work?'hidden':''}><section class="military-panel"><h2>계급과 주특기는 어떻게 다른가요?</h2><dl class="military-definitions"><div><dt>계급</dt><dd>군 안에서 구분하는 신분의 단계입니다. 부사관의 계급은 하사·중사·상사·원사입니다.</dd></div><div><dt>군사특기·직별</dt><dd>맡는 일의 전문 분야를 이해할 때 확인하는 정보입니다. 공식 명칭과 분류 방식은 군별 안내를 따릅니다.</dd></div><div><dt>직책</dt><dd>부대에서 맡은 구체적인 자리와 역할입니다. 계급만으로 실제 담당 업무를 정하지 않습니다.</dd></div></dl><h3>부사관 계급의 순서</h3><ol class="military-ranks"><li>하사</li><li>중사</li><li>상사</li><li>원사</li></ol><p>계급의 순서를 보여주는 안내입니다. 진급 요건은 별도로 확인해야 합니다. 준위는 준사관에 해당하며 부사관의 자동 다음 단계로 표시하지 않습니다.</p><details class="military-source"><summary>계급 구분의 근거 확인</summary><p>법제처의 군인사법 제3조 설명 · 게시 2026.06.26 · 자료 확인 2026.11.11</p>${link(rankSource,'법제처 계급 설명')}</details></section><details class="military-panel"><summary>같은 계급이면 모두 같은 일을 하나요?</summary><p>계급이 같아도 전문 분야와 직책이 다를 수 있습니다. 관심 분야에서 실제로 맡는 일을 함께 확인하세요.</p></details></div>`;
  }
  function certificatePage(prefs,plans) {
    return `<section class="military-panel"><h2>어떤 자격증부터 살펴볼까요?</h2><p>관심 분야와 학교에서 배우는 내용을 연결해보세요. 아래는 학습 내용을 기준으로 고른 후보입니다. 군 지원에서 어떻게 인정되는지는 선택한 군과 모집 과정의 공고에서 확인합니다.</p></section><div class="military-certificate-grid">${certificates.map(c=>`<article class="military-panel military-certificate"><span class="military-label">학습 후보</span><h2>${c.name}</h2><p>${c.description}</p><details><summary>학교 공부와 준비 방법</summary><p>${c.connection}</p>${c.subjects.length?subjectChips(plans,prefs,c.subjects):''}${c.note?`<p>${c.note}</p>`:''}<h3>다음에 할 일</h3><p>${c.next}</p><p class="military-muted">${c.source} · 자료 확인 2026.11.11. 이 자료의 확인일이 군의 자격 인정 여부를 뜻하지 않습니다.</p></details>${link(c.url,'자격 시험 공식 안내')}</article>`).join('')}</div><section class="military-panel"><h2>${prefs.branch==='all'?'군 지원':esc(branches[prefs.branch])+' 지원'}에서 어디에 쓰이는지 확인하세요</h2><p>공고에서 자격의 정확한 명칭·급수·인정 기한을 찾고, 지원에 필요한 자격인지, 선발 가점인지, 특기분류에 반영되는지 각각 확인하세요.</p><ul class="military-checklist"><li><b>지원 필수 여부</b> 해당 모집 과정의 원문 확인 필요</li><li><b>선발 가점</b> 해당 모집 과정의 원문 확인 필요</li><li><b>특기분류 반영</b> 해당 군의 특기분류 안내 확인 필요</li></ul><p>자격의 명칭과 인정 기준이 불분명하면 지원할 공고나 모집기관에서 확인하세요.</p><h3>특수부대 부사관을 준비한다면</h3><p>수영·잠수·구조 관련 자격이나 무도 단증 등을 살펴볼 때도 필수 자격, 가점, 실제 평가를 나눠 확인하세요. 위 세 자격을 특수부대 지원의 필수 자격으로 안내하지 않습니다.</p>${prefs.branch==='airforce'?`<details class="military-source"><summary>공군 특기분류 안내와 비교하기</summary><p>공군 안내에는 희망·자격증·전공·적성 등 특기분류 요소가 제시돼 있습니다. 자격증 취득만으로 배정을 판단하지 않습니다.</p>${link(airSource,'공군 특기분류 기준')}</details>`:''}</section><details class="military-panel"><summary>자격증을 따면 원하는 특기로 배정되나요?</summary><p>자격의 반영 여부와 배정 방식은 군과 모집 과정에 따라 확인해야 합니다. 공고와 특기분류 안내에서 자격이 어디에 쓰이는지 먼저 살펴보세요.</p></details>${officialPanel(prefs)}`;
  }
  function renderPage(id,prefs,plans) {
    if (!views.includes(id)) return '';
    const state=normalizePreferences(prefs,plans);
    return pageStart(id,state,plans)+(id==='militaryCalendar'?(root.AnjwaRecruitmentCalendar?.renderPage(state.branch)||'<p>일정 자료를 불러올 수 없습니다.</p>'):id==='military'?home(state,plans):id==='militaryEntry'?entry(state):id==='militarySpecialties'?specialties(state,plans):certificatePage(state,plans));
  }
  function mount(host) {
    const plans=host.ANJWA_STUDENT_MODEL?.curriculum?.militaryPlans || {};
    let prefs;try{prefs=readPreferences(host.localStorage,plans);}catch{prefs=normalizePreferences(null,plans);}
    let storageFailed=false;
    function render(focusId) {
      for(const id of views){const node=host.document.getElementById(id);if(node)node.innerHTML=renderPage(id,prefs,plans);}
      if(storageFailed)host.document.querySelectorAll('[data-military-storage-note]').forEach(el=>el.textContent='이 브라우저에서는 선택을 저장할 수 없습니다. 현재 화면에서는 계속 이용할 수 있습니다.');
      if(focusId)host.document.getElementById(focusId)?.focus({preventScroll:true});
    }
    function persist(){try{host.localStorage.setItem(storageKey,JSON.stringify(prefs));storageFailed=false;}catch{storageFailed=true;}}
    function navigate(view){if(![...views,'curriculum','departments'].includes(view))return;host.dispatchEvent(new host.CustomEvent('anjwa-military-navigate',{detail:{view,cohort:prefs.cohort}}));}
    host.document.addEventListener('change',event=>{
      const target=event.target.closest('[data-military-pref]');if(!target)return;
      const key=target.dataset.militaryPref;if(!['branch','cohort'].includes(key))return;
      prefs=normalizePreferences({...prefs,[key]:target.value},plans);persist();render(target.id);
    });
    host.document.addEventListener('click',event=>{
      const tab=event.target.closest('[data-military-tab]');if(tab){prefs=normalizePreferences({...prefs,tab:tab.dataset.militaryTab},plans);persist();render(tab.id);return;}
      const target=event.target.closest('[data-military-view]');if(target){if(target.dataset.militaryOpenSpecial==='true'){prefs.tab='work';persist();render();}navigate(target.dataset.militaryView);}
    });
    host.document.addEventListener('keydown',event=>{
      const tab=event.target.closest('[data-military-tab]');if(!tab||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
      event.preventDefault();prefs.tab=event.key==='Home'?'work':event.key==='End'?'ranks':prefs.tab==='work'?'ranks':'work';persist();render(`military-${prefs.tab}-tab`);
    });
    render();
    return {setCohort(key){if(/^incoming\d{4}$/.test(key)&&Object.hasOwn(plans,key)&&prefs.cohort!==key){prefs.cohort=key;persist();render();}},onViewChange(id,interactive){if(views.includes(id)&&interactive)host.document.getElementById(id+'-title')?.focus({preventScroll:true});}};
  }
  return {views,branches,fields,specialRoutes,certificates,storageKey,normalizePreferences,readPreferences,schoolCourses,renderPage,mount};
});
