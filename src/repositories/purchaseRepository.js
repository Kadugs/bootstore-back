import connection from '../database.js';

async function getPurchaseProductsByToken(token) {
  const userProducts = await connection.query(
    `
        SELECT sales.quantity, products.code, sessions.user_id, sales.rating, products.name, products.image
        FROM sales
        JOIN products ON sales.product_id = products.id
        JOIN sessions ON sessions.user_id = sales.user_id
        WHERE sessions.token = $1;
        `,
    [token],
  );
  return userProducts.rows;
}
async function insertNewPurchase({ query, id }) {
  await connection.query(query);
  await connection.query(`DELETE FROM cart WHERE user_id = ${id};`);
}
export { getPurchaseProductsByToken, insertNewPurchase };
