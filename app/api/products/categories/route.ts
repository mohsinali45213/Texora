import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Product } from '@/models/Product';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    const categories = await Product.distinct('category');
    return NextResponse.json(categories.sort());
  } catch (error) {
    console.error('Error in /api/products/categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}
