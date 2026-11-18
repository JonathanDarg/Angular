import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ApiMovie, MovieApiService } from './movie-api.service';

// Testing a service that makes HTTP requests, WITHOUT a real server.
// provideHttpClientTesting() swaps in a fake backend. HttpTestingController
// lets the test see each request and decide what the "server" answers.

describe('MovieApiService', () => {
  let service: MovieApiService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(MovieApiService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  // afterEach runs after every test. verify() fails the test if a request
  // was sent that the test didn't expect (or answer).
  afterEach(() => {
    httpTesting.verify();
  });

  it('GETs a movie by id', () => {
    const fakeMovie: ApiMovie = { id: 9, title: 'Inception', runtime: 148 };
    let result: ApiMovie | undefined;

    // 1. Subscribe: this is what actually sends the request.
    service.getMovie(9).subscribe((movie) => (result = movie));

    // 2. Find the request. expectOne fails if there isn't exactly one match.
    const req = httpTesting.expectOne('/api/movies/9');
    expect(req.request.method).toBe('GET');

    // 3. Answer it with fake data.
    req.flush(fakeMovie);

    // 4. Check what the service handed back.
    expect(result).toEqual(fakeMovie);
  });

  it('turns search results into a list of titles', () => {
    let titles: string[] = [];
    service.searchTitles('the').subscribe((t) => (titles = t));

    // Match by a function to check the query parameter too.
    const req = httpTesting.expectOne(
      (r) => r.url === '/api/movies' && r.params.get('q') === 'the',
    );
    req.flush([
      { id: 2, title: 'The Godfather', runtime: 175 },
      { id: 7, title: 'The Matrix', runtime: 136 },
    ]);

    expect(titles).toEqual(['The Godfather', 'The Matrix']);
  });

  it('passes server errors on to the caller', () => {
    let status = 0;
    service.getMovie(999).subscribe({ error: (err) => (status = err.status) });

    // flush with an error status pretends the server said "404 Not Found".
    httpTesting.expectOne('/api/movies/999').flush('Not found', { status: 404, statusText: 'Not Found' });

    expect(status).toBe(404);
  });
});
