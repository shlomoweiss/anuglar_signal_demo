import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,      // ⑥ Lifecycle: onInit / onDestroy
  withMethods,    // ④ Actions + Effects
  withState,      // ① Raw state signals
} from '@ngrx/signals';
import {
  addEntity,
  removeEntity,
  setAllEntities,
  updateEntity,
  withEntities,   // ② Normalized entity collection
} from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { UserService } from '../../../core/services/user.service';
import { User, UserRole } from '../../../shared/models/user.model';
import { withLoadingState } from '../../../core/store/loading.feature'; // ⑤ Custom feature

// ─────────────────────────────────────────────────────────────────────────────
// State shape for NON-entity state (filter, selection, etc.)
// ─────────────────────────────────────────────────────────────────────────────
interface UsersFilter {
  searchQuery: string;
  filterRole: UserRole | 'all';
}

// ─────────────────────────────────────────────────────────────────────────────
// THE STORE
// providedIn: 'root'  →  this is your single global store (singleton)
// ─────────────────────────────────────────────────────────────────────────────
export const UsersStore = signalStore(
  { providedIn: 'root' },

  // ─────────────────────────────────────────────────────────────────────────
  // ① withState() — defines raw state; each key becomes a readonly Signal
  //
  //  Auto-generates:
  //    store.selectedId()   → Signal<string | null>
  //    store.searchQuery()  → Signal<string>
  //    store.filterRole()   → Signal<UserRole | 'all'>
  //
  //  Mutate with: patchState(store, { selectedId: 'u1' })
  //  Never mutate directly: store.selectedId = 'u1'  ← WRONG
  // ─────────────────────────────────────────────────────────────────────────
  withState<UsersFilter & { selectedId: string | null }>({
    selectedId:  null,
    searchQuery: '',
    filterRole:  'all',
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // ② withEntities() — normalized entity collection
  //
  //  Auto-generates signals:
  //    store.entities()   → Signal<User[]>         (all as array)
  //    store.entityMap()  → Signal<Record<id,User>> (id → entity lookup)
  //    store.ids()        → Signal<string[]>
  //
  //  Entity updaters (used inside patchState):
  //    setAllEntities(users)
  //    addEntity(user)
  //    updateEntity({ id, changes })
  //    removeEntity(id)
  //    removeAllEntities()
  // ─────────────────────────────────────────────────────────────────────────
  withEntities<User>(),

  // ─────────────────────────────────────────────────────────────────────────
  // ③ Custom withXXX Feature — withLoadingState()
  //    Adds: store.loading(), store.error(), store.isReady()
  //    Adds: store.setLoading(), store.setLoaded(), store.setError()
  //
  //    Same feature reused in PostsStore, OrdersStore, etc.
  // ─────────────────────────────────────────────────────────────────────────
  withLoadingState(),

  // ─────────────────────────────────────────────────────────────────────────
  // ④ withComputed() — memoized derived signals (replaces createSelector)
  //
  //  Receives the entire store as input.
  //  Only recalculates when its specific signal dependencies change.
  //  Order matters: can only reference what was defined ABOVE this call.
  // ─────────────────────────────────────────────────────────────────────────
  withComputed(({ entities, selectedId, searchQuery, filterRole }) => ({

    // Derived from entities only
    totalUsers:  computed(() => entities().length),
    activeUsers: computed(() => entities().filter(u => u.active)),
    adminCount:  computed(() => entities().filter(u => u.role === 'admin').length),
    activeCount: computed(() => entities().filter(u => u.active).length),

    // Derived from entities + filter signals
    filteredUsers: computed(() => {
      let users = entities();

      if (filterRole() !== 'all') {
        users = users.filter(u => u.role === filterRole());
      }

      if (searchQuery().trim()) {
        const q = searchQuery().toLowerCase();
        users = users.filter(u =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q)
        );
      }

      return users;
    }),

    // Derived from entities + selectedId
    selectedUser: computed(() =>
      entities().find(u => u.id === selectedId()) ?? null
    ),

  })),

  // ─────────────────────────────────────────────────────────────────────────
  // ⑤ withMethods() — actions + reducers + async effects in one place
  //
  //  Replaces:  dispatch(loadUsers())  +  reducer  +  NgRx Effect
  //  Becomes:   store.loadUsers()
  //
  //  inject() works here — full DI support.
  //  rxMethod() bridges RxJS Observables into the signal world.
  //  It accepts: Observable | Signal | plain value as input.
  // ─────────────────────────────────────────────────────────────────────────
  withMethods((store, userService = inject(UserService)) => ({

    // ── Sync methods (replace dispatch(action) + reducer) ─────────────────

    selectUser(id: string): void {
      // Toggle selection
      const next = store.selectedId() === id ? null : id;
      patchState(store, { selectedId: next });
    },

    setSearch(query: string): void {
      patchState(store, { searchQuery: query });
    },

    setFilterRole(role: UserRole | 'all'): void {
      patchState(store, { filterRole: role });
    },

    toggleActive(id: string): void {
      const user = store.entityMap()[id];
      patchState(store, updateEntity({ id, changes: { active: !user.active } }));
    },

    removeUser(id: string): void {
      patchState(store, removeEntity(id));
      if (store.selectedId() === id) {
        patchState(store, { selectedId: null });
      }
    },

    // ── Async methods via rxMethod() (replace NgRx Effects) ───────────────

    // rxMethod<void> — no input, just triggers a load
    loadUsers: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(() =>
          userService.getAll().pipe(
            tapResponse({
              next:  (users) => patchState(store, setAllEntities(users), { loading: false }),
              error: (err: Error) => patchState(store, { loading: false, error: err.message }),
            })
          )
        )
      )
    ),

    // rxMethod<Omit<User,...>> — takes a payload as input
    createUser: rxMethod<Omit<User, 'id' | 'createdAt'>>(
      pipe(
        tap(() => patchState(store, { loading: true })),
        switchMap((payload) =>
          userService.create(payload).pipe(
            tapResponse({
              next:  (user) => patchState(store, addEntity(user), { loading: false }),
              error: (err: Error) => patchState(store, { loading: false, error: err.message }),
            })
          )
        )
      )
    ),

  })),

  // ─────────────────────────────────────────────────────────────────────────
  // ⑥ withHooks() — lifecycle: runs when store is first injected / destroyed
  //
  //  onInit  → perfect for auto-loading, setting up effects/subscriptions
  //  onDestroy → cleanup (unsubscribe, clear timers)
  // ─────────────────────────────────────────────────────────────────────────
  withHooks({
    onInit(store) {
      console.log('[UsersStore] onInit — auto-loading users');
      store.loadUsers(); // Kick off initial data load
    },
    onDestroy(store) {
      console.log('[UsersStore] onDestroy — cleanup');
    },
  })
);
