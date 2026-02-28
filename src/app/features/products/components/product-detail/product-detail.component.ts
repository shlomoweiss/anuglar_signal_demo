import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsStore } from '../../store/products.store';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
})
export class ProductDetailComponent {
  readonly store = inject(ProductsStore);
}
