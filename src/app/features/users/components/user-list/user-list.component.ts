import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersStore } from '../../store/users.store';
import { UserRole } from '../../../../shared/models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  // No ChangeDetectorRef needed — signals drive updates automatically
})
export class UserListComponent {

  // ─── Inject the store — that's it. No mapState, no selectors boilerplate ──
  readonly store = inject(UsersStore);

  readonly roles: Array<UserRole | 'all'> = ['all', 'admin', 'user', 'viewer'];

  // ─── Template calls these directly: store.setSearch(q) ───────────────────
  onSearch(query: string): void {
    this.store.setSearch(query);
  }

  onFilterRole(role: UserRole | 'all'): void {
    this.store.setFilterRole(role);
  }

  onSelectUser(id: string): void {
    this.store.selectUser(id);
  }

  onToggleActive(event: Event, id: string): void {
    event.stopPropagation();
    this.store.toggleActive(id);
  }

  onRemoveUser(event: Event, id: string): void {
    event.stopPropagation();
    this.store.removeUser(id);
  }

  onRetry(): void {
    this.store.loadUsers();
  }

  trackById(_: number, user: { id: string }) {
    return user.id;
  }
}
