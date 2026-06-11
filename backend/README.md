# Restaurant Builder Backend

This backend is built for the `restaurant_builder_db` schema and supports multi-restaurant APIs using the `?restaurant=` slug parameter.

## Database

- Database name: `restaurant_builder_db`
- Charset: `utf8mb4`
- Import order:
  1. `backend/database/restaurant_builder_schema.sql`
  2. `backend/database/restaurant_builder_seed.sql`

## Restaurant context

Most APIs resolve the active restaurant from:

`?restaurant=demo-pizza-house`

If the parameter is missing, the backend defaults to:

`demo-pizza-house`

Only active restaurants are returned by the shared context helper.

## JSON response shape

Success:

```json
{
  "success": true,
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Error message"
}
```

Common response helpers live in `backend/api/_response.php`.

## API endpoints

- `backend/api/restaurants.php`
  - `GET` active restaurants list

- `backend/api/settings.php`
  - `GET` current restaurant settings
  - `POST` / `PUT` upsert settings for the active restaurant

- `backend/api/categories.php`
  - `GET` restaurant categories
  - `POST` create category
  - `PUT` update category
  - `DELETE` soft delete category

- `backend/api/menu-items.php`
  - `GET` restaurant menu items
  - Supports `category`, `featured`, and `available` filters
  - `POST` create menu item
  - `PUT` update menu item
  - `DELETE` soft delete menu item

- `backend/api/deals.php`
  - `GET` active deals with nested items
  - `POST` / `PUT` / `DELETE` deal management

- `backend/api/gallery.php`
  - `GET` active gallery images
  - `POST` / `PUT` / `DELETE` gallery management
- `backend/api/uploads.php`
  - `POST` restaurant-scoped Gallery image uploads
  - accepts JPG, PNG, and WebP images up to 3 MB
  - stores files under `uploads/restaurants/{restaurant_id}/gallery/`
  - returns a project-relative public path; it does not write an absolute server path to the database

- `backend/api/orders.php`
  - `GET` restaurant orders with items
  - `POST` create order + order items in a transaction
  - `PUT` update order fields
  - `DELETE` remove order

- `backend/api/reservations.php`
  - `GET` restaurant reservations
  - `POST` create reservation
  - `PUT` update reservation status

- `backend/api/site-data.php`
  - Combined public read-only site payload:
    - restaurant
    - settings
    - categories
    - menu_items
    - deals
    - gallery

## Legacy compatibility

`backend/api/foods.php` is kept as a legacy alias and loads `menu-items.php`.
New code should use `menu-items.php` directly.

This backend layer is intentionally read-only for public site data. Admin CRUD can be connected later without changing the public API shape.

Public write methods currently return `403` with:

`Write operations are disabled until authentication is connected.`

The temporary guard lives in `backend/api/_helpers.php` and should be replaced with Core Auth role-based protection when the admin panel is wired.

## Tenant isolation

Every restaurant-specific query is scoped by `restaurant_id`.
Do not hard-code `restaurant_id = 1` in future code paths.

## Soft deletes

Several resources use soft delete by updating `status` to `inactive`:

- categories
- menu items
- deals
- gallery images

## Public demo slugs

- `demo-pizza-house`
- `demo-coffee-house`
- `demo-biryani-house`

## Quick test URLs

- `http://localhost/restaurant_builder/backend/api/settings.php?restaurant=demo-pizza-house`
- `http://localhost/restaurant_builder/backend/api/categories.php?restaurant=demo-pizza-house`
- `http://localhost/restaurant_builder/backend/api/menu-items.php?restaurant=demo-pizza-house`
- `http://localhost/restaurant_builder/backend/api/deals.php?restaurant=demo-pizza-house`
- `http://localhost/restaurant_builder/backend/api/gallery.php?restaurant=demo-pizza-house`
- `http://localhost/restaurant_builder/backend/api/reservations.php?restaurant=demo-pizza-house`
- `http://localhost/restaurant_builder/backend/api/site-data.php?restaurant=demo-pizza-house`

Repeat the same URLs with:

- `demo-coffee-house`
- `demo-biryani-house`
