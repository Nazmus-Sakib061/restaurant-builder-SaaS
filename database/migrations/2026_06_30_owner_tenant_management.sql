-- Restaurant Builder SaaS
-- Phase 4 owner onboarding and tenant management migration
-- This migration keeps existing tenant data intact and normalizes tenant role naming.

ALTER TABLE users
  MODIFY role ENUM('super_admin', 'restaurant_owner', 'restaurant_staff', 'manager') NOT NULL DEFAULT 'restaurant_owner';

ALTER TABLE restaurant_users
  MODIFY role ENUM('restaurant_owner', 'restaurant_staff', 'manager') NOT NULL DEFAULT 'restaurant_staff';

-- Make sure every restaurant with an owner_user_id has a matching owner membership row.
INSERT INTO restaurant_users (restaurant_id, user_id, role)
SELECT r.id, r.owner_user_id, 'restaurant_owner'
FROM restaurants r
WHERE r.owner_user_id IS NOT NULL
ON DUPLICATE KEY UPDATE
  role = VALUES(role);

-- Keep the restaurant owner profile in sync with the linked users table when data exists.
UPDATE restaurants r
JOIN users u ON u.id = r.owner_user_id
SET
  r.owner_name = COALESCE(NULLIF(r.owner_name, ''), u.name),
  r.owner_email = COALESCE(NULLIF(r.owner_email, ''), u.email),
  r.updated_at = NOW()
WHERE r.owner_user_id IS NOT NULL;

-- Normalize legacy membership labels to the SaaS role set.
UPDATE restaurant_users ru
JOIN restaurants r ON r.id = ru.restaurant_id
SET ru.role = CASE
  WHEN r.owner_user_id = ru.user_id THEN 'restaurant_owner'
  ELSE 'restaurant_staff'
END
WHERE ru.role IS NULL
   OR ru.role = ''
   OR ru.role = 'manager';

UPDATE users
SET role = 'restaurant_staff'
WHERE role IS NULL
   OR role = ''
   OR role = 'manager';

-- Keep restaurant owner user records aligned with the tenant owner mapping.
UPDATE users u
JOIN restaurants r ON r.owner_user_id = u.id
SET u.role = 'restaurant_owner'
WHERE u.role <> 'super_admin';
