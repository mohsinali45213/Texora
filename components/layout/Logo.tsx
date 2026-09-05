import Link from 'next/link';
import { ROUTES } from '@/constants';

export function Logo({ href = ROUTES.HOME }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2.5 font-bold tracking-tight text-foreground group transition-opacity hover:opacity-90">
      <img src="/logo/icon.svg" alt="Texora" className="h-8 w-8 drop-shadow-sm transition-transform group-hover:scale-105" />
      <span className="hidden sm:block text-xl tracking-tight">Texora</span>
    </Link>
  );
}
