import connection from '../database/database.js';

async function getCartQuantity(req, res) {
  // eslint-disable-next-line dot-notation
  const token = req.headers['authorization']?.replace('Bearer ', '');

  if (!token) return res.sendStatus(401);

  try {
    const result = await connection.query(
      `
            SELECT * FROM cart JOIN sessions ON sessions.user_id = cart.user_id WHERE sessions.token = $1;    
        `,
      [token],
    );

    const quantity = result.rowCount;

    return res.status(200).send(`${quantity}`);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
}

// eslint-disable-next-line import/prefer-default-export
export { getCartQuantity };
