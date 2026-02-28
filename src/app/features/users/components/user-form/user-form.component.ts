import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersStore } from '../../store/users.store';
import { UserRole } from '../../../../shared/models/user.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
})
export class UserFormComponent {

  // Inject store — same singleton instance as UserListComponent
  readonly store = inject(UsersStore);

  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.group({
    name:  ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    role:  ['user' as UserRole, Validators.required],
  });

  readonly roles: UserRole[] = ['admin', 'user', 'viewer'];

  onSubmit(): void {
    if (this.form.invalid) return;

    const { name, email, role } = this.form.getRawValue();

    // ─── Call store method directly — no dispatch() needed ───────────────
    // store.createUser() is an rxMethod — handles the HTTP call + state update
    this.store.createUser({
      name:   name!,
      email:  email!,
      role:   role as UserRole,
      active: true,
    });

    this.form.reset({ role: 'user' });
  }
}
