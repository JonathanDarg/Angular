import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { APP_SETTINGS } from '../app-settings';
import { User } from '../models';

// Keeping HTTP calls in a service (not in components) means:
// - components stay small and only deal with displaying data
// - every component that needs users calls the same method
@Injectable({ providedIn: 'root' })
export class UserApiService {
  // HttpClient is itself a service. It only works because app.config.ts
  // calls provideHttpClient().
  private readonly http = inject(HttpClient);

  // The base URL comes from the APP_SETTINGS token instead of being hard-coded.
  private readonly apiUrl = inject(APP_SETTINGS).apiUrl;

  // http.get<User[]>() returns an Observable: a description of a request.
  // NOTHING is sent until someone subscribes (the async pipe does that in the template).
  // The <User[]> tells TypeScript what shape the JSON response has.
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }
}
