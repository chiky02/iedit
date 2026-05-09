'use client';

import { useState, useEffect } from 'react';
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
  isPending: boolean;
  onSubmit: (form: any) => void;
  selectedNews?: NewsItem | null;
  onCancelEdit?: () => void;
}

const tiposNoticias = [
  { value: 'FINANCIERO', label: 'Financiero' },
  { value: 'EVENTO', label: 'Evento' },
  { value: 'OTRO', label: 'Otro' },
];

export function NewsSection({ isPending, onSubmit, selectedNews, onCancelEdit }: NewsSectionProps) {
  const [form, setForm] = useState({
    id: '',
    titulo: '',
    categoria: '',
    tipo: 'FINANCIERO',
    imagenUrl: '',
    esPublica: true,
    contenido: '',
  });

  useEffect(() => {
    if (selectedNews) {
      setForm({
        id: selectedNews.id,
        titulo: selectedNews.titulo,
        categoria: selectedNews.categoria,
        tipo: selectedNews.tipo,
        imagenUrl: selectedNews.imagenUrl || '',
        esPublica: selectedNews.esPublica,
        contenido: selectedNews.contenido,
      });
    } else {
      setForm({
        id: '',
        titulo: '',
        categoria: '',
        tipo: 'FINANCIERO',
        imagenUrl: '',
        esPublica: true,
        contenido: '',
      });
    }
  }, [selectedNews]);

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
    onCancelEdit?.();
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
    </section>
  );
}

