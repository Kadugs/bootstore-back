import connection from '../database/database.js';
import { isSignUpDataValid } from '../validation/signUp.js';

async function signUp(req, res) {
  const { name, cpf, password, email } = req.body;

  if (!isSignUpDataValid(req.body)) return res.sendStatus(400);

  try {
    await connection.query('INSERT INTO users (name, cpf, password, email) VALUES ($1, $2, $3, $4);', [name, cpf, password, email]);

    return res.sendStatus(201);
  } catch (error) {
    console.log(error);
    const { constraint } = error;
    if (constraint === 'users_cpf_key') return res.status(409).send('cpf');
    if (constraint === 'users_email_key') return res.status(409).send('email');

    return res.sendStatus(500);
  }
}

export {
  signUp,
};
