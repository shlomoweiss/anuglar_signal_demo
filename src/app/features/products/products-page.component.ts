import { Component } from '@angular/core';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [ProductListComponent, ProductFormComponent, ProductDetailComponent],
  template: `
    <div class="products-page">
      <header class="products-page__header">
        <h1>Product Management</h1>
        <p>Powered by NgRx SignalStore</p>
      </header>

      <div class="products-page__layout">
        <main class="products-page__main">
          <app-product-list />
        </main>

        <aside class="products-page__sidebar">
          <app-product-form />
          <app-product-detail />
        </aside>
      </div>
    </div>
  `,
  styles: [`
    .products-page {
      max-width: 1100px;
      margin: 0 auto;
      padding: 2rem;
    }
    .products-page__header {
      margin-bottom: 2rem;
      h1 { font-size: 1.75rem; font-weight: 700; margin-bottom: 0.25rem; }
      p  { color: #6b7280; font-size: 0.9rem; }
    }
    .products-page__layout {
      display: grid;
      grid-template-columns: 1fr 320px;
      gap: 2rem;
      align-items: start;
    }
    @media (max-width: 768px) {
      .products-page__layout { grid-template-columns: 1fr; }
    }
  `],
})
export class ProductsPageComponent {}
