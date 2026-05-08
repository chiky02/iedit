'use client';

import { useState } from 'react';

type Role = {
  id: string;
  nombre: string;
  descripcion: string | null;
  permissions: { permission: { slug: string; descripcion: string | null } }[];
};

type Permission = {
  slug: string;
  descripcion: string | null;
};

interface RolesSectionProps {
  roles: Role[];
  permissions: Permission[];
  isPending: boolean;
  onSubmit: (form: any) => void;
  onDelete: (id: string) => void;
}

export function RolesSection({ roles, permissions, isPending, onSubmit, onDelete }: RolesSectionProps) {
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    permissions: [] as string[],
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(form);
  };

  const handleReset = () => {
    setForm({ nombre: '', descripcion: '', permissions: [] });
  };

  return (
    <section className="rounded-3xl border border-[#dfe9db] bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Roles</h2>
      <p className="mt-2 text-sm text-slate-600">Define permisos en estilo CRUD para usuarios y noticias.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Nombre del rol</label>
          <input
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none"
            placeholder="Editor, Coordinador, etc."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Descripción</label>
          <input
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none"
            placeholder="Describe el alcance del rol"
          />
        </div>

        <div>
          <p className="mb-3 text-sm font-medium text-slate-700">Permisos</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {permissions.map((permission) => (
              <label key={permission.slug} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800">
                <input
                  type="checkbox"
                  checked={form.permissions.includes(permission.slug)}
                  onChange={(e) => {
                    const next = e.target.checked
                      ? [...form.permissions, permission.slug]
                      : form.permissions.filter((item) => item !== permission.slug);
                    setForm({ ...form, permissions: next });
                  }}
                  className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                {permission.slug}
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="mt-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          Crear rol
        </button>
      </form>

      <div className="mt-6 space-y-3">
        {roles.map((role) => (
          <div key={role.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-slate-900">{role.nombre}</p>
                <p className="text-sm text-slate-600">{role.descripcion || 'Sin descripción'}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onDelete(role.id)}
                  className="rounded-2xl border border-rose-600 bg-white px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
                >
                  Eliminar rol
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
