import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IProduct extends Document {
  supplier: mongoose.Types.ObjectId;
  sku: string;
  name: string;
  category: string;
  fabricType?: string;
  description: string;
  images: string[];
  colors?: string[];
  specifications?: Map<string, string>;
  stock: number;
  price: number;
  moq?: number;
  unit: string;
  isAvailable: boolean;
  isFeatured: boolean;
  isTrending: boolean;
  
  // Rich Metadata & AI
  pattern?: string;
  finish?: string;
  leadTime?: string;
  countryOfOrigin?: string;
  certifications?: string[];
  careInstructions?: string;
  applications?: string[];
  manufacturingNotes?: string;
  aiTags?: string[];
  searchKeywords?: string[];
  rating?: number;
  reviewsCount?: number;

  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    supplier: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    sku: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true, index: true },
    fabricType: { type: String },
    description: { type: String, required: true },
    images: { type: [String], default: [] },
    colors: { type: [String], default: [] },
    specifications: { type: Map, of: String, default: {} },
    stock: { type: Number, required: true, default: 0, min: 0 },
    price: { type: Number, required: true, min: 0 },
    moq: { type: Number, default: 100 },
    unit: { type: String, default: 'meter' },
    isAvailable: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },

    // Rich Metadata & AI
    pattern: { type: String },
    finish: { type: String },
    leadTime: { type: String },
    countryOfOrigin: { type: String, default: 'India' },
    certifications: { type: [String], default: [] },
    careInstructions: { type: String },
    applications: { type: [String], default: [] },
    manufacturingNotes: { type: String },
    aiTags: { type: [String], default: [] },
    searchKeywords: { type: [String], default: [] },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    reviewsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ProductSchema.index({ 
  name: 'text', 
  description: 'text', 
  category: 'text',
  searchKeywords: 'text',
  aiTags: 'text'
});

export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
