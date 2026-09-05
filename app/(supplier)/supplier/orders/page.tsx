'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency, formatDate, formatNumber } from '@/lib/utils';

type DbOrderStatus = 'pending' | 'accepted' | 'manufacturing' | 'shipped' | 'delivered';

const flow: DbOrderStatus[] = ['pending', 'accepted', 'manufacturing', 'shipped', 'delivered'];

const statusLabel: Record<DbOrderStatus, string> = {
  pending: 'Pending',
  accepted: 'Accepted',
  manufacturing: 'Manufacturing',
  shipped: 'Shipped',
  delivered: 'Delivered',
};

export default function SupplierOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | DbOrderStatus>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders');
        const data = await res.json();
        if (active) {
          setOrders(Array.isArray(data) ? data : data.items || []);
        }
      } catch (e) {
        console.error('Failed to load orders', e);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchOrders();
    return () => { active = false; };
  }, []);

  const advance = (order: any) => {
    const currentIndex = flow.indexOf(order.status as DbOrderStatus);
    const next = flow[currentIndex + 1];
    if (!next) return;
    setOrders((prev) =>
      prev.map((o) => (o._id === order._id || o.id === order.id ? { ...o, status: next } : o)),
    );
    toast.success(`${order.reference || 'Order'} → ${statusLabel[next]}`);
  };

  const visible = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="container-page py-8 md:py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Orders</h1>
      <p className="mt-2 text-sm text-muted-foreground">{orders.length} orders in the queue</p>

      <Tabs
        value={filter}
        onValueChange={(value) => setFilter(value as 'all' | DbOrderStatus)}
        className="mt-6"
      >
        <TabsList className="flex-wrap">
          <TabsTrigger value="all">All</TabsTrigger>
          {flow.map((status) => (
            <TabsTrigger key={status} value={status}>
              {statusLabel[status]}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="mt-6 space-y-4">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading orders…</p>
        ) : visible.length === 0 ? (
          <p className="text-sm text-muted-foreground">No orders in this category.</p>
        ) : (
          visible.map((order) => (
            <Card key={order._id || order.id} className="gap-4 p-5">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:justify-between">
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2 font-medium">
                    {order.reference || String(order._id || order.id).slice(-6).toUpperCase()}
                    <Badge variant="secondary">{statusLabel[order.status as DbOrderStatus] || order.status}</Badge>
                  </p>
                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {order.buyerName || order.buyerCompany || 'Buyer'} · {formatDate(order.createdAt || order.placedAt || '')}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-lg font-semibold">{formatCurrency(order.totalAmount || order.total || 0)}</span>
                  {order.status !== 'delivered' ? (
                    <Button size="sm" onClick={() => advance(order)}>
                      Mark {statusLabel[flow[flow.indexOf(order.status as DbOrderStatus) + 1]] || 'Next'}
                    </Button>
                  ) : null}
                </div>
              </div>

              <ul className="space-y-1 border-t pt-3 text-sm text-muted-foreground mt-4">
                {(order.items || []).map((item: any, i: number) => (
                  <li key={item.productId || i} className="truncate">
                    {formatNumber(item.quantity)} m · {item.name || item.productName || 'Fabric'}
                  </li>
                ))}
              </ul>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
