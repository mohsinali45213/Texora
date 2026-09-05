import NextAuth, { type DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: 'buyer' | 'supplier';
      onboardingCompleted: boolean;
      isGoogleUser?: boolean;
    } & DefaultSession['user'];
  }

  interface User {
    role: 'buyer' | 'supplier';
    onboardingCompleted: boolean;
    isGoogleUser?: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'buyer' | 'supplier';
    onboardingCompleted: boolean;
    isGoogleUser?: boolean;
  }
}
