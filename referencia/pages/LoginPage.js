const { BasePage } = require('./BasePage');

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  // Preenche e submete o formulário sem aguardar navegação
  async submitLogin(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  // Submete e aguarda redirect para o inventário (login com sucesso)
  async login(username, password) {
    await this.submitLogin(username, password);
    await this.page.waitForURL('**/inventory.html', { timeout: 10000 });
  }
}

module.exports = { LoginPage };
