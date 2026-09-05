import { redirect } from 'next/navigation';
import { auth } from '@/auth';

export default async function DashboardRedirect() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  if (session.user.role === 'supplier') {
    redirect('/dashboard/supplier');
  } else {
    redirect('/dashboard/buyer');
  }
}
