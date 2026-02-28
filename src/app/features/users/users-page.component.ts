import { Component } from '@angular/core';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserFormComponent } from './components/user-form/user-form.component';

// ─────────────────────────────────────────────────────────────────────────────
// UsersPageComponent — the feature shell (routed component)
//
// Both UserListComponent and UserFormComponent inject the SAME UsersStore
// singleton. They automatically share state — no Input/Output wiring needed.
// ─────────────────────────────────────────────────────────────────────────────
@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [UserListComponent, UserFormComponent],
  template: `
    <div class="users-page">
      <header class="users-page__header">
        <h1>User Management</h1>
        <p>Powered by NgRx SignalStore</p>
      </header>

      <div class="users-page__layout">
        <!-- Both components share the same store instance automatically -->
        <main class="users-page__main">
          <app-user-list />
        </main>

        <aside class="users-page__sidebar">
          <app-user-form />
        </aside>
      </div>
    </div>
  `,
  styles: [`
    .users-page {
      max-width: 1100px;
      margin: 0 auto;
      padding: 2rem;
    }
    .users-page__header {
      margin-bottom: 2rem;
      h1 { font-size: 1.75rem; font-weight: 700; margin-bottom: 0.25rem; }
      p  { color: #6b7280; font-size: 0.9rem; }
    }
    .users-page__layout {
      display: grid;
      grid-template-columns: 1fr 320px;
      gap: 2rem;
      align-items: start;
    }
    @media (max-width: 768px) {
      .users-page__layout { grid-template-columns: 1fr; }
    }
  `]
})
export class UsersPageComponent {}
