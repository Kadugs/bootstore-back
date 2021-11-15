import supertest from 'supertest';
import app from '../src/app.js';

beforeAll(() => {});
describe('GET /cart', () => {
  it('should require authorization', async () => {
    const result = await supertest(app).get('/cart');

    expect(result.status).toEqual(401);
  });
  it('send a valid token expects 200', async () => {
    const token = 'Bearer 7a6789bc-22b1-422b-8bbc-71161dafa15a';
    const result = await supertest(app)
      .get('/cart')
      .set('authorization', token);
    expect(result.status).toEqual(200);
  });
});

describe('POST /cart', () => {
  it('should return 400 to invalid body', async () => {
    const token = 'Bearer 7a6789bc-22b1-422b-8bbc-71161dafa15a';
    const result = await supertest(app)
      .post('/cart')
      .set('authorization', token)
      .send({ code: '', quantity: 1 });
    expect(result.status).toEqual(400);
  });

  it('should require authorization', async () => {
    const body = {
      code: '45654654',
      quantity: 1,
    };
    const result = await supertest(app).get('/cart').send(body);
    expect(result.status).toEqual(401);
  });

  it('send a valid token expects 200', async () => {
    const token = 'Bearer 7a6789bc-22b1-422b-8bbc-71161dafa15a';
    const body = {
      code: '45654654',
      quantity: 1,
    };
    const result = await supertest(app)
      .get('/cart')
      .set('authorization', token)
      .send(body);
    expect(result.status).toEqual(200);
  });
});

describe('DELETE /cart/:code', () => {
  it('should return 400 to invalid param', async () => {
    const token = 'Bearer 7a6789bc-22b1-422b-8bbc-71161dafa15a';
    const code = 'invalid-code';
    const result = await supertest(app)
      .delete(`/cart/${code}`)
      .set('authorization', token);
    expect(result.status).toEqual(400);
  });

  it('should require authorization', async () => {
    const code = '45654654';
    const result = await supertest(app).delete(`/cart/${code}`);
    expect(result.status).toEqual(401);
  });

  it('send a valid token expects 200', async () => {
    const token = 'Bearer 7a6789bc-22b1-422b-8bbc-71161dafa15a';
    const code = '45654654';
    const result = await supertest(app)
      .delete(`/cart/${code}`)
      .set('authorization', token);
    console.log(result);
    expect(result.status).toEqual(200);
  });
});
