import connection from '../database.js';

async function selectRatingsOfMainScreenProducts() {
  const result = await connection.query(
    'SELECT sales.rating, products.code FROM sales JOIN products ON sales.product_id = products.id;',
  );
  return result.rows;
}
async function selectProductRatingsByCode(code) {
  const result = await connection.query(
    `SELECT sales.rating as "rating", products.id as "productId", sales.id as "salesId"
        FROM sales JOIN products ON sales.product_id = products.id
        WHERE products.code = $1`,
    [code],
  );
  return result.rows;
}
async function getAnotherRatingsFromUser({ code, token }) {
  const result = await connection.query(
    `
      SELECT sales.rating, sales.id
      FROM sales
      JOIN users ON sales.user_id = users.id
      JOIN products ON sales.product_id = products.id
      JOIN sessions ON sales.user_id = sessions.user_id
      WHERE products.code = $1 AND sessions.token = $2;
    `,
    [code, token],
  );
  return result.rows;
}
async function insertNewRating(query) {
  await connection.query(query);
}
export {
  selectRatingsOfMainScreenProducts,
  selectProductRatingsByCode,
  getAnotherRatingsFromUser,
  insertNewRating,
};
