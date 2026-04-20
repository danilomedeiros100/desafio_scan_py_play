const { BasePage } = require('./BasePage');

class HomePage extends BasePage {
  constructor(page) {
    super(page);
    this.inventoryList = page.locator('.inventory_list');
    this.pageTitle = page.locator('.title');
  }

  async isLoaded() {
    return this.inventoryList.isVisible();
  }
}

module.exports = { HomePage };
