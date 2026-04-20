class BasePage {
  constructor(page) {
    this.page = page;
  }

  async navigate(path = '') {
    await this.page.goto(path);
  }

  async getTitle() {
    return this.page.title();
  }
}

module.exports = { BasePage };
