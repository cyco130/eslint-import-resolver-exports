const path = require("node:path");
const test = require("node:test");

const { expect } = require("chai");

const resolver = require("../index.js");

const nodeModules = path.join(__dirname, "..", "node_modules");

const sourceFile = path.join(__dirname, "source.js");

function verifyResolution(module) {
  expect(resolver.resolve(module, sourceFile)).property("path")
    .to.equal(path.join(nodeModules, module, "index.js"));
}

test("resolves module", () => {
  verifyResolution("module");
});

test("resolves scoped module", () => {
  verifyResolution("@scoped/module");
});

test("resolves scoped module when aliased", () => {
  verifyResolution("scoped-module-aliased");
});
