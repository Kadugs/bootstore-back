/* eslint-disable no-undef */
import supertest from 'supertest';
import app from '../src/app.js';

describe('GET /products/:code', () => {
  it('send a valid code expects 200', async () => {
    const result = await supertest(app).get('/product/45654654');
    expect(result.status).toEqual(200);
  });
  it('send a invalid code expects 404', async () => {
    const result = await supertest(app).get('/product/4565413');
    expect(result.status).toEqual(404);
  });
});
