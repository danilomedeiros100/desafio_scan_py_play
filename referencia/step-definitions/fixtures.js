const { test: base, createBdd } = require('playwright-bdd');
const { expect } = require('@playwright/test');
const { LoginPage } = require('../src/pages/LoginPage');
const { InventoryPage } = require('../src/pages/InventoryPage');
const { ApiClient } = require('../src/api/apiClient');
const { UsersApi } = require('../src/api/usersApi');
const { PostsApi } = require('../src/api/postsApi');
const { env } = require('../src/utils/env');

const test = base.extend({
  // Compartilha estado entre steps (ex: response de API)
  world: async ({}, use) => {
    await use({});
  },

  // UI fixtures
  loginPage: async ({ page }, use) => {
    await page.goto(env.baseUrl);
    await use(new LoginPage(page));
  },

  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },

  // API fixtures
  usersApi: async ({ request }, use) => {
    const client = new ApiClient(request, env.apiUrl);
    await use(new UsersApi(client));
  },

  postsApi: async ({ request }, use) => {
    const client = new ApiClient(request, env.apiUrl);
    await use(new PostsApi(client));
  },
});

const { Given, When, Then } = createBdd(test);

module.exports = { test, expect, Given, When, Then };
