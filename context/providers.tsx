'use client';

import { ThemeProvider } from 'next-themes';
import { SessionProvider } from 'next-auth/react';
import { CartProvider } from './cart';
import { CompareProvider } from './compare';
import { AuthProvider } from './auth';
import { Toaster } from '@/components/ui/sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <SessionProvider>
        <AuthProvider>
          <CartProvider>
            <CompareProvider>
              {children}
              <Toaster position="top-right" richColors closeButton />
            </CompareProvider>
          </CartProvider>
        </AuthProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
