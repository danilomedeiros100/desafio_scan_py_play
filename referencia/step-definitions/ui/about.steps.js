const { expect } = require('@playwright/test');
const { When, Then } = require('../fixtures');

When('abro o menu lateral', async ({ inventoryPage }) => {
  await inventoryPage.openSideMenu();
});

Then('devo ver o link Sobre', async ({ inventoryPage }) => {
  await expect(inventoryPage.aboutLink).toBeVisible();
});

When('abro o link Sobre no menu lateral', async ({ inventoryPage, world }) => {
  world.aboutTargetPage = await inventoryPage.goToAboutFromMenu();
});

Then('devo acessar uma página com URL contendo {string}', async ({ world, page }, fragmento) => {
  const target = world.aboutTargetPage;
  expect(target).toBeTruthy();
  expect(target.url().toLowerCase()).toContain(fragmento.toLowerCase());
  if (target !== page) {
    await target.close();
  } else {
    await page.goBack({ waitUntil: 'domcontentloaded' });
  }
});
