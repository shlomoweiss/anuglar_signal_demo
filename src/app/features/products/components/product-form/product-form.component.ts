import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductsStore } from '../../store/products.store';
import { ProductCategory } from '../../../../shared/models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
})
export class ProductFormComponent {
  readonly store = inject(ProductsStore);
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: ['', [Validators.required]],
    price: [0, [Validators.required, Validators.min(0)]],
    category: ['electronics' as ProductCategory, Validators.required],
    stock: [0, [Validators.required, Validators.min(0)]],
    imageUrl: [''],
  });

  readonly categories: ProductCategory[] = [
    'electronics',
    'clothing',
    'food',
    'other',
  ];

  onSubmit(): void {
    if (this.form.invalid) return;
    const { name, description, price, category, stock, imageUrl } =
      this.form.getRawValue();
    this.store.createProduct({
      name: name!,
      description: description!,
      price: price!,
      category: category as ProductCategory,
      stock: stock!,
      imageUrl: imageUrl ?? '',
      active: true,
    });
    this.form.reset({ category: 'electronics', price: 0, stock: 0 });
  }
}
