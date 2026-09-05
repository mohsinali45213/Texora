'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { CartItem } from '@/types';

const STORAGE_KEY = 'texora.cart.v2';

// Rich cart item stored in localStorage — no mock-data needed
export interface RichCartItem {
  productId: string;
  quantity: number;
  name: string;
  price: number;
  image: string;
  moq: number;
}

interface CartContextValue {
  items: RichCartItem[];
  count: number;
  subtotal: number;
  add: (product: { id: string; name: string; price: number; image: string; moq: number }, quantity: number) => void;
  update: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  hydrated: boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<RichCartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      setItems(raw ? (JSON.parse(raw) as RichCartItem[]) : []);
    } catch {
      setItems([]);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const value = useMemo<CartContextValue>(() => {
    return {
      items,
      hydrated,
      count: items.length,
      subtotal: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      add: (product, quantity) =>
        setItems((prev) => {
          const existing = prev.find((i) => i.productId === product.id);
          if (existing) {
            return prev.map((i) =>
              i.productId === product.id ? { ...i, quantity: i.quantity + quantity } : i,
            );
          }
          return [
            ...prev,
            {
              productId: product.id,
              quantity,
              name: product.name,
              price: product.price,
              image: product.image,
              moq: product.moq,
            },
          ];
        }),
      update: (productId, quantity) =>
        setItems((prev) =>
          prev.map((i) => (i.productId === productId ? { ...i, quantity: Math.max(1, quantity) } : i)),
        ),
      remove: (productId) => setItems((prev) => prev.filter((i) => i.productId !== productId)),
      clear: () => setItems([]),
    };
  }, [items, hydrated]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
