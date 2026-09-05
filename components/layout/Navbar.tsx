'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  ShoppingBag,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { useCart } from '@/context/cart';
import { useAuth } from '@/context/auth';
import { ROUTES } from '@/constants';
import { cn } from '@/lib/utils';

const categories = [
  { slug: 'cotton', name: 'Cotton', count: 4 },
  { slug: 'silk', name: 'Silk', count: 2 },
  { slug: 'linen', name: 'Linen', count: 2 },
  { slug: 'denim', name: 'Denim', count: 2 },
  { slug: 'wool', name: 'Wool & Suiting', count: 2 },
  { slug: 'technical', name: 'Technical', count: 2 },
];

const navLinks = [
  { href: ROUTES.PRODUCTS, label: 'Marketplace' },
  { href: ROUTES.BUYER_DASHBOARD, label: 'Dashboard' },
];

export function Navbar() {
  const { count } = useCart();
  const { user, logout } = useAuth();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b glass">
      <div className="container-page flex h-16 items-center gap-4">
        <Logo />

        <nav className="ml-4 hidden items-center gap-1 md:flex" aria-label="Main">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1">
                Categories
                <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              {categories.map((cat) => (
                <DropdownMenuItem key={cat.slug} asChild>
                  <Link href={ROUTES.CATEGORY(cat.slug)}>
                    <span className="flex-1">{cat.name}</span>
                    <span className="text-xs text-muted-foreground">{cat.count}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {navLinks.map((link) => (
            <Button
              key={link.href}
              variant="ghost"
              size="sm"
              asChild
              className={cn(pathname === link.href && 'bg-secondary')}
            >
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle />

          <Button variant="ghost" size="icon" asChild className="relative rounded-full">
            <Link href={ROUTES.CART} aria-label={`Cart, ${count} items`}>
              <ShoppingBag className="h-4 w-4" aria-hidden="true" />
              {count > 0 ? (
                <Badge className="absolute -right-0.5 -top-0.5 h-4 min-w-4 justify-center rounded-full px-1 text-[10px]">
                  {count}
                </Badge>
              ) : null}
            </Link>
          </Button>

          <div className="hidden md:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  aria-label="Account menu"
                >
                  <User className="h-4 w-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                {user ? (
                  <>
                    <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={user.role === 'supplier' ? ROUTES.SUPPLIER_DASHBOARD : ROUTES.BUYER_DASHBOARD}>
                        <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={user.role === 'supplier' ? ROUTES.SUPPLIER_PROFILE : ROUTES.BUYER_PROFILE}>
                        <Settings className="h-4 w-4" aria-hidden="true" />
                        Profile Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => void logout()}>
                      <LogOut className="h-4 w-4" aria-hidden="true" />
                      Log out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href={ROUTES.LOGIN}>Log in</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={ROUTES.REGISTER}>Register</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {!user && (
            <Button asChild size="sm" className="hidden lg:inline-flex">
              <Link href={ROUTES.REGISTER}>Get started</Link>
            </Button>
          )}

          <MobileMenu />
        </div>
      </div>
    </header>
  );
}

function MobileMenu() {
  const { user, logout } = useAuth();

  return (
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
        className="w-[85vw] sm:max-w-sm"
        aria-describedby={undefined}
      >
        <SheetHeader>
          <SheetTitle>
            <Logo />
          </SheetTitle>
        </SheetHeader>
        <nav className="grid gap-1 px-4" aria-label="Mobile">
          {navLinks.map((link) => (
            <Button key={link.href} variant="ghost" className="justify-start" asChild>
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
          <p className="px-3 pt-4 text-xs uppercase tracking-wider text-muted-foreground">
            Categories
          </p>
          {categories.map((cat) => (
            <Button key={cat.slug} variant="ghost" className="justify-start" asChild>
              <Link href={ROUTES.CATEGORY(cat.slug)}>{cat.name}</Link>
            </Button>
          ))}
          <div className="mt-4 grid gap-2">
            {user ? (
              <Button variant="outline" onClick={() => void logout()}>
                Log out
              </Button>
            ) : (
              <>
                <Button asChild>
                  <Link href={ROUTES.REGISTER}>Create account</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href={ROUTES.LOGIN}>Log in</Link>
                </Button>
              </>
            )}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
