import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { Mock } from 'vitest';
import { SearchBox } from './search-box';

// Testing code that WAITS (setTimeout, debounce) without slowing the tests down.
// vi.useFakeTimers() replaces the real clock with one the test controls:
// time only moves when the test calls vi.advanceTimersByTime(ms).

describe('SearchBox', () => {
  let fixture: ComponentFixture<SearchBox>;
  let input: HTMLInputElement;
  // Mock<(value: string) => void>: a spy shaped like the output's handler.
  let searchSpy: Mock<(value: string) => void>;

  beforeEach(async () => {
    vi.useFakeTimers();

    await TestBed.configureTestingModule({ imports: [SearchBox] }).compileComponents();
    fixture = TestBed.createComponent(SearchBox);
    searchSpy = vi.fn();
    fixture.componentInstance.search.subscribe(searchSpy);
    fixture.detectChanges();
    input = fixture.nativeElement.querySelector('input');
  });

  // Always put the real clock back, or other test files would break.
  afterEach(() => {
    vi.useRealTimers();
  });

  // Simulates a user typing: set the value, then fire the "input" event.
  function type(text: string): void {
    input.value = text;
    input.dispatchEvent(new Event('input'));
  }

  it('waits 300 ms before emitting', () => {
    type('matrix');

    vi.advanceTimersByTime(299);
    expect(searchSpy).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(searchSpy).toHaveBeenCalledWith('matrix');
  });

  it('only emits the last value when typing quickly', () => {
    type('m');
    vi.advanceTimersByTime(100);
    type('ma');
    vi.advanceTimersByTime(100);
    type('mat');
    vi.advanceTimersByTime(300);

    expect(searchSpy).toHaveBeenCalledTimes(1);
    expect(searchSpy).toHaveBeenCalledWith('mat');
  });

  it('trims spaces from the search text', () => {
    type('  toy story  ');
    vi.advanceTimersByTime(300);
    expect(searchSpy).toHaveBeenCalledWith('toy story');
  });
});
