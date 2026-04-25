'use client';

import Link from 'next/link';
import Image from 'next/image';

interface NavbarProps {
  isAdmin?: boolean;
}

export function Navbar({ isAdmin = false }: NavbarProps) {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Logo Colegio"
                width={32}
                height={32}
                className="rounded"
              />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Transparencia Financiera
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Inicio
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className="text-blue-600 hover:text-blue-900 font-medium transition-colors"
              >
                Panel Admin
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
