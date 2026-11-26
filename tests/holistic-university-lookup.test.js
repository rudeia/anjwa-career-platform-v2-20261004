const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");
const { findUniversities } = require("../holistic-university-lookup.js");

const context = { window: {} };
const dataFile = path.join(__dirname, "..", "holistic-university-data.js");
vm.runInNewContext(fs.readFileSync(dataFile, "utf8"), context);
const data = context.window.ANJWA_HOLISTIC_UNIVERSITY_DATA;
const ids = (matches) => Array.from(matches, (school) => school.id);
const school = (id) => data.schools.find((entry) => entry.id === id);
const trackCount = (tracks) => tracks.reduce((total, school) => total + school.length, 0);

test("publishes the reviewed 2028 and 2027 records with distinct years and official sources", () => {
  assert.equal(data.year, 2028);
  assert.equal(data.referenceYear, 2027);
  assert.equal(new Set(ids(data.schools)).size, 24);
  assert.equal(trackCount(data.schools.map((entry) => entry.tracks)), 48);
  assert.equal(trackCount(data.schools.map((entry) => entry.reference.tracks)), 33);
  for (const entry of data.schools) {
    assert.equal(new URL(entry.source.url).protocol, "https:");
    assert.match(entry.reference.url, /[?&]searchSyr=2027(?:&|$)/);
    for (const track of entry.tracks) {
      assert.ok(track.documentCriteria && track.location);
      assert.equal(track.documentPercent + track.interviewPercent, 100);
    }
  }
});

test("looks up full, short, and spaced Korean names, and returns multiple candidates when appropriate", () => {
  assert.deepEqual(ids(findUniversities(data.schools, "전남대학교")), ["jnu"]);
  assert.deepEqual(ids(findUniversities(data.schools, " 한 국 외 국 어 대 학 교 ")), ["hufs"]);
  assert.deepEqual(ids(findUniversities(data.schools, "고대")), ["korea"]);
  assert.deepEqual(ids(findUniversities(data.schools, "충")), ["cnu", "cbnu"]);
  assert.deepEqual(ids(findUniversities(data.schools, "홍익대학교 세종")), []);
  assert.deepEqual(ids(findUniversities(data.schools, "  ")), []);
});

test("keeps the Busan final selection weights apart from the document score weights", () => {
  const interviewTrack = school("pnu").tracks.find((track) => track.name === "면접전형");
  assert.equal(interviewTrack.documentPercent, 70);
  assert.equal(interviewTrack.interviewPercent, 30);
  assert.match(interviewTrack.documentCriteria, /학업역량 30%, 탐구역량 50%, 사회역량 20%/);
});

test("shows the previous year Jeonnam document scores only as historical data", () => {
  const jeonnam = school("jnu");
  assert.ok(jeonnam.tracks.every((track) => track.criterionStatus === "평가 요소 공개"));
  assert.doesNotMatch(jeonnam.tracks[0].documentCriteria, /\d/);
  assert.match(jeonnam.reference.tracks[0].criteria, /진로역량 280점/);
});

test("uses the 2028 Korea University dual application rule and exposes the Chung-Ang medical exception", () => {
  const korea = school("korea");
  assert.match(korea.tracks[0].scope, /학교추천전형과 함께 지원할 수 있습니다/);
  assert.match(korea.source.url, /^https:\/\/oku\.korea\.ac\.kr\//);
  const up = school("cau").tracks.find((track) => track.name === "최저 있는 학종(Up)");
  assert.match(up.selectionNote, /의학부는 2단계에서 1단계 성적 60%와 면접 40%/);
});
