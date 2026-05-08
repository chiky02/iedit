import { redirect } from 'next/navigation';
import { AdminPanel } from '@/components/AdminPanel';
import { getAdminData } from '@/app/actions';
import { verifyAuth } from '@/lib/auth';

export default async function AdminPage() {
  const auth = await verifyAuth();
  if (!auth) {
    redirect('/login');
  }

  const adminData = await getAdminData();

  return <AdminPanel {...adminData} />;
}
