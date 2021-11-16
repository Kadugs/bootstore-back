import express from 'express';
import cors from 'cors';
import {
  getProducts,
  getProductDetails,
  getProductsForVisitorCart,
  getProductQuantity,
} from './controllers/products.js';
import { getProductsRatings } from './controllers/ratings.js';
import { getCart, addToCart, deleteFromCart } from './controllers/cart.js';
import { signUp, signIn } from './controllers/users.js';
import confirmPurchase from './controllers/purchase.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/products', getProducts);

app.get('/cart', getCart);

app.get('/ratings', getProductsRatings);

app.get('/product/:code', getProductDetails);

app.get('/products/cart', getProductsForVisitorCart);

app.post('/cart', addToCart);

app.post('/sign-up', signUp);

app.delete('/cart/:code', deleteFromCart);

app.post('/sign-in', signIn);

app.get('/products/quantity/:codes', getProductQuantity);

app.post('/purchase', confirmPurchase);

export default app;
