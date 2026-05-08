import { logoutAction } from '@/app/actions';
import { redirect } from 'next/navigation';

export async function GET() {
  await logoutAction();
  return redirect('/login');
}
