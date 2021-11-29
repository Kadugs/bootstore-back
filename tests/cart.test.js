/* eslint-disable no-undef */
import '../setup';
import supertest from 'supertest';
import app from '../src/app.js';
import connection from '../src/database.js';
import { createProduct } from './factories/productFactory.js';
import { createSession } from './factories/userFactory.js';

const agent = supertest(app);

beforeAll(async () => {
  await connection.query(`
    DELETE FROM cart; 
    DELETE FROM sessions;
    DELETE FROM users;
    DELETE FROM products;`);
});
describe('GET /cart', () => {
  it('return 401 for no token', async () => {
    const result = await agent.get('/cart');

    expect(result.status).toEqual(401);
  });

  it('return 200 for a valid token', async () => {
    const session = await createSession();
    const token = `Bearer ${session.token}`;

    const result = await agent.get('/cart').set('authorization', token);

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

describe('POST /cart', () => {
  it('should return 400 to invalid body', async () => {
    const result = await agent.post('/cart').send({
      code: '',
      quantity: 0,
    });

    expect(result.status).toEqual(400);
  });

  it('return 401 for no token', async () => {
    const product = await createProduct();
    const body = {
      code: product.code,
      quantity: 1,
    };

    const result = await agent.get('/cart').send(body);

    expect(result.status).toEqual(401);
  });

  it('return 200 for a valid token and product', async () => {
    const product = await createProduct();
    const session = await createSession();
    const body = {
      code: product.code,
      quantity: 1,
    };

    const result = await agent
      .get('/cart')
      .set('authorization', session.token)
      .send(body);

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
