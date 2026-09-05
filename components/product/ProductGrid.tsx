'use client';

import { ProductCard } from './ProductCard';
import { ProductGridSkeleton } from './ProductCardSkeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { SearchX } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Product } from '@/types/product';

export function ProductGrid({
  products,
  loading = false,
  columns = 4,
  emptyTitle = 'No products match your filters',
  emptyDescription = 'Try widening your price range or clearing a filter to see more fabrics.',
  onClearFilters,
}: {
  products: Product[];
  loading?: boolean;
  columns?: 3 | 4;
  emptyTitle?: string;
  emptyDescription?: string;
  onClearFilters?: () => void;
}) {
  if (loading) return <ProductGridSkeleton count={columns === 3 ? 6 : 8} />;

  if (products.length === 0) {
    return (
      <EmptyState
        icon={SearchX}
        title={emptyTitle}
        description={emptyDescription}
        actionLabel={onClearFilters ? 'Clear filters' : undefined}
        onAction={onClearFilters}
      />
    );
  }

  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6',
        columns === 4 ? 'lg:grid-cols-3 xl:grid-cols-4' : 'lg:grid-cols-3',
      )}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
