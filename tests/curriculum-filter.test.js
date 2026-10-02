"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.join(__dirname, "..");
const summaryElement = { innerHTML: "" };
const elements = new Map([["#curriculumSummary", summaryElement]]);
function element(selector) {
  if (!elements.has(selector)) elements.set(selector, {
    value: "", innerHTML: "", textContent: "", listeners: {},
    addEventListener(name, callback) { this.listeners[name] = callback; }
  });
  return elements.get(selector);
}
const context = {
  window: {},
  console: { warn() {} },
  document: {
    addEventListener() {},
    querySelector: element,
    querySelectorAll() { return []; }
  }
};

vm.runInNewContext(fs.readFileSync(path.join(root, "curriculum-data.js"), "utf8"), context);
vm.runInNewContext(fs.readFileSync(path.join(root, "app.js"), "utf8"), context);

for (const [plan, grade] of Object.entries({
  incoming2027: "1",
  incoming2026: "1",
  incoming2025: "2",
  incoming2024: "3"
})) {
  assert.equal(vm.runInNewContext(`currentCurriculumGradeByPlan.${plan}`, context), grade);
}

for (const plan of ["incoming2027", "incoming2026", "incoming2025"]) {
  assert.doesNotThrow(() => vm.runInNewContext(
    `renderCurriculumSummary(curriculumData.plans.${plan}, ["2-1"], [])`, context
  ));
  assert.match(summaryElement.innerHTML, /29<\/b>교과 이수학점/);
}

vm.runInNewContext('renderCurriculumSummary({courses: []}, ["1-1"], [])', context);
assert.match(summaryElement.innerHTML, /-<\/b>교과 이수학점/);

// Mobile input events update the table even when browser storage cannot be written.
vm.runInNewContext('saveState = () => { throw new Error("storage unavailable"); }; bindCurriculumControls();', context);
function select(id, value, event = "input") {
  const target = element("#" + id);
  target.value = value;
  target.listeners[event]({ target });
}
select("curriculumPlan", "incoming2027");
select("curriculumGrade", "2");
select("curriculumSemester", "2");
assert.equal(element("#curriculumGrade").value, "2");
assert.equal(element("#curriculumSemester").value, "2");
assert.match(element("#curriculumTableBody").innerHTML, /문학/);
assert.doesNotMatch(element("#curriculumTableBody").innerHTML, /공통국어1/);
select("curriculumGrade", "3", "change");
assert.match(element("#curriculumTableBody").innerHTML, /스포츠 문화/);
select("curriculumScope", "grade");
assert.match(element("#curriculumTableBody").innerHTML, /화법과 언어/);
assert.match(element("#curriculumTableBody").innerHTML, /스포츠 문화/);

for (const plan of ["current2026", "incoming2027", "incoming2026", "incoming2025", "incoming2024"]) {
  select("curriculumPlan", plan);
  for (const scope of ["semester", "grade", "semesterAllGrades", "plan"]) {
    select("curriculumScope", scope);
    for (const grade of ["1", "2", "3"]) {
      select("curriculumGrade", grade);
      for (const semester of ["1", "2"]) {
        select("curriculumSemester", semester);
        assert.doesNotMatch(summaryElement.innerHTML, /<b>-<\/b>/);
        assert.ok(element("#curriculumTableBody").innerHTML.includes("<tr"));
      }
    }
  }
}

context.localStorage = {
  getItem: () => JSON.stringify({activeCurriculumPlan: "incoming2027", activeCurriculumScope: "semester",
    curriculumGrade: "3", curriculumSemester: "2"})
};
vm.runInNewContext('loadState(); renderCurriculumPlanOptions(); renderCurriculum();', context);
assert.equal(element("#curriculumGrade").value, "3");
assert.equal(element("#curriculumSemester").value, "2");
assert.match(element("#curriculumTableBody").innerHTML, /스포츠 문화/);

vm.runInNewContext(
  'renderCurriculumSummary(curriculumData.plans.current2026, ["1-1"], [])', context
);
assert.match(summaryElement.innerHTML, /29<\/b>교과 이수학점/);

console.log("curriculum filter tests passed");
