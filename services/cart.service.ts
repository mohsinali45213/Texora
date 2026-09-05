import { CartRepository } from '@/repositories/cart.repository';

export class CartService {
  private cartRepository: CartRepository;

  constructor() {
    this.cartRepository = new CartRepository();
  }

  async getCart(buyerId: string) {
    return this.cartRepository.getOrCreateCart(buyerId);
  }

  async addItem(buyerId: string, productId: string, quantity: number) {
    const cart = await this.cartRepository.getOrCreateCart(buyerId);
    
    const items = [...cart.items];
    const existingIndex = items.findIndex(item => item.product.toString() === productId);
    
    if (existingIndex > -1) {
      items[existingIndex].quantity += quantity;
    } else {
      // Need any cast for TS to ignore populated product type mismatch during save
      items.push({ product: productId, quantity } as any);
    }
    
    return this.cartRepository.updateCart(buyerId, items as any);
  }

  async removeItem(buyerId: string, productId: string) {
    const cart = await this.cartRepository.getOrCreateCart(buyerId);
    const items = cart.items.filter(item => item.product.toString() !== productId);
    return this.cartRepository.updateCart(buyerId, items as any);
  }

  async updateItemQuantity(buyerId: string, productId: string, quantity: number) {
    const cart = await this.cartRepository.getOrCreateCart(buyerId);
    
    if (quantity <= 0) {
      return this.removeItem(buyerId, productId);
    }
    
    const items = [...cart.items];
    const existingIndex = items.findIndex(item => item.product.toString() === productId);
    
    if (existingIndex > -1) {
      items[existingIndex].quantity = quantity;
    }
    
    return this.cartRepository.updateCart(buyerId, items as any);
  }

  async clearCart(buyerId: string) {
    return this.cartRepository.clearCart(buyerId);
  }
}
