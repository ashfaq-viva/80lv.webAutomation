// import js from "@eslint/js";
// import globals from "globals";
// import { defineConfig } from "eslint/config";

// export default defineConfig([
//   { files: ["**/*.{js,mjs,cjs}"], plugins: { js }, extends: ["js/recommended"], languageOptions: { globals: {...globals.browser, ...globals.node} } },
// ]);
import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      parser: require.resolve("@babel/eslint-parser"), // 👈 add parser
      parserOptions: {
        ecmaVersion: "latest", // or 2022
        sourceType: "module",
        requireConfigFile: false, // allows parsing without a babel.config.js
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
];
