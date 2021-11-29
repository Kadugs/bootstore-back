import * as ratingRepository from '../repositories/ratingRepository.js';

async function getRatings() {
  const ratings = [];
  let databaseRatings = await ratingRepository.selectRatingsOfMainScreenProducts();
  while (databaseRatings.length > 0) {
    const productCode = databaseRatings[0].code;
    const productRatings = databaseRatings.filter(
      (rating) => rating.code === productCode,
    );
    const averageRating =
      productRatings.map((item) => item.rating).reduce((a, b) => a + b, 0) /
      productRatings.length;

    ratings.push({
      productCode,
      average: averageRating,
      quantity: productRatings.length,
    });
    databaseRatings = databaseRatings.filter((rating) => rating.code !== productCode);
  }

  if (ratings.length === 0) {
    return false;
  }
  return ratings;
}
async function getRatingsFromAProduct(code) {
  const ratings = await ratingRepository.selectProductRatingsByCode(code);
  let averageRating = 0;
  if (!ratings) return null;

  if (ratings.length === 0) {
    const rating = {
      average: 0,
      quantity: 0,
    };
    return rating;
  }
  ratings.forEach((item) => {
    averageRating += item.rating;
  });
  averageRating /= ratings.length;
  const rating = {
    average: averageRating,
    quantity: ratings.length,
  };
  return rating;
}
async function postNewRating({ code, token, value }) {
  const anotherRatings = await ratingRepository.getAnotherRatingsFromUser({
    code,
    token,
  });
  let query = '';
  anotherRatings.forEach((item) => {
    query += `UPDATE sales SET rating = ${value} WHERE id=${item.id};`;
  });
  try {
    await ratingRepository.insertNewRating(query);
    return true;
  } catch {
    return false;
  }
}

export { getRatings, getRatingsFromAProduct, postNewRating };
