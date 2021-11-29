import * as purchaseRepository from '../repositories/purchaseRepository.js';
import * as cartRepository from '../repositories/cartRepository.js';

async function getPurchaseProductsList(token) {
  const purchaseProducts = await purchaseRepository.getPurchaseProductsByToken(token);
  return purchaseProducts;
}

async function sendPurchaseRequest(token) {
  const cartItems = await cartRepository.getCartProductsByToken(token);
  let query = '';
  cartItems.forEach((item) => {
    const time = Math.floor(Date.now() / 1000);
    query += `
    INSERT INTO sales (user_id, product_id, quantity, time) VALUES (${item.userId}, ${item.productId}, ${item.quantity}, to_timestamp(${time})); 
    UPDATE products SET quantity = quantity - ${item.quantity} WHERE products.id = ${item.productId};`;
  });
  try {
    await purchaseRepository.insertNewPurchase({
      query,
      id: cartItems[0].userId,
    });
    return true;
  } catch {
    return false;
  }
}
export { getPurchaseProductsList, sendPurchaseRequest };
