import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { CartSummary } from './cart-summary/cart-summary';
import { GreetingCard } from './greeting-card/greeting-card';
import { Product } from './product';
import { ProductList } from './product-list/product-list';
import { ToggleSwitch } from './toggle-switch/toggle-switch';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, GreetingCard, ToggleSwitch, ProductList, CartSummary],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  // Used by the starter placeholder at the top of app.html.
  protected readonly title = signal('02-signals');

  // ---- 1. signal() ----
  // signal(initialValue) creates a writable signal. TypeScript infers the type (number).
  protected readonly count = signal(0);

  // For arrays/objects, give the type explicitly when it can't be inferred well.
  protected readonly fruits = signal<string[]>(['apple', 'banana']);

  protected increment(): void {
    // update() receives the current value and returns the new one.
    this.count.update((c) => c + 1);
  }

  protected decrement(): void {
    this.count.update((c) => c - 1);
  }

  protected reset(): void {
    // set() replaces the value, ignoring the old one.
    this.count.set(0);
  }

  protected addFruit(name: string): void {
    const fruit = name.trim();
    if (!fruit) return;
    // Spread into a NEW array. Pushing into the old array would not notify the signal,
    // because the signal compares old vs new by reference and would see "same array".
    this.fruits.update((list) => [...list, fruit]);
  }

  // ---- 2. computed() ----
  // computed(() => ...) reads other signals. Angular tracks which ones it read,
  // and recalculates only when one of those changes. The result is read-only.
  protected readonly doubled = computed(() => this.count() * 2);
  protected readonly isEven = computed(() => this.count() % 2 === 0);
  protected readonly fruitCount = computed(() => this.fruits().length);

  protected readonly price = signal(5);
  protected readonly quantity = signal(1);
  // Depends on TWO signals: changes when either price or quantity changes.
  protected readonly total = computed(() => this.price() * this.quantity());

  protected onQuantityInput(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    this.quantity.set(Number.isFinite(value) && value >= 0 ? value : 0);
  }

  // ---- 3. effect() ----
  // inject() gets an Angular service. Title lets us change the browser tab's title.
  // (Services and inject() are covered properly in folder 03.)
  private readonly tabTitle = inject(Title);

  constructor() {
    // An effect runs once right away, then again every time a signal it read changes.
    // Effects must be created in a constructor or field initializer (an "injection context").
    effect(() => {
      this.tabTitle.setTitle(`Count: ${this.count()} · 02-signals`);
    });

    effect(() => {
      console.log(`[effect] count is now ${this.count()}, doubled is ${this.doubled()}`);
    });
  }

  // ---- 4. input() / output() ----
  protected readonly lastWave = signal('');

  // Called when a GreetingCard emits its `wave` output. `name` is the emitted value ($event).
  protected onWave(name: string): void {
    this.lastWave.set(`${name} waved at you 👋`);
  }

  // ---- 5. model() ----
  // Bound two-way to the ToggleSwitch with [(checked)]="notificationsOn".
  // The child can write to this signal through its model() input.
  protected readonly notificationsOn = signal(true);

  // ---- 6. Component communication ----
  // A plain array is fine for data that never changes.
  protected readonly products: Product[] = [
    { id: 1, name: 'Notebook', price: 4.5 },
    { id: 2, name: 'Pen', price: 1.25 },
    { id: 3, name: 'Backpack', price: 32 },
  ];

  // The shared state lives in the PARENT, so both children can use it.
  protected readonly cart = signal<Product[]>([]);

  protected addToCart(product: Product): void {
    this.cart.update((items) => [...items, product]);
  }

  protected clearCart(): void {
    this.cart.set([]);
  }
}
