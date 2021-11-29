import * as productsService from '../services/productsService.js';

async function getProducts(req, res) {
  const searchQuery = req.query.name;
  const orderBy = req.query.orderby;

  const productsList = await productsService.getAllProducts({ searchQuery, orderBy });

  res.status(200).send(productsList);
}
async function getProductDetails(req, res) {
  const { code } = req.params;
  const product = await productsService.getProductInfos(code);
  if (product === null) return res.sendStatus(404);
  return res.status(200).send(product);
}

async function getProductQuantity(req, res) {
  const { codes } = req.query;
  if (!codes) return res.sendStatus(404);
  let arrCodes;
  if (typeof codes === 'string') {
    arrCodes = [codes];
  } else {
    arrCodes = codes;
  }
  const quantity = await productsService.createQueryAndReturnProductQuantity(arrCodes);
  if (quantity === null) return res.sendStatus(400);

  return res.send(quantity).status(200);
}
export { getProducts, getProductDetails, getProductQuantity };
