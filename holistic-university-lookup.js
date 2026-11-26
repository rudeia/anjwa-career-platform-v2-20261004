(() => {
  "use strict";

  function normalizeUniversityName(value) {
    return String(value ?? "").normalize("NFKC").toLowerCase()
      .replace(/[^\p{L}\p{N}]/gu, "").replaceAll("대학교", "대");
  }

  function findUniversities(schools, query) {
    const search = normalizeUniversityName(query);
    if (!search) return [];
    const names = (school) => [school.name, ...school.aliases].map(normalizeUniversityName);
    const exact = schools.filter((school) => names(school).includes(search));
    return exact.length ? exact : schools.filter((school) => names(school).some((name) => name.includes(search)));
  }

  function renderTrack(track, source) {
    const finalScore = track.interviewPercent
      ? `서류 ${track.documentPercent}% · 면접 ${track.interviewPercent}%`
      : `서류 ${track.documentPercent}% · 면접 없음`;
    const criterionNote = track.criterionStatus === "배점 공개" ? "" :
      '<p class="holistic-lookup-note">확인한 2028학년도 자료에는 서류 평가 항목별 배점이 나와 있지 않습니다.</p>';
    return `<article class="holistic-lookup-track">
      <h4>${escapeHtml(track.name)}</h4>
      <dl>
        <div><dt>최종 점수 반영 비율</dt><dd><strong>${escapeHtml(finalScore)}</strong>
          ${track.selectionNote ? `<p class="holistic-lookup-note">${escapeHtml(track.selectionNote)}</p>` : ""}
        </dd></div>
        <div><dt>수능최저</dt><dd>${escapeHtml(track.minimum)}</dd></div>
        <div><dt>서류 점수를 매기는 기준</dt><dd>${escapeHtml(track.documentCriteria)}${criterionNote}</dd></div>
      </dl>
      <details class="admission-reading-more">
        <summary>선발 단계·면접·원문 보기</summary>
        <dl>
          <div><dt>선발 방식</dt><dd>${escapeHtml(track.stage === "일괄" ? "전체 지원자를 한 번에 평가해 선발" : track.stage)}</dd></div>
          <div><dt>면접 방식</dt><dd>${escapeHtml(track.interviewMethod)}</dd></div>
          <div><dt>지원 전에 확인할 내용</dt><dd>${escapeHtml(track.scope)}</dd></div>
          <div><dt>원문에서 찾을 곳</dt><dd>${escapeHtml(track.location)}</dd></div>
        </dl>
        ${renderContentSourceLink(source.url, source.label)}
        ${source.supplement ? renderContentSourceLink(source.supplement.url, source.supplement.label) : ""}
      </details>
    </article>`;
  }

  function renderUniversity(school, data) {
    return `<h3 tabindex="-1">${escapeHtml(school.name)}</h3>
      <p>${data.year}학년도 시행계획 · 대표 전형과 모집단위 ${school.tracks.length}건
        <small class="holistic-lookup-note">· 자료 확인 ${escapeHtml(data.checkedOn.replaceAll("-", "."))}</small>
      </p>
      <div class="holistic-lookup-tracks">${school.tracks.map((track) => renderTrack(track, school.source)).join("")}</div>
      <details class="admission-reading-more holistic-lookup-prior">
        <summary>${data.referenceYear}학년도 서류 평가 기준 참고</summary>
        <p>아래는 ${data.referenceYear}학년도 서류 평가 기준입니다. ${data.year}학년도에 지원한다면 해당 학년도의 시행계획과 최종 모집요강을 확인하세요.</p>
        <dl>${school.reference.tracks.map((track) =>
          `<div><dt>${escapeHtml(track.name)}</dt><dd>${escapeHtml(track.criteria)}<p class="holistic-lookup-note">${escapeHtml(track.note)}</p></dd></div>`
        ).join("")}</dl>
        ${renderContentSourceLink(school.reference.url, `어디가 ${data.referenceYear} 평가기준 원문`)}
      </details>`;
  }

  function initLookup() {
    const section = document.getElementById("holistic-universities");
    if (!section) return;
    const form = section.querySelector("form");
    const input = document.getElementById("holistic-university-query");
    const select = document.getElementById("holistic-university-select");
    const status = document.getElementById("holistic-university-status");
    const results = document.getElementById("holistic-university-results");
    const data = window.ANJWA_HOLISTIC_UNIVERSITY_DATA;
    if (!data?.schools.length) {
      form.hidden = true;
      status.textContent = "대학별 기준을 불러오지 못했습니다. 페이지를 새로고침해 주세요.";
      return;
    }
    const groups = new Map();
    for (const school of data.schools) {
      if (!groups.has(school.group)) {
        const group = document.createElement("optgroup");
        group.label = school.group;
        select.append(group);
        groups.set(school.group, group);
      }
      groups.get(school.group).append(new Option(school.name, school.id));
    }
    const schoolById = new Map(data.schools.map((school) => [school.id, school]));

    function showUniversity(school, { focus = false } = {}) {
      select.value = school?.id ?? "";
      status.classList.toggle("is-announcement", Boolean(school));
      status.textContent = school ? `${school.name} 조회 결과입니다.` : "";
      results.innerHTML = school ? renderUniversity(school, data) : "";
      results.hidden = !school;
      if (school && focus) {
        const heading = results.querySelector("h3");
        heading.focus({ preventScroll: true });
        heading.scrollIntoView({ block: "start" });
      }
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const matches = findUniversities(data.schools, input.value);
      if (matches.length === 1) {
        showUniversity(matches[0], { focus: true });
        return;
      }
      showUniversity();
      if (matches.length > 1) {
        status.textContent = `검색 결과가 ${matches.length}곳입니다. 찾던 대학을 선택하세요.`;
        const candidates = document.createElement("div");
        candidates.className = "holistic-lookup-matches";
        for (const school of matches) {
          const button = document.createElement("button");
          button.type = "button";
          button.className = "ghost-button";
          button.textContent = school.name;
          button.dataset.schoolId = school.id;
          candidates.append(button);
        }
        results.replaceChildren(candidates);
        results.hidden = false;
        return;
      }
      status.textContent = normalizeUniversityName(input.value)
        ? "이 이름으로 찾은 대학이 없습니다. 다른 이름으로 검색하거나 목록에서 골라 보세요."
        : "대학 이름을 입력하거나 목록에서 골라 보세요.";
    });

    select.addEventListener("change", () => {
      input.value = "";
      showUniversity(schoolById.get(select.value));
    });
    results.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-school-id]");
      if (button) showUniversity(schoolById.get(button.dataset.schoolId), { focus: true });
    });
    if (location.hash === "#holistic-universities") section.scrollIntoView();
  }

  if (typeof module === "object" && module.exports) {
    module.exports = { findUniversities };
  } else {
    document.addEventListener("DOMContentLoaded", initLookup);
  }
})();
