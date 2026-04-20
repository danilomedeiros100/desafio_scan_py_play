class UsersApi {
  constructor(apiClient) {
    this.apiClient = apiClient;
  }

  async getUsers() {
    return this.apiClient.get('/users');
  }

  async getUserById(id) {
    return this.apiClient.get(`/users/${id}`);
  }
}

module.exports = { UsersApi };
