import { SupplierShell } from '@/components/layout/SupplierShell';

export default function SupplierLayout({ children }: { children: React.ReactNode }) {
  return <SupplierShell>{children}</SupplierShell>;
}
