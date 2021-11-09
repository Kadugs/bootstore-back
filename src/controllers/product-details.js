import connection from '../database/database.js';

async function getProductDetails(req, res) {
  const productId = req.params.id;

  try {
    const product = await connection.query(
      `SELECT * FROM "public.products" 
         JOIN "public.categories".name
         ON "public.categories".name = "public.product".category
         WHERE "public.product".code = $1`,
      // eslint-disable-next-line comma-dangle
      [productId]
    );
    if (product.rowCount === 0) {
      return res.sendStatus(404);
    }
    return res.send(product);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
}

export default getProductDetails;
