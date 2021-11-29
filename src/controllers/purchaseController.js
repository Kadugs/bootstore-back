import * as purchaseService from '../services/purchaseService.js';

async function getPurchaseProducts(req, res) {
  const { authorization } = req.headers;
  const token = authorization?.replace('Bearer ', '');

  const userProducts = await purchaseService.getPurchaseProductsList(token);
  return res.send(userProducts);
}

async function confirmPurchase(req, res) {
  const { authorization } = req.headers;
  const token = authorization?.replace('Bearer ', '');

  const confirm = await purchaseService.sendPurchaseRequest(token);
  if (!confirm) return res.sendStatus(400);
  return res.sendStatus(201);
}
export { confirmPurchase, getPurchaseProducts };
