'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: 'noticias' | 'usuarios' | 'roles' | 'sugerencias') => void;
}

export function AdminSidebar({ activeSection, onSectionChange }: AdminSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    {
      id: 'noticias',
      label: '📰 Noticias',
      href: '/admin#noticias',
      section: 'noticias' as const,
    },
    {
      id: 'usuarios',
      label: '👥 Usuarios',
      href: '/admin#usuarios',
      section: 'usuarios' as const,
    },
    {
      id: 'roles',
      label: '🔐 Roles',
      href: '/admin#roles',
      section: 'roles' as const,
    },
    {
      id: 'sugerencias',
      label: '💬 Sugerencias',
      href: '/admin#sugerencias',
      section: 'sugerencias' as const,
    },
  ];

  const handleSectionClick = (section: 'noticias' | 'usuarios' | 'roles' | 'sugerencias') => {
    onSectionChange(section);
    setIsOpen(false); // Cerrar sidebar en móvil
  };

  return (
    <>
      {/* Botón Hamburguesa - Visible solo en móvil */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden rounded-full bg-[#1b4729] p-3 text-white shadow-lg transition hover:bg-[#276749]"
        aria-label="Abrir menú"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Overlay para móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 z-50 h-full w-64 transform bg-[#1b4729] text-white shadow-xl transition-transform duration-300 ease-in-out lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header del Sidebar */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <img
              src="/src/logo.jpeg"
              alt="logo"
              className="h-8 w-8 rounded-xl object-cover"
            />
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.26em] text-[#f8f2be]">IEDIT</p>
              <p className="text-xs text-white/80">Panel Admin</p>
            </div>
          </div>

          {/* Botón cerrar - Solo visible en móvil */}
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden rounded-full p-2 text-white/70 hover:text-white hover:bg-white/10"
            aria-label="Cerrar menú"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navegación Principal */}
        <nav className="flex-1 px-4 py-6">
          <div className="space-y-2">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              🏠 Página principal
            </Link>

            
          </div>

          {/* Separador */}
          <div className="my-6 border-t border-white/10" />

          {/* Secciones del Admin */}
          <div className="space-y-1">
            <p className="px-4 text-xs font-semibold uppercase tracking-wider text-white/60 mb-3">
              Administración
            </p>

            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSectionClick(item.section)}
                className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                  activeSection === item.section
                    ? 'bg-[#d9c256] text-[#1b4729] shadow-sm'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Footer del Sidebar */}
        <div className="border-t border-white/10 p-4">
          <a
            href="/admin/logout"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            🚪 Cerrar sesión
          </a>
        </div>
      </aside>
    </>
  );
}