import type { LucideIcon } from 'lucide-react';
import { PackageOpen } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function EmptyState({
  icon: Icon = PackageOpen,
  title,
  description,
  actionLabel,
  actionTo,
  onAction,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionTo?: string;
  onAction?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/30 px-6 py-14 text-center',
        className,
      )}
    >
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-background text-muted-foreground shadow-soft">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <h3 className="mt-4 text-base font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      {actionLabel && actionTo ? (
        <Button asChild className="mt-5">
          <Link href={actionTo}>{actionLabel}</Link>
        </Button>
      ) : null}
      {actionLabel && onAction ? (
        <Button className="mt-5" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
