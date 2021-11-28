import express from 'express';
import cors from 'cors';
import {
  getProductsRatings,
  getProductRating,
  postProductsRating,
} from './controllers/ratings.js';
import { getCart, addToCart, deleteFromCart } from './controllers/cart.js';
import { getPurchaseProducts, confirmPurchase } from './controllers/purchase.js';
import { signUp, signIn } from './controllers/users.js';

import {
  getProducts,
  getProductDetails,
  getProductQuantity,
} from './controllers/products.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/products', getProducts);

app.get('/product/:code', getProductDetails);

app.get('/cart', getCart);

app.post('/cart', addToCart);

app.delete('/cart/:code', deleteFromCart);

app.get('/ratings', getProductsRatings);

app.post('/ratings', postProductsRating);

app.get('/ratings/:code', getProductRating);

app.post('/sign-up', signUp);

app.get('/purchase', getPurchaseProducts);

app.post('/sign-in', signIn);

app.get('/products/quantity/:codes', getProductQuantity);

app.post('/purchase', confirmPurchase);

export default app;
