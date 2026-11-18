import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

export interface ApiMovie {
  id: number;
  title: string;
  runtime: number;
}

// A service that uses HttpClient. It isn't used on the page (there's no real
// server), but movie-api.service.spec.ts shows how to test HTTP code
// with a FAKE backend, so tests never send real requests.
@Injectable({ providedIn: 'root' })
export class MovieApiService {
  private readonly http = inject(HttpClient);

  getMovie(id: number): Observable<ApiMovie> {
    return this.http.get<ApiMovie>(`/api/movies/${id}`);
  }

  // Asks the server for search results and returns only the titles.
  searchTitles(query: string): Observable<string[]> {
    return this.http
      .get<ApiMovie[]>('/api/movies', { params: { q: query } })
      .pipe(map((movies) => movies.map((m) => m.title)));
  }
}
