import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  providers: [],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === 'update' && session) {
        if (session.onboardingCompleted !== undefined) {
          token.onboardingCompleted = session.onboardingCompleted;
        }
        if (session.role !== undefined) {
          token.role = session.role;
        }
      }
      if (user) {
        token.id = user.id as string;
        token.role = (user as any).role;
        token.onboardingCompleted = (user as any).onboardingCompleted ?? false;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as 'buyer' | 'supplier';
        session.user.onboardingCompleted = token.onboardingCompleted as boolean;
      }
      return session;
    },
  },
  pages: { signIn: '/login' },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
} satisfies NextAuthConfig;
