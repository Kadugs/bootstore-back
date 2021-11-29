import express from 'express';
import cors from 'cors';

import * as userController from './controllers/userController.js';
import * as cartController from './controllers/cartController.js';
import * as productsController from './controllers/productsController.js';
import * as purchaseController from './controllers/purchaseController.js';
import * as ratingController from './controllers/ratingController.js';
import { verifyToken } from './middlewares.js';

const app = express();

app.use(cors());
app.use(express.json());

app.post('/sign-up', userController.signUp);
app.post('/sign-in', userController.signIn);

app.get('/cart', verifyToken, cartController.getCart);
app.post('/cart', verifyToken, cartController.addToCart);
app.delete('/cart/:code', verifyToken, cartController.deleteFromCart);

app.get('/products', productsController.getProducts);
app.get('/product/:code', productsController.getProductDetails);
app.get('/products/quantity/:codes', productsController.getProductQuantity);

app.get('/purchase', verifyToken, purchaseController.getPurchaseProducts);
app.post('/purchase', verifyToken, purchaseController.confirmPurchase);

app.get('/ratings', ratingController.getProductsRatings);
app.post('/ratings', verifyToken, ratingController.postProductsRating);
app.get('/ratings/:code', ratingController.getProductRating);

export default app;
