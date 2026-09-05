import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { OrderService } from '@/services/order.service';

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { shippingAddress } = await request.json();

    const orderService = new OrderService();
    const orders = await orderService.createOrderFromCart(session.user.id, shippingAddress);

    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    console.error('Failed to create order:', error);
    return NextResponse.json({ error: error.message || 'Failed to place order' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orderService = new OrderService();
    // In a real app we'd differentiate buyer vs supplier, using role check
    // For now we'll return buyer orders
    const orders = await orderService.getBuyerOrders(session.user.id);

    return NextResponse.json(orders);
  } catch (error: any) {
    console.error('Failed to fetch orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
