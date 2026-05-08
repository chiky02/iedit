interface NewsItem {
  id: string;
  titulo: string;
  slug?: string;
  categoria: string;
  tipo: string;
  contenido: string;
  imagenUrl?: string | null;
  autor: { nombre: string };
  createdAt: string;
}

interface NewsListProps {
  noticias: NewsItem[];
  page: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
}

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, '');
}

export function NewsList({ noticias, page, totalPages, onPageChange }: NewsListProps) {
  if (noticias.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white/80 p-8 text-center text-slate-600">
        No se encontraron noticias con esos filtros.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {noticias.map((noticia) => (
        <article key={noticia.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">{noticia.categoria}</p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-900">{noticia.titulo}</h3>
              </div>

              {noticia.imagenUrl ? (
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
                  <img src={noticia.imagenUrl} alt={noticia.titulo} className="h-64 w-full object-cover" />
                </div>
              ) : null}

              <div className="max-w-none overflow-hidden text-sm leading-6 text-slate-700" style={{ maxHeight: '10rem' }} dangerouslySetInnerHTML={{ __html: noticia.contenido }} />
            </div>

            <div className="space-y-2 text-right text-sm text-slate-500">
              <p>{noticia.tipo === 'FINANCIERO' ? 'Financiero' : noticia.tipo === 'EVENTO' ? 'Evento' : 'Otro'}</p>
              <p>{noticia.createdAt}</p>
              <p>{noticia.autor?.nombre || 'Administrador'}</p>
            </div>
          </div>
        </article>
      ))}

      {/* Información de paginación */}
     
    </div>
  );
}
