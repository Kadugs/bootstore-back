/* eslint-disable no-console */
import connection from '../database.js';

async function getPurchaseProducts(req, res) {
  const { authorization } = req.headers;
  const token = authorization?.replace('Bearer ', '');

  if (!token) return res.sendStatus(401);
  try {
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
    return res.send(userProducts.rows);
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
}

async function confirmPurchase(req, res) {
  const { authorization } = req.headers;
  const token = authorization?.replace('Bearer ', '');
  if (!token) return res.sendStatus(401);
  try {
    const userInfos = await connection.query(
      `
        SELECT cart.product_id as "productId", cart.quantity as "quantity", sessions.user_id as "userId"
        FROM sessions
        JOIN cart
        ON sessions.user_id = cart.user_id
        WHERE sessions.token = $1`,
      [token],
    );
    let query = '';
    userInfos.rows.forEach((item) => {
      const time = Math.floor(Date.now() / 1000);
      query += `INSERT INTO sales (user_id, product_id, quantity, time) 
      VALUES (${item.userId}, ${item.productId}, ${item.quantity}, to_timestamp(${time}));
      UPDATE products SET quantity = quantity - ${item.quantity} 
      WHERE products.id = ${item.productId};
      `;
    });
    query += `DELETE FROM cart WHERE user_id = ${userInfos.rows[0].userId};`;
    await connection.query(query);
    return res.sendStatus(201);
  } catch (error) {
    return res.sendStatus(500);
  }
}
export { confirmPurchase, getPurchaseProducts };
