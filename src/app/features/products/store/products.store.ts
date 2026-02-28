import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import {
  addEntity,
  removeEntity,
  setAllEntities,
  updateEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { ProductService } from '../../../core/services/product.service';
import { Product, ProductCategory } from '../../../shared/models/product.model';
import { withLoadingState } from '../../../core/store/loading.feature';

interface ProductsFilter {
  searchQuery: string;
  filterCategory: ProductCategory | 'all';
}

export const ProductsStore = signalStore(
  { providedIn: 'root' },

  withState<ProductsFilter & { selectedId: string | null }>({
    selectedId: null,
    searchQuery: '',
    filterCategory: 'all',
  }),

  withEntities<Product>(),

  withLoadingState(),

  withComputed(({ entities, selectedId, searchQuery, filterCategory }) => ({
    totalProducts: computed(() => entities().length),
    activeProducts: computed(() => entities().filter((p) => p.active)),
    activeCount: computed(() => entities().filter((p) => p.active).length),
    lowStockCount: computed(() => entities().filter((p) => p.stock < 10).length),

    filteredProducts: computed(() => {
      let products = entities();
      if (filterCategory() !== 'all') {
        products = products.filter((p) => p.category === filterCategory());
      }
      if (searchQuery().trim()) {
        const q = searchQuery().toLowerCase();
        products = products.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q)
        );
      }
      return products;
    }),

    selectedProduct: computed(
      () => entities().find((p) => p.id === selectedId()) ?? null
    ),
  })),

  withMethods((store, productService = inject(ProductService)) => ({
    selectProduct(id: string): void {
      const next = store.selectedId() === id ? null : id;
      patchState(store, { selectedId: next });
    },

    setSearch(query: string): void {
      patchState(store, { searchQuery: query });
    },

    setFilterCategory(category: ProductCategory | 'all'): void {
      patchState(store, { filterCategory: category });
    },

    toggleActive(id: string): void {
      const product = store.entityMap()[id];
      patchState(
        store,
        updateEntity({ id, changes: { active: !product.active } })
      );
    },

    removeProduct(id: string): void {
      patchState(store, removeEntity(id));
      if (store.selectedId() === id) {
        patchState(store, { selectedId: null });
      }
    },

    loadProducts: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(() =>
          productService.getAll().pipe(
            tapResponse({
              next: (products) =>
                patchState(store, setAllEntities(products), { loading: false }),
              error: (err: Error) =>
                patchState(store, { loading: false, error: err.message }),
            })
          )
        )
      )
    ),

    createProduct: rxMethod<Omit<Product, 'id' | 'createdAt'>>(
      pipe(
        tap(() => patchState(store, { loading: true })),
        switchMap((payload) =>
          productService.create(payload).pipe(
            tapResponse({
              next: (product) =>
                patchState(store, addEntity(product), { loading: false }),
              error: (err: Error) =>
                patchState(store, { loading: false, error: err.message }),
            })
          )
        )
      )
    ),
  })),

  withHooks({
    onInit(store) {
      console.log('[ProductsStore] onInit — auto-loading products');
      store.loadProducts();
    },
    onDestroy(store) {
      console.log('[ProductsStore] onDestroy — cleanup');
    },
  })
);
