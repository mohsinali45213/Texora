'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Boxes, Receipt, TrendingUp, TriangleAlert } from 'lucide-react';
import { StatCard } from '@/components/shared/StatCard';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatCurrency, formatDate, formatNumber } from '@/lib/utils';

export default function SupplierDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          fetch('/api/orders'),
          fetch('/api/products'),
        ]);
        const [ordersData, productsData] = await Promise.all([
          ordersRes.ok ? ordersRes.json() : [],
          productsRes.ok ? productsRes.json() : [],
        ]);
        if (active) {
          setOrders(Array.isArray(ordersData) ? ordersData : ordersData.items || []);
          setListings(Array.isArray(productsData) ? productsData : productsData.items || []);
        }
      } catch (e) {
        console.error('Failed to load dashboard data', e);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchData();
    return () => { active = false; };
  }, []);

  const pending = orders.filter((o) => o.status === 'pending');
  const revenue = orders.reduce((sum, o) => sum + (o.totalAmount || o.total || 0), 0);
  const lowStock = listings.filter((p) => p.stock > 0 && p.stock < (p.moq || 0) * 2);

  return (
    <div className="container-page py-8 md:py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-2 text-sm text-muted-foreground">Supplier Dashboard · last 30 days</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Revenue" value={formatCurrency(revenue)} icon={TrendingUp} tone="success" />
        <StatCard label="Pending orders" value={String(pending.length)} icon={Receipt} tone="warning" />
        <StatCard label="Active listings" value={String(listings.length)} icon={Boxes} />
        <StatCard label="Low stock" value={String(lowStock.length)} icon={TriangleAlert} tone="warning" />
      </div>

      <section className="mt-12">
        <SectionHeading
          eyebrow="Queue"
          title="Recent orders"
          description="Move orders through acceptance, preparation and dispatch."
          action={
            <Button variant="outline" asChild>
              <Link href="/supplier/orders">All orders</Link>
            </Button>
          }
        />
        <Card className="mt-6 gap-0 p-0 overflow-hidden">
          {loading ? (
            <p className="p-5 text-sm text-muted-foreground">Loading orders…</p>
          ) : orders.length === 0 ? (
            <p className="p-5 text-sm text-muted-foreground">No orders yet.</p>
          ) : (
            <ul className="divide-y">
              {orders.slice(0, 4).map((order) => (
                <li
                  key={order._id || order.id}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4"
                >
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-center gap-2 text-sm font-medium">
                      {order.reference || order._id?.slice(-6)?.toUpperCase()}
                      <Badge variant="secondary">{order.status}</Badge>
                    </p>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {order.buyerCompany || order.buyerName || 'Buyer'} · {formatDate(order.createdAt || order.placedAt || '')}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold">{formatCurrency(order.totalAmount || order.total || 0)}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>

      <section className="mt-12">
        <SectionHeading
          eyebrow="Inventory"
          title="Stock to watch"
          description="Listings close to their minimum order quantity threshold."
          action={
            <Button variant="outline" asChild>
              <Link href="/supplier/products">Manage products</Link>
            </Button>
          }
        />
        <Card className="mt-6 gap-0 p-0 overflow-hidden">
          {loading ? (
            <p className="p-5 text-sm text-muted-foreground">Loading inventory…</p>
          ) : (
            <ul className="divide-y">
              {(lowStock.length ? lowStock : listings.slice(0, 3)).map((product) => (
                <li key={product._id || product.id} className="flex items-center gap-4 px-5 py-4">
                  <img
                    src={product.images?.[0] || product.image || '/fabric-cotton.jpg'}
                    alt=""
                    loading="lazy"
                    width={96}
                    height={96}
                    className="h-12 w-12 shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatNumber(product.stock)} m in stock · MOQ {formatNumber(product.moq || 0)} m
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>
    </div>
  );
}
