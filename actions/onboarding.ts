'use server';

import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';
import { BuyerProfile } from '@/models/BuyerProfile';
import { SupplierProfile } from '@/models/SupplierProfile';
import { revalidatePath } from 'next/cache';

export async function completeOnboarding(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: 'Not authenticated. Please log in again.' };
    }

    await dbConnect();

    const userId = session.user.id;

    // Allow role to be updated (used by Google users who chose during onboarding)
    const submittedRole = (formData.get('role') as 'buyer' | 'supplier') || session.user.role;
    const companyName = (formData.get('companyName') as string)?.trim();

    if (!companyName) {
      return { error: 'Company name is required.' };
    }

    if (submittedRole === 'supplier') {
      const businessType = (formData.get('businessType') as string)?.trim();
      const primaryCategories = (formData.get('primaryCategories') as string)?.trim();
      const moqRaw = formData.get('moq') as string;
      const moq = moqRaw ? parseInt(moqRaw, 10) : 0;

      await SupplierProfile.findOneAndUpdate(
        { user: userId },
        {
          user: userId,
          businessName: companyName,
          businessType: businessType || 'Manufacturer',
          productCategories: primaryCategories
            ? primaryCategories.split(',').map((s) => s.trim()).filter(Boolean)
            : [],
          moq: isNaN(moq) ? 0 : moq,
        },
        { upsert: true, new: true }
      );
    } else {
      const industry = (formData.get('industry') as string)?.trim();
      const categoriesRaw = (formData.get('categoriesOfInterest') as string) || '';
      const categories = categoriesRaw.split(',').map((s) => s.trim()).filter(Boolean);
      const typicalOrderVolume = (formData.get('typicalOrderVolume') as string)?.trim();

      await BuyerProfile.findOneAndUpdate(
        { user: userId },
        {
          user: userId,
          industry: industry || '',
          categoriesOfInterest: categories,
          typicalOrderQuantity: typicalOrderVolume || '',
          // Store company name in businessType field for reference
          businessType: companyName,
        },
        { upsert: true, new: true }
      );
    }

    // Mark user as onboarded and update role if it changed
    await User.findByIdAndUpdate(userId, {
      onboardingCompleted: true,
      role: submittedRole,
    });

    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error: any) {
    console.error('[onboarding] Error:', error);
    return { error: error.message || 'Failed to complete onboarding. Please try again.' };
  }
}
