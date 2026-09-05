'use client';

import { useEffect, useMemo, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Filter, Sparkle } from 'lucide-react';
import { AiSearchBar } from '@/components/ai/AiSearchBar';
import { ProductGrid } from '@/components/product/ProductGrid';
import {
  ProductFilters,
  defaultFilters,
  type FilterState,
} from '@/components/product/ProductFilters';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { aiSearch } from '@/lib/ai-mock';
import type { Product } from '@/types/product';

type SortKey = 'relevance' | 'price-asc' | 'price-desc' | 'moq-asc';

function MarketplaceContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const ai = searchParams.get('ai') === 'true';

  const [query, setQuery] = useState(q);
  const [submitted, setSubmitted] = useState(q);
  const [aiMode, setAiMode] = useState(ai);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [sort, setSort] = useState<SortKey>('relevance');
  const [loading, setLoading] = useState(true);
  const [fetchedProducts, setFetchedProducts] = useState<Product[]>([]);

  useEffect(() => {
    let active = true;
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const url = new URL('/api/products', window.location.origin);
        if (submitted) {
          url.searchParams.set('q', submitted);
          url.searchParams.set('ai', String(aiMode));
        }
        
        const res = await fetch(url.toString());
        if (res.ok) {
          const data = await res.json();
          if (active) {
            setFetchedProducts(data || []);
          }
        }
      } catch (e) {
        console.error('Failed to fetch products', e);
      } finally {
        if (active) setLoading(false);
      }
    };
    
    fetchProducts();
    
    return () => {
      active = false;
    };
  }, [submitted, aiMode]);

  const results = useMemo(() => {
    let list = submitted.trim()
      ? aiMode
        ? aiSearch(submitted, fetchedProducts)
        : fetchedProducts.filter((p) =>
            `${p.name} ${p.category} ${p.fabricType} ${p.supplierName}`
              .toLowerCase()
              .includes(submitted.toLowerCase()),
          )
      : fetchedProducts;

    if (filters.categories.length)
      list = list.filter((p) => filters.categories.includes(p.categorySlug || (p.category || '').toLowerCase()));
    if (filters.fabrics.length) list = list.filter((p) => filters.fabrics.includes(p.fabricType || ''));
    list = list.filter((p) => p.price <= filters.maxPrice);
    if (filters.inStockOnly) list = list.filter((p) => p.isAvailable && p.stock > 0);

    const sorted = [...list];
    if (sort === 'price-asc') sorted.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') sorted.sort((a, b) => b.price - a.price);
    if (sort === 'moq-asc') sorted.sort((a, b) => (a.moq || 0) - (b.moq || 0));
    return sorted;
  }, [submitted, aiMode, filters, sort, fetchedProducts]);

  const runSearch = (value: string) => {
    setSubmitted(value);
    setLoading(true);
  };

  const activeFilterCount =
    filters.categories.length +
    filters.fabrics.length +
    (filters.inStockOnly ? 1 : 0) +
    (filters.maxPrice < 6000 ? 1 : 0);

  return (
    <>
      <div className="border-b bg-muted/30">
        <div className="container-page py-8 md:py-10">
          <h1 className="text-3xl font-semibold tracking-tight">Marketplace</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {fetchedProducts.length * 34} verified listings from mills across 14 countries.
          </p>
          <div className="mt-6 max-w-3xl">
            <AiSearchBar
              value={query}
              onChange={setQuery}
              onSubmit={runSearch}
              aiMode={aiMode}
              onAiModeChange={setAiMode}
            />
          </div>
        </div>
      </div>

      <div className="container-page grid gap-8 py-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:py-10">
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border bg-card p-5">
            <ProductFilters
              value={filters}
              onChange={setFilters}
              onReset={() => setFilters(defaultFilters)}
            />
          </div>
        </aside>

        <div className="min-w-0">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:justify-between">
            <div className="min-w-0">
              {aiMode && submitted ? (
                <p className="flex items-center gap-1.5 text-sm text-primary">
                  <Sparkle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span className="truncate">Interpreted “{submitted}” as a sourcing brief</span>
                </p>
              ) : null}
              <p className="text-sm text-muted-foreground">
                {loading ? 'Searching…' : `${results.length} fabrics`}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden">
                    <Filter className="h-4 w-4 mr-2" aria-hidden="true" />
                    Filters
                    {activeFilterCount ? (
                      <Badge className="ml-1 h-5 min-w-5 justify-center px-1">{activeFilterCount}</Badge>
                    ) : null}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[85vw] overflow-y-auto sm:max-w-sm">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="px-4 pb-8 mt-4">
                    <ProductFilters
                      value={filters}
                      onChange={setFilters}
                      onReset={() => setFilters(defaultFilters)}
                    />
                  </div>
                </SheetContent>
              </Sheet>

              <Select value={sort} onValueChange={(value) => setSort(value as SortKey)}>
                <SelectTrigger className="w-40" aria-label="Sort results">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="price-asc">Price: low to high</SelectItem>
                  <SelectItem value="price-desc">Price: high to low</SelectItem>
                  <SelectItem value="moq-asc">Lowest MOQ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6">
            <ProductGrid
              products={results}
              loading={loading}
              onClearFilters={() => {
                setFilters(defaultFilters);
                setQuery('');
                setSubmitted('');
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={<div className="container-page py-10">Loading marketplace...</div>}>
      <MarketplaceContent />
    </Suspense>
  );
}
