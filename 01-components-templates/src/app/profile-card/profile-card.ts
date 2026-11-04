import { ChangeDetectionStrategy, Component, input } from '@angular/core';

// A standalone component. "Standalone" means it doesn't belong to an NgModule:
// any other component can use it by adding ProfileCard to its own `imports` array.
@Component({
  // The tag name used in other templates: <app-profile-card />
  selector: 'app-profile-card',
  // OnPush: Angular only re-checks this component when its inputs change
  // or an event happens inside it. Faster, and the recommended default.
  changeDetection: ChangeDetectionStrategy.OnPush,
  // A small template can live inline instead of in a separate .html file.
  template: `
    <div class="card">
      <!-- Inputs are read by calling them like functions: name() -->
      <strong>{{ name() }}</strong>
      <span>{{ role() }}</span>
    </div>
  `,
  // Styles here only apply to this component (Angular scopes them automatically).
  styles: `
    .card {
      display: flex;
      flex-direction: column;
      padding: 0.75rem 1rem;
      border: 1px solid #ccc;
      border-radius: 8px;
      min-width: 140px;
    }
    span { color: #555; font-size: 0.9rem; }
  `,
})
export class ProfileCard {
  // input() lets the parent pass data in: <app-profile-card name="Ada" />
  // input.required means the parent MUST provide it. Folder 02 goes deeper on these.
  readonly name = input.required<string>();
  readonly role = input('Student'); // optional, with a default value
}
