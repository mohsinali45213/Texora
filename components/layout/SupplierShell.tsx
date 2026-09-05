'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Boxes, LayoutDashboard, LogOut, Menu, Receipt, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '@/context/auth';
import { ROUTES } from '@/constants';
import { cn } from '@/lib/utils';

const navItems = [
  { href: ROUTES.SUPPLIER_DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  { href: ROUTES.SUPPLIER_PRODUCTS, label: 'Products', icon: Boxes },
  { href: ROUTES.SUPPLIER_ORDERS, label: 'Orders', icon: Receipt },
  { href: ROUTES.SUPPLIER_PROFILE, label: 'Profile', icon: Store },
];

export function SupplierShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b glass">
        <div className="container-page flex h-16 items-center gap-4">
          <Logo href={ROUTES.SUPPLIER_DASHBOARD} />
          <Badge variant="secondary" className="hidden shrink-0 sm:inline-flex">
            Supplier
          </Badge>

          <nav className="ml-4 hidden items-center gap-1 md:flex" aria-label="Supplier">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                size="sm"
                asChild
                className={cn(pathname === item.href && 'bg-secondary')}
              >
                <Link href={item.href}>
                  <item.icon className="h-4 w-4" aria-hidden="true" />
                  {item.label}
                </Link>
              </Button>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1">
            <ThemeToggle />
            {user && (
              <span className="hidden text-sm text-muted-foreground lg:inline">
                {user.name}
              </span>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              aria-label="Log out"
              onClick={() => void logout()}
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[80vw] sm:max-w-sm"
                aria-describedby={undefined}
              >
                <SheetHeader>
                  <SheetTitle>
                    <Logo href={ROUTES.SUPPLIER_DASHBOARD} />
                  </SheetTitle>
                </SheetHeader>
                <nav className="grid gap-1 px-4" aria-label="Supplier mobile">
                  {navItems.map((item) => (
                    <Button key={item.href} variant="ghost" className="justify-start" asChild>
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" aria-hidden="true" />
                        {item.label}
                      </Link>
                    </Button>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <main className="container-page flex-1 py-8 md:py-10">{children}</main>
    </div>
  );
}
