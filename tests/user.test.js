import supertest from 'supertest';
import faker from 'faker';
import app from '../src/app.js';
import connection from '../src/database/database.js';
import { createUser } from './factories/userFactory';

faker.locale = 'pt_BR';
const agent = supertest(app);

describe('/POST sign-up', () => {
  let user = {};

  beforeAll(async () => {
    user = await createUser();
  });

  afterAll(async () => {
    await connection.query('DELETE FROM users;');
  });

  it('returns 400 for invalid data', async () => {
    const body = {
      name: faker.name.findName(),
      cpf: faker.datatype.number({ min: 10000000000, max: 99999999999 }).toString(),
      password: faker.internet.password(3),
      email: faker.internet.email(),
    };

    body.repeatPassword = body.password;
    body.repeatEmail = body.email;

    const result = await agent.post('/sign-up').send(body);
    expect(result.status).toEqual(400);
  });

  it('returns 409 for cpf conflict', async () => {
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

  it('returns 409 for email conflict', async () => {
    const body = {
      name: faker.name.findName(),
      cpf: faker.datatype.number({ min: 10000000000, max: 99999999999 }).toString(),
      password: faker.internet.password(16, false, /^[a-zA-Z0-9]*$/),
      email: user.email,
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
