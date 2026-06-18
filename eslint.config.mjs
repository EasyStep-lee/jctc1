import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import prettier from "eslint-config-prettier";

export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.next/**",
      "**/coverage/**",
      "**/playwright-report/**"
    ]
  },
  js.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        sourceType: "module"
      },
      globals: {
        console: "readonly"
      }
    },
    plugins: {
      "@typescript-eslint": tsPlugin
    },
    rules: {
      ...tsPlugin.configs.recommended.rules
    }
  },
  {
    files: ["apps/api/**/*.ts", "packages/**/*.ts"],
    languageOptions: {
      globals: {
        process: "readonly",
        Buffer: "readonly"
      }
    }
  },
  {
    files: ["**/*.mjs"],
    languageOptions: {
      globals: {
        process: "readonly",
        Buffer: "readonly"
      }
    }
  },
  {
    files: ["apps/admin-web/**/*.ts", "apps/admin-web/**/*.tsx", "apps/merchant-web/**/*.ts", "apps/merchant-web/**/*.tsx", "apps/portal-web/**/*.ts", "apps/portal-web/**/*.tsx"],
    languageOptions: {
      globals: {
        document: "readonly",
        HTMLElement: "readonly",
        window: "readonly"
      }
    }
  },
  {
    files: ["apps/user-miniapp/**/*.ts", "apps/logistics-miniapp/**/*.ts"],
    languageOptions: {
      globals: {
        App: "readonly",
        Page: "readonly",
        wx: "readonly"
      }
    }
  },
  prettier
];
