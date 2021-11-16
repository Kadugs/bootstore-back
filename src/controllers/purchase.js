import connection from '../database/database.js';

async function getPurchaseProducts(req, res) {
  const newLocal = 'authorization';
  const token = req.headers[newLocal]?.replace('Bearer ', '');

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
      [token]
    );
    return res.send(userProducts.rows);
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
}

// eslint-disable-next-line import/prefer-default-export
export { getPurchaseProducts };
