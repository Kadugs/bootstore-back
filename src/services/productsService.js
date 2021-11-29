import * as productsRepository from '../repositories/productsRepository.js';

async function getAllProducts({ searchQuery, orderBy }) {
  let query = 'SELECT code, name, value, image FROM products';
  const parameters = [];
  if (searchQuery) {
    query += ' WHERE LOWER (name) LIKE LOWER ($1)';
    parameters.push(`%${searchQuery}%`);
  }
  const validsOrderBy = ['visits', 'value'];
  if (validsOrderBy.includes(orderBy?.split('-')[0])) {
    query += ` ORDER BY ${orderBy.split('-')[0]}`;
    query += orderBy.split('-')[1] === 'desc' ? ' DESC' : ' ASC';
  }
  const products = await productsRepository.getProductsList({ query, parameters });
  return products;
}

async function getProductInfos(code) {
  const productInfos = await productsRepository.getProductDataByCode(code);
  if (!productInfos) return null;
  return productInfos;
}
async function createQueryAndReturnProductQuantity(codes) {
  let query = 'SELECT quantity FROM products WHERE ';
  codes.forEach((itemCode, index) => {
    if (index === codes.length - 1) {
      query += `code=${itemCode}`;
    } else {
      query += `code=${itemCode} OR `;
    }
  });
  const quantities = await productsRepository.getQuantitiesByCodes(query);
  if (!quantities[0]?.quantity) return null;
  const arrQuantities = quantities.map((quant) => quant.quantity);
  return arrQuantities;
}

export { getAllProducts, getProductInfos, createQueryAndReturnProductQuantity };
