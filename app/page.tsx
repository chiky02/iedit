import { Navbar } from '@/components/Navbar';
import { NewsFilters } from '@/components/NewsFilters';
import { NewsPagination } from '@/components/NewsPagination';
import { NewsList } from '@/components/NewsList';
import { getNewsCategories, getPublicNews } from './actions';

interface SearchParams {
  page?: string | string[];
  categoria?: string | string[];
  tipo?: string | string[];
  from?: string | string[];
  to?: string | string[];
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

  const [newsData, categories] = await Promise.all([
    getPublicNews({ page, categoria, tipo, from, to }),
    getNewsCategories(),
  ]);

  if ('error' in newsData) {
    return (
      <div className="min-h-screen bg-[#faf7e4] text-slate-900">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <section className="rounded-[32px] border border-[#e2d98f] bg-white/90 p-8 shadow-lg shadow-slate-200/40">
            <h1 className="text-3xl font-bold text-slate-900">Noticias</h1>
            <p className="mt-4 text-slate-700">No fue posible cargar las noticias en este momento.</p>
            <p className="mt-6 text-sm text-rose-700">{newsData.error}</p>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf7e4] text-slate-900">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <section className="rounded-[32px] border border-[#e2d98f] bg-white/90 p-8 shadow-lg shadow-slate-200/40 mb-10">
          <div className="grid gap-6  lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#276749]">
                Noticias del colegio
              </p>
              <h1 className="mt-4 text-4xl font-bold text-slate-900">
                Noticias y novedades del colegio
              </h1>
              <p className="mt-4 text-base text-slate-700">
                Lee las últimas noticias y novedades. Si quieres enviar una sugerencia, visita la sección dedicada en el menú.
              </p>
            </div>
            
          </div>
        </section>

        <div className="space-y-4">
          <NewsFilters
            categories={categories}
            currentCategoria={categoria}
            currentTipo={tipo}
            currentFrom={from}
            currentTo={to}
          />

          <NewsList 
            noticias={newsData.noticias}
            page={newsData.page}
            totalPages={newsData.totalPages}
          />

          <NewsPagination
            page={newsData.page}
            totalPages={newsData.totalPages}
            totalCount={newsData.total}
            categoria={categoria}
            tipo={tipo}
            from={from}
            to={to}
          />
        </div>
      </main>
    </div>
  );
}
