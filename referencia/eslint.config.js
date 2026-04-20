const playwright = require('eslint-plugin-playwright');

module.exports = [
  {
    ...playwright.configs['flat/recommended'],
    files: ['tests/**/*.js'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
    },
  },
];
