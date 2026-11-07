// Shapes of the data returned by the practice API (https://jsonplaceholder.typicode.com).
// Only the fields we use are listed; TypeScript ignores the rest.
export interface User {
  id: number;
  name: string;
  email: string;
  company: { name: string };
}

// Section 6: movie files served from this project's public/movies/ folder
// (e.g. public/movies/3.json is available at /movies/3.json).
export interface Movie {
  id: number;
  title: string;
  year: number;
  director: string;
  genres: string[];
  summary: string;
}
