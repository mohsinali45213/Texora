'use client';

import Link from 'next/link';
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart } from '@/context/cart';
import { formatCurrency, formatNumber } from '@/lib/utils';

export default function CartPage() {
  const { items, subtotal, update, remove, hydrated } = useCart();

  return (
    <div className="container-page py-8 md:py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Cart</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Quantities are in metres and must meet each supplier&apos;s minimum order quantity.
      </p>

      {!hydrated ? (
        <div className="mt-8 space-y-4">
          {[0, 1].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          className="mt-8"
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Browse the marketplace and add fabrics to build your order."
          actionLabel="Browse marketplace"
          actionTo="/products"
        />
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <ul className="space-y-4">
            {items.map((item) => (
              <li key={item.productId}>
                <Card className="gap-4 p-4 sm:flex-row sm:items-center">
                  <Link
                    href={`/products/${item.productId}`}
                    className="shrink-0 overflow-hidden rounded-xl block"
                  >
                    <img
                      src={item.image || '/fabric-cotton.jpg'}
                      alt={item.name}
                      loading="lazy"
                      width={160}
                      height={160}
                      className="h-24 w-full object-cover sm:w-24"
                    />
                  </Link>

                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/products/${item.productId}`}
                      className="line-clamp-2 font-medium hover:text-primary"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatCurrency(item.price)}/m · MOQ{' '}
                      {formatNumber(item.moq || 0)} m
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <div className="flex items-center rounded-xl border">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Decrease quantity of ${item.name}`}
                          onClick={() => update(item.productId, Math.max(item.moq || 100, item.quantity - 100))}
                        >
                          <Minus className="h-4 w-4" aria-hidden="true" />
                        </Button>
                        <span className="w-24 text-center text-sm font-medium">
                          {formatNumber(item.quantity)} m
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Increase quantity of ${item.name}`}
                          onClick={() => update(item.productId, item.quantity + 100)}
                        >
                          <Plus className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground"
                        onClick={() => {
                          remove(item.productId);
                          toast('Removed from cart', { description: item.name });
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" aria-hidden="true" />
                        Remove
                      </Button>
                    </div>
                  </div>

                  <p className="shrink-0 text-right text-lg font-semibold mt-4 sm:mt-0">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </Card>
              </li>
            ))}
          </ul>

          <aside>
            <Card className="sticky top-24 gap-4 p-5">
              <h2 className="text-base font-semibold">Order summary</h2>
              <div className="space-y-2 text-sm mt-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Line items</span>
                  <span>{items.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total metres</span>
                  <span>{formatNumber(items.reduce((sum, l) => sum + l.quantity, 0))} m</span>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="flex items-baseline justify-between mb-6">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="text-2xl font-semibold">{formatCurrency(subtotal)}</span>
              </div>
              <Button size="lg" className="w-full mb-2" asChild>
                <Link href="/checkout">
                  Proceed to checkout <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
                </Link>
              </Button>
              <Button variant="ghost" className="w-full" asChild>
                <Link href="/products">Continue browsing</Link>
              </Button>
            </Card>
          </aside>
        </div>
      )}
    </div>
  );
}
