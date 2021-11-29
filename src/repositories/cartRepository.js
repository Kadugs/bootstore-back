import connection from '../database.js';

async function getCartItemsByToken(token) {
  const result = await connection.query(
    `
            SELECT products.code, products.name, products.image, products.value, cart.quantity FROM cart
              JOIN products ON products.id = cart.product_id
              JOIN sessions ON sessions.user_id = cart.user_id WHERE sessions.token = $1;
        `,
    [token],
  );
  return result.rows;
}

async function getItemFromCart({ userId, productId }) {
  const result = await connection.query(
    'SELECT * FROM cart WHERE user_id = $1 AND product_id = $2;',
    [userId, productId],
  );
  return result.rows[0];
}

async function updateUserCart({ quantity, productId }) {
  const result = await connection.query(
    `
        UPDATE cart
        SET quantity = $1
        WHERE id = $2;
        RETURNING *`,
    [quantity, productId],
  );
  return result.rows[0];
}

async function insertItemToCart({ userId, productId, quantity }) {
  await connection.query(
    'INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3);',
    [userId, productId, quantity],
  );
}
async function getProductFromUserCartByToken({ code, token }) {
  const result = await connection.query(
    `
      SELECT sessions.user_id as "userId", cart.product_id as "productId"
      FROM cart
      JOIN sessions ON cart.user_id = sessions.user_id
      JOIN products ON cart.product_id = products.id
      WHERE products.code = $1 AND sessions.token = $2;
      `,
    [code, token],
  );
  return result.rows[0];
}
async function deleteItemFromCart({ userId, productId }) {
  const result = await connection.query(
    `DELETE FROM cart 
    WHERE user_id = $1 AND product_id = $2;
    RETURNING *
    `,
    [userId, productId],
  );
  return result.rows[0];
}

export {
  getCartItemsByToken,
  getItemFromCart,
  updateUserCart,
  insertItemToCart,
  getProductFromUserCartByToken,
  deleteItemFromCart,
};
