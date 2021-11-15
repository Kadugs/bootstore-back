import connection from '../database/database.js';

async function getProductsRatings(req, res) {
  try {
    const result = await connection.query(
      'SELECT ratings.rating, products.code FROM ratings JOIN sales ON ratings.sale_id = sales.id JOIN products ON sales.product_id = products.id;'
    );

    const ratings = [];

    let separatedRatings = result.rows;
    while (separatedRatings.length > 0) {
      const productCode = separatedRatings[0].code;
      const productRatings = separatedRatings.filter(
        (rating) => rating.code === productCode
      );
      const averageRating =
        productRatings.map((item) => item.rating).reduce((a, b) => a + b, 0) /
        productRatings.length;

      ratings.push({
        productCode,
        average: averageRating,
        quantity: productRatings.length,
      });
      separatedRatings = separatedRatings.filter(
        (rating) => rating.code !== productCode
      );
    }

    res.status(200).send(ratings);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

async function getProductRating(req, res) {
  const { code } = req.params;
  try {
    const result = await connection.query(
      `SELECT ratings.rating as "rating", products.id as "productId", sales.id as "salesId"
        FROM ratings
        JOIN sales ON ratings.sale_id = sales.id
        JOIN products ON sales.product_id = products.id WHERE products.code = $1`,
      [code]
    );
    let averageRating = 0;
    if (result.rowCount === 0) {
      const rating = {
        average: 0,
        quantity: 0,
      };
      return res.send(rating);
    }
    result.rows.forEach((item) => {
      averageRating += item.rating;
    });
    averageRating /= result.rowCount;
    const rating = {
      average: averageRating,
      quantity: result.rowCount,
    };
    return res.send(rating);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
}

async function postProductsRating(req, res) {
  const newLocal = 'authorization';
  const token = req.headers[newLocal]?.replace('Bearer ', '');
  if (!token) return res.sendStatus(401);
  const { code, value } = req.body;
  try {
    const anotherRatings = await connection.query(
      `
      SELECT ratings.rating, sales.id
      FROM sales
      LEFT JOIN ratings ON sales.id = ratings.sale_id
      JOIN users ON sales.user_id = users.id
      JOIN products ON sales.product_id = products.id
      JOIN sessions ON sales.user_id = sessions.id
      WHERE products.code = $1 AND sessions.token = $2;
    `,
      [code, token]
    );
    let query = '';
    anotherRatings.rows.forEach((item) => {
      if (!item?.rating) {
        query += `INSERT INTO ratings (sale_id, rating) VALUES (${item.id}, ${value});`;
      } else {
        query += `UPDATE ratings SET rating = ${value} WHERE sale_id=${item.id};`;
      }
    });
    await connection.query(query);
    return res.sendStatus(201);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
}

export { getProductsRatings, getProductRating, postProductsRating };
