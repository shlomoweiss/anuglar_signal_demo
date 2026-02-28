import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <nav class="nav-bar">
      <span class="nav-bar__brand">Management App</span>
      <div class="nav-bar__links">
        <a routerLink="/users" routerLinkActive="nav-bar__link--active" class="nav-bar__link">Users</a>
        <a routerLink="/products" routerLinkActive="nav-bar__link--active" class="nav-bar__link">Products</a>
      </div>
    </nav>
    <router-outlet />
  `,
  styles: [`
    .nav-bar {
      display: flex;
      align-items: center;
      gap: 2rem;
      padding: 0.75rem 2rem;
      background: #ffffff;
      border-bottom: 1px solid #e5e7eb;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
    }
    .nav-bar__brand {
      font-weight: 700;
      font-size: 1.1rem;
      color: #7c6af7;
    }
    .nav-bar__links {
      display: flex;
      gap: 0.25rem;
    }
    .nav-bar__link {
      padding: 0.4rem 0.9rem;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 500;
      color: #6b7280;
      text-decoration: none;
      transition: all 0.15s;
    }
    .nav-bar__link:hover {
      color: #7c6af7;
      background: rgba(124, 106, 247, 0.08);
    }
    .nav-bar__link--active {
      color: #7c6af7;
      background: rgba(124, 106, 247, 0.1);
      font-weight: 600;
    }
  `],
})
export class AppComponent {}
