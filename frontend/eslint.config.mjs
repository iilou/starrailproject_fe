import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",  // Disable the 'any' type rule
      "@typescript-eslint/no-unused-vars": "off",  // Disable unused vars rule
      "no-var": "warn",  // Show a warning for 'var', not an error
      "prefer-const": "warn",  // Show a warning for reassigned variables, not an error
      "react-hooks/exhaustive-deps": "warn",  // Warn about missing dependencies in useEffect
      "react/jsx-key": "warn",  // Warn about missing 'key' prop in JSX
      "no-empty": "off",  // Disable the 'empty object' type warning
    },
  },
];

export default eslintConfig;
