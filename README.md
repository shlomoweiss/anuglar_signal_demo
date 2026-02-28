# NgRx SignalStore — User Management App

A minimal Angular 19 SPA demonstrating every `withXXX` building block of
NgRx SignalStore, written exactly as you'd write it in a real project.

## Quick Start

```bash
npm install
ng serve
```

---

## Project Structure

```
src/app/
│
├── core/
│   ├── services/
│   │   └── user.service.ts           # HTTP service (getAll, create, delete)
│   └── store/
│       └── loading.feature.ts        # ⑤ Custom withXXX (signalStoreFeature)
│
├── features/
│   └── users/
│       ├── store/
│       │   └── users.store.ts        # ← THE STORE (all withXXX here)
│       ├── components/
│       │   ├── user-list/
│       │   │   ├── user-list.component.ts
│       │   │   ├── user-list.component.html
│       │   │   └── user-list.component.scss
│       │   └── user-form/
│       │       ├── user-form.component.ts
│       │       └── user-form.component.html
│       └── users-page.component.ts   # Feature shell (routed)
│
├── shared/
│   └── models/
│       └── user.model.ts             # User interface + UserRole type
│
├── app.component.ts                  # Root shell
├── app.config.ts                     # provideZonelessChangeDetection()
└── app.routes.ts                     # Lazy-loaded routes
```

---

## withXXX Map — Where Each Lives

| withXXX | File | What it does |
|---|---|---|
| `withState()` | `users.store.ts` | Raw state → selectedId, searchQuery, filterRole |
| `withEntities()` | `users.store.ts` | Normalized User[] → entities(), entityMap(), ids() |
| `withLoadingState()` | `loading.feature.ts` | Custom feature → loading, error, isReady |
| `withComputed()` | `users.store.ts` | Derived signals → filteredUsers, selectedUser, adminCount |
| `withMethods()` | `users.store.ts` | selectUser(), toggleActive(), loadUsers (rxMethod) |
| `withHooks()` | `users.store.ts` | onInit → auto-loads users |

---

## Redux → SignalStore Cheatsheet

| Classic Redux | NgRx SignalStore |
|---|---|
| `createReducer` + initial state | `withState({ ... })` |
| `createEntityAdapter()` | `withEntities<T>()` |
| `createSelector()` | `withComputed(store => ({ ... }))` |
| `dispatch(loadUsers())` + Effect | `store.loadUsers()` via `rxMethod` in `withMethods` |
| `dispatch(selectUser({ id }))` | `store.selectUser(id)` |
| `combineReducers` / feature state | Multiple `withXXX` calls composed in order |
| Custom middleware | `signalStoreFeature()` → your own `withXXX` |
| Store init side effects | `withHooks({ onInit })` |

---

## Key Rules

1. **Order matters** — each `withXXX` can only see what was defined above it
2. **Never mutate signals directly** — always use `patchState(store, changes)`
3. **`providedIn: 'root'`** makes the store a singleton (your single store)
4. **inject() works inside withMethods()** — full Angular DI available
5. **rxMethod()** bridges Observables into signal land — accepts Observable, Signal, or plain value

---

## Install NgRx SignalStore

```bash
ng add @ngrx/signals
```
