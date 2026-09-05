import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { CartService } from '@/services/cart.service';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cartService = new CartService();
    const cart = await cartService.getCart(session.user.id);
    
    return NextResponse.json(cart);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId, quantity } = await request.json();
    const cartService = new CartService();
    
    const cart = await cartService.addItem(session.user.id, productId, quantity);
    
    return NextResponse.json(cart);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
  }
}
