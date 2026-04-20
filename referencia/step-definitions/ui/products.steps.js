const { expect } = require('@playwright/test');
const { Given, When, Then } = require('../fixtures');
const { env } = require('../../src/utils/env');

Given('que estou logado no sistema', async ({ loginPage, page }) => {
  await loginPage.login(env.uiUser, env.uiPass);
  await page.waitForURL('**/inventory.html', { timeout: 10000 });
});

Then('devo ver a lista de produtos', async ({ inventoryPage }) => {
  await expect(inventoryPage.inventoryList).toBeVisible();
});

Then('a quantidade de produtos deve ser maior que zero', async ({ inventoryPage }) => {
  const count = await inventoryPage.getItemCount();
  expect(count).toBeGreaterThan(0);
});

Then('o título da página de inventário deve ser {string}', async ({ inventoryPage }, titulo) => {
  await expect(inventoryPage.pageTitle).toHaveText(titulo);
});

When('adiciono o primeiro produto ao carrinho', async ({ inventoryPage }) => {
  await inventoryPage.addFirstItemToCart();
});

Then('o contador do carrinho deve exibir {string}', async ({ inventoryPage }, contador) => {
  await expect(inventoryPage.cartBadge).toBeVisible();
  expect(await inventoryPage.getCartCount()).toBe(contador);
});
