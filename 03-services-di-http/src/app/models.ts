// Shapes of the data returned by the practice API (https://jsonplaceholder.typicode.com).
// Only the fields we use are listed; TypeScript ignores the rest.
export interface User {
  id: number;
  name: string;
  email: string;
  company: { name: string };
}

export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}
