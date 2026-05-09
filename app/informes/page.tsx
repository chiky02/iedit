import { Navbar } from '@/components/Navbar';
import { NewsFilters } from '@/components/NewsFilters';
import { NewsPagination } from '@/components/NewsPagination';
import { NewsList } from '@/components/NewsList';
import { getNewsCategories, getPublicNews } from '../actions';

interface SearchParams {
  page?: string | string[];
  categoria?: string | string[];
  from?: string | string[];
  to?: string | string[];
  sort?: string | string[];
}

function normalizeSearchParam(value: string | string[] | undefined) {
  if (!value) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

export default async function InformesPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const page = Number(normalizeSearchParam(params.page)) || 1;
  const categoria = normalizeSearchParam(params.categoria);
  const from = normalizeSearchParam(params.from);
  const to = normalizeSearchParam(params.to);
  const sort = (normalizeSearchParam(params.sort) as 'asc' | 'desc' | undefined) || 'desc';

  const [newsData, categories] = await Promise.all([
    getPublicNews({ page, categoria, tipo: 'FINANCIERO', from, to, sort }),
    getNewsCategories(),
  ]);

  if ('error' in newsData) {
    return (
      <div className="min-h-screen bg-[#faf7e4] text-slate-900 font-sans">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-6">
          <section className="rounded-2xl border border-[#e2d98f] bg-white p-8 shadow-sm">
            <h1 className="text-2xl font-bold text-slate-900">Informes Contraloría</h1>
            <p className="mt-2 text-slate-600">No fue posible cargar los informes en este momento.</p>
            <p className="mt-4 text-xs font-mono text-rose-600 bg-rose-50 p-2 rounded">{newsData.error}</p>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf7e4] text-slate-900 font-sans">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* BLOQUE ÚNICO CONTINUO */}
        <div className="flex flex-col border border-[#e2d98f] bg-white/95 rounded-[24px] overflow-hidden shadow-sm">
          
          {/* 1. Cabecera - Pegada arriba con borde inferior sutil */}
          <header className="p-6 border-b border-[#e2d98f]/40 bg-white">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#276749] opacity-90">
                Información Financiera
              </p>
              <h1 className="mt-1 text-2xl font-bold text-slate-900 leading-tight">
                Informes Contraloría
              </h1>
              <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                Informes financieros y reportes de contraloría de la institución.
              </p>
            </div>
          </header>

          {/* 2. Filtros - Sin márgenes exteriores, integrados al bloque */}
          <div className="bg-slate-50/50 border-b border-[#e2d98f]/30 p-2">
            <NewsFilters
              currentSort={sort}
            />
          </div>

          {/* 3. Contenido de Informes */}
          <div className="p-6">
            {newsData.noticias.length > 0 ? (
              <div className="flex flex-col">
                <NewsList 
                  noticias={newsData.noticias}
                  page={newsData.page}
                  totalPages={newsData.totalPages}
                />

                {/* 4. Paginación - Separada por una línea de puntos o borde tenue */}
                <div className="mt-8 pt-6 border-t border-slate-100">
                  <NewsPagination
                    page={newsData.page}
                    totalPages={newsData.totalPages}
                    totalCount={newsData.total}
                    categoria={categoria}
                    tipo="FINANCIERO"
                    from={from}
                    to={to}
                    sort={sort}
                    basePath="/informes"
                  />
                </div>
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-sm text-slate-500">No se encontraron informes disponibles con los filtros actuales.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}