import { Order, IOrder } from '@/models/Order';
import dbConnect from '@/lib/mongodb';
import mongoose from 'mongoose';

export class OrderRepository {
  async findByBuyerId(buyerId: string): Promise<IOrder[]> {
    await dbConnect();
    return Order.find({ buyer: buyerId })
      .populate('products.product')
      .populate('supplier', 'name businessName')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findBySupplierId(supplierId: string): Promise<IOrder[]> {
    await dbConnect();
    return Order.find({ supplier: supplierId })
      .populate('products.product')
      .populate('buyer', 'name company')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(id: string): Promise<IOrder | null> {
    await dbConnect();
    return Order.findById(id)
      .populate('products.product')
      .populate('supplier', 'name businessName')
      .populate('buyer', 'name company')
      .exec();
  }

  async create(orderData: Partial<IOrder>): Promise<IOrder> {
    await dbConnect();
    const order = new Order(orderData);
    return order.save();
  }

  async updateStatus(id: string, status: IOrder['status']): Promise<IOrder | null> {
    await dbConnect();
    return Order.findByIdAndUpdate(id, { status }, { new: true }).exec();
  }
}
