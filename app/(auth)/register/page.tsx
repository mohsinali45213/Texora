'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, ShoppingBag, Factory, Check } from 'lucide-react';
import { toast } from 'sonner';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Logo } from '@/components/layout/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { registerUser } from '@/actions/auth';

const ROLES = [
  {
    id: 'buyer' as const,
    icon: ShoppingBag,
    title: "I'm buying fabric",
    description: 'Source verified materials from trusted mills.',
  },
  {
    id: 'supplier' as const,
    icon: Factory,
    title: "I'm a supplier",
    description: 'List inventory and reach thousands of buyers.',
  },
];

const registerSchema = z
  .object({
    name: z.string().min(2, 'Full name must be at least 2 characters.'),
    company: z.string().min(2, 'Company name is required.'),
    email: z.string().email('Enter a valid email address.'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters.')
      .regex(/[A-Z]/, 'Include at least one uppercase letter.')
      .regex(/[0-9]/, 'Include at least one number.'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

const STATS = [
  { value: '2,400+', label: 'Verified mills' },
  { value: '48 hrs', label: 'Avg. response time' },
  { value: '₹0', label: 'Free to join' },
];

export default function RegisterPage() {
  const [role, setRole] = useState<'buyer' | 'supplier'>('buyer');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pending, setPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch('password', '');
  const passwordStrength =
    password.length === 0
      ? 0
      : password.length < 8
      ? 1
      : !/[A-Z]/.test(password) || !/[0-9]/.test(password)
      ? 2
      : 3;

  const strengthLabel = ['', 'Weak', 'Fair', 'Strong'];
  const strengthColor = ['', 'bg-destructive', 'bg-warning', 'bg-success'];

  const onSubmit = async (data: RegisterFormValues) => {
    setPending(true);
    setErrorMsg('');

    const formData = new FormData();
    formData.append('role', role);
    formData.append('name', data.name);
    formData.append('company', data.company);
    formData.append('email', data.email);
    formData.append('password', data.password);

    try {
      const result = await registerUser(formData);

      if (result.error) {
        setErrorMsg(result.error);
        toast.error(result.error);
        setPending(false);
        return;
      }

      toast.success('Account created!', { description: 'Setting up your profile…' });

      const signInResult = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (!signInResult?.error) {
        window.location.href = '/onboarding';
      } else {
        window.location.href = '/login';
      }
    } catch {
      setErrorMsg('Something went wrong. Please try again.');
      setPending(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left Panel: Form ─────────────────────────────────────────── */}
      <div className="relative flex-1 flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-16 bg-background overflow-y-auto overflow-x-hidden">
        {/* Ambient blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-20 right-0 h-64 w-64 rounded-full bg-accent/50 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[440px]">
          <Logo />

          <div className="mt-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Create your account
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Join thousands of brands and mills on the Texora network.
            </p>
          </div>

          {/* Role selector */}
          <div className="mt-7 grid grid-cols-2 gap-3">
            {ROLES.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                aria-pressed={role === r.id}
                className={cn(
                  'relative rounded-xl border p-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                  role === r.id
                    ? 'border-primary bg-primary/5 shadow-soft'
                    : 'border-border bg-card hover:border-primary/30 hover:bg-muted/40'
                )}
              >
                {role === r.id && (
                  <span className="absolute right-3 top-3 flex h-4 w-4 items-center justify-center rounded-full bg-primary">
                    <Check className="h-2.5 w-2.5 text-primary-foreground" strokeWidth={3} />
                  </span>
                )}
                <r.icon
                  className={cn('h-5 w-5', role === r.id ? 'text-primary' : 'text-muted-foreground')}
                />
                <p className="mt-2.5 text-sm font-semibold text-foreground">{r.title}</p>
                <p className="mt-1 text-xs text-muted-foreground leading-snug">{r.description}</p>
              </button>
            ))}
          </div>

          {/* Form */}
          <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            {errorMsg && (
              <div
                role="alert"
                className="flex items-start gap-2.5 p-3.5 text-sm text-destructive bg-destructive/8 rounded-lg border border-destructive/20 animate-fade-in"
              >
                <svg className="h-4 w-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  placeholder="Maya Chowdhury"
                  autoComplete="name"
                  className={`h-11 ${errors.name ? 'border-destructive/70' : ''}`}
                  {...register('name')}
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  placeholder="Kite & Loom"
                  autoComplete="organization"
                  className={`h-11 ${errors.company ? 'border-destructive/70' : ''}`}
                  {...register('company')}
                />
                {errors.company && <p className="text-xs text-destructive">{errors.company.message}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Work email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
                className={`h-11 ${errors.email ? 'border-destructive/70' : ''}`}
                {...register('email')}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  className={`h-11 pr-11 ${errors.password ? 'border-destructive/70' : ''}`}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {/* Strength meter */}
              {password.length > 0 && (
                <div className="space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={cn(
                          'h-1 flex-1 rounded-full transition-all duration-300',
                          i <= passwordStrength ? strengthColor[passwordStrength] : 'bg-muted'
                        )}
                      />
                    ))}
                  </div>
                  <p className={cn('text-xs', strengthColor[passwordStrength]?.replace('bg-', 'text-'))}>
                    {strengthLabel[passwordStrength]}
                  </p>
                </div>
              )}
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  className={`h-11 pr-11 ${errors.confirmPassword ? 'border-destructive/70' : ''}`}
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full h-11 font-semibold mt-2"
              disabled={pending}
            >
              {pending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account…
                </>
              ) : (
                'Create account'
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-semibold text-primary hover:underline underline-offset-2"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* ── Right Panel: Brand ───────────────────────────────────────── */}
      <div className="relative hidden lg:flex lg:flex-1 flex-col bg-foreground/5 overflow-hidden">
        <img
          src="/hero-mill.jpg"
          alt="Textile mill"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-foreground/70 via-foreground/40 to-foreground/10" />

        <div className="relative z-10 flex flex-col h-full p-12">
            <div className="flex items-center gap-2.5">
              <img src="/logo/icon.svg" alt="Texora" className="h-8 w-8 drop-shadow-sm" />
              <span className="text-white font-bold text-xl tracking-tight">Texora</span>
            </div>

          <div className="mt-auto">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {STATS.map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-white/20 bg-white/8 backdrop-blur-sm p-4 text-center"
                >
                  <p className="text-2xl font-bold text-white">{s.value}</p>
                  <p className="text-xs text-white/60 mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/8 backdrop-blur-xl p-6 shadow-2xl">
              <p className="text-white/90 text-base font-medium leading-relaxed">
                &ldquo;From inquiry to order confirmation in under 2 hours. Texora is the Stripe of textile sourcing.&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-primary/80 flex items-center justify-center text-white text-sm font-bold">
                  R
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Rahul Sinha</p>
                  <p className="text-white/60 text-xs">Founder, Stitch & Co.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
