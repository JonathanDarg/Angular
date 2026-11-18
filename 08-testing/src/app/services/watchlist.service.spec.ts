import { TestBed } from '@angular/core/testing';
import { WatchlistService } from './watchlist.service';

// Testing a SERVICE. TestBed is Angular's testing "app": it sets up dependency
// injection so we can ask for the service the same way a component would.

describe('WatchlistService', () => {
  let service: WatchlistService;

  // beforeEach runs before EVERY test, so each test starts with a fresh service.
  // Tests must never depend on each other.
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WatchlistService);
  });

  it('starts empty', () => {
    expect(service.count()).toBe(0);
    expect(service.titles()).toEqual([]);
  });

  it('adds a title', () => {
    service.add('Inception');

    // toEqual compares contents (arrays/objects). toBe would compare identity.
    expect(service.titles()).toEqual(['Inception']);
    // count is a computed() signal: reading it in a test works like anywhere else.
    expect(service.count()).toBe(1);
  });

  it('ignores blanks and duplicates', () => {
    service.add('Inception');
    service.add('Inception');
    service.add('   ');

    expect(service.titles()).toEqual(['Inception']);
  });

  it('removes a title', () => {
    service.add('Inception');
    service.add('Toy Story');

    service.remove('Inception');

    expect(service.titles()).toEqual(['Toy Story']);
  });
});
