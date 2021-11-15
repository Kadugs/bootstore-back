import express from 'express';
import cors from 'cors';
import {
  getProducts,
  getProductDetails,
  getProductsForVisitorCart,
} from './controllers/products.js';
import { getProductsRatings, getProductRating } from './controllers/ratings.js';
import { getCart, addToCart, deleteFromCart } from './controllers/cart.js';
import { getPurchaseProducts } from './controllers/purchase.js';
import { signUp } from './controllers/users.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/products', getProducts);

app.get('/cart', getCart);

app.get('/ratings', getProductsRatings);

app.get('/ratings/:code', getProductRating);

app.get('/product/:code', getProductDetails);

app.get('/products/cart', getProductsForVisitorCart);

app.post('/cart', addToCart);

app.post('/sign-up', signUp);

app.delete('/cart/:code', deleteFromCart);

app.get('/purchase', getPurchaseProducts);

export default app;
