/**
 * Normalizes Vietnamese text (removes diacritics and lowercases)
 * so Command Palette & real-time search match both "tiền" and "tien", "Hà Nội" and "hanoi".
 */
export function normalizeText(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .trim();
}

export function matchesSearchQuery(query: string, fields: Array<string | undefined | null>): boolean {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return true;

  const tokens = normalizedQuery.split(/\s+/).filter(Boolean);
  const haystack = normalizeText(fields.filter(Boolean).join(' '));

  return tokens.every((token) => haystack.includes(token));
}

export function formatRelativeDate(isoDate?: string): string {
  if (!isoDate) return 'Đang phát triển';
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return 'Gần đây';
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function detectServerPlatform(url?: string): 'vercel' | 'render' | 'streamlit' | 'static' | 'none' {
  if (!url || !url.trim()) return 'none';
  const lower = url.toLowerCase();
  if (lower.includes('onrender.com') || lower.includes('render.com')) return 'render';
  if (lower.includes('vercel.app')) return 'vercel';
  if (lower.includes('streamlit.app')) return 'streamlit';
  return 'static';
}
