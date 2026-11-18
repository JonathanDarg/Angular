// Short excerpts of the real test files, shown on the page inside <pre> blocks.
// (They live here as strings because { } and @ inside a template would be read
//  as Angular syntax.) Open the .spec.ts files to see every test with comments.

export const UNIT_SNIPPET = `// src/app/utils/movie-utils.spec.ts
describe('formatRuntime', () => {
  it('shows hours and minutes', () => {
    expect(formatRuntime(142)).toBe('2h 22m');
  });

  it.each([
    [0, '0m'],
    [60, '1h'],
    [61, '1h 1m'],
  ])('formatRuntime(%i) is "%s"', (minutes, expected) => {
    expect(formatRuntime(minutes)).toBe(expected);
  });

  it('rejects negative or fractional minutes', () => {
    expect(() => formatRuntime(-5)).toThrow('whole number');
  });
});`;

export const SERVICE_SNIPPET = `// src/app/services/watchlist.service.spec.ts
beforeEach(() => {
  TestBed.configureTestingModule({});
  service = TestBed.inject(WatchlistService);
});

it('ignores blanks and duplicates', () => {
  service.add('Inception');
  service.add('Inception');
  service.add('   ');
  expect(service.titles()).toEqual(['Inception']);
});`;

export const HTTP_SNIPPET = `// src/app/services/movie-api.service.spec.ts
TestBed.configureTestingModule({
  providers: [provideHttpClient(), provideHttpClientTesting()],
});

it('GETs a movie by id', () => {
  service.getMovie(9).subscribe((movie) => (result = movie));

  const req = httpTesting.expectOne('/api/movies/9');
  expect(req.request.method).toBe('GET');
  req.flush({ id: 9, title: 'Inception', runtime: 148 });

  expect(result?.title).toBe('Inception');
});`;

export const COMPONENT_SNIPPET = `// src/app/components/rating-stars.spec.ts
it('emits the clicked star number', async () => {
  const ratedSpy = vi.fn();
  fixture.componentInstance.rated.subscribe(ratedSpy);
  await fixture.whenStable();

  buttons()[3].click();          // click the 4th star

  expect(ratedSpy).toHaveBeenCalledWith(4);
});

it('fills in stars up to the rating input', async () => {
  fixture.componentRef.setInput('rating', 3);
  await fixture.whenStable();
  expect(buttons().filter((b) => b.classList.contains('filled')).length).toBe(3);
});`;

export const FAKE_TIMERS_SNIPPET = `// src/app/components/search-box.spec.ts
beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

it('waits 300 ms before emitting', () => {
  type('matrix');
  vi.advanceTimersByTime(299);
  expect(searchSpy).not.toHaveBeenCalled();

  vi.advanceTimersByTime(1);
  expect(searchSpy).toHaveBeenCalledWith('matrix');
});`;

export const E2E_SNIPPET = `// e2e/lessons.spec.ts
test('rating a movie updates the message', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Rate 4 out of 5' }).click();

  await expect(page.getByTestId('rating-message')).toHaveText('You rated it 4 out of 5.');
});`;
