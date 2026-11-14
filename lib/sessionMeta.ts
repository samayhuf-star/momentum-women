export const SECONDS_PER_MOVE = 40;

export function sessionSeconds(exerciseCount: number): number {
  return Math.max(0, exerciseCount) * SECONDS_PER_MOVE;
}

export function formatSessionLength(exerciseCount: number): string {
  const seconds = sessionSeconds(exerciseCount);
  if (seconds <= 0) return '0 min';
  const minutes = Math.max(1, Math.round(seconds / 60));
  return `${minutes} min`;
}

export function formatClock(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export function planLevel(difficulties: string[]): string {
  const unique = [...new Set(difficulties.filter(Boolean))];
  if (unique.length === 0) return 'All levels';
  if (unique.length === 1) return unique[0];
  return 'Mixed';
}

export function planEquipment(items: string[]): string {
  const unique = [...new Set(items.filter(Boolean))];
  if (unique.length === 0) return 'None';
  return unique.join(' · ');
}

export function isoDay(date: Date): string {
  return date.toISOString().split('T')[0];
}

/** Calendar keys for the `count` days ending today, oldest first. Uses the same UTC day key as stored progress. */
export function recentDayKeys(count: number, from: Date = new Date()): string[] {
  const keys: string[] = [];
  for (let i = count - 1; i >= 0; i -= 1) {
    const date = new Date(from);
    date.setDate(date.getDate() - i);
    keys.push(isoDay(date));
  }
  return keys;
}
