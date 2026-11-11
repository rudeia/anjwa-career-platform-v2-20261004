'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

test('switching the curriculum department keeps both home links and navigation in sync', () => {
  const source = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
  const start = source.indexOf('function syncDepartmentNavigation(');
  const end = source.indexOf('\nfunction getInitialViewFromHash', start);
  assert.ok(start >= 0 && end > start);
  const home = {dataset:{}, textContent:''}, current = {textContent:''};
  const locationBar = {hidden:false, querySelector:s => s === 'button' ? home : current};
  const nav = {hidden:false}, back = {dataset:{},textContent:''}, cohorts = [];
  const context = {
    state:{activeView:'curriculum',curriculumDepartment:'general',activeCurriculumPlan:'incoming2027'},
    document:{body:{classList:{toggle(){}}},getElementById:id => id === 'literaryLocation' ? locationBar : {querySelector:()=>({textContent:'우리학교 교육과정'})}},
    window:{AnjwaMilitaryGuide:{setCohort:value => cohorts.push(value)}},
    $:selector => selector === '.app-bottom-nav' ? nav : back
  };
  vm.createContext(context);
  vm.runInContext(source.slice(start, end), context);
  context.syncDepartmentNavigation();
  assert.equal(home.dataset.view, 'home');
  assert.equal(nav.hidden, false);
  context.state.curriculumDepartment = 'military';
  context.syncDepartmentNavigation();
  assert.equal(home.dataset.view, 'military');
  assert.equal(home.textContent, '부사관과 홈');
  assert.equal(back.dataset.view, 'military');
  assert.equal(nav.hidden, true);
  assert.equal(cohorts.at(-1), 'incoming2027');
  context.state.curriculumDepartment = 'general';
  context.syncDepartmentNavigation();
  assert.equal(home.dataset.view, 'home');
  assert.equal(home.textContent, '보통과 홈');
  assert.equal(back.dataset.view, 'home');
  assert.equal(nav.hidden, false);
  assert.equal(current.textContent, '우리학교 교육과정');
  context.syncDepartmentNavigation('departments');
  assert.equal(locationBar.hidden, true);
});
