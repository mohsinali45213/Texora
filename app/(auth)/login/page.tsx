'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Logo } from '@/components/layout/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
  rememberMe: z.boolean().default(false),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const TESTIMONIAL = {
  quote:
    'Texora fundamentally changed how we source. We eliminated weeks of back-and-forth emails, and the MOQ-aware pricing is a game-changer.',
  name: 'Maya Chowdhury',
  title: 'Head of Sourcing, Kite & Loom Apparel',
};

const FEATURES = [
  { label: '10,000+ verified fabric SKUs' },
  { label: 'AI-powered sourcing assistant' },
  { label: 'Real-time inventory & pricing' },
];

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  const rememberMe = watch('rememberMe');

  const onSubmit = async (data: LoginFormValues) => {
    setPending(true);
    setErrorMsg('');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        setErrorMsg('Invalid email or password. Please try again.');
        toast.error('Login failed');
        setPending(false);
      } else {
        toast.success('Welcome back!');
        // Hard navigate so middleware re-reads the session and routes correctly
        window.location.href = '/dashboard';
      }
    } catch {
      setErrorMsg('Something went wrong. Please try again.');
      setPending(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left Panel: Form ─────────────────────────────────────────── */}
      <div className="relative flex-1 flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-16 bg-background overflow-hidden">
        {/* Ambient gradient blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-accent/50 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[420px]">
          {/* Logo */}
          <Logo />

          {/* Heading */}
          <div className="mt-10">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to your Texora account to continue sourcing.
            </p>
          </div>

          {/* Credentials Form */}
          <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
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

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                className={`h-11 transition-shadow ${errors.email ? 'border-destructive/70 focus-visible:ring-destructive/30' : ''}`}
                {...register('email')}
              />
              {errors.email && (
                <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Link
                  href="#"
                  className="text-xs font-medium text-primary hover:underline underline-offset-2 transition-all"
                  tabIndex={0}
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Your password"
                  className={`h-11 pr-11 transition-shadow ${errors.password ? 'border-destructive/70 focus-visible:ring-destructive/30' : ''}`}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive mt-1">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="rememberMe"
                checked={rememberMe}
                onCheckedChange={(checked) => setValue('rememberMe', !!checked)}
                className="rounded"
              />
              <Label htmlFor="rememberMe" className="text-sm text-muted-foreground cursor-pointer select-none">
                Remember me for 30 days
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full h-11 font-semibold gap-1.5 transition-all"
              disabled={pending}
            >
              {pending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            New to Texora?{' '}
            <Link
              href="/register"
              className="font-semibold text-primary hover:underline underline-offset-2 transition-all"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>

      {/* ── Right Panel: Brand ───────────────────────────────────────── */}
      <div className="relative hidden lg:flex lg:flex-1 flex-col bg-foreground/5 overflow-hidden">
        {/* Hero image */}
        <img
          src="/hero-mill.jpg"
          alt="Premium textile mill with rolls of fabric"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-foreground/70 via-foreground/40 to-foreground/10" />

        {/* Top branding */}
        <div className="relative z-10 flex flex-col h-full p-12">
            <div className="flex items-center gap-2.5">
              <img src="/logo/icon.svg" alt="Texora" className="h-8 w-8 drop-shadow-sm" />
              <span className="text-white font-bold text-xl tracking-tight">Texora</span>
            </div>

          {/* Feature pills */}
          <div className="mt-auto">
            <div className="flex flex-wrap gap-2 mb-8">
              {FEATURES.map((f) => (
                <span
                  key={f.label}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-medium"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {f.label}
                </span>
              ))}
            </div>

            {/* Testimonial card */}
            <div className="rounded-2xl border border-white/20 bg-white/8 backdrop-blur-xl p-6 shadow-2xl">
              <p className="text-white/90 text-base font-medium leading-relaxed">
                &ldquo;{TESTIMONIAL.quote}&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-primary/80 flex items-center justify-center text-white text-sm font-bold">
                  {TESTIMONIAL.name[0]}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{TESTIMONIAL.name}</p>
                  <p className="text-white/60 text-xs">{TESTIMONIAL.title}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
