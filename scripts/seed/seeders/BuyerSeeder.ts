import { BuyerProfile } from '../../../models/BuyerProfile';
import { UserSeeder } from './UserSeeder';
import { BUYER_PRESETS } from '../data/indian-textiles';
import { faker } from '@faker-js/faker';

export class BuyerSeeder {
  private userSeeder = new UserSeeder();

  async seed() {
    console.log('Seeding Buyers...');
    const docs = [];
    for (let i = 0; i < BUYER_PRESETS.length; i++) {
      const preset = BUYER_PRESETS[i];
      const user = await this.userSeeder.seedBuyerUser(i);
      
      await BuyerProfile.create({
        user: user._id,
        businessType: preset.businessType,
        industry: 'Fashion & Apparel',
        categoriesOfInterest: faker.helpers.arrayElements(['Shirting', 'Suiting', 'Denim', 'Sarees', 'Activewear'], 2),
        preferredFabricTypes: ['Cotton', 'Silk', 'Denim'],
        typicalOrderQuantity: faker.helpers.arrayElement(['100-500 meters', '500-2000 meters', '2000+ meters']),
        budgetRange: faker.helpers.arrayElement(['Economy', 'Mid-Range', 'Premium']),
        additionalPreferences: 'Looking for sustainable and certified fabrics.',
      });
      docs.push(user);
    }
    return docs;
  }
}
