import mongoose from 'mongoose';

// Eagerly register all models so that .populate() can resolve refs
// regardless of which modules have been imported in this request context.
// This is necessary because Next.js server components may not have
// imported a model file even though the schema is referenced via populate().
import '@/models/User';
import '@/models/SupplierProfile';
import '@/models/BuyerProfile';
import '@/models/Product';
import '@/models/Order';
import '@/models/Cart';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
