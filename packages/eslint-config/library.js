const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["turbo", "prettier"],
  parserOptions: {
    project,
  },
  rules: {
    "import/no-default-export": "off",
  },
  ignorePatterns: ["dist/", ".next/", "node_modules/"],
};
