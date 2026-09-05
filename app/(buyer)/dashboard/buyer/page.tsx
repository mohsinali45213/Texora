'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Package, Truck, CheckCircle2, Clock, MapPin, Search, ArrowRight, Heart, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

const mockOrders = [
  {
    id: 'TX-1050',
    date: '2023-11-20',
    status: 'Processing',
    items: 2,
    total: 84500,
    supplier: 'Vertex Textiles Ltd',
    eta: 'Nov 28, 2023',
    progress: 1, // 0: Placed, 1: Processing, 2: Shipped, 3: Delivered
  },
  {
    id: 'TX-0942',
    date: '2023-10-05',
    status: 'Delivered',
    items: 1,
    total: 125000,
    supplier: 'Nova Loom',
    eta: 'Oct 12, 2023',
    progress: 3,
  }
];

const mockSaved = [
  {
    id: 'prod-1',
    name: 'Premium Organic Cotton',
    supplier: 'EcoFabrics India',
    price: 320,
    moq: 100,
    image: '/fabric-cotton.jpg',
  },
  {
    id: 'prod-2',
    name: 'Heavyweight Denim 14oz',
    supplier: 'BlueLine Mills',
    price: 450,
    moq: 200,
    image: '/fabric-denim.jpg',
  }
];

export default function BuyerDashboard() {
  return (
    <div className="container-page py-8 md:py-12 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Buyer Dashboard</h1>
          <p className="text-muted-foreground mt-2">Track orders, discover fabrics, and manage your sourcing.</p>
        </div>
        <Button asChild>
          <Link href="/products">
            <Search className="h-4 w-4 mr-2" />
            Source new fabrics
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 glass">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Orders</p>
              <h2 className="text-2xl font-semibold mt-1">1</h2>
            </div>
          </div>
        </Card>
        <Card className="p-6 glass">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">In Transit</p>
              <h2 className="text-2xl font-semibold mt-1">0</h2>
            </div>
          </div>
        </Card>
        <Card className="p-6 glass">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-rose-500/10 text-rose-500 rounded-xl">
              <Heart className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Saved Fabrics</p>
              <h2 className="text-2xl font-semibold mt-1">12</h2>
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="orders">Track Orders</TabsTrigger>
          <TabsTrigger value="saved">Saved Fabrics</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-6">
          {mockOrders.map((order) => (
            <Card key={order.id} className="p-0 overflow-hidden">
              <div className="border-b bg-muted/30 p-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    Order {order.id}
                    {order.status === 'Delivered' ? (
                      <Badge className="bg-success/15 text-success border-0 hover:bg-success/20">Delivered</Badge>
                    ) : (
                      <Badge variant="secondary" className="border-0 text-primary bg-primary/10">In Progress</Badge>
                    )}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Placed on {order.date} · {order.items} items from {order.supplier}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-lg">₹{order.total.toLocaleString()}</p>
                  <Button variant="link" className="px-0 h-auto text-primary">View Invoice</Button>
                </div>
              </div>
              
              <div className="p-6 md:p-10">
                <div className="relative flex justify-between">
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -translate-y-1/2 rounded-full" />
                  <div 
                    className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 rounded-full transition-all duration-1000" 
                    style={{ width: `${(order.progress / 3) * 100}%` }}
                  />
                  
                  {['Order Placed', 'Processing', 'Shipped', 'Delivered'].map((step, idx) => {
                    const isActive = order.progress >= idx;
                    const isCurrent = order.progress === idx;
                    
                    return (
                      <div key={step} className="relative z-10 flex flex-col items-center gap-2">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                          isActive ? 'bg-primary border-primary text-primary-foreground' : 'bg-background border-muted text-muted-foreground'
                        }`}>
                          {idx === 0 && <Package className="h-5 w-5" />}
                          {idx === 1 && <Clock className="h-5 w-5" />}
                          {idx === 2 && <Truck className="h-5 w-5" />}
                          {idx === 3 && <CheckCircle2 className="h-5 w-5" />}
                        </div>
                        <p className={`text-xs md:text-sm font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {step}
                        </p>
                      </div>
                    );
                  })}
                </div>
                
                {order.progress < 3 && (
                  <div className="mt-8 bg-muted/40 p-4 rounded-xl flex items-start gap-4">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm">Latest Update</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your order is currently being prepared by the mill. Expected dispatch in 2 days. 
                        Estimated delivery by <span className="font-medium text-foreground">{order.eta}</span>.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="saved" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mockSaved.map((product) => (
            <Card key={product.id} className="overflow-hidden group">
              <div className="relative aspect-[4/3]">
                <img src={product.image} alt={product.name} className="object-cover w-full h-full transition-transform group-hover:scale-105" />
                <Button size="icon" variant="secondary" className="absolute top-2 right-2 rounded-full h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Heart className="h-4 w-4 fill-rose-500 text-rose-500" />
                </Button>
              </div>
              <div className="p-4">
                <p className="text-xs text-muted-foreground">{product.supplier}</p>
                <h3 className="font-semibold text-sm mt-1 truncate">{product.name}</h3>
                <div className="flex items-center justify-between mt-3">
                  <span className="font-semibold">₹{product.price}/m</span>
                  <span className="text-xs text-muted-foreground">MOQ {product.moq}m</span>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="analytics">
          <Card className="p-12 text-center text-muted-foreground flex flex-col items-center justify-center border-dashed">
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <TrendingUp className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Sourcing Analytics</h3>
            <p className="mt-2 max-w-sm">Analytics and spend tracking will be available in the next platform update.</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
