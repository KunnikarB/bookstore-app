const normalizeBase = (val?: string) => {
  const base = (val || '').trim();
  if (!base) return 'http://localhost:3000/api';
  const trimmed = base.replace(/\/+$/, '');
  if (trimmed.endsWith('/api')) return trimmed;
  return `${trimmed}/api`;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const API_BASE = normalizeBase((import.meta as any)?.env?.VITE_API_URL);
