# Live Challenge – Search + Favorites (React + TS + TanStack Query + Supabase)

**Total time:** 60 minutes (≈5 briefing · 45 coding · 10 demo/Q\&A)
**Goal:** Build a small, clear feature that searches and lists items from a Supabase backend and lets users mark items as ⭐ favorites. Focus on correctness, async state, and clean TypeScript/React structure.

---

## What’s provided

* Vite + React + TypeScript starter (TanStack Query already set up)
* `@supabase/supabase-js` client configured via `.env.local`
* A pre‑seeded database with two tables:

  * **`items`**: `id (bigint)`, `title (text)`, `category (text)`, `rating (numeric 0–5)`, `updated_at (timestamptz)`
  * **`favorites`**: `client_id (text)`, `item_id (bigint)`, `created_at (timestamptz)`; primary key is `(client_id, item_id)`
* A session‑scoped `VITE_CLIENT_ID` you can use for favorites. No auth flows.

> You don’t need to create tables—everything is ready. You’ll query and mutate via the Supabase client.

---

## Requirements (must‑have)

1. **List & Search**
   ---------* Render items from `items`.
   * Add a case‑insensitive text search over `title` (debounce \~300ms).

2. **Sort**
   ----------* Allow sorting by `rating` (asc/desc) and `title` (A→Z/Z→A). Make the current sort visible.

3. **Pagination**
   * Page size = 10. Provide Next/Prev controls. Disable Next when there’s no next page.

4. **Favorites (optimistic)**
   -----------* A star button toggles favorite for the current `VITE_CLIENT_ID`.
   -----------* **Optimistic UI**: update immediately; rollback if the request fails. Persist to `favorites`.

5. **States & Accessibility**
  ------------* Show loading, error, and empty states.
   * Ensure controls are keyboard accessible; star button should reflect its state (e.g., `aria-pressed`).

6. **Type Safety & Structure**
   * Use TypeScript without `any`. Keep components and hooks focused and readable.

You have creative freedom on the UI—as long as it meets the behaviors above.

---

## Nice‑to‑have (choose at most one if time allows)

* **Prefetch next page** to make paging feel instant.
* **Category filter** (e.g., dropdown/pills).
* **Persist search/sort/page** to `localStorage`.

---

## Acceptance checklist

* [ ] Search filters the list (case‑insensitive, debounced \~300ms).
* [ ] Sort controls switch between rating/title and asc/desc; current sort is visibly indicated.
* [ ] Pagination shows 10 items per page; Next/Prev disabled appropriately (or Next hidden when no next page).
* [ ] Favorites toggle is **optimistic** (instant UI); on failure, state rolls back and a brief error notice appears.
* [ ] Favorites persist to the `favorites` table for the provided `VITE_CLIENT_ID`.
* [ ] Loading states visible for initial load and refetches; mutation shows busy/disabled state.
* [ ] Empty state message when no results match.
* [ ] Basic accessibility: star has `aria-pressed`; controls are keyboard-operable; focus is preserved after updates.
* [ ] No `any` types; components/hooks are small and well‑named; query keys are stable and parameterized.

## Scoring (how we evaluate)

* **Correctness & data handling (30%)** – Search, sort, pagination, and favorites work as specified.
* **Async & state management (25%)** – Good use of TanStack Query; thoughtful loading/error/optimism.
* **Code quality & TypeScript (25%)** – Clear components/hooks, strong types, clean names.
* **UX & a11y (15%)** – Obvious controls, sensible focus/keyboard behavior, empty/error states.
* **Testing/verification (5%)** – Optional but valued (a small test or assertion).

---

## Notes

* You may consult documentation (React, TanStack Query, Supabase, TypeScript) during the session.
* Keep things minimal—visual polish is not the priority.
* If you hit an external issue (network, etc.), describe your fallback and proceed.

When ready, start by wiring up the first query to list items, then add search, sort, pagination, and favorites with optimistic updates.


anna@deepmetis.com
annalea868