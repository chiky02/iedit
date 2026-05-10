'use client';

import { useState, useRef, useEffect } from 'react';

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

function NewsCard({ noticia }: { noticia: NewsItem }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Función para detectar si el texto se desborda
  const checkOverflow = () => {
    const element = contentRef.current;
    if (element) {
      // Comparamos la altura total del contenido vs la altura visible
      const isOver = element.scrollHeight > element.clientHeight;
      setIsOverflowing(isOver);
    }
  };

  useEffect(() => {
    checkOverflow();
    // Volvemos a revisar si el usuario cambia el tamaño de la ventana
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [noticia.contenido]);

  return (
    <article className="group rounded-2xl border border-[#e2d98f]/50 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-[#e2d98f]">
      <div className="grid gap-5 lg:grid-cols-[1fr_200px] lg:items-start">
        
        <div className="flex flex-col gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              {noticia.categoria}
            </span>
            <h3 className="mt-2 text-xl font-bold text-slate-900 group-hover:text-emerald-900 transition-colors">
              {noticia.titulo}
            </h3>
          </div>

          {noticia.imagenUrl && (
            <div className="overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
              <img 
                src={noticia.imagenUrl} 
                alt={noticia.titulo} 
                className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105" 
              />
            </div>
          )}

          {/* Contenedor de contenido con Referencia (ref) */}
          <div 
            ref={contentRef}
            className={`max-w-none overflow-hidden text-sm leading-relaxed text-slate-600 transition-all duration-300 ${
              isExpanded ? 'line-clamp-none' : 'line-clamp-3'
            }`} 
            dangerouslySetInnerHTML={{ __html: noticia.contenido }} 
          />

          {/* El botón SOLO aparece si hay desbordamiento (isOverflowing) 
              O si ya está expandido (para poder cerrarlo) */}
          {(isOverflowing || isExpanded) && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-1 flex items-center gap-1 text-sm font-bold text-emerald-700 hover:text-emerald-900 transition-colors w-fit underline-offset-4 hover:underline"
            >
              {isExpanded ? 'Ver menos ▲' : 'Leer más ▼'}
            </button>
          )}
        </div>

        {/* Metadatos */}
        <div className="flex lg:flex-col gap-3 lg:gap-1.5 text-[12px] text-slate-500 lg:text-right border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
          <div className="flex-1">
            <p className="font-medium text-slate-400 uppercase text-[9px] tracking-wider">Fecha</p>
            <p className="text-slate-700">{noticia.createdAt}</p>
          </div>
          <div className="flex-1">
            <p className="font-medium text-slate-400 uppercase text-[9px] tracking-wider">Autor</p>
            <p className="text-slate-700 italic">{noticia.autor?.nombre || 'Administrador'}</p>
          </div>
        </div>
      </div>
    </article>
  );
}

export function NewsList({ noticias }: NewsListProps) {
  if (noticias.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-10 text-center text-slate-500 text-sm">
        No se encontraron noticias con esos filtros.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {noticias.map((noticia) => (
        <NewsCard key={noticia.id} noticia={noticia} />
      ))}
    </div>
  );
}