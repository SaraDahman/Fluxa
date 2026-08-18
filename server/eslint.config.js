import js from "@eslint/js";
import unusedImports from "eslint-plugin-unused-imports";
import tseslint from "typescript-eslint";
import globals from "globals";

export default tseslint.config(
  {
    ignores: ["dist", "node_modules"],
  },

  js.configs.recommended,

  ...tseslint.configs.recommended,

  {
    files: ["src/**/*.ts"],

    plugins: {
      "unused-imports": unusedImports,
    },

    languageOptions: {
      globals: globals.node,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },

    rules: {
      "no-console": "off",
      "unused-imports/no-unused-imports": "warn",
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        {
          prefer: "type-imports",
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  }
);
