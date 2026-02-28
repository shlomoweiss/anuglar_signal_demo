import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full',
  },
  {
    path: 'users',
    loadComponent: () =>
      import('./features/users/users-page.component').then(
        (m) => m.UsersPageComponent
      ),
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./features/products/products-page.component').then(
        (m) => m.ProductsPageComponent
      ),
  },
];
