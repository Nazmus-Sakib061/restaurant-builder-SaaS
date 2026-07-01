-- Phase 5.1 plan and feature access foundation
USE restaurant_builder_saas;

CREATE TABLE IF NOT EXISTS plans (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(150) NOT NULL,
  slug VARCHAR(191) NOT NULL,
  description TEXT NULL DEFAULT NULL,
  price_monthly DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  price_yearly DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_plans_slug (slug),
  KEY idx_plans_status (status),
  KEY idx_plans_sort_order (sort_order),
  KEY idx_plans_created_at (created_at),
  KEY idx_plans_updated_at (updated_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS plan_features (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  plan_id BIGINT UNSIGNED NOT NULL,
  feature_key VARCHAR(64) NOT NULL,
  is_enabled TINYINT(1) NOT NULL DEFAULT 0,
  limit_value INT NULL DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_plan_features_plan_feature (plan_id, feature_key),
  KEY idx_plan_features_plan_id (plan_id),
  KEY idx_plan_features_feature_key (feature_key),
  CONSTRAINT fk_plan_features_plan
    FOREIGN KEY (plan_id) REFERENCES plans (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS restaurant_subscriptions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  restaurant_id BIGINT UNSIGNED NOT NULL,
  plan_id BIGINT UNSIGNED NOT NULL,
  status ENUM('active', 'trialing', 'inactive', 'cancelled') NOT NULL DEFAULT 'active',
  starts_at DATETIME NULL DEFAULT NULL,
  ends_at DATETIME NULL DEFAULT NULL,
  trial_ends_at DATETIME NULL DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_restaurant_subscriptions_restaurant_id (restaurant_id),
  KEY idx_restaurant_subscriptions_plan_id (plan_id),
  KEY idx_restaurant_subscriptions_status (status),
  KEY idx_restaurant_subscriptions_created_at (created_at),
  KEY idx_restaurant_subscriptions_updated_at (updated_at),
  CONSTRAINT fk_restaurant_subscriptions_restaurant
    FOREIGN KEY (restaurant_id) REFERENCES restaurants (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_restaurant_subscriptions_plan
    FOREIGN KEY (plan_id) REFERENCES plans (id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO plans (
  name,
  slug,
  description,
  price_monthly,
  price_yearly,
  status,
  sort_order
) VALUES
('Free', 'free', 'Starter plan for basic content management.', 0.00, 0.00, 'active', 10),
('Basic', 'basic', 'For restaurants that need payments and gallery support.', 29.00, 290.00, 'active', 20),
('Pro', 'pro', 'For growing restaurants that need deeper operations.', 59.00, 590.00, 'active', 30),
('Premium', 'premium', 'Full access plan with all unlocked feature flags.', 99.00, 990.00, 'active', 40)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  description = VALUES(description),
  price_monthly = VALUES(price_monthly),
  price_yearly = VALUES(price_yearly),
  status = VALUES(status),
  sort_order = VALUES(sort_order),
  updated_at = CURRENT_TIMESTAMP;

SELECT id INTO @free_plan_id
FROM plans
WHERE slug = 'free'
LIMIT 1;

SELECT id INTO @basic_plan_id
FROM plans
WHERE slug = 'basic'
LIMIT 1;

SELECT id INTO @pro_plan_id
FROM plans
WHERE slug = 'pro'
LIMIT 1;

SELECT id INTO @premium_plan_id
FROM plans
WHERE slug = 'premium'
LIMIT 1;

INSERT INTO plan_features (
  plan_id,
  feature_key,
  is_enabled,
  limit_value
) VALUES
(@free_plan_id, 'categories', 1, NULL),
(@free_plan_id, 'menu_items', 1, 12),
(@free_plan_id, 'orders', 1, NULL),
(@free_plan_id, 'payments', 0, NULL),
(@free_plan_id, 'gallery', 0, NULL),
(@free_plan_id, 'deals', 0, NULL),
(@free_plan_id, 'statistics', 0, NULL),
(@free_plan_id, 'exports', 0, NULL),
(@free_plan_id, 'staff_management', 0, NULL),
(@free_plan_id, 'branding', 0, NULL),
(@free_plan_id, 'custom_domain', 0, NULL),
(@basic_plan_id, 'categories', 1, NULL),
(@basic_plan_id, 'menu_items', 1, NULL),
(@basic_plan_id, 'orders', 1, NULL),
(@basic_plan_id, 'payments', 1, NULL),
(@basic_plan_id, 'gallery', 1, NULL),
(@basic_plan_id, 'deals', 0, NULL),
(@basic_plan_id, 'statistics', 0, NULL),
(@basic_plan_id, 'exports', 0, NULL),
(@basic_plan_id, 'staff_management', 0, NULL),
(@basic_plan_id, 'branding', 1, NULL),
(@basic_plan_id, 'custom_domain', 0, NULL),
(@pro_plan_id, 'categories', 1, NULL),
(@pro_plan_id, 'menu_items', 1, NULL),
(@pro_plan_id, 'orders', 1, NULL),
(@pro_plan_id, 'payments', 1, NULL),
(@pro_plan_id, 'gallery', 1, NULL),
(@pro_plan_id, 'deals', 1, NULL),
(@pro_plan_id, 'statistics', 1, NULL),
(@pro_plan_id, 'exports', 1, NULL),
(@pro_plan_id, 'staff_management', 1, NULL),
(@pro_plan_id, 'branding', 1, NULL),
(@pro_plan_id, 'custom_domain', 0, NULL),
(@premium_plan_id, 'categories', 1, NULL),
(@premium_plan_id, 'menu_items', 1, NULL),
(@premium_plan_id, 'orders', 1, NULL),
(@premium_plan_id, 'payments', 1, NULL),
(@premium_plan_id, 'gallery', 1, NULL),
(@premium_plan_id, 'deals', 1, NULL),
(@premium_plan_id, 'statistics', 1, NULL),
(@premium_plan_id, 'exports', 1, NULL),
(@premium_plan_id, 'staff_management', 1, NULL),
(@premium_plan_id, 'branding', 1, NULL),
(@premium_plan_id, 'custom_domain', 1, NULL)
ON DUPLICATE KEY UPDATE
  is_enabled = VALUES(is_enabled),
  limit_value = VALUES(limit_value),
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO restaurant_subscriptions (
  restaurant_id,
  plan_id,
  status,
  starts_at,
  ends_at,
  trial_ends_at
)
SELECT
  r.id,
  @premium_plan_id,
  'active',
  COALESCE(r.created_at, NOW()),
  NULL,
  NULL
FROM restaurants r
LEFT JOIN restaurant_subscriptions rs
  ON rs.restaurant_id = r.id
WHERE rs.id IS NULL;
