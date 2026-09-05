'use client';

import Link from 'next/link';
import { GitCompareArrows, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useCart } from '@/context/cart';
import { useCompare } from '@/context/compare';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants';
import type { Product } from '@/types/product';

export function ProductCard({
  product,
  compact = false,
}: {
  product: Product;
  compact?: boolean;
}) {
  const { add } = useCart();
  const compare = useCompare();

  return (
    <Card className="card-hover group gap-0 overflow-hidden p-0">
      <Link
        href={ROUTES.PRODUCT(product.id)}
        className="relative block aspect-[4/3] overflow-hidden bg-muted"
      >
        <img
          src={product.images?.[0] || product.image || '/fabric-cotton.jpg'}
          alt={product.name}
          loading="lazy"
          width={1024}
          height={768}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <Badge variant="secondary" className="glass border-0 text-xs">
            {product.category}
          </Badge>
          {product.stock === 0 || !product.isAvailable ? (
            <Badge variant="outline" className="glass border-0 text-xs text-muted-foreground">
              Out of Stock
            </Badge>
          ) : (
            <Badge className="border-0 bg-success/90 text-xs text-success-foreground">
              In Stock
            </Badge>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs text-muted-foreground">{product.supplierName}</p>
        <Link
          href={ROUTES.PRODUCT(product.id)}
          className="mt-1 line-clamp-2 text-base font-medium leading-snug hover:text-primary"
        >
          {product.name}
        </Link>

        {!compact ? (
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
        ) : null}

        <div className="mt-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-lg font-semibold">
              {formatCurrency(product.price)}
              <span className="text-xs font-normal text-muted-foreground"> / m</span>
            </p>
            <p className="text-xs text-muted-foreground">MOQ {formatNumber(product.moq)} m</p>
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="icon"
              aria-label={
                compare.has(product.id) ? 'Remove from comparison' : 'Add to comparison'
              }
              className={cn(
                'rounded-full',
                compare.has(product.id) && 'bg-primary/10 text-primary',
              )}
              onClick={() => compare.toggle(product)}
            >
              <GitCompareArrows className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              size="icon"
              aria-label={`Add ${product.name} to cart`}
              disabled={!product.isAvailable || product.stock === 0}
              className="rounded-full"
              onClick={() => {
                add({ id: product.id, name: product.name, price: product.price, image: product.images?.[0] || product.image || '/fabric-cotton.jpg', moq: product.moq }, product.moq);
                toast.success('Added to cart', {
                  description: `${formatNumber(product.moq)} m of ${product.name}`,
                });
              }}
            >
              <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
