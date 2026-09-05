import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash?: string;
  role: 'buyer' | 'supplier';
  onboardingCompleted: boolean;
  authProvider: 'credentials' | 'google';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    passwordHash: { type: String },
    role: { type: String, enum: ['buyer', 'supplier'], required: true },
    onboardingCompleted: { type: Boolean, default: false },
    authProvider: { type: String, enum: ['credentials', 'google'], default: 'credentials' },
  },
  { timestamps: true }
);

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
