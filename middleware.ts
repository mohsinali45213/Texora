import { NextResponse } from 'next/server';
import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config';

const { auth } = NextAuth(authConfig);

// Auth pages — authenticated users should be redirected away from these
const AUTH_PAGES = ['/login', '/register'];

// Routes that require authentication
const PROTECTED_PREFIXES = [
  '/dashboard',
  '/supplier',
  '/orders',
  '/cart',
  '/checkout',
  '/onboarding',
];

export default auth((req) => {
  const { pathname } = req.nextUrl;

  const isAuthenticated = !!req.auth;
  const isOnboarding = pathname === '/onboarding';
  const isAuthPage = AUTH_PAGES.some((p) => pathname.startsWith(p));
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));

  // ── Unauthenticated ────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    if (isProtected) {
      const url = new URL('/login', req.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // ── Authenticated ──────────────────────────────────────────────────────────
  const user = req.auth?.user;
  
  // Use Boolean() to ensure truthy values (like "true") are properly treated as true,
  // preventing a redirect mismatch loop between middleware and server components
  const onboarded = Boolean(user?.onboardingCompleted);
  const role = user?.role;

  // Redirect away from login/register — they're already signed in
  if (isAuthPage) {
    const dest = onboarded
      ? role === 'supplier'
        ? '/dashboard/supplier'
        : '/dashboard/buyer'
      : '/onboarding';
    return NextResponse.redirect(new URL(dest, req.url));
  }

  // Force onboarding for users who haven't completed it
  if (!onboarded && isProtected && !isOnboarding) {
    return NextResponse.redirect(new URL('/onboarding', req.url));
  }

  // Keep onboarded users out of the onboarding page
  if (onboarded && isOnboarding) {
    const dest = role === 'supplier' ? '/dashboard/supplier' : '/dashboard/buyer';
    return NextResponse.redirect(new URL(dest, req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all paths EXCEPT:
     * - /api/* (NextAuth and other API routes)
     * - /_next/static, /_next/image
     * - /favicon.ico, /robots.txt, /sitemap.xml
     * - Static file extensions
     */
    '/((?!api|_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)',
  ],
};
