import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Product } from '../product';

// Used in section 6. This child receives the cart from the parent and shows a summary.
// It never talks to ProductList directly: siblings communicate THROUGH the parent.
@Component({
  selector: 'app-cart-summary',
  imports: [CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h3>Cart (child B)</h3>
    <p aria-live="polite">{{ items().length }} item(s) · Total: {{ total() | currency }}</p>
    <button type="button" (click)="clear.emit()" [disabled]="items().length === 0">Clear cart</button>
  `,
})
export class CartSummary {
  readonly items = input.required<Product[]>();

  // Derived from the input: recalculates whenever the parent sends a new cart.
  protected readonly total = computed(() => this.items().reduce((sum, p) => sum + p.price, 0));

  // output() with no type means "void": the event carries no data, it just signals "clear".
  readonly clear = output();
}
