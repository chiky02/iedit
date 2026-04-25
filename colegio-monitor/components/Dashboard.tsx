'use client';

import { CurrencyFormatter } from './CurrencyFormatter';

interface DashboardProps {
  totalIngresos: number;
  totalGastos: number;
  saldo: number;
}

export function Dashboard({ totalIngresos, totalGastos, saldo }: DashboardProps) {
  const tarjetas = [
    {
      title: 'Total Ingresos',
      value: totalIngresos,
      icon: '📈',
      color: 'bg-green-50 border-green-200',
      textColor: 'text-green-700',
    },
    {
      title: 'Total Gastos',
      value: totalGastos,
      icon: '📉',
      color: 'bg-red-50 border-red-200',
      textColor: 'text-red-700',
    },
    {
      title: 'Saldo',
      value: saldo,
      icon: '💰',
      color: saldo >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-yellow-50 border-yellow-200',
      textColor: saldo >= 0 ? 'text-blue-700' : 'text-yellow-700',
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
              <p className={`text-2xl font-bold ${tarjeta.textColor}`}>
                <CurrencyFormatter value={tarjeta.value} />
              </p>
            </div>
            <span className="text-3xl">{tarjeta.icon}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
