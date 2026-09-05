'use client';

import { useSession, signOut } from 'next-auth/react';
import { createContext, useContext, ReactNode } from 'react';
import type { User } from '@/types/user';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();

  const logout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <AuthContext.Provider
      value={{
        user: (session?.user as User) || null,
        isLoading: status === 'loading',
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
