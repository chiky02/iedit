'use client';

import { useState } from 'react';

type Suggestion = {
  id: string;
  remitente?: string | null;
  email?: string | null;
  mensaje: string;
  anonimidad: boolean;
  createdAt: string;
};

interface SuggestionsSectionProps {
  suggestions: Suggestion[];
  isPending: boolean;
  onDelete: (id: string) => void;
}

const ITEMS_PER_PAGE = 5;

export function SuggestionsSection({ suggestions, isPending, onDelete }: SuggestionsSectionProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAnonimidad, setFilterAnonimidad] = useState('');

  // Filtrar sugerencias
  const filteredSuggestions = suggestions.filter((item) => {
    const matchesSearch =
      item.mensaje.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.remitente?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

    const matchesAnonimidad =
      filterAnonimidad === '' || (filterAnonimidad === 'anonimo' ? item.anonimidad : !item.anonimidad);

    return matchesSearch && matchesAnonimidad;
  });

  // Paginación
  const totalPages = Math.max(1, Math.ceil(filteredSuggestions.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedSuggestions = filteredSuggestions.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterAnonimidad('');
    setCurrentPage(1);
  };

  return (
    <section className="rounded-3xl border border-[#dfe9db] bg-white p-6 shadow-sm">
      <div className="mb-6 pb-6 border-b border-slate-200">
        <h2 className="text-2xl font-semibold text-slate-900">💬 Sugerencias</h2>
        <p className="mt-2 text-sm text-slate-600">Revisa y gestiona las sugerencias recibidas de usuarios. ({filteredSuggestions.length} sugerencias encontradas)</p>
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
              placeholder="Buscar por mensaje, remitente o email..."
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Tipo</label>
            <select
              value={filterAnonimidad}
              onChange={(e) => {
                setFilterAnonimidad(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-emerald-400 focus:outline-none"
            >
              <option value="">Todas</option>
              <option value="anonimo">Anónimas</option>
              <option value="identificado">Identificadas</option>
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

      {/* Lista de sugerencias */}
      <div className="mt-4 space-y-3">
        {filteredSuggestions.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
            No se encontraron sugerencias con los criterios seleccionados.
          </div>
        ) : (
          <>
            {paginatedSuggestions.map((suggestion) => (
              <div key={suggestion.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-slate-900">
                        {suggestion.anonimidad ? '🔒 Anónimo' : suggestion.remitente || 'Sin nombre'}
                      </p>
                    </div>
                    {!suggestion.anonimidad && suggestion.email && (
                      <p className="text-xs text-slate-600">📧 {suggestion.email}</p>
                    )}
                    <p className="mt-2 text-sm text-slate-700 line-clamp-2">{suggestion.mensaje}</p>
                    <p className="mt-2 text-xs text-slate-500">📅 {suggestion.createdAt}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onDelete(suggestion.id)}
                    disabled={isPending}
                    className="rounded-lg border border-rose-600 bg-white px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            ))}

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
