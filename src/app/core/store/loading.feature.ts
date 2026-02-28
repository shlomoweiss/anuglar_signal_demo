import { computed } from '@angular/core';
import { signalStoreFeature, withComputed, withMethods, withState } from '@ngrx/signals';

// ─────────────────────────────────────────────────────────────────────────────
// withLoadingState() — a CUSTOM withXXX feature (signalStoreFeature)
//
// This is the killer pattern: bundle state + computed + methods into a
// reusable plugin that you drop into ANY store with a single line.
//
// Usage:
//   const UsersStore  = signalStore(withEntities<User>(),  withLoadingState());
//   const PostsStore  = signalStore(withEntities<Post>(),  withLoadingState());
//   const OrdersStore = signalStore(withEntities<Order>(), withLoadingState());
// ─────────────────────────────────────────────────────────────────────────────
export function withLoadingState() {
  return signalStoreFeature(

    withState({
      loading: false,
      error: null as string | null,
    }),

    withComputed(({ loading, error }) => ({
      isReady: computed(() => !loading() && !error()),
    })),

    withMethods((store) => ({
      setLoading(): void {
        // patchState is imported from @ngrx/signals
        // Using Object.assign pattern here for the feature
        (store as any)._patch({ loading: true, error: null });
      },
      setLoaded(): void {
        (store as any)._patch({ loading: false });
      },
      setError(message: string): void {
        (store as any)._patch({ loading: false, error: message });
      },
      clearError(): void {
        (store as any)._patch({ error: null });
      },
    })),
  );
}
