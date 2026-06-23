-- Restaurant Builder SaaS
-- Tenant foundation migration
-- This migration keeps the existing restaurant_id-based tenant model and
-- establishes the default local tenant as "Default Restaurant" / "default".

UPDATE restaurants
SET
  name = 'Default Restaurant',
  slug = 'default',
  updated_at = NOW()
WHERE id = 1;

UPDATE restaurant_settings
SET
  site_title = 'Default Restaurant',
  about_title = 'About Default Restaurant',
  updated_at = NOW()
WHERE restaurant_id = 1;

-- Legacy compatibility alias:
-- Requests for demo-pizza-house are resolved in backend/api/_tenant.php.
