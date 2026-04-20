const { expect } = require('@playwright/test');
const { When, Then } = require('../fixtures');

When('realizo o logout pelo menu lateral', async ({ inventoryPage }) => {
  await inventoryPage.logout();
});

Then('devo ser redirecionado à página de login', async ({ loginPage }) => {
  await expect(loginPage.loginButton).toBeVisible();
});
