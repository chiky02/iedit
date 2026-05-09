import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[#1b4729] text-white border-t border-white/10">
  <div className="mx-auto max-w-7xl px-6 py-8 md:py-10">
    <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
      
      {/* Sección de Copyright */}
      <div className="text-center md:text-left">
        <p className="text-sm font-medium tracking-wide text-slate-200">
          © {new Date().getFullYear()} Contraloría. 
          <span className="block sm:inline ml-1">Todos los derechos reservados.</span>
        </p>
      </div>

      {/* Sección de Colaboración */}
      <div className="flex flex-col items-center gap-3 sm:flex-row md:gap-4">
        <span className="text-xs uppercase tracking-widest text-slate-300 font-bold">
          En colaboración con
        </span>
        <Link 
          href="https://chiky02.github.io/portfolio/" 
          className="transition-transform hover:scale-110 active:scale-95"
          aria-label="Ver portafolio de Chiky02"
        >
          <img 
            src="/src/chiky02.png" 
            alt="Logo de colaborador" 
            className="h-10 w-10 rounded-xl object-cover ring-2 ring-white/20 shadow-lg" 
          />
        </Link>
      </div>

    </div>
  </div>
</footer>
  );
}
