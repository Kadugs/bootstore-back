import express from 'express';
import cors from 'cors';
import { getProducts } from './controllers/products.js';
import { getCartQuantity } from './controllers/cart.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/products', getProducts);

app.get('/cart/quantity', getCartQuantity);

export default app;