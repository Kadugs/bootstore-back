import faker from 'faker';
import connection from '../../src/database/database.js';

faker.locale = 'pt_BR';

export async function createBrand() {
  const brand = {
    name: faker.company.companyName(),
  };

  const testBrand = await connection.query('INSERT INTO brands (name) VALUES ($1) RETURNING *;', [brand.name]);

  brand.id = testBrand.rows[0].id;

  return brand;
}

export async function createCategory() {
  const category = {
    name: faker.commerce.department(),
  };

  const testCategory = await connection.query('INSERT INTO categories (name) VALUES ($1) RETURNING *;', [category.name]);

  category.id = testCategory.rows[0].id;

  return category;
}

export async function createProduct() {
  const brand = await createBrand();
  const category = await createCategory();

  const product = {
    code: faker.datatype.number({ min: 10000, max: 99999 }),
    name: faker.commerce.productName(),
    quantity: faker.datatype.number({ min: 1, max: 1000 }),
    description: faker.commerce.productDescription(),
    value: faker.commerce.price(),
    image: faker.image.imageUrl(),
    brand: brand.id,
    category: category.id,
  };

  const testProduct = await connection.query('INSERT INTO products (code, name, quantity, description, value, image, brand, category) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;', [product.code, product.name, product.quantity, product.description, product.value, product.image, product.brand, product.category]);

  product.id = testProduct.id;

  return product;
}