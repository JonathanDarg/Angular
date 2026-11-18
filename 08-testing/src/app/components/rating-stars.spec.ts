import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RatingStars } from './rating-stars';

// COMPONENT TESTS: create the component in a test page, set its inputs,
// look at what it rendered, and click things like a user would.

describe('RatingStars', () => {
  // The fixture wraps the component: fixture.nativeElement is its HTML,
  // fixture.componentRef lets us set inputs.
  let fixture: ComponentFixture<RatingStars>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [RatingStars] }).compileComponents();
    fixture = TestBed.createComponent(RatingStars);
    element = fixture.nativeElement;
  });

  // A small helper so tests read clearly.
  function buttons(): HTMLButtonElement[] {
    return Array.from(element.querySelectorAll('button'));
  }

  it('shows 5 stars by default', async () => {
    // whenStable() waits for Angular to finish rendering.
    await fixture.whenStable();
    expect(buttons().length).toBe(5);
  });

  it('fills in stars up to the rating input', async () => {
    // setInput() is how a test passes an input, like <app-rating-stars [rating]="3" />
    fixture.componentRef.setInput('rating', 3);
    await fixture.whenStable();

    const filled = buttons().filter((b) => b.classList.contains('filled'));
    expect(filled.length).toBe(3);
    expect(buttons()[2].getAttribute('aria-pressed')).toBe('true');
    expect(buttons()[3].getAttribute('aria-pressed')).toBe('false');
  });

  it('respects a custom max', async () => {
    fixture.componentRef.setInput('max', 10);
    await fixture.whenStable();
    expect(buttons().length).toBe(10);
  });

  it('emits the clicked star number', async () => {
    // vi.fn() makes a "spy": a fake function that records how it was called.
    const ratedSpy = vi.fn();
    // Outputs can be subscribed to directly in tests.
    fixture.componentInstance.rated.subscribe(ratedSpy);
    await fixture.whenStable();

    // Click the 4th star, exactly like a user.
    buttons()[3].click();

    expect(ratedSpy).toHaveBeenCalledTimes(1);
    expect(ratedSpy).toHaveBeenCalledWith(4);
  });

  it('labels every star for screen readers', async () => {
    await fixture.whenStable();
    expect(buttons()[0].getAttribute('aria-label')).toBe('Rate 1 out of 5');
  });
});
