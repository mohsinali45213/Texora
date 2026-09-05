import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ISupplierProfile extends Document {
  user: mongoose.Types.ObjectId;
  businessName: string;
  businessType?: string;
  contactPhone?: string;
  contactEmail?: string;
  address?: string;
  operatingHours?: string;
  productCategories?: string[];
  fabricTypesOffered?: string[];
  moq?: number;
  additionalInfo?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SupplierProfileSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    businessName: { type: String, required: true },
    businessType: { type: String },
    contactPhone: { type: String },
    contactEmail: { type: String },
    address: { type: String },
    operatingHours: { type: String },
    productCategories: { type: [String] },
    fabricTypesOffered: { type: [String] },
    moq: { type: Number },
    additionalInfo: { type: String },
  },
  { timestamps: true }
);

export const SupplierProfile: Model<ISupplierProfile> =
  mongoose.models.SupplierProfile || mongoose.model<ISupplierProfile>('SupplierProfile', SupplierProfileSchema);
