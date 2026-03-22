import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const tsEslintPlugin = await import("@typescript-eslint/eslint-plugin");
const tsParser = await import("@typescript-eslint/parser");

export default [
  ...compat.extends(
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended"
  ),

  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser.default,
    },
    plugins: {
      "@typescript-eslint": tsEslintPlugin.default,
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
    },
  },
];
