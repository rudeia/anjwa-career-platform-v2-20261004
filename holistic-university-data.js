// 대학별 시행계획과 어디가 공개 평가기준을 대조한 비교표(2026-11-26).
// 학교별 source는 2028 시행계획, reference는 2027년 공개 자료입니다.
window.ANJWA_HOLISTIC_UNIVERSITY_DATA = {
  "year": 2028,
  "checkedOn": "2026-11-26",
  "referenceYear": 2027,
  "schools": [
    {
      "id": "snu",
      "name": "서울대",
      "group": "수도권 주요 대학",
      "aliases": [
        "서울대",
        "서울대학교"
      ],
      "source": {
        "label": "대학 입학처 2028 시행계획",
        "url": "https://admission.snu.ac.kr/undergraduate/notice?bbsidx=168854&md=v"
      },
      "tracks": [
        {
          "name": "일반전형",
          "stage": "서류 100% · 2배수",
          "documentPercent": 50.0,
          "interviewPercent": 50.0,
          "interviewMethod": "분석적 주제토론·융합적 과제수행 등 모집단위별 방식",
          "minimum": "미적용",
          "documentCriteria": "권장과목 이수 여부를 교육과정 이수 맥락과 함께 서류평가에 반영",
          "criterionStatus": "과목 안내 공개",
          "scope": "사범대는 면접 50점 중 교직적성·인성 20점. 미술·음악 일부 별도",
          "location": "PDF 9~12쪽, 권장과목 PDF 37쪽 이후",
          "selectionNote": "사범대는 면접 50점에 교직적성·인성 20점이 포함됩니다. 미술·음악대의 일부 모집단위는 별도 기준을 적용합니다."
        },
        {
          "name": "지역균형전형",
          "stage": "서류 100% · 3배수",
          "documentPercent": 70.0,
          "interviewPercent": 30.0,
          "interviewMethod": "모집단위별 면접. 사범대는 교직적성·인성 포함",
          "minimum": "미적용",
          "documentCriteria": "권장과목 이수 여부를 교육과정 이수 맥락과 함께 서류평가에 반영",
          "criterionStatus": "과목 안내 공개",
          "scope": "고등학교별로 3명까지 학교장 추천을 받을 수 있습니다. 지원 가능한 학교 유형은 원문에서 확인하세요.",
          "location": "PDF 8쪽, 권장과목 PDF 37쪽 이후"
        }
      ],
      "reference": {
        "url": "https://www.adiga.kr/ucp/uvt/uni/univDetailSelection.do?menuId=PCUVTINF2000&searchSyr=2027&unvCd=0000019",
        "tracks": [
          {
            "name": "수시 일반전형·지역균형전형",
            "criteria": "학업역량 7등급, 학업태도 3등급, 학업외소양 3등급",
            "note": "요소별 고정 반영비율 없이 종합해서 최종 서류등급 부여"
          }
        ]
      }
    },
    {
      "id": "yonsei",
      "name": "연세대(서울)",
      "group": "수도권 주요 대학",
      "aliases": [
        "연세대",
        "연세대학교",
        "연대"
      ],
      "source": {
        "label": "대학 입학처 2028 시행계획",
        "url": "https://www2.yonsei.ac.kr/entrance/plan/2028_plan.pdf"
      },
      "tracks": [
        {
          "name": "종합인재형",
          "stage": "서류 100% · 4배수",
          "documentPercent": 70.0,
          "interviewPercent": 30.0,
          "interviewMethod": "제시문 기반. 일부 국제계열 영어 구술",
          "minimum": "인문은 국어·수학·사회탐구·과학탐구 중 2합 4(국어와 수학 중 하나 이상 포함). 일반 자연은 같은 과목 중 2합 5(수학 포함). 영어 3등급, 한국사 4등급 이내입니다. 의·치·약학, 통합, 국제는 별도 기준을 적용합니다.",
          "documentCriteria": "제출 서류 종합평가",
          "criterionStatus": "세부 영역·배점 미기재",
          "scope": "일부 언더우드학부에는 수능최저를 적용하지 않습니다. 국제계열은 해당 모집단위의 기준을 확인하세요.",
          "location": "PDF 17쪽(인쇄 13쪽)"
        },
        {
          "name": "탐구인재형",
          "stage": "서류 100% · 일반 4배수, 국제 3배수",
          "documentPercent": 60.0,
          "interviewPercent": 40.0,
          "interviewMethod": "제시문 기반. 국제 트랙은 영어 제시문 가능",
          "minimum": "미적용",
          "documentCriteria": "제출 서류 종합평가",
          "criterionStatus": "세부 영역·배점 미기재",
          "scope": "국제 트랙은 외국고, 국제학교, 검정고시 등 지원자격을 확인하세요. 국내 일반고 출신이 언더우드국제대학에 지원할 때는 종합인재형을 선택합니다.",
          "location": "PDF 18쪽(인쇄 14쪽)"
        }
      ],
      "reference": {
        "url": "https://www.adiga.kr/ucp/uvt/uni/univDetailSelection.do?menuId=PCUVTINF2000&searchSyr=2027&unvCd=0000149",
        "tracks": [
          {
            "name": "활동우수형·국제형·국제인재 등",
            "criteria": "종합평가Ⅰ 70%(학업역량+진로역량), 종합평가Ⅱ 30%(공동체역량)",
            "note": "2028년에 전형명과 모집구조가 개편됨"
          }
        ]
      }
    },
    {
      "id": "korea",
      "name": "고려대(서울)",
      "group": "수도권 주요 대학",
      "aliases": [
        "고려대",
        "고려대학교",
        "고대"
      ],
      "source": {
        "label": "고려대 입학처 2028 시행계획",
        "url": "https://oku.korea.ac.kr/oku/cms/FR_BBS_CON/BoardView.do?BBS_SEQ=1791&BOARD_SEQ=5&CONTENTS_NO=2&MENU_ID=750&SITE_NO=2"
      },
      "tracks": [
        {
          "name": "학업우수전형",
          "stage": "서류 100% · 5배수",
          "documentPercent": 80.0,
          "interviewPercent": 20.0,
          "interviewMethod": "학생부 기반",
          "minimum": "4합 9 및 한국사 4 이내. 의학과 4합 5 및 한국사 4 이내",
          "documentCriteria": "학생부 종합평가",
          "criterionStatus": "세부 영역·배점 미기재",
          "scope": "2028학년도에는 학교추천전형과 함께 지원할 수 있습니다. 수능 탐구 영역의 반영 방식은 원문을 확인하세요.",
          "location": "PDF 3·13쪽"
        },
        {
          "name": "계열적합전형",
          "stage": "일괄",
          "documentPercent": 100.0,
          "interviewPercent": 0.0,
          "interviewMethod": "없음",
          "minimum": "미적용",
          "documentCriteria": "학생부 종합평가",
          "criterionStatus": "세부 영역·배점 미기재",
          "scope": "2028 시행계획의 일괄합산 기준",
          "location": "PDF 14쪽"
        }
      ],
      "reference": {
        "url": "https://www.adiga.kr/ucp/uvt/uni/univDetailSelection.do?menuId=PCUVTINF2000&searchSyr=2027&unvCd=0000069",
        "tracks": [
          {
            "name": "학업우수전형",
            "criteria": "학업역량 50점, 자기계발역량 30점, 공동체역량 20점",
            "note": "공개 배점 100점 기준"
          },
          {
            "name": "계열적합전형",
            "criteria": "학업역량 40점, 자기계발역량 40점, 공동체역량 20점",
            "note": "2028 시행계획 전형방법은 별도로 확인"
          }
        ]
      }
    },
    {
      "id": "sogang",
      "name": "서강대",
      "group": "수도권 주요 대학",
      "aliases": [
        "서강대",
        "서강대학교"
      ],
      "source": {
        "label": "어디가 2028 시행계획 모음집 3",
        "url": "https://www.adiga.kr/uct/ces/archiveView.do?menuId=PCUCTCES1000&prtlBbsId=27035"
      },
      "tracks": [
        {
          "name": "일반Ⅰ",
          "stage": "일괄",
          "documentPercent": 100.0,
          "interviewPercent": 0.0,
          "interviewMethod": "없음",
          "minimum": "미적용",
          "documentCriteria": "서류평가",
          "criterionStatus": "세부 영역·배점 미기재",
          "scope": "일반Ⅱ와 같은 방식으로 서류를 평가합니다. 일반Ⅰ에는 수능최저를 적용하지 않습니다.",
          "location": "11쪽"
        },
        {
          "name": "일반Ⅱ",
          "stage": "일괄",
          "documentPercent": 100.0,
          "interviewPercent": 0.0,
          "interviewMethod": "없음",
          "minimum": "3합 7 및 한국사 4 이내",
          "documentCriteria": "서류평가",
          "criterionStatus": "세부 영역·배점 미기재",
          "scope": "탐구 1과목 반영",
          "location": "11쪽"
        }
      ],
      "reference": {
        "url": "https://www.adiga.kr/ucp/uvt/uni/univDetailSelection.do?menuId=PCUVTINF2000&searchSyr=2027&unvCd=0000120",
        "tracks": [
          {
            "name": "일반Ⅰ·일반Ⅱ",
            "criteria": "학업역량 50%, 공동체역량 20%, 성장가능성 30%",
            "note": "2027 공개자료에서는 학생부종합 전 전형 공통"
          }
        ]
      }
    },
    {
      "id": "skku",
      "name": "성균관대",
      "group": "수도권 주요 대학",
      "aliases": [
        "성균관대",
        "성균관대학교",
        "성대"
      ],
      "source": {
        "label": "어디가 2028 시행계획 모음집 3",
        "url": "https://www.adiga.kr/uct/ces/archiveView.do?menuId=PCUCTCES1000&prtlBbsId=27035"
      },
      "tracks": [
        {
          "name": "융합인재",
          "stage": "일괄",
          "documentPercent": 100.0,
          "interviewPercent": 0.0,
          "interviewMethod": "없음",
          "minimum": "국·수·영·사탐·과탐 중 3합 6",
          "documentCriteria": "학생부평가",
          "criterionStatus": "세부 영역·배점 미기재",
          "scope": "수시 기준. 필수응시영역은 원문 확인",
          "location": "수시모집 공통사항 및 학생부종합 [융합인재]"
        },
        {
          "name": "탐구인재",
          "stage": "일괄",
          "documentPercent": 100.0,
          "interviewPercent": 0.0,
          "interviewMethod": "없음",
          "minimum": "미적용",
          "documentCriteria": "학생부평가",
          "criterionStatus": "세부 영역·배점 미기재",
          "scope": "수시 기준",
          "location": "학생부종합 [탐구인재]"
        },
        {
          "name": "성균인재",
          "stage": "서류 100% · 3/5/6/7배수",
          "documentPercent": 70.0,
          "interviewPercent": 30.0,
          "interviewMethod": "인·적성 면접",
          "minimum": "미적용",
          "documentCriteria": "학생부평가",
          "criterionStatus": "세부 영역·배점 미기재",
          "scope": "일반 성균인재. 성균인재-지역인재는 별도 전형",
          "location": "학생부종합 [성균인재]"
        },
        {
          "name": "과학인재",
          "stage": "서류 100% · 7배수",
          "documentPercent": 70.0,
          "interviewPercent": 30.0,
          "interviewMethod": "제시문 기반 수학·과학 교과형",
          "minimum": "미적용",
          "documentCriteria": "학생부평가",
          "criterionStatus": "세부 영역·배점 미기재",
          "scope": "모집단위와 제시문 범위는 모집요강으로 확인",
          "location": "학생부종합 [과학인재]"
        }
      ],
      "reference": {
        "url": "https://www.adiga.kr/ucp/uvt/uni/univDetailSelection.do?menuId=PCUVTINF2000&searchSyr=2027&unvCd=0000133",
        "tracks": [
          {
            "name": "학생부종합 전 전형",
            "criteria": "학업수월성·학업충실성·탐구확장성·탐구주도성 각 200점, 미래성장성·공동체의식 각 100점",
            "note": "합계 1,000점"
          }
        ]
      }
    },
    {
      "id": "hanyang",
      "name": "한양대(서울)",
      "group": "수도권 주요 대학",
      "aliases": [
        "한양대",
        "한양대학교"
      ],
      "source": {
        "label": "어디가 2028 시행계획 모음집 4",
        "url": "https://www.adiga.kr/uct/ces/archiveView.do?menuId=PCUCTCES1000&prtlBbsId=27036"
      },
      "tracks": [
        {
          "name": "학업형",
          "stage": "일괄",
          "documentPercent": 100.0,
          "interviewPercent": 0.0,
          "interviewMethod": "없음",
          "minimum": "자연·상경계열과 한양인터칼리지학부는 수학을 포함해 3합 7입니다. 다른 일반 모집단위는 3합 7이며, 의예과는 3합 4입니다.",
          "documentCriteria": "교육과정 이수 충실성, 종합성취도, 핵심역량",
          "criterionStatus": "평가 내용 공개",
          "scope": "자연계열, 상경계열, 한양인터칼리지학부는 수능최저를 계산할 때 수학을 포함합니다.",
          "location": "PDF 14·35쪽"
        },
        {
          "name": "면접형",
          "stage": "서류 100% · 3~5배수 내외",
          "documentPercent": 70.0,
          "interviewPercent": 30.0,
          "interviewMethod": "대상 공학계열 등 제시문 기반, 정책학과 학생부 기반",
          "minimum": "미적용",
          "documentCriteria": "교육과정 이수 충실성, 종합성취도, 핵심역량",
          "criterionStatus": "평가 내용 공개",
          "scope": "모집단위별 면접 방식 확인",
          "location": "PDF 15·35쪽"
        }
      ],
      "reference": {
        "url": "https://www.adiga.kr/ucp/uvt/uni/univDetailSelection.do?menuId=PCUVTINF2000&searchSyr=2027&unvCd=0000203",
        "tracks": [
          {
            "name": "추천형·면접형",
            "criteria": "종합역량평가 30%, 성취역량평가 70%",
            "note": "성취역량평가의 관점은 기초·심층학업, 진로탐구, 공동체. 추천형은 2027 전형명"
          }
        ]
      }
    },
    {
      "id": "cau",
      "name": "중앙대",
      "group": "수도권 주요 대학",
      "aliases": [
        "중앙대",
        "중앙대학교"
      ],
      "source": {
        "label": "대학 입학처 2028 시행계획",
        "url": "https://admission.cau.ac.kr/detail.do?menuurl=n5%2FP1yX8Zyh%2Fvtvla1KeyA%3D%3D&board_seq=3310&pageNo=1&categoryid=65",
        "supplement": {
          "label": "중앙대 2028 서류 평가 안내",
          "url": "https://admission.cau.ac.kr/files/2028/cau_formula_2028.pdf"
        }
      },
      "tracks": [
        {
          "name": "탐구하는 학종(Core)",
          "stage": "서류 100% · 모집단위별 3~6배수",
          "documentPercent": 60.0,
          "interviewPercent": 40.0,
          "interviewMethod": "서류 기반 개인별 심층면접. 학업 준비도·계열 탐구 경험",
          "minimum": "미적용",
          "documentCriteria": "공통 학업역량·공동체역량과 CORE역량(계열 교과 탐구·계열 적합)",
          "criterionStatus": "평가 내용 공개",
          "scope": "학교생활기록부 등을 바탕으로 계열 적합성·학교생활 충실성도 평가",
          "location": "16쪽, CAU FORMULA 2028 전형별 평가 안내"
        },
        {
          "name": "모두의 학종(All)",
          "stage": "서류 100% · 모집단위별 3~6배수",
          "documentPercent": 60.0,
          "interviewPercent": 40.0,
          "interviewMethod": "서류 기반 개인별 심층면접. 학업 준비도·학교생활·의사소통 등",
          "minimum": "미적용",
          "documentCriteria": "공통 학업역량·공동체역량과 ALL역량(전 교과 탐구·경험 다양성)",
          "criterionStatus": "평가 내용 공개",
          "scope": "고른 학업 성취와 교내 활동에서의 균형 있는 성장에 주목",
          "location": "17쪽, CAU FORMULA 2028 전형별 평가 안내"
        },
        {
          "name": "최저 있는 학종(Up)",
          "stage": "일괄 · 의학부 별도",
          "documentPercent": 100.0,
          "interviewPercent": 0.0,
          "interviewMethod": "일반 없음. 의학부 서류 기반 심층면접",
          "minimum": "일반 기준은 3합 6과 한국사 4등급 이내입니다. 의학부와 약학부는 별도 기준을 적용합니다.",
          "documentCriteria": "공통 학업역량·공동체역량과 UP역량(기본 교과 탐구·자습 활용)",
          "criterionStatus": "평가 내용 공개",
          "scope": "의학부는 서류 100%로 1단계에서 5배수를 선발합니다. 영어와 과학탐구 등급을 계산하는 예외 조건은 원문을 확인하세요.",
          "location": "18쪽, CAU FORMULA 2028 전형별 평가 안내",
          "selectionNote": "의학부를 제외한 모집단위의 비율입니다. 의학부는 2단계에서 1단계 성적 60%와 면접 40%를 반영합니다."
        }
      ],
      "reference": {
        "url": "https://www.adiga.kr/ucp/uvt/uni/univDetailSelection.do?menuId=PCUVTINF2000&searchSyr=2027&unvCd=0000175",
        "tracks": [
          {
            "name": "탐구형인재",
            "criteria": "학업역량 40%, 진로역량 50%, 공동체역량 10%",
            "note": "2027 전형명과 평가요소. 2028에는 Core·All·Up으로 개편"
          },
          {
            "name": "융합형인재·성장형인재",
            "criteria": "학업역량 50%, 진로역량 30%, 공동체역량 20%",
            "note": "2027 전형명과 평가요소. 2028에는 Core·All·Up으로 개편"
          }
        ]
      }
    },
    {
      "id": "khu",
      "name": "경희대",
      "group": "수도권 주요 대학",
      "aliases": [
        "경희대",
        "경희대학교"
      ],
      "source": {
        "label": "대학 입학처 2028 시행계획",
        "url": "https://iphak.khu.ac.kr/detail.do?board_seq=17147&menuurl=wvOt10B5et6zMa%2FM59G%2BxQ%3D%3D&pageNo=1"
      },
      "tracks": [
        {
          "name": "네오르네상스 면접형",
          "stage": "서류 100% · 일반 4배수, 의학계열·약학 5배수",
          "documentPercent": 70.0,
          "interviewPercent": 30.0,
          "interviewMethod": "공통질문 및 학생부 확인 면접(약 10분). 별도 출제문항 없음",
          "minimum": "미적용",
          "documentCriteria": "일반학과 학업·진로·공동체, 자율·자유전공은 진로 대신 자기주도역량",
          "criterionStatus": "평가 요소 공개",
          "scope": "교과 이수 권장과목 평가 안내와 모집단위별 조건 확인",
          "location": "24~25쪽, 52~54쪽"
        },
        {
          "name": "네오르네상스 서류형",
          "stage": "일괄",
          "documentPercent": 100.0,
          "interviewPercent": 0.0,
          "interviewMethod": "없음",
          "minimum": "일반 2합 5, 의학계열·약학 3합 4. 한국사 5 이내",
          "documentCriteria": "일반학과 학업·진로·공동체, 자율·자유전공은 진로 대신 자기주도역량",
          "criterionStatus": "평가 요소 공개",
          "scope": "탐구는 성적이 높은 한 과목을 반영합니다. 대학이 안내한 권장 이수 과목도 확인하세요.",
          "location": "26~27쪽, 52~54쪽"
        }
      ],
      "reference": {
        "url": "https://www.adiga.kr/ucp/uvt/uni/univDetailSelection.do?menuId=PCUVTINF2000&searchSyr=2027&unvCd=0000066",
        "tracks": [
          {
            "name": "네오르네상스, 일반학과",
            "criteria": "학업역량 40%, 진로역량 40%, 공동체역량 20%",
            "note": "학업 25+15, 진로 25+15, 공동체 10+10으로 합산"
          },
          {
            "name": "네오르네상스, 자율·자유전공학부",
            "criteria": "학업역량 40%, 자기주도역량 40%, 공동체역량 20%",
            "note": "자기주도 25+15로 합산"
          }
        ]
      }
    },
    {
      "id": "hufs",
      "name": "한국외대",
      "group": "수도권 주요 대학",
      "aliases": [
        "한국외대",
        "한국외국어대학교",
        "외대",
        "한국외국어대"
      ],
      "source": {
        "label": "어디가 2028 시행계획 모음집 4",
        "url": "https://www.adiga.kr/uct/ces/archiveView.do?menuId=PCUCTCES1000&prtlBbsId=27036"
      },
      "tracks": [
        {
          "name": "학생부종합전형(면접형)",
          "stage": "서류 100% · 3배수",
          "documentPercent": 50.0,
          "interviewPercent": 50.0,
          "interviewMethod": "제출서류 기반 개별 블라인드 인·적성",
          "minimum": "미적용",
          "documentCriteria": "학생부 등 제출서류 기반 정성적·종합적 역량 평가",
          "criterionStatus": "세부 영역·배점 미기재",
          "scope": "서울캠퍼스 중심 비교",
          "location": "PDF 10쪽"
        },
        {
          "name": "학생부종합전형(서류형)",
          "stage": "일괄",
          "documentPercent": 100.0,
          "interviewPercent": 0.0,
          "interviewMethod": "없음",
          "minimum": "2합 6 또는 7. 모집단위별 기준 확인",
          "documentCriteria": "학생부 등 제출서류 기반 정성적·종합적 역량 평가",
          "criterionStatus": "세부 영역·배점 미기재",
          "scope": "서울캠퍼스는 2합 6, 글로벌캠퍼스는 2합 7입니다. 국어, 수학, 영어, 탐구(통합사회 또는 통합과학 한 과목) 중에서 봅니다.",
          "location": "PDF 12쪽"
        }
      ],
      "reference": {
        "url": "https://www.adiga.kr/ucp/uvt/uni/univDetailSelection.do?menuId=PCUVTINF2000&searchSyr=2027&unvCd=0000192",
        "tracks": [
          {
            "name": "학생부종합전형(면접형)·SW인재",
            "criteria": "학업역량 30, 진로역량 50, 공동체역량 20",
            "note": "서류 평가요소별 공개 비율"
          },
          {
            "name": "학생부종합전형(서류형)",
            "criteria": "학업역량 50, 진로역량 30, 공동체역량 20",
            "note": "서류 평가요소별 공개 비율"
          }
        ]
      }
    },
    {
      "id": "uos",
      "name": "서울시립대",
      "group": "수도권 주요 대학",
      "aliases": [
        "서울시립대",
        "서울시립대학교"
      ],
      "source": {
        "label": "어디가 2028 시행계획 모음집 3",
        "url": "https://www.adiga.kr/uct/ces/archiveView.do?menuId=PCUCTCES1000&prtlBbsId=27035"
      },
      "tracks": [
        {
          "name": "학생부종합전형",
          "stage": "서류 100% · 3배수",
          "documentPercent": 50.0,
          "interviewPercent": 50.0,
          "interviewMethod": "역량 중심 면접. 종합적 사고·문제해결·의사소통 등",
          "minimum": "미적용",
          "documentCriteria": "학생부 전 영역에서 학업역량, 잠재역량, 사회역량 평가",
          "criterionStatus": "평가 요소 공개",
          "scope": "2028 시행계획에서 별도 서류형 폐지",
          "location": "PDF 3·11쪽"
        }
      ],
      "reference": {
        "url": "https://www.adiga.kr/ucp/uvt/uni/univDetailSelection.do?menuId=PCUVTINF2000&searchSyr=2027&unvCd=0000040",
        "tracks": [
          {
            "name": "학생부종합전형Ⅰ",
            "criteria": "학업역량 35%, 잠재역량 40%, 사회역량 25%",
            "note": "2027년 면접형 기준. 2028년에는 단일 학생부종합전형"
          },
          {
            "name": "학생부종합전형Ⅱ",
            "criteria": "학업역량 30%, 잠재역량 50%, 사회역량 20%",
            "note": "2027년 서류형 기준. 2028 계획에서 별도 서류형 폐지"
          }
        ]
      }
    },
    {
      "id": "ewha",
      "name": "이화여대",
      "group": "수도권 주요 대학",
      "aliases": [
        "이화여대",
        "이화여자대학교",
        "이대"
      ],
      "source": {
        "label": "대학 입학처 2028 시행계획",
        "url": "https://admission.ewha.ac.kr/admission/html/ewharo/noticeView.asp?idx=15320"
      },
      "tracks": [
        {
          "name": "미래인재전형-서류형",
          "stage": "일괄",
          "documentPercent": 100.0,
          "interviewPercent": 0.0,
          "interviewMethod": "없음",
          "minimum": "일반 3합 7. 의예 4합 5, 약학전공 4합 6, 스크랜튼 3합 5, 국제학부 별도",
          "documentCriteria": "교과·비교과에서 학업역량, 진로역량, 발전가능성 평가",
          "criterionStatus": "평가 요소 공개",
          "scope": "탐구는 성적이 높은 한 영역을 반영합니다. 본인이 지원할 모집단위의 수능최저를 확인하세요.",
          "location": "11쪽"
        },
        {
          "name": "미래인재전형-면접형",
          "stage": "서류 100% · 5배수",
          "documentPercent": 70.0,
          "interviewPercent": 30.0,
          "interviewMethod": "제출서류 기반 일반면접. 학업·진로역량, 의사소통 등",
          "minimum": "미적용",
          "documentCriteria": "교과·비교과에서 학업역량, 진로역량, 발전가능성 평가",
          "criterionStatus": "평가 요소 공개",
          "scope": "서류형과 수능최저·전형방법이 다름",
          "location": "3·11쪽"
        }
      ],
      "reference": {
        "url": "https://www.adiga.kr/ucp/uvt/uni/univDetailSelection.do?menuId=PCUVTINF2000&searchSyr=2027&unvCd=0000163",
        "tracks": [
          {
            "name": "미래인재전형-서류형",
            "criteria": "학업역량 30, 학교활동의 우수성 40, 발전가능성 30",
            "note": "2028 시행계획의 평가 용어와 차이 있음"
          },
          {
            "name": "미래인재전형-면접형",
            "criteria": "학업역량 20, 학교활동의 우수성 60, 발전가능성 20",
            "note": "2028 시행계획의 평가 용어와 차이 있음"
          }
        ]
      }
    },
    {
      "id": "konkuk",
      "name": "건국대(서울)",
      "group": "수도권 주요 대학",
      "aliases": [
        "건국대",
        "건국대학교"
      ],
      "source": {
        "label": "어디가 2028 시행계획 모음집 1",
        "url": "https://www.adiga.kr/uct/ces/archiveView.do?menuId=PCUCTCES1000&prtlBbsId=27033"
      },
      "tracks": [
        {
          "name": "KU자기추천",
          "stage": "서류 100% · 3배수",
          "documentPercent": 70.0,
          "interviewPercent": 30.0,
          "interviewMethod": "제출서류 기반 개별 블라인드 면접",
          "minimum": "미적용",
          "documentCriteria": "학업역량·진로역량·공동체역량. KU자유전공학부는 진로 대신 성장역량",
          "criterionStatus": "평가 요소 공개",
          "scope": "과목 성취·이수 노력, 탐구, 협업 등을 정성평가. 준비 과정과 활동 이후 변화도 살핌",
          "location": "PDF 19·50~52쪽"
        }
      ],
      "reference": {
        "url": "https://www.adiga.kr/ucp/uvt/uni/univDetailSelection.do?menuId=PCUVTINF2000&searchSyr=2027&unvCd=0000052",
        "tracks": [
          {
            "name": "KU자기추천, 일반 모집단위",
            "criteria": "학업역량 30%, 진로역량 40%, 공동체역량 30%",
            "note": "KU자유전공학부는 다른 기준"
          },
          {
            "name": "KU자기추천, KU자유전공학부",
            "criteria": "학업역량 20%, 성장역량 50%, 공동체역량 30%",
            "note": "성장역량은 자기주도성·창의적 문제해결력·경험의 다양성 등을 평가"
          }
        ]
      }
    },
    {
      "id": "dgu",
      "name": "동국대(서울)",
      "group": "수도권 주요 대학",
      "aliases": [
        "동국대",
        "동국대학교"
      ],
      "source": {
        "label": "어디가 2028 시행계획 모음집 2",
        "url": "https://www.adiga.kr/uct/ces/archiveView.do?menuId=PCUCTCES1000&prtlBbsId=27034"
      },
      "tracks": [
        {
          "name": "Do Dream",
          "stage": "서류 100% · 2.5/3/3.5배수",
          "documentPercent": 60.0,
          "interviewPercent": 40.0,
          "interviewMethod": "제출서류 기반 개별 일반면접 약 10분",
          "minimum": "미적용",
          "documentCriteria": "학교생활충실도(학업역량+전공적합성/진로역량) 80% 내외, 인성 및 사회성 20% 내외",
          "criterionStatus": "배점 공개",
          "scope": "시행계획은 학업역량과 전공적합성을 학교생활충실도로 묶어 배점을 제시합니다.",
          "location": "전형 요약, 서류종합평가 및 면접평가"
        }
      ],
      "reference": {
        "url": "https://www.adiga.kr/ucp/uvt/uni/univDetailSelection.do?menuId=PCUVTINF2000&searchSyr=2027&unvCd=0000100",
        "tracks": [
          {
            "name": "Do Dream",
            "criteria": "학업역량 30%, 전공적합성 50%, 인성 및 사회성 20%",
            "note": "2028 시행계획은 학교생활충실도 80% 내외·인성 및 사회성 20% 내외로 제시"
          }
        ]
      }
    },
    {
      "id": "hongik",
      "name": "홍익대(서울)",
      "group": "수도권 주요 대학",
      "aliases": [
        "홍익대",
        "홍익대학교"
      ],
      "source": {
        "label": "어디가 2028 시행계획 모음집 4",
        "url": "https://www.adiga.kr/uct/ces/archiveView.do?menuId=PCUCTCES1000&prtlBbsId=27036"
      },
      "tracks": [
        {
          "name": "학교생활우수자(서류형)",
          "stage": "일괄",
          "documentPercent": 100.0,
          "interviewPercent": 0.0,
          "interviewMethod": "없음",
          "minimum": "서울 일반 2합 5 및 한국사 4 이내",
          "documentCriteria": "학교생활기록부 서류평가",
          "criterionStatus": "세부 영역·배점 미기재",
          "scope": "서울캠퍼스 일반 모집 기준. 미술계열 별도",
          "location": "PDF 10쪽"
        },
        {
          "name": "학교생활우수자(면접형)",
          "stage": "서류 100% · 5배수",
          "documentPercent": 50.0,
          "interviewPercent": 50.0,
          "interviewMethod": "진로역량·소통역량·제출서류 진실성 평가",
          "minimum": "미적용",
          "documentCriteria": "학교생활기록부 서류평가",
          "criterionStatus": "세부 영역·배점 미기재",
          "scope": "서울캠퍼스 일반 모집 기준. 면접 평가 항목과 서류 평가 항목 구분",
          "location": "PDF 11쪽"
        }
      ],
      "reference": {
        "url": "https://www.adiga.kr/ucp/uvt/uni/univDetailSelection.do?menuId=PCUVTINF2000&searchSyr=2027&unvCd=0000212",
        "tracks": [
          {
            "name": "학교생활우수자",
            "criteria": "학업역량 40%, 진로역량 40%, 공동체역량 20%",
            "note": "2027 전형 기준. 2028 서류형·면접형에 그대로 적용 여부는 확인 필요"
          }
        ]
      }
    },
    {
      "id": "sookmyung",
      "name": "숙명여대",
      "group": "수도권 주요 대학",
      "aliases": [
        "숙명여대",
        "숙명여자대학교",
        "숙대"
      ],
      "source": {
        "label": "어디가 2028 시행계획 모음집 3",
        "url": "https://www.adiga.kr/uct/ces/archiveView.do?menuId=PCUCTCES1000&prtlBbsId=27035"
      },
      "tracks": [
        {
          "name": "숙명인재(면접형)",
          "stage": "서류 100% · 4배수",
          "documentPercent": 70.0,
          "interviewPercent": 30.0,
          "interviewMethod": "면접을 실시합니다. 확인한 시행계획에는 구체적인 면접 방식이 나와 있지 않습니다.",
          "minimum": "미적용",
          "documentCriteria": "서류평가",
          "criterionStatus": "세부 영역·배점 미기재",
          "scope": "모집요강에서 지원자격을 확인하세요.",
          "location": "PDF 5·9쪽"
        },
        {
          "name": "소프트웨어인재",
          "stage": "서류 100% · 4배수",
          "documentPercent": 70.0,
          "interviewPercent": 30.0,
          "interviewMethod": "면접을 실시합니다. 확인한 시행계획에는 구체적인 면접 방식이 나와 있지 않습니다.",
          "minimum": "미적용",
          "documentCriteria": "서류평가",
          "criterionStatus": "세부 영역·배점 미기재",
          "scope": "인공지능공학부·컴퓨터과학전공·데이터사이언스전공",
          "location": "PDF 5·9쪽"
        }
      ],
      "reference": {
        "url": "https://www.adiga.kr/ucp/uvt/uni/univDetailSelection.do?menuId=PCUVTINF2000&searchSyr=2027&unvCd=0000141",
        "tracks": [
          {
            "name": "숙명인재(면접형)·소프트웨어인재",
            "criteria": "진로역량 45%, 탐구역량 35%, 공동체의식과 협업능력 20%",
            "note": "서류 평가요소별 공개 비율"
          }
        ]
      }
    },
    {
      "id": "kangwon",
      "name": "강원대(춘천)",
      "group": "지역 거점국립대",
      "aliases": [
        "강원대",
        "강원대학교"
      ],
      "source": {
        "label": "대학 입학처 2028 시행계획",
        "url": "https://admission.kangwon.ac.kr/DATA/download/admission/2028c_basic.pdf"
      },
      "tracks": [
        {
          "name": "미래인재서류전형",
          "stage": "일괄",
          "documentPercent": 100.0,
          "interviewPercent": 0.0,
          "interviewMethod": "없음",
          "minimum": "일반 미적용. 간호학과·수의학과 적용",
          "documentCriteria": "학업 50%, 진로 30%, 공동체 20%. 자유전공학부는 진로 대신 자기주도 30%",
          "criterionStatus": "배점 공개",
          "scope": "춘천캠퍼스. 통합 강원대의 다른 캠퍼스는 별도 시행계획",
          "location": "춘천 시행계획 미래인재서류전형, 최저 p.32"
        },
        {
          "name": "미래인재면접전형",
          "stage": "서류 100% · 4배수 이내. 모집 6명 이상 3배수 이내",
          "documentPercent": 60.0,
          "interviewPercent": 40.0,
          "interviewMethod": "학생부 기반 개별 면접 약 10분",
          "minimum": "미적용",
          "documentCriteria": "학업 30%, 진로 50%, 공동체 20%. 자유전공학부는 진로 대신 자기주도 50%",
          "criterionStatus": "배점 공개",
          "scope": "춘천캠퍼스 기준입니다. 서류와 면접에서 각 역량을 같은 비율로 평가합니다.",
          "location": "춘천 시행계획 미래인재면접전형, 면접고사"
        }
      ],
      "reference": {
        "url": "https://www.adiga.kr/ucp/uvt/uni/univDetailSelection.do?menuId=PCUVTINF2000&searchSyr=2027&unvCd=0000003",
        "tracks": [
          {
            "name": "미래인재서류전형",
            "criteria": "학업역량 40%, 진로역량 30%, 공동체역량 30%",
            "note": "춘천 기준. 자유전공학부는 진로 대신 자기주도역량. 2028의 50·30·20과 구분"
          },
          {
            "name": "미래인재면접전형",
            "criteria": "학업역량 30%, 진로역량 50%, 공동체역량 20%",
            "note": "춘천 기준. 자유전공학부는 진로 대신 자기주도역량"
          }
        ]
      }
    },
    {
      "id": "knu",
      "name": "경북대",
      "group": "지역 거점국립대",
      "aliases": [
        "경북대",
        "경북대학교"
      ],
      "source": {
        "label": "어디가 2028 시행계획 모음집 1",
        "url": "https://www.adiga.kr/uct/ces/archiveView.do?menuId=PCUCTCES1000&prtlBbsId=27033"
      },
      "tracks": [
        {
          "name": "일반학생전형",
          "stage": "일괄",
          "documentPercent": 100.0,
          "interviewPercent": 0.0,
          "interviewMethod": "없음",
          "minimum": "일반 2합 5 또는 6(계열별 수학 필수). 생태환경·과학기술대 미적용. 의약 별도",
          "documentCriteria": "학생부 기반 다수 평가위원의 종합평가",
          "criterionStatus": "세부 영역·배점 미기재",
          "scope": "계열·모집단위별 최저와 일부 완화 규정은 원문 확인",
          "location": "학생부종합 일반학생전형, 수능최저 49~50쪽"
        },
        {
          "name": "지역인재전형",
          "stage": "서류 100% · 일반 4배수, 의약계열 5배수 표기",
          "documentPercent": 70.0,
          "interviewPercent": 30.0,
          "interviewMethod": "평가기준에 따른 개인별 약 10분 면접",
          "minimum": "일반 미적용. 의·치·약·수의 적용",
          "documentCriteria": "학생부 기반 다수 평가위원의 종합평가",
          "criterionStatus": "세부 영역·배점 미기재",
          "scope": "대구·경북 지역 지원자격이 적용됩니다. 수의예과의 1단계 선발 배수는 최종 모집요강에서 확인하세요.",
          "location": "학생부종합 지역인재전형, 수능최저 49~50쪽"
        }
      ],
      "reference": {
        "url": "https://www.adiga.kr/ucp/uvt/uni/univDetailSelection.do?menuId=PCUVTINF2000&searchSyr=2027&unvCd=0000005",
        "tracks": [
          {
            "name": "일반전형",
            "criteria": "학업태도·탐구노력 30, 전공 관련 교과 이수 15, 진로 탐색 노력 35, 공동체역량 20",
            "note": "학업·진로·공동체 묶음 합계는 30·50·20. 자율학부·자율전공학부 별도"
          }
        ]
      }
    },
    {
      "id": "gnu",
      "name": "경상국립대",
      "group": "지역 거점국립대",
      "aliases": [
        "경상국립대",
        "경상국립대학교",
        "경상대",
        "경상대학교"
      ],
      "source": {
        "label": "어디가 2028 시행계획 모음집 1",
        "url": "https://www.adiga.kr/uct/ces/archiveView.do?menuId=PCUCTCES1000&prtlBbsId=27033"
      },
      "tracks": [
        {
          "name": "일반전형(일괄)",
          "stage": "일괄",
          "documentPercent": 100.0,
          "interviewPercent": 0.0,
          "interviewMethod": "없음",
          "minimum": "일반 모집단위 미적용",
          "documentCriteria": "학생부 기반 다수 평가자의 정성평가",
          "criterionStatus": "세부 영역·배점 미기재",
          "scope": "면접 대상 모집단위를 제외한 일반전형",
          "location": "PDF 14~16쪽"
        },
        {
          "name": "일반전형(면접)",
          "stage": "서류 100% · 3배수(의·약 5배수)",
          "documentPercent": 80.0,
          "interviewPercent": 20.0,
          "interviewMethod": "학생부 기반 확인 면접",
          "minimum": "수의 3합 7, 의·약 3합 6. 이외 미적용",
          "documentCriteria": "학생부 기반 다수 평가자의 정성평가",
          "criterionStatus": "세부 영역·배점 미기재",
          "scope": "일부 사회대·사범대·수의대·의과대·간호대·약학대. 수학 및 한국사 조건 원문 확인",
          "location": "PDF 14~16쪽"
        }
      ],
      "reference": {
        "url": "https://www.adiga.kr/ucp/uvt/uni/univDetailSelection.do?menuId=PCUVTINF2000&searchSyr=2027&unvCd=0000007",
        "tracks": [
          {
            "name": "학생부종합전형",
            "criteria": "지식탐구역량 45, 진로역량 25, 자기주도역량 20, 공동체역량 10",
            "note": "서류 평가요소별 공개 비율"
          }
        ]
      }
    },
    {
      "id": "pnu",
      "name": "부산대",
      "group": "지역 거점국립대",
      "aliases": [
        "부산대",
        "부산대학교"
      ],
      "source": {
        "label": "어디가 2028 시행계획 모음집 3",
        "url": "https://www.adiga.kr/uct/ces/archiveView.do?menuId=PCUCTCES1000&prtlBbsId=27035"
      },
      "tracks": [
        {
          "name": "서류전형",
          "stage": "일괄",
          "documentPercent": 100.0,
          "interviewPercent": 0.0,
          "interviewMethod": "없음",
          "minimum": "인문·사회 2합 6, 자연 2합 6(수학 포함), 약학부 3합 5(수학 포함)",
          "documentCriteria": "학업역량 40%, 탐구역량 40%, 사회역량 20%",
          "criterionStatus": "배점 공개",
          "scope": "한국사 응시. 탐구 반영 방식 원문 확인",
          "location": "PDF 17쪽"
        },
        {
          "name": "면접전형",
          "stage": "서류 100% · 3배수(경영·생명자원과학·치의예 4배수)",
          "documentPercent": 70.0,
          "interviewPercent": 30.0,
          "interviewMethod": "학생부 기반",
          "minimum": "일반 모집단위에는 적용하지 않습니다. 치의예과는 수학을 포함해 3합 5입니다.",
          "documentCriteria": "학업역량 30%, 탐구역량 50%, 사회역량 20%",
          "criterionStatus": "배점 공개",
          "scope": "치의예과는 탐구 두 과목의 평균을 반영합니다. 한국사에 응시해야 합니다.",
          "location": "PDF 18쪽"
        },
        {
          "name": "면접지역전형",
          "stage": "서류 100% · 3~4배수",
          "documentPercent": 70.0,
          "interviewPercent": 30.0,
          "interviewMethod": "학생부 기반",
          "minimum": "일반 모집단위에는 적용하지 않습니다. 수학을 포함해 간호학과는 2합 6, 의예과는 3합 4, 약학부·치의예과·한의학 학·석사통합과정은 3합 5입니다.",
          "documentCriteria": "학업역량 30%, 탐구역량 50%, 사회역량 20%",
          "criterionStatus": "배점 공개",
          "scope": "부산·울산·경남 지역의 학교를 다닌 기간을 확인하세요. 의약·간호계열은 중학교 이수와 거주 요건도 봐야 합니다.",
          "location": "PDF 19쪽"
        }
      ],
      "reference": {
        "url": "https://www.adiga.kr/ucp/uvt/uni/univDetailSelection.do?menuId=PCUVTINF2000&searchSyr=2027&unvCd=0000014",
        "tracks": [
          {
            "name": "학생부종합 전체",
            "criteria": "학업역량 40, 진로역량 40, 사회역량 20",
            "note": "2028 시행계획은 탐구역량 명칭 사용. 서류형 40·40·20, 면접형 30·50·20"
          }
        ]
      }
    },
    {
      "id": "jnu",
      "name": "전남대",
      "group": "지역 거점국립대",
      "aliases": [
        "전남대",
        "전남대학교"
      ],
      "source": {
        "label": "어디가 2028 시행계획 모음집 4",
        "url": "https://www.adiga.kr/uct/ces/archiveView.do?menuId=PCUCTCES1000&prtlBbsId=27036"
      },
      "tracks": [
        {
          "name": "고교생활우수자Ⅰ",
          "stage": "서류 100% · 3배수(의학계열 6배수)",
          "documentPercent": 70.0,
          "interviewPercent": 30.0,
          "interviewMethod": "학생부를 활용해 진로·학업역량, 공동체역량 평가",
          "minimum": "일반 모집단위에는 적용하지 않습니다. 수의과대학, 약학대학, 의과대학, 치의학전문대학원에는 적용합니다.",
          "documentCriteria": "진로역량, 학업역량, 공동체역량",
          "criterionStatus": "평가 요소 공개",
          "scope": "광주캠퍼스가 중심이며 여수캠퍼스에서도 일부 모집합니다. 지원하려는 학과는 시행계획의 모집인원표에서 확인하세요.",
          "location": "학생부종합전형 전형요소별 반영비율 및 평가 방법, 모집단위별 모집인원표"
        },
        {
          "name": "고교생활우수자Ⅱ",
          "stage": "일괄",
          "documentPercent": 100.0,
          "interviewPercent": 0.0,
          "interviewMethod": "없음",
          "minimum": "미적용",
          "documentCriteria": "진로역량, 학업역량, 공동체역량",
          "criterionStatus": "평가 요소 공개",
          "scope": "여수캠퍼스가 중심이며 광주캠퍼스에서도 일부 모집합니다. 서류는 1,000점 만점입니다.",
          "location": "학생부종합전형 전형요소별 반영비율 및 평가 방법, 모집단위별 모집인원표"
        }
      ],
      "reference": {
        "url": "https://www.adiga.kr/ucp/uvt/uni/univDetailSelection.do?menuId=PCUVTINF2000&searchSyr=2027&unvCd=0000023",
        "tracks": [
          {
            "name": "고교생활우수자Ⅰ",
            "criteria": "진로역량 280점, 학업역량 210점, 공동체역량 210점",
            "note": "서류 700점 안에서 40%·30%·30%"
          },
          {
            "name": "고교생활우수자Ⅱ",
            "criteria": "진로역량 400점, 학업역량 300점, 공동체역량 300점",
            "note": "서류 1,000점 안에서 40%·30%·30%"
          }
        ]
      }
    },
    {
      "id": "jbnu",
      "name": "전북대",
      "group": "지역 거점국립대",
      "aliases": [
        "전북대",
        "전북대학교"
      ],
      "source": {
        "label": "어디가 2028 시행계획 모음집 4",
        "url": "https://www.adiga.kr/uct/ces/archiveView.do?menuId=PCUCTCES1000&prtlBbsId=27036"
      },
      "tracks": [
        {
          "name": "큰사람전형",
          "stage": "서류 100% · 3배수",
          "documentPercent": 80.0,
          "interviewPercent": 20.0,
          "interviewMethod": "진로역량·발전가능성 70%, 공동체역량·소통능력 30%",
          "minimum": "일반 미적용. 간호·수의·약·의·치 적용",
          "documentCriteria": "학업역량 40%, 진로역량 40%, 공동체역량 20%",
          "criterionStatus": "배점 공개",
          "scope": "70%와 30%는 면접 점수를 매길 때 두 항목에 주는 비율입니다. 수능최저는 시행계획 44쪽에서 확인하세요.",
          "location": "큰사람전형 및 44·46쪽"
        }
      ],
      "reference": {
        "url": "https://www.adiga.kr/ucp/uvt/uni/univDetailSelection.do?menuId=PCUVTINF2000&searchSyr=2027&unvCd=0000025",
        "tracks": [
          {
            "name": "학생부종합 전형(특성화고졸재직자 제외)",
            "criteria": "학업역량 40%, 진로역량 40%, 공동체역량 20%",
            "note": "큰사람전형 포함"
          }
        ]
      }
    },
    {
      "id": "jeju",
      "name": "제주대",
      "group": "지역 거점국립대",
      "aliases": [
        "제주대",
        "제주대학교"
      ],
      "source": {
        "label": "대학 입학처 2028 시행계획",
        "url": "https://ibsi.jejunu.ac.kr/files/ibsi/content/202604/b4b03050ad5cb3c162492e94147179c5.pdf"
      },
      "tracks": [
        {
          "name": "일반학생 · 일반 모집단위",
          "stage": "일괄",
          "documentPercent": 100.0,
          "interviewPercent": 0.0,
          "interviewMethod": "없음",
          "minimum": "미적용",
          "documentCriteria": "학업역량 40%(400점), 진로역량 30%(300점), 인성·공동체역량 30%(300점)",
          "criterionStatus": "배점 공개",
          "scope": "사범대학·초등교육학부·수의예과·간호학과·약학과는 별도 면접 기준을 적용합니다. 서류 500점 미만은 불합격입니다.",
          "location": "전형 개요, 학생부종합 일반학생, 학생부종합전형 학교생활기록부 평가 방법"
        },
        {
          "name": "일반학생 · 일부 모집단위",
          "stage": "서류 100% · 3배수",
          "documentPercent": 70.0,
          "interviewPercent": 30.0,
          "interviewMethod": "개인별 약 15분. 학업·진로·인성/공동체역량 평가",
          "minimum": "미적용",
          "documentCriteria": "학업역량 40%(400점), 진로역량 30%(300점), 인성·공동체역량 30%(300점)",
          "criterionStatus": "배점 공개",
          "scope": "사범대학·초등교육학부·수의예과·간호학과·약학과에 적용합니다. 서류 500점 미만 또는 면접 150점(300점 만점) 미만은 불합격입니다. 면접에서는 학업 90점, 진로 90점, 인성·공동체 120점을 반영합니다.",
          "location": "전형 개요, 학생부종합 일반학생, 학생부종합전형 학교생활기록부 평가 방법"
        }
      ],
      "reference": {
        "url": "https://www.adiga.kr/ucp/uvt/uni/univDetailSelection.do?menuId=PCUVTINF2000&searchSyr=2027&unvCd=0000027",
        "tracks": [
          {
            "name": "학생부종합 모든 전형",
            "criteria": "학업역량 400점, 진로역량 300점, 인성·공동체역량 300점",
            "note": "서류 1,000점 기준"
          }
        ]
      }
    },
    {
      "id": "cnu",
      "name": "충남대",
      "group": "지역 거점국립대",
      "aliases": [
        "충남대",
        "충남대학교"
      ],
      "source": {
        "label": "어디가 2028 시행계획 모음집 4",
        "url": "https://www.adiga.kr/uct/ces/archiveView.do?menuId=PCUCTCES1000&prtlBbsId=27036"
      },
      "tracks": [
        {
          "name": "학생부종합Ⅰ 면접",
          "stage": "서류 100% · 2배수(10명 미만 및 의과대학 3배수)",
          "documentPercent": 66.7,
          "interviewPercent": 33.3,
          "interviewMethod": "학생부 참고 구술 평가",
          "minimum": "지정 사범·간호 2합 6~7. 의·약·수의 수학 포함 3합 5~7",
          "documentCriteria": "학생부를 평가항목에 따라 종합평가",
          "criterionStatus": "세부 영역·배점 미기재",
          "scope": "2단계는 서류 200점, 면접 100점입니다. 사범대학 자연계열 학과는 수능최저에 수학을 포함합니다. 적용 학과는 원문에서 확인하세요.",
          "location": "PDF 11쪽"
        },
        {
          "name": "학생부종합Ⅰ 서류",
          "stage": "일괄",
          "documentPercent": 100.0,
          "interviewPercent": 0.0,
          "interviewMethod": "없음",
          "minimum": "간호 2합 7. 의·약·수의 수학 포함 3합 5~7. 나머지 미적용",
          "documentCriteria": "학생부를 평가항목에 따라 종합평가",
          "criterionStatus": "세부 영역·배점 미기재",
          "scope": "의·약·수의는 탐구 2과목 평균. 면접전형과 적용 범위 차이",
          "location": "PDF 12쪽"
        }
      ],
      "reference": {
        "url": "https://www.adiga.kr/ucp/uvt/uni/univDetailSelection.do?menuId=PCUVTINF2000&searchSyr=2027&unvCd=0000029",
        "tracks": [
          {
            "name": "학생부종합전형Ⅰ·Ⅱ·Ⅲ",
            "criteria": "학업적 역량 75.5, 사회적 역량 24.5",
            "note": "서류 평가요소별 공개 비율"
          }
        ]
      }
    },
    {
      "id": "cbnu",
      "name": "충북대",
      "group": "지역 거점국립대",
      "aliases": [
        "충북대",
        "충북대학교"
      ],
      "source": {
        "label": "어디가 2028 시행계획 모음집 4",
        "url": "https://www.adiga.kr/uct/ces/archiveView.do?menuId=PCUCTCES1000&prtlBbsId=27036"
      },
      "tracks": [
        {
          "name": "학생부종합Ⅰ전형",
          "stage": "일괄",
          "documentPercent": 100.0,
          "interviewPercent": 0.0,
          "interviewMethod": "없음",
          "minimum": "미적용",
          "documentCriteria": "서류평가 80점(기본 40점, 실질 40점)",
          "criterionStatus": "세부 영역·배점 미기재",
          "scope": "서류 총점 80점은 기본점수 40점과 실질 반영점수 40점으로 구성됩니다. 평가 요소별 배점은 원문을 확인하세요.",
          "location": "PDF 6쪽"
        },
        {
          "name": "학생부종합Ⅱ전형",
          "stage": "일괄",
          "documentPercent": 100.0,
          "interviewPercent": 0.0,
          "interviewMethod": "없음",
          "minimum": "일반 2합 8. 수의 3합 8, 약 3합 7, 의예 3합 5, 간호 3합 10",
          "documentCriteria": "서류평가 80점(기본 40점, 실질 40점)",
          "criterionStatus": "세부 영역·배점 미기재",
          "scope": "자연계열은 수능최저에 수학을 포함하는 것이 원칙입니다. 수학이 필수가 아닌 모집단위와 지정 탐구 영역을 원문에서 확인하세요.",
          "location": "PDF 6~7쪽"
        }
      ],
      "reference": {
        "url": "https://www.adiga.kr/ucp/uvt/uni/univDetailSelection.do?menuId=PCUVTINF2000&searchSyr=2027&unvCd=0000030",
        "tracks": [
          {
            "name": "학생부종합Ⅰ·Ⅱ",
            "criteria": "학업적 역량 75.9%(61점), 사회성 역량 24.1%(19점)",
            "note": "공개자료에 적힌 비율과 점수를 각각 그대로 표기. 반올림 점수로 비율을 다시 산출하지 않음"
          }
        ]
      }
    }
  ]
};
