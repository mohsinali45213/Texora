'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { GitCompareArrows, Minus, Plus, ShieldCheck, ShoppingBag, Truck } from 'lucide-react';
import { toast } from 'sonner';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductQA } from '@/components/ai/ProductQA';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import type { Product } from '@/types/product';
import { aiSimilar } from '@/lib/ai-mock';
import { formatCurrency, formatNumber, cn } from '@/lib/utils';
import { useCart } from '@/context/cart';
import { useCompare } from '@/context/compare';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { add } = useCart();
  const compare = useCompare();
  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [quantity, setQuantity] = useState(100);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      setPageLoading(true);
      try {
        const [prodRes, allRes] = await Promise.all([
          fetch(`/api/products/${params.id}`),
          fetch('/api/products?limit=20'),
        ]);
        if (!prodRes.ok) {
          setPageLoading(false);
          return;
        }
        const [prod, all] = await Promise.all([prodRes.json(), allRes.json()]);
        if (active) {
          setProduct(prod);
          setAllProducts(Array.isArray(all) ? all : []);
          setQuantity(prod.moq || 100);
        }
      } catch (e) {
        console.error('Failed to load product', e);
      } finally {
        if (active) setPageLoading(false);
      }
    };
    fetchData();
    return () => { active = false; };
  }, [params.id]);

  if (pageLoading) {
    return <div className="container-page py-10 text-center text-muted-foreground">Loading product...</div>;
  }
  if (!product) return notFound();

  // Temporary mock fallback for supplier profile since User API mapping is not fully implemented
  const supplier = {
    businessName: product.supplierName || 'Unknown Supplier',
    about: 'Verified textile manufacturer.',
    city: 'Textile Hub',
    country: 'India',
    operatingHours: 'Mon-Sat, 9AM-6PM',
    moq: product.moq
  };

  const similar = aiSimilar(product, allProducts);
  const outOfStock = !product.isAvailable || product.stock === 0;

  return (
    <>
      <div className="container-page py-6 md:py-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/products">Marketplace</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/products?q=${product.categorySlug}`}>
                  {product.category}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="max-w-52 truncate sm:max-w-none">{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12">
          <div>
            <img
              src={product.gallery?.[activeImage] ?? product.image ?? (product.images?.[activeImage] || '/fabric-cotton.jpg')}
              alt={product.name}
              width={1024}
              height={768}
              className="aspect-[4/3] w-full rounded-2xl border object-cover shadow-soft"
            />
            {((product.gallery || product.images || [])?.length || 0) > 1 ? (
              <div className="mt-3 flex gap-3">
                {(product.gallery || product.images || []).map((image: string, index: number) => (
                  <button
                    key={image + index}
                    onClick={() => setActiveImage(index)}
                    aria-label={`View image ${index + 1} of ${product.name}`}
                    className={cn(
                      'h-20 w-20 overflow-hidden rounded-xl border transition-colors',
                      index === activeImage ? 'border-primary' : 'hover:border-primary/40',
                    )}
                  >
                    <img
                      src={image}
                      alt=""
                      loading="lazy"
                      width={160}
                      height={160}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{product.category}</Badge>
              <Badge variant="outline">{product.fabricType}</Badge>
              {outOfStock ? (
                <Badge variant="outline" className="text-muted-foreground">
                  Out of Stock
                </Badge>
              ) : (
                <Badge className="border-0 bg-success/15 text-success">In Stock</Badge>
              )}
            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight">{product.name}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Supplied by <span className="font-medium text-foreground">{product.supplierName}</span>
              {supplier ? ` · ${supplier.city}, ${supplier.country}` : ''}
            </p>

            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{product.description}</p>

            <div className="mt-6 flex flex-wrap items-baseline gap-x-3">
              <span className="text-3xl font-semibold">{formatCurrency(product.price)}</span>
              <span className="text-sm text-muted-foreground">per metre</span>
              <span className="text-sm text-muted-foreground">
                · MOQ {formatNumber(product.moq || 0)} m · {formatNumber(product.stock || 0)} m in stock
              </span>
            </div>

            <div className="mt-5">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Colours</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(product.colors || []).map((color: string) => (
                  <Badge key={color} variant="outline" className="font-normal">
                    {color}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator className="my-6" />

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center rounded-xl border">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Decrease quantity"
                  onClick={() => setQuantity((q: number) => Math.max(product.moq || 100, q - 100))}
                >
                  <Minus className="h-4 w-4" aria-hidden="true" />
                </Button>
                <span className="w-24 text-center text-sm font-medium">
                  {formatNumber(quantity)} m
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Increase quantity"
                  onClick={() => setQuantity((q: number) => q + 100)}
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>

              <Button
                size="lg"
                disabled={outOfStock}
                onClick={() => {
                  add(
                    { id: product.id, name: product.name, price: product.price, image: product.image || '/fabric-cotton.jpg', moq: product.moq || 100 },
                    quantity
                  );
                  toast.success('Added to cart', {
                    description: `${formatNumber(quantity)} m · ${formatCurrency(quantity * product.price)}`,
                  });
                }}
              >
                <ShoppingBag className="h-4 w-4 mr-2" aria-hidden="true" />
                Add to cart
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => compare.toggle(product)}
                aria-pressed={compare.has(product.id)}
              >
                <GitCompareArrows className="h-4 w-4 mr-2" aria-hidden="true" />
                {compare.has(product.id) ? 'In comparison' : 'Compare'}
              </Button>
            </div>

            <p className="mt-3 text-sm text-muted-foreground">
              Line total{' '}
              <span className="font-medium text-foreground">
                {formatCurrency(quantity * product.price)}
              </span>
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Card className="flex-row items-center gap-3 p-4">
                <Truck className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <p className="text-sm">
                  Lead time <span className="font-medium">{product.leadTimeDays || 14} days</span>
                </p>
              </Card>
              <Card className="flex-row items-center gap-3 p-4">
                <ShieldCheck className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <p className="text-sm">Verified mill · spec-checked listing</p>
              </Card>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12">
          <Tabs defaultValue="specs">
            <TabsList>
              <TabsTrigger value="specs">Specifications</TabsTrigger>
              <TabsTrigger value="supplier">Supplier</TabsTrigger>
            </TabsList>
            <TabsContent value="specs" className="mt-4">
              <Card className="p-0">
                <dl className="divide-y">
                  {(product.specifications || []).map((spec: any) => (
                    <div key={spec.label} className="flex items-center justify-between gap-4 px-5 py-3.5">
                      <dt className="text-sm text-muted-foreground">{spec.label}</dt>
                      <dd className="text-sm font-medium">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </Card>
            </TabsContent>
            <TabsContent value="supplier" className="mt-4">
              <Card className="gap-2 p-5">
                <h3 className="text-base font-semibold">{product.supplierName}</h3>
                <p className="text-sm text-muted-foreground">Verified supplier on Texora Marketplace.</p>
                <dl className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Standard MOQ</dt>
                    <dd>{formatNumber(product.moq || 0)} m</dd>
                  </div>
                </dl>
              </Card>
            </TabsContent>
          </Tabs>

          <ProductQA product={product} />
        </div>

        <section className="mt-14">
          <SectionHeading
            eyebrow="AI matched"
            title="Similar fabrics"
            description="Ranked by composition, weight class and price proximity to this listing."
          />
          <div className="mt-6">
            <ProductGrid products={similar} columns={3} />
          </div>
        </section>
      </div>
    </>
  );
}
