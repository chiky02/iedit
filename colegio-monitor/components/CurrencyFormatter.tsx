'use client';

interface CurrencyFormatterProps {
  value: number | string;
  showSymbol?: boolean;
}

export function CurrencyFormatter({
  value,
  showSymbol = true,
}: CurrencyFormatterProps) {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  const formatted = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numValue);

  return <span>{formatted}</span>;
}
