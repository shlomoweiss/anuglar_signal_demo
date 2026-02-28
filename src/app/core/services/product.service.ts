import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Product } from '../../shared/models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly apiUrl = '/api/products';

  getAll(): Observable<Product[]> {
    return of(MOCK_PRODUCTS).pipe(delay(1000));
  }

  getById(id: string): Observable<Product> {
    const product = MOCK_PRODUCTS.find((p) => p.id === id)!;
    return of(product).pipe(delay(300));
  }

  create(payload: Omit<Product, 'id' | 'createdAt'>): Observable<Product> {
    const product: Product = {
      ...payload,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    return of(product).pipe(delay(500));
  }

  delete(id: string): Observable<void> {
    return of(void 0).pipe(delay(300));
  }
}

const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Wireless Headphones',
    description: 'Noise-cancelling over-ear Bluetooth headphones with 30h battery.',
    price: 149.99,
    category: 'electronics',
    stock: 42,
    imageUrl: 'https://placehold.co/120x120/dbeafe/2563eb?text=HP',
    active: true,
    createdAt: new Date('2025-01-10'),
  },
  {
    id: 'p2',
    name: 'Cotton T-Shirt',
    description: 'Premium 100% organic cotton crew-neck tee, available in 8 colours.',
    price: 29.95,
    category: 'clothing',
    stock: 120,
    imageUrl: 'https://placehold.co/120x120/fce7f3/db2777?text=TS',
    active: true,
    createdAt: new Date('2025-02-14'),
  },
  {
    id: 'p3',
    name: 'Dark Chocolate Bar',
    description: '70% cacao single-origin dark chocolate, 100 g.',
    price: 4.5,
    category: 'food',
    stock: 5,
    imageUrl: 'https://placehold.co/120x120/d1fae5/059669?text=CH',
    active: true,
    createdAt: new Date('2025-03-01'),
  },
  {
    id: 'p4',
    name: 'USB-C Hub',
    description: '7-in-1 USB-C adapter with HDMI, SD card reader, and PD charging.',
    price: 59.0,
    category: 'electronics',
    stock: 0,
    imageUrl: 'https://placehold.co/120x120/dbeafe/2563eb?text=HB',
    active: false,
    createdAt: new Date('2025-04-18'),
  },
  {
    id: 'p5',
    name: 'Notebook & Pen Set',
    description: 'A5 dotted notebook with premium gel pen gift set.',
    price: 18.0,
    category: 'other',
    stock: 67,
    imageUrl: 'https://placehold.co/120x120/f3f4f6/6b7280?text=NB',
    active: true,
    createdAt: new Date('2025-05-22'),
  },
];
