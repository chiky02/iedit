import { Navbar } from '@/components/Navbar';
import { SuggestionForm } from '@/components/SuggestionForm';

export default function SuggestionPage() {
  return (
   <div className="min-h-screen bg-[#faf7e4] text-slate-900">
  <Navbar />
  <main className="max-w-5xl mx-auto px-4 py-8 sm:py-10">
    <section className="rounded-[32px] border border-[#e2d98f] bg-white/90 p-5 sm:p-6 lg:p-8 shadow-lg shadow-slate-200/40 mb-10">
      
      
        <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.24em] text-[#276749]">
          Sugerencias anónimas
        </p>

        <h1 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">
          Envía tu sugerencia a la institución
        </h1>

        <p className="mt-4 text-sm sm:text-base text-slate-700 leading-relaxed">
          Usa este espacio para enviar ideas, mejoras o reportar incidencias. Puedes hacerlo de forma anónima o dejar tus datos de contacto.
        </p>
   

    </section>

    <SuggestionForm />
  </main>
</div>
  );
}
