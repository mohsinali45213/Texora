import { faker } from '@faker-js/faker';
import { Product } from '../../../models/Product';
import { SupplierProfile } from '../../../models/SupplierProfile';
import { PRICE_RANGES, COLORS, WEAVE_TYPES, CERTIFICATIONS, PATTERNS, FINISHES, CARE_INSTRUCTIONS, APPLICATIONS_LIST, MANUFACTURING_NOTES, AI_TAGS_POOL } from '../data/indian-textiles';

export class ProductSeeder {
  async seed(suppliers: any[], library: Record<string, string[]>) {
    console.log('Seeding Products (15 per supplier)...');
    const docs = [];
    let skuCounter = 1000;

    for (const supplier of suppliers) {
      const profile = await SupplierProfile.findOne({ user: supplier._id });
      if (!profile) continue;

      for (let i = 0; i < 15; i++) {
        const fabricType = faker.helpers.arrayElement(profile.fabricTypesOffered ?? ['Cotton']);
        const category = faker.helpers.arrayElement(profile.productCategories ?? ['Shirting']);
        const color = faker.helpers.arrayElement(COLORS);
        const weave = faker.helpers.arrayElement(WEAVE_TYPES);
        const pattern = faker.helpers.arrayElement(PATTERNS);
        const finish = faker.helpers.arrayElement(FINISHES);
        const isLowStock = i === 14; 
        const isOutOfStock = i === 13; 

        const priceRange = PRICE_RANGES[fabricType] || { min: 100, max: 500 };
        const price = faker.number.int(priceRange);
        
        // Select images from library based on fabric type, fallback to General
        let imagesPool = library[fabricType] || library['General'];
        if (imagesPool.length === 0) imagesPool = library['General'];
        
        // Pick 3-5 images (using faker.helpers.arrayElements)
        // Since our pool might only have 2-3 for some categories, we'll repeat or mix with general
        const selectedImages = faker.helpers.arrayElements([...imagesPool, ...library['General']], faker.number.int({ min: 3, max: 5 }));

        const sku = `TEX-${profile.businessName.substring(0, 3).toUpperCase()}-${skuCounter++}`;
        const searchKeywords = [fabricType.toLowerCase(), category.toLowerCase(), color.toLowerCase(), weave.toLowerCase(), pattern.toLowerCase()];

        const product = await Product.create({
          supplier: supplier._id,
          sku,
          name: `Premium ${fabricType} ${category} — ${color} ${pattern}`,
          category,
          fabricType,
          description: `${faker.commerce.productDescription()} This high-quality ${fabricType.toLowerCase()} is perfect for ${category.toLowerCase()} applications. Woven with a durable ${weave.toLowerCase()} weave and finished with a ${finish.toLowerCase()} treatment.`,
          images: selectedImages,
          colors: [color, faker.helpers.arrayElement(COLORS)],
          specifications: {
            width: faker.helpers.arrayElement(['44in', '58in', '60in']),
            weight: faker.helpers.arrayElement(['120 GSM', '150 GSM', '180 GSM', '220 GSM', '300 GSM']),
            composition: `100% ${fabricType}`,
            weave: weave,
            certification: faker.helpers.arrayElement(CERTIFICATIONS),
          },
          stock: isOutOfStock ? 0 : isLowStock ? 3 : faker.number.int({ min: 50, max: 1000 }),
          price,
          moq: profile.moq,
          unit: 'meter',
          isAvailable: !isOutOfStock,
          isFeatured: i === 0 || i === 1,
          isTrending: i === 2,

          pattern,
          finish,
          leadTime: faker.helpers.arrayElement(['7-14 Days', '15-30 Days', 'In Stock', 'Made to Order (45 Days)']),
          countryOfOrigin: 'India',
          certifications: faker.helpers.arrayElements(CERTIFICATIONS, 2),
          careInstructions: faker.helpers.arrayElement(CARE_INSTRUCTIONS),
          applications: faker.helpers.arrayElements(APPLICATIONS_LIST, 3),
          manufacturingNotes: faker.helpers.arrayElement(MANUFACTURING_NOTES),
          aiTags: faker.helpers.arrayElements(AI_TAGS_POOL, 5),
          searchKeywords,
          rating: faker.number.float({ min: 3.5, max: 5.0, fractionDigits: 1 }),
          reviewsCount: faker.number.int({ min: 0, max: 150 }),
        });

        docs.push(product);
      }
    }
    return docs;
  }
}
