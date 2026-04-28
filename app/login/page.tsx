import { verifyAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { FormularioLogin } from '@/components/FormularioLogin';

export default async function LoginPage() {
  const auth = await verifyAuth();

  if (auth) {
    redirect('/admin');
  }

  return <FormularioLogin />;
}
