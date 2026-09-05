import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IBuyerProfile extends Document {
  user: mongoose.Types.ObjectId;
  businessType?: string;
  industry?: string;
  categoriesOfInterest?: string[];
  preferredFabricTypes?: string[];
  typicalOrderQuantity?: string;
  budgetRange?: string;
  additionalPreferences?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BuyerProfileSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    businessType: { type: String },
    industry: { type: String },
    categoriesOfInterest: { type: [String] },
    preferredFabricTypes: { type: [String] },
    typicalOrderQuantity: { type: String },
    budgetRange: { type: String },
    additionalPreferences: { type: String },
  },
  { timestamps: true }
);

export const BuyerProfile: Model<IBuyerProfile> =
  mongoose.models.BuyerProfile || mongoose.model<IBuyerProfile>('BuyerProfile', BuyerProfileSchema);
