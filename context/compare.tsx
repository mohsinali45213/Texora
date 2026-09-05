'use client';

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Product } from '@/types/product';

interface CompareContextValue {
  ids: string[];
  items: Product[];
  toggle: (product: Product) => void;
  remove: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const CompareContext = createContext<CompareContextValue | null>(null);

export function CompareProvider({ children }: { children: ReactNode }) {
  // Store full product objects — no mock-data lookup needed
  const [items, setItems] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);

  const value = useMemo<CompareContextValue>(
    () => ({
      ids: items.map((p) => p.id),
      open,
      setOpen,
      items,
      has: (id) => items.some((p) => p.id === id),
      toggle: (product) =>
        setItems((prev) =>
          prev.some((p) => p.id === product.id)
            ? prev.filter((p) => p.id !== product.id)
            : prev.length >= 3
            ? prev
            : [...prev, product],
        ),
      remove: (id) => setItems((prev) => prev.filter((p) => p.id !== id)),
      clear: () => setItems([]),
    }),
    [items, open],
  );

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be used within CompareProvider');
  return ctx;
}
