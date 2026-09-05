import { NextResponse } from 'next/server';
import { ProductService } from '@/services/product.service';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const aiMode = searchParams.get('ai') === 'true';
    const category = searchParams.get('category');
    const featured = searchParams.get('featured') === 'true';
    const trending = searchParams.get('trending') === 'true';
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    
    const productService = new ProductService();
    
    let products;
    if (q) {
      products = await productService.searchProducts(q, aiMode);
    } else if (featured) {
      products = await productService.getFeaturedProducts();
    } else if (trending) {
      products = await productService.getAllProducts({ isTrending: true, isAvailable: true });
    } else if (category) {
      products = await productService.getProductsByCategory(category);
    } else {
      products = await productService.getAllProducts({ isAvailable: true });
    }
    
    if (limit) products = products.slice(0, limit);
    
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error in /api/products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
