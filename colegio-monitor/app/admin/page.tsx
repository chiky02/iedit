import { verifyAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { FormularioMovimiento } from '@/components/FormularioMovimiento';
import Link from 'next/link';

export default async function AdminPage() {
  const auth = await verifyAuth();

  if (!auth) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isAdmin={true} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Panel de Administración
            </h1>
            <p className="text-gray-600 mt-2">
              Gestiona los movimientos financieros de la institución
            </p>
          </div>
          <Link
            href="/admin/logout"
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
          >
            Cerrar Sesión
          </Link>
        </div>

        {/* Formularios */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FormularioMovimiento tipo="ingreso" />
          <FormularioMovimiento tipo="gasto" />
        </div>

        {/* Link a datos */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-900 font-medium"
          >
            Ver Dashboard Público ↗
          </Link>
        </div>
      </main>
    </div>
  );
}
