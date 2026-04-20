class ApiClient {
  constructor(request, baseUrl) {
    this.request = request;
    this.baseUrl = baseUrl;
  }

  async get(endpoint, options = {}) {
    return this.request.get(`${this.baseUrl}${endpoint}`, options);
  }

  async post(endpoint, data, options = {}) {
    return this.request.post(`${this.baseUrl}${endpoint}`, { data, ...options });
  }
}

module.exports = { ApiClient };
