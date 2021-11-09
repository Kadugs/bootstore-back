import express from 'express';
import cors from 'cors';
import { getCartQuantity } from './controllers/cart.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/cart/quantity', getCartQuantity);

export default app;