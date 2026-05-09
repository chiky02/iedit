import { Navbar } from '@/components/Navbar';
import { SuggestionForm } from '@/components/SuggestionForm';

export default function SuggestionPage() {
  return (
    <div className="min-h-screen bg-[#faf7e4] text-slate-900 font-sans">
      <Navbar />
      
      {/* Reducimos el padding superior del main para que no quede tan lejos del Navbar */}
      <main className="max-w-4xl mx-auto px-4 py-6 sm:py-8 flex flex-col gap-6">
        
        {/* Cabecera: Reducimos el radius y ajustamos el padding/margen */}
        <section className="rounded-[24px] border border-[#e2d98f] bg-white/95 p-6 lg:p-8 shadow-sm shadow-slate-200/40">
          <header className="max-w-2xl">
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#276749] opacity-90">
              Sugerencias anónimas
            </p>

            {/* Ajustado mt-4 a mt-2 para mayor cohesión */}
            <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
              Envía tu sugerencia a la institución
            </h1>

            {/* Ajustado mt-4 a mt-2 y suavizado el color del texto */}
            <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
              Usa este espacio para enviar ideas, mejoras o reportar incidencias. Puedes hacerlo de forma anónima o dejar tus datos de contacto.
            </p>
          </header>
        </section>

        {/* El formulario ahora queda más cerca gracias al gap-6 del main */}
        <div className="bg-white/40 rounded-[24px]">
          <SuggestionForm />
        </div>
      </main>
    </div>
  );
}