'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface ChartData {
  categoria: string;
  ingresos: number;
  gastos: number;
}

interface GraficosProps {
  ingresos: Array<{ categoria: string; monto: number }>;
  gastos: Array<{ categoria: string; monto: number }>;
}

export function Graficos({ ingresos, gastos }: GraficosProps) {
  // Preparar datos para gráfico de barras
  const categorias = new Set([
    ...ingresos.map((i) => i.categoria),
    ...gastos.map((g) => g.categoria),
  ]);

  const chartData: ChartData[] = Array.from(categorias).map((categoria) => ({
    categoria,
    ingresos:
      ingresos
        .filter((i) => i.categoria === categoria)
        .reduce((sum, i) => sum + Number(i.monto), 0) || 0,
    gastos:
      gastos
        .filter((g) => g.categoria === categoria)
        .reduce((sum, g) => sum + Number(g.monto), 0) || 0,
  }));

  // Datos para gráfico de torta
  const pieData = [
    {
      name: 'Ingresos',
      value: ingresos.reduce((sum, i) => sum + Number(i.monto), 0),
    },
    {
      name: 'Gastos',
      value: gastos.reduce((sum, g) => sum + Number(g.monto), 0),
    },
  ];

  const COLORS = ['#10b981', '#ef4444'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de Barras */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Ingresos vs Gastos por Categoría
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="categoria" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="ingresos" fill="#10b981" />
            <Bar dataKey="gastos" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de Torta */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Proporción Ingresos / Gastos
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: $${value.toLocaleString()}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {COLORS.map((color, index) => (
                <Cell key={`cell-${index}`} fill={color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
