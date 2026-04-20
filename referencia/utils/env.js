require('dotenv').config();

const env = {
  baseUrl: process.env.BASE_URL || 'https://www.saucedemo.com',
  apiUrl: process.env.API_URL || 'https://jsonplaceholder.typicode.com',
  uiUser: process.env.UI_USER || 'standard_user',
  uiPass: process.env.UI_PASS || 'secret_sauce',
};

module.exports = { env };
