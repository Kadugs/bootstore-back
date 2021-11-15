import connection from '../database/database.js';

async function getProducts(req, res) {
  const searchQuery = req.query.name;
  const orderBy = req.query.orderby;

  try {
    let query = 'SELECT code, name, value, image FROM products';
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
    res.sendStatus(500);
  }
}
async function getProductDetails(req, res) {
  const productId = req.params.code;
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
    return res.status(200).send(product.rows[0]);
  } catch (error) {
    return res.sendStatus(500);
  }
}

async function getProductsForVisitorCart(req, res) {
  const { productCodes } = req.query;
  if (!productCodes) return res.sendStatus(404);
  try {
    let query = 'SELECT name, image, value FROM products WHERE ';
    productCodes?.forEach((code, index) => {
      if (index === productCodes.length - 1) {
        query += `code = ${code}`;
      } else {
        query += `code = ${code} OR`;
      }
    });
    const productsData = await connection.query(query);
    return res.status(200).send(productsData.rows);
  } catch (error) {
    return res.sendStatus(500);
  }
}

async function getProductQuantity(req, res) {
  const { codes } = req.query;
  console.log(codes);
  if (!codes) return res.sendStatus(404);
  const arrCodes = [...codes];
  let query = 'SELECT quantity FROM products WHERE ';
  arrCodes.forEach((itemCode, index) => {
    if (index === arrCodes.length - 1) {
      query += `code=${itemCode}`;
    } else {
      query += `code=${itemCode} OR `;
    }
  });
  try {
    const quantities = await connection.query(query);
    const arrQuantities = quantities.rows.map((quant) => quant.quantity);
    return res.send(arrQuantities).status(200);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
}
export {
  getProducts,
  getProductDetails,
  getProductsForVisitorCart,
  getProductQuantity,
};
