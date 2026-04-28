'use client';

import { CurrencyFormatter } from './CurrencyFormatter';

interface Movimiento {
  id: string;
  monto: number;
  descripcion: string;
  categoria: string;
  fecha: Date;
  tipo: 'ingreso' | 'gasto';
}

interface TablaMuimoentosProps {
  movimientos: Movimiento[];
}

export function TablaMovimientos({ movimientos }: TablaMuimoentosProps) {
  const movimientosOrdenados = movimientos.sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-200">
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Fecha
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Descripción
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Categoría
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Tipo
            </th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
              Monto
            </th>
          </tr>
        </thead>
        <tbody>
          {movimientosOrdenados.map((mov) => (
            <tr
              key={mov.id}
              className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <td className="px-6 py-3 text-sm text-gray-900">
                {new Date(mov.fecha).toLocaleDateString('es-CO')}
              </td>
              <td className="px-6 py-3 text-sm text-gray-900">
                {mov.descripcion}
              </td>
              <td className="px-6 py-3 text-sm">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {mov.categoria}
                </span>
              </td>
              <td className="px-6 py-3 text-sm">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    mov.tipo === 'ingreso'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {mov.tipo === 'ingreso' ? 'Ingreso' : 'Gasto'}
                </span>
              </td>
              <td
                className={`px-6 py-3 text-sm font-semibold text-right ${
                  mov.tipo === 'ingreso' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {mov.tipo === 'ingreso' ? '+' : '-'}
                <CurrencyFormatter value={mov.monto} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
