import { User, IUser } from '@/models/User';
import { BuyerProfile } from '@/models/BuyerProfile';
import { SupplierProfile } from '@/models/SupplierProfile';
import dbConnect from '@/lib/mongodb';
import mongoose from 'mongoose';

export class UserRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    await dbConnect();
    return User.findOne({ email }).exec();
  }

  async findById(id: string): Promise<IUser | null> {
    await dbConnect();
    return User.findById(id).exec();
  }

  async create(userData: Partial<IUser>): Promise<IUser> {
    await dbConnect();
    const user = new User(userData);
    return user.save();
  }

  async createWithProfile(
    userData: Partial<IUser>,
    profileData: any
  ): Promise<{ user: IUser; profile: any }> {
    await dbConnect();
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const user = new User(userData);
      await user.save({ session });

      let profile;
      if (user.role === 'buyer') {
        profile = new BuyerProfile({ ...profileData, user: user._id });
      } else {
        profile = new SupplierProfile({ ...profileData, user: user._id });
      }
      
      await profile.save({ session });
      await session.commitTransaction();

      return { user, profile };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async updateOnboardingStatus(id: string, status: boolean): Promise<IUser | null> {
    await dbConnect();
    return User.findByIdAndUpdate(id, { onboardingCompleted: status }, { new: true }).exec();
  }
}
