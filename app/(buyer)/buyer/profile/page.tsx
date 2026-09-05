import { redirect } from 'next/navigation';
import { getProfileData } from '@/actions/profile';
import { BuyerProfileForm } from './BuyerProfileForm';

export const metadata = {
  title: 'Profile Settings | Texora',
  description: 'Manage your buyer profile settings',
};

export default async function BuyerProfilePage() {
  const data = await getProfileData();

  if (data.error || !data.user || data.user.role !== 'buyer') {
    redirect('/login');
  }

  return (
    <div className="container-page py-10">
      <div className="mb-8 max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your personal and business profile preferences.
        </p>
      </div>
      
      <div className="max-w-3xl">
        <BuyerProfileForm user={data.user} profile={data.profile} />
      </div>
    </div>
  );
}
