'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

interface NavbarProps {
  isAdmin?: boolean;
}

export function Navbar({ isAdmin = false }: NavbarProps) {
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const pathname = usePathname();

  // No mostrar menú admin si estamos en la página admin
  const showAdminMenu = isAdmin && !pathname.startsWith('/admin');

  return (
    <nav className="bg-[#1b4729] text-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <img
              src="/src/logo.jpeg"
              alt="avatar"
              className="h-10 w-10 rounded-2xl object-cover"
            />
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-[#f8f2be]">IEDIT</p>
            <p className="text-base font-bold">Buzón y noticias</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm font-medium">
          <Link href="/" className="rounded-full bg-white/10 px-4 py-2 transition hover:bg-white/20">
            Noticias
          </Link>
          <Link href="/sugerencias" className="rounded-full bg-white/10 px-4 py-2 transition hover:bg-white/20">
            Sugerencias
          </Link>
          
          {showAdminMenu && (
            <div className="relative">
              <button
                onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                className="rounded-full bg-[#d9c256] px-4 py-2 text-[#1b4729] transition hover:bg-[#c5b047] flex items-center gap-2"
              >
                Panel admin
                <svg className={`w-4 h-4 transition-transform ${adminMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
              
              {adminMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white shadow-lg border border-slate-200 z-50">
                  <Link
                    href="/admin#noticias"
                    className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-100 rounded-t-2xl"
                    onClick={() => setAdminMenuOpen(false)}
                  >
                    📰 Gestionar noticias
                  </Link>
                  <Link
                    href="/admin#usuarios"
                    className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-100 border-t border-slate-200"
                    onClick={() => setAdminMenuOpen(false)}
                  >
                    👥 Gestionar usuarios
                  </Link>
                  <Link
                    href="/admin#roles"
                    className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-100 border-t border-slate-200"
                    onClick={() => setAdminMenuOpen(false)}
                  >
                    🔐 Gestionar roles
                  </Link>
                  <Link
                    href="/admin#sugerencias"
                    className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-100 border-t border-slate-200 rounded-b-2xl"
                    onClick={() => setAdminMenuOpen(false)}
                  >
                    💬 Sugerencias
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
