interface NewsFiltersProps {
  categories: string[];
  currentCategoria?: string;
  currentTipo?: string;
  currentFrom?: string;
  currentTo?: string;
}

function buildQuery(params: Record<string, string | number | undefined>) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      searchParams.set(key, String(value));
    }
  });
  return searchParams.toString();
}

export function NewsFilters({
  categories,
  currentCategoria,
  currentTipo,
  currentFrom,
  currentTo,
}: NewsFiltersProps) {
  return (
    <section className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <form method="get" className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Categoría</label>
          <select
            name="categoria"
            defaultValue={currentCategoria ?? ''}
            className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-900 focus:border-emerald-400 focus:outline-none"
          >
            <option value="">Todas</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Tipo</label>
          <select
            name="tipo"
            defaultValue={currentTipo ?? ''}
            className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-900 focus:border-emerald-400 focus:outline-none"
          >
            <option value="">Todos</option>
            <option value="FINANCIERO">Financiero</option>
            <option value="EVENTO">Evento</option>
            <option value="OTRO">Otro</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Desde</label>
          <input
            type="date"
            name="from"
            defaultValue={currentFrom ?? ''}
            className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-900 focus:border-emerald-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Hasta</label>
          <input
            type="date"
            name="to"
            defaultValue={currentTo ?? ''}
            className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-900 focus:border-emerald-400 focus:outline-none"
          />
        </div>

        <div className="sm:col-span-2 lg:col-span-4 flex flex-wrap gap-2">
          <button
            type="submit"
            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700"
          >
            Filtrar
          </button>
          <a
            href="/"
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Limpiar
          </a>
        </div>
      </form>
    </section>
  );
}
