'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import {
  Loader2,
  ArrowRight,
  ArrowLeft,
  Check,
  ShoppingBag,
  Factory,
  Building2,
  Package,
  Layers,
} from 'lucide-react';
import { Logo } from '@/components/layout/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { completeOnboarding } from '@/actions/onboarding';

// ── Zod schemas ────────────────────────────────────────────────────────────

const buyerSchema = z.object({
  role: z.enum(['buyer', 'supplier']).default('buyer'),
  companyName: z.string().min(2, 'Company name is required.'),
  industry: z.string().min(2, 'Please enter your industry.'),
  categoriesOfInterest: z.string().min(2, 'Enter at least one category.'),
  typicalOrderVolume: z.string().optional(),
});

const supplierSchema = z.object({
  role: z.enum(['buyer', 'supplier']).default('supplier'),
  companyName: z.string().min(2, 'Company name is required.'),
  businessType: z.string().min(2, 'Please enter your business type.'),
  primaryCategories: z.string().min(2, 'Enter your primary product categories.'),
  moq: z.string().optional(),
});

// ── Types ──────────────────────────────────────────────────────────────────

interface OnboardingFormProps {
  role: 'buyer' | 'supplier';
}

const BUYER_INDUSTRIES = ['Fashion & Apparel', 'Home Textiles', 'Sportswear', 'Industrial', 'Other'];
const BUYER_CATEGORIES = ['Cotton', 'Silk', 'Linen', 'Polyester', 'Denim', 'Wool', 'Synthetic Blends'];
const SUPPLIER_TYPES = ['Mill / Manufacturer', 'Wholesaler', 'Trader', 'Exporter'];
const SUPPLIER_CATEGORIES = ['Cotton Fabrics', 'Silk & Luxury', 'Denim', 'Technical Fabrics', 'Synthetics'];

// ── Steps definition ───────────────────────────────────────────────────────

const STEPS = {
  buyer: [
    { id: 'details', label: 'Your business' },
    { id: 'review', label: 'Review' },
  ],
  supplier: [
    { id: 'details', label: 'Your business' },
    { id: 'review', label: 'Review' },
  ],
};


// ── Progress indicator ─────────────────────────────────────────────────────

function StepIndicator({ steps, current }: { steps: { label: string }[]; current: number }) {
  return (
    <div className="flex items-center gap-2">
      {steps.map((step, i) => (
        <div key={step.label} className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300',
                i < current
                  ? 'bg-primary text-primary-foreground'
                  : i === current
                  ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {i < current ? <Check className="h-3 w-3" /> : i + 1}
            </div>
            <span
              className={cn(
                'text-xs font-medium hidden sm:block',
                i <= current ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={cn('h-px w-8 transition-all duration-300', i < current ? 'bg-primary' : 'bg-border')} />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Chip selector ──────────────────────────────────────────────────────────

function ChipSelector({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  const selected = value
    ? value
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const toggle = (opt: string) => {
    const next = selected.includes(opt)
      ? selected.filter((s) => s !== opt)
      : [...selected, opt];
    onChange(next.join(', '));
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => toggle(opt)}
          className={cn(
            'px-3 py-1.5 rounded-lg text-sm font-medium border transition-all',
            selected.includes(opt)
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground'
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export function OnboardingForm({ role: initialRole }: OnboardingFormProps) {
  const { update } = useSession();
  const [step, setStep] = useState(0);
  const [role, setRole] = useState<'buyer' | 'supplier'>(initialRole);
  const [pending, setPending] = useState(false);

  // Shared form state (uncontrolled fields managed by react-hook-form per role)
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    categoriesOfInterest: '',
    typicalOrderVolume: '',
    businessType: '',
    primaryCategories: '',
    moq: '',
  });

  const steps = STEPS[role];
  const isFinalStep = step === steps.length - 1;

  const handleNext = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFinalStep) {
      handleNext();
      return;
    }

    setPending(true);

    const fd = new FormData();
    fd.append('role', role);
    fd.append('companyName', formData.companyName);

    if (role === 'buyer') {
      fd.append('industry', formData.industry);
      fd.append('categoriesOfInterest', formData.categoriesOfInterest);
      fd.append('typicalOrderVolume', formData.typicalOrderVolume);
    } else {
      fd.append('businessType', formData.businessType);
      fd.append('primaryCategories', formData.primaryCategories);
      fd.append('moq', formData.moq);
    }

    const result = await completeOnboarding(fd);

    if (result.error) {
      toast.error(result.error);
      setPending(false);
      return;
    }

    toast.success('Profile set up!', { description: 'Taking you to your dashboard…' });

    // ✅ Refresh the JWT token — this fixes the infinite redirect loop
    await update({ onboardingCompleted: true, role });

    window.location.href = role === 'supplier' ? '/dashboard/supplier' : '/dashboard/buyer';
  };

  const updateField = (field: keyof typeof formData) => (value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Ambient blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-accent/40 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <Logo />
        <StepIndicator steps={steps} current={step} />
        <div className="text-xs text-muted-foreground font-medium">
          Step {step + 1} of {steps.length}
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ── Step 0: Details ── */}
            {step === 0 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    Tell us about your business
                  </h1>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    This helps us personalise your {role === 'buyer' ? 'sourcing' : 'selling'} experience.
                  </p>
                </div>


                {/* Company name */}
                <div className="space-y-1.5">
                  <Label htmlFor="companyName">
                    <Building2 className="inline h-3.5 w-3.5 mr-1.5 -mt-0.5 text-muted-foreground" />
                    Company name
                  </Label>
                  <Input
                    id="companyName"
                    placeholder={role === 'buyer' ? 'Kite & Loom Apparel' : 'Sunrise Mills Ltd.'}
                    value={formData.companyName}
                    onChange={(e) => updateField('companyName')(e.target.value)}
                    className="h-11"
                    required
                  />
                </div>

                {role === 'buyer' ? (
                  <>
                    <div className="space-y-1.5">
                      <Label htmlFor="industry">
                        <Layers className="inline h-3.5 w-3.5 mr-1.5 -mt-0.5 text-muted-foreground" />
                        Industry
                      </Label>
                      <Input
                        id="industry"
                        placeholder="e.g. Fashion & Apparel"
                        value={formData.industry}
                        onChange={(e) => updateField('industry')(e.target.value)}
                        className="h-11"
                        required
                      />
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {BUYER_INDUSTRIES.map((ind) => (
                          <button
                            type="button"
                            key={ind}
                            onClick={() => updateField('industry')(ind)}
                            className={cn(
                              'px-2.5 py-1 rounded-md text-xs border transition-all',
                              formData.industry === ind
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-border text-muted-foreground hover:border-primary/30'
                            )}
                          >
                            {ind}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>
                        <Package className="inline h-3.5 w-3.5 mr-1.5 -mt-0.5 text-muted-foreground" />
                        Categories of interest
                      </Label>
                      <ChipSelector
                        options={BUYER_CATEGORIES}
                        value={formData.categoriesOfInterest}
                        onChange={updateField('categoriesOfInterest')}
                      />
                      <p className="text-xs text-muted-foreground">Select all that apply</p>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="orderVolume">
                        Typical order volume{' '}
                        <span className="text-muted-foreground font-normal">(optional)</span>
                      </Label>
                      <Input
                        id="orderVolume"
                        placeholder="e.g. 500–2000 metres per order"
                        value={formData.typicalOrderVolume}
                        onChange={(e) => updateField('typicalOrderVolume')(e.target.value)}
                        className="h-11"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1.5">
                      <Label htmlFor="businessType">Business type</Label>
                      <Input
                        id="businessType"
                        placeholder="e.g. Manufacturer, Wholesaler"
                        value={formData.businessType}
                        onChange={(e) => updateField('businessType')(e.target.value)}
                        className="h-11"
                        required
                      />
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {SUPPLIER_TYPES.map((t) => (
                          <button
                            type="button"
                            key={t}
                            onClick={() => updateField('businessType')(t)}
                            className={cn(
                              'px-2.5 py-1 rounded-md text-xs border transition-all',
                              formData.businessType === t
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-border text-muted-foreground hover:border-primary/30'
                            )}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Primary product categories</Label>
                      <ChipSelector
                        options={SUPPLIER_CATEGORIES}
                        value={formData.primaryCategories}
                        onChange={updateField('primaryCategories')}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="moq">
                        Minimum Order Quantity (metres){' '}
                        <span className="text-muted-foreground font-normal">(optional)</span>
                      </Label>
                      <Input
                        id="moq"
                        type="number"
                        min="0"
                        placeholder="e.g. 100"
                        value={formData.moq}
                        onChange={(e) => updateField('moq')(e.target.value)}
                        className="h-11"
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ── Step 1: Review ── */}
            {step === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    Review your details
                  </h1>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    Confirm everything looks right before finishing.
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
                  <div className="flex items-center gap-3 pb-4 border-b border-border">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      {role === 'buyer' ? (
                        <ShoppingBag className="h-5 w-5 text-primary" />
                      ) : (
                        <Factory className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground capitalize">{role}</p>
                      <p className="text-xs text-muted-foreground">Account type</p>
                    </div>
                  </div>

                  {[
                    { label: 'Company', value: formData.companyName },
                    ...(role === 'buyer'
                      ? [
                          { label: 'Industry', value: formData.industry },
                          { label: 'Categories', value: formData.categoriesOfInterest },
                          ...(formData.typicalOrderVolume
                            ? [{ label: 'Order volume', value: formData.typicalOrderVolume }]
                            : []),
                        ]
                      : [
                          { label: 'Business type', value: formData.businessType },
                          { label: 'Categories', value: formData.primaryCategories },
                          ...(formData.moq ? [{ label: 'MOQ', value: `${formData.moq} m` }] : []),
                        ]),
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-start gap-4">
                      <span className="text-sm text-muted-foreground shrink-0">{label}</span>
                      <span className="text-sm font-medium text-foreground text-right">{value || '—'}</span>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  You can update these details anytime in your profile settings.
                </p>
              </div>
            )}

            {/* ── Navigation ── */}
            <div className="flex items-center gap-3 pt-2">
              {step > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="h-11 px-5"
                  disabled={pending}
                >
                  <ArrowLeft className="h-4 w-4 mr-1.5" />
                  Back
                </Button>
              )}
              <Button
                type="submit"
                className="h-11 flex-1 font-semibold gap-1.5"
                disabled={pending || (step === 0 && !formData.companyName.trim())}
              >
                {pending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Setting up…
                  </>
                ) : isFinalStep ? (
                  <>
                    <Check className="h-4 w-4" />
                    Finish setup
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
