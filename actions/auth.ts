'use server';

import { UserRepository } from '@/repositories/user.repository';
import bcrypt from 'bcryptjs';

export async function registerUser(formData: FormData) {
  try {
    const role = formData.get('role') as 'buyer' | 'supplier';
    const name = formData.get('name') as string;
    const company = formData.get('company') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!role || !name || !company || !email || !password) {
      return { error: 'All fields are required' };
    }

    const userRepository = new UserRepository();
    const existingUser = await userRepository.findByEmail(email);

    if (existingUser) {
      return { error: 'Email is already registered' };
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const profileData = role === 'buyer' 
      ? { company, businessType: 'Apparel Brand' } 
      : { businessName: company, businessType: 'Manufacturer' };

    await userRepository.createWithProfile(
      {
        name,
        email,
        passwordHash,
        role,
        onboardingCompleted: false,
      },
      profileData
    );

    return { success: true };
  } catch (error) {
    console.error('Registration error:', error);
    return { error: 'Failed to register account' };
  }
}
