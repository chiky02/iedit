'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  createNewsAction,
  updateNewsAction,
  deleteNewsAction,
  createUserAction,
  updateUserAction,
  deleteUserAction,
  createRoleAction,
  deleteRoleAction,
  deleteSuggestionAction,
} from '@/app/actions';
import { NewsSection } from './AdminPanel/NewsSection';
import { UsersSection } from './AdminPanel/UsersSection';
import { RolesSection } from './AdminPanel/RolesSection';
import { SuggestionsSection } from './AdminPanel/SuggestionsSection';
import { AdminSidebar } from './AdminSidebar';

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

type User = {
  id: string;
  nombre: string;
  email: string;
  isActive: boolean;
  role: { id: string; nombre: string };
};

type NewsItem = {
  id: string;
  titulo: string;
  categoria: string;
  tipo: string;
  imagenUrl?: string | null;
  contenido: string;
  esPublica: boolean;
  autor: { nombre: string };
  createdAt: Date;
};

type Suggestion = {
  id: string;
  remitente?: string | null;
  email?: string | null;
  mensaje: string;
  anonimidad: boolean;
  createdAt: Date;
};

interface AdminPanelProps {
  users: User[];
  roles: Role[];
  noticias: NewsItem[];
  suggestions: Suggestion[];
  permissions: Permission[];
}

const tiposNoticias = [
  { value: 'FINANCIERO', label: 'Financiero' },
  { value: 'EVENTO', label: 'Evento' },
  { value: 'OTRO', label: 'Otro' },
];

export function AdminPanel({ users, roles, noticias, suggestions, permissions }: AdminPanelProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Estado inicial basado en hash de URL
  const [activeSection, setActiveSection] = useState<'noticias' | 'usuarios' | 'roles' | 'sugerencias'>('noticias');

  // Detectar sección desde hash de URL
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (['noticias', 'usuarios', 'roles', 'sugerencias'].includes(hash)) {
      setActiveSection(hash as 'noticias' | 'usuarios' | 'roles' | 'sugerencias');
    }
  }, []);

  // Actualizar hash cuando cambia la sección
  const handleSectionChange = (section: 'noticias' | 'usuarios' | 'roles' | 'sugerencias') => {
    setActiveSection(section);
    window.history.replaceState(null, '', `#${section}`);
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    window.setTimeout(() => setMessage(null), 5000);
  };

  async function handleNewsSubmit(form: any) {
    startTransition(async () => {
      const result = form.id
        ? await updateNewsAction(form.id, form.titulo, form.contenido, form.categoria, form.tipo, form.imagenUrl, form.esPublica)
        : await createNewsAction(form.titulo, form.contenido, form.categoria, form.tipo, form.imagenUrl, form.esPublica);

      if (result.error) {
        showMessage('error', result.error);
      } else {
        showMessage('success', form.id ? 'Noticia actualizada correctamente' : 'Noticia creada correctamente');
        router.refresh();
      }
    });
  }

  async function handleUserSubmit(form: any) {
    startTransition(async () => {
      const result = form.id
        ? await updateUserAction(form.id, form.nombre, form.email, form.roleId, form.isActive, form.password)
        : await createUserAction(form.nombre, form.email, form.password, form.roleId);

      if (result.error) {
        showMessage('error', result.error);
      } else {
        showMessage('success', form.id ? 'Usuario actualizado correctamente' : 'Usuario creado correctamente');
        router.refresh();
      }
    });
  }

  async function handleRoleSubmit(form: any) {
    startTransition(async () => {
      const result = await createRoleAction(form.nombre, form.descripcion, form.permissions);
      if (result.error) {
        showMessage('error', result.error);
      } else {
        showMessage('success', 'Rol creado correctamente');
        router.refresh();
      }
    });
  }

  async function handleDeleteNews(id: string) {
    if (!confirm('¿Eliminar esta noticia?')) return;
    startTransition(async () => {
      const result = await deleteNewsAction(id);
      if (result.error) showMessage('error', result.error);
      else { showMessage('success', 'Noticia eliminada'); router.refresh(); }
    });
  }

  async function handleDeleteUser(id: string) {
    if (!confirm('¿Eliminar este usuario?')) return;
    startTransition(async () => {
      const result = await deleteUserAction(id);
      if (result.error) showMessage('error', result.error);
      else { showMessage('success', 'Usuario eliminado'); router.refresh(); }
    });
  }

  async function handleDeleteRole(id: string) {
    if (!confirm('¿Eliminar este rol?')) return;
    startTransition(async () => {
      const result = await deleteRoleAction(id);
      if (result.error) showMessage('error', result.error);
      else { showMessage('success', 'Rol eliminado'); router.refresh(); }
    });
  }

  async function handleDeleteSuggestion(id: string) {
    if (!confirm('¿Eliminar esta sugerencia?')) return;
    startTransition(async () => {
      const result = await deleteSuggestionAction(id);
      if (result.error) showMessage('error', result.error);
      else { showMessage('success', 'Sugerencia eliminada'); router.refresh(); }
    });
  }

  async function handleEditNews(item: any) {
    // Los cambios se hacen en la sección, simplemente actualizamos el estado
    // que ya está en NewsSection
  }

  return (
    <div className="flex min-h-screen bg-[#f5f8f1]">
      {/* Sidebar */}
      <AdminSidebar
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />

      {/* Contenido Principal */}
      <div className="flex-1 lg:ml-64">
        <main className="p-4 lg:p-8">
          {/* Header */}
          <div className="mb-8 rounded-[32px] border border-[#d3e5c4] bg-white p-6 lg:p-8 shadow-lg shadow-slate-200/30">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Panel administrativo</h1>
                <p className="mt-2 text-sm lg:text-base text-slate-600 max-w-2xl">
                  Administra noticias, usuarios, roles y revisa sugerencias desde un solo lugar.
                </p>
              </div>
            </div>
          </div>

          {/* Mensajes */}
          {message && (
            <div className={`mb-6 rounded-3xl border px-5 py-4 text-sm font-medium ${
              message.type === 'success' ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : 'border-rose-300 bg-rose-50 text-rose-800'
            }`}>
              {message.text}
            </div>
          )}

          {/* Contenido de las Secciones */}
          {activeSection === 'noticias' && (
            <NewsSection
              noticias={noticias}
              isPending={isPending}
              onSubmit={handleNewsSubmit}
              onDelete={handleDeleteNews}
              onEdit={handleEditNews}
            />
          )}

          {activeSection === 'usuarios' && (
            <UsersSection
              users={users}
              roles={roles}
              isPending={isPending}
              onSubmit={handleUserSubmit}
              onDelete={handleDeleteUser}
              onEdit={() => {}}
            />
          )}

          {activeSection === 'roles' && (
            <RolesSection
              roles={roles}
              permissions={permissions}
              isPending={isPending}
              onSubmit={handleRoleSubmit}
              onDelete={handleDeleteRole}
            />
          )}

          {activeSection === 'sugerencias' && (
            <SuggestionsSection
              suggestions={suggestions}
              isPending={isPending}
              onDelete={handleDeleteSuggestion}
            />
          )}
        </main>
      </div>
    </div>
  );
}