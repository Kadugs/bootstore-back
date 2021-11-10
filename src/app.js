import express from 'express';
import cors from 'cors';
import { getProducts, getProductDetails } from './controllers/products.js';
import { getCartQuantity } from './controllers/cart.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/products', getProducts);

app.get('/cart/quantity', getCartQuantity);

app.get('/product/:id', getProductDetails);

export default app;
