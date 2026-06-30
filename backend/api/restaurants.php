<?php
declare(strict_types=1);

require_once __DIR__ . '/_helpers.php';

function restaurant_management_slug_is_reserved(string $slug): bool
{
    return tenant_canonical_slug($slug) !== $slug;
}

function restaurant_management_find_restaurant(PDO $pdo, int|string $identifier): ?array
{
    if (is_int($identifier) || (is_string($identifier) && preg_match('/^[1-9]\d*$/', $identifier))) {
        $statement = $pdo->prepare(
            'SELECT
                id,
                name,
                slug,
                business_type,
                owner_name,
                owner_email,
                owner_user_id,
                status,
                created_at,
                updated_at
             FROM restaurants
             WHERE id = :id
             LIMIT 1'
        );
        $statement->execute(['id' => (int) $identifier]);

        $row = $statement->fetch();
        return $row ?: null;
    }

    $slug = strtolower(trim((string) $identifier));
    if ($slug === '' || !tenant_slug_is_valid($slug)) {
        return null;
    }

    $statement = $pdo->prepare(
        'SELECT
            id,
            name,
            slug,
            business_type,
            owner_name,
            owner_email,
            owner_user_id,
            status,
            created_at,
            updated_at
         FROM restaurants
         WHERE slug = :slug
         LIMIT 1'
    );
    $statement->execute(['slug' => $slug]);

    $row = $statement->fetch();
    return $row ?: null;
}

function restaurant_management_slug_exists(PDO $pdo, string $slug, ?int $ignoreId = null): bool
{
    $sql = 'SELECT id FROM restaurants WHERE slug = :slug';
    $params = ['slug' => $slug];

    if ($ignoreId !== null) {
        $sql .= ' AND id <> :ignore_id';
        $params['ignore_id'] = $ignoreId;
    }

    $sql .= ' LIMIT 1';
    $statement = $pdo->prepare($sql);
    $statement->execute($params);

    return (bool) $statement->fetchColumn();
}

function restaurant_management_default_settings_payload(array $restaurant): array
{
    $restaurantName = trim((string) ($restaurant['name'] ?? ''));
    $restaurantSlug = trim((string) ($restaurant['slug'] ?? ''));
    $title = $restaurantName !== '' ? $restaurantName : 'New Restaurant';
    $slugLabel = $restaurantSlug !== '' ? $restaurantSlug : 'new-restaurant';
    $genericContact = 'hello@' . $slugLabel . '.demo';

    return [
        'logo' => null,
        'favicon' => null,
        'site_title' => $title,
        'hero_title' => 'Welcome to ' . $title,
        'hero_subtitle' => 'Your restaurant is ready for onboarding and menu setup.',
        'hero_button_text' => 'Order Now',
        'hero_button_link' => '#contact',
        'hero_image' => 'images/hero image.png',
        'about_title' => 'About ' . $title,
        'about_text' => 'This restaurant was created from the owner management foundation and is ready to be customized.',
        'about_image' => 'images/Pizza/pizza 1.png',
        'phone' => '+880 0000 000 000',
        'email' => $genericContact,
        'address' => $title . ' address pending setup',
        'google_map_embed_url' => null,
        'opening_hours' => 'Open daily, 10:00 AM - 10:00 PM',
        'facebook_url' => null,
        'instagram_url' => null,
        'youtube_url' => null,
        'whatsapp_number' => null,
        'theme_preset_id' => null,
        'primary_color' => '#ef2b24',
        'secondary_color' => '#ff9f1c',
        'accent_color' => '#ffffff',
        'background_color' => '#050505',
        'text_color' => '#ffffff',
        'button_color' => '#ef2b24',
    ];
}

function restaurant_management_seed_default_settings(PDO $pdo, array $restaurant): void
{
    $payload = restaurant_management_default_settings_payload($restaurant);

    $statement = $pdo->prepare(
        'INSERT IGNORE INTO restaurant_settings
            (
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
            )
         VALUES
            (
                :restaurant_id,
                :logo,
                :favicon,
                :site_title,
                :hero_title,
                :hero_subtitle,
                :hero_button_text,
                :hero_button_link,
                :hero_image,
                :about_title,
                :about_text,
                :about_image,
                :phone,
                :email,
                :address,
                :google_map_embed_url,
                :opening_hours,
                :facebook_url,
                :instagram_url,
                :youtube_url,
                :whatsapp_number,
                :theme_preset_id,
                :primary_color,
                :secondary_color,
                :accent_color,
                :background_color,
                :text_color,
                :button_color
            )'
    );
    $statement->execute([
        'restaurant_id' => (int) $restaurant['id'],
        ...$payload,
    ]);
}

function restaurant_management_create_row(PDO $pdo, array $payload): array
{
    $statement = $pdo->prepare(
        'INSERT INTO restaurants
            (
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
            )
         VALUES
            (
                :name,
                :slug,
                :business_type,
                NULL,
                NULL,
                NULL,
                NULL,
                :status,
                "trial",
                DATE_ADD(NOW(), INTERVAL 30 DAY)
            )'
    );
    $statement->execute([
        'name' => $payload['name'],
        'slug' => $payload['slug'],
        'business_type' => $payload['business_type'],
        'status' => $payload['status'],
    ]);

    $restaurant = restaurant_management_find_restaurant($pdo, (int) $pdo->lastInsertId());
    if ($restaurant === null) {
        json_response([
            'success' => false,
            'message' => 'Restaurant could not be loaded after creation.',
        ], 500);
    }

    restaurant_management_seed_default_settings($pdo, $restaurant);

    return $restaurant;
}

$method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
$pdo = require_connection();

if ($method === 'GET') {
    $user = auth_require_login($pdo);
    $restaurants = auth_user_restaurants($pdo, $user);

    json_response([
        'success' => true,
        'data' => $restaurants,
    ]);
}

if ($method === 'POST') {
    auth_require_super_admin($pdo);
    $payload = request_payload();

    $name = trim((string) ($payload['name'] ?? ''));
    $slug = strtolower(trim((string) ($payload['slug'] ?? '')));
    $businessType = trim((string) ($payload['business_type'] ?? 'restaurant'));
    $status = strtolower(trim((string) ($payload['status'] ?? 'active')));
    $errors = [];

    if ($name === '' || strlen($name) > 150) {
        $errors['name'] = 'Restaurant name is required and must be 150 characters or fewer.';
    }

    if ($slug === '' || strlen($slug) > 191) {
        $errors['slug'] = 'Restaurant slug is required and must be 191 characters or fewer.';
    } elseif (!tenant_slug_is_valid($slug)) {
        $errors['slug'] = 'Restaurant slug may only contain lowercase letters, numbers, and hyphens.';
    } elseif (restaurant_management_slug_is_reserved($slug)) {
        $errors['slug'] = 'This slug is reserved for legacy compatibility.';
    } elseif (restaurant_management_slug_exists($pdo, $slug)) {
        $errors['slug'] = 'Restaurant slug already exists.';
    }

    if ($businessType === '' || strlen($businessType) > 100) {
        $errors['business_type'] = 'Business type must be 100 characters or fewer.';
    }

    if (!in_array($status, ['active', 'inactive', 'suspended'], true)) {
        $errors['status'] = 'Invalid restaurant status.';
    }

    if (!empty($errors)) {
        json_response([
            'success' => false,
            'message' => 'Validation error.',
            'errors' => $errors,
        ], 422);
    }

    $restaurant = restaurant_management_create_row($pdo, [
        'name' => $name,
        'slug' => $slug,
        'business_type' => $businessType,
        'status' => $status,
    ]);

    json_response([
        'success' => true,
        'message' => 'Restaurant created successfully.',
        'data' => $restaurant,
    ], 201);
}

if (in_array($method, ['PUT', 'PATCH', 'DELETE'], true)) {
    auth_require_super_admin($pdo);
    $payload = request_payload();
    $id = strict_positive_int($payload['id'] ?? $_GET['id'] ?? null);
    $slugLookup = null;

    if ($id === null) {
        $slugLookup = strtolower(trim((string) ($payload['slug'] ?? $_GET['slug'] ?? $_GET['restaurant'] ?? $payload['restaurant'] ?? '')));
        if ($slugLookup !== '' && !tenant_slug_is_valid($slugLookup)) {
            json_response([
                'success' => false,
                'message' => 'Invalid restaurant slug.',
            ], 422);
        }
    }

    $restaurant = $id !== null
        ? restaurant_management_find_restaurant($pdo, $id)
        : ($slugLookup !== null && $slugLookup !== '' ? restaurant_management_find_restaurant($pdo, $slugLookup) : null);

    if ($restaurant === null) {
        json_response([
            'success' => false,
            'message' => 'Restaurant not found.',
        ], 404);
    }

    $currentId = (int) $restaurant['id'];
    $nextName = array_key_exists('name', $payload) ? trim((string) $payload['name']) : (string) $restaurant['name'];
    $nextSlug = array_key_exists('slug', $payload) ? strtolower(trim((string) $payload['slug'])) : (string) $restaurant['slug'];
    $nextBusinessType = array_key_exists('business_type', $payload) ? trim((string) $payload['business_type']) : (string) $restaurant['business_type'];
    $nextStatus = array_key_exists('status', $payload) ? strtolower(trim((string) $payload['status'])) : (string) $restaurant['status'];
    $errors = [];

    if ($nextName === '' || strlen($nextName) > 150) {
        $errors['name'] = 'Restaurant name is required and must be 150 characters or fewer.';
    }

    if ($nextSlug === '' || strlen($nextSlug) > 191) {
        $errors['slug'] = 'Restaurant slug is required and must be 191 characters or fewer.';
    } elseif (!tenant_slug_is_valid($nextSlug)) {
        $errors['slug'] = 'Restaurant slug may only contain lowercase letters, numbers, and hyphens.';
    } elseif (restaurant_management_slug_is_reserved($nextSlug)) {
        $errors['slug'] = 'This slug is reserved for legacy compatibility.';
    } elseif (restaurant_management_slug_exists($pdo, $nextSlug, $currentId)) {
        $errors['slug'] = 'Restaurant slug already exists.';
    }

    if ($nextBusinessType === '' || strlen($nextBusinessType) > 100) {
        $errors['business_type'] = 'Business type must be 100 characters or fewer.';
    }

    if (!in_array($nextStatus, ['active', 'inactive', 'suspended'], true)) {
        $errors['status'] = 'Invalid restaurant status.';
    }

    if (!empty($errors)) {
        json_response([
            'success' => false,
            'message' => 'Validation error.',
            'errors' => $errors,
        ], 422);
    }

    $statement = $pdo->prepare(
        'UPDATE restaurants
         SET name = :name,
             slug = :slug,
             business_type = :business_type,
             status = :status
         WHERE id = :id'
    );
    $statement->execute([
        'id' => $currentId,
        'name' => $nextName,
        'slug' => $nextSlug,
        'business_type' => $nextBusinessType,
        'status' => $nextStatus,
    ]);

    if ($nextStatus !== 'active' && auth_active_restaurant_id() === $currentId) {
        auth_store_active_restaurant_id(null);
    }

    $updatedRestaurant = restaurant_management_find_restaurant($pdo, $currentId);

    json_response([
        'success' => true,
        'message' => $method === 'DELETE'
            ? 'Restaurant archived successfully.'
            : 'Restaurant updated successfully.',
        'data' => $updatedRestaurant,
    ]);
}

json_response([
    'success' => false,
    'message' => 'Method not allowed.',
], 405);
