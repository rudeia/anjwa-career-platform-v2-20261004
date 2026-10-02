"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const source = fs.readFileSync(path.join(__dirname, "../pwa-install.js"), "utf8");

function setup(hadController, safeView) {
  const events = {};
  let reloads = 0;
  const navigator = {userAgent: "iPhone", platform: "", maxTouchPoints: 1,
    serviceWorker: {controller: hadController ? {} : null,
      addEventListener(name, handler) {events[name] = handler;}}};
  vm.runInNewContext(source, {
    navigator,
    document: {querySelector(selector) {return selector === "#home.active, #curriculum.active" && safeView ? {} : null;},
      addEventListener() {}},
    window: {navigator, location: {protocol: "https:", reload() {reloads++;}},
      matchMedia: () => ({matches: true}), addEventListener() {}}
  });
  return {events, reloads: () => reloads};
}
const safe = setup(true, true);
safe.events.controllerchange();
safe.events.controllerchange();
assert.equal(safe.reloads(), 1);
for (const [controller, safeView] of [[false, true], [true, false]]) {
  const other = setup(controller, safeView);
  other.events.controllerchange();
  assert.equal(other.reloads(), 0);
}
console.log("PWA update tests passed");
