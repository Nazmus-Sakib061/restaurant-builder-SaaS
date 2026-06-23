# Restaurant Builder Backend

This backend is built for the `restaurant_builder_saas` schema and supports tenant-aware APIs using the `?tenant=` slug parameter.

## Database

- Database name: `restaurant_builder_saas`
- Charset: `utf8mb4`
- Import order:
  1. `backend/database/restaurant_builder_schema.sql`
  2. `backend/database/restaurant_builder_seed.sql`

## Restaurant context

Most APIs resolve the active restaurant from:

`?tenant=default`

If the parameter is missing, the backend defaults to:

`default`

Legacy restaurant URLs are still supported as compatibility aliases, for example `?restaurant=demo-pizza-house`.

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

## Auth

- `backend/api/auth.php`
  - `GET` current session user and accessible restaurants
  - `POST` login
  - `DELETE` logout

- `backend/api/current-user.php`
  - `GET` current session user payload

## API endpoints

- `backend/api/restaurants.php`
  - `GET` restaurants visible to the logged-in user

- `backend/api/settings.php`
  - `GET` current restaurant settings for the active session
  - `POST` / `PUT` upsert settings for the active restaurant

- `backend/api/categories.php`
  - `GET` restaurant categories for the active session
  - `POST` create category
  - `PUT` update category
  - `DELETE` soft delete category

- `backend/api/menu-items.php`
  - `GET` restaurant menu items for the active session
  - Supports `category`, `featured`, and `available` filters
  - `POST` create menu item
  - `PUT` update menu item
  - `DELETE` soft delete menu item

- `backend/api/deals.php`
  - `GET` active deals with nested items for the active session
  - `POST` / `PUT` / `DELETE` deal management

- `backend/api/gallery.php`
  - `GET` active gallery images for the active session
  - `POST` / `PUT` / `DELETE` gallery management
- `backend/api/uploads.php`
  - `POST` restaurant-scoped Gallery image uploads
  - accepts JPG, PNG, and WebP images up to 3 MB
  - stores files under `uploads/restaurants/{restaurant_id}/gallery/`
  - returns a project-relative public path; it does not write an absolute server path to the database

- `backend/api/orders.php`
  - `GET` restaurant orders with items for the active session
  - `POST` create order + order items in a transaction for the public site
  - `PUT` update order fields for the admin session
  - `DELETE` remove order for the admin session

- `backend/api/reservations.php`
  - `GET` restaurant reservations for the admin session
  - `POST` create reservation for the public site
  - `PUT` update reservation status for the admin session

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

Admin CRUD now uses PHP session authentication and restaurant ownership checks.
Public visitors should continue to use `site-data.php` and the public `POST` flows on `orders.php` and `reservations.php`.

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

- `default`
- `demo-pizza-house`
- `demo-coffee-house`
- `demo-biryani-house`

## Quick test URLs

- `http://localhost/restaurant_builder_SaaS/backend/api/site-data.php?tenant=default`
- `http://localhost/restaurant_builder/admin/login.php`
- `http://localhost/restaurant_builder_SaaS/backend/api/current-user.php`

Repeat the same URLs with:

- `demo-coffee-house`
- `demo-biryani-house`
