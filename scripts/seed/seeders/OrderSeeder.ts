import { faker } from '@faker-js/faker';
import { Order } from '../../../models/Order';

export class OrderSeeder {
  async seed(buyers: any[], products: any[]) {
    console.log('Seeding Orders (300+)...');
    const statuses = ['pending', 'accepted', 'manufacturing', 'shipped', 'delivered'];
    const docs = [];

    // Group products by supplier so we can create single-supplier orders
    const productsBySupplier: Record<string, any[]> = {};
    for (const p of products) {
      const suppId = p.supplier.toString();
      if (!productsBySupplier[suppId]) productsBySupplier[suppId] = [];
      productsBySupplier[suppId].push(p);
    }
    const supplierIds = Object.keys(productsBySupplier);

    // Generate 350 orders
    for (let i = 0; i < 350; i++) {
      const buyer = faker.helpers.arrayElement(buyers);
      const supplierId = faker.helpers.arrayElement(supplierIds);
      const supplierProducts = productsBySupplier[supplierId];
      
      // An order can have 1 to 4 products from the same supplier
      const orderProducts = faker.helpers.arrayElements(supplierProducts, faker.number.int({ min: 1, max: Math.min(4, supplierProducts.length) }));
      
      const formattedProducts = orderProducts.map(p => ({
        product: p._id,
        quantity: faker.number.int({ min: p.moq || 100, max: 2000 }), // Bulk orders
        priceAtTime: p.price,
      }));

      const totalAmount = formattedProducts.reduce((sum, item) => sum + (item.priceAtTime * item.quantity), 0);
      
      // Generate realistic past dates for completed orders
      const status = faker.helpers.arrayElement(statuses);
      const isCompleted = status === 'delivered';
      const createdAt = faker.date.past({ years: 1 });
      const updatedAt = isCompleted ? faker.date.between({ from: createdAt, to: new Date() }) : new Date();

      const order = await Order.create({
        buyer: buyer._id,
        supplier: supplierId,
        products: formattedProducts,
        shippingAddress: {
          name: buyer.name,
          phone: '+91' + faker.string.numeric(10),
          addressLine1: faker.location.streetAddress(),
          city: faker.location.city(),
          state: faker.location.state(),
          postalCode: faker.location.zipCode('######'),
        },
        totalAmount,
        status,
        createdAt,
        updatedAt,
      });
      docs.push(order);
    }
    return docs;
  }
}
