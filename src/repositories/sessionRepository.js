import connection from '../database.js';

async function getUserIdByToken(token) {
  const result = await connection.query('SELECT user_id FROM sessions WHERE token = $1', [
    token,
  ]);
  return result.rows[0]?.user_id;
}
export { getUserIdByToken };
