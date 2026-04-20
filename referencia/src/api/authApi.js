class AuthApi {
  constructor(apiClient) {
    this.apiClient = apiClient;
  }

  async login(email, password) {
    return this.apiClient.post('/api/login', { email, password });
  }
}

module.exports = { AuthApi };
