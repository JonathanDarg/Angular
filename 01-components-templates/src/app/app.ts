import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  CurrencyPipe,
  DatePipe,
  JsonPipe,
  LowerCasePipe,
  PercentPipe,
  UpperCasePipe,
} from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ProfileCard } from './profile-card/profile-card';
import { TruncatePipe } from './truncate-pipe';

// Shape of one task in the @for / @switch example.
type TaskStatus = 'todo' | 'doing' | 'done';
interface Task {
  id: number;
  title: string;
  status: TaskStatus;
}

@Component({
  selector: 'app-root',
  // Everything the template uses (other components, pipes) must be listed here.
  imports: [
    RouterOutlet,
    ProfileCard,
    TruncatePipe,
    UpperCasePipe,
    LowerCasePipe,
    CurrencyPipe,
    PercentPipe,
    DatePipe,
    JsonPipe,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  // Used by the starter placeholder at the top of app.html.
  protected readonly title = signal('01-components-templates');

  // A signal is a value Angular watches: read it with name(), change it with
  // name.set(...) or name.update(...), and the page updates. Folder 02 covers them in depth.

  // ---- 2. Data binding ----
  protected readonly userName = signal('Jonathan');
  protected readonly isLocked = signal(false);
  protected readonly textColor = signal('blue');

  protected toggleLock(): void {
    this.isLocked.update((locked) => !locked);
  }

  // ---- 3. Event handling ----
  protected readonly count = signal(0);

  protected increment(): void {
    this.count.update((c) => c + 1);
  }

  protected decrement(): void {
    this.count.update((c) => c - 1);
  }

  // $event from (input) is a generic Event, so we tell TypeScript it came from an <input>.
  protected onNameInput(event: Event): void {
    this.userName.set((event.target as HTMLInputElement).value);
  }

  protected setColor(color: string): void {
    if (color.trim()) {
      this.textColor.set(color.trim());
    }
  }

  // ---- 4. Control flow ----
  private nextId = 4;
  protected readonly tasks = signal<Task[]>([
    { id: 1, title: 'Read about components', status: 'done' },
    { id: 2, title: 'Practice data binding', status: 'doing' },
    { id: 3, title: 'Try @for and @switch', status: 'todo' },
  ]);

  protected addTask(title: string): void {
    if (!title.trim()) return;
    // Never push into the array directly: make a new array so the signal knows it changed.
    this.tasks.update((list) => [...list, { id: this.nextId++, title: title.trim(), status: 'todo' }]);
  }

  protected removeTask(id: number): void {
    this.tasks.update((list) => list.filter((t) => t.id !== id));
  }

  protected cycleStatus(id: number): void {
    const next: Record<TaskStatus, TaskStatus> = { todo: 'doing', doing: 'done', done: 'todo' };
    this.tasks.update((list) => list.map((t) => (t.id === id ? { ...t, status: next[t.status] } : t)));
  }

  // ---- 5. Pipes ----
  // Plain (non-signal) values are fine for data that never changes.
  protected readonly price = 1234.5;
  protected readonly score = 0.875;
  protected readonly today = new Date();
  protected readonly longText = 'Pipes transform how a value is displayed without changing it.';
}
