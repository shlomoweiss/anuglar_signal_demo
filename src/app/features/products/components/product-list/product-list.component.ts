import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsStore } from '../../store/products.store';
import { ProductCategory } from '../../../../shared/models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent {
  readonly store = inject(ProductsStore);
  readonly categories: Array<ProductCategory | 'all'> = [
    'all',
    'electronics',
    'clothing',
    'food',
    'other',
  ];

  onSearch(query: string): void {
    this.store.setSearch(query);
  }

  onFilterCategory(category: ProductCategory | 'all'): void {
    this.store.setFilterCategory(category);
  }

  onSelectProduct(id: string): void {
    this.store.selectProduct(id);
  }

  onToggleActive(event: Event, id: string): void {
    event.stopPropagation();
    this.store.toggleActive(id);
  }

  onRemoveProduct(event: Event, id: string): void {
    event.stopPropagation();
    this.store.removeProduct(id);
  }

  onRetry(): void {
    this.store.loadProducts();
  }

  trackById(_: number, product: { id: string }) {
    return product.id;
  }
}
