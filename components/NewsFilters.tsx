'use client';

interface NewsFiltersProps {
  currentSort?: 'asc' | 'desc';
}

export function NewsFilters({
  currentSort = 'desc',
}: NewsFiltersProps) {
  return (
    <form method="get" className="flex items-center justify-end">
      <select
        name="sort"
        defaultValue={currentSort}
        onChange={(e) => e.target.form?.submit()}
        className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 appearance-none cursor-pointer focus:border-emerald-400 focus:outline-none pr-5 bg-no-repeat bg-right"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
          backgroundPosition: 'right 4px center',
        }}
      >
        <option value="desc">Más reciente</option>
        <option value="asc">Más antiguo</option>
      </select>
    </form>
  );
}

