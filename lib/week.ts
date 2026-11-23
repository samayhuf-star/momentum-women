/** Local calendar day as YYYY-MM-DD. */
export function dayKey(d: Date = new Date()): string {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

/** Monday of the week containing `d`, at local midnight. */
export function mondayOf(d: Date = new Date()): Date {
  const out = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const offset = (out.getDay() + 6) % 7;
  out.setDate(out.getDate() - offset);
  return out;
}

export function weekDates(d: Date = new Date()): Date[] {
  const start = mondayOf(d);
  return Array.from({ length: 7 }, (_, i) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + i));
}

/** 0 for Monday through 6 for Sunday. */
export const dayIndex = (d: Date = new Date()) => (d.getDay() + 6) % 7;

/** Which programme week we are in, counting from the Monday the programme started. Repeats after `weeks`. */
export function weekIndex(startKey: string | null, weeks: number, now: Date = new Date()): number {
  if (!startKey) return 0;
  const [y, m, d] = startKey.split('-').map(Number);
  const start = mondayOf(new Date(y, (m || 1) - 1, d || 1));
  const diff = Math.floor((mondayOf(now).getTime() - start.getTime()) / (7 * 24 * 3600 * 1000));
  return ((Math.max(0, diff) % weeks) + weeks) % weeks;
}

export const DAY_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const DAY_LONG = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
