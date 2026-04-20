const { BasePage } = require('./BasePage');

class InventoryPage extends BasePage {
  constructor(page) {
    super(page);
    this.inventoryList = page.locator('.inventory_list');
    this.inventoryItems = page.locator('.inventory_item');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
    this.pageTitle = page.locator('.title');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.burgerMenu = page.locator('#react-burger-menu-btn');
    this.aboutLink = page.locator('#about_sidebar_link');
    this.logoutLink = page.locator('#logout_sidebar_link');
  }

  async openSideMenu() {
    await this.burgerMenu.click();
  }

  /**
   * O demo pode abrir o About em nova aba ou na mesma aba, conforme o site.
   */
  async goToAboutFromMenu() {
    await this.openSideMenu();
    const context = this.page.context();
    const maybePopup = context.waitForEvent('page', { timeout: 3000 }).catch(() => null);
    await this.aboutLink.click();
    const popup = await maybePopup;
    if (popup) {
      await popup.waitForLoadState('domcontentloaded');
      return popup;
    }
    await this.page.waitForURL(/saucelabs/i, { timeout: 20000 });
    await this.page.waitForLoadState('domcontentloaded');
    return this.page;
  }

  async getItemCount() {
    return this.inventoryItems.count();
  }

  async addFirstItemToCart() {
    await this.inventoryItems.first().locator('button').click();
  }

  async getCartCount() {
    return this.cartBadge.textContent();
  }

  async getSelectedSortOption() {
    return this.sortDropdown.locator('option:checked').innerText();
  }

  async logout() {
    await this.burgerMenu.click();
    await this.logoutLink.click();
  }
}

module.exports = { InventoryPage };
