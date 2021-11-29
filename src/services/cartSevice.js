import * as cartRepository from '../repositories/cartRepository.js';
import * as sessionRepository from '../repositories/sessionRepository.js';
import * as productsRepository from '../repositories/productsRepository.js';

async function getCartItems(token) {
  const cartItems = await cartRepository.getCartItemsByToken(token);
  return cartItems;
}

async function addItemToCart({ code, quantity, token }) {
  if (!code || quantity < 1) return null;
  const userId = await sessionRepository.getUserIdByToken(token);
  const productId = await productsRepository.getProductIdByCode(code);
  if (!userId || !productId) return undefined;

  const productOnCart = await cartRepository.getItemFromCart(userId, productId);
  if (productOnCart) {
    const editedCartValue = await cartRepository.updateUserCart({
      quantity,
      productId: productOnCart.id,
    });
    return editedCartValue;
  }
  const addedOnCart = await cartRepository.insertItemToCart({
    userId,
    productId,
    quantity,
  });
  return addedOnCart;
}

async function deleteItemFromCart({ code, token }) {
  const itemToDelete = await cartRepository.getProductFromUserCartByToken({
    code,
    token,
  });
  const { userId, productId } = itemToDelete;
  if (!userId || !productId) {
    return undefined;
  }
  const deletedItem = await cartRepository.deleteItemFromCart({ userId, productId });
  if (deletedItem.user_id === userId) return deletedItem;
  return null;
}

export { getCartItems, addItemToCart, deleteItemFromCart };
