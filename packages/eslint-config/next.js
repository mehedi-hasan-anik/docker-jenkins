const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    "turbo",
    "prettier",
    "next/core-web-vitals",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
  ],
  parserOptions: {
    project,
  },
  settings: {
    react: { version: "detect" },
  },
  rules: {
    "import/no-default-export": "off",
  },
  ignorePatterns: [".next/", "node_modules/"],
};
