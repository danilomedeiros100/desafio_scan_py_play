const { test: base, expect } = require('@playwright/test');
const { ApiClient } = require('../api/apiClient');
const { UsersApi } = require('../api/usersApi');
const { AuthApi } = require('../api/authApi');
const { PostsApi } = require('../api/postsApi');
const { env } = require('../utils/env');

const test = base.extend({
  apiClient: async ({ request }, use) => {
    await use(new ApiClient(request, env.apiUrl));
  },

  usersApi: async ({ request }, use) => {
    const client = new ApiClient(request, env.apiUrl);
    await use(new UsersApi(client));
  },

  authApi: async ({ request }, use) => {
    const client = new ApiClient(request, env.apiUrl);
    await use(new AuthApi(client));
  },

  postsApi: async ({ request }, use) => {
    const client = new ApiClient(request, env.apiUrl);
    await use(new PostsApi(client));
  },
});

module.exports = { test, expect };
