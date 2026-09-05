import { faker } from '@faker-js/faker';
import { SupplierProfile } from '../../../models/SupplierProfile';
import { UserSeeder } from './UserSeeder';
import { SUPPLIER_PRESETS, INDIAN_CITIES } from '../data/indian-textiles';

export class SupplierSeeder {
  private userSeeder = new UserSeeder();

  async seed() {
    console.log('Seeding Suppliers...');
    const docs = [];
    for (let i = 0; i < SUPPLIER_PRESETS.length; i++) {
      const preset = SUPPLIER_PRESETS[i];
      const user = await this.userSeeder.seedSupplierUser(preset, i);
      const city = faker.helpers.arrayElement(INDIAN_CITIES);
      await SupplierProfile.create({
        user: user._id,
        businessName: preset.businessName,
        businessType: 'Mill',
        contactPhone: '+91' + faker.string.numeric(10),
        contactEmail: user.email,
        address: `${faker.location.streetAddress()}, ${city}, India`,
        operatingHours: 'Mon–Sat, 9am–6pm',
        productCategories: preset.categories,
        fabricTypesOffered: preset.fabricFocus,
        moq: faker.helpers.arrayElement([100, 200, 500]),
        additionalInfo: `A premium supplier of ${preset.fabricFocus.join(' and ')} based in ${city}.`,
      });
      docs.push(user);
    }
    return docs;
  }
}
