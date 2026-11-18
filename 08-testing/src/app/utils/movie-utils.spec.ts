import { averageRating, formatRuntime } from './movie-utils';

// UNIT TESTS for plain functions. No Angular, no TestBed: just call and check.
//
// describe(...) groups related tests. it(...) is ONE test, named like a sentence.
// expect(actual).toBe(expected) fails the test if they differ.
// (describe, it, expect come from Vitest. "vitest/globals" in tsconfig.spec.json
//  makes them available without importing.)

describe('formatRuntime', () => {
  it('shows hours and minutes', () => {
    expect(formatRuntime(142)).toBe('2h 22m');
  });

  it('leaves out hours when under an hour', () => {
    expect(formatRuntime(45)).toBe('45m');
  });

  it('leaves out minutes on the hour', () => {
    expect(formatRuntime(120)).toBe('2h');
  });

  // it.each runs the same test for every row of a table. Great for many small cases.
  it.each([
    [0, '0m'],
    [59, '59m'],
    [60, '1h'],
    [61, '1h 1m'],
  ])('formatRuntime(%i) is "%s"', (minutes, expected) => {
    expect(formatRuntime(minutes)).toBe(expected);
  });

  // Testing the "sad path" matters as much as the happy path.
  // toThrow checks that calling the function throws an error.
  it('rejects negative or fractional minutes', () => {
    expect(() => formatRuntime(-5)).toThrow('whole number');
    expect(() => formatRuntime(1.5)).toThrow();
  });
});

describe('averageRating', () => {
  it('averages the ratings', () => {
    expect(averageRating([4, 5, 3])).toBe(4);
  });

  it('rounds to one decimal place', () => {
    expect(averageRating([5, 4, 4])).toBe(4.3);
  });

  it('returns null when there are no ratings', () => {
    expect(averageRating([])).toBeNull();
  });
});
