import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ICartItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
}

export interface ICart extends Document {
  buyer: mongoose.Types.ObjectId;
  items: ICartItem[];
  updatedAt: Date;
}

const CartItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const CartSchema = new Schema(
  {
    buyer: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: { type: [CartItemSchema], default: [] },
  },
  { timestamps: true }
);

export const Cart: Model<ICart> =
  mongoose.models.Cart || mongoose.model<ICart>('Cart', CartSchema);
