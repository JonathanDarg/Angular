import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Product } from '../product';

// Used in section 6. This child only DISPLAYS products and REPORTS clicks.
// It doesn't know a cart exists: the parent decides what "add" means.
@Component({
  selector: 'app-product-list',
  imports: [CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h3>Products (child A)</h3>
    <ul>
      @for (product of products(); track product.id) {
        <li>
          {{ product.name }} · {{ product.price | currency }}
          <!-- Send the clicked product up to the parent -->
          <button type="button" (click)="add.emit(product)">Add</button>
        </li>
      }
    </ul>
  `,
})
export class ProductList {
  // Data comes DOWN from the parent...
  readonly products = input.required<Product[]>();
  // ...and events go UP to the parent.
  readonly add = output<Product>();
}
