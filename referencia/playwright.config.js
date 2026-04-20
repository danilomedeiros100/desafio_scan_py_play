require('dotenv').config();
const { defineConfig, devices } = require('@playwright/test');
const { defineBddConfig } = require('playwright-bdd');
const { allureMetadataFromBddTagsListener } = require('./src/utils/allureFromPlaywrightTagsListener');

module.exports = defineConfig({
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['html', { outputFolder: 'reports/playwright-report', open: 'never' }],
    ['allure-playwright', {
      resultsDir: 'reports/allure-results',
      detail: true,
      suiteTitle: false,
      listeners: [allureMetadataFromBddTagsListener()],
      environmentInfo: {
        Ambiente: process.env.CI ? 'CI / GitHub Actions' : 'Local',
        'UI URL': process.env.BASE_URL || 'https://www.saucedemo.com',
        'API URL': process.env.API_URL || 'https://jsonplaceholder.typicode.com',
        Node: process.version,
        Playwright: require('@playwright/test/package.json').version,
      },
      // Categorias: não definir aqui — o Allure aplica as padrão automaticamente.
      // Opcional: ver scripts/prepare-allure-categories.js + config/allure-categories.json
    }],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'https://www.saucedemo.com',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
  outputDir: 'reports/test-results',
  projects: [
    {
      // Nome só para o runner; no Allure o parentSuite vem das tags @allure.label.parentSuite
      name: 'chrome-desktop',
      use: { ...devices['Desktop Chrome'] },
      testDir: defineBddConfig({
        features: 'features/**/*.feature',
        steps: ['step-definitions/**/*.js'],
        outputDir: '.features-gen',
      }),
    },
  ],
});
