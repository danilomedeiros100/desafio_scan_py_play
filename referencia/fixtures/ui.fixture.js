const { test: base, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { HomePage } = require('../pages/HomePage');
const { InventoryPage } = require('../pages/InventoryPage');
const { env } = require('../utils/env');

const test = base.extend({
  loginPage: async ({ page }, use) => {
    await page.goto(env.baseUrl);
    await use(new LoginPage(page));
  },

  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
});

module.exports = { test, expect };
