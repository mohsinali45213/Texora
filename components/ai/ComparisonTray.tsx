'use client';

import { GitCompareArrows, Sparkle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useCompare } from '@/context/compare';
import { aiCompare } from '@/lib/ai-mock';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { useEffect, useState } from 'react';

export function ComparisonTray() {
  const { items, remove, clear, open, setOpen } = useCompare();
  const [compareResult, setCompareResult] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && items.length > 0) {
      const fetchCompare = async () => {
        setLoading(true);
        try {
          const res = await fetch('/api/ai/compare', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ products: items }),
          });
          if (res.ok) {
            const data = await res.json();
            setCompareResult(data.summary);
          } else {
            setCompareResult(aiCompare(items));
          }
        } catch (e) {
          setCompareResult(aiCompare(items));
        } finally {
          setLoading(false);
        }
      };
      fetchCompare();
    }
  }, [open, items]);

  if (items.length === 0) return null;

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-30 px-4 pb-4">
        <div className="glass mx-auto flex max-w-3xl items-center gap-3 rounded-2xl border p-2.5 shadow-lift">
          <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto">
            {items.map((item) => (
              <span
                key={item.id}
                className="flex shrink-0 items-center gap-2 rounded-xl border bg-background px-2 py-1.5"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  width={32}
                  height={32}
                  className="h-7 w-7 rounded-md object-cover"
                />
                <span className="max-w-32 truncate text-xs">{item.name}</span>
                <button
                  onClick={() => remove(item.id)}
                  aria-label={`Remove ${item.name} from comparison`}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </span>
            ))}
          </div>
          <Button variant="ghost" size="sm" onClick={clear} className="hidden sm:inline-flex">
            Clear
          </Button>
          <Button size="sm" onClick={() => setOpen(true)} disabled={items.length < 2}>
            <GitCompareArrows className="h-4 w-4 mr-2" aria-hidden="true" />
            Compare
          </Button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Fabric comparison</DialogTitle>
            <DialogDescription>
              Side-by-side specifications with an AI summary of the trade-offs.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-xl border bg-primary/5 p-4 mt-4">
            <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-primary">
              <Sparkle className="h-3.5 w-3.5" aria-hidden="true" /> AI summary
            </p>
            <p className="mt-2 text-sm leading-relaxed">
              {loading ? 'Analyzing products...' : compareResult}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-4">
            {items.map((item) => (
              <div key={item.id} className="rounded-xl border p-3">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  width={400}
                  height={300}
                  className="aspect-[4/3] w-full rounded-lg object-cover"
                />
                <p className="mt-3 line-clamp-2 text-sm font-medium">{item.name}</p>
                <Badge variant="secondary" className="mt-2 text-xs">
                  {item.fabricType}
                </Badge>
                <dl className="mt-3 space-y-1.5 text-xs">
                  <Row label="Price / m" value={formatCurrency(item.price)} />
                  <Row label="MOQ" value={`${formatNumber(item.moq || 0)} m`} />
                  <Row label="Stock" value={`${formatNumber(item.stock)} m`} />
                  <Row label="Lead time" value={`${item.leadTimeDays} days`} />
                  <Row label="Supplier" value={item.supplierName} />
                  {item.specifications?.slice(0, 3).map((spec) => (
                    <Row key={spec.label} label={spec.label} value={spec.value} />
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}
