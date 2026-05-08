interface NewsPaginationProps {
  page: number;
  totalPages: number;
  totalCount: number;
  categoria?: string;
  tipo?: string;
  from?: string;
  to?: string;
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

export function NewsPagination({
  page,
  totalPages,
  totalCount,
  categoria,
  tipo,
  from,
  to,
}: NewsPaginationProps) {
  const prevQuery = buildQuery({
    page: page - 1 > 0 ? page - 1 : undefined,
    categoria,
    tipo,
    from,
    to,
  });

  const nextQuery = buildQuery({
    page: page + 1 <= totalPages ? page + 1 : undefined,
    categoria,
    tipo,
    from,
    to,
  });

  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <div className="flex items-center justify-between">
        <a
          href={prevQuery ? `/?${prevQuery}` : '#'}
          className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${page > 1 ? 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100' : 'cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400'}`}
        >
          ← Anterior
        </a>
        <div className="text-center">
          <p className="text-xs font-medium text-slate-600">Página {page} de {totalPages}</p>
        </div>
        <a
          href={nextQuery ? `/?${nextQuery}` : '#'}
          className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${page < totalPages ? 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100' : 'cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400'}`}
        >
          Siguiente →
        </a>
      </div>
    </div>
  );
}
