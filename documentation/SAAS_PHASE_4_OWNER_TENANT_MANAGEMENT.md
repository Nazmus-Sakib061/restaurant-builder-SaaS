# SaaS Phase 4 - Owner Onboarding and Tenant Management

## Purpose

This phase adds a small super-admin surface for creating restaurants, assigning owners, and keeping tenant role naming consistent without touching billing, subscriptions, or custom domains.

## Files Added or Updated

- `backend/api/restaurants.php`
- `backend/api/restaurant-owners.php`
- `backend/helpers/auth.php`
- `admin/dashboard.php`
- `admin/assets/js/admin.js`
- `admin/assets/css/admin.css`
- `backend/database/restaurant_builder_schema.sql`
- `database/migrations/2026_06_30_owner_tenant_management.sql`
- `backend/README.md`
- `backend/database/README.md`
- `documentation/SAAS_TENANT_FOUNDATION.md`
- `documentation/SAAS_PHASE_3_TENANT_UI_ROLE_CLEANUP.md`

## What This Phase Covers

- Super-admin restaurant directory and restaurant create/update/archive actions
- Super-admin owner onboarding and owner reassignment
- Runtime normalization of legacy role labels to `restaurant_staff`
- Tenant-aware admin UI updates that stay separate from the customer-facing site
- Backfill migration for existing tenant owner rows

## Security Notes

- The new tenant management endpoints require super-admin authentication.
- Owner assignment remains tenant-scoped through restaurant membership checks.
- No password hashes, raw tokens, or private config values are exposed in the current-user payload.
- Legacy `manager` labels are still accepted in runtime helpers for compatibility, but new writes prefer `restaurant_staff`.

## Verification Targets

- `php -l` on the changed PHP files and the full repo
- `node --check admin/assets/js/admin.js`
- Public homepage and admin login smoke checks
- `site-data.php` tenant smoke checks for `default` and `demo-coffee-house`
- `current-user.php` and `select-restaurant.php` session checks
- Unauthorized category write blocked
- Super-admin restaurant and owner management endpoints
- Cross-tenant access blocking for tenant-scoped CRUD routes

## Notes

- The migration is update-only and does not drop data.
- The existing `restaurants` table remains the tenant table.
- Billing, subscriptions, invoices, and custom domains are still out of scope for this phase.

## Phase 4.1 Review Results

### Inactive Tenant Behavior

- `restaurants.php` management visibility includes inactive and archived tenants for super-admins: pass
- restaurant owners cannot switch into inactive or archived tenants: pass
- public `site-data.php?tenant=phase4-test-restaurant` returned a safe `404` after archive: pass
- owner write attempts against the archived tenant returned a safe `404`: pass
- super-admin management of inactive tenants stayed available: pass

### New Owner Onboarding Test

- Created `PHASE4_TEST_Restaurant` with slug `phase4-test-restaurant`: pass
- Created new owner user with a local test password: pass
- Password hash stored in DB and verified with `password_verify`: pass
- Malicious `role=super_admin` input did not elevate the user: pass
- Owner login succeeded: pass
- Owner current-user payload normalized to `restaurant_owner`: pass
- Owner could access only the assigned restaurant after selection: pass
- Owner was blocked from default and demo-coffee-house: pass
- Test restaurant was archived after validation: pass

### Permission Matrix

- Unauthenticated access to `restaurants.php`, `restaurant-owners.php`, and `select-restaurant.php` was blocked with `401`: pass
- `restaurant_owner` could not create restaurants or owners: pass
- `restaurant_owner` could not switch into an unrelated tenant: pass
- `super_admin` could list, create, archive, and assign owners: pass
- No `restaurant_staff` seed user existed in the live DB, so that branch was skipped

### Validation Results

- `restaurants.php` rejected empty, invalid, duplicate, too-long, and bad-status payloads with structured `422` errors: pass
- `restaurant-owners.php` rejected bad email, weak password, missing restaurant, and missing target restaurant payloads with structured `422` errors: pass
- Inactive restaurant assignment by super-admin was allowed as intended for onboarding: pass
- No SQL errors, stack traces, or password/hash leaks were observed in the returned JSON: pass

### Migration and Line Endings

- Migration order remains `backend/database/restaurant_builder_schema.sql` first, then `backend/database/restaurant_builder_seed.sql`, then the Phase 4 migration: documented
- The repo still shows LF/CRLF normalization warnings on touched files, so `.gitattributes` was added to keep future churn down: pass

### Remaining Risks

- Existing legacy rows in the live database may still need the migration run to fully normalize old role values.
- No automated test suite exists yet, so these checks remain smoke tests rather than CI coverage.
- The archived temp test restaurants were left in place because cleanup was not guaranteed to be safer than keeping them archived.
