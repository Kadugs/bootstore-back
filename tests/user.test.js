/* eslint-disable no-undef */
import '../setup';
import supertest from 'supertest';
import faker from 'faker';
import app from '../src/app.js';
import connection from '../src/database.js';
import { createUser } from './factories/userFactory';

const agent = supertest(app);

beforeAll(async () => {
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
afterEach(async () => {
  await connection.query(`
    DELETE FROM sessions;
    DELETE FROM users;
    `);
});
describe('POST /sign-in', () => {
  beforeEach(async () => {
    await connection.query(`
    DELETE FROM sessions;
    DELETE FROM users;
    `);
  });
  it('returns 400 for invalid data', async () => {
    const user = await createUser();

    const body = {
      email: user.email,
    };

    const result = await agent.post('/sign-in').send(body);
    expect(result.status).toEqual(400);
  });

  it('returns 404 for not registered email', async () => {
    const user = await createUser();

    const body = {
      email: faker.internet.email(),
      password: user.password,
    };

    const result = await agent.post('/sign-in').send(body);
    expect(result.status).toEqual(404);
  });

  it('returns 401 for wrong password', async () => {
    const user = await createUser();

    const body = {
      email: user.email,
      password: faker.internet.password(16, false, /^[a-zA-Z0-9]*$/),
    };

    const result = await agent.post('/sign-in').send(body);
    expect(result.status).toEqual(401);
  });

  it('returns 200 for valid email and password', async () => {
    const user = await createUser();

    const body = {
      email: user.email,
      password: user.password,
    };
    const result = await agent.post('/sign-in').send(body);
    expect(result.status).toEqual(200);
  });
});

describe('/POST sign-up', () => {
  beforeEach(async () => {
    await connection.query(`
    DELETE FROM sessions;
    DELETE FROM users;
    `);
  });
  it('returns 400 for invalid data', async () => {
    const body = {
      name: faker.name.findName(),
      cpf: '75934215896',
      password: faker.internet.password(3),
      email: faker.internet.email(),
    };

    body.repeatPassword = body.password;
    body.repeatEmail = body.email;

    const result = await agent.post('/sign-up').send(body);
    expect(result.status).toEqual(400);
  });

  it('returns 409 for cpf conflict', async () => {
    const user = await createUser();

    const body = {
      name: faker.name.findName(),
      cpf: user.cpf,
      password: faker.internet.password(16, false, /^[a-zA-Z0-9]*$/),
      email: faker.internet.email(),
    };
    body.repeatPassword = body.password;
    body.repeatEmail = body.email;

    const result = await agent.post('/sign-up').send(body);
    expect(result.status).toEqual(409);
  });
  it('returns 201 for valid data', async () => {
    const body = {
      name: faker.name.findName(),
      cpf: faker.datatype.number({ min: 10000000000, max: 99999999999 }).toString(),
      password: faker.internet.password(16, false, /^[a-zA-Z0-9]*$/),
      email: faker.internet.email(),
    };

    body.repeatPassword = body.password;
    body.repeatEmail = body.email;

    const result = await agent.post('/sign-up').send(body);
    expect(result.status).toEqual(201);
  });
});
afterAll(() => {
  connection.end();
});
