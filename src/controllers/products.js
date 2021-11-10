import connection from '../database/database.js';

async function getProducts(req, res) {
  const searchQuery = req.query.name;
  const orderBy = req.query.orderby;

  try {
    let query = 'SELECT id, name, value, image FROM products';
    const parametres = [];

    if (searchQuery) {
      query += ' WHERE LOWER (name) LIKE LOWER ($1)';
      parametres.push(`%${searchQuery}%`);
    }

    const validsOrderBy = ['visits', 'value'];
    if (validsOrderBy.includes(orderBy?.split('-')[0])) {
      query += ` ORDER BY ${orderBy.split('-')[0]}`;
      query += orderBy.split('-')[1] === 'desc' ? ' DESC' : ' ASC';
    }

    const result = await connection.query(`${query};`, parametres);

    const productsList = result.rows;
    res.status(200).send(productsList);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}
async function getProductDetails(req, res) {
  const productId = req.params.id;
  try {
    const product = await connection.query(
      `SELECT products.name, description, code, quantity, value, image,
       brands.name as brand, categories.name as category 
       FROM products
       JOIN brands ON products.brand = brands.id
       JOIN categories ON products.category = categories.id
       WHERE products.code = $1;`,
      // eslint-disable-next-line comma-dangle
      [productId]
    );
    if (product.rowCount === 0 || product.rows === null) {
      return res.sendStatus(404);
    }
    return res.send(product.rows[0]).status(200);
  } catch (error) {
    return res.sendStatus(500);
  }
}

export { getProducts, getProductDetails };
