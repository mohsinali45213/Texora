import { faker } from '@faker-js/faker';
import { Cart } from '../../../models/Cart';

export class CartSeeder {
  async seed(buyers: any[], products: any[]) {
    console.log('Seeding Carts...');
    const docs = [];

    for (const buyer of buyers) {
      const cartProducts = faker.helpers.arrayElements(products, 2);
      const cart = await Cart.create({
        buyer: buyer._id,
        items: cartProducts.map(p => ({
          product: p._id,
          quantity: p.moq || 100,
        }))
      });
      docs.push(cart);
    }
    return docs;
  }
}
