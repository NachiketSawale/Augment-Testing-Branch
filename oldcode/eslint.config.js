// eslint.config.js

module.exports = [
  {
    files: ["**/*.js"], // Lint all JS files in the project
    rules: {
      // General formatting and syntax rules
      "linebreak-style": "off",
      "indent": ["warn", "tab", { SwitchCase: 1 }],
      "wrap-iife": ["error", "inside"],
      "no-tabs": ["warn", { allowIndentationTabs: true }],
      "quotes": ["error", "single"],
      "no-mixed-spaces-and-tabs": ["warn", "smart-tabs"],
      "semi": ["error", "always"],
      "no-extra-semi": "error",
      "semi-spacing": ["error", { before: false, after: true }],
      "semi-style": ["error", "last"],
      "strict": ["error", "function"],

      // Code consistency and best practices
      "eqeqeq": ["error", "always"],
      "no-new-wrappers": "error",
      "no-var": "off",
      "func-names": "off",
      "no-unused-vars": [
        "warn",
        { vars: "all", args: "after-used", ignoreRestSiblings: false },
      ],
      "no-redeclare": "warn",
      "no-undef": "warn",
      "no-empty": "warn",
      "no-prototype-builtins": "warn",
      "no-useless-escape": "warn",
      "spaced-comment": [
        "warn",
        "always",
        {
          block: { exceptions: ["*", "-"], balanced: true },
          line: { exceptions: ["-", "*"] },
        },
      ],
    },
    languageOptions: {
      ecmaVersion: 7, // Use ECMAScript 7
      sourceType: "script", // Use script mode
      globals: {
        Atomics: "readonly",
        SharedArrayBuffer: "readonly",
        angular: "readonly",
      },
    },
  },
];
