/* eslint-disable no-undef */
import '../setup';
import supertest from 'supertest';
import app from '../src/app.js';
import connection from '../src/database.js';
import { createProduct } from './factories/productFactory.js';

const agent = supertest(app);

describe('GET /products', () => {
  it('returns 200 without any query', async () => {
    const result = await agent.get('/products');

    expect(result.status).toEqual(200);
  });
  it('returns 200 with name query', async () => {
    const result = await agent.get('/products?name=console');

    expect(result.status).toEqual(200);
  });
  it('returns 200 with ordeyby query', async () => {
    const result = await agent.get('/products?orderby=visits');

    expect(result.status).toEqual(200);
  });
  it('returns 200 with name and orderby query', async () => {
    const result = await agent.get('/products?name=console&orderby=visits');

    expect(result.status).toEqual(200);
  });
});

describe('GET /products/quantity/:codes', () => {
  it('return 404 for no codes on query', async () => {
    const result = await agent.get('/products/quantity/:codes');

    expect(result.status).toEqual(404);
  });

  it('return 200 for codes on query', async () => {
    const product = await createProduct();

    const result = await agent.get(`/products/quantity/:codes?codes=${product.code}`);

    expect(result.status).toEqual(200);
  });

  afterAll(async () => {
    await connection.query(`
    DELETE FROM products;
    DELETE FROM categories;
    DELETE FROM brands;
    DELETE FROM ratings;
    DELETE FROM sales;
    DELETE FROM sessions;
    DELETE FROM users;
    `);
  });
});
afterAll(() => {
  connection.end();
});
