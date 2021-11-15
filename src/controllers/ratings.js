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
    console.log(error);
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

// async function postProductRating(req, res) {}

// eslint-disable-next-line import/prefer-default-export
export { getProductsRatings, getProductRating };
