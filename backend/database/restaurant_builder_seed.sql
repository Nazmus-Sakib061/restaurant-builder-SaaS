USE restaurant_builder_db;

SET FOREIGN_KEY_CHECKS = 0;

DELETE FROM order_items;
DELETE FROM reservations;
DELETE FROM orders;
DELETE FROM revenue_transactions;
DELETE FROM deal_items;
DELETE FROM gallery_images;
DELETE FROM menu_items;
DELETE FROM menu_categories;
DELETE FROM restaurant_settings;
DELETE FROM deals;
DELETE FROM restaurant_users;
DELETE FROM users;
DELETE FROM restaurants;
DELETE FROM theme_presets;

SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO theme_presets (
  name,
  slug,
  restaurant_type,
  primary_color,
  secondary_color,
  accent_color,
  background_color,
  text_color,
  button_color,
  status
) VALUES
('Pizza House Dark', 'pizza-house-dark', 'pizza', '#ef2b24', '#ff9f1c', '#ffffff', '#050505', '#ffffff', '#ef2b24', 'active'),
('Coffee House Dark', 'coffee-house-dark', 'coffee', '#c18c5d', '#ffb347', '#ffffff', '#0b0b0b', '#ffffff', '#c18c5d', 'active'),
('Biryani House Dark', 'biryani-house-dark', 'biryani', '#ef2b24', '#ff9f1c', '#ffffff', '#050505', '#ffffff', '#ef2b24', 'active');

SELECT id INTO @pizza_theme_id
FROM theme_presets
WHERE slug = 'pizza-house-dark'
LIMIT 1;

SELECT id INTO @coffee_theme_id
FROM theme_presets
WHERE slug = 'coffee-house-dark'
LIMIT 1;

SELECT id INTO @biryani_theme_id
FROM theme_presets
WHERE slug = 'biryani-house-dark'
LIMIT 1;

INSERT INTO users (
  name,
  email,
  password_hash,
  role,
  status
) VALUES (
  'Super Admin',
  'admin@example.com',
  '$2y$10$DMf279wQSlKc61v07.v3ZOmEQeks6oIH0WO7HhB4RTlyVVXzSJuXW',
  'super_admin',
  'active'
), (
  'Demo Owner',
  'owner@example.com',
  '$2y$10$WNk8Q9YD7brg0il8167uGO.6JVrrmNPrLKqaJE8LBfAVonSVrycsG',
  'restaurant_owner',
  'active'
);

SELECT id INTO @demo_owner_id
FROM users
WHERE email = 'owner@example.com'
LIMIT 1;

INSERT INTO restaurants (
  name,
  slug,
  business_type,
  owner_name,
  owner_email,
  owner_phone,
  owner_user_id,
  status,
  subscription_status,
  trial_ends_at
) VALUES (
  'Demo Pizza House',
  'demo-pizza-house',
  'pizza',
  'Demo Owner',
  'hello@pizzahouse.demo',
  '+880 1712 345 678',
  @demo_owner_id,
  'active',
  'trial',
  DATE_ADD(NOW(), INTERVAL 30 DAY)
);

SELECT LAST_INSERT_ID() INTO @pizza_restaurant_id;

INSERT INTO restaurant_users (
  restaurant_id,
  user_id,
  role
) VALUES (
  @pizza_restaurant_id,
  @demo_owner_id,
  'restaurant_owner'
);

INSERT INTO restaurant_settings (
  restaurant_id,
  logo,
  favicon,
  site_title,
  hero_title,
  hero_subtitle,
  hero_button_text,
  hero_button_link,
  hero_image,
  about_title,
  about_text,
  about_image,
  phone,
  email,
  address,
  google_map_embed_url,
  opening_hours,
  facebook_url,
  instagram_url,
  youtube_url,
  whatsapp_number,
  theme_preset_id,
  primary_color,
  secondary_color,
  accent_color,
  background_color,
  text_color,
  button_color
) VALUES (
  @pizza_restaurant_id,
  NULL,
  NULL,
  'Demo Pizza House',
  'Best Food in Your Town',
  'Dark luxury pizza-house style with hot pizzas, juicy burgers, and fresh drinks.',
  'Order Now',
  '#contact',
  'images/hero image.png',
  'About Demo Pizza House',
  'Freshly baked pizzas, smoky burgers, and late-night combo meals crafted for local food lovers.',
  'images/Pizza/pizza 1.png',
  '+880 1712 345 678',
  'hello@pizzahouse.demo',
  'Demo Restaurant Road, Dhaka, Bangladesh',
  NULL,
  'Every day, 11:00 AM - 11:30 PM',
  NULL,
  NULL,
  NULL,
  '8801712345678',
  @pizza_theme_id,
  '#ef2b24',
  '#ff9f1c',
  '#ffffff',
  '#050505',
  '#ffffff',
  '#ef2b24'
);

INSERT INTO menu_categories (
  restaurant_id,
  name,
  slug,
  description,
  image,
  sort_order,
  status
) VALUES
(@pizza_restaurant_id, 'Pizza', 'pizza', 'Hand-stretched pizzas with premium toppings.', 'images/Pizza/pizza 1.png', 1, 'active'),
(@pizza_restaurant_id, 'Burger', 'burger', 'Juicy burgers built for big appetites.', 'images/Burger/burger 1.jpg', 2, 'active'),
(@pizza_restaurant_id, 'Shawarma', 'shawarma', 'Loaded shawarma wraps and platters.', 'images/Combo/Combo 1.jpg', 3, 'active'),
(@pizza_restaurant_id, 'Drinks', 'drinks', 'Cold drinks and shakes to finish the meal.', 'images/Dinks/Drinks 4.jpg', 4, 'active');

SELECT id INTO @pizza_category_pizza_id
FROM menu_categories
WHERE restaurant_id = @pizza_restaurant_id AND slug = 'pizza'
LIMIT 1;

SELECT id INTO @pizza_category_burger_id
FROM menu_categories
WHERE restaurant_id = @pizza_restaurant_id AND slug = 'burger'
LIMIT 1;

SELECT id INTO @pizza_category_shawarma_id
FROM menu_categories
WHERE restaurant_id = @pizza_restaurant_id AND slug = 'shawarma'
LIMIT 1;

SELECT id INTO @pizza_category_drinks_id
FROM menu_categories
WHERE restaurant_id = @pizza_restaurant_id AND slug = 'drinks'
LIMIT 1;

INSERT INTO menu_items (
  restaurant_id,
  category_id,
  name,
  slug,
  description,
  price,
  discount_price,
  image,
  badge_text,
  is_featured,
  is_available,
  sort_order,
  status
) VALUES
(@pizza_restaurant_id, @pizza_category_pizza_id, 'Margherita Blaze Pizza', 'margherita-blaze-pizza', 'Wood-fired crust, mozzarella, basil, and a smoky tomato glaze.', 12.90, 10.90, 'images/Pizza/pizza 2.png', 'Best Seller', 1, 1, 1, 'active'),
(@pizza_restaurant_id, @pizza_category_pizza_id, 'Tandoori Fire Pizza', 'tandoori-fire-pizza', 'Tandoori chicken, peppers, onions, and a rich spiced sauce.', 14.50, NULL, 'images/Pizza/pizza 3.jpg', 'Hot', 0, 1, 2, 'active'),
(@pizza_restaurant_id, @pizza_category_pizza_id, 'Loaded Supreme Pizza', 'loaded-supreme-pizza', 'Layers of cheese, olives, chicken, and peppers for a full bite.', 16.20, 14.90, 'images/Pizza/pizza 4.jpg', 'Top Rated', 1, 1, 3, 'active'),
(@pizza_restaurant_id, @pizza_category_burger_id, 'Classic Flame Burger', 'classic-flame-burger', 'Beef patty, crisp lettuce, tomato, and melted cheddar in a soft bun.', 8.90, NULL, 'images/Burger/burger 1.jpg', 'Popular', 1, 1, 4, 'active'),
(@pizza_restaurant_id, @pizza_category_burger_id, 'Double Cheese Crunch', 'double-cheese-crunch', 'Crispy chicken, double cheese, onion, and signature house sauce.', 10.40, 9.50, 'images/Burger/Burger 2.jpg', 'Cheesy', 0, 1, 5, 'active'),
(@pizza_restaurant_id, @pizza_category_burger_id, 'Crispy Chicken Tower', 'crispy-chicken-tower', 'Golden fried chicken, cheddar, pickles, and a smoky glaze.', 9.80, NULL, 'images/Burger/Burger  3.jpg', 'Crunchy', 0, 1, 6, 'active'),
(@pizza_restaurant_id, @pizza_category_shawarma_id, 'Chicken Shawarma Wrap', 'chicken-shawarma-wrap', 'Soft wrap filled with shawarma strips, garlic sauce, and fresh salad.', 7.90, NULL, 'images/Combo/Combo 1.jpg', 'Fresh', 1, 1, 7, 'active'),
(@pizza_restaurant_id, @pizza_category_shawarma_id, 'Royal Shawarma Feast Box', 'royal-shawarma-feast-box', 'A loaded box with wraps, fries, dips, and a street-food style finish.', 11.20, 9.90, 'images/Combo/Combo 2.jpg', 'Combo', 0, 1, 8, 'active'),
(@pizza_restaurant_id, @pizza_category_shawarma_id, 'Mixed Grill Shawarma Platter', 'mixed-grill-shawarma-platter', 'Smoky mix of grilled bites, wraps, and sides for sharing at the table.', 13.60, NULL, 'images/Combo/Combo 3.jpg', 'Party Pack', 0, 1, 9, 'active'),
(@pizza_restaurant_id, @pizza_category_drinks_id, 'Lime Spark Soda', 'lime-spark-soda', 'Bright citrus bubbles to cut through the richness of a big meal.', 2.90, NULL, 'images/Dinks/Drinks 1.jpg', 'Cold', 0, 1, 10, 'active'),
(@pizza_restaurant_id, @pizza_category_drinks_id, 'Strawberry Chill Juice', 'strawberry-chill-juice', 'Sweet, cool, and refreshing with a smooth finish on warm evenings.', 4.40, NULL, 'images/Dinks/Drinks 3.jpg', 'Fresh', 0, 1, 11, 'active'),
(@pizza_restaurant_id, @pizza_category_drinks_id, 'Oreo Dream Shake', 'oreo-dream-shake', 'Thick, creamy, and topped like a dessert worth slowing down for.', 5.20, 4.90, 'images/Dinks/Drinks 5.jpg', 'Sweet', 1, 1, 12, 'active');

SELECT id INTO @pizza_margherita_id
FROM menu_items
WHERE restaurant_id = @pizza_restaurant_id AND slug = 'margherita-blaze-pizza'
LIMIT 1;

SELECT id INTO @pizza_loaded_supreme_id
FROM menu_items
WHERE restaurant_id = @pizza_restaurant_id AND slug = 'loaded-supreme-pizza'
LIMIT 1;

SELECT id INTO @pizza_classic_burger_id
FROM menu_items
WHERE restaurant_id = @pizza_restaurant_id AND slug = 'classic-flame-burger'
LIMIT 1;

SELECT id INTO @pizza_double_cheese_id
FROM menu_items
WHERE restaurant_id = @pizza_restaurant_id AND slug = 'double-cheese-crunch'
LIMIT 1;

SELECT id INTO @pizza_chicken_shawarma_id
FROM menu_items
WHERE restaurant_id = @pizza_restaurant_id AND slug = 'chicken-shawarma-wrap'
LIMIT 1;

SELECT id INTO @pizza_royal_shawarma_id
FROM menu_items
WHERE restaurant_id = @pizza_restaurant_id AND slug = 'royal-shawarma-feast-box'
LIMIT 1;

SELECT id INTO @pizza_lime_soda_id
FROM menu_items
WHERE restaurant_id = @pizza_restaurant_id AND slug = 'lime-spark-soda'
LIMIT 1;

SELECT id INTO @pizza_strawberry_juice_id
FROM menu_items
WHERE restaurant_id = @pizza_restaurant_id AND slug = 'strawberry-chill-juice'
LIMIT 1;

INSERT INTO deals (
  restaurant_id,
  title,
  slug,
  description,
  regular_price,
  deal_price,
  image,
  badge_text,
  starts_at,
  ends_at,
  sort_order,
  status
) VALUES
(@pizza_restaurant_id, 'Family Pizza Combo', 'family-pizza-combo', 'A large pizza, extra dip, and a soft drink bundle for easy family dinners.', 34.00, 24.99, 'images/Pizza/pizza 5.jpg', 'Save 26%', NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 1, 'active'),
(@pizza_restaurant_id, 'Burger Meal Deal', 'burger-meal-deal', 'Two burgers, fries, and a cool drink packed into one easy lunch option.', 19.00, 14.50, 'images/Burger/Burger  4.jpg', 'Lunch Deal', NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 2, 'active'),
(@pizza_restaurant_id, 'Shawarma + Drinks Combo', 'shawarma-drinks-combo', 'A wrap-heavy combo with a cold drink to keep the meal balanced and lively.', 18.00, 12.99, 'images/Combo/Combo 1.jpg', 'Combo Save', NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 3, 'active');

SELECT id INTO @pizza_family_deal_id
FROM deals
WHERE restaurant_id = @pizza_restaurant_id AND slug = 'family-pizza-combo'
LIMIT 1;

SELECT id INTO @pizza_burger_deal_id
FROM deals
WHERE restaurant_id = @pizza_restaurant_id AND slug = 'burger-meal-deal'
LIMIT 1;

SELECT id INTO @pizza_shawarma_deal_id
FROM deals
WHERE restaurant_id = @pizza_restaurant_id AND slug = 'shawarma-drinks-combo'
LIMIT 1;

INSERT INTO deal_items (deal_id, menu_item_id, quantity) VALUES
(@pizza_family_deal_id, @pizza_margherita_id, 1),
(@pizza_family_deal_id, @pizza_loaded_supreme_id, 1),
(@pizza_family_deal_id, @pizza_lime_soda_id, 2),
(@pizza_burger_deal_id, @pizza_classic_burger_id, 1),
(@pizza_burger_deal_id, @pizza_double_cheese_id, 1),
(@pizza_burger_deal_id, @pizza_lime_soda_id, 2),
(@pizza_shawarma_deal_id, @pizza_chicken_shawarma_id, 2),
(@pizza_shawarma_deal_id, @pizza_royal_shawarma_id, 1),
(@pizza_shawarma_deal_id, @pizza_strawberry_juice_id, 1);

INSERT INTO gallery_images (
  restaurant_id,
  title,
  image,
  alt_text,
  sort_order,
  status
) VALUES
(@pizza_restaurant_id, 'Pizza House Hero', 'images/hero image.png', 'Floating pizza hero image for the homepage', 1, 'active'),
(@pizza_restaurant_id, 'Burger Corner', 'images/Burger/Burger 2.jpg', 'Close-up burger highlight', 2, 'active'),
(@pizza_restaurant_id, 'Combo Spotlight', 'images/Combo/Combo 2.jpg', 'Premium shawarma combo highlight', 3, 'active');

INSERT INTO restaurants (
  name,
  slug,
  business_type,
  owner_name,
  owner_email,
  owner_phone,
  owner_user_id,
  status,
  subscription_status,
  trial_ends_at
) VALUES (
  'Demo Coffee House',
  'demo-coffee-house',
  'coffee',
  'Demo Owner',
  'hello@coffeehouse.demo',
  '+880 1701 234 567',
  NULL,
  'active',
  'trial',
  DATE_ADD(NOW(), INTERVAL 30 DAY)
);

SELECT LAST_INSERT_ID() INTO @coffee_restaurant_id;

INSERT INTO restaurant_settings (
  restaurant_id,
  logo,
  favicon,
  site_title,
  hero_title,
  hero_subtitle,
  hero_button_text,
  hero_button_link,
  hero_image,
  about_title,
  about_text,
  about_image,
  phone,
  email,
  address,
  google_map_embed_url,
  opening_hours,
  facebook_url,
  instagram_url,
  youtube_url,
  whatsapp_number,
  theme_preset_id,
  primary_color,
  secondary_color,
  accent_color,
  background_color,
  text_color,
  button_color
) VALUES (
  @coffee_restaurant_id,
  NULL,
  NULL,
  'Demo Coffee House',
  'Fresh Coffee, Fresh Morning',
  'A cozy cafe vibe with espresso drinks, snacks, and sweet breaks all day.',
  'Order Now',
  '#contact',
  'images/Dinks/Drinks 4.jpg',
  'About Demo Coffee House',
  'A cozy cafe serving espresso-based drinks, sandwiches, and dessert breaks all day.',
  'images/Dinks/Drinks 4.jpg',
  '+880 1701 234 567',
  'hello@coffeehouse.demo',
  'Demo Coffee Road, Dhaka, Bangladesh',
  NULL,
  'Every day, 08:00 AM - 10:30 PM',
  NULL,
  NULL,
  NULL,
  '8801701234567',
  @coffee_theme_id,
  '#c18c5d',
  '#ffb347',
  '#ffffff',
  '#0b0b0b',
  '#ffffff',
  '#c18c5d'
);

INSERT INTO menu_categories (
  restaurant_id,
  name,
  slug,
  description,
  image,
  sort_order,
  status
) VALUES
(@coffee_restaurant_id, 'Coffee', 'coffee', 'Hot and iced espresso-based drinks.', 'images/Dinks/Drinks 4.jpg', 1, 'active'),
(@coffee_restaurant_id, 'Snacks', 'snacks', 'Fresh sandwiches and savory bites.', 'images/Burger/burger 1.jpg', 2, 'active'),
(@coffee_restaurant_id, 'Dessert', 'dessert', 'Sweet treats for the perfect cafe break.', 'images/Dinks/Drinks 2.jpg', 3, 'active'),
(@coffee_restaurant_id, 'Drinks', 'drinks', 'Cold drinks and shakes for a refreshing finish.', 'images/Dinks/Drinks 5.jpg', 4, 'active');

SELECT id INTO @coffee_category_coffee_id
FROM menu_categories
WHERE restaurant_id = @coffee_restaurant_id AND slug = 'coffee'
LIMIT 1;

SELECT id INTO @coffee_category_snacks_id
FROM menu_categories
WHERE restaurant_id = @coffee_restaurant_id AND slug = 'snacks'
LIMIT 1;

SELECT id INTO @coffee_category_dessert_id
FROM menu_categories
WHERE restaurant_id = @coffee_restaurant_id AND slug = 'dessert'
LIMIT 1;

SELECT id INTO @coffee_category_drinks_id
FROM menu_categories
WHERE restaurant_id = @coffee_restaurant_id AND slug = 'drinks'
LIMIT 1;

INSERT INTO menu_items (
  restaurant_id,
  category_id,
  name,
  slug,
  description,
  price,
  discount_price,
  image,
  badge_text,
  is_featured,
  is_available,
  sort_order,
  status
) VALUES
(@coffee_restaurant_id, @coffee_category_coffee_id, 'Signature Cappuccino', 'signature-cappuccino', 'Creamy cappuccino with a rich foam finish.', 4.90, NULL, 'images/Dinks/Drinks 4.jpg', 'Cafe Pick', 1, 1, 1, 'active'),
(@coffee_restaurant_id, @coffee_category_coffee_id, 'Iced Mocha', 'iced-mocha', 'Chilled mocha with a smooth chocolate-coffee balance.', 5.10, 4.60, 'images/Dinks/Drinks 5.jpg', 'Cold', 1, 1, 2, 'active'),
(@coffee_restaurant_id, @coffee_category_coffee_id, 'Caramel Latte', 'caramel-latte', 'Sweet caramel latte with a silky milk texture.', 5.40, NULL, 'images/Dinks/Drinks 3.jpg', 'Sweet', 0, 1, 3, 'active'),
(@coffee_restaurant_id, @coffee_category_snacks_id, 'Club Sandwich', 'club-sandwich', 'Fresh stacked sandwich served as the perfect cafe snack.', 7.20, NULL, 'images/Burger/burger 1.jpg', 'Snack', 1, 1, 4, 'active'),
(@coffee_restaurant_id, @coffee_category_snacks_id, 'Loaded Panini', 'loaded-panini', 'Toasted panini packed with cheese and grilled flavor.', 6.90, 6.20, 'images/Burger/Burger 2.jpg', 'Warm', 0, 1, 5, 'active'),
(@coffee_restaurant_id, @coffee_category_snacks_id, 'Crispy Fries Platter', 'crispy-fries-platter', 'Golden fries for sharing or pairing with drinks.', 4.20, NULL, 'images/Burger/Burger  3.jpg', 'Side', 0, 1, 6, 'active'),
(@coffee_restaurant_id, @coffee_category_dessert_id, 'Chocolate Fudge Shake', 'chocolate-fudge-shake', 'Dessert-style shake with a rich chocolate finish.', 5.80, NULL, 'images/Dinks/Drinks 1.jpg', 'Dessert', 1, 1, 7, 'active'),
(@coffee_restaurant_id, @coffee_category_dessert_id, 'Berry Sundae', 'berry-sundae', 'Creamy sundae topped with a bright berry layer.', 4.80, NULL, 'images/Dinks/Drinks 2.jpg', 'Sweet', 0, 1, 8, 'active'),
(@coffee_restaurant_id, @coffee_category_drinks_id, 'Oat Milk Cold Brew', 'oat-milk-cold-brew', 'Smooth cold brew with a light oat milk finish.', 5.20, NULL, 'images/Dinks/Drinks 5.jpg', 'Fresh Brew', 1, 1, 9, 'active');

SELECT id INTO @coffee_signature_cappuccino_id
FROM menu_items
WHERE restaurant_id = @coffee_restaurant_id AND slug = 'signature-cappuccino'
LIMIT 1;

SELECT id INTO @coffee_iced_mocha_id
FROM menu_items
WHERE restaurant_id = @coffee_restaurant_id AND slug = 'iced-mocha'
LIMIT 1;

SELECT id INTO @coffee_caramel_latte_id
FROM menu_items
WHERE restaurant_id = @coffee_restaurant_id AND slug = 'caramel-latte'
LIMIT 1;

SELECT id INTO @coffee_club_sandwich_id
FROM menu_items
WHERE restaurant_id = @coffee_restaurant_id AND slug = 'club-sandwich'
LIMIT 1;

SELECT id INTO @coffee_loaded_panini_id
FROM menu_items
WHERE restaurant_id = @coffee_restaurant_id AND slug = 'loaded-panini'
LIMIT 1;

SELECT id INTO @coffee_crispy_fries_id
FROM menu_items
WHERE restaurant_id = @coffee_restaurant_id AND slug = 'crispy-fries-platter'
LIMIT 1;

SELECT id INTO @coffee_chocolate_shake_id
FROM menu_items
WHERE restaurant_id = @coffee_restaurant_id AND slug = 'chocolate-fudge-shake'
LIMIT 1;

SELECT id INTO @coffee_berry_sundae_id
FROM menu_items
WHERE restaurant_id = @coffee_restaurant_id AND slug = 'berry-sundae'
LIMIT 1;

SELECT id INTO @coffee_cold_brew_id
FROM menu_items
WHERE restaurant_id = @coffee_restaurant_id AND slug = 'oat-milk-cold-brew'
LIMIT 1;

INSERT INTO deals (
  restaurant_id,
  title,
  slug,
  description,
  regular_price,
  deal_price,
  image,
  badge_text,
  starts_at,
  ends_at,
  sort_order,
  status
) VALUES
(@coffee_restaurant_id, 'Morning Brew Duo', 'morning-brew-duo', 'Two coffee picks for a productive start to the day.', 18.00, 12.50, 'images/Dinks/Drinks 4.jpg', 'Morning Special', NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 1, 'active'),
(@coffee_restaurant_id, 'Dessert Break Combo', 'dessert-break-combo', 'Coffee and sweets for a calm afternoon break.', 14.00, 9.90, 'images/Dinks/Drinks 5.jpg', 'Sweet Deal', NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 2, 'active'),
(@coffee_restaurant_id, 'Cafe Feast Box', 'cafe-feast-box', 'A bigger cafe box with sandwiches, dessert, and a drink.', 22.00, 15.99, 'images/Dinks/Drinks 2.jpg', 'Big Save', NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 3, 'active');

SELECT id INTO @coffee_morning_deal_id
FROM deals
WHERE restaurant_id = @coffee_restaurant_id AND slug = 'morning-brew-duo'
LIMIT 1;

SELECT id INTO @coffee_dessert_deal_id
FROM deals
WHERE restaurant_id = @coffee_restaurant_id AND slug = 'dessert-break-combo'
LIMIT 1;

SELECT id INTO @coffee_cafe_feast_deal_id
FROM deals
WHERE restaurant_id = @coffee_restaurant_id AND slug = 'cafe-feast-box'
LIMIT 1;

INSERT INTO deal_items (deal_id, menu_item_id, quantity) VALUES
(@coffee_morning_deal_id, @coffee_signature_cappuccino_id, 2),
(@coffee_morning_deal_id, @coffee_cold_brew_id, 1),
(@coffee_dessert_deal_id, @coffee_iced_mocha_id, 1),
(@coffee_dessert_deal_id, @coffee_berry_sundae_id, 1),
(@coffee_dessert_deal_id, @coffee_chocolate_shake_id, 1),
(@coffee_cafe_feast_deal_id, @coffee_club_sandwich_id, 1),
(@coffee_cafe_feast_deal_id, @coffee_loaded_panini_id, 1),
(@coffee_cafe_feast_deal_id, @coffee_berry_sundae_id, 1),
(@coffee_cafe_feast_deal_id, @coffee_signature_cappuccino_id, 1);

INSERT INTO gallery_images (
  restaurant_id,
  title,
  image,
  alt_text,
  sort_order,
  status
) VALUES
(@coffee_restaurant_id, 'Cafe Hero', 'images/Dinks/Drinks 4.jpg', 'Coffee hero image', 1, 'active'),
(@coffee_restaurant_id, 'Sweet Break', 'images/Dinks/Drinks 2.jpg', 'Dessert and drink styling', 2, 'active'),
(@coffee_restaurant_id, 'Snack Pairing', 'images/Burger/burger 1.jpg', 'Sandwich pairing highlight', 3, 'active');

INSERT INTO restaurants (
  name,
  slug,
  business_type,
  owner_name,
  owner_email,
  owner_phone,
  owner_user_id,
  status,
  subscription_status,
  trial_ends_at
) VALUES (
  'Demo Biryani House',
  'demo-biryani-house',
  'biryani',
  'Demo Owner',
  'hello@biryanihouse.demo',
  '+880 1702 345 678',
  NULL,
  'active',
  'trial',
  DATE_ADD(NOW(), INTERVAL 30 DAY)
);

SELECT LAST_INSERT_ID() INTO @biryani_restaurant_id;

INSERT INTO restaurant_settings (
  restaurant_id,
  logo,
  favicon,
  site_title,
  hero_title,
  hero_subtitle,
  hero_button_text,
  hero_button_link,
  hero_image,
  about_title,
  about_text,
  about_image,
  phone,
  email,
  address,
  google_map_embed_url,
  opening_hours,
  facebook_url,
  instagram_url,
  youtube_url,
  whatsapp_number,
  theme_preset_id,
  primary_color,
  secondary_color,
  accent_color,
  background_color,
  text_color,
  button_color
) VALUES (
  @biryani_restaurant_id,
  NULL,
  NULL,
  'Demo Biryani House',
  'Authentic Biryani Taste',
  'Slow-cooked rice, spicy grills, and bold desi flavor in a dark premium look.',
  'Order Now',
  '#contact',
  'images/Combo/Combo 2.jpg',
  'About Demo Biryani House',
  'Slow-cooked biryani, smoky kebabs, and chilled drinks prepared with bold desi flavor.',
  'images/Combo/Combo 2.jpg',
  '+880 1702 345 678',
  'hello@biryanihouse.demo',
  'Demo Biryani Lane, Dhaka, Bangladesh',
  NULL,
  'Every day, 11:00 AM - 12:00 AM',
  NULL,
  NULL,
  NULL,
  '8801702345678',
  @biryani_theme_id,
  '#ef2b24',
  '#ff9f1c',
  '#ffffff',
  '#050505',
  '#ffffff',
  '#ef2b24'
);

INSERT INTO menu_categories (
  restaurant_id,
  name,
  slug,
  description,
  image,
  sort_order,
  status
) VALUES
(@biryani_restaurant_id, 'Biryani', 'biryani', 'Royal biryani plates and family servings.', 'images/Combo/Combo 2.jpg', 1, 'active'),
(@biryani_restaurant_id, 'Kebab', 'kebab', 'Grilled kebabs and smoky platters.', 'images/Burger/Burger 2.jpg', 2, 'active'),
(@biryani_restaurant_id, 'Drinks', 'drinks', 'Cooling drinks to balance every spice note.', 'images/Dinks/Drinks 1.jpg', 3, 'active');

SELECT id INTO @biryani_category_biryani_id
FROM menu_categories
WHERE restaurant_id = @biryani_restaurant_id AND slug = 'biryani'
LIMIT 1;

SELECT id INTO @biryani_category_kebab_id
FROM menu_categories
WHERE restaurant_id = @biryani_restaurant_id AND slug = 'kebab'
LIMIT 1;

SELECT id INTO @biryani_category_drinks_id
FROM menu_categories
WHERE restaurant_id = @biryani_restaurant_id AND slug = 'drinks'
LIMIT 1;

INSERT INTO menu_items (
  restaurant_id,
  category_id,
  name,
  slug,
  description,
  price,
  discount_price,
  image,
  badge_text,
  is_featured,
  is_available,
  sort_order,
  status
) VALUES
(@biryani_restaurant_id, @biryani_category_biryani_id, 'Kacchi Royal Biryani', 'kacchi-royal-biryani', 'Royal-style kacchi biryani with rich aroma and tender meat.', 13.90, 12.90, 'images/Combo/Combo 2.jpg', 'Royal', 1, 1, 1, 'active'),
(@biryani_restaurant_id, @biryani_category_biryani_id, 'Beef Tehari Plate', 'beef-tehari-plate', 'Slow-cooked beef tehari served in a hearty plate portion.', 12.40, NULL, 'images/Combo/Combo 3.jpg', 'Popular', 0, 1, 2, 'active'),
(@biryani_restaurant_id, @biryani_category_biryani_id, 'Chicken Dum Biryani', 'chicken-dum-biryani', 'Classic dum biryani with spice layers sealed into every grain.', 11.90, 10.90, 'images/Combo/Combo 1.jpg', 'Best Seller', 1, 1, 3, 'active'),
(@biryani_restaurant_id, @biryani_category_kebab_id, 'Seekh Kebab Roll', 'seekh-kebab-roll', 'Soft roll filled with smoky seekh kebab and tangy sauce.', 6.50, NULL, 'images/Burger/burger 1.jpg', 'Grill', 0, 1, 4, 'active'),
(@biryani_restaurant_id, @biryani_category_kebab_id, 'Chicken Roast Box', 'chicken-roast-box', 'Roast chicken box with bold spices and generous portions.', 9.80, NULL, 'images/Burger/Burger 2.jpg', 'Hot', 1, 1, 5, 'active'),
(@biryani_restaurant_id, @biryani_category_kebab_id, 'Smoky Kebab Platter', 'smoky-kebab-platter', 'Smoky kebab platter made for sharing and dipping.', 11.40, 10.20, 'images/Burger/Burger  3.jpg', 'Share', 0, 1, 6, 'active'),
(@biryani_restaurant_id, @biryani_category_drinks_id, 'Borhani', 'borhani', 'Traditional yogurt-based drink with a cooling finish.', 2.60, NULL, 'images/Dinks/Drinks 1.jpg', 'Cool', 0, 1, 7, 'active'),
(@biryani_restaurant_id, @biryani_category_drinks_id, 'Lemon Mint Mojito', 'lemon-mint-mojito', 'Bright, chilled lemon mint drink for a refreshing sip.', 3.40, NULL, 'images/Dinks/Drinks 2.jpg', 'Fresh', 0, 1, 8, 'active'),
(@biryani_restaurant_id, @biryani_category_drinks_id, 'Falooda', 'falooda', 'Creamy falooda dessert drink with a sweet finish.', 4.90, 4.50, 'images/Dinks/Drinks 5.jpg', 'Sweet', 1, 1, 9, 'active');

SELECT id INTO @biryani_kacchi_id
FROM menu_items
WHERE restaurant_id = @biryani_restaurant_id AND slug = 'kacchi-royal-biryani'
LIMIT 1;

SELECT id INTO @biryani_tehari_id
FROM menu_items
WHERE restaurant_id = @biryani_restaurant_id AND slug = 'beef-tehari-plate'
LIMIT 1;

SELECT id INTO @biryani_chicken_dum_id
FROM menu_items
WHERE restaurant_id = @biryani_restaurant_id AND slug = 'chicken-dum-biryani'
LIMIT 1;

SELECT id INTO @biryani_seekh_roll_id
FROM menu_items
WHERE restaurant_id = @biryani_restaurant_id AND slug = 'seekh-kebab-roll'
LIMIT 1;

SELECT id INTO @biryani_chicken_roast_id
FROM menu_items
WHERE restaurant_id = @biryani_restaurant_id AND slug = 'chicken-roast-box'
LIMIT 1;

SELECT id INTO @biryani_smoky_kebab_id
FROM menu_items
WHERE restaurant_id = @biryani_restaurant_id AND slug = 'smoky-kebab-platter'
LIMIT 1;

SELECT id INTO @biryani_borhani_id
FROM menu_items
WHERE restaurant_id = @biryani_restaurant_id AND slug = 'borhani'
LIMIT 1;

SELECT id INTO @biryani_mojito_id
FROM menu_items
WHERE restaurant_id = @biryani_restaurant_id AND slug = 'lemon-mint-mojito'
LIMIT 1;

SELECT id INTO @biryani_falooda_id
FROM menu_items
WHERE restaurant_id = @biryani_restaurant_id AND slug = 'falooda'
LIMIT 1;

INSERT INTO deals (
  restaurant_id,
  title,
  slug,
  description,
  regular_price,
  deal_price,
  image,
  badge_text,
  starts_at,
  ends_at,
  sort_order,
  status
) VALUES
(@biryani_restaurant_id, 'Family Biryani Feast', 'family-biryani-feast', 'A family-size biryani spread built for sharing.', 36.00, 27.99, 'images/Combo/Combo 3.jpg', 'Family Pack', NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 1, 'active'),
(@biryani_restaurant_id, 'Kebab Plate Deal', 'kebab-plate-deal', 'Grilled kebabs and a drink bundled as a quick feast.', 20.00, 14.99, 'images/Burger/Burger  4.jpg', 'Grill Deal', NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 2, 'active'),
(@biryani_restaurant_id, 'Biryani + Drink Special', 'biryani-drink-special', 'A spicy main with a cooling drink for the perfect balance.', 24.00, 16.99, 'images/Combo/Combo 2.jpg', 'Save More', NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 3, 'active');

SELECT id INTO @biryani_family_deal_id
FROM deals
WHERE restaurant_id = @biryani_restaurant_id AND slug = 'family-biryani-feast'
LIMIT 1;

SELECT id INTO @biryani_kebab_deal_id
FROM deals
WHERE restaurant_id = @biryani_restaurant_id AND slug = 'kebab-plate-deal'
LIMIT 1;

SELECT id INTO @biryani_drink_deal_id
FROM deals
WHERE restaurant_id = @biryani_restaurant_id AND slug = 'biryani-drink-special'
LIMIT 1;

INSERT INTO deal_items (deal_id, menu_item_id, quantity) VALUES
(@biryani_family_deal_id, @biryani_kacchi_id, 1),
(@biryani_family_deal_id, @biryani_tehari_id, 1),
(@biryani_family_deal_id, @biryani_borhani_id, 2),
(@biryani_kebab_deal_id, @biryani_smoky_kebab_id, 1),
(@biryani_kebab_deal_id, @biryani_seekh_roll_id, 2),
(@biryani_kebab_deal_id, @biryani_mojito_id, 1),
(@biryani_drink_deal_id, @biryani_chicken_dum_id, 1),
(@biryani_drink_deal_id, @biryani_borhani_id, 1),
(@biryani_drink_deal_id, @biryani_falooda_id, 1);

INSERT INTO gallery_images (
  restaurant_id,
  title,
  image,
  alt_text,
  sort_order,
  status
) VALUES
(@biryani_restaurant_id, 'Biryani Hero', 'images/Combo/Combo 2.jpg', 'Premium biryani hero image', 1, 'active'),
(@biryani_restaurant_id, 'Kebab Plate', 'images/Burger/Burger 2.jpg', 'Smoky kebab plate highlight', 2, 'active'),
(@biryani_restaurant_id, 'Drink Finish', 'images/Dinks/Drinks 1.jpg', 'Cooling drink highlight', 3, 'active');
