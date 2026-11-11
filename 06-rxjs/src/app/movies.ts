// Shared movie data for the lessons (same movies as folders 03 and 04).
export interface Movie {
  id: number;
  title: string;
  year: number;
}

export const MOVIES: readonly Movie[] = [
  { id: 1, title: 'The Shawshank Redemption', year: 1994 },
  { id: 2, title: 'The Godfather', year: 1972 },
  { id: 3, title: 'Spirited Away', year: 2001 },
  { id: 4, title: 'The Dark Knight', year: 2008 },
  { id: 5, title: 'Toy Story', year: 1995 },
  { id: 6, title: 'Jurassic Park', year: 1993 },
  { id: 7, title: 'The Matrix', year: 1999 },
  { id: 8, title: 'Back to the Future', year: 1985 },
  { id: 9, title: 'Inception', year: 2010 },
  { id: 10, title: 'Finding Nemo', year: 2003 },
];
