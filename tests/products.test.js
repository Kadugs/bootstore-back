import supertest from 'supertest';
import faker from 'faker';
import app from '../src/app.js';
import connection from '../src/database/database.js';
import { createProduct } from './factories/productFactory.js';

const agent = supertest(app);

describe('product-details', () => {
  afterAll(async () => {
    await connection.query('DELETE FROM products;');
    await connection.query('DELETE FROM brands;');
    await connection.query('DELETE FROM categories;');
  });

  it('send a valid code expects 200', async () => {
    const product = await createProduct();
    const result = await agent.get(`/product/${product.code}`);
    expect(result.status).toEqual(200);
  });
  it('send a valid code expects 404', async () => {
    const result = await agent.get(`/product/${faker.datatype.number({ min: 10000, max: 99999 })}`);
    expect(result.status).toEqual(404);
  });
});

describe('GET /products', () => {
  it('returns 200 without any query', async () => {
    const result = await agent
      .get('/products');
    expect(result.status).toEqual(200);
  });
  it('returns 200 with name query', async () => {
    const result = await agent
      .get('/products')
      .query({
        params: {
          name: 'console',
        },
      });
    expect(result.status).toEqual(200);
  });
  it('returns 200 with ordeyby query', async () => {
    const result = await agent
      .get('/products')
      .query({
        params: {
          ordeyby: 'visits',
        },
      });
    expect(result.status).toEqual(200);
  });
  it('returns 200 with name and orderby query', async () => {
    const result = await agent
      .get('/products')
      .query({
        params: {
          name: 'console',
          orderby: 'visits',
        },
      });
    expect(result.status).toEqual(200);
  });
});
