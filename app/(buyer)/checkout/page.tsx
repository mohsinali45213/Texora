'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, CheckCircle2, PackageCheck } from 'lucide-react';
import { toast } from 'sonner';
import { StepIndicator } from '@/components/shared/StepIndicator';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/context/cart';
import { formatCurrency, formatNumber } from '@/lib/utils';

const steps = ['Shipping', 'Review', 'Confirmation'];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clear, hydrated } = useCart();
  const [step, setStep] = useState(0);
  const [reference, setReference] = useState('');

  const place = async () => {
    // In a real app, this would be an API call to /api/orders
    const ref = `TX-${Math.floor(1050 + Math.random() * 900)}`;
    setReference(ref);
    setStep(2);
    clear();
    toast.success('Order placed', { description: `Reference ${ref}` });
  };

  if (hydrated && items.length === 0 && step !== 2) {
    return (
      <div className="container-page py-12">
        <EmptyState
          title="Nothing to check out"
          description="Add fabrics to your cart before placing an order."
          actionLabel="Browse marketplace"
          actionTo="/products"
        />
      </div>
    );
  }

  return (
    <div className="container-page max-w-4xl py-8 md:py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Checkout</h1>
      <div className="mt-6">
        <StepIndicator steps={steps} current={step} />
      </div>

      {step === 0 ? (
        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <Card className="gap-5 p-6">
            <h2 className="text-base font-semibold">Shipping details</h2>
            <div className="grid gap-4 sm:grid-cols-2 mt-4">
              <Field id="fullName" label="Full name" defaultValue="Maya Chowdhury" />
              <Field id="company" label="Company" defaultValue="Kite & Loom Apparel" />
              <Field id="email" label="Email" type="email" defaultValue="maya@kiteandloom.com" />
              <Field id="phone" label="Phone" defaultValue="+44 20 7946 1122" />
            </div>
            <div className="mt-4">
              <Field
                id="address"
                label="Address"
                defaultValue="Unit 5, Ashfield Works, 14 Corbet Place"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-3 mt-4">
              <Field id="city" label="City" defaultValue="London" />
              <Field id="postcode" label="Postal code" defaultValue="E1 6NN" />
              <Field id="country" label="Country" defaultValue="United Kingdom" />
            </div>
            <div className="space-y-2 mt-4">
              <Label htmlFor="notes">Notes for suppliers (optional)</Label>
              <Textarea id="notes" rows={3} placeholder="Cutting instructions, labelling, deadlines…" />
            </div>
          </Card>
          <Summary items={items} subtotal={subtotal} />
        </div>
      ) : null}

      {step === 1 ? (
        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <Card className="gap-0 p-0 overflow-hidden">
            <h2 className="px-6 pt-6 text-base font-semibold">Review order</h2>
            <ul className="mt-4 divide-y">
              {items.map((item) => (
                <li key={item.productId} className="flex items-center gap-4 px-6 py-4">
                  <img
                    src={item.image || '/fabric-cotton.jpg'}
                    alt=""
                    loading="lazy"
                    width={112}
                    height={112}
                    className="h-14 w-14 shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatNumber(item.quantity)} m · 14 day lead time
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-medium">{formatCurrency(item.price * item.quantity)}</p>
                </li>
              ))}
            </ul>
          </Card>
          <Summary items={items} subtotal={subtotal} />
        </div>
      ) : null}

      {step === 2 ? (
        <Card className="mt-8 items-center gap-3 p-10 text-center flex flex-col justify-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-success/15 text-success mb-2">
            <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
          </span>
          <h2 className="text-xl font-semibold">Order {reference} placed</h2>
          <p className="max-w-md text-sm text-muted-foreground mt-2">
            Each supplier has been notified and will confirm acceptance shortly. You can follow
            fulfilment stages from your dashboard.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Button onClick={() => router.push('/dashboard')}>
              <PackageCheck className="h-4 w-4 mr-2" aria-hidden="true" />
              Track order
            </Button>
            <Button variant="outline" onClick={() => router.push('/products')}>
              Keep sourcing
            </Button>
          </div>
        </Card>
      ) : null}

      {step < 2 ? (
        <div className="mt-6 flex items-center justify-between gap-3">
          <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
            <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
            Back
          </Button>
          <Button size="lg" onClick={() => (step === 0 ? setStep(1) : place())}>
            {step === 0 ? 'Review order' : 'Place order'}
            <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function Field({
  id,
  label,
  defaultValue,
  type = 'text',
}: {
  id: string;
  label: string;
  defaultValue?: string;
  type?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} defaultValue={defaultValue} />
    </div>
  );
}

function Summary({
  items,
  subtotal,
}: {
  items: any[];
  subtotal: number;
}) {
  return (
    <Card className="h-fit gap-3 p-5">
      <h2 className="text-base font-semibold mb-4">Summary</h2>
      <div className="space-y-2 text-sm">
        <Row label="Line items" value={String(items.length)} />
        <Row
          label="Total metres"
          value={`${formatNumber(items.reduce((sum, l) => sum + l.quantity, 0))} m`}
        />
      </div>
      <Separator className="my-4" />
      <div className="flex items-baseline justify-between mb-4">
        <span className="text-sm text-muted-foreground">Order total</span>
        <span className="text-2xl font-semibold">{formatCurrency(subtotal)}</span>
      </div>
      <p className="text-xs text-muted-foreground">
        Payment is arranged directly with each supplier after confirmation.
      </p>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span>{value}</span>
    </div>
  );
}
