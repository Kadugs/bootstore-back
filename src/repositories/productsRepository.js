import connection from '../database.js';

async function getProductIdByCode(code) {
  const result = await connection.query('SELECT id FROM products WHERE code = $1;', [
    code,
  ]);
  return result.rows[0]?.id;
}

export { getProductIdByCode };
