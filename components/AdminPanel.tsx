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
  updateRoleAction,
  deleteRoleAction,
  deleteSuggestionAction,
} from '@/app/actions';
import { NewsSection } from './AdminPanel/NewsSection';
import { NewsManageSection } from './AdminPanel/NewsManageSection';
import { UsersSection } from './AdminPanel/UsersSection';
import { RolesSection } from './AdminPanel/RolesSection';
import { SuggestionsSection } from './AdminPanel/SuggestionsSection';
import { AdminSidebar } from './AdminSidebar';

type Role = {
  id: string;
  nombre: string;
  descripcion: string | null;
  permissions: { permission: { slug: string; descripcion: string | null } }[];
  users?: { id: string }[]; // Agregado para validaciones de eliminación
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
  createdAt: string;
};

type AdminSection = 'noticias' | 'usuarios' | 'roles' | 'sugerencias';

type Suggestion = {
  id: string;
  remitente?: string | null;
  email?: string | null;
  mensaje: string;
  anonimidad: boolean;
  createdAt: string;
};

interface AdminPanelProps {
  users: User[];
  roles: Role[];
  noticias: NewsItem[];
  suggestions: Suggestion[];
  permissions: Permission[];
  currentUserPermissionSlugs: string[];
}

const tiposNoticias = [
  { value: 'FINANCIERO', label: 'Financiero' },
  { value: 'EVENTO', label: 'Evento' },
  { value: 'OTRO', label: 'Otro' },
];

export function AdminPanel({ users, roles, noticias, suggestions, permissions, currentUserPermissionSlugs }: AdminPanelProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [newsTab, setNewsTab] = useState<'crear' | 'gestionar'>('crear');
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  const canManageNoticias = currentUserPermissionSlugs.some((slug: string) => slug.startsWith('noticias:'));
  const canManageUsuarios = currentUserPermissionSlugs.some((slug: string) => slug.startsWith('usuarios:'));
  const canManageRoles = currentUserPermissionSlugs.some((slug: string) => slug.startsWith('roles:'));
  const canManageSugerencias = currentUserPermissionSlugs.some((slug: string) => slug.startsWith('sugerencias:'));

  const availableSections: AdminSection[] = [
    canManageNoticias && 'noticias',
    canManageUsuarios && 'usuarios',
    canManageRoles && 'roles',
    canManageSugerencias && 'sugerencias',
  ].filter(Boolean) as AdminSection[];

  // Estado inicial basado en hash de URL
  const [activeSection, setActiveSection] = useState<AdminSection>(availableSections[0] ?? 'noticias');

  // Detectar sección desde hash de URL
  useEffect(() => {
    const hash = window.location.hash.replace('#', '') as AdminSection;
    if (availableSections.includes(hash)) {
      setActiveSection(hash);
    } else if (availableSections.length > 0) {
      setActiveSection(availableSections[0]);
    }
  }, [availableSections]);

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
        setSelectedNews(null);
        router.refresh();
      }
    });
  }

  function handleNewsEdit(item: NewsItem) {
    setSelectedNews(item);
    setNewsTab('crear');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleCancelNewsEdit() {
    setSelectedNews(null);
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
      const result = form.id
        ? await updateRoleAction(form.id, form.nombre, form.descripcion, form.permissions)
        : await createRoleAction(form.nombre, form.descripcion, form.permissions);

      if (result.error) {
        showMessage('error', result.error);
      } else {
        showMessage('success', form.id ? 'Rol actualizado correctamente' : 'Rol creado correctamente');
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
    const user = users.find(u => u.id === id);
    if (!user) return;

    let confirmMessage = `¿Eliminar el usuario "${user.nombre}" (${user.email})?`;
    if (user.email === 'admin@colegio.com') {
      confirmMessage = 'No se puede eliminar el usuario administrador del sistema.';
    } else if (user.role.nombre === 'admin') {
      confirmMessage = 'No se puede eliminar usuarios con rol de administrador.';
    }

    if (user.email === 'admin@colegio.com' || user.role.nombre === 'admin') {
      alert(confirmMessage);
      return;
    }

    if (!confirm(confirmMessage)) return;

    startTransition(async () => {
      const result = await deleteUserAction(id);
      if (result.error) showMessage('error', result.error);
      else { showMessage('success', 'Usuario eliminado'); router.refresh(); }
    });
  }

  async function handleDeleteRole(id: string) {
    const role = roles.find(r => r.id === id);
    if (!role) return;

    let confirmMessage = `¿Eliminar el rol "${role.nombre}"?`;
    if (role.nombre === 'admin') {
      confirmMessage = 'No se puede eliminar el rol de administrador del sistema.';
      alert(confirmMessage);
      return;
    }

    if (role.users && role.users.length > 0) {
      confirmMessage = `El rol "${role.nombre}" está asignado a ${role.users.length} usuario(s). Primero reasigna los usuarios a otro rol antes de eliminarlo.`;
      alert(confirmMessage);
      return;
    }

    if (!confirm(confirmMessage)) return;

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

  async function handleEditUser(user: any) {
    // La edición se maneja en UsersSection, aquí solo refrescamos si es necesario
  }

  return (
    <div className="flex min-h-screen bg-[#f5f8f1]">
      {/* Sidebar */}
      <AdminSidebar
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        allowedSections={availableSections}
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
          {activeSection === 'noticias' && canManageNoticias && (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setNewsTab('crear')}
                  className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                    newsTab === 'crear'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Crear noticia
                </button>
                <button
                  type="button"
                  onClick={() => setNewsTab('gestionar')}
                  className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                    newsTab === 'gestionar'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Gestionar noticias
                </button>
              </div>

              {newsTab === 'crear' ? (
                <NewsSection
                  isPending={isPending}
                  onSubmit={handleNewsSubmit}
                  selectedNews={selectedNews}
                  onCancelEdit={handleCancelNewsEdit}
                />
              ) : (
                <NewsManageSection
                  noticias={noticias}
                  isPending={isPending}
                  onDelete={handleDeleteNews}
                  onEdit={handleNewsEdit}
                />
              )}
            </div>
          )}

          {activeSection === 'usuarios' && canManageUsuarios && (
            <UsersSection
              users={users}
              roles={roles}
              isPending={isPending}
              onSubmit={handleUserSubmit}
              onDelete={handleDeleteUser}
              onEdit={() => {}}
            />
          )}

          {activeSection === 'roles' && canManageRoles && (
            <RolesSection
              roles={roles}
              permissions={permissions}
              isPending={isPending}
              onSubmit={handleRoleSubmit}
              onDelete={handleDeleteRole}
            />
          )}

          {activeSection === 'sugerencias' && canManageSugerencias && (
            <SuggestionsSection
              suggestions={suggestions}
              isPending={isPending}
              onDelete={handleDeleteSuggestion}
            />
          )}

          {availableSections.length === 0 && (
            <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center text-rose-700">
              No tienes permisos suficientes para ver ninguna sección del panel administrativo.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}