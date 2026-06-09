<?php
declare(strict_types=1);

require_once __DIR__ . '/_helpers.php';

function site_data_restaurant_row(PDO $pdo, int $restaurantId): ?array
{
    $statement = $pdo->prepare(
        'SELECT id, name, slug, business_type
         FROM restaurants
         WHERE id = :id
           AND status = "active"
         LIMIT 1'
    );
    $statement->execute(['id' => $restaurantId]);

    $row = $statement->fetch();

    return $row ?: null;
}

function site_data_public_settings(?array $settings): ?array
{
    if ($settings === null) {
        return null;
    }

    return [
        'logo' => $settings['logo'],
        'favicon' => $settings['favicon'],
        'site_title' => $settings['site_title'],
        'hero_title' => $settings['hero_title'],
        'hero_subtitle' => $settings['hero_subtitle'],
        'hero_button_text' => $settings['hero_button_text'],
        'hero_button_link' => $settings['hero_button_link'],
        'hero_image' => $settings['hero_image'],
        'about_title' => $settings['about_title'],
        'about_text' => $settings['about_text'],
        'about_image' => $settings['about_image'],
        'phone' => $settings['phone'],
        'email' => $settings['email'],
        'address' => $settings['address'],
        'google_map_embed_url' => $settings['google_map_embed_url'],
        'opening_hours' => $settings['opening_hours'],
        'facebook_url' => $settings['facebook_url'],
        'instagram_url' => $settings['instagram_url'],
        'youtube_url' => $settings['youtube_url'],
        'whatsapp_number' => $settings['whatsapp_number'],
    ];
}

function site_data_theme(?array $settings): array
{
    return [
        'primary_color' => $settings['primary_color'] ?? '#ef2b24',
        'secondary_color' => $settings['secondary_color'] ?? '#0b0b0b',
        'accent_color' => $settings['accent_color'] ?? '#ff9f1c',
        'background_color' => $settings['background_color'] ?? '#050505',
        'text_color' => $settings['text_color'] ?? '#ffffff',
        'button_color' => $settings['button_color'] ?? ($settings['primary_color'] ?? '#ef2b24'),
    ];
}

function site_data_settings_row(PDO $pdo, int $restaurantId): ?array
{
    $statement = $pdo->prepare(
        'SELECT
            id,
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
            button_color,
            created_at,
            updated_at
         FROM restaurant_settings
         WHERE restaurant_id = :restaurant_id
         LIMIT 1'
    );
    $statement->execute(['restaurant_id' => $restaurantId]);

    $row = $statement->fetch();

    return $row ?: null;
}

function site_data_public_categories(array $categories): array
{
    return array_map(static function (array $category): array {
        return [
            'name' => $category['name'] ?? '',
            'slug' => $category['slug'] ?? '',
            'description' => $category['description'] ?? null,
            'image' => $category['image'] ?? null,
            'status' => $category['status'] ?? 'active',
        ];
    }, $categories);
}

function site_data_public_menu_items(array $menuItems): array
{
    return array_map(static function (array $item): array {
        return [
            'name' => $item['name'] ?? '',
            'description' => $item['description'] ?? '',
            'price' => $item['price'] ?? 0,
            'discount_price' => $item['discount_price'] ?? null,
            'image' => $item['image'] ?? '',
            'badge_text' => $item['badge_text'] ?? null,
            'is_featured' => $item['is_featured'] ?? 0,
            'is_available' => $item['is_available'] ?? 1,
            'status' => $item['status'] ?? 'active',
            'category_name' => $item['category_name'] ?? null,
            'category_slug' => $item['category_slug'] ?? null,
        ];
    }, $menuItems);
}

function site_data_public_deals(array $deals): array
{
    return array_map(static function (array $deal): array {
        return [
            'title' => $deal['title'] ?? '',
            'description' => $deal['description'] ?? '',
            'regular_price' => $deal['regular_price'] ?? 0,
            'deal_price' => $deal['deal_price'] ?? 0,
            'image' => $deal['image'] ?? '',
            'badge_text' => $deal['badge_text'] ?? null,
            'status' => $deal['status'] ?? 'active',
        ];
    }, $deals);
}

function site_data_public_gallery(array $gallery): array
{
    return array_map(static function (array $image): array {
        return [
            'title' => $image['title'] ?? '',
            'caption' => $image['caption'] ?? null,
            'image' => $image['image'] ?? '',
            'alt_text' => $image['alt_text'] ?? null,
            'status' => $image['status'] ?? 'active',
        ];
    }, $gallery);
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method !== 'GET') {
    json_response([
        'success' => false,
        'message' => 'Method not allowed.',
    ], 405);
}

$pdo = require_connection();
$restaurant = restaurant_context();
$restaurantId = (int) $restaurant['restaurant_id'];

$restaurantData = site_data_restaurant_row($pdo, $restaurantId);
$settingsData = site_data_settings_row($pdo, $restaurantId);
$publicSettings = site_data_public_settings($settingsData);
$themeData = site_data_theme($settingsData);

$categoriesStatement = $pdo->prepare(
    'SELECT id, restaurant_id, name, slug, description, image, sort_order, status, created_at, updated_at
     FROM menu_categories
     WHERE restaurant_id = :restaurant_id
       AND status = "active"
     ORDER BY sort_order ASC, name ASC, created_at DESC'
);
$categoriesStatement->execute(['restaurant_id' => $restaurantId]);

$menuItemsStatement = $pdo->prepare(
    'SELECT
        mi.id,
        mi.restaurant_id,
        mi.category_id,
        mi.name,
        mi.slug,
        mi.description,
        mi.price,
        mi.discount_price,
        mi.image,
        mi.badge_text,
        mi.is_featured,
        mi.is_available,
        mi.sort_order,
        mi.status,
        mi.created_at,
        mi.updated_at,
        mc.name AS category_name,
        mc.slug AS category_slug
     FROM menu_items mi
     LEFT JOIN menu_categories mc
        ON mc.id = mi.category_id
       AND mc.restaurant_id = mi.restaurant_id
     WHERE mi.restaurant_id = :restaurant_id
       AND mi.status = "active"
       AND mi.is_available = 1
       AND (mi.category_id IS NULL OR mc.status = "active")
     ORDER BY mi.sort_order ASC, mi.name ASC, mi.created_at DESC'
);
$menuItemsStatement->execute(['restaurant_id' => $restaurantId]);
$menuItems = $menuItemsStatement->fetchAll();

$dealsStatement = $pdo->prepare(
    'SELECT id, restaurant_id, title, slug, description, regular_price, deal_price, image, badge_text, starts_at, ends_at, sort_order, status, created_at, updated_at
     FROM deals
     WHERE restaurant_id = :restaurant_id
       AND status = "active"
     ORDER BY sort_order ASC, title ASC, created_at DESC'
);
$dealsStatement->execute(['restaurant_id' => $restaurantId]);
$deals = $dealsStatement->fetchAll();

$galleryStatement = $pdo->prepare(
    'SELECT id, restaurant_id, title, caption, image, alt_text, sort_order, status, created_at, updated_at
     FROM gallery_images
     WHERE restaurant_id = :restaurant_id
       AND status = "active"
     ORDER BY sort_order ASC, created_at DESC'
);
$galleryStatement->execute(['restaurant_id' => $restaurantId]);

json_response([
    'success' => true,
    'message' => 'Site data loaded successfully.',
    'data' => [
        'restaurant' => $restaurantData,
        'settings' => $publicSettings,
        'theme' => $themeData,
        'categories' => site_data_public_categories($categoriesStatement->fetchAll()),
        'menu_items' => site_data_public_menu_items($menuItems),
        'deals' => site_data_public_deals($deals),
        'gallery' => site_data_public_gallery($galleryStatement->fetchAll()),
    ],
]);
