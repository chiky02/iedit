'use client';

import { useState } from 'react';
import { loginAction } from '@/app/actions';
import { useRouter } from 'next/navigation';

export function FormularioLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const result = await loginAction(email, password);
      if (result.error) {
        setError(result.error);
      } else {
        router.push('/admin');
        router.refresh();
      }
    } catch (err) {
      setError('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f8f1] py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md rounded-[32px] border border-[#dfe9db] bg-white p-8 shadow-lg">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[#276749]">Ingreso administrador</p>
          <h2 className="mt-4 text-3xl font-bold text-slate-900">Accede al panel privado</h2>
          <p className="mt-2 text-sm text-slate-600">Solo cuentas administrativas pueden gestionar noticias, roles y sugerencias.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="text-sm font-medium text-slate-700">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none"
                placeholder="admin@colegio.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="text-sm font-medium text-slate-700">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none"
                placeholder="Contraseña"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-3xl bg-[#276749] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1f4f37] disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {loading ? 'Enviando...' : 'Iniciar sesión'}
          </button>
        </form>

        <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-center text-sm text-slate-600">
          <p className="font-medium text-slate-900">Credenciales de prueba</p>
          <p>Email: admin@colegio.com</p>
          <p>Contraseña: admin123</p>
        </div>
      </div>
    </div>
  );
}
