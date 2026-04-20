const { expect } = require('@playwright/test');
const { Then } = require('../fixtures');

Then('o dropdown de ordenação deve estar visível', async ({ inventoryPage }) => {
  await expect(inventoryPage.sortDropdown).toBeVisible();
});

Then('a opção de ordenação padrão deve ser {string}', async ({ inventoryPage }, opcao) => {
  const selected = await inventoryPage.getSelectedSortOption();
  expect(selected).toBe(opcao);
});
