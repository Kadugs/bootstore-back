/* eslint-disable no-console */
import * as cartSevice from '../services/cartSevice.js';

async function getCart(req, res) {
  const { authorization } = req.headers;
  const token = authorization?.replace('Bearer ', '');

  const cart = await cartSevice.getCartItems(token);

  return res.status(200).send(cart);
}

async function addToCart(req, res) {
  const { code, quantity } = req.body;
  const token = req.headers.authorization?.replace('Bearer ', '');
  const result = await cartSevice.addItemToCart({ code, quantity, token });

  if (result === null) return res.sendStatus(400);
  if (result === undefined) return res.sendStatus(404);
  if (result.quantity === quantity) return res.sendStatus(200);

  return res.sendStatus(400);
}

async function deleteFromCart(req, res) {
  const { code } = req.params;
  const { authorization } = req.headers;
  const token = authorization?.replace('Bearer ', '');

  const deletedItem = cartSevice.deleteItemFromCart({ code, token });
  if (deletedItem === undefined) return res.sendStatus(404);
  if (deletedItem === null) return res.sendStatus(400);
  return res.sendStatus(200);
}

export { getCart, addToCart, deleteFromCart };
