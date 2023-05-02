// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

/** @type {import("eslint").Linter.Config}*/
const config = {
  overrides: [
    {
      extends: [
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "next/core-web-vitals",
      ],
      files: ["*.ts", "*.tsx"],
      parserOptions: {
        project: path.resolve(__dirname, "./tsconfig.json"),
      },
    },
    {
      files: ["functions/**/*.ts"],
      extends: [
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "next/core-web-vitals",
      ],
      parserOptions: {
        project: path.resolve(__dirname, "./functions/tsconfig.json"),
      },
    },
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
};

module.exports = config;
