# SaaS Phase 3 - Tenant UI Alignment, Role Cleanup, and Admin Context Stabilization

## Purpose

This phase improves how the SaaS admin shell exposes tenant context, keeps role naming consistent, and makes tenant switching safer without expanding into billing or super-admin tooling.

## Files Changed

- `backend/helpers/auth.php`
- `backend/api/current-user.php`
- `backend/api/select-restaurant.php`
- `admin/dashboard.php`
- `admin/assets/js/admin.js`
- `admin/assets/css/admin.css`
- `backend/README.md`
- `documentation/SAAS_TENANT_FOUNDATION.md`

## Current-User API

The enriched `current-user.php` response now exposes:

- `user.id`
- `user.email`
- `user.name`
- `user.role`
- `user.normalized_role`
- `user.is_super_admin`
- `user.is_restaurant_owner`
- `user.is_restaurant_staff`
- `active_restaurant`
- `session.active_restaurant_id`
- `restaurants`
- `active_restaurant_id` for backward compatibility

The endpoint does not expose password hashes, raw tokens, or private config values.

## Role Normalization

Current compatibility mapping:

- `manager` -> `restaurant_staff`
- `staff` -> `restaurant_staff`
- `owner` -> `restaurant_owner`
- `admin` -> `super_admin`
- `super_admin` -> `super_admin`
- `restaurant_owner` -> `restaurant_owner`
- `restaurant_staff` -> `restaurant_staff`

Runtime helpers keep the SaaS role surface stable even if the schema still stores a legacy value.

## Admin Active Restaurant Display

- A small active-restaurant context block was added to the admin topbar.
- The visible label is `Current Restaurant`.
- The active restaurant name and a compact session/context line are rendered from backend data.
- If no restaurant is active yet, the UI shows a clear empty-state message instead of fake tenant data.

## Tenant Switcher

- The existing restaurant select in the admin settings panel now acts as the tenant switcher.
- It calls `backend/api/select-restaurant.php`.
- The endpoint requires authentication and checks restaurant access before updating the PHP session.
- Invalid or inaccessible switches return safe errors rather than silently changing context.

## Public Fallback Classification

- Public demo fallback behavior remains a compatibility path in `assets/js/apiDataLoader.js`.
- The fallback is read-only frontend demo data.
- Admin write flows do not depend on the public fallback.

## Migration Hardening

- The tenant foundation migration still updates the default tenant record in place.
- Future tenant migrations should resolve the default restaurant by slug, not by assuming `restaurant_id = 1`.
- See `documentation/SAAS_TENANT_FOUNDATION.md` for the hardening note.

## Test Results

- `php -l` passed on all PHP files in the repo.
- `index.html` returned `200`.
- `admin/login.php` returned `200`.
- `site-data.php?tenant=default` returned `200`.
- `site-data.php?tenant=demo-coffee-house` returned `200`.
- `current-user.php` returned a clean payload before and after tenant selection.
- `select-restaurant.php` returned `200` for the assigned default tenant.
- `select-restaurant.php` returned `403` for an inaccessible tenant.
- Unauthorized `categories.php` write returned `401`.
- `menu-items.php`, `deals.php`, and `gallery.php` returned `200` for the assigned tenant and `403` for the inaccessible tenant.

## Remaining Risks

- The public demo fallback still exists for resilience.
- Legacy role labels still exist in the schema, but runtime normalization is in place.
- Full browser-automation verification may still be limited by local tooling availability.

## Next Recommended Phase

- SaaS Phase 4 - Tenant CRUD Polish and Reporting Hardening
