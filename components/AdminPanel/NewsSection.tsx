'use client';

import { useState } from 'react';
import { WysiwygEditor } from '@/components/WysiwygEditor';

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

interface NewsSectionProps {
  noticias: NewsItem[];
  isPending: boolean;
  onSubmit: (form: any) => void;
  onDelete: (id: string) => void;
  onEdit: (item: NewsItem) => void;
}

const tiposNoticias = [
  { value: 'FINANCIERO', label: 'Financiero' },
  { value: 'EVENTO', label: 'Evento' },
  { value: 'OTRO', label: 'Otro' },
];

const ITEMS_PER_PAGE = 5;

export function NewsSection({ noticias, isPending, onSubmit, onDelete, onEdit }: NewsSectionProps) {
  const [form, setForm] = useState({
    id: '',
    titulo: '',
    categoria: '',
    tipo: 'FINANCIERO',
    imagenUrl: '',
    esPublica: true,
    contenido: '',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('');

  // Filtrar noticias
  const filteredNoticias = noticias.filter((item) => {
    const matchSearch = item.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.categoria.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTipo = !filterTipo || item.tipo === filterTipo;
    return matchSearch && matchTipo;
  });

  // Calcular paginación
  const totalPages = Math.ceil(filteredNoticias.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedNoticias = filteredNoticias.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(form);
    setForm({
      id: '',
      titulo: '',
      categoria: '',
      tipo: 'FINANCIERO',
      imagenUrl: '',
      esPublica: true,
      contenido: '',
    });
  };

  const handleEdit = (item: NewsItem) => {
    setForm({
      id: item.id,
      titulo: item.titulo,
      categoria: item.categoria,
      tipo: item.tipo,
      imagenUrl: item.imagenUrl || '',
      esPublica: item.esPublica,
      contenido: item.contenido,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setForm({
      id: '',
      titulo: '',
      categoria: '',
      tipo: 'FINANCIERO',
      imagenUrl: '',
      esPublica: true,
      contenido: '',
    });
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterTipo('');
    setCurrentPage(1);
  };

  return (
    <section className="space-y-0 divide-y divide-slate-200">
      {/* SECCIÓN 1: CREAR NOTICIA */}
      <div className="rounded-t-3xl border-x border-t border-[#dfe9db] bg-white p-6 shadow-sm">
        <div className="mb-6 pb-6 border-b border-slate-200">
          <h2 className="text-2xl font-semibold text-slate-900">📝 Crear Noticia</h2>
          <p className="mt-2 text-sm text-slate-600">Completa el formulario para crear una nueva noticia que aparecerá en el sitio.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Título</label>
            <input
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none"
              placeholder="Título de la noticia"
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700">Categoría</label>
              <input
                value={form.categoria}
                onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none"
                placeholder="Ej: Financiero, Eventos, Académico"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Tipo</label>
              <select
                value={form.tipo}
                onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none"
              >
                {tiposNoticias.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Imagen URL</label>
            <input
              value={form.imagenUrl}
              onChange={(e) => setForm({ ...form, imagenUrl: e.target.value })}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Contenido</label>
            <div className="mt-2 rounded-3xl border border-slate-300 bg-slate-50 p-2">
              <WysiwygEditor
                value={form.contenido}
                onChange={(value) => setForm({ ...form, contenido: value })}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={form.esPublica}
                onChange={(e) => setForm({ ...form, esPublica: e.target.checked })}
                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              Publicar de inmediato
            </label>
            <div className="flex gap-3">
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
                {form.id ? 'Guardar cambios' : 'Crear noticia'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* SECCIÓN 2: GESTIONAR NOTICIAS */}
      <div className="rounded-b-3xl border-x border-b border-[#dfe9db] bg-white p-6 shadow-sm">
        <div className="mb-6 pb-6 border-b border-slate-200">
          <h2 className="text-2xl font-semibold text-slate-900">🔍 Gestionar Noticias</h2>
          <p className="mt-2 text-sm text-slate-600">Busca, filtra, edita o elimina noticias existentes. ({filteredNoticias.length} noticias encontradas)</p>
        </div>

        {/* Filtros y búsqueda */}
        <div className="mb-4 space-y-2 rounded-2xl border border-slate-100 bg-slate-50 p-4">
          <div className="grid gap-2 md:grid-cols-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Búsqueda</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-emerald-400 focus:outline-none"
                placeholder="Buscar por título o categoría..."
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Filtrar por tipo</label>
              <select
                value={filterTipo}
                onChange={(e) => {
                  setFilterTipo(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-emerald-400 focus:outline-none"
              >
                <option value="">Todos</option>
                {tiposNoticias.map((tipo) => (
                  <option key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end gap-2">
              <button
                onClick={handleResetFilters}
                className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Limpiar
              </button>
            </div>
          </div>
        </div>

        {/* Lista de noticias con paginación */}
        {filteredNoticias.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
            No se encontraron noticias con los criterios seleccionados.
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {paginatedNoticias.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-slate-900">{item.titulo}</h4>
                        {item.esPublica && (
                          <span className="inline-block rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                            Publicada
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-slate-600">
                        📁 {item.categoria} • 🏷️ {item.tipo} • 📅 {item.createdAt}
                      </p>
                      <p className="mt-2 line-clamp-2 text-sm text-slate-700">{item.contenido.replace(/<[^>]+>/g, '')}</p>
                    </div>

                    <div className="flex flex-wrap gap-2 sm:flex-col">
                      <button
                        onClick={() => handleEdit(item)}
                        className="rounded-xl border border-emerald-600 bg-white px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => onDelete(item.id)}
                        disabled={isPending}
                        className="rounded-xl border border-rose-600 bg-white px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  ← Anterior
                </button>
                <div className="text-xs font-medium text-slate-600">
                  Página {currentPage} de {totalPages}
                </div>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Siguiente →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
