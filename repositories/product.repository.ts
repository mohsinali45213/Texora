import { Product } from '@/models/Product';
import '@/models/User'; // must be imported so Mongoose can resolve ref:'User' in populate()
import '@/models/SupplierProfile'; // pre-register all related models
import dbConnect from '@/lib/mongodb';
import mongoose from 'mongoose';


export class ProductRepository {
  private serialize(doc: any) {
    const specMap = doc.specifications;
    let specs: { label: string; value: string }[] = [];
    if (specMap instanceof Map) {
      specs = Array.from(specMap.entries()).map(([label, value]) => ({ label, value: String(value) }));
    } else if (specMap && typeof specMap === 'object') {
      specs = Object.entries(specMap).map(([label, value]) => ({ label, value: String(value) }));
    }

    return {
      ...doc,
      id: doc._id?.toString() || '',
      _id: undefined,
      __v: undefined,
      supplier: doc.supplier?._id?.toString() || doc.supplier?.toString() || '',
      supplierName: doc.supplier?.name || 'Unknown Supplier',
      // Convenience aliases for the frontend
      image: doc.images?.[0] || '/fabric-cotton.jpg',
      gallery: doc.images || [],
      categorySlug: (doc.category || '').toLowerCase().replace(/\s+/g, '-'),
      leadTimeDays: parseInt((doc.leadTime || '14').replace(/[^0-9]/g, '')) || 14,
      specifications: specs,
      colors: doc.colors || [],
    };
  }

  async findAll(query: any = {}, options: { sort?: any, limit?: number } = {}): Promise<any[]> {
    await dbConnect();
    let mongoQuery = Product.find(query).populate('supplier', 'name');
    if (options.sort) mongoQuery = mongoQuery.sort(options.sort);
    if (options.limit) mongoQuery = mongoQuery.limit(options.limit);
    const docs = await mongoQuery.lean().exec();
    return docs.map((d) => this.serialize(d));
  }

  async findById(id: string): Promise<any | null> {
    await dbConnect();
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    const doc = await Product.findById(id).populate('supplier', 'name').lean().exec();
    return doc ? this.serialize(doc) : null;
  }

  async search(searchTerm: string, category?: string): Promise<any[]> {
    await dbConnect();
    const query: any = { isAvailable: true };

    if (searchTerm) {
      // Use text search if index exists, fallback to regex
      try {
        query.$text = { $search: searchTerm };
        if (category) query.category = category;
        const docs = await Product.find(query).populate('supplier', 'name').lean().exec();
        if (docs.length > 0) return docs.map((d) => this.serialize(d));
      } catch {
        // Text index may not exist yet — fall through to regex search
      }
      // Regex fallback
      const regex = new RegExp(searchTerm.split(/\s+/).join('|'), 'i');
      const fallbackQuery: any = {
        isAvailable: true,
        $or: [
          { name: regex },
          { category: regex },
          { fabricType: regex },
          { description: regex },
          { searchKeywords: regex },
          { aiTags: regex },
        ],
      };
      if (category) fallbackQuery.category = category;
      const docs = await Product.find(fallbackQuery).populate('supplier', 'name').lean().exec();
      return docs.map((d) => this.serialize(d));
    }

    if (category) query.category = category;
    const docs = await Product.find(query).populate('supplier', 'name').lean().exec();
    return docs.map((d) => this.serialize(d));
  }

  async create(productData: any): Promise<any> {
    await dbConnect();
    const product = new Product(productData);
    const saved = await product.save();
    return this.serialize(saved.toObject());
  }

  async update(id: string, productData: any): Promise<any | null> {
    await dbConnect();
    if (productData.stock !== undefined && productData.stock === 0) {
      productData.isAvailable = false;
    }
    const doc = await Product.findByIdAndUpdate(id, productData, { new: true })
      .populate('supplier', 'name')
      .lean()
      .exec();
    return doc ? this.serialize(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    await dbConnect();
    const result = await Product.findByIdAndDelete(id).exec();
    return result !== null;
  }
}
