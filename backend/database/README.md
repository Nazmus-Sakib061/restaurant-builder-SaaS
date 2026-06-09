# Restaurant Builder Database

This folder contains the MySQL files for the SaaS-ready multi-tenant database used by `restaurant_builder`.

## Database Name

- `restaurant_builder_db`

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
3. Create or select the database `restaurant_builder_db`.
4. Import `restaurant_builder_schema.sql`.
5. Import `restaurant_builder_seed.sql`.

If you prefer the SQL scripts to create the database automatically, you can import the schema file first and let it create `restaurant_builder_db` for you.

## Multi-Tenant Notes

- `restaurant_id` is the tenant boundary.
- Every restaurant-specific table uses `restaurant_id` so each restaurant can keep its own menu, settings, orders, reservations, and deals.
- `slug` is the URL-safe unique identifier used for lookups such as `demo-pizza-house` or `family-pizza-combo`.
- `theme_presets` stores reusable design palettes so different restaurant types can switch visual themes without changing the frontend code.

## Core Auth Integration Later

- The schema includes `owner_user_id` on `restaurants` as a future bridge to the Core Auth Module.
- No auth tables are seeded here.
- User accounts, login, and permissions should be connected later from the separate auth module.

## Safety Warning

- The schema file includes development reset statements for local use.
- Do not run any `DROP` or mass-delete flow on production without a backup.

## Legacy File

This folder also contains the older single-restaurant backup schema:

- `restaurant.sql`

Keep it as a reference, but use the new `restaurant_builder_schema.sql` and `restaurant_builder_seed.sql` for the SaaS-ready version.
