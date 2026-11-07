import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { APP_SETTINGS } from './app-settings';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      // Tests don't use app.config.ts, so provide what App injects here.
      // provideHttpClientTesting() swaps in a fake backend: no real requests are sent.
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: APP_SETTINGS, useValue: { appName: 'Test', apiUrl: 'http://localhost/test-api' } },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(App);
    // Render once. (whenStable() would wait for the HTTP resources to finish,
    // and the fake backend never answers, so the test would time out.)
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('03 · Services, DI & HTTP');
  });
});
