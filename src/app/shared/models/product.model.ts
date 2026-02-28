export type ProductCategory = 'electronics' | 'clothing' | 'food' | 'other';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  stock: number;
  imageUrl: string;
  active: boolean;
  createdAt: Date;
}
