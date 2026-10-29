/** Money is kept in integer cents, so sums never pick up floating-point noise. */
export type Cents = number;

/** "500", "500.5", "500.25" → 50025. Returns null for anything that isn't a plain positive amount. */
export function parseCents(text: string): Cents | null {
  const match = /^(\d{1,9})(?:\.(\d{1,2}))?$/.exec(text.trim());
  if (!match) return null;
  return Number(match[1]) * 100 + Number((match[2] ?? '').padEnd(2, '0'));
}

/** 50025 → "500.25", -842 → "-8.42": the exact decimal string skit-amount formats digit for digit. */
export function toDecimal(cents: Cents): string {
  const sign = cents < 0 ? '-' : '';
  const abs = Math.abs(cents);
  return `${sign}${Math.floor(abs / 100)}.${String(abs % 100).padStart(2, '0')}`;
}

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export function formatUsd(cents: Cents): string {
  return usd.format(toDecimal(cents) as unknown as number);
}

/** Local calendar date as yyyy-mm-dd, the format of <input type="date">. */
export function isoDate(date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  const label = new Date(year, month - 1, day).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  return iso === isoDate() ? `Today, ${label}` : label;
}
