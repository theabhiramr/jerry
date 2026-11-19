import js from "@eslint/js";
import globals from "globals";
import prettier from "eslint-config-prettier";

export default [
  { ignores: ["node_modules/"] },
  js.configs.recommended,
  {
    files: ["server.mjs", "app/**"],
    languageOptions: { globals: globals.node },
  },
  { files: ["public/**"], languageOptions: { globals: globals.browser } },
  { rules: { "no-unused-vars": ["error", { argsIgnorePattern: "^_" }] } },
  prettier,
];
