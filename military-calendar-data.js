(function(root,factory){const data=factory();if(typeof module==='object'&&module.exports)module.exports=data;root.ANJWA_MILITARY_CALENDAR_DATA=data;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const sw='https://www.mma.go.kr/board/boardView.do?gesipan_id=13&gsgeul_no=1523266&mc=usr0000137';
const air='https://www.korea.kr/archive/recruitInfoView.do?dataId=374214';
const marines='https://cms.dankook.ac.kr/ko/web/tic/-12?_dku_bbs_web_BbsPortlet_action=view_message&_dku_bbs_web_BbsPortlet_bbsMessageId=158738&p_p_id=dku_bbs_web_BbsPortlet&p_p_lifecycle=0';
const navy296='https://www.mma.go.kr/board/boardView.do?gesipan_id=13&gsgeul_no=1523182&mc=usr0000137';
const recon26='https://www.rokmc.mil.kr:10005/recruit/board/139/list';
const courses=[
{id:'sw268',branch:'army',name:'특전부사관 268기 · 민간 미필',level:'individual',source:sw,sourceLabel:'특수전사령부 개별 공고 · 병무청 게시',note:'민간 미필 입영일을 표시합니다. 현역병·예비역·현역부사관 입영일과 다릅니다. 개별 공고를 우선해 연간표와 다른 접수·평가 일정을 반영했습니다.',unknown:'별도 필기시험 날짜는 이 공고의 선발 일정표에서 확인되지 않습니다. 개인별 신체검사·평가 일시와 장소는 추가 안내를 확인하세요.'},
{id:'air256',branch:'airforce',name:'공군 부사관후보생 256기 · 일반전형',level:'individual',source:air,sourceLabel:'공군 제256기 개별 공고',note:'접수는 2026년 상반기에 마감된 과정입니다. 하반기 면접·입영과 2027년 임관 흐름을 비교할 수 있습니다. 현재 지원할 기수와 구분하세요.',unknown:'면접은 지역·개인별로 지정됩니다. 현재 지원할 기수의 공고는 별도로 확인하세요.'},
{id:'sart256',branch:'airforce',name:'공군 256기 · 항공구조사(SART) 특별전형Ⅰ',level:'individual',source:air,sourceLabel:'공군 제256기 공고 및 항공구조사 특별전형 첨부',note:'특별전형Ⅰ 평가 기간과 공통 후속 일정을 표시했습니다. 일반전형 필기일을 이 과정에 자동 적용하지 않습니다.',unknown:'분야별 평가의 개인별 일시는 별도 안내 확인이 필요합니다. 일반전형 중복지원 시 해당 필기 일정도 따로 확인하세요.'},
{id:'cct256',branch:'airforce',name:'공군 256기 · 항공특수통제사(CCT) 특별전형Ⅰ',level:'individual',source:air,sourceLabel:'공군 제256기 공고 및 항공특수통제사 특별전형 첨부',note:'특별전형Ⅰ 평가 기간과 공통 후속 일정을 표시했습니다. 일반전형 필기일을 이 과정에 자동 적용하지 않습니다.',unknown:'분야별 평가의 개인별 일시는 별도 안내 확인이 필요합니다. 일반전형 중복지원 시 해당 필기 일정도 따로 확인하세요.'},
{id:'mc419',branch:'marines',name:'해병대 부사관후보생 419기',level:'annual',source:marines,sourceLabel:'해병대사령부 2026 연간계획 · 단국대 게시',note:'연간계획입니다. 개별 기수 공고·변경 공지를 다시 확인하세요. 수색 별도선발에 자동 적용하지 않습니다.',unknown:'1차 전형은 서류심사로 안내되며 별도 필기 날짜는 기재되지 않았습니다. 개인별 면접·신검 일시는 해당 기수 공고 확인이 필요합니다.'},
{id:'mc420',branch:'marines',name:'해병대 부사관후보생 420기',level:'annual',source:marines,sourceLabel:'해병대사령부 2026 연간계획 · 단국대 게시',note:'연간계획입니다. 개별 기수 공고·변경 공지를 다시 확인하세요. 수색 별도선발에 자동 적용하지 않습니다.',unknown:'1차 전형은 서류심사로 안내되며 별도 필기 날짜는 기재되지 않았습니다. 개인별 면접·신검 일시는 해당 기수 공고 확인이 필요합니다.'},
{id:'mc-pre2',branch:'marines',name:'해병대 고교예비 부사관후보생 26-2차',level:'annual',source:marines,sourceLabel:'해병대사령부 2026 연간계획 · 단국대 게시',note:'연간계획이며 입영은 420기 이후로 안내됩니다. 420기의 입영·임관일을 이 과정에 그대로 붙이지 않았습니다.',unknown:'개인별 입영·임관일은 별도 확인이 필요합니다. 1차 전형은 서류심사로 안내됩니다.'},
...[
 ['udt','해군296기 · 특전(UDT/SEAL) 부사관'],['ssu','해군296기 · 잠수(SSU) 부사관']
].map(([id,name])=>({id,branch:'navy',name,level:'individual',source:navy296,sourceLabel:'해군본부 제296기 변경 공고 · 병무청 2026.10.06',note:'변경 공고에서 특전·잠수 모집계열과 공통 선발 일정을 확인했습니다. 접수는 10월16일 마감됐습니다. 297기 등 다른 기수에 이 날짜를 적용하지 않습니다.',unknown:'특전·잠수 실기평가는 별도 진행되며 이 공고에 날짜가 없습니다. 2차 전형 세부 일정은 12월2일까지 통합모집포털 공지를 확인하세요. 임관 후 특전·잠수 양성교육에 입교하므로 입영·임관·전문교육을 구분하세요.'})),
{id:'recon',branch:'marines',name:'해병대26-2차 · 수색특기 부사관후보생',level:'individual',source:recon26,sourceLabel:'해병대 공식 모집공고 → 26-2차 수색특기',note:'수색특기 별도 모집 공고와 첨부 모집계획을 확인했습니다. 일반 부사관419·420기 연간계획과 구분합니다. 공식 목록에서 「[공고] \'26-2차 수색특기 부사관후보생 모집」을 선택하세요.',unknown:'2차 전형은 신체·인성검사·체력평가·면접의 기간입니다. 개인별 신체검사 일정은 별도 통보됩니다. 면접·체력평가는 포항지역 통합 소집으로 안내됩니다. 1차는 서류심사이며 별도 필기 날짜는 기재되지 않았습니다.'},
...[
['army-general','army','육군 일반 부사관 · 기수 미확인'],['navy-general','navy','해군 일반 부사관 · 기수 미확인'],['air-next','airforce','공군 하반기 신규접수 · 기수 미확인']
].map(([id,branch,name])=>({id,branch,name,level:'unknown',source:'https://m-recruit.mnd.go.kr/',sourceLabel:'국방통합모집포털',note:'해당 과정의 날짜 원문을 아직 확인하지 못했습니다. 다른 과정의 날짜를 대신 표시하지 않습니다.',unknown:'접수·필기·면접·합격·입소·임관 모두 해당 기수 공고 확인이 필요합니다.'}))
];
const events=[];function add(course,kind,title,start,end=start,note=''){events.push({id:course+'-'+events.length,course,kind,title,start,end,note});}
add('sw268','apply','지원서 접수','2026-10-12','2026-11-29','마감 시각은 원문 확인');
add('sw268','medical','신체검사 기간','2026-12-07','2027-01-29');
add('sw268','fitness','체력평가·검증','2027-02-22','2027-03-05');
add('sw268','documents','신원조사·인성검사(온라인)','2027-03-01','2027-03-05');
add('sw268','interview','면접평가 기간','2027-03-15','2027-03-26');
add('sw268','result','합격자 발표','2027-04-23',undefined,'공고상 10:00');
add('sw268','entry','민간 미필 입영','2027-05-10');add('sw268','commission','임관','2027-09-01');
for(const id of ['air256','sart256','cct256']){
 add(id,'apply','지원서 접수','2026-03-16','2026-04-17','이미 마감된 공고');
 if(id==='air256')add(id,'written','일반전형 필기시험','2026-05-16');else add(id,'fitness','특별전형Ⅰ 분야별 평가 기간','2026-05-04','2026-05-15','개인별 일시·평가 항목은 별도 안내 확인');
 add(id,'result','1차 합격자 발표','2026-06-12');
 add(id,'documents','추가·신체검사 서류 제출','2026-06-15','2026-07-03');
 add(id,'interview','화상면접 기간','2026-07-13','2026-07-24','개인별 일시 별도');
 add(id,'result','최종 합격자 발표','2026-08-14');
 add(id,'entry','입영전형 기간','2026-10-06','2026-10-09');
 add(id,'entry','기본군사훈련 시작','2026-10-12');
 add(id,'commission','임관','2027-01-01');
}
for(const [id,applyStart,applyEnd,first,interviewStart,interviewEnd,result,entry,commission] of [
 ['mc419','2026-08-21','2026-09-18','2026-10-08','2026-10-19','2026-10-30','2026-11-20','2026-12-21','2027-03-05'],
 ['mc420','2026-11-13','2026-12-11','2026-12-24','2027-01-11','2027-01-22','2027-02-05','2027-03-08','2027-05-21']
]){add(id,'apply','지원·접수',''+applyStart,applyEnd);add(id,'result','1차 발표',first);add(id,'interview','면접·신체검사 기간',interviewStart,interviewEnd);add(id,'result','최종 발표',result);add(id,'entry','입영',entry);add(id,'commission','임관',commission);}
for(const id of ['udt','ssu']){
 add(id,'apply','지원서 접수·서류 등록','2026-09-02','2026-10-16','09:00 시작 · 마감일17:00 (한국시간), 변경 공고 기준');
 add(id,'documents','1차 지원자격 확인·서류전형','2026-10-28','2026-11-13');
 add(id,'result','1차 합격자 발표','2026-11-19',undefined,'공고상14:00');
 add(id,'documents','신원조사 서류 등록','2026-11-20','2026-12-03');
 add(id,'interview','2차전형(신체·인성검사·면접 등)','2026-12-07','2026-12-18','특전·잠수 실기평가일은 별도 진행. 이 기간을 실기일로 해석하지 마세요.');events.at(-1).alsoKinds=['medical'];
 add(id,'result','최종 합격자 발표','2027-03-02',undefined,'공고상14:00');
 add(id,'entry','입영','2027-03-15');add(id,'commission','임관','2027-05-14');
}
add('recon','apply','수색특기 지원서 접수·제출','2026-08-31','2026-09-28');
add('recon','documents','수색특기 신원조사','2026-09-28','2026-10-08');
add('recon','result','수색특기 1차 합격자 발표','2026-10-02');
add('recon','interview','수색특기 2차전형(신체·인성·체력·면접)','2026-10-06','2026-10-23','개인별 신체검사일은 별도 통보. 체력 오전·면접 오후, 개인별 지정일 확인');events.at(-1).alsoKinds=['medical','fitness'];
add('recon','result','수색특기 최종 합격자 발표','2026-11-27');
add('recon','entry','수색특기 입영','2026-12-14');add('recon','commission','수색특기 임관','2027-02-26');
add('mc-pre2','apply','고교예비 지원·접수','2026-09-01','2026-10-02');add('mc-pre2','result','1차 발표','2026-10-16');add('mc-pre2','interview','면접·신체검사 기간','2026-10-19','2026-10-30');add('mc-pre2','result','최종 발표','2026-12-04');
return{checkedAt:'2026-11-11',courses,events};
});
