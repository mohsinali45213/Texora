import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { AuthService } from '@/services/auth.service';
import { authConfig } from './auth.config';

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const authService = new AuthService();
        const user = await authService.validateCredentials(
          credentials.email as string,
          credentials.password as string
        );

        return user || null;
      },
    }),
  ],
});

