'use server';

import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';
import { BuyerProfile } from '@/models/BuyerProfile';
import { SupplierProfile } from '@/models/SupplierProfile';
import { revalidatePath } from 'next/cache';

export async function getProfileData() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: 'Not authenticated' };
    }

    await dbConnect();
    const user = await User.findById(session.user.id).lean();
    if (!user) {
      return { error: 'User not found' };
    }

    let profile = null;
    if (user.role === 'buyer') {
      profile = await BuyerProfile.findOne({ user: user._id }).lean();
    } else if (user.role === 'supplier') {
      profile = await SupplierProfile.findOne({ user: user._id }).lean();
    }

    return {
      success: true,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
      profile: profile
        ? JSON.parse(JSON.stringify(profile)) // serialize ObjectIds and Dates
        : null,
    };
  } catch (error: any) {
    console.error('[getProfileData] Error:', error);
    return { error: 'Failed to fetch profile data' };
  }
}

export async function updateBuyerProfile(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'buyer') {
      return { error: 'Unauthorized' };
    }

    await dbConnect();

    const name = (formData.get('name') as string)?.trim();
    if (name) {
      await User.findByIdAndUpdate(session.user.id, { name });
    }

    const categoriesRaw = formData.get('categoriesOfInterest') as string;
    const categories = categoriesRaw
      ? categoriesRaw.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const fabricTypesRaw = formData.get('preferredFabricTypes') as string;
    const fabricTypes = fabricTypesRaw
      ? fabricTypesRaw.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    await BuyerProfile.findOneAndUpdate(
      { user: session.user.id },
      {
        businessType: formData.get('businessType') as string,
        industry: formData.get('industry') as string,
        categoriesOfInterest: categories,
        preferredFabricTypes: fabricTypes,
        typicalOrderQuantity: formData.get('typicalOrderQuantity') as string,
        budgetRange: formData.get('budgetRange') as string,
        additionalPreferences: formData.get('additionalPreferences') as string,
      },
      { upsert: true }
    );

    revalidatePath('/buyer/profile');
    return { success: true };
  } catch (error: any) {
    console.error('[updateBuyerProfile] Error:', error);
    return { error: error.message || 'Failed to update profile' };
  }
}

export async function updateSupplierProfile(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'supplier') {
      return { error: 'Unauthorized' };
    }

    await dbConnect();

    const name = (formData.get('name') as string)?.trim();
    if (name) {
      await User.findByIdAndUpdate(session.user.id, { name });
    }

    const categoriesRaw = formData.get('productCategories') as string;
    const categories = categoriesRaw
      ? categoriesRaw.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const fabricTypesRaw = formData.get('fabricTypesOffered') as string;
    const fabricTypes = fabricTypesRaw
      ? fabricTypesRaw.split(',').map((s) => s.trim()).filter(Boolean)
      : [];
      
    const moqRaw = formData.get('moq') as string;
    const moq = moqRaw ? parseInt(moqRaw, 10) : 0;

    await SupplierProfile.findOneAndUpdate(
      { user: session.user.id },
      {
        businessName: formData.get('businessName') as string,
        businessType: formData.get('businessType') as string,
        contactPhone: formData.get('contactPhone') as string,
        contactEmail: formData.get('contactEmail') as string,
        address: formData.get('address') as string,
        operatingHours: formData.get('operatingHours') as string,
        productCategories: categories,
        fabricTypesOffered: fabricTypes,
        moq: isNaN(moq) ? 0 : moq,
        additionalInfo: formData.get('additionalInfo') as string,
      },
      { upsert: true }
    );

    revalidatePath('/supplier/profile');
    return { success: true };
  } catch (error: any) {
    console.error('[updateSupplierProfile] Error:', error);
    return { error: error.message || 'Failed to update profile' };
  }
}
