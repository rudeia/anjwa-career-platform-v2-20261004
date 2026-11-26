window.ANJWA_ADMISSION_PAGES = {
  "groups": {
    "subject": [
      {
        "key": "subject",
        "label": "첫 이해",
        "href": "./subject.html"
      },
      {
        "key": "subject-flow",
        "label": "이해 순서",
        "href": "./subject-flow.html"
      },
      {
        "key": "subject-score",
        "label": "성적 계산",
        "href": "./subject-score.html"
      },
      {
        "key": "subject-calculation",
        "label": "대학 사례",
        "href": "./subject-calculation.html"
      },
      {
        "key": "subject-minimum",
        "label": "수능최저",
        "href": "./subject-minimum.html"
      },
      {
        "key": "subject-document",
        "label": "서류·출결",
        "href": "./subject-document.html"
      },
      {
        "key": "subject-misunderstanding",
        "label": "오해 정리",
        "href": "./subject-misunderstanding.html"
      }
    ],
    "holistic": [
      {
        "key": "holistic",
        "label": "첫 이해",
        "href": "./holistic.html"
      },
      {
        "key": "holistic-flow",
        "label": "이해 순서",
        "href": "./holistic-flow.html"
      },
      {
        "key": "holistic-record",
        "label": "학생부 항목",
        "href": "./holistic-record.html"
      },
      {
        "key": "holistic-competency",
        "label": "평가역량",
        "href": "./holistic-competency.html"
      },
      {
        "key": "holistic-subjects",
        "label": "추천 과목",
        "href": "./holistic-subjects.html"
      },
      {
        "key": "holistic-sechuk",
        "label": "세특 흐름",
        "href": "./holistic-sechuk.html"
      },
      {
        "key": "holistic-ai",
        "label": "AI 활용",
        "href": "./holistic-ai.html"
      },
      {
        "key": "holistic-interview",
        "label": "면접",
        "href": "./holistic-interview.html"
      }
    ]
  },
  "pages": {
    "subject": {
      "group": "subject",
      "tone": "subject",
      "title": "학생부교과전형",
      "summary": "교과 성적을 대학이 어떻게 점수로 바꾸는지 알아봅니다. 학교장 추천과 수능최저가 필요한지도 확인합니다.",
      "guided": true,
      "body": `<div class="admission-reading">
          <section aria-labelledby="subject-steps-title">
            <h2 id="subject-steps-title">모집요강은 이 순서로 읽어보세요</h2>
            <ol class="admission-checklist">
              <li><h3>지원할 수 있는지 봅니다</h3><p>내가 지원하는 학년도의 모집요강에서 지원자격을 확인하세요. 학교장추천이 필요한 전형이라면 학교의 추천 절차도 알아보세요. 일부 전형은 이수 학점 같은 조건도 둡니다.</p></li>
              <li><h3>내 성적을 대학 방식으로 계산합니다</h3><p>어떤 과목과 학기 성적을 넣는지 확인하세요. 대학에 따라 석차등급, 성취도, 학점수를 사용하는 방식이 다릅니다. 이렇게 대학의 기준으로 바꾼 점수를 <strong>환산점수</strong>라고 합니다.</p></li>
              <li><h3>성적과 함께 보는 기준을 확인합니다</h3><p>서류, 면접, 출결을 함께 반영하는지 살펴보세요. <strong>수능최저학력기준</strong>이 있다면 수능에서 어느 영역의 성적을 얼마까지 받아야 하는지도 확인하세요.</p></li>
            </ol>
          </section>
          <section class="admission-reading-case" aria-labelledby="subject-case-title">
            <h2 id="subject-case-title">생명과학 성적은 교과 점수에 어떻게 들어갈까요?</h2>
            <p><strong>가상 사례 · 간호학에 관심 있는 학생</strong></p>
            <p>이 학생의 성적은 영어 2등급, 생명과학 4등급입니다. 영어만 반영하는 가상의 A 전형에서는 2등급을 씁니다. 두 과목의 등급을 그대로 평균 내는 가상의 B 전형에서는 (2 + 4) ÷ 2 = 3등급입니다.</p>
            <p>실제 지원할 때는 모집요강에서 생명과학을 반영하는지 먼저 찾으세요. 그다음 대학이 제시한 점수표와 계산식으로 내 교과 점수를 구해 보세요.</p>
            <a href="./subject-calculation.html">실제 대학 비교 · 2027학년도 대입 용인대·동국대 서울 <span aria-hidden="true">→</span></a>
          </section>
          <section aria-labelledby="subject-next-title">
            <h2 id="subject-next-title">내 성적표로 해볼 일</h2>
            <p>관심 대학 한 곳의 모집요강과 성적표를 나란히 놓고 반영 과목에 표시하세요. 교과 점수를 계산하고, 추천·수능최저·추가 평가가 있는지 적어 상담 때 가져가세요.</p>
            <a href="./holistic.html">종합전형의 독서·탐구 사례 보기 <span aria-hidden="true">→</span></a>
          </section>
        </div>`,
      "guide": {
        "title": "이해 점검",
        "items": [
          "교과전형의 중심 평가 자료는 무엇인가요?",
          "평균등급이 같으면 모든 대학에서 같은 점수를 받나요?"
        ]
      },
      "basis": "일반 설명과 대학별 사례를 구분해 읽으세요. 지원 조건은 본인의 지원 학년도 최종 모집요강과 변경 공지로 확인합니다.",
      "understandingChecks": [
        {
          "question": "교과전형의 중심 평가 자료는 무엇인가요?",
          "answer": "학교생활기록부의 교과 성적이 중심입니다.",
          "explanation": "반영 교과·과목 수·학점·환산 방식과 서류·면접 포함 여부는 전형마다 다릅니다.",
          "nextAction": "관심 대학 두 곳의 같은 지원 학년도 모집요강에서 평가 요소와 비율을 표시하세요."
        },
        {
          "question": "평균등급이 같으면 모든 대학에서 같은 점수를 받나요?",
          "answer": "아닙니다. 평균등급이 같아도 대학 환산점수는 다를 수 있습니다.",
          "explanation": "반영 과목과 과목별 비중, 등급별 점수표가 다르기 때문입니다.",
          "nextAction": "평균등급 대신 각 대학이 반영하는 과목을 골라 해당 계산식에 넣어 비교하세요."
        }
      ]
    },
    "subject-flow": {
      "group": "subject",
      "tone": "subject",
      "title": "교과전형 확인 순서",
      "summary": "지원 학년도와 모집단위를 먼저 고르세요. 지원할 수 있는지 확인한 뒤 교과 점수를 계산합니다.",
      "heroLabel": "읽는 순서",
      "heroTitle": "점수 계산 전에 지원자격부터 확인하세요",
      "heroText": "모집요강의 지원자격에서 졸업 시기, 고교 유형, 학교장 추천, 필요한 이수 조건을 살펴보세요. 수능최저는 전형방법에서 적용 여부를 확인하세요.",
      "body": "<div class=\"explainer-card\"><h3>과목을 얼마나 들었는지가 지원자격이 되는 경우도 있습니다</h3><p>서울과학기술대 2028 고교추천전형은 3학년 1학기까지 계열별 반영 교과에서 80학점 이상 성적 산출이 가능해야 합니다. 자연계열에 지원한다고 가정해 볼까요? 3학년 1학기까지 국어·수학·영어·과학의 반영 학점이 79학점이면 지원에 필요한 학점 조건을 충족하지 못합니다. 80학점이라면 학점 조건을 충족하므로 학교장 추천 등 다른 지원자격을 확인하세요.</p><a href=\"./holistic-subjects.html#admission-course-conditions\">서울과학기술대·서울대의 다른 이수 기준 비교하기</a></div><div class=\"subject-page-grid reviewed-copy\"><article class=\"explainer-card\"></article></div><div class=\"subject-page-grid reviewed-copy\"><article class=\"explainer-card\"><h3>지원할 수 있다면 성적을 계산하세요</h3><p>어느 학기의 어떤 교과를 반영하는지 찾으세요. 반영 과목 수, 학점수 사용 여부, 진로선택과목을 계산하는 방법도 확인하세요. 대학의 계산법으로 점수를 구해 상담 때 비교해 보세요.</p></article><article class=\"explainer-card\"><h3>지난해 결과는 비교 자료로 읽으세요</h3><p>전년도 입시 결과는 그해 지원자들의 결과입니다. 고1·고2라면 배울 내용과 수강에 필요한 기초를 살펴보고, 고3이라면 지원 학년도의 최종 모집요강을 내 성적표와 대조하세요.</p></article></div><aside class=\"admission-basis-note\"><strong>내가 해볼 일</strong><span>모집요강을 열어 지원자격·학교장 추천·수능최저를 찾아 보세요. 확인한 조건과 학교에 물어볼 조건을 적어 두면 상담할 때 바로 비교할 수 있습니다.</span></aside>",
      "guide": {
        "title": "이해 점검",
        "items": [
          "추천이 필요한 전형인데 추천을 받을 수 없다면 먼저 무엇을 확인하나요?"
        ]
      },
      "basis": "일반 설명과 대학별 사례를 구분해 읽으세요. 지원 조건은 본인의 지원 학년도 최종 모집요강과 변경 공지로 확인합니다.",
      "understandingChecks": [
        {
          "question": "추천이 필요한 전형인데 추천을 받을 수 없다면 먼저 무엇을 확인하나요?",
          "answer": "지원자격과 추천 대상·절차를 먼저 확인합니다.",
          "explanation": "학교 추천이 지원 조건인 전형은 성적만으로 지원할 수 있다고 판단하면 안 됩니다. 추천이 어려우면 추천을 요구하지 않는 다른 전형의 자격도 비교합니다.",
          "nextAction": "학교 담당 선생님께 추천 절차를 묻고 최종 모집요강의 지원자격을 확인하세요."
        }
      ]
    },
    "subject-score": {
      "group": "subject",
      "tone": "subject",
      "title": "성적표와 환산점수",
      "summary": "성적표에서 대학이 쓰는 항목부터 찾으세요. 등급을 계산할 때 학점이 왜 중요한지 예시로 확인할 수 있습니다.",
      "heroLabel": "성적 해석",
      "heroTitle": "내 성적표와 대학 점수표를 나란히 보세요",
      "heroText": "성취도는 과목에서 목표에 얼마나 도달했는지를, 석차등급은 다른 학생과 비교한 성적의 위치를 나타냅니다. 과목과 교육과정에 따라 표기가 다르므로 내 성적표에서 어떤 항목이 있는지 먼저 확인하세요.",
      "body": "<div class=\"subject-page-grid reviewed-copy\"><article class=\"explainer-card\"><h3>단순 평균과 학점 반영 평균을 계산해 보세요</h3><p>2학점 과목이 1등급이고 4학점 과목이 3등급이라고 가정합니다. 두 등급에 같은 비중을 주면 (1 + 3) ÷ 2 = 2.00입니다. 학점이 큰 과목에 더 큰 비중을 주면 (1 × 2 + 3 × 4) ÷ (2 + 4) = 약 2.33입니다.</p></article><article class=\"explainer-card\"><h3>환산점수는 대학의 계산법으로 구하세요</h3><p>위의 2.00과 2.33은 평균 계산을 보여 주는 가상 수치입니다. 실제 환산점수는 대학이 정한 점수표와 계산식으로 구합니다. 다른 내신 체계의 등급과 다른 대학의 환산점수는 반영 과목과 만점부터 확인하세요.</p></article></div><aside class=\"admission-basis-note\"><strong>내가 해볼 일</strong><span>성적표에서 과목명·학점수·성취도·석차등급을 찾아보세요. 관심 전형이 이 중 어떤 항목을 쓰는지 모집요강에 표시하세요.</span></aside>",
      "guide": {
        "title": "이해 점검",
        "items": [
          "예시에서 계산한 2.33을 모든 대학의 환산점수로 사용할 수 있나요?"
        ]
      },
      "basis": "일반 설명과 대학별 사례를 구분해 읽으세요. 지원 조건은 본인의 지원 학년도 최종 모집요강과 변경 공지로 확인합니다.",
      "understandingChecks": [
        {
          "question": "예시에서 계산한 2.33을 모든 대학의 환산점수로 사용할 수 있나요?",
          "answer": "사용할 수 없습니다. 2.33은 제시된 예시의 평균등급입니다.",
          "explanation": "평균등급과 대학의 환산점수는 단위와 계산 방식이 다릅니다. 예시에서 쓴 과목·학점 기준부터 확인해야 합니다.",
          "nextAction": "내 반영 과목과 학점을 정리하고 지원 학년도 등급별 환산표를 찾으세요."
        }
      ]
    },
    "subject-calculation": {
      "group": "subject",
      "tone": "subject",
      "title": "대학별 반영 방식 비교",
      "summary": "용인대는 학년별로 4과목씩, 동국대 서울은 지정 교과의 상위 10과목을 고릅니다. 2027학년도 사례로 확인하세요.",
      "basis": "일반 설명과 대학별 사례를 구분해 읽으세요. 지원 조건은 본인의 지원 학년도 최종 모집요강과 변경 공지로 확인합니다.",
      "heroLabel": "대학 사례",
      "heroTitle": "같은 성적표에서 대학마다 어떤 과목을 고를까요?",
      "heroText": "두 대학의 반영 과목을 표시한 뒤 같은 등급이 몇 점이 되는지 확인하세요. 내 성적에 적용할 때는 지원 학년도의 모집요강에서 반영 학기와 진로선택과목 처리 방법도 확인하세요.",
      "body": "<div class=\"subject-page-grid reviewed-copy\"><article class=\"explainer-card\"><p>교과 성적 외에 서류나 교과정성평가 등을 반영한다면, 각각 무엇을 평가하고 몇 퍼센트를 반영하는지 확인하세요. 과목 이수와 학습 내용을 어떻게 평가하는지도 대학별 안내에서 살펴보세요.</p></article><article class=\"explainer-card\"><p>아래 사례는 2027학년도 대입 기준입니다. 표에서 두 대학이 몇 과목을 고르는지 먼저 찾고, 같은 가상 성적표에서 실제로 고르는 과목을 비교해 보세요.</p></article><article class=\"explainer-card\"><p>2027학년도 용인대 일반학생전형의 인문사회·자연과학계열은 교과 100%를 반영하며, 학년별 서로 다른 교과에서 4과목씩 총 12과목을 고릅니다. 동국대 서울 학교장추천인재전형은 교과 70%와 서류종합평가 30%를 반영하고, 지정 교과의 석차등급 상위 10과목으로 교과 점수를 계산합니다. 이수단위는 적용하지 않습니다.</p></article><article class=\"explainer-card\"><p>같은 성적표라도 대학이 고르는 과목과 등급별 점수표가 다르면 결과가 달라집니다. 아래 표는 용인대의 인문사회·자연과학계열과 동국대 서울캠퍼스의 해당 전형에 적용됩니다.</p></article></div><section class=\"content-block admission-comparison\"><h3>2027학년도 대입: 같은 성적표, 다른 계산</h3><p>용인대 일반학생전형(인문사회·자연과학계열)과 동국대 서울 학교장추천인재전형을 비교합니다. 휴대폰에서는 표를 옆으로 밀어 동국대 열까지 확인하세요.</p><div class=\"review-table-scroll\" tabindex=\"0\" aria-label=\"대학 반영 방식 비교\"><table><thead><tr><th scope=\"col\">비교 항목</th><th scope=\"col\">용인대</th><th scope=\"col\">동국대 서울</th></tr></thead><tbody><tr><th scope=\"row\">전형명</th><td>용인대 일반학생전형</td><td>동국대 서울 학교장추천인재전형</td></tr><tr><th scope=\"row\">명목 반영 비율</th><td>교과 100%</td><td>교과 70% + 서류종합평가 30%</td></tr><tr><th scope=\"row\">반영 과목</th><td>국어·영어·수학·사회(역사/도덕)·과학 중 학년별 서로 다른 교과 4과목씩, 총 12과목</td><td>인문: 국어·수학·사회·영어·한국사 / 자연: 국어·수학·과학·영어·한국사, 지정 교과의 석차등급 상위 10과목</td></tr><tr><th scope=\"row\">산출 방법</th><td>선정 과목을 등급별 반영점수로 바꾼 뒤 평균. 학년 공통 100% 반영.</td><td>10과목을 등급점수로 바꿔 평균한 뒤 700점 만점으로 환산. 교과/학년별 비율과 이수단위 미적용.</td></tr></tbody></table></div><p>동국대는 서류평가에서 창의적 체험활동을 제외합니다. 모집요강에 표시된 비율(명목비율)은 교과 70%와 서류 30%입니다. 기본점수를 고려한 실질반영비율은 교과 85.4%, 서류 14.6%입니다. 학교장 추천을 포함한 지원자격도 확인하세요.</p><h4>계산 연습을 위한 가상 학생</h4><p>가상 자연계열 학생의 성적표에는 두 대학이 반영할 수 있는 서로 다른 교과의 과목이 학년마다 4개씩 있습니다. 1학년 4과목은 모두 5등급이고 2·3학년 8과목은 모두 1등급입니다. 실제 계산에서는 대학이 반영하는 학기와 과목 범위도 확인하세요.</p><p><strong>용인대</strong>는 학년마다 4과목씩 총 12과목을 고릅니다. 5등급 4과목은 각 400점, 1등급 8과목은 각 500점입니다. (400 × 4 + 500 × 8) ÷ 12 = 약 466.67점(500점 만점)입니다.</p><p><strong>동국대</strong>는 상위 10과목을 고릅니다. 1등급 8과목은 각 10점, 5등급 2과목은 각 9점입니다. [(10 × 8 + 9 × 2) ÷ 10] ÷ 10 × 700 = 686점(교과 700점 만점)입니다.</p><p>두 점수는 만점과 계산법이 서로 다릅니다. 두 점수는 대학별 과목 선택과 계산법을 이해하는 데 쓰세요. 합격 가능성을 판단할 때는 대학별 지원 조건과 입시 결과도 함께 확인하세요. 동국대는 여기에 서류평가도 반영합니다.</p><p>2027학년도 대입 사례입니다. 2027학년도 고교 신입생이 지원할 때의 기준은 아닙니다. 실제 지원 학년도의 최종 모집요강과 변경 공지를 확인하세요.</p><p>공식 자료: <a href=\"https://ipsi.yongin.ac.kr/ipsi/guide/susi/mo_susi_20260623_1020.pdf\" target=\"_blank\" rel=\"noopener noreferrer\">용인대 2027 수시 모집요강(10·43·44쪽)</a> · <a href=\"https://ipsi.dongguk.edu/upload/file/20260715140521FRWQXB.PDF\" target=\"_blank\" rel=\"noopener noreferrer\">동국대 2027 수시 모집요강(57·58·97·98쪽)</a></p></section><aside class=\"admission-basis-note\"><strong>다음에 확인할 것</strong><span>지원할 학년도의 최종 모집요강에서 반영 교과, 선택 과목 수, 등급별 점수, 추가 평가, 수능최저를 찾아 나란히 적어 보세요.</span></aside>",
      "guide": {
        "title": "이해 점검",
        "items": [
          "두 대학의 점수를 비교하기 전에 어떤 과목을 반영하고 어떻게 계산했는지 확인해야 하는 이유는 무엇인가요?"
        ]
      },
      "checkedAt": "2026-10-04",
      "understandingChecks": [
        {
          "question": "두 대학의 점수를 비교하기 전에 어떤 과목을 반영하고 어떻게 계산했는지 확인해야 하는 이유는 무엇인가요?",
          "answer": "계산에 들어가는 자료와 점수 척도가 다르기 때문입니다.",
          "explanation": "반영 비율·과목 수·진로선택 처리·등급별 점수를 함께 봐야 합니다. 서로 다른 만점의 점수만 비교해 유불리를 단정할 수 없습니다.",
          "nextAction": "같은 가상 성적표로 두 대학의 계산 과정을 각각 적고 빠지는 과목과 달라지는 비중을 표시하세요."
        }
      ]
    },
    "subject-minimum": {
      "group": "subject",
      "tone": "subject",
      "title": "수능최저 이해하기",
      "summary": "모집요강에서 내 모집단위에 수능최저를 적용하는지 먼저 찾으세요. 적용한다면 어느 영역의 등급을 더하는지 확인하세요.",
      "basis": "일반 설명과 대학별 사례를 구분해 읽으세요. 지원 조건은 본인의 지원 학년도 최종 모집요강과 변경 공지로 확인합니다.",
      "heroLabel": "최저 기준",
      "heroTitle": "“두 영역 등급 합 5 이내”를 읽어 볼까요?",
      "heroText": "수능최저학력기준은 전형이 요구하는 수능 성적 조건입니다. 같은 대학이어도 전형이나 모집단위에 따라 적용 여부와 기준이 다를 수 있습니다.",
      "body": "<div class=\"subject-page-grid reviewed-copy\"><article class=\"explainer-card\"><h3>두 영역을 골라 등급을 더합니다</h3><p>대학이 허용하는 두 영역이 각각 2등급과 3등급이라면 합은 5라서 가상의 기준을 충족합니다. 한 영역이 1등급이고 다른 영역이 5등급이라면 합은 6이라 이 가상 기준을 충족하지 못합니다.</p></article><article class=\"explainer-card\"><h3>같은 숫자라도 영역 조건을 함께 보세요</h3><p>대학이 반드시 넣으라고 한 영역이 있는지 확인하세요. 탐구는 몇 과목을 반영하고 어떻게 계산하는지, 한국사 등 별도 기준이 있는지도 찾으세요. 수능이 개편되는 학년도에는 해당 학년도 요강으로 다시 확인하세요.</p></article></div><aside class=\"admission-basis-note\"><strong>내가 해볼 일</strong><span>관심 전형의 수능최저를 찾아 필수 영역과 탐구 과목 수에 표시하세요. 대학이 허용하는 영역의 등급으로 합을 계산해 보세요.</span></aside>",
      "guide": {
        "title": "이해 점검",
        "items": [
          "수능최저를 적용하지 않는 전형에도 등급 합 기준을 맞춰야 하나요?"
        ]
      },
      "understandingChecks": [
        {
          "question": "수능최저를 적용하지 않는 전형에도 등급 합 기준을 맞춰야 하나요?",
          "answer": "수능최저를 적용하지 않는 전형에는 그 기준을 맞출 의무가 없습니다.",
          "explanation": "다만 같은 대학이라도 전형·모집단위별 적용 여부가 다를 수 있습니다. 교과 성적, 지원자격 등 다른 조건은 별개입니다.",
          "nextAction": "최종 모집요강에서 내 전형·모집단위의 적용 여부와 변경 공지를 확인하세요."
        }
      ]
    },
    "subject-document": {
      "group": "subject",
      "tone": "subject",
      "title": "서류·출결은 어떻게 반영하나요?",
      "summary": "교과 성적과 함께 서류·출결을 보는 전형이라면 평가에 쓰는 학생부 항목과 점수 계산법을 확인하세요.",
      "basis": "일반 설명과 대학별 사례를 구분해 읽으세요. 지원 조건은 본인의 지원 학년도 최종 모집요강과 변경 공지로 확인합니다.",
      "heroLabel": "서류 영향",
      "heroTitle": "전형방법에서 성적 외 평가를 찾으세요",
      "heroText": "일부 교과전형은 과목 성적에 서류평가나 교과정성평가를 더합니다. 교과정성평가는 점수 계산 외에 과목 이수와 학습 내용 등을 살펴보는 방식입니다. 실제 평가 범위는 모집요강에서 확인하세요.",
      "body": "<div class=\"subject-page-grid reviewed-copy\"><article class=\"explainer-card\"><h3>성적 외에 어떤 기록을 보는지 확인하세요</h3><p>동국대 서울 2027학년도 학교장추천인재전형은 서류종합평가를 반영하며, 그 평가에서는 창의적 체험활동을 제외합니다. 내가 지원할 전형도 어떤 학생부 항목을 대상으로 삼는지 모집요강에서 확인하세요. <a href=\"./subject-calculation.html\">동국대 교과·서류 사례 보기 <span aria-hidden=\"true\">→</span></a></p></article><article class=\"explainer-card\"><h3>출결 평가와 지원 조건은 모집요강에서 찾으세요</h3><p>미인정 결석·지각·조퇴 등이 점수에 들어가는지 확인하세요. 전형에 따라 횟수나 일수, 점수로 바꾸는 기준이 다를 수 있습니다.</p></article><article class=\"explainer-card\"><h3>선택과목을 보거나 진로가 바뀐 경우</h3><p>이수 과목이나 수업 내용을 평가한다면 그 범위와 학교 여건을 어떻게 고려하는지 확인하세요. 듣고 싶던 과목이 학교에 없다면 정식으로 이수할 수 있는 과정이 있는지 상담하세요. 관심이 바뀌었다면 과목을 고른 이유와 그 뒤 배운 내용을 적어 보세요.</p></article></div><aside class=\"admission-basis-note\"><strong>내가 해볼 일</strong><span>모집요강에서 서류·교과 평가·출결 항목을 찾고, 반영하는 학생부 범위와 비율 또는 계산법을 적어 보세요.</span></aside><div class=\"explainer-card\"><h3>권장과목도 평가에서 살펴볼 수 있습니다</h3><p>서울대 2028 전공 연계 권장과목은 지원자격과 별개이지만 수시 서류평가와 정시 교과역량평가에 활용됩니다. 권장과목을 들었는지는 이들 평가에서 참고할 수 있습니다.</p><a href=\"./holistic-subjects.html#admission-course-conditions\">제2외국어·한문 권장 사례 보기</a></div>",
      "guide": {
        "title": "이해 점검",
        "items": ["교과전형에 서류평가가 있으면 창의적 체험활동도 평가하나요?"]
      },
      "understandingChecks": [
        {
          "question": "교과전형에 서류평가가 있으면 창의적 체험활동도 평가하나요?",
          "answer": "전형마다 서류평가에 사용하는 항목이 다릅니다.",
          "explanation": "동국대 서울 2027학년도 학교장추천인재전형은 서류종합평가에서 창의적 체험활동을 제외합니다.",
          "nextAction": "내가 지원할 학년도의 모집요강에서 서류평가 대상과 항목별 조건을 찾아보세요."
        }
      ]
    },
    "subject-misunderstanding": {
      "group": "subject",
      "tone": "subject",
      "title": "교과전형 오해 점검",
      "summary": "성적이 비슷한 학생도 반영 과목과 지원 조건에 따라 확인할 내용이 달라집니다.",
      "heroLabel": "오해 정리",
      "heroTitle": "내신 평균을 본 다음 네 가지를 확인하세요",
      "heroText": "같은 성적표에서 영어만 보는 전형과 영어·생명과학을 함께 보는 전형은 계산에 쓰는 과목부터 다릅니다. 모집요강에서 다음 질문의 답을 찾아보세요.",
      "body": "<div class=\"subject-page-grid reviewed-copy\"><article class=\"explainer-card\"><h3>어느 과목이 반영되나요?</h3><p>과목명과 반영 학기를 찾고, 과목 선택이나 이수 여부도 평가하는지 확인하세요.</p></article><article class=\"explainer-card\"><h3>학교장 추천 요건은 무엇인가요?</h3><p>대학의 지원자격과 추천 요건을 확인하고, 학교에서 추천받으려면 어떤 절차를 밟아야 하는지 상담하세요.</p></article><article class=\"explainer-card\"><h3>수능최저가 있나요?</h3><p>희망 전형과 모집단위에 기준이 있는지 찾고, 필요한 수능 영역과 등급 합을 확인하세요.</p></article><article class=\"explainer-card\"><h3>교과·종합 중 무엇을 준비할까요?</h3><p>교과전형의 반영 과목과 지원 조건을 확인하면서 수업에서 실제로 배운 내용도 정리해 보세요. 지원할 수 있는 전형을 두 방식으로 살펴볼 수 있습니다.</p></article></div><aside class=\"admission-basis-note\"><strong>내가 해볼 일</strong><span>관심 전형 한 곳을 골라 반영 과목, 지원자격, 수능최저 가운데 아직 모르는 항목 하나를 모집요강에서 찾아보세요.</span></aside>",
      "guide": {
        "title": "이해 점검",
        "items": [
          "평균등급은 같지만 반영 교과가 다른 두 전형은 어떻게 비교하나요?"
        ]
      },
      "basis": "일반 설명과 대학별 사례를 구분해 읽으세요. 지원 조건은 본인의 지원 학년도 최종 모집요강과 변경 공지로 확인합니다.",
      "understandingChecks": [
        {
          "question": "평균등급은 같지만 반영 교과가 다른 두 전형은 어떻게 비교하나요?",
          "answer": "각 전형이 반영하는 교과와 과목을 골라 별도로 계산합니다.",
          "explanation": "평균등급 하나로는 어떤 과목이 반영되고 비중이 어떻게 달라지는지 알 수 없습니다. 수능최저와 지원자격도 따로 확인합니다.",
          "nextAction": "대학·전형·학년도별 반영 교과, 과목 수, 계산식, 지원 조건을 한 표에 적으세요."
        }
      ]
    },
    "holistic": {
      "group": "holistic",
      "tone": "holistic",
      "title": "학생부종합전형",
      "summary": "학생부종합전형은 성적과 이수 과목, 수업과 학교생활에서 어떻게 배웠는지 함께 살펴보는 전형입니다. 수업에서 생긴 질문을 스스로 더 알아본 경험도 학습 과정의 한 예입니다.",
      "guided": true,
      "body": `<div class="admission-reading">
          <nav class="admission-reading-links" aria-label="종합전형 안내 바로가기">
            <a href="#holistic-learning-title">독서가 탐구로 이어진 사례 보기 <span aria-hidden="true">↓</span></a>
            <a href="#holistic-universities">대학별 종합전형 기준 바로 찾기 <span aria-hidden="true">↓</span></a>
          </nav>
          <section aria-labelledby="holistic-steps-title">
            <h2 id="holistic-steps-title">종합전형은 어떻게 준비하나요?</h2>
            <ol class="admission-checklist">
              <li><h3>관심 대학의 전형을 살펴봅니다</h3><p>대학이 학교생활기록부(학생부) 등의 자료를 읽고 평가하는 과정을 <strong>서류평가</strong>라고 합니다. 지원할 학년도의 모집요강에서 어떤 기록을 보는지 확인하세요. 면접이 있는지도 살펴보세요. <strong>수능최저</strong>가 있다면 수능에서 어떤 성적 기준을 충족해야 하는지 확인하세요.</p></li>
              <li><h3>내가 들은 과목과 성적을 함께 봅니다</h3><p>학생부를 보며 어떤 과목을 들었고 수업에서 무엇을 배웠는지 떠올려 보세요. 앞으로 들을 과목은 우리 학교 편성표에서 찾고, 관심 대학의 과목 안내도 확인하세요.</p></li>
              <li><h3>수업에서 생긴 질문을 스스로 이어 갑니다</h3><p>아직 궁금한 점을 질문 하나로 적어 보세요. 교과서에서 다시 찾아보거나 책·기사·공개 자료를 읽고, 도움이 된 내용을 고릅니다. 읽고 나서 생각이 달라졌다면 자료를 비교하거나 수업에서 배운 방법으로 다시 확인해 보세요. 진로가 정해지지 않았다면 수업 내용에서 출발해도 됩니다.</p></li>
            </ol>
          </section>
          <section class="admission-reading-case" aria-labelledby="holistic-learning-title">
            <h2 id="holistic-learning-title">윤리 수업의 질문이 독서와 발표로 이어진 사례</h2>
            <p>국립공주대 입학처가 공개한 윤리교육과 면접 대상자의 실제 학습 사례입니다.</p>
            <ol class="admission-checklist">
              <li><strong>수업에서 질문을 찾았습니다.</strong> 생활과 윤리 시간에 피터 싱어의 동물 해방론을 배우고, 그 주장의 뜻과 의의를 더 알아보고 싶었습니다.</li>
              <li><strong>관련 책을 찾아 읽었습니다.</strong> 피터 싱어의 『왜 비건인가』를 읽고 수업에서 배운 주장을 더 살펴봤습니다.</li>
              <li><strong>다른 관점까지 비교했습니다.</strong> 동물 해방론을 받아들이는 글과 비판하는 글을 함께 읽었습니다. 읽고 조사한 내용을 학교 학술발표회에서 발표했습니다.</li>
            </ol>
            <p>내 수업에서도 더 살펴볼 만한 질문을 하나 골라 보세요.</p>
            <div class="admission-reading-links">
              <a href="./holistic-flow.html">실제 사례와 앱의 연습 사례 더 보기 <span aria-hidden="true">→</span></a>
              <a href="https://ipsi.kongju.ac.kr/kor/contents/3" target="_blank" rel="noopener noreferrer">국립공주대 입학처 서류평가 사례 · 윤리교육과 <span aria-hidden="true">↗</span></a>
            </div>
          </section>
          <section class="admission-reading-panel holistic-practice" aria-labelledby="holistic-next-title">
            <h2 id="holistic-next-title">내 수업으로 세 줄 써 보기</h2>
            <p>최근 수업 하나를 골라 예시처럼 한 칸에 한 문장씩 써 보세요. 예시는 확률과 통계 수업에서 출발합니다.</p>
            <div class="holistic-practice-fields">
              <div>
                <label for="holistic-practice-question">수업에서 생긴 질문</label>
                <p id="holistic-practice-question-example">버스를 아주 오래 기다린 날이 하루 있으면 평균과 중앙값은 어떻게 달라질까?</p>
                <textarea id="holistic-practice-question" data-practice-field="question" rows="2" autocomplete="off" aria-describedby="holistic-practice-question-example"></textarea>
              </div>
              <div>
                <label for="holistic-practice-reading">읽은 자료에서 얻은 힌트</label>
                <p id="holistic-practice-reading-example">교과서에서 다른 값보다 유난히 큰 값 하나가 평균을 크게 바꿀 수 있다는 설명을 읽었다.</p>
                <textarea id="holistic-practice-reading" data-practice-field="process" rows="2" autocomplete="off" aria-describedby="holistic-practice-reading-example"></textarea>
              </div>
              <div>
                <label for="holistic-practice-next">다음에 확인할 일</label>
                <p id="holistic-practice-next-example">대기 시간 다섯 개를 놓고 가장 긴 시간만 바꿔 평균과 중앙값이 각각 얼마나 달라지는지 계산해 보겠다.</p>
                <textarea id="holistic-practice-next" data-practice-field="followUp" rows="2" autocomplete="off" aria-describedby="holistic-practice-next-example"></textarea>
              </div>
            </div>
            <div class="holistic-practice-actions">
              <button class="primary-button" id="sendHolisticPractice" type="button">활동 정리로 옮기기</button>
              <p id="holisticPracticeTransferStatus" role="status"></p>
            </div>
            <div class="admission-reading-links">
              <a href="./holistic-subjects.html">대학별 과목 안내 보기 <span aria-hidden="true">→</span></a>
              <a href="./holistic-record.html">독서와 학생부 기록 확인하기 <span aria-hidden="true">→</span></a>
              <a href="./subject.html">교과전형의 성적 계산 사례 보기 <span aria-hidden="true">→</span></a>
            </div>
          </section>
          <section class="holistic-lookup" id="holistic-universities" aria-labelledby="holistic-lookup-title">
            <h2 id="holistic-lookup-title">대학별 종합전형 기준 찾기</h2>
            <div class="holistic-lookup-example">
              <h3>부산대 면접전형의 숫자를 읽어볼까요?</h3>
              <dl>
                <div><dt>최종 합격자를 정할 때</dt><dd>최종 점수에 1단계 서류 점수를 <strong>70%</strong>, 면접 점수를 <strong>30%</strong> 반영합니다.</dd></div>
                <div><dt>서류 점수를 매길 때</dt><dd>서류 점수에서 학업역량은 <strong>30%</strong>, 탐구역량은 <strong>50%</strong>, 사회역량은 <strong>20%</strong>를 차지합니다.</dd></div>
              </dl>
              <details class="admission-reading-more">
                <summary>면접을 최종 점수에 몇 퍼센트 반영하나요?</summary>
                <p><strong>30%입니다.</strong> 서류 점수의 50%는 탐구역량에 해당합니다.</p>
              </details>
            </div>
            <p class="holistic-lookup-scope"><strong>2028학년도 대입 시행계획</strong>을 기준으로 수도권 주요 대학 15곳과 지역 거점국립대 9곳의 대표 전형을 볼 수 있습니다. 실제 지원 조건은 해당 학년도의 최종 모집요강에서 확인하세요.</p>
            <form class="holistic-lookup-controls" role="search" aria-label="대학별 종합전형 기준">
              <label for="holistic-university-query">대학 이름으로 검색</label>
              <div class="holistic-lookup-search-row">
                <input id="holistic-university-query" type="search" name="university" placeholder="예: 부산대, 전남대" autocomplete="off" maxlength="60">
                <button class="primary-button" type="submit">조회</button>
              </div>
              <label for="holistic-university-select">대학 목록에서 선택</label>
              <select id="holistic-university-select"><option value="">대학을 선택하세요</option></select>
            </form>
            <details class="admission-reading-more holistic-lookup-terms">
              <summary>‘3배수’, ‘2합 5’는 무슨 뜻인가요?</summary>
              <dl>
                <div><dt>1단계 3배수</dt><dd>예를 들어 10명을 뽑는 전형이라면, 1단계에서 30명을 선발한다는 뜻입니다.</dd></div>
                <div><dt>수능최저 2합 5</dt><dd>대학이 정한 조건에 맞는 수능 두 영역의 등급을 더했을 때 5 이하여야 한다는 뜻입니다. 두 영역에서 각각 2등급과 3등급을 받았다면 등급 합은 5입니다.</dd></div>
              </dl>
            </details>
            <div id="holistic-university-status" class="holistic-lookup-status" role="status" aria-atomic="true"></div>
            <div id="holistic-university-results" class="holistic-lookup-results" hidden></div>
          </section>
        </div>`,
      "guide": {
        "title": "이해 점검",
        "items": [
          "종합전형에서 내 교과 성적도 보나요?",
          "윤리 수업 사례에서 학생은 책을 읽은 뒤 무엇을 더 했나요?",
          "2028 시행계획에 배점이 없으면 2027 배점을 써도 될까요?"
        ]
      },
      "basis": "일반 설명과 대학별 사례를 구분해 읽으세요. 지원 조건은 본인의 지원 학년도 최종 모집요강과 변경 공지로 확인합니다.",
      "understandingChecks": [
        {
          "question": "종합전형에서 내 교과 성적도 보나요?",
          "answer": "교과 성적도 살펴봅니다.",
          "explanation": "교과 성적과 이수한 과목을 살펴봅니다. 수업과 활동에서 무엇을 어떻게 배웠는지도 대학별 기준에 따라 함께 평가합니다.",
          "nextAction": "수업에서 어떤 질문을 품었는지, 자료를 보며 무엇을 확인했는지 적어 보세요. 관심 대학이 이런 경험을 어떻게 평가하는지 살펴보세요."
        },
        {
          "question": "윤리 수업 사례에서 학생은 책을 읽은 뒤 무엇을 더 했나요?",
          "answer": "동물 해방론에 대한 찬반 자료를 비교하고 조사 내용을 발표했습니다.",
          "explanation": "수업에서 생긴 질문을 책으로 살펴본 뒤 다른 관점까지 찾아 읽었습니다.",
          "nextAction": "내가 읽은 자료에서 답을 얻은 질문과 더 알아보고 싶은 질문을 각각 한 줄로 적어 보세요."
        },
        {
          "question": "2028 시행계획에 배점이 없으면 2027 배점을 써도 될까요?",
          "answer": "2028학년도 배점은 해당 학년도의 자료에서 확인해야 합니다.",
          "explanation": "대학은 전형 이름이나 배점을 해마다 바꿀 수 있습니다. 2027학년도 배점은 그해 전형을 이해할 때 참고하세요.",
          "nextAction": "관심 대학의 2028학년도 최종 모집요강에서 서류 기준을 찾으세요."
        }
      ]
    },
    "holistic-flow": {
      "group": "holistic",
      "tone": "holistic",
      "title": "종합전형 확인 순서",
      "summary": "모집요강을 확인한 뒤 수업에서 생긴 질문 하나를 골라 보세요. 자료를 읽고 질문을 더 깊게 다룬 과정을 살펴봅니다.",
      "heroLabel": "읽는 순서",
      "heroTitle": "지원 조건을 읽고, 내 수업 기록을 돌아보세요",
      "heroText": "먼저 지원 학년도·전형명·모집단위를 정하세요. 모집요강에서 지원자격, 평가 방법, 면접과 수능최저를 각각 확인하세요. 그다음 학생부에 나온 수업과 학교생활 경험을 돌아봅니다.",
      "body": "<div class=\"subject-page-grid reviewed-copy\"><article class=\"explainer-card\"><h3>읽기 전과 읽은 뒤의 질문을 비교해 보세요</h3><p>수업에서 궁금한 점을 한 문장으로 적고 관련 책이나 자료를 찾아보세요. 내 질문에 답이 된 부분에 표시하고, 남은 질문은 관찰·비교·토론 가운데 내가 할 수 있는 방법으로 한 번 더 확인해 보세요.</p></article><article class=\"explainer-card\"><h3>관심이 바뀌어도 이어서 살펴보세요</h3><p>교육학과와 교과교육과처럼 이름이 비슷해도 대학에서 배우는 내용은 다를 수 있습니다. 관심이 바뀌었다면 바뀌게 된 수업이나 자료, 그 뒤 더 알아본 내용을 정리하세요. 면접이 있다면 본인이 한 일을 자기 말로 설명해 보세요.</p></article></div><div class=\"admission-reading\"><section class=\"admission-reading-case\" id=\"holistic-plant-case\"><h3>실제 사례 · 『싸우는 식물』을 읽고 무엇을 조사했을까요?</h3><ol class=\"admission-checklist\"><li><strong>책을 직접 골랐습니다.</strong> 한 학생이 학급 활동에서 『싸우는 식물』을 골라 읽었습니다.</li><li><strong>읽다가 새 질문이 생겼습니다.</strong> 식물이 병해충의 피해를 어떻게 견디는지 궁금해졌습니다.</li><li><strong>질문의 범위를 좁혀 조사했습니다.</strong> 식물 병원균을 주제로 더 알아보고 조사한 내용을 발표했습니다.</li></ol><p>국립공주대가 공개한 원예학과 면접 대상자 자료를 학습 순서에 맞춰 요약했습니다.</p><p><a href=\"https://ipsi.kongju.ac.kr/kor/contents/3\" target=\"_blank\" rel=\"noopener noreferrer\">국립공주대 입학처 서류평가 사례 · 원예학과 <span aria-hidden=\"true\">↗</span></a></p></section><section class=\"admission-reading-case\" id=\"holistic-traffic-case\"><h3>앱의 연습 사례 · 정류장이 가까우면 버스를 타기 쉬울까요?</h3><ol class=\"admission-checklist\"><li><strong>생활 속에서 질문을 찾습니다.</strong> 정류장 수만으로 교통이 편한 지역을 가려낼 수 있을지 의문을 품었습니다.</li><li><strong>독서에서 비교할 기준을 얻습니다.</strong> 『도시의 승리』(에드워드 글레이저)를 읽고, 이동이 쉬우면 학교나 병원에 갈 기회도 달라질 수 있다는 관점에서 질문을 다시 봤습니다.</li><li><strong>자료를 더 찾아 결론을 보완합니다.</strong> 공공데이터로 정류장 위치와 버스가 오는 간격을 각각 지도에 표시했습니다. 연습 사례에서는 정류장이 가까워도 버스가 드물게 오는 곳이 있어 거리와 배차 간격을 따로 보여 줬습니다. 경사나 보도 상태 등은 후속 조사 과제로 남겼습니다.</li></ol><p>앱 활동 정리의 사회·지리 분야 ‘대중교통 취약지역 분석’을 바탕으로 한 가상 사례입니다. <a href=\"./index.html#selfEvaluation\">활동 정리에서 다른 주제 보기 <span aria-hidden=\"true\">→</span></a></p></section></div><aside class=\"admission-basis-note\"><strong>내가 해볼 일</strong><span>이번 수업의 질문 하나를 적고, 답을 찾을 책이나 자료 한 편을 골라 보세요. 읽은 뒤에는 새로 생긴 질문과 직접 해 볼 비교 방법을 각각 한 줄로 적으세요.</span></aside>",
      "guide": {
        "title": "이해 점검",
        "items": [
          "학과명이 비슷하면 대학에서 배우는 내용도 모두 같나요?"
        ]
      },
      "basis": "일반 설명과 대학별 사례를 구분해 읽으세요. 지원 조건은 본인의 지원 학년도 최종 모집요강과 변경 공지로 확인합니다.",
      "understandingChecks": [
        {
          "question": "학과명이 비슷하면 대학에서 배우는 내용도 모두 같나요?",
          "answer": "같다고 볼 수 없습니다.",
          "explanation": "비슷한 학과명이라도 교육과정·전공 선택·실습·진로가 다를 수 있습니다. 명칭만으로 희망 전공을 결정하지 않습니다.",
          "nextAction": "대학 학과 홈페이지에서 필수 전공과목 세 개와 실습 내용을 비교하세요."
        }
      ]
    },
    "holistic-record": {
      "group": "holistic",
      "tone": "holistic",
      "title": "학생부에서 무엇을 살펴보나요?",
      "summary": "학생부에서 성적·이수 과목과 수업 기록을 함께 보세요. 책을 읽은 뒤 수업에서 한 일은 어디에서 볼 수 있을까요?",
      "heroLabel": "학생부 항목",
      "heroTitle": "내가 한 일이 어느 항목에 기록됐는지 보세요",
      "heroText": "교과학습발달상황에서 이수 과목, 성적, 세부능력 및 특기사항(세특)을 확인하세요. 창의적 체험활동과 행동특성 및 종합의견에는 학교생활에서 참여한 일과 맡은 역할 등이 담길 수 있습니다. 대학에 제공되는 범위는 지원 학년도 기준을 확인하세요.",
      "body": "<div class=\"subject-page-grid reviewed-copy\"><article class=\"explainer-card\"><h3>독서는 질문에 답을 찾는 과정입니다</h3><p>자료를 읽고 확인한 개념, 바뀐 생각, 수업에서 이어 한 토론이나 조사를 돌아보세요. 예를 들어 『왜 비건인가』를 읽은 실제 사례에서 이어진 활동은 동물 해방론을 지지하는 자료와 비판하는 자료의 비교, 그리고 학교 발표였습니다. <a href=\"./holistic.html#holistic-learning-title\">윤리 수업 사례 보기 <span aria-hidden=\"true\">→</span></a></p></article><article class=\"explainer-card\"><h3>책 목록과 수업 활동 기록을 확인하세요</h3><p>교육부의 2026학년도 기재요령에 따르면 2024학년도 대입부터 학생부의 ‘독서활동상황’은 대학에 제공하지 않습니다. 책을 바탕으로 학교 수업에서 토론·탐구 등 교육활동을 했다면 교사가 관찰한 내용은 기재요령에 따라 기록할 수 있습니다. <a href=\"https://star.moe.go.kr/web/contents/m30103.do?id=115799&amp;schM=view\" target=\"_blank\" rel=\"noopener noreferrer\">교육부 학교생활기록부 기재 안내 <span aria-hidden=\"true\">↗</span></a></p></article><article class=\"explainer-card\"><h3>자기평가에는 실제로 한 일을 쓰세요</h3><p>학생의 자기평가는 상담이나 학습 점검에 쓰는 자료입니다. 교사가 관찰하고 기록하는 일과는 역할이 다릅니다. 모둠 활동이라면 맡은 일과 함께 결정한 일을 구분하고, 진로와 직접 연결되지 않은 수업에서 배운 점도 적어 보세요.</p></article></div><aside class=\"admission-basis-note\"><strong>내가 해볼 일</strong><span>학생부에서 수업 하나를 골라 내가 받은 성적, 직접 한 일, 새로 배운 점을 찾아보세요. 읽은 자료가 도움이 됐다면 어떤 내용을 어디에 썼는지 적으세요.</span></aside>",
      "guide": {
        "title": "이해 점검",
        "items": ["책을 읽었다는 목록은 대학에 그대로 제공되나요?"]
      },
      "basis": "일반 설명과 대학별 사례를 구분해 읽으세요. 지원 조건은 본인의 지원 학년도 최종 모집요강과 변경 공지로 확인합니다.",
      "understandingChecks": [
        {
          "question": "책을 읽었다는 목록은 대학에 그대로 제공되나요?",
          "answer": "학생부의 ‘독서활동상황’은 2024학년도 대입부터 제공하지 않습니다.",
          "explanation": "수업에서 책 내용을 토론·탐구에 활용했다면 어떤 교육활동이 있었는지가 중요합니다. 기록은 교사가 기재요령에 따라 판단합니다.",
          "nextAction": "최근 읽은 자료에서 배운 내용 중 실제로 수업의 질문이나 비교 방법에 활용한 한 가지를 찾아보세요."
        }
      ]
    },
    "holistic-competency": {
      "group": "holistic",
      "tone": "holistic",
      "title": "평가역량 이해하기",
      "summary": "학업·진로·공동체역량이 수업이나 학교활동에서 어떤 모습으로 드러나는지 찾아보세요.",
      "heroLabel": "평가역량",
      "heroTitle": "역량의 이름을 학생이 실제로 한 일과 연결해 보세요",
      "heroText": "학업역량을 볼 때는 교과 성취와 학습 태도뿐 아니라 배운 내용을 어떻게 이해하고 적용했는지도 살펴볼 수 있습니다. 자료를 읽고 질문을 좁히거나 처음 해석을 수정한 일도 돌아보세요.",
      "feature": "competencies",
      "body": "<div class=\"content-block\">\n          <h3>평가역량을 이해하는 예시</h3>\n          <div class=\"competency-grid\" id=\"competencyCards\"></div>\n        </div><div class=\"subject-page-grid reviewed-copy\"><article class=\"explainer-card\"><p>진로역량을 알아볼 때는 관련 과목을 고른 이유와 공부한 경험을 살펴보세요. 관심이 달라졌다면 어떤 수업이나 자료를 통해 바뀌었는지 적어 보세요.</p></article><article class=\"explainer-card\"><p>공동체역량을 알아볼 때는 모둠에서 맡은 일, 의견이 달랐을 때 근거를 확인하고 조정한 일을 떠올려 보세요.</p></article><article class=\"explainer-card\"><p>대학별로 평가 항목의 이름, 비중, 방법이 다릅니다. 서울대의 서류평가 안내처럼 자기주도적 학습 경험을 어떤 맥락에서 보는지 관심 대학의 자료를 확인하세요. <a href=\"https://snuarori.snu.ac.kr/admissions/guide\" target=\"_blank\" rel=\"noopener noreferrer\">서울대 입학본부 서류평가 안내 <span aria-hidden=\"true\">↗</span></a></p></article></div><aside class=\"admission-basis-note\"><strong>다음에 확인할 것</strong><span>관심 대학의 평가 기준 한 항목을 고르세요. 학생부에서 그 항목과 함께 읽을 수 있는 수업이나 활동 하나를 찾아 내가 한 일을 한 문장으로 설명해 보세요.</span></aside>",
      "guide": {
        "title": "이해 점검",
        "items": [
          "협업을 보여주려면 반드시 큰 행사의 대표를 맡아야 하나요?"
        ]
      },
      "basis": "일반 설명과 대학별 사례를 구분해 읽으세요. 지원 조건은 본인의 지원 학년도 최종 모집요강과 변경 공지로 확인합니다.",
      "understandingChecks": [
        {
          "question": "협업을 보여주려면 반드시 큰 행사의 대표를 맡아야 하나요?",
          "answer": "큰 행사의 대표 경험이 반드시 필요한 것은 아닙니다.",
          "explanation": "역할의 이름보다 의견 조정·역할 수행·피드백 반영 등 실제 참여 장면이 근거가 됩니다. 평가는 대학별 기준에 따릅니다.",
          "nextAction": "작은 조별 활동에서도 내가 한 일과 다른 사람의 의견을 반영한 부분을 찾아보세요."
        }
      ]
    },
    "holistic-subjects": {
      "group": "holistic",
      "tone": "holistic",
      "title": "학과와 과목을 함께 살펴보기",
      "summary": "지원에 꼭 필요한 과목과 평가에 활용하는 권장과목을 구분하고, 학교에서 언제 들을 수 있는지 확인하세요.",
      "heroLabel": "과목 선택",
      "heroTitle": "추천 이유와 실제 이수 조건을 따로 확인해요.",
      "heroText": "먼저 관심 학과에서 무엇을 배우는지 살펴보고, 고교 과목의 어떤 개념이 그 공부와 연결되는지 확인하세요.",
      "feature": "recommendations",
      "body": "<section class=\"content-block\" id=\"admission-course-conditions\"><h3>지원자격과 권장과목을 구분하는 실제 사례</h3><p>공식 안내에서 과목 기준이 ‘지원자격’에 있는지, ‘전공 연계 권장과목’에 있는지 먼저 확인하세요. 아래 두 대학의 사례를 나란히 보면 차이를 알 수 있습니다.</p><div class=\"subject-page-grid reviewed-copy\">\n<article class=\"explainer-card\" data-admission-case=\"seoultech-2028\"><span class=\"label\">서울과학기술대 · 2028 대입 시행계획 · 고교추천전형</span><h3>내신 계산 전에 반영 교과 합계 80학점부터 확인하세요</h3><p>국내 고교 성적이 3개 학기 이상 있고, 3학년 1학기까지 대학의 반영 교과목에서 80학점 이상 성적을 산출할 수 있어야 합니다. 대학이 지정한 교과에 속하는 과목의 학점을 더해 판단합니다.</p><details><summary>어떤 학점을 더하는지와 학생 예시</summary><ul><li>자연계열: 국어·수학·영어·과학</li><li>인문계열: 국어·수학·영어·사회·한국사</li><li>ST자유전공·건축학: 국어·수학·영어·사회·과학·한국사</li></ul><p><b>가상 예시</b> 자연계열 지원을 생각한다면 3학년 1학기까지 국어·수학·영어·과학의 반영 학점을 더하세요. 합계가 79학점이라면 학점 조건을 충족하지 못합니다. 80학점이면 학점 조건을 충족합니다. 3학년 2학기 과목을 앞선 합계에 더하지 마세요. 학교장 추천·졸업 시기·고교 유형과 수능최저도 따로 확인하세요.</p><p>특성화고 등과 일반·종합고의 특성화과정 이수자는 이 전형의 지원 대상에서 제외됩니다. 일반·종합고의 모든 학생이 제외된다는 뜻은 아닙니다.</p><p>2027 최종 수시요강은 같은 기준을 80단위로 안내하며, 반영 교과의 진로선택과목도 이수량에 포함한다고 명시합니다. 이 세부 기준을 다른 학년도에 그대로 적용하지 마세요.</p></details><p><a href=\"https://admission.seoultech.ac.kr/cms/FR_BBS_CON/BoardView.do?MENU_ID=380&amp;CONTENTS_NO=7&amp;SITE_NO=2&amp;BOARD_SEQ=3&amp;BBS_SEQ=512\" target=\"_blank\" rel=\"noopener noreferrer\">2028 공식 시행계획: 본문 6·14쪽</a> · <a href=\"https://admission.seoultech.ac.kr/cms/FR_CON/index.do?MENU_ID=130\" target=\"_blank\" rel=\"noopener noreferrer\">2027 최종 수시요강: 본문 24·56쪽</a></p><small>2028 시행계획은 최종 모집요강에서 변경될 수 있습니다. 확인: 2026.10.05</small></article>\n<article class=\"explainer-card\" data-admission-case=\"snu-2028\"><span class=\"label\">서울대 · 2028 대입 전공 연계 과목 선택 안내</span><h3>제2외국어·한문 1과목 이상은 권장사항입니다</h3><p>유형 ①에 해당하는 모집단위 지원자에게 제2외국어/한문 교과군에서 1과목 이상 이수를 권장합니다. 전공 연계 권장과목은 지원자격과 별개이며, 이수 여부를 수시 서류평가와 정시 교과역량평가에 활용합니다.</p><details><summary>학생은 무엇을 확인해야 하나요?</summary><p>먼저 희망 모집단위가 유형 ①에 해당하는지 공식 표에서 확인하세요. 해당한다면 학교에서 배울 수 있는 제2외국어·한문 과목과 수강 시기를 선생님과 상담하세요. 과목을 듣지 않아도 이 권장사항만으로 지원이 제한되지는 않습니다. 대학은 권장과목 이수 여부를 평가에 활용할 수 있습니다.</p><p>서울대는 과목을 이수한 순서와 학생이 주도적으로 깊게 공부한 과정도 함께 살펴봅니다. 고교 과목 이수 권장은 수능 제2외국어/한문 응시 기준과는 구분해서 확인하세요.</p></details><p><a href=\"https://snu.ac.kr/snunow/press?bbsidx=156226&amp;md=v\" target=\"_blank\" rel=\"noopener noreferrer\">서울대 공식 안내: 2025.07.01 보도자료</a></p><small>2028 대입 기준입니다. 다른 지원 학년도는 별도로 확인하세요. 확인: 2026.10.05</small></article>\n</div><p class=\"content-status-note\">고교 입학 연도와 대입 학년도는 다릅니다. 일반적인 3년 이수 기준으로 2025 신입생은 2028 대입, 2027 신입생은 2030 대입 대상입니다. 위 사례를 모든 학생의 지원 조건으로 적용하지 마세요.</p></section><div class=\"content-block\">\n          <h3>추천 과목 조회</h3>\n          <p>희망 학과가 정해졌다면 학과명으로, 아직 넓게 고민 중이라면 계열명으로 찾아보세요. 관심 과목을 먼저 고르면 그 과목과 연결해 생각해 볼 수 있는 학과 예시도 확인할 수 있습니다.</p>\n          <div class=\"recommendation-view-panel\">\n            <div class=\"recommendation-view-tabs\" aria-label=\"추천 과목 보기 방식\">\n              <button class=\"active\" type=\"button\" data-recommendation-mode=\"major\">학과·계열로 찾기</button>\n              <button type=\"button\" data-recommendation-mode=\"subject\">과목으로 찾기</button>\n              <button type=\"button\" data-recommendation-mode=\"university\">대학별로 찾기</button>\n              <a class=\"recommendation-deep-link\" href=\"./advanced-recommendations.html\">심화자료</a>\n            </div>\n            <p id=\"recommendationModeHelp\">희망 학과나 계열을 고르면 관련 과목과 우리학교의 개설 여부를 함께 확인할 수 있습니다.</p>\n          </div>\n          <div class=\"recommendation-tool\">\n            <div class=\"recommendation-controls\">\n              <label class=\"recommendation-major-control\">학과·계열 고르기<select id=\"majorRecommendationSelect\"></select></label>\n              <label class=\"recommendation-major-control\">학과·계열 검색<input id=\"majorRecommendationSearch\" type=\"search\" placeholder=\"예: 간호학과, 의학 보건계열, 지리교육과, 경영\" /></label>\n              <label class=\"recommendation-subject-control\">과목으로 찾기<select id=\"subjectRecommendationSelect\"></select></label>\n              <label class=\"recommendation-university-control\">대학명 검색<input id=\"universityRecommendationSearch\" type=\"search\" placeholder=\"예: 서울대, 부산대, 국민대\" /></label>\n              <label class=\"recommendation-university-control\">학과명 검색<input id=\"universityMajorSearch\" type=\"search\" placeholder=\"예: 간호, 경영, 기계, 교육\" /></label>\n              <label class=\"recommendation-plan-control\">교육과정 기준<select id=\"recommendationPlanFilter\"><option value=\"all\">전체 학년</option><option value=\"incoming2027\">2027 신입생(예정)</option><option value=\"incoming2026\">1학년(2026 신입)</option><option value=\"incoming2025\">2학년(2025 신입)</option><option value=\"incoming2024\">3학년(2024 신입)</option></select></label>\n            </div>\n            <div class=\"quick-major-row\" id=\"quickMajorButtons\"></div>\n            <div class=\"recommendation-results\" id=\"majorRecommendationResults\"></div>\n            <div class=\"recommendation-results\" id=\"subjectRecommendationResults\"></div>\n          </div>\n<details class=\"compact-guide\"><summary>추천 분류와 공식 조건의 차이</summary>          <div class=\"recommendation-use-grid\">\n            <article>\n              <b>핵심과목</b>\n              <span>계열 탐색에서 먼저 살펴볼 과목입니다. 대학별 자료의 분류는 공식 원문과 적용 학년도를 확인하세요.</span>\n            </article>\n            <article>\n              <b>권장과목</b>\n              <span>함께 살펴볼 과목입니다. 대학의 권장과목인지, 앱의 탐색 제안인지 근거를 확인하세요.</span>\n            </article>\n            <article>\n              <b>추천과목</b>\n              <span>공식 요구 과목이 아니라, 과목 선택을 넓게 생각해 보기 위한 참고 과목입니다.</span>\n            </article>\n          </div>\n</details>\n          <div class=\"recommendation-legend\" aria-label=\"추천 과목 배지 범례\">\n            <span><b class=\"legend-chip grade-1\"></b> 1학년 교육과정</span>\n            <span><b class=\"legend-chip grade-2\"></b> 2학년 교육과정</span>\n            <span><b class=\"legend-chip grade-3\"></b> 3학년 교육과정</span>\n            <span><b class=\"legend-chip missing-core\"></b> 핵심 과목 미개설</span>\n            <span><b class=\"legend-chip missing-recommended\"></b> 권장 과목 미개설</span>\n          </div>\n        </div><div class=\"subject-page-grid reviewed-copy\"><article class=\"explainer-card\"><p>대표 계열 추천은 분야를 탐색할 때 참고하는 자료입니다. 대학별 과목 안내는 해당 대학·모집단위·학년도 원문의 조건을 기준으로 읽으세요. 같은 핵심·권장이라는 말도 대학마다 뜻이 다를 수 있습니다.</p></article><article class=\"explainer-card\"><p>안내에 ‘세 과목 중 하나’라고 되어 있으면 적어도 한 과목을 고르는 조건입니다. 과목 수와 함께 ‘그리고’, ‘또는’, 학점, 적용 학년도와 모집단위도 확인하세요. 검색 결과에 안내가 없으면 대학의 공식 자료를 찾아보세요.</p></article><article class=\"explainer-card\"><p>우리학교에서 어느 학기에 개설하는지, 어떤 과목 중에서 선택해야 하는지, 필요한 기초와 학습 부담은 어떤지 함께 확인하세요. 학교에 없는 과목은 정식으로 이수할 수 있는 다른 과정을 상담할 수 있습니다. 독서·탐구나 유사 과목을 공부하는 것과 공식적으로 이수를 인정받는 것은 구분해야 합니다.</p></article><article class=\"explainer-card\"><p>이 화면은 선택과목 중심입니다. 공통과목도 대학의 성적·서류 평가에 활용될 수 있습니다. 표시 개수와 순서가 대학의 평가 우선순위나 합격 가능성을 뜻하지 않습니다.</p></article></div><aside class=\"admission-basis-note\"><strong>다음에 확인할 것</strong><span>왜 배우려는 과목인지, 대학의 공식 이수 조건은 무엇인지, 학교에 개설되는지 나누어 확인하세요.</span></aside>",
      "guide": {
        "title": "이해 점검",
        "items": [
          "‘아래 세 과목 중 하나’라는 조건이면 세 과목을 모두 이수해야 하나요?"
        ]
      },
      "basis": "일반 설명과 대학별 사례를 구분해 읽으세요. 지원 조건은 본인의 지원 학년도 최종 모집요강과 변경 공지로 확인합니다.",
      "understandingChecks": [
        {
          "question": "‘아래 세 과목 중 하나’라는 조건이면 세 과목을 모두 이수해야 하나요?",
          "answer": "‘세 과목 중 하나’는 적어도 한 과목이라는 뜻입니다.",
          "explanation": "‘모두’, ‘중 하나’, ‘총 몇 학점 이상’은 서로 다른 조건입니다. 권장 과목과 지원자격도 구분해야 합니다. 앱의 일반 탐색 추천은 대학의 공식 조건이 아닙니다.",
          "nextAction": "최종 대학 원문의 그리고·또는·최소 과목 수·학점·적용 모집단위와 학년도를 그대로 옮겨 확인하세요."
        }
      ]
    },
    "holistic-sechuk": {
      "group": "holistic",
      "tone": "holistic",
      "title": "수업 활동을 자기평가로 정리하기",
      "summary": "수업 질문과 읽은 자료, 실제로 한 비교, 결과와 다음 계획을 내 말로 정리하세요.",
      "heroLabel": "세특 흐름",
      "heroTitle": "실제 경험에 해당하는 내용만 적어도 괜찮아요.",
      "heroText": "수업에서 궁금했던 점, 직접 한 일과 맡은 역할, 사용한 자료와 배운 점을 정리해 보세요. 모든 활동이 보고서나 후속 탐구로 이어져야 하는 것은 아닙니다.",
      "feature": "sechuk",
      "body": "<div class=\"content-block\">\n          <h3>자기평가 정리 항목과 가상 예시</h3>\n          <div class=\"timeline-band sechuk-flow\">\n            <div class=\"sechuk-flow-grid\" id=\"sechukFlowGrid\">\n              <button class=\"sechuk-step active\" type=\"button\" data-sechuk-step=\"motivation\"><span>01</span><b>탐구 동기</b><small>수업에서 생긴 호기심</small></button>\n              <button class=\"sechuk-step\" type=\"button\" data-sechuk-step=\"question\"><span>02</span><b>탐구 질문</b><small>해결하고 싶은 물음</small></button>\n              <button class=\"sechuk-step\" type=\"button\" data-sechuk-step=\"concept\"><span>03</span><b>수업 개념 연결</b><small>교과 개념과 연결</small></button>\n              <button class=\"sechuk-step\" type=\"button\" data-sechuk-step=\"process\"><span>04</span><b>탐구 과정</b><small>읽은 자료와 비교 방법</small></button>\n              <button class=\"sechuk-step\" type=\"button\" data-sechuk-step=\"result\"><span>05</span><b>결과</b><small>알게 된 점 정리</small></button>\n              <button class=\"sechuk-step\" type=\"button\" data-sechuk-step=\"limit\"><span>06</span><b>한계</b><small>확인하지 못한 점</small></button>\n              <button class=\"sechuk-step\" type=\"button\" data-sechuk-step=\"follow\"><span>07</span><b>후속 활동</b><small>남은 질문과 다음 계획</small></button>\n            </div>\n            <div class=\"sechuk-example-panel\" id=\"sechukExamplePanel\" aria-live=\"polite\">\n              <span class=\"label\">예시</span>\n              <h4 id=\"sechukExampleTitle\">탐구 동기</h4>\n              <p id=\"sechukExampleText\">수업에서 남은 질문 하나를 고르세요. 각 단계를 누르면 통합사회에서 출발해 두 지역의 의료시설 자료를 비교한 가상 사례를 읽을 수 있습니다.</p>\n            </div>\n          </div>\n        </div><div class=\"subject-page-grid reviewed-copy\"><article class=\"explainer-card\"><p>읽은 책이나 공개 자료가 있다면 어떤 부분을 참고해 질문이나 방법이 달라졌는지 적어 보세요. 실제 활동에 해당하는 항목부터 작성하세요.</p></article><article class=\"explainer-card\"><p>자료로 확인한 결과와 자료만으로 알 수 없는 점을 따로 적으세요. 더 알아볼 질문이나 해 보고 싶은 조사는 ‘다음에 할 일’로 적습니다.</p></article><article class=\"explainer-card\"><p>세특은 교사가 실제 수업과 평가에서 관찰한 내용을 기록합니다. 학생의 자기평가서는 상담과 자기 점검을 위한 자료이며 교사의 기록을 대신하지 않습니다.</p></article></div><aside class=\"admission-basis-note\"><strong>다음에 확인할 것</strong><span>‘내가 읽은 자료에서 배운 점’, ‘그 내용을 적용해 비교한 방법’, ‘아직 답을 찾지 못한 질문’ 중 실제 활동에 해당하는 내용을 한 줄씩 적어 보세요.</span></aside>",
      "guide": {
        "title": "이해 점검",
        "items": [
          "활동이 짧았다면 하지 않은 후속 탐구를 추가해서 써야 하나요?"
        ]
      },
      "basis": "일반 설명과 대학별 사례를 구분해 읽으세요. 지원 조건은 본인의 지원 학년도 최종 모집요강과 변경 공지로 확인합니다.",
      "understandingChecks": [
        {
          "question": "활동이 짧았다면 하지 않은 후속 탐구를 추가해서 써야 하나요?",
          "answer": "하지 않은 후속 탐구를 추가하면 안 됩니다.",
          "explanation": "짧은 활동이어도 실제 질문·방법·확인한 점·남은 질문을 구체적으로 적습니다. 계획한 일은 완료한 활동과 나눠 설명합니다.",
          "nextAction": "초안에서 완료한 일과 앞으로 해 보고 싶은 일을 다른 문장으로 표시하세요."
        }
      ]
    },
    "holistic-ai": {
      "group": "holistic",
      "tone": "holistic",
      "title": "탐구에 AI를 활용하는 방법",
      "summary": "AI가 제안한 질문을 쓰려면 내가 실행할 수 있는지 보고, 책·통계·주장은 원문으로 확인하세요.",
      "heroLabel": "AI 활용 기준",
      "heroTitle": "AI가 준 자료를 열어 보고 쓸 수 있는 부분을 고르세요",
      "heroText": "AI가 찾은 자료나 문헌은 제목과 내용이 실제로 있는지 확인하세요. 먼저 내 질문을 적고, 그 질문에 직접 답하는 원문이 있는지 살펴보세요.",
      "body": "<div class=\"subject-page-grid reviewed-copy\"><article class=\"explainer-card\"><h3>탐구에 쓸 수 있는 자료인지 점검하세요</h3><p>예를 들어 AI가 “정류장이 가까우면 버스를 더 많이 탄다”는 주장의 근거를 제시했다면, 원문에서 조사 지역과 시점, ‘가깝다’와 ‘이용한다’를 어떻게 측정했는지 찾으세요. 뜻과 조건을 확인한 자료만 내 질문에 활용합니다.</p></article><article class=\"explainer-card\"><h3>내가 한 탐구를 남기세요</h3><p>AI 답과 원문이 다른 부분에는 표시하고, 원문을 찾지 못한 주장은 미확인으로 남기세요. 자기평가에는 내가 읽은 자료와 실제로 한 일, 이해한 점을 적으세요. AI 사용 내역을 밝혀야 하는 과제라면 과제 안내를 따릅니다.</p></article></div><aside class=\"admission-basis-note\"><strong>내가 해볼 일</strong><span>AI가 제시한 주장 하나를 고르고, 원문의 어느 부분이 근거인지 찾아 표시해 보세요.</span></aside>",
      "guide": {
        "title": "이해 점검",
        "items": [
          "AI가 제시한 논문 제목만으로 근거가 확인됐다고 볼 수 있나요?"
        ]
      },
      "basis": "일반 설명과 대학별 사례를 구분해 읽으세요. 지원 조건은 본인의 지원 학년도 최종 모집요강과 변경 공지로 확인합니다.",
      "understandingChecks": [
        {
          "question": "AI가 제시한 논문 제목만으로 근거가 확인됐다고 볼 수 있나요?",
          "answer": "논문 제목만으로는 근거가 확인되지 않습니다.",
          "explanation": "저자·발행 정보·원문과 실제 연구 방법·대상·결과를 확인해야 합니다. 제목이 존재해도 AI의 요약이 원문과 같다고 볼 수 없습니다.",
          "nextAction": "원문을 열어 주장에 해당하는 부분을 찾고 찾지 못한 내용은 미확인으로 남기세요."
        }
      ]
    },
    "holistic-interview": {
      "group": "holistic",
      "tone": "holistic",
      "title": "면접 형식과 준비 방법",
      "summary": "먼저 면접 형식을 확인하세요. 서류 기반 면접이라면 내가 왜 했고, 어떻게 확인했고, 다음에는 무엇을 더 알아볼지 설명해 보세요.",
      "heroLabel": "면접",
      "heroTitle": "서류 기반 면접과 제시문·교과 구술을 구분하세요",
      "heroText": "같은 대학에서도 전형과 모집단위에 따라 면접 형식이 다를 수 있습니다. 모집요강에서 면접 자료와 방식을 확인하고 대학의 공식 예시 문항을 찾아보세요.",
      "body": "<div class=\"subject-page-grid reviewed-copy\"><article class=\"explainer-card\"><h3>방과 후 버스 활동을 자기 말로 설명해 보세요</h3><p>“월요일 15분과 금요일 35분은 어떻게 구했나요?”라는 가상 질문에 답해 보세요. 오후 4시 10분에 정류장에 도착한다고 가정한 뒤 시간표에 표시된 다음 버스 시각에서 4시 10분을 뺐다고 설명할 수 있습니다.</p></article><article class=\"explainer-card\"><h3>다음 질문까지 준비하세요</h3><p>“실제로도 그만큼 기다렸나요?”라는 질문에는 시간표에서 계산한 예상 시간이며 실제로 확인하려면 정류장 도착 시각과 버스 도착 시각을 기록해야 한다고 답할 수 있습니다. 책을 읽었다면 어떤 내용이 비교 기준을 바꿨는지, 모둠 활동이라면 내가 맡은 일도 설명해 보세요.</p></article><article class=\"explainer-card\"><h3>제시문·교과 구술이라면 공식 자료를 풀어 보세요</h3><p>대학이 공개한 기출문제나 예시 문항을 읽고, 어떤 개념을 써서 풀이를 설명하는지 확인하세요. 대학의 실제 면접 안내에 맞춰 연습하세요.</p></article></div><aside class=\"admission-basis-note\"><strong>내가 해볼 일</strong><span>학생부에서 경험 하나를 골라 질문을 만든 이유, 직접 한 일, 설명할 근거, 남은 질문을 한 문장씩 말해 보세요.</span></aside>",
      "guide": {
        "title": "이해 점검",
        "items": [
          "서류 기반 면접 준비만으로 모든 면접 형식에 대비할 수 있나요?"
        ]
      },
      "basis": "일반 설명과 대학별 사례를 구분해 읽으세요. 지원 조건은 본인의 지원 학년도 최종 모집요강과 변경 공지로 확인합니다.",
      "understandingChecks": [
        {
          "question": "서류 기반 면접 준비만으로 모든 면접 형식에 대비할 수 있나요?",
          "answer": "모든 면접 형식에 대비한 것은 아닙니다.",
          "explanation": "서류 확인형, 제시문형 등 면접 형식과 평가 방식이 다릅니다. 학생부 설명 준비와 제시문 해석 연습은 필요한 준비가 다릅니다.",
          "nextAction": "지원 전형의 면접 형식과 공식 예시 문항을 확인한 뒤 실제 형식으로 연습하세요."
        }
      ]
    }
  },
  "verifiedCourseConditionCases": [
    {
      "id": "seoultech-2028",
      "admissionYear": 2028,
      "documentStatus": "시행계획",
      "conditionType": "지원자격",
      "minimumCredits": 80,
      "minimumDomesticGradeSemesters": 3,
      "lastIncludedSemester": "3-1",
      "scope": "학생부교과 고교추천전형",
      "sourceUrl": "https://admission.seoultech.ac.kr/cms/FR_BBS_CON/BoardView.do?MENU_ID=380&CONTENTS_NO=7&SITE_NO=2&BOARD_SEQ=3&BBS_SEQ=512",
      "sourcePages": [
        6,
        14
      ],
      "checkedAt": "2026-10-05"
    },
    {
      "id": "snu-2028",
      "admissionYear": 2028,
      "documentStatus": "전공 연계 과목 선택 안내",
      "conditionType": "권장·평가 반영",
      "subjectGroup": "제2외국어/한문",
      "minimumCourseCount": 1,
      "scope": "유형 ① 모집단위",
      "admissionEligibilityRequirement": false,
      "evaluationUses": [
        "수시 서류평가",
        "정시 교과역량평가"
      ],
      "sourceUrl": "https://snu.ac.kr/snunow/press?bbsidx=156226&md=v",
      "checkedAt": "2026-10-05"
    }
  ]
};
