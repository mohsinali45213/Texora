import { OrderRepository } from '@/repositories/order.repository';
import { CartRepository } from '@/repositories/cart.repository';
import { ProductRepository } from '@/repositories/product.repository';

export class OrderService {
  private orderRepository: OrderRepository;
  private cartRepository: CartRepository;
  private productRepository: ProductRepository;

  constructor() {
    this.orderRepository = new OrderRepository();
    this.cartRepository = new CartRepository();
    this.productRepository = new ProductRepository();
  }

  async createOrderFromCart(buyerId: string, shippingAddress: Map<string, string>) {
    const cart = await this.cartRepository.findByBuyerId(buyerId);
    
    if (!cart || cart.items.length === 0) {
      throw new Error('Cart is empty');
    }

    // Since the hackathon scope assumes one supplier per checkout or splits orders
    // We will group cart items by supplier and create an order for each supplier.
    
    // First, fetch full product details to get supplier info and current price
    const itemsWithDetails = await Promise.all(
      cart.items.map(async (item) => {
        const product = await this.productRepository.findById(item.product.toString());
        if (!product) throw new Error(`Product ${item.product} not found`);
        return { item, product };
      })
    );

    const supplierGroups = new Map<string, typeof itemsWithDetails>();
    
    itemsWithDetails.forEach(({ item, product }) => {
      const supplierId = product.supplier.toString();
      if (!supplierGroups.has(supplierId)) {
        supplierGroups.set(supplierId, []);
      }
      supplierGroups.get(supplierId)!.push({ item, product });
    });

    const orders = [];

    for (const [supplierId, group] of supplierGroups.entries()) {
      let totalAmount = 0;
      const orderProducts = group.map(({ item, product }) => {
        const priceAtTime = product.price;
        totalAmount += priceAtTime * item.quantity;
        return {
          product: product._id,
          quantity: item.quantity,
          priceAtTime,
        };
      });

      const order = await this.orderRepository.create({
        buyer: buyerId as any,
        supplier: supplierId as any,
        products: orderProducts as any,
        status: 'pending',
        totalAmount,
        shippingAddress,
      });

      orders.push(order);
    }

    // Clear cart after successful order creation
    await this.cartRepository.clearCart(buyerId);

    return orders;
  }

  async getBuyerOrders(buyerId: string) {
    return this.orderRepository.findByBuyerId(buyerId);
  }

  async getSupplierOrders(supplierId: string) {
    return this.orderRepository.findBySupplierId(supplierId);
  }

  async updateOrderStatus(orderId: string, status: 'pending' | 'accepted' | 'manufacturing' | 'shipped' | 'delivered' | 'cancelled', supplierId?: string) {
    const order = await this.orderRepository.findById(orderId);
    
    if (!order) throw new Error('Order not found');
    
    if (supplierId && order.supplier._id.toString() !== supplierId) {
      throw new Error('Unauthorized');
    }

    return this.orderRepository.updateStatus(orderId, status);
  }
}
