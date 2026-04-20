const { expect } = require('@playwright/test');
const { When, Then } = require('../fixtures');
const { payloads } = require('../../src/utils/data');

When('crio um post com título {string} e corpo {string}', async ({ postsApi, world }, titulo, corpo) => {
  world.response = await postsApi.createPost({ title: titulo, body: corpo, userId: 1 });
  world.postTitle = titulo;
});

Then('o corpo deve conter uma lista não vazia de posts', async ({ world }) => {
  const body = await world.response.json();
  expect(Array.isArray(body)).toBe(true);
  expect(body.length).toBeGreaterThan(0);
});

Then('o post retornado deve ter id {int} com campos obrigatórios preenchidos', async ({ world }, id) => {
  const body = await world.response.json();
  expect(body).toHaveProperty('id', id);
  expect(body).toHaveProperty('title');
  expect(body).toHaveProperty('body');
  expect(body).toHaveProperty('userId');
});

Then('o post criado deve conter o título {string}', async ({ world }, titulo) => {
  const body = await world.response.json();
  expect(body).toHaveProperty('id');
  expect(body).toHaveProperty('title', titulo);
});

Then('todos os comentários devem pertencer ao postId {int} e ter email válido', async ({ world }, postId) => {
  const body = await world.response.json();
  expect(Array.isArray(body)).toBe(true);
  expect(body.length).toBeGreaterThan(0);
  body.forEach(comment => {
    expect(comment).toHaveProperty('postId', postId);
    expect(comment.email).toMatch(/@/);
  });
});
