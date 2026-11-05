import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

// Used in section 5: shows model(), a two-way binding between parent and child.
@Component({
  selector: 'app-toggle-switch',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- role="switch" + aria-checked tells screen readers this is an on/off switch -->
    <button
      type="button"
      role="switch"
      [attr.aria-checked]="checked()"
      [class.on]="checked()"
      (click)="toggle()"
    >
      {{ label() }}: {{ checked() ? 'ON' : 'OFF' }}
    </button>
  `,
  styles: `
    button { padding: 0.4rem 0.9rem; border-radius: 999px; border: 1px solid #555; background: #eee; color: #1a1a1a; cursor: pointer; }
    button.on { background: #1b5e20; color: #fff; }
  `,
})
export class ToggleSwitch {
  readonly label = input('Switch');

  // model() is like input(), but the CHILD can also change it.
  // When the child calls checked.set(...), the new value flows back up
  // to whatever signal the parent bound with [(checked)]="...".
  readonly checked = model(false);

  protected toggle(): void {
    this.checked.update((value) => !value);
  }
}
