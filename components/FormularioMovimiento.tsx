'use client';

import { useState } from 'react';
import { createIngresoAction, createGastoAction } from '@/app/actions';

interface FormularioMovimientoProps {
  tipo: 'ingreso' | 'gasto';
  onSuccess?: () => void;
}

export function FormularioMovimiento({
  tipo,
  onSuccess,
}: FormularioMovimientoProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const categorias =
    tipo === 'ingreso'
      ? ['Matrícula', 'Donaciones', 'Actividades', 'Otro']
      : ['Nómina', 'Servicios', 'Mantenimiento', 'Materiales', 'Otro'];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const monto = parseFloat(formData.get('monto') as string);
    const descripcion = formData.get('descripcion') as string;
    const categoria = formData.get('categoria') as string;
    const fecha = formData.get('fecha') as string;

    try {
      const action = tipo === 'ingreso' ? createIngresoAction : createGastoAction;
      const result = await action(monto, descripcion, categoria, fecha);

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        e.currentTarget.reset();
        setTimeout(() => {
          setSuccess(false);
          onSuccess?.();
        }, 2000);
      }
    } catch (err) {
      setError('Error al procesar el formulario');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Agregar {tipo === 'ingreso' ? 'Ingreso' : 'Gasto'}
      </h3>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
          {tipo === 'ingreso' ? 'Ingreso' : 'Gasto'} agregado exitosamente
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Monto */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Monto (COP)
          </label>
          <input
            type="number"
            name="monto"
            step="0.01"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
          />
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categoría
          </label>
          <select
            name="categoria"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecciona una categoría</option>
            {categorias.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Fecha */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha
          </label>
          <input
            type="date"
            name="fecha"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Descripción */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            name="descripcion"
            required
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Detalles del movimiento..."
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
      >
        {loading
          ? 'Procesando...'
          : `Agregar ${tipo === 'ingreso' ? 'Ingreso' : 'Gasto'}`}
      </button>
    </form>
  );
}
