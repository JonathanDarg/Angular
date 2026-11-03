# Angular Research & Learning Lab

My workspace for learning modern Angular from the ground up: standalone components, signals, dependency injection, routing, forms, RxJS, state management, and testing.

Each numbered folder is a self-contained Angular project focused on one topic, with notes and practice exercises. The folders build on each other, so work through them in order.

---

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS version)
- Angular CLI: `npm install -g @angular/cli`
- Basic HTML, CSS, and JavaScript
- Some TypeScript (types, classes, interfaces) — covered briefly in `00`

---

## Learning Roadmap

| # | Topic | Key Concepts |
| :-- | :--- | :--- |
| 00 | **Setup & Basics** | Angular CLI, project structure, TypeScript essentials |
| 01 | **Components & Templates** | Standalone components, data binding, `@if` / `@for` / `@switch`, event handling, pipes |
| 02 | **Signals** | `signal`, `computed`, `effect`, `input()` / `output()`, `model()`, component communication |
| 03 | **Services, DI & HTTP** | Services, `inject()`, dependency injection, `HttpClient`, `resource()` / `httpResource()` |
| 04 | **Routing** | Angular Router, route parameters, lazy loading, guards, resolvers |
| 05 | **Forms & Validation** | Reactive forms, custom validators, dynamic forms, signal forms |
| 06 | **RxJS** | Observables, operators (`map`, `switchMap`, `debounceTime`), RxJS ↔ signals interop |
| 07 | **State Management** | Signal-based services, NgRx Signal Store, NgRx Store (overview) |
| 08 | **Testing** | Unit tests with Vitest, component testing, end-to-end tests with Playwright |
| 09 | **Capstone Project** | A full app combining everything above |

---

## Repository Structure

Folders are added as I reach each topic.

```text
Angular-/
├── 00-setup-basics/            # CLI, project anatomy, TypeScript refresher
├── 01-components-templates/    # Components, binding, control flow, pipes
├── 02-signals/                 # Signals, inputs/outputs, component communication
├── 03-services-di-http/        # Services, dependency injection, HttpClient
├── 04-routing/                 # Router, lazy loading, guards
├── 05-forms/                   # Reactive forms and validation
├── 06-rxjs/                    # Observables, operators, signal interop
├── 07-state-mgmt/              # Signal stores and NgRx
├── 08-testing/                 # Vitest unit tests, Playwright E2E
├── 09-capstone/                # Final project
└── README.md
```

---

## Running a Project

```bash
cd 01-components-templates
npm install
ng serve
```

Then open http://localhost:4200.

---

## Resources

- [Angular official docs](https://angular.dev) — start with the tutorials
- [Angular Playground](https://angular.dev/playground) — try Angular in the browser
- [RxJS docs](https://rxjs.dev)
- [NgRx docs](https://ngrx.io)
- [TypeScript handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

---