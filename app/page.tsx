import { getFinancialSummary } from './actions';
import { Dashboard } from '@/components/Dashboard';
import { Graficos } from '@/components/Graficos';
import { TablaMovimientos } from '@/components/TablaMovimientos';
import { Navbar } from '@/components/Navbar';

export default async function Home() {
  const data = await getFinancialSummary();

  if ('error' in data) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-red-600">Error al cargar los datos</p>
        </div>
      </div>
    );
  }

  const movimientos = [
    ...data.ingresos.map((ing) => ({
      id: ing.id,
      monto: Number(ing.monto),
      descripcion: ing.descripcion,
      categoria: ing.categoria,
      fecha: ing.fecha,
      tipo: 'ingreso' as const,
    })),
    ...data.gastos.map((gasto) => ({
      id: gasto.id,
      monto: Number(gasto.monto),
      descripcion: gasto.descripcion,
      categoria: gasto.categoria,
      fecha: gasto.fecha,
      tipo: 'gasto' as const,
    })),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Transparencia Financiera Institucional
          </h1>
          <p className="text-gray-600 mt-2">
            Consulta los movimientos financieros de la institución
          </p>
        </div>

        {/* Dashboard */}
        <section className="mb-8">
          <Dashboard
            totalIngresos={data.totalIngresos}
            totalGastos={data.totalGastos}
            saldo={data.saldo}
          />
        </section>

        {/* Gráficos */}
        <section className="mb-8">
          <Graficos
            ingresos={data.ingresos.map((ing) => ({
              categoria: ing.categoria,
              monto: Number(ing.monto),
            }))}
            gastos={data.gastos.map((gasto) => ({
              categoria: gasto.categoria,
              monto: Number(gasto.monto),
            }))}
          />
        </section>

        {/* Tabla de Movimientos */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Movimientos Financieros
          </h2>
          <TablaMovimientos movimientos={movimientos} />
        </section>
      </main>
    </div>
  );
}
