import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Account',
    template: '%s | Texora',
  },
};

// Passthrough layout — each auth page manages its own full-screen layout.
// (Auth layout previously constrained pages to max-w-md, breaking split-screen designs.)
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
