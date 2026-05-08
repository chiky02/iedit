'use client';

import { useState } from 'react';

export function SuggestionForm() {
  const [mensaje, setMensaje] = useState('');
  const [remitente, setRemitente] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensaje, remitente: remitente || null, email: email || null }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus({ type: 'error', text: data?.error || 'Error al enviar la sugerencia' });
      } else {
        setStatus({ type: 'success', text: 'Sugerencia enviada. Gracias por colaborar.' });
        setMensaje('');
        setRemitente('');
        setEmail('');
      }
    } catch (error) {
      setStatus({ type: 'error', text: 'Error de conexión. Intenta nuevamente.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-3xl border border-[#dfe9db] bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Enviar sugerencia</h2>
      <p className="mt-2 text-sm text-slate-600">Puedes enviar tu mensaje de forma anónima o dejar un contacto opcional.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        {status && (
          <div
            className={`rounded-3xl border px-4 py-3 text-sm font-medium ${
              status.type === 'success' ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-rose-300 bg-rose-50 text-rose-700'
            }`}
          >
            {status.text}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700">Mensaje *</label>
          <textarea
            value={mensaje}
            onChange={(event) => setMensaje(event.target.value)}
            rows={6}
            className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none"
            placeholder="Escribe tu sugerencia aquí..."
            required
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700">Nombre (opcional)</label>
            <input
              type="text"
              value={remitente}
              onChange={(event) => setRemitente(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none"
              placeholder="Tu nombre"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Email (opcional)</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none"
              placeholder="contacto@ejemplo.com"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || mensaje.trim().length < 10}
          className="w-full rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {loading ? 'Enviando...' : 'Enviar sugerencia'}
        </button>
      </form>
    </div>
  );
}
