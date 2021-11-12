import express from 'express';
import cors from 'cors';
import { getProducts, getProductDetails } from './controllers/products.js';
import { getProductsRatings } from './controllers/ratings.js';
import { getCart, addToCart } from './controllers/cart.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/products', getProducts);

app.get('/cart', getCart);

app.get('/ratings', getProductsRatings);

app.get('/product/:code', getProductDetails);

app.post('/cart', addToCart);

export default app;
