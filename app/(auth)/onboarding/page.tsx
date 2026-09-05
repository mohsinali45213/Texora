import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { OnboardingForm } from './OnboardingForm';

export const metadata = { title: 'Setup your profile' };

export default async function OnboardingPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  if (session.user.onboardingCompleted) {
    redirect(session.user.role === 'supplier' ? '/dashboard/supplier' : '/dashboard/buyer');
  }

  return <OnboardingForm role={session.user.role} />;
}
