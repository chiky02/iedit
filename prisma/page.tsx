import { Navbar } from '@/components/Navbar';
import { NewsFilters } from '@/components/NewsFilters';
import { NewsPagination } from '@/components/NewsPagination';
import { NewsList } from '@/components/NewsList';
import { getNewsCategories, getPublicNews } from '@/app/actions';

interface SearchParams {
  page?: string | string[];
  categoria?: string | string[];
  tipo?: string | string[];
  from?: string | string[];
  to?: string | string[];
  sort?: string | string[];
}

function normalizeSearchParam(value: string | string[] | undefined) {
  if (!value) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

export default async function Home({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const page = Number(normalizeSearchParam(params.page)) || 1;
  const categoria = normalizeSearchParam(params.categoria);
  const tipo = normalizeSearchParam(params.tipo);
  const from = normalizeSearchParam(params.from);
  const to = normalizeSearchParam(params.to);
  const sort = (normalizeSearchParam(params.sort) as 'asc' | 'desc' | undefined) || 'desc';

  const [newsDataEventos, newsDataOtros, categories] = await Promise.all([
    getPublicNews({ page, categoria, tipo: 'EVENTO', from, to, sort }),
    getPublicNews({ page, categoria, tipo: 'OTRO', from, to, sort }),
    getNewsCategories(),
  ]);

  if ('error' in newsDataEventos && 'error' in newsDataOtros) {
    return (
      <div className="min-h-screen bg-[#faf7e4] text-slate-900">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-6">
          <section className="rounded-[32px] border border-[#e2d98f] bg-white/90 p-8 shadow-lg shadow-slate-200/40">
            <h1 className="text-3xl font-bold text-slate-900">Noticias y Eventos</h1>
            <p className="mt-4 text-slate-700">No fue posible cargar las noticias en este momento.</p>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf7e4] text-slate-900">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Sección Noticias y Eventos */}
        <section className="rounded-[32px] border border-[#e2d98f] bg-white/90 p-6 shadow-lg shadow-slate-200/40 mb-6">
          <div className="grid gap-4 lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#276749]">
                Noticias del colegio
              </p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900">
                Noticias y Eventos
              </h1>
              <p className="mt-2 text-sm text-slate-700">
                Lee las últimas noticias y eventos del colegio.
              </p>
            </div>
          </div>
        </section>

        <div className="space-y-2 mb-8">
          <NewsFilters
            currentSort={sort}
          />

          {!('error' in newsDataEventos) && newsDataEventos.noticias.length > 0 ? (
            <>
              <NewsList 
                noticias={newsDataEventos.noticias}
                page={newsDataEventos.page}
                totalPages={newsDataEventos.totalPages}
              />

              <NewsPagination
                page={newsDataEventos.page}
                totalPages={newsDataEventos.totalPages}
                totalCount={newsDataEventos.total}
                categoria={categoria}
                tipo="EVENTO"
                from={from}
                to={to}
                sort={sort}
              />
            </>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white/80 p-8 text-center text-slate-600">
              No se encontraron noticias o eventos.
            </div>
          )}
        </div>

        {/* Sección Otros Artículos */}
        <section className="rounded-[32px] border border-[#e2d98f] bg-white/90 p-6 shadow-lg shadow-slate-200/40 mb-6">
          <div className="grid gap-4 lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#276749]">
                Información institucional
              </p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900">
                Otros Artículos
              </h1>
              <p className="mt-2 text-sm text-slate-700">
                Otros comunicados y artículos de interés.
              </p>
            </div>
          </div>
        </section>

        <div className="space-y-2">
          <NewsFilters
            currentSort={sort}
          />

          {!('error' in newsDataOtros) && newsDataOtros.noticias.length > 0 ? (
            <>
              <NewsList 
                noticias={newsDataOtros.noticias}
                page={newsDataOtros.page}
                totalPages={newsDataOtros.totalPages}
              />

              <NewsPagination
                page={newsDataOtros.page}
                totalPages={newsDataOtros.totalPages}
                totalCount={newsDataOtros.total}
                categoria={categoria}
                tipo="OTRO"
                from={from}
                to={to}
                sort={sort}
              />
            </>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white/80 p-8 text-center text-slate-600">
              No se encontraron otros artículos.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
