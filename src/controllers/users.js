import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import connection from '../database/database.js';
import { isSignUpDataValid } from '../validation/signUp.js';

async function signIn(req, res) {
  const { email, password } = req.body;

  if (!email || !password) return res.sendStatus(400);

  try {
    const result = await connection.query(
      'SELECT id, name, password FROM users WHERE email = $1;',
      [email]
    );
    const user = result.rows[0];

    if (!user) return res.sendStatus(404);
    if (!bcrypt.compareSync(password, user.password))
      return res.sendStatus(401);

    const result2 = await connection.query(
      'SELECT * FROM sessions WHERE user_id = $1;',
      [user.id]
    );
    const previousSession = result2.rows[0];

    const newToken = uuid();
    if (previousSession) {
      await connection.query(
        'UPDATE sessions SET token = $1 WHERE user_id = $2;',
        [newToken, user.id]
      );
    } else {
      await connection.query(
        'INSERT INTO sessions (user_id, token) VALUES ($1, $2);',
        [user.id, newToken]
      );
    }

    return res.status(200).send({
      name: user.name,
      token: newToken,
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

async function signUp(req, res) {
  const { name, cpf, password, email } = req.body;

  if (!isSignUpDataValid(req.body)) return res.sendStatus(400);

  const passwordHash = bcrypt.hashSync(password, 10);

  try {
    await connection.query(
      'INSERT INTO users (name, cpf, password, email) VALUES ($1, $2, $3, $4);',
      [name, cpf, passwordHash, email]
    );

    return res.sendStatus(201);
  } catch (error) {
    console.log(error);
    const { constraint } = error;
    if (constraint === 'users_cpf_key') return res.status(409).send('cpf');
    if (constraint === 'users_email_key') return res.status(409).send('email');

    return res.sendStatus(500);
  }
}

export { signIn, signUp };
