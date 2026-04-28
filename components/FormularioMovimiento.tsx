'use client';

import { useState } from 'react';
import { createIngresoAction, createGastoAction } from '@/app/actions';

interface FormularioMovimientoProps {
  tipo: 'ingreso' | 'gasto';
  // IMPORTANTE: Ahora deberías pasar las subcategorías reales desde la base de datos
  // Pero para que no te rompa el código, aquí te doy la solución
  onSuccess?: () => void;
}

export function FormularioMovimiento({ tipo, onSuccess }: FormularioMovimientoProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // NOTA: Estos IDs deberían venir de tu base de datos (npx prisma studio para verlos)
  // Por ahora, el formulario enviará el valor. Asegúrate de que coincida con un ID real.
  const categorias =
    tipo === 'ingreso'
      ? [
          { id: 'cm_matricula_01', nombre: 'Matrícula' },
          { id: 'cm_donacion_02', nombre: 'Donaciones' },
        ]
      : [
          { id: 'cm_nomina_01', nombre: 'Nómina' },
          { id: 'cm_servicios_02', nombre: 'Servicios' },
        ];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const monto = parseFloat(formData.get('monto') as string);
    const descripcion = formData.get('descripcion') as string;
    const subId = formData.get('subcategoriaId') as string; // Cambiado a ID
    const fecha = formData.get('fecha') as string;

    try {
      // Llamamos a las acciones que corregimos antes
      const result = tipo === 'ingreso' 
        ? await createIngresoAction(monto, descripcion, subId, fecha)
        : await createGastoAction(monto, descripcion, subId, fecha);

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        (e.target as HTMLFormElement).reset();
        setTimeout(() => {
          setSuccess(false);
          onSuccess?.();
        }, 2000);
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Agregar {tipo === 'ingreso' ? 'Ingreso' : 'Gasto'}
      </h3>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">Registro guardado con éxito</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Monto (COP)</label>
          <input
            type="number"
            name="monto"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
          <select
            name="subcategoriaId" // Coincide con lo que espera el Action
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Selecciona una...</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
          <input type="date" name="fecha" required className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none" />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <textarea
            name="descripcion"
            required
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none"
            placeholder="¿En qué se gastó o de dónde entró?"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-all"
      >
        {loading ? 'Guardando...' : `Registrar ${tipo}`}
      </button>
    </form>
  );
}