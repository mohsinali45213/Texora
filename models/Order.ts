import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IOrderProduct {
  product: mongoose.Types.ObjectId;
  quantity: number;
  priceAtTime: number;
}

export interface IOrder extends Document {
  buyer: mongoose.Types.ObjectId;
  supplier: mongoose.Types.ObjectId;
  products: IOrderProduct[];
  status: 'pending' | 'accepted' | 'manufacturing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  shippingAddress?: Map<string, string>;
  trackingNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderProductSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  priceAtTime: { type: Number, required: true, min: 0 },
});

const OrderSchema = new Schema(
  {
    buyer: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    supplier: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    products: { type: [OrderProductSchema], required: true },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'manufacturing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
      required: true,
      index: true,
    },
    totalAmount: { type: Number, required: true, min: 0 },
    shippingAddress: { type: Map, of: String },
    trackingNumber: { type: String },
  },
  { timestamps: true }
);

export const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
