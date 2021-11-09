import express from 'express';
import cors from 'cors';
import { getProducts } from './controllers/products.js';
import { getCartQuantity } from './controllers/cart.js';
import getProductDetails from './controllers/product-details.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/products', getProducts);

app.get('/cart/quantity', getCartQuantity);

app.get('/products/:id', getProductDetails);

export default app;
