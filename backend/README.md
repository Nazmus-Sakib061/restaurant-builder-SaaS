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
  - returns `user`, `active_restaurant`, `restaurants`, `session.active_restaurant_id`, and `active_restaurant_id`

- `backend/api/select-restaurant.php`
  - `POST` safely change the active restaurant for the logged-in admin session
  - accepts `restaurant_id` or a restaurant slug
  - checks restaurant access before updating the session

## Plan Access Control

- `backend/helpers/feature_gate.php`
  - central plan and feature lookup helper
  - exposes `getRestaurantPlan($restaurantId)`, `getPlanFeatures($planId)`, `canUseFeature($restaurantId, $featureKey)`, and `requireFeature($restaurantId, $featureKey)`
- `backend/api/restaurant-plans.php`
  - `GET` plan and subscription overview for a restaurant
  - `POST` / `PATCH` super-admin plan assignment
- `backend/api/site-data.php`
  - filters public `deals` and `gallery` payloads when the active plan disables those features
- `backend/api/current-user.php`
  - includes safe `plan` info for the active restaurant context when available
- `backend/api/deals.php` and `backend/api/gallery.php`
  - gate create/update/delete writes with backend plan checks
- `backend/api/settings.php`
  - `GET` current restaurant settings for the active session
  - `POST` / `PUT` / `PATCH` upsert settings for the active restaurant
  - write operations require the `branding` feature for the active plan
- `backend/api/uploads.php`
  - restaurant-scoped image uploads for gallery, menu, deals, and settings flows
  - `gallery`, `deals`, and `settings` uploads are feature-gated before the file is accepted

Phase 5.1 uses the existing `restaurants` table as the tenant table and stores current plan state in `restaurant_subscriptions`.

## API endpoints

- `backend/api/restaurants.php`
  - `GET` restaurants visible to the logged-in user
  - `POST` super-admin restaurant creation
  - `PATCH` / `PUT` / `DELETE` super-admin restaurant maintenance

- `backend/api/restaurant-owners.php`
  - `GET` super-admin owner assignment overview
  - `POST` super-admin owner creation and assignment
  - accepts active or inactive restaurants for super-admin onboarding, while tenant switching remains restricted by `select-restaurant.php`

- `backend/api/settings.php`
  - `GET` current restaurant settings for the active session
  - `POST` / `PUT` upsert settings for the active restaurant
  - the admin dashboard shows a plan-access summary card and a branding availability note alongside this form

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
  - honors the active plan before allowing gallery, deals, or branding-related uploads

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

## Phase 5.5 Smoke Regression

Run the repeatable SaaS feature smoke script from the repo root:

`php tests/smoke-saas-plan-features.php`

The script exercises tenant selection, plan assignment, branding write protection, gallery/deals feature locks, and cleanup for temporary free/pro tenants.

## Legacy compatibility

`backend/api/foods.php` is kept as a legacy alias and loads `menu-items.php`.
New code should use `menu-items.php` directly.

Admin CRUD now uses PHP session authentication and restaurant ownership checks.
Public visitors should continue to use `site-data.php` and the public `POST` flows on `orders.php` and `reservations.php`.

Role normalization note:

- Legacy `manager` values still normalize to `restaurant_staff` in runtime helpers.
- New Phase 4 writes store `restaurant_staff` in the tenant membership tables.

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
- `http://localhost/restaurant_builder_SaaS/admin/login.php`
- `http://localhost/restaurant_builder_SaaS/backend/api/current-user.php`

Repeat the same URLs with:

- `demo-coffee-house`
- `demo-biryani-house`
