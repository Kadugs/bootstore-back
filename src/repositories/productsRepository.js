import connection from '../database.js';

async function getProductIdByCode(code) {
  const result = await connection.query('SELECT id FROM products WHERE code = $1;', [
    code,
  ]);
  return result.rows[0]?.id;
}
async function getProductsList({ query, parameters }) {
  const result = await connection.query(`${query};`, parameters);
  return result.rows;
}
async function getProductDataByCode(code) {
  const result = await connection.query(
    `SELECT products.name, description, code, quantity, value, image,
       brands.name as brand, categories.name as category 
       FROM products
       JOIN brands ON products.brand_id = brands.id
       JOIN categories ON products.category_id = categories.id
       WHERE products.code = $1;`,
    [code],
  );
  return result.rows[0];
}

async function getQuantitiesByCodes(query) {
  const result = await connection.query(query);
  return result.rows;
}

export {
  getProductIdByCode,
  getProductsList,
  getProductDataByCode,
  getQuantitiesByCodes,
};
