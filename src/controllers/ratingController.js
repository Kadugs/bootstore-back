import * as ratingService from '../services/ratingService.js';

async function getProductsRatings(req, res) {
  try {
    const ratings = await ratingService.getRatings();
    if (!ratings) return res.sendStatus(400);
    return res.status(200).send(ratings);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
}

async function getProductRating(req, res) {
  const { code } = req.params;
  try {
    const rating = await ratingService.getRatingsFromAProduct(code);
    if (rating === null) return res.sendStatus(400);
    return res.send(rating).status(200);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
}

async function postProductsRating(req, res) {
  const { authorization } = req.headers;
  const { code, value } = req.body;
  const token = authorization?.replace('Bearer ', '');

  try {
    const posted = await ratingService.postNewRating({ code, value, token });
    if (posted) {
      return res.sendStatus(201);
    }
    return res.sendStatus(400);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
}

export { getProductsRatings, getProductRating, postProductsRating };
