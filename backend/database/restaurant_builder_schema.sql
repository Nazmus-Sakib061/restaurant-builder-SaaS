CREATE DATABASE IF NOT EXISTS restaurant_builder_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE restaurant_builder_db;

-- Development reset section. Do not use on production without backup.
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS reservations;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS deal_items;
DROP TABLE IF EXISTS gallery_images;
DROP TABLE IF EXISTS menu_items;
DROP TABLE IF EXISTS menu_categories;
DROP TABLE IF EXISTS restaurant_settings;
DROP TABLE IF EXISTS deals;
DROP TABLE IF EXISTS theme_presets;
DROP TABLE IF EXISTS restaurants;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE restaurants (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(150) NOT NULL,
  slug VARCHAR(191) NOT NULL,
  business_type VARCHAR(100) NOT NULL DEFAULT 'restaurant',
  owner_name VARCHAR(150) NULL DEFAULT NULL,
  owner_email VARCHAR(191) NULL DEFAULT NULL,
  owner_phone VARCHAR(30) NULL DEFAULT NULL,
  owner_user_id INT NULL DEFAULT NULL COMMENT 'Reserved for future Core Auth users.id mapping',
  status ENUM('active', 'inactive', 'suspended') NOT NULL DEFAULT 'active',
  subscription_status ENUM('trial', 'active', 'expired', 'cancelled') NOT NULL DEFAULT 'trial',
  trial_ends_at DATETIME NULL DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_restaurants_slug (slug),
  KEY idx_restaurants_business_type (business_type),
  KEY idx_restaurants_status (status),
  KEY idx_restaurants_subscription_status (subscription_status),
  KEY idx_restaurants_created_at (created_at),
  KEY idx_restaurants_updated_at (updated_at),
  KEY idx_restaurants_owner_email (owner_email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE theme_presets (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(150) NOT NULL,
  slug VARCHAR(191) NOT NULL,
  restaurant_type VARCHAR(100) NOT NULL,
  primary_color VARCHAR(20) NOT NULL,
  secondary_color VARCHAR(20) NOT NULL,
  accent_color VARCHAR(20) NOT NULL,
  background_color VARCHAR(20) NOT NULL,
  text_color VARCHAR(20) NOT NULL,
  button_color VARCHAR(20) NOT NULL,
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_theme_presets_slug (slug),
  KEY idx_theme_presets_restaurant_type (restaurant_type),
  KEY idx_theme_presets_status (status),
  KEY idx_theme_presets_created_at (created_at),
  KEY idx_theme_presets_updated_at (updated_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE restaurant_settings (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  restaurant_id BIGINT UNSIGNED NOT NULL,
  logo VARCHAR(255) NULL DEFAULT NULL,
  favicon VARCHAR(255) NULL DEFAULT NULL,
  site_title VARCHAR(191) NOT NULL,
  hero_title VARCHAR(191) NOT NULL,
  hero_subtitle TEXT NOT NULL,
  hero_button_text VARCHAR(80) NOT NULL,
  hero_button_link VARCHAR(255) NOT NULL DEFAULT '#contact',
  hero_image VARCHAR(255) NOT NULL,
  about_title VARCHAR(191) NOT NULL,
  about_text TEXT NOT NULL,
  about_image VARCHAR(255) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  email VARCHAR(191) NOT NULL,
  address VARCHAR(255) NOT NULL,
  google_map_embed_url TEXT NULL,
  opening_hours VARCHAR(191) NOT NULL,
  facebook_url VARCHAR(255) NULL DEFAULT NULL,
  instagram_url VARCHAR(255) NULL DEFAULT NULL,
  youtube_url VARCHAR(255) NULL DEFAULT NULL,
  whatsapp_number VARCHAR(30) NULL DEFAULT NULL,
  theme_preset_id BIGINT UNSIGNED NULL DEFAULT NULL,
  primary_color VARCHAR(20) NOT NULL,
  secondary_color VARCHAR(20) NOT NULL,
  accent_color VARCHAR(20) NOT NULL,
  background_color VARCHAR(20) NOT NULL,
  text_color VARCHAR(20) NOT NULL,
  button_color VARCHAR(20) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_restaurant_settings_restaurant_id (restaurant_id),
  KEY idx_restaurant_settings_theme_preset_id (theme_preset_id),
  KEY idx_restaurant_settings_created_at (created_at),
  KEY idx_restaurant_settings_updated_at (updated_at),
  CONSTRAINT fk_restaurant_settings_restaurant
    FOREIGN KEY (restaurant_id) REFERENCES restaurants (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_restaurant_settings_theme_preset
    FOREIGN KEY (theme_preset_id) REFERENCES theme_presets (id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE menu_categories (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  restaurant_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(150) NOT NULL,
  slug VARCHAR(191) NOT NULL,
  description TEXT NULL,
  image VARCHAR(255) NULL DEFAULT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_menu_categories_restaurant_slug (restaurant_id, slug),
  KEY idx_menu_categories_restaurant_id (restaurant_id),
  KEY idx_menu_categories_status (status),
  KEY idx_menu_categories_sort_order (sort_order),
  KEY idx_menu_categories_created_at (created_at),
  KEY idx_menu_categories_updated_at (updated_at),
  CONSTRAINT fk_menu_categories_restaurant
    FOREIGN KEY (restaurant_id) REFERENCES restaurants (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE menu_items (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  restaurant_id BIGINT UNSIGNED NOT NULL,
  category_id BIGINT UNSIGNED NULL DEFAULT NULL,
  name VARCHAR(150) NOT NULL,
  slug VARCHAR(191) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  discount_price DECIMAL(10,2) NULL DEFAULT NULL,
  image VARCHAR(255) NOT NULL,
  badge_text VARCHAR(100) NULL DEFAULT NULL,
  is_featured TINYINT(1) NOT NULL DEFAULT 0,
  is_available TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0,
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_menu_items_restaurant_slug (restaurant_id, slug),
  KEY idx_menu_items_restaurant_id (restaurant_id),
  KEY idx_menu_items_category_id (category_id),
  KEY idx_menu_items_status (status),
  KEY idx_menu_items_is_featured (is_featured),
  KEY idx_menu_items_sort_order (sort_order),
  KEY idx_menu_items_created_at (created_at),
  KEY idx_menu_items_updated_at (updated_at),
  CONSTRAINT fk_menu_items_restaurant
    FOREIGN KEY (restaurant_id) REFERENCES restaurants (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_menu_items_category
    FOREIGN KEY (category_id) REFERENCES menu_categories (id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE deals (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  restaurant_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(150) NOT NULL,
  slug VARCHAR(191) NOT NULL,
  description TEXT NOT NULL,
  regular_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  deal_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  image VARCHAR(255) NOT NULL,
  badge_text VARCHAR(100) NULL DEFAULT NULL,
  starts_at DATETIME NULL DEFAULT NULL,
  ends_at DATETIME NULL DEFAULT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_deals_restaurant_slug (restaurant_id, slug),
  KEY idx_deals_restaurant_id (restaurant_id),
  KEY idx_deals_status (status),
  KEY idx_deals_sort_order (sort_order),
  KEY idx_deals_created_at (created_at),
  KEY idx_deals_updated_at (updated_at),
  CONSTRAINT fk_deals_restaurant
    FOREIGN KEY (restaurant_id) REFERENCES restaurants (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE deal_items (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  deal_id BIGINT UNSIGNED NOT NULL,
  menu_item_id BIGINT UNSIGNED NULL DEFAULT NULL,
  quantity INT UNSIGNED NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_deal_items_deal_id (deal_id),
  KEY idx_deal_items_menu_item_id (menu_item_id),
  KEY idx_deal_items_created_at (created_at),
  CONSTRAINT fk_deal_items_deal
    FOREIGN KEY (deal_id) REFERENCES deals (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_deal_items_menu_item
    FOREIGN KEY (menu_item_id) REFERENCES menu_items (id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE gallery_images (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  restaurant_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(150) NOT NULL,
  caption TEXT NULL DEFAULT NULL,
  image VARCHAR(255) NOT NULL,
  alt_text VARCHAR(255) NULL DEFAULT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_gallery_images_restaurant_id (restaurant_id),
  KEY idx_gallery_images_status (status),
  KEY idx_gallery_images_sort_order (sort_order),
  KEY idx_gallery_images_created_at (created_at),
  KEY idx_gallery_images_updated_at (updated_at),
  CONSTRAINT fk_gallery_images_restaurant
    FOREIGN KEY (restaurant_id) REFERENCES restaurants (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE orders (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  restaurant_id BIGINT UNSIGNED NOT NULL,
  customer_name VARCHAR(120) NOT NULL,
  customer_phone VARCHAR(30) NOT NULL,
  customer_email VARCHAR(191) NULL DEFAULT NULL,
  customer_address TEXT NULL,
  order_type ENUM('dine_in', 'takeaway', 'delivery') NOT NULL DEFAULT 'delivery',
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  delivery_charge DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  payment_method ENUM('cash', 'bkash', 'nagad', 'card', 'other') NOT NULL DEFAULT 'cash',
  payment_status ENUM('unpaid', 'paid', 'partial', 'refunded') NOT NULL DEFAULT 'unpaid',
  order_status ENUM('pending', 'accepted', 'preparing', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
  note TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_orders_restaurant_id (restaurant_id),
  KEY idx_orders_order_status (order_status),
  KEY idx_orders_payment_status (payment_status),
  KEY idx_orders_order_type (order_type),
  KEY idx_orders_created_at (created_at),
  KEY idx_orders_updated_at (updated_at),
  CONSTRAINT fk_orders_restaurant
    FOREIGN KEY (restaurant_id) REFERENCES restaurants (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE order_items (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id BIGINT UNSIGNED NOT NULL,
  menu_item_id BIGINT UNSIGNED NULL DEFAULT NULL,
  item_name VARCHAR(150) NOT NULL,
  quantity INT UNSIGNED NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  total_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_order_items_order_id (order_id),
  KEY idx_order_items_menu_item_id (menu_item_id),
  KEY idx_order_items_created_at (created_at),
  CONSTRAINT fk_order_items_order
    FOREIGN KEY (order_id) REFERENCES orders (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_order_items_menu_item
    FOREIGN KEY (menu_item_id) REFERENCES menu_items (id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE reservations (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  restaurant_id BIGINT UNSIGNED NOT NULL,
  customer_name VARCHAR(120) NOT NULL,
  customer_phone VARCHAR(30) NOT NULL,
  customer_email VARCHAR(191) NULL DEFAULT NULL,
  reservation_date DATE NOT NULL,
  reservation_time TIME NOT NULL,
  number_of_people INT UNSIGNED NOT NULL DEFAULT 2,
  message TEXT NULL,
  status ENUM('pending', 'confirmed', 'cancelled', 'completed') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_reservations_restaurant_id (restaurant_id),
  KEY idx_reservations_status (status),
  KEY idx_reservations_reservation_date (reservation_date),
  KEY idx_reservations_created_at (created_at),
  KEY idx_reservations_updated_at (updated_at),
  CONSTRAINT fk_reservations_restaurant
    FOREIGN KEY (restaurant_id) REFERENCES restaurants (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
