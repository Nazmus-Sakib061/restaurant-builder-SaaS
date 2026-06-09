CREATE DATABASE IF NOT EXISTS demo_restaurant
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE demo_restaurant;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS foods;
DROP TABLE IF EXISTS deals;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS settings;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE categories (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(120) NOT NULL,
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY unique_categories_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE foods (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  category_id INT UNSIGNED NULL,
  name VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image VARCHAR(255) NOT NULL,
  rating DECIMAL(2,1) NOT NULL DEFAULT 4.8,
  is_featured TINYINT(1) NOT NULL DEFAULT 0,
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_foods_category_id (category_id),
  CONSTRAINT fk_foods_category
    FOREIGN KEY (category_id) REFERENCES categories (id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE deals (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  old_price DECIMAL(10,2) NOT NULL,
  new_price DECIMAL(10,2) NOT NULL,
  image VARCHAR(255) NOT NULL,
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE orders (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  customer_name VARCHAR(120) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  food_item VARCHAR(150) NOT NULL,
  message TEXT NOT NULL,
  status ENUM('pending', 'confirmed', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE settings (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  restaurant_name VARCHAR(150) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  address VARCHAR(255) NOT NULL,
  opening_hours VARCHAR(150) NOT NULL,
  logo VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO categories (name, slug, status) VALUES
('Pizza', 'pizza', 'active'),
('Burger', 'burger', 'active'),
('Shawarma', 'shawarma', 'active'),
('Drinks', 'drinks', 'active');

INSERT INTO foods (category_id, name, description, price, image, rating, is_featured, status) VALUES
(1, 'Margherita Blaze Pizza', 'Wood-fired crust, mozzarella, basil, and a smoky tomato glaze.', 12.90, 'images/Pizza/pizza 2.png', 4.9, 1, 'active'),
(1, 'Tandoori Fire Pizza', 'Tandoori chicken, peppers, onions, and a rich spiced sauce.', 14.50, 'images/Pizza/pizza 3.jpg', 4.8, 0, 'active'),
(1, 'Loaded Supreme Pizza', 'Layers of cheese, olives, chicken, and peppers for a full bite.', 16.20, 'images/Pizza/pizza 4.jpg', 5.0, 1, 'active'),
(2, 'Classic Flame Burger', 'Beef patty, crisp lettuce, tomato, and melted cheddar in a soft bun.', 8.90, 'images/Burger/burger 1.jpg', 4.7, 1, 'active'),
(2, 'Double Cheese Crunch', 'Crispy chicken, double cheese, onion, and our signature house sauce.', 10.40, 'images/Burger/Burger 2.jpg', 4.8, 0, 'active'),
(2, 'Crispy Chicken Tower', 'Golden fried chicken, cheddar, pickles, and a smoky glaze.', 9.80, 'images/Burger/Burger  3.jpg', 4.9, 0, 'active'),
(3, 'Chicken Shawarma Wrap', 'Soft wrap filled with shawarma strips, garlic sauce, and fresh salad.', 7.90, 'images/Combo/Combo 1.jpg', 4.8, 1, 'active'),
(3, 'Royal Shawarma Feast Box', 'A loaded box with wraps, fries, dips, and a street-food style finish.', 11.20, 'images/Combo/Combo 2.jpg', 4.7, 0, 'active'),
(3, 'Mixed Grill Shawarma Platter', 'Smoky mix of grilled bites, wraps, and sides for sharing at the table.', 13.60, 'images/Combo/Combo 3.jpg', 4.9, 0, 'active'),
(4, 'Lime Spark Soda', 'Bright citrus bubbles to cut through the richness of a big meal.', 2.90, 'images/Dinks/Drinks 1.jpg', 4.6, 0, 'active'),
(4, 'Strawberry Chill Juice', 'Sweet, cool, and refreshing with a smooth finish on warm evenings.', 4.40, 'images/Dinks/Drinks 3.jpg', 4.8, 0, 'active'),
(4, 'Oreo Dream Shake', 'Thick, creamy, and topped like a dessert worth slowing down for.', 5.20, 'images/Dinks/Drinks 5.jpg', 4.9, 1, 'active');

INSERT INTO deals (title, description, old_price, new_price, image, status) VALUES
('Family Pizza Combo', 'A large pizza, extra dip, and a soft drink bundle for easy family dinners.', 34.00, 24.99, 'images/Pizza/pizza 5.jpg', 'active'),
('Burger Meal Deal', 'Two burgers, fries, and a cool drink packed into one easy lunch option.', 19.00, 14.50, 'images/Burger/Burger  4.jpg', 'active'),
('Shawarma + Drinks Combo', 'A wrap-heavy combo with a cold drink to keep the meal balanced and lively.', 18.00, 12.99, 'images/Combo/Combo 1.jpg', 'active');

INSERT INTO settings (restaurant_name, phone, address, opening_hours, logo) VALUES
('Pizza House', '+880 1712 345 678', 'Demo Restaurant Road, Dhaka, Bangladesh', 'Every day, 11:00 AM - 11:30 PM', '');
