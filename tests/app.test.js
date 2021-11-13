import supertest from 'supertest';
import app from '../src/app.js';

describe('product-details', () => {
  it('send a valid code expects 200', async () => {
    const result = await supertest(app).get('/product/45654654');
    expect(result.status).toEqual(200);
  });
  it('send a valid code expects 404', async () => {
    const result = await supertest(app).get('/product/4565413');
    expect(result.status).toEqual(404);
  });
});
describe('visitor-cart', () => {
  it('expect 200 for valid params', async () => {
    const result = await supertest(app)
      .get('/products/cart')
      .query({
        params: {
          productCodes: [45654654],
        },
      });
    console.log(result);
    expect(result.status).toEqual(200);
  });
});
