const { expect } = require('@playwright/test');
const { When, Then } = require('../fixtures');

When('faço uma requisição GET para {string}', async ({ usersApi, postsApi, world }, endpoint) => {
  if (endpoint.startsWith('/users')) {
    const id = endpoint.match(/\/users\/(\d+)/)?.[1];
    world.response = id
      ? await usersApi.getUserById(Number(id))
      : await usersApi.getUsers();
  } else if (endpoint.startsWith('/posts') || endpoint.startsWith('/comments')) {
    const id = endpoint.match(/\/posts\/(\d+)/)?.[1];
    const postId = endpoint.match(/postId=(\d+)/)?.[1];
    if (postId) {
      world.response = await postsApi.getCommentsByPost(Number(postId));
    } else if (id) {
      world.response = await postsApi.getPostById(Number(id));
    } else {
      world.response = await postsApi.getPosts();
    }
  }
});

Then('o status da resposta deve ser {int}', async ({ world }, statusEsperado) => {
  expect(world.response.status()).toBe(statusEsperado);
});

Then('o corpo deve conter uma lista não vazia de usuários', async ({ world }) => {
  const body = await world.response.json();
  expect(Array.isArray(body)).toBe(true);
  expect(body.length).toBeGreaterThan(0);
});

Then('o usuário retornado deve ter id {int} com campos obrigatórios preenchidos', async ({ world }, id) => {
  const body = await world.response.json();
  expect(body).toHaveProperty('id', id);
  expect(body).toHaveProperty('name');
  expect(body).toHaveProperty('email');
});
