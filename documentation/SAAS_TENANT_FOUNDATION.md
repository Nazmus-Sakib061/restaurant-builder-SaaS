# SaaS Tenant Foundation

## 1. Schema Changes

- No new tenant table was introduced because the existing `restaurants` table already acts as the tenant table.
- Existing tenant-owned tables already use `restaurant_id`, so no new `tenant_id` columns were required in this phase.
- The default local tenant now maps to `Default Restaurant` with slug `default`.
- Legacy slug `demo-pizza-house` remains supported as a compatibility alias.

## 2. Default Tenant Behavior

- Default tenant slug: `default`
- Default tenant name: `Default Restaurant`
- Default tenant status: `active`
- No-parameter public requests now fall back to the default tenant.
- Legacy restaurant URLs such as `?restaurant=demo-pizza-house` still resolve safely.

## 3. Tenant-Owned Tables

Tenant-scoped tables in the current schema:

- `restaurants`
- `restaurant_settings`
- `menu_categories`
- `menu_items`
- `deals`
- `deal_items`
- `gallery_images`
- `orders`
- `order_items`
- `revenue_transactions`
- `reservations`

Shared tables:

- `users`
- `restaurant_users`
- `theme_presets`

## 4. Tenant Resolution Method

- Shared helper: `backend/api/_tenant.php`
- Primary query parameter: `tenant`
- Compatibility query parameter: `restaurant`
- Default fallback: `default`
- Legacy alias mapping: `demo-pizza-house -> default`

This keeps public and admin tenant resolution centralized.

## 5. API Scoping Changes

- Public read endpoints continue to scope through the tenant-aware helper path.
- Admin write endpoints continue to scope through authenticated restaurant ownership checks.
- `site-data.php` resolves tenant identity through the shared helper.
- Admin session context now stores the selected restaurant id for later writes in the same session.

## 6. Admin Session Tenant Handling

- The active restaurant id is stored in the PHP session after a restaurant is resolved.
- If no explicit tenant is requested, the admin flow falls back to the previously selected restaurant when it is still accessible.
- If no session tenant exists, the first accessible restaurant becomes the default admin context.
- The seeded local admin opens the dashboard with the default tenant selected first.

## 7. Upload / Cache Isolation

- Upload paths already remain restaurant-scoped under `uploads/restaurants/{restaurant_id}/...`.
- A shared tenant cache-key helper was added for future cache use.
- There is no active server-side cache layer in this repo yet, so no runtime cache migration was required in this phase.

## 8. Limitations

- Billing, invoices, plans, and subscription automation are still out of scope.
- `restaurant_users.role` still uses the existing schema labels; runtime helpers normalize `manager`, `staff`, `owner`, and `admin` into the SaaS role set.
- There is no dedicated statistics API endpoint in the repo; current statistics remain embedded in the orders flow and are restaurant-scoped.
- Front-end demo fallback data still exists as a compatibility path.

## 9. Next Phases

Recommended next phase:

- `Phase 4 - Owner Onboarding and Tenant Management`

Suggested focus:

- Add super-admin tenant creation and owner onboarding flows.
- Keep the tenant management UI scoped to the super-admin surface only.
- Preserve the runtime `restaurant_staff` role normalization while migrating legacy data.
- Add final smoke tests around tenant management and cross-tenant write safety.

## 10. Phase 2.1 Cleanup Notes

- The local database backup is kept on disk but ignored by git through `.gitignore`.
- Admin fallback logic was centralized to a single default tenant slug constant instead of hardcoded `demo-pizza-house` fallbacks.
- Public compatibility aliases remain in place so legacy URLs still resolve during the transition.
- `manager` is now normalized at runtime to `restaurant_staff` while preserving schema compatibility.
- `owner` normalizes to `restaurant_owner`, `staff` normalizes to `restaurant_staff`, and `admin` normalizes to `super_admin` where the broader legacy role needs to map into the SaaS model.

## 11. Tenant-Owned Table Verification

Verified against the current schema and live local database:

| Table | Exists | restaurant_id / tenant_id | API scoped | Risk |
|---|---|---|---|---|
| `restaurants` | yes | yes (`owner_user_id` also present) | yes | low |
| `restaurant_settings` | yes | yes | yes | low |
| `menu_categories` | yes | yes | yes | low |
| `menu_items` | yes | yes | yes | low |
| `deals` | yes | yes | yes | low |
| `gallery_images` | yes | yes | yes | low |
| `orders` | yes | yes | yes | low |
| `order_items` | yes | linked through `orders.restaurant_id` | yes | low |
| `revenue_transactions` | yes | yes | yes | low |
| `reservations` | yes | yes | yes | low |
| `restaurant_users` | yes | yes plus `user_id` | yes | low |
| `users` | yes | no | yes via auth session, not tenant-owned | low |
| `theme_presets` | yes | no | shared lookup table | low |

No tenant-owned table was found missing a `restaurant_id` or `tenant_id` column in the current SaaS schema.

## 12. CRUD Smoke Result

Tenant-scoped smoke tests completed successfully:

- `menu_items`: read verified on `default`, admin CRUD path preserved
- `deals`: read verified on `default`, admin CRUD path preserved
- `gallery`: read verified on `default`, admin CRUD path preserved
- `categories`: temporary create/delete test on `demo-coffee-house` succeeded
- `order creation`: temporary order on `default` succeeded
- `payment recording`: `cash_received` update succeeded
- `statistics`: summary endpoint returned tenant-scoped revenue for the temporary paid order
- `cross-tenant isolation`: `default` and `demo-coffee-house` returned distinct public site-data payloads
- `unauthorized writes`: blocked with `401`

Temporary records were deleted after verification.

## 13. Remaining Risks

- `assets/js/apiDataLoader.js` still contains a compatibility alias for legacy demo slugs in the public fallback path.
- The schema still stores legacy role labels in a few places; the runtime mapping now keeps the SaaS role surface consistent.
- There is still no dedicated statistics API endpoint, so reporting remains embedded in the orders flow.
- Full browser-automation coverage was not run in this cleanup pass.

## 14. Migration Hardening Note

- Future tenant migrations should avoid hard-coded `restaurant_id = 1` assumptions.
- Prefer slug-based lookup for the default tenant, for example:
  - `SELECT id FROM restaurants WHERE slug = 'default' LIMIT 1`
- The current migration is intentionally update-only and does not drop existing data.
