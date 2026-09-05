import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

if (!process.env.CLOUDINARY_URL) {
  console.warn('⚠️ CLOUDINARY_URL not found in environment.');
}

const CACHE_FILE = path.join(process.cwd(), 'scripts', 'seed', '.seed-cache.json');

// Local assets mapped to categories
const LOCAL_ASSETS: Record<string, string[]> = {
  'Cotton': [
    path.join(process.cwd(), 'public', 'fabric-cotton.jpg'),
    path.join(process.cwd(), 'seed-assets', 'cotton.jpg')
  ],
  'Silk': [
    path.join(process.cwd(), 'public', 'fabric-silk.jpg'),
    path.join(process.cwd(), 'seed-assets', 'silk.jpg')
  ],
  'Denim': [
    path.join(process.cwd(), 'public', 'fabric-denim.jpg'),
    path.join(process.cwd(), 'seed-assets', 'denim.jpg')
  ],
  'Wool': [
    path.join(process.cwd(), 'public', 'fabric-wool.jpg'),
    path.join(process.cwd(), 'seed-assets', 'wool.jpg')
  ],
  'Polyester': [
    path.join(process.cwd(), 'seed-assets', 'polyester.jpg')
  ],
  'Linen': [
    path.join(process.cwd(), 'public', 'fabric-linen.jpg')
  ],
  'General': [
    path.join(process.cwd(), 'public', 'fabric-printed.jpg'),
    path.join(process.cwd(), 'public', 'fabric-technical.jpg'),
    path.join(process.cwd(), 'public', 'hero-mill.jpg')
  ]
};

interface ImageCache {
  [filePath: string]: string; // absolute path -> cloudinary secure_url
}

export class CloudinarySeeder {
  private cache: ImageCache = {};

  constructor() {
    this.loadCache();
  }

  private loadCache() {
    if (fs.existsSync(CACHE_FILE)) {
      try {
        const raw = fs.readFileSync(CACHE_FILE, 'utf-8');
        this.cache = JSON.parse(raw);
      } catch (e) {
        console.error('Failed to parse seed cache, starting fresh.', e);
        this.cache = {};
      }
    }
  }

  private saveCache() {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(this.cache, null, 2));
  }

  /**
   * Returns a cached URL if available, otherwise uploads the local file to Cloudinary.
   */
  async getOrUploadImage(filePath: string): Promise<string> {
    if (this.cache[filePath]) {
      return this.cache[filePath];
    }

    if (!fs.existsSync(filePath)) {
      console.warn(`[CloudinarySeeder] Warning: File not found: ${filePath}`);
      return 'https://via.placeholder.com/800x600.png?text=Fabric'; // Fallback
    }

    console.log(`[CloudinarySeeder] Uploading local asset ${path.basename(filePath)} to Cloudinary...`);
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'texora_production_seed',
        use_filename: true,
        unique_filename: true,
      });

      this.cache[filePath] = result.secure_url;
      this.saveCache();
      return result.secure_url;
    } catch (error) {
      console.error(`[CloudinarySeeder] Failed to upload ${filePath}`, error);
      throw error;
    }
  }

  /**
   * Pre-uploads and returns a categorized map of Cloudinary URLs.
   */
  async populateImageLibrary(): Promise<Record<string, string[]>> {
    console.log('📦 Initializing Generic Asset Importer Pipeline (Local Files)...');
    const library: Record<string, string[]> = {};

    for (const [category, filePaths] of Object.entries(LOCAL_ASSETS)) {
      library[category] = [];
      for (const filePath of filePaths) {
        const secureUrl = await this.getOrUploadImage(filePath);
        library[category].push(secureUrl);
      }
    }
    console.log('✅ Asset Pipeline ready.');
    return library;
  }

  async reset() {
    if (fs.existsSync(CACHE_FILE)) {
      fs.unlinkSync(CACHE_FILE);
    }
    this.cache = {};
    console.log(`[CloudinarySeeder] Cache cleared.`);
  }
}
