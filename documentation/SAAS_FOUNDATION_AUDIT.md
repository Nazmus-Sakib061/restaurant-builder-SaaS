# SaaS Foundation Audit

## 1. Current Baseline Status

- Workspace verified: `C:\xampp\htdocs\restaurant_builder_SaaS`
- Git remote verified: `origin -> https://github.com/Nazmus-Sakib061/restaurant-builder-SaaS.git`
- Branch created for this phase: `feature/saas-foundation`
- No uncommitted changes were present before this phase started

Baseline verification results:

- PHP lint: passed with `C:\xampp\php\php.exe`
- Public site load: passed (`http://localhost/restaurant_builder_SaaS/` returned 200)
- Admin login page load: passed (`http://localhost/restaurant_builder_SaaS/admin/login.php` returned 200)
- Auth smoke test: passed (`POST /backend/api/auth.php` with the seeded super admin succeeded)
- Database connection: available

Live database evidence:

- `DB_NAME=restaurant_builder_saas`
- `SELECTED_DB=restaurant_builder_saas`
- `RESTAURANTS=3`
- `USERS=2`
- `TABLES=14`

No existing dedicated test harness or smoke script was found, so the baseline used direct linting plus HTTP and login checks.

## 2. Current Database / Config Status

Actual config wiring in this repo:

- `config.php` is the local-only override and points to `restaurant_builder_saas`
- `config.example.php` also points to `restaurant_builder_saas`
- `backend/config/db.php` uses the same SaaS database name as the fallback default
- `backend/api/_helpers.php` loads `backend/config/db.php`, which in turn loads the root override when present

Requested paths from the task that are not present in this repo:

- `backend/config.php`
- `backend/config.example.php`
- `backend/api/db.php`
- `backend/api/_db.php`
- `backend/api/statistics.php`
- `backend/api/export.php`
- `backend/api/_cache.php`
- `backend/api/_logger.php`

Database separation verdict:

- Separate from the source-code release database: yes
- Uses `restaurant_builder_saas` instead of `restaurant_builder_db`: yes
- Sample config updates needed right now: no, the existing sample already targets the SaaS database name

## 3. Single-Tenant Assumptions Found

| Module | Current behavior | Tenant scoping needed | Risk if not scoped | Suggested migration approach |
|---|---|---|---|---|
| `assets/js/apiDataLoader.js` | Defaults to demo profiles and falls back to `demo-pizza-house` when no restaurant is requested | Canonical tenant resolution should be explicit, not demo-driven | Users can see fallback content when the slug is missing or wrong | Keep slug resolution, but move it behind a tenant resolver helper and stop treating a demo profile as the authority |
| `admin/dashboard.php` + `admin/assets/js/admin.js` | Hard-coded `demo-pizza-house` appears throughout, selected restaurant is remembered in `localStorage`, and orders can fall back to `localStorage` | Active tenant should be derived from authenticated access plus request context | Cross-restaurant confusion, stale UI state, and local demo data masking backend problems | Replace demo defaults with a canonical selected-restaurant flow and keep `localStorage` only as a convenience cache |
| `backend/helpers/auth.php` | Already multi-tenant aware, with `super_admin` bypass and restaurant membership checks | Session should be paired with an explicit active-tenant context in the app flow | UI and API can drift if the user switches restaurants without a clear active context | Keep DB-based authorization, but add a small active-tenant resolver layer above it |
| `backend/api/site-data.php` | Public site data is resolved from `?restaurant=` and cached by request slug | Cache keys should always include tenant identity | Shared cache collisions if the key helper is reused without the tenant slug | Keep the current pattern, but formalize tenant-in-cache-key as a hard rule |
| `backend/api/settings.php` | Reads/writes `restaurant_settings` by `restaurant_id` | Already tenant-scoped, but every query must keep the `restaurant_id` guard | A future unscoped query would leak another restaurant's settings | Preserve the current pattern and keep `restaurant_id` in all CRUD filters |
| `backend/api/categories.php`, `menu-items.php`, `deals.php`, `gallery.php` | CRUD is already filtered by `restaurant_id` and ownership context | Continue strict tenant scoping on every route | Unscoped admin CRUD would cross-write content into another tenant | Keep the pattern and add tests around restaurant ownership checks |
| `backend/api/orders.php` | Public `POST` uses restaurant slug context; admin read/update uses authenticated restaurant context; revenue logic is embedded here | Orders, revenue, and reporting all need the same tenant boundary | Mixed public/admin flows can become the easiest place for a leak | Keep the boundary strict and extract reporting logic later if it grows |
| `backend/api/reservations.php` | Public create uses restaurant slug; admin list/update uses authenticated restaurant context | Same tenant boundary applies | Reservation data could be exposed across tenants if a future query omits the filter | Keep the current restaurant filter and add tenant-aware smoke tests |
| `backend/api/uploads.php` | Uploads are already stored under `uploads/restaurants/{restaurant_id}/{purpose}` | Upload paths, file serving, and deletion should stay tenant-aware | Cross-tenant file exposure or accidental overwrite | Keep the restaurant-scoped path and ensure any future media helper preserves it |
| `backend/database/restaurant_builder_schema.sql` | Tenant boundary already exists through `restaurant_id`, `owner_user_id`, and `restaurant_users` | Future SaaS tables need the same boundary | Billing or audit data could become global by mistake | Continue the same pattern for all new SaaS tables |

Additional note:

- `backend/database/restaurant_builder_schema.sql` currently uses `manager` in the `restaurant_users` role enum, while the requested SaaS role plan uses `restaurant_staff`. That should be normalized in a later migration or compatibility layer.

## 4. Recommended SaaS Data Model

The current schema already has a strong foundation. Recommended direction:

- `restaurants` should remain the tenant table
- `users` should remain the global login identity table
- `restaurant_users` should remain the tenant membership pivot and carry the per-tenant role
- `restaurant_settings`, `menu_categories`, `menu_items`, `deals`, `deal_items`, `gallery_images`, `orders`, `order_items`, `reservations`, and `revenue_transactions` should remain tenant-scoped by `restaurant_id`
- `theme_presets` can stay shared because it is a reusable lookup table, not tenant data

Future SaaS-only tables to add later:

- `plans`
- `subscriptions`
- `invoices`
- `billing_events`
- `usage_limits`
- `audit_logs`

Recommended ownership rules:

- Each restaurant has exactly one owning `users.id` reference through `restaurants.owner_user_id`
- Each staff or manager account is linked through `restaurant_users`
- Every tenant-owned table must include `restaurant_id` and a supporting index
- Every unique slug should be unique per restaurant, not global, unless the business rule says otherwise

## 5. Recommended Tenant Resolution Strategy

Best local-development approach for this phase:

- Keep `?restaurant=<slug>` as the canonical resolver
- Keep `restaurant_context()` as the central public-site lookup
- Keep admin routes resolving the active restaurant from the authenticated user plus the selected slug or restaurant id

Why this is the safest first step:

- It already matches the current code path
- It works cleanly on XAMPP without DNS or virtual-host setup
- It does not require custom domain support yet

Recommended longer-term order:

1. Query or path slug for local development and early SaaS testing
2. Subdomain mapping for production SaaS
3. Custom-domain mapping after the core tenant model is stable

## 6. Recommended Auth / Role Plan

Target SaaS roles:

- `super_admin`
- `restaurant_owner`
- `restaurant_staff`

Recommended permissions:

- `super_admin`
  - Can see and manage all restaurants
  - Can assign memberships and future plans/subscriptions
  - Can support or override tenant access when necessary
- `restaurant_owner`
  - Can manage the tenant they own
  - Can manage settings, menu, deals, gallery, orders, and reservations for that tenant
  - Can invite or manage staff for that tenant
- `restaurant_staff`
  - Can work only inside assigned tenants
  - Should be limited to content and operations needed for day-to-day use
  - Should not control billing or ownership

Auth changes needed:

- Keep PHP session auth
- Keep DB-backed authorization checks on every protected API
- Add an explicit active-tenant concept in the app flow
- Make sure the UI selection does not become the only source of truth
- Normalize the role naming mismatch between the schema `manager` role and the desired `restaurant_staff` role

## 7. Upload / Cache / Log Isolation Plan

Uploads:

- Current status is good: uploads already use `uploads/restaurants/{restaurant_id}/{purpose}`
- Keep the restaurant id in the path for all future upload types
- Keep public file serving restricted to allowed prefixes only

Cache:

- `backend/api/site-data.php` already keys cache entries by request state and restaurant slug
- Make tenant identity a mandatory part of every cache key
- Avoid shared cache keys for public and admin content

Logs:

- There is no dedicated tenant-aware logging module in this repo yet
- Add a request id and restaurant id or slug to future logs
- Keep operational logs tenant-aware without writing private data from one tenant into another tenant's log stream

## 8. Risks

Primary risks identified in this phase:

- Demo-only fallbacks still exist in the front-end and admin UI
- `localStorage` is still used for selected restaurant state and fallback orders
- Several task-referenced helper files do not exist in this repo, so documentation and code comments must reflect the real file layout
- Billing, plan, subscription, invoice, and usage-limit tables are not implemented yet
- Reporting is still embedded in the orders flow instead of being a standalone SaaS reporting layer
- The schema role name `manager` does not yet match the requested SaaS role name `restaurant_staff`

## 9. Next Implementation Phases

Recommended next phase name:

- `Phase 2 - Tenant Resolver and Context Hardening`

Exact focus for the next phase:

- Create a single canonical tenant resolver for public and admin flows
- Remove demo-only defaults from the public/admin boot path
- Normalize active-tenant handling in the admin session flow
- Add explicit tenant scoping tests around the highest-risk routes
- Introduce config/documentation alignment for the actual SaaS repo layout

## 10. Phase Summary

- Current baseline is healthy
- SaaS database separation is already in place
- The schema already supports multi-tenant operations
- The main remaining work is hardening around tenant resolution, UI state, role naming, and future billing isolation
