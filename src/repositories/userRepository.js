import connection from '../database.js';

async function getUserInfosByEmail(email) {
  const result = await connection.query(
    'SELECT id, name, password FROM users WHERE email = $1;',
    [email],
  );
  return result.rows[0];
}
async function getUsersByCpfOrEmail({ cpf, email }) {
  const result = await connection.query(
    `
      SELECT id
      FROM users WHERE cpf=$1 OR email=$2`,
    [cpf, email],
  );
  return result.rows;
}
async function createNewAccount({ name, cpf, password, email }) {
  console.log(name);
  const result = await connection.query(
    `INSERT INTO users 
    (name, cpf, password, email)
    VALUES ($1, $2, $3, $4)
    RETURNING *;`,
    [name, cpf, password, email],
  );
  return result.rows[0];
}
export { getUserInfosByEmail, getUsersByCpfOrEmail, createNewAccount };
