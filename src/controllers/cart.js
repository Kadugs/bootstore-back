import connection from '../database/database.js';


async function getCart(req, res) {
  const newLocal = 'authorization';
  const token = req.headers[newLocal]?.replace('Bearer ', '');

  if (!token) return res.sendStatus(401);

  try {
    const result = await connection.query(
      `
            SELECT products.code, products.name, products.image, products.value, cart.quantity FROM cart
              JOIN products ON products.id = cart.product_id
              JOIN sessions ON sessions.user_id = cart.user_id WHERE sessions.token = $1;
        `,
      [token]
    );
    const cart = result.rows;

    return res.status(200).send(cart);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return res.sendStatus(500);
  }
}

async function addToCart(req, res) {
  const { code, quantity } = req.body;
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!code || quantity < 1) return res.sendStatus(400);
  if (!token) return res.sendStatus(401);

  try {
    const result = await connection.query(
      'SELECT user_id FROM sessions WHERE token = $1',
      [token]
    );
    const userId = result.rows[0]?.user_id;

    if (!userId) return res.sendStatus(401);

    const result2 = await connection.query(
      'SELECT id FROM products WHERE code = $1;',
      [code]
    );
    const productId = result2.rows[0]?.id;

    if (!productId) return res.sendStatus(404);

    const result3 = await connection.query(
      'SELECT * FROM cart WHERE user_id = $1 AND product_id = $2;',
      [userId, productId]
    );
    const product = result3.rows[0];

    if (product) {
      await connection.query('UPDATE cart SET quantity = $1 WHERE id = $2;', [
        quantity,
        product.id,
      ]);
    } else {
      await connection.query(
        'INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3);',
        [userId, productId, quantity]
      );
    }

    return res.sendStatus(200);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return res.sendStatus(500);
  }
}

async function deleteFromCart(req, res) {
  const { code } = req.params;
  const token = req.headers.authorization?.replace('Bearer ', '');
  try {
    const userData = await connection.query(
      `
      SELECT sessions.user_id as "userId", cart.product_id as "productId", sessions.token as "token", products.code as "code"
      FROM cart
      JOIN sessions ON cart.user_id = sessions.user_id
      JOIN products ON cart.product_id = products.id
      WHERE products.code = $1 AND sessions.token = $2;
      `,
      [code, token]
    );
    if (
      !userData?.rows[0].userId ||
      !userData?.rows[0].productId ||
      !userData?.rows[0].token ||
      !userData?.rows[0].code
    ) {
      return res.sendStatus(404);
    }
    await connection.query(
      'DELETE FROM cart WHERE user_id = $1 AND product_id = $2;',
      [userData?.rows[0].userId, userData?.rows[0].productId]
    );
    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(500);
  }
}

export { getCart, addToCart, deleteFromCart };
