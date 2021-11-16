import connection from '../database/database.js';

async function getProductsRatings(req, res) {
  try {
    const result = await connection.query(
      'SELECT sales.rating, products.code FROM sales JOIN products ON sales.product_id = products.id;'
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

// eslint-disable-next-line import/prefer-default-export
export { getProductsRatings };
