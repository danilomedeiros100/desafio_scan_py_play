const { expect } = require('@playwright/test');
const { Given, When, Then } = require('../fixtures');
const { env } = require('../../src/utils/env');

Given('que estou na página de login', async ({ loginPage }) => {
  await expect(loginPage.loginButton).toBeVisible();
});

When('preencho as credenciais de acesso válidas', async ({ loginPage }) => {
  await loginPage.submitLogin(env.uiUser, env.uiPass);
});

When('faço login com usuário {string} e senha {string}', async ({ loginPage }, usuario, senha) => {
  await loginPage.submitLogin(usuario, senha);
});

Then('devo ser redirecionado ao inventário de produtos', async ({ page }) => {
  await page.waitForURL('**/inventory.html', { timeout: 10000 });
  await expect(page.locator('.inventory_list')).toBeVisible();
});

Then('devo ver mensagem de erro contendo {string}', async ({ loginPage }, mensagem) => {
  await expect(loginPage.errorMessage).toBeVisible();
  await expect(loginPage.errorMessage).toContainText(mensagem);
});
