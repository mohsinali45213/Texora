import { redirect } from 'next/navigation';
import { getProfileData } from '@/actions/profile';
import { SupplierProfileForm } from './SupplierProfileForm';

export const metadata = {
  title: 'Supplier Profile Settings | Texora',
  description: 'Manage your supplier profile settings',
};

export default async function SupplierProfilePage() {
  const data = await getProfileData();

  if (data.error || !data.user || data.user.role !== 'supplier') {
    redirect('/login');
  }

  return (
    <div className="container-page py-10">
      <div className="mb-8 max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight">Supplier Profile</h1>
        <p className="text-muted-foreground mt-2">
          Manage your business profile, contact details, and supply capabilities.
        </p>
      </div>
      
      <div className="max-w-3xl">
        <SupplierProfileForm user={data.user} profile={data.profile} />
      </div>
    </div>
  );
}
