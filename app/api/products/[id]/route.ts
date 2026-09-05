import { NextResponse } from 'next/server';
import { ProductService } from '@/services/product.service';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productService = new ProductService();
    const product = await productService.getProductById(params.id);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error in /api/products/[id]:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}
