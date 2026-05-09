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
          <section className="rounded-2xl border border-[#e2d98f] bg-white p-8">
            <h1 className="text-2xl font-bold">Noticias y Eventos</h1>
            <p className="mt-2 text-slate-600">Error al cargar contenido.</p>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf7e4] text-slate-900 font-sans">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* CONTENEDOR ÚNICO: 
          Aquí agrupamos todo para que no haya espacios entre componentes.
          Usamos overflow-hidden y un solo borde exterior.
        */}
        <div className="flex flex-col border border-[#e2d98f] bg-white/95 rounded-[24px] overflow-hidden shadow-sm">
          
          {/* 1. Cabecera */}
          <header className="p-6 border-b border-[#e2d98f]/50">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#276749]">
              Noticias del colegio
            </p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              Noticias y Eventos
            </h1>
          </header>

          {/* 2. Filtros (Pegados a la cabecera) */}
          <div className="p-2 bg-slate-50/50 border-b border-[#e2d98f]/50">
            <NewsFilters
              currentSort={sort}
            />
          </div>

          {/* 3. Lista de Noticias */}
          <div className="p-6">
            {!('error' in newsDataEventos) && newsDataEventos.noticias.length > 0 ? (
              <div className="flex flex-col">
                <NewsList 
                  noticias={newsDataEventos.noticias}
                  page={newsDataEventos.page}
                  totalPages={newsDataEventos.totalPages}
                />

                {/* 4. Paginación (Pegada al final de la lista) */}
                <div className="mt-8 pt-6 border-t border-slate-100">
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
                </div>
              </div>
            ) : (
              <div className="py-10 text-center text-slate-500">
                No se encontraron resultados.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}