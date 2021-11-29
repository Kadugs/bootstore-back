import connection from '../database.js';

async function getUserIdByToken(token) {
  const result = await connection.query('SELECT user_id FROM sessions WHERE token = $1', [
    token,
  ]);
  return result.rows[0]?.user_id;
}

async function getUserSession(userId) {
  const result = await connection.query('SELECT * FROM sessions WHERE user_id = $1;', [
    userId,
  ]);
  return result.rows[0];
}

async function updateSession({ newToken, userId }) {
  const result = await connection.query(
    `UPDATE sessions 
    SET token = $1
    WHERE user_id = $2
    RETURNING *;`,
    [newToken, userId],
  );
  return result.rows[0];
}
async function createSession({ newToken, userId }) {
  const result = await connection.query(
    `INSERT INTO sessions 
    (user_id, token)
    VALUES ($1, $2)
    RETURNING *;`,
    [userId, newToken],
  );
  return result.rows[0];
}

export { getUserIdByToken, getUserSession, updateSession, createSession };
