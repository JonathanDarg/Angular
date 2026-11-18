// Plain functions with no Angular in them. These are the easiest things to test:
// give them input, check the output. Tested in movie-utils.spec.ts.

// 142 → "2h 22m", 90 → "1h 30m", 45 → "45m", 120 → "2h"
export function formatRuntime(minutes: number): string {
  if (!Number.isInteger(minutes) || minutes < 0) {
    throw new Error('Runtime must be a whole number of minutes, 0 or more');
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

// [4, 5, 3] → 4, [4, 5] → 4.5 (rounded to one decimal), [] → null
export function averageRating(ratings: readonly number[]): number | null {
  if (ratings.length === 0) return null;
  const total = ratings.reduce((sum, r) => sum + r, 0);
  return Math.round((total / ratings.length) * 10) / 10;
}
