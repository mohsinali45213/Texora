import { Cart, ICart } from '@/models/Cart';
import dbConnect from '@/lib/mongodb';
import mongoose from 'mongoose';

export class CartRepository {
  async findByBuyerId(buyerId: string): Promise<ICart | null> {
    await dbConnect();
    return Cart.findOne({ buyer: buyerId })
      .populate('items.product')
      .exec();
  }

  async getOrCreateCart(buyerId: string): Promise<ICart> {
    await dbConnect();
    let cart = await Cart.findOne({ buyer: buyerId }).exec();
    if (!cart) {
      cart = await Cart.create({ buyer: buyerId, items: [] });
    }
    return cart;
  }

  async updateCart(buyerId: string, items: { product: string; quantity: number }[]): Promise<ICart | null> {
    await dbConnect();
    return Cart.findOneAndUpdate(
      { buyer: buyerId },
      { items },
      { new: true, upsert: true }
    )
      .populate('items.product')
      .exec();
  }

  async clearCart(buyerId: string): Promise<void> {
    await dbConnect();
    await Cart.findOneAndUpdate({ buyer: buyerId }, { items: [] }).exec();
  }
}
