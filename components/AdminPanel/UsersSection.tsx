'use client';

import { useState } from 'react';

type User = {
  id: string;
  nombre: string;
  email: string;
  isActive: boolean;
  role: { id: string; nombre: string };
};

type Role = {
  id: string;
  nombre: string;
  descripcion: string | null;
  permissions: { permission: { slug: string; descripcion: string | null } }[];
};

interface UsersSectionProps {
  users: User[];
  roles: Role[];
  isPending: boolean;
  onSubmit: (form: any) => void;
  onDelete: (id: string) => void;
  onEdit: (item: User) => void;
}

export function UsersSection({ users, roles, isPending, onSubmit, onDelete, onEdit }: UsersSectionProps) {
  const [form, setForm] = useState({
    id: '',
    nombre: '',
    email: '',
    password: '',
    roleId: roles[0]?.id || '',
    isActive: true,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(form);
  };

  const handleReset = () => {
    setForm({
      id: '',
      nombre: '',
      email: '',
      password: '',
      roleId: roles[0]?.id || '',
      isActive: true,
    });
  };

  return (
    <section className="rounded-3xl border border-[#dfe9db] bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Usuarios</h2>
      <p className="mt-2 text-sm text-slate-600">Administra el acceso y roles de los usuarios.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700">Nombre</label>
            <input
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none"
              placeholder="Nombre completo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              type="email"
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none"
              placeholder="usuario@colegio.com"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700">Contraseña</label>
            <input
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              type="password"
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none"
              placeholder={form.id ? 'Dejar vacío para mantener la actual' : 'Contraseña segura'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Rol</label>
            <select
              value={form.roleId}
              onChange={(e) => setForm({ ...form, roleId: e.target.value })}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none"
            >
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />
          Usuario activo
        </label>

        <div className="flex flex-wrap gap-3">
          {form.id && (
            <button
              type="button"
              onClick={handleReset}
              className="rounded-2xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-200"
            >
              Cancelar edición
            </button>
          )}
          <button
            type="submit"
            disabled={isPending}
            className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {form.id ? 'Actualizar usuario' : 'Crear usuario'}
          </button>
        </div>
      </form>

      <div className="mt-6 space-y-3">
        {users.map((user) => (
          <div key={user.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-slate-900">{user.nombre}</p>
                <p className="text-sm text-slate-600">{user.email} • {user.role.nombre}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onEdit(user)}
                  className="rounded-2xl border border-emerald-600 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(user.id)}
                  className="rounded-2xl border border-rose-600 bg-white px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
