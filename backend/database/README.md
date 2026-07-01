# Restaurant Builder Database

This folder contains the MySQL files for the SaaS-ready multi-tenant database used by `restaurant_builder`.

## Database Name

- `restaurant_builder_saas`

## Import Order

Import the files in this order:

1. `restaurant_builder_schema.sql`
2. `restaurant_builder_seed.sql`

The schema creates the tables and indexes.
The seed file inserts the demo restaurants, settings, menu content, deals, gallery images, and deal-item mappings.

## Requirements

- XAMPP MySQL or MariaDB
- InnoDB storage engine
- `utf8mb4` character set
- `utf8mb4_unicode_ci` collation

## How To Import In phpMyAdmin

1. Start **Apache** and **MySQL** in XAMPP.
2. Open phpMyAdmin.
3. Create or select the database `restaurant_builder_saas`.
4. Import `restaurant_builder_schema.sql`.
5. Import `restaurant_builder_seed.sql`.

If you prefer the SQL scripts to create the database automatically, you can import the schema file first and let it create `restaurant_builder_saas` for you.

## Multi-Tenant Notes

- `users` stores the session login accounts.
- `restaurant_users` maps a user to the restaurants they can manage.
- `restaurant_id` is the tenant boundary.
- Every restaurant-specific table uses `restaurant_id` so each restaurant can keep its own menu, settings, orders, reservations, and deals.
- `slug` is the URL-safe unique identifier used for lookups such as `default`, `demo-pizza-house`, or `family-pizza-combo`.
- `theme_presets` stores reusable design palettes so different restaurant types can switch visual themes without changing the frontend code.
- Phase 4 adds a tenant-management migration that keeps the schema compatible while normalizing legacy `manager` labels toward `restaurant_staff`.
- Phase 5.1 adds plan tables and a subscription table:
  - `plans`
  - `plan_features`
  - `restaurant_subscriptions`
- The plan feature helper reads those tables to decide whether gallery, deals, statistics, exports, and staff management are unlocked for a restaurant.

## Auth Foundation

- `restaurants.owner_user_id` now links to `users.id`.
- The seed file creates a local-dev super admin and one demo restaurant owner.
- Login is handled through the PHP session-based admin auth flow.
- The seeded password hashes are stored in the SQL file, not in plaintext.
- Tenant management now uses `restaurant_staff` as the preferred runtime role label for non-owner staff assignments.
- Existing restaurants are seeded with the default SaaS plan state during the Phase 5.1 migration.
- The local test migration chooses a safe default plan assignment and does not store payment data.

### Default Local-Dev Logins

- Super admin:
  - email: `admin@example.com`
  - password: `change-me-later`
- Demo restaurant owner:
  - email: `owner@example.com`
  - password: `owner-change-me`

## Safety Warning

- The schema file includes development reset statements for local use.
- Do not run any `DROP` or mass-delete flow on production without a backup.

## Legacy File

This folder also contains the older single-restaurant backup schema:

- `restaurant.sql`

Keep it as a reference, but use the new `restaurant_builder_schema.sql` and `restaurant_builder_seed.sql` for the SaaS-ready version.
