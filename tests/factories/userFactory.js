import faker from 'faker';
import bcrypt from 'bcrypt';
import connection from '../../src/database/database.js';

faker.locale = 'pt_BR';

export async function createUser() {
  const user = {
    name: faker.name.findName(),
    cpf: faker.datatype.number({ min: 10000000000, max: 99999999999 }).toString(),
    password: faker.internet.password(16, false, /^[a-zA-Z0-9]*$/),
    email: faker.internet.email(),
  };

  const passwordHash = bcrypt.hashSync(user.password, 10);

  const result = await connection.query('INSERT INTO users (name, cpf, email, password) VALUES ($1, $2, $3, $4) RETURNING *;', [user.name, user.cpf, user.email, passwordHash]);
  const testUser = result.rows[0];

  user.id = testUser.id;

  return user;
}

export async function createSession() {
  const user = await createUser();

  const result = await connection.query('INSERT INTO sessions (user_id, token) VALUES ($1, $2) RETURNING *;', [user.id, faker.datatype.uuid()]);
  const session = result.rows[0];

  return session;
}
