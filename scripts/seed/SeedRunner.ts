import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';

import dbConnect from '../../lib/mongodb';
import { CloudinarySeeder } from './CloudinarySeeder';
import { SupplierSeeder } from './seeders/SupplierSeeder';
import { BuyerSeeder } from './seeders/BuyerSeeder';
import { ProductSeeder } from './seeders/ProductSeeder';
import { OrderSeeder } from './seeders/OrderSeeder';
import { CartSeeder } from './seeders/CartSeeder';

import { User } from '../../models/User';
import { SupplierProfile } from '../../models/SupplierProfile';
import { BuyerProfile } from '../../models/BuyerProfile';
import { Product } from '../../models/Product';
import { Order } from '../../models/Order';
import { Cart } from '../../models/Cart';

import { SUPPLIER_PRESETS } from './data/indian-textiles';

// Ensure predictable random generation
faker.seed(123);

export class SeedRunner {
  private isReset: boolean;
  private cloudinarySeeder: CloudinarySeeder;
  private supplierSeeder: SupplierSeeder;
  private buyerSeeder: BuyerSeeder;
  private productSeeder: ProductSeeder;
  private orderSeeder: OrderSeeder;
  private cartSeeder: CartSeeder;

  constructor(isReset: boolean) {
    this.isReset = isReset;
    this.cloudinarySeeder = new CloudinarySeeder();
    this.supplierSeeder = new SupplierSeeder();
    this.buyerSeeder = new BuyerSeeder();
    this.productSeeder = new ProductSeeder();
    this.orderSeeder = new OrderSeeder();
    this.cartSeeder = new CartSeeder();
  }

  async run() {
    console.log('🌱 Starting Seed Process...');
    await dbConnect();
    console.log('✅ Connected to MongoDB Atlas');

    if (this.isReset) {
      console.log('⚠️ --reset flag detected. Clearing existing database collections...');
      await this.clearCollections();
      await this.cloudinarySeeder.reset();
    } else {
      const existingUsers = await User.countDocuments();
      if (existingUsers > 0) {
        console.log('⏭️ Database already seeded (users exist). Run with --reset to overwrite.');
        process.exit(0);
      }
    }

    console.log('🚀 Executing seeders...');

    // 1. Initialize Asset Pipeline
    console.log('Initializing Generic Asset Importer...');
    const library = await this.cloudinarySeeder.populateImageLibrary();

    // 2. Seed Suppliers
    const supplierDocs = await this.supplierSeeder.seed();

    // 3. Seed Buyers
    const buyerDocs = await this.buyerSeeder.seed();

    // 4. Seed Products
    const productDocs = await this.productSeeder.seed(supplierDocs, library);

    // 5. Seed Orders
    await this.orderSeeder.seed(buyerDocs, productDocs);

    // 6. Seed Carts
    await this.cartSeeder.seed(buyerDocs, productDocs);

    // 7. Validation
    await this.validate();

    console.log('🎉 Seeding completed successfully!');
    process.exit(0);
  }

  private async clearCollections() {
    await User.deleteMany({});
    await SupplierProfile.deleteMany({});
    await BuyerProfile.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Cart.deleteMany({});
    console.log('🗑️ Cleared User, SupplierProfile, BuyerProfile, Product, Order, and Cart collections.');
  }

  private async validate() {
    console.log('🔍 Validating seeded data...');
    
    const supplierCount = await SupplierProfile.countDocuments();
    if (supplierCount !== SUPPLIER_PRESETS.length) throw new Error(`Expected ${SUPPLIER_PRESETS.length} suppliers, got ${supplierCount}`);

    const productCount = await Product.countDocuments();
    if (productCount !== (SUPPLIER_PRESETS.length * 15)) throw new Error(`Expected ${SUPPLIER_PRESETS.length * 15} products, got ${productCount}`);

    const orderCount = await Order.countDocuments();
    if (orderCount !== 350) throw new Error(`Expected 350 orders, got ${orderCount}`);
    
    // Check Cloudinary URLs
    const sampleProduct = await Product.findOne();
    if (!sampleProduct?.images[0]?.includes('res.cloudinary.com')) {
      throw new Error('Product images are not valid Cloudinary URLs');
    }
    
    // Check Relationships
    const sampleOrder = await Order.findOne().populate('buyer');
    if (!sampleOrder?.buyer) {
      throw new Error('Order missing buyer relationship');
    }

    console.log('✅ Validation passed! Data is robust and relationships are intact.');
  }
}
