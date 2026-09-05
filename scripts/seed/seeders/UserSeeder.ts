import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';
import { User } from '../../../models/User';

export class UserSeeder {
  async seedSupplierUser(preset: any, index: number) {
    const passwordHash = await bcrypt.hash('password123', 10);
    const email = `supplier${index + 1}@${preset.businessName.replace(/\\s+/g, '').toLowerCase()}.com`;
    return await User.create({
      name: faker.person.fullName(),
      email,
      passwordHash,
      role: 'supplier',
      onboardingCompleted: true,
    });
  }

  async seedBuyerUser(index: number) {
    const passwordHash = await bcrypt.hash('password123', 10);
    const email = `buyer${index + 1}@demo.com`;
    return await User.create({
      name: faker.person.fullName(),
      email,
      passwordHash,
      role: 'buyer',
      onboardingCompleted: true,
    });
  }
}
