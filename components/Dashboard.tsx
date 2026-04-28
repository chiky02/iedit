'use client';

import { CurrencyFormatter } from './CurrencyFormatter';

interface DashboardProps {
  totalIngresos: number;
  totalGastos: number;
  saldo: number;
}

export function Dashboard({ totalIngresos = 0, totalGastos = 0, saldo = 0 }: DashboardProps) {
  // Aseguramos que los valores sean tratados como números (evita errores de Prisma Decimal)
  const ingresosNum = Number(totalIngresos) || 0;
  const gastosNum = Number(totalGastos) || 0;
  const saldoNum = Number(saldo) || 0;

  const tarjetas = [
    {
      title: 'Total Ingresos',
      value: ingresosNum,
      icon: '📈',
      color: 'bg-green-50 border-green-200',
      textColor: 'text-green-700',
    },
    {
      title: 'Total Gastos',
      value: gastosNum,
      icon: '📉',
      color: 'bg-red-50 border-red-200',
      textColor: 'text-red-700',
    },
    {
      title: 'Saldo',
      value: saldoNum,
      icon: '💰',
      color: saldoNum >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-yellow-50 border-yellow-200',
      textColor: saldoNum >= 0 ? 'text-blue-700' : 'text-yellow-700',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {tarjetas.map((tarjeta) => (
        <div
          key={tarjeta.title}
          className={`${tarjeta.color} border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow`}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">
                {tarjeta.title}
              </p>
              <div className={`text-2xl font-bold ${tarjeta.textColor}`}>
                {/* Pasamos el valor limpio al formateador */}
                <CurrencyFormatter value={tarjeta.value} />
              </div>
            </div>
            <span className="text-3xl" role="img" aria-label="icon">
              {tarjeta.icon}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}