<?php
declare(strict_types=1);

require_once __DIR__ . '/_helpers.php';

function settings_length(string $value): int
{
    return function_exists('mb_strlen') ? mb_strlen($value) : strlen($value);
}

function settings_row(PDO $pdo, int $restaurantId): ?array
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

function settings_public_payload(array $settings): array
{
    return [
        'logo' => $settings['logo'] ?? null,
        'favicon' => $settings['favicon'] ?? null,
        'site_title' => $settings['site_title'] ?? '',
        'hero_title' => $settings['hero_title'] ?? '',
        'hero_subtitle' => $settings['hero_subtitle'] ?? '',
        'hero_button_text' => $settings['hero_button_text'] ?? '',
        'hero_button_link' => $settings['hero_button_link'] ?? '',
        'hero_image' => $settings['hero_image'] ?? '',
        'about_title' => $settings['about_title'] ?? '',
        'about_text' => $settings['about_text'] ?? '',
        'about_image' => $settings['about_image'] ?? '',
        'phone' => $settings['phone'] ?? '',
        'email' => $settings['email'] ?? '',
        'address' => $settings['address'] ?? '',
        'google_map_embed_url' => $settings['google_map_embed_url'] ?? null,
        'opening_hours' => $settings['opening_hours'] ?? '',
        'facebook_url' => $settings['facebook_url'] ?? null,
        'instagram_url' => $settings['instagram_url'] ?? null,
        'youtube_url' => $settings['youtube_url'] ?? null,
        'whatsapp_number' => $settings['whatsapp_number'] ?? null,
        'primary_color' => $settings['primary_color'] ?? '#ef2b24',
        'secondary_color' => $settings['secondary_color'] ?? '#ff9f1c',
        'accent_color' => $settings['accent_color'] ?? '#ffffff',
        'background_color' => $settings['background_color'] ?? '#050505',
        'text_color' => $settings['text_color'] ?? '#ffffff',
        'button_color' => $settings['button_color'] ?? '#ef2b24',
    ];
}

function settings_default_response(array $restaurant): array
{
    $restaurantName = (string) ($restaurant['name'] ?? 'Restaurant');

    return [
        'logo' => null,
        'favicon' => null,
        'site_title' => $restaurantName,
        'hero_title' => 'Best Food in Your Town',
        'hero_subtitle' => 'Freshly prepared dishes, premium service, and a warm local experience.',
        'hero_button_text' => 'Order Now',
        'hero_button_link' => '#contact',
        'hero_image' => 'images/hero image.png',
        'about_title' => 'About ' . $restaurantName,
        'about_text' => 'Fresh ingredients, careful preparation, and fast delivery for your daily cravings.',
        'about_image' => 'images/hero image.png',
        'phone' => '+000 000 000 000',
        'email' => 'support@example.com',
        'address' => 'Address not configured',
        'google_map_embed_url' => null,
        'opening_hours' => 'Opening hours not configured',
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

function settings_input_value(array $payload, array $existing, string $key, mixed $default = '', bool $nullable = false): mixed
{
    if (array_key_exists($key, $payload)) {
        $value = trim((string) $payload[$key]);
        if ($nullable) {
            return $value === '' ? null : $value;
        }

        return $value !== '' ? $value : ($existing[$key] ?? $default);
    }

    if (array_key_exists($key, $existing) && $existing[$key] !== null && $existing[$key] !== '') {
        return $existing[$key];
    }

    return $default;
}

function settings_payload(array $payload, array $existing, array $restaurant): array
{
    $baseName = (string) ($restaurant['name'] ?? 'Restaurant');

    $values = [
        'logo' => settings_input_value($payload, $existing, 'logo', null, true),
        'favicon' => settings_input_value($payload, $existing, 'favicon', null, true),
        'site_title' => settings_input_value($payload, $existing, 'site_title', $baseName),
        'hero_title' => settings_input_value($payload, $existing, 'hero_title', 'Best Food in Your Town'),
        'hero_subtitle' => settings_input_value(
            $payload,
            $existing,
            'hero_subtitle',
            'Freshly prepared dishes, premium service, and a warm local experience.'
        ),
        'hero_button_text' => settings_input_value($payload, $existing, 'hero_button_text', 'Order Now'),
        'hero_button_link' => array_key_exists('hero_button_link', $payload)
            ? trim((string) $payload['hero_button_link'])
            : (string) ($existing['hero_button_link'] ?? '#contact'),
        'hero_image' => settings_input_value($payload, $existing, 'hero_image', 'images/hero image.png'),
        'about_title' => settings_input_value($payload, $existing, 'about_title', 'About ' . $baseName),
        'about_text' => settings_input_value(
            $payload,
            $existing,
            'about_text',
            'Fresh ingredients, careful preparation, and fast delivery for your daily cravings.'
        ),
        'about_image' => settings_input_value($payload, $existing, 'about_image', 'images/hero image.png'),
        'phone' => settings_input_value($payload, $existing, 'phone', '+000 000 000 000'),
        'email' => settings_input_value($payload, $existing, 'email', 'support@example.com'),
        'address' => settings_input_value($payload, $existing, 'address', 'Address not configured'),
        'google_map_embed_url' => settings_input_value($payload, $existing, 'google_map_embed_url', null, true),
        'opening_hours' => settings_input_value($payload, $existing, 'opening_hours', 'Opening hours not configured'),
        'facebook_url' => settings_input_value($payload, $existing, 'facebook_url', null, true),
        'instagram_url' => settings_input_value($payload, $existing, 'instagram_url', null, true),
        'youtube_url' => settings_input_value($payload, $existing, 'youtube_url', null, true),
        'whatsapp_number' => settings_input_value($payload, $existing, 'whatsapp_number', null, true),
        'theme_preset_id' => $existing['theme_preset_id'] ?? null,
        'primary_color' => settings_input_value($payload, $existing, 'primary_color', '#ef2b24'),
        'secondary_color' => settings_input_value($payload, $existing, 'secondary_color', '#ff9f1c'),
        'accent_color' => settings_input_value($payload, $existing, 'accent_color', '#ffffff'),
        'background_color' => settings_input_value($payload, $existing, 'background_color', '#050505'),
        'text_color' => settings_input_value($payload, $existing, 'text_color', '#ffffff'),
        'button_color' => settings_input_value($payload, $existing, 'button_color', '#ef2b24'),
    ];

    if (array_key_exists('theme_preset_id', $existing) && $existing['theme_preset_id'] !== null && $existing['theme_preset_id'] !== '') {
        $values['theme_preset_id'] = (int) $existing['theme_preset_id'];
    }

    return $values;
}

function settings_validate_url_like(mixed $value): bool
{
    $value = trim((string) $value);
    if ($value === '' || str_starts_with($value, '#')) {
        return true;
    }

    return filter_var($value, FILTER_VALIDATE_URL) !== false;
}

function settings_validate_color(mixed $value): bool
{
    $value = trim((string) $value);

    if ($value === '') {
        return false;
    }

    return (bool) preg_match('/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/', $value);
}

function settings_validate(array $input): array
{
    $errors = [];

    if ($input['site_title'] === '' || settings_length((string) $input['site_title']) > 150) {
        $errors['site_title'] = 'Site title must be 150 characters or fewer.';
    }

    if ($input['hero_title'] === '' || settings_length((string) $input['hero_title']) > 255) {
        $errors['hero_title'] = 'Hero title must be 255 characters or fewer.';
    }

    if ($input['hero_subtitle'] === '' || settings_length((string) $input['hero_subtitle']) > 1000) {
        $errors['hero_subtitle'] = 'Hero subtitle must be 1000 characters or fewer.';
    }

    if ($input['hero_button_text'] === '' || settings_length((string) $input['hero_button_text']) > 80) {
        $errors['hero_button_text'] = 'Hero button text must be 80 characters or fewer.';
    }

    if ($input['hero_button_link'] !== '' && !settings_validate_url_like($input['hero_button_link'])) {
        $errors['hero_button_link'] = 'Hero button link must be an empty value, # anchor, or a valid URL.';
    }

    if ($input['hero_image'] === '') {
        $errors['hero_image'] = 'Hero image path is required.';
    }

    if ($input['about_title'] === '' || settings_length((string) $input['about_title']) > 191) {
        $errors['about_title'] = 'About title must be 191 characters or fewer.';
    }

    if ($input['about_text'] === '') {
        $errors['about_text'] = 'About text is required.';
    }

    if ($input['about_image'] === '') {
        $errors['about_image'] = 'About image path is required.';
    }

    if ($input['phone'] === '' || settings_length((string) $input['phone']) > 50) {
        $errors['phone'] = 'Phone number must be 50 characters or fewer.';
    }

    if ($input['email'] === '' || !filter_var((string) $input['email'], FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = 'Invalid email address.';
    }

    if ($input['address'] === '' || settings_length((string) $input['address']) > 255) {
        $errors['address'] = 'Address must be 255 characters or fewer.';
    }

    if ($input['opening_hours'] === '' || settings_length((string) $input['opening_hours']) > 191) {
        $errors['opening_hours'] = 'Opening hours must be 191 characters or fewer.';
    }

    foreach (['google_map_embed_url', 'facebook_url', 'instagram_url', 'youtube_url'] as $key) {
        if (!settings_validate_url_like($input[$key] ?? '')) {
            $errors[$key] = 'This field must be empty, #, or a valid URL.';
        }
    }

    if ($input['whatsapp_number'] !== null && settings_length((string) $input['whatsapp_number']) > 30) {
        $errors['whatsapp_number'] = 'WhatsApp number must be 30 characters or fewer.';
    }

    foreach (['primary_color', 'secondary_color', 'accent_color', 'background_color', 'text_color', 'button_color'] as $key) {
        if (!settings_validate_color($input[$key] ?? '')) {
            $errors[$key] = 'Enter a valid hex color value.';
        }
    }

    return $errors;
}

$method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
$pdo = require_connection();
$restaurant = restaurant_context();
$restaurantId = (int) $restaurant['restaurant_id'];

if ($method === 'GET') {
    $settings = settings_public_payload(settings_row($pdo, $restaurantId) ?: settings_default_response($restaurant));

    json_response([
        'success' => true,
        'data' => [
            'restaurant' => restaurant_public_summary($restaurant),
            'settings' => $settings,
        ],
    ]);
}

if (in_array($method, ['POST', 'PUT', 'PATCH'], true)) {
    require_admin_write_access();

    $rawBody = file_get_contents('php://input');
    if ($rawBody === false || trim($rawBody) === '') {
        json_response([
            'success' => false,
            'message' => 'Invalid JSON body.',
        ], 400);
    }

    $payload = json_decode($rawBody, true);
    if (!is_array($payload) || json_last_error() !== JSON_ERROR_NONE) {
        json_response([
            'success' => false,
            'message' => 'Invalid JSON body.',
        ], 400);
    }

    $existing = settings_row($pdo, $restaurantId) ?: settings_default_response($restaurant);
    $input = settings_payload($payload, $existing, $restaurant);
    $errors = settings_validate($input);

    if (!empty($errors)) {
        json_response([
            'success' => false,
            'message' => 'Validation error.',
            'errors' => $errors,
        ], 422);
    }

    try {
        $statement = $pdo->prepare(
            'INSERT INTO restaurant_settings
                (restaurant_id, logo, favicon, site_title, hero_title, hero_subtitle, hero_button_text, hero_button_link, hero_image, about_title, about_text, about_image, phone, email, address, google_map_embed_url, opening_hours, facebook_url, instagram_url, youtube_url, whatsapp_number, theme_preset_id, primary_color, secondary_color, accent_color, background_color, text_color, button_color)
             VALUES
                (:restaurant_id, :logo, :favicon, :site_title, :hero_title, :hero_subtitle, :hero_button_text, :hero_button_link, :hero_image, :about_title, :about_text, :about_image, :phone, :email, :address, :google_map_embed_url, :opening_hours, :facebook_url, :instagram_url, :youtube_url, :whatsapp_number, :theme_preset_id, :primary_color, :secondary_color, :accent_color, :background_color, :text_color, :button_color)
             ON DUPLICATE KEY UPDATE
                logo = VALUES(logo),
                favicon = VALUES(favicon),
                site_title = VALUES(site_title),
                hero_title = VALUES(hero_title),
                hero_subtitle = VALUES(hero_subtitle),
                hero_button_text = VALUES(hero_button_text),
                hero_button_link = VALUES(hero_button_link),
                hero_image = VALUES(hero_image),
                about_title = VALUES(about_title),
                about_text = VALUES(about_text),
                about_image = VALUES(about_image),
                phone = VALUES(phone),
                email = VALUES(email),
                address = VALUES(address),
                google_map_embed_url = VALUES(google_map_embed_url),
                opening_hours = VALUES(opening_hours),
                facebook_url = VALUES(facebook_url),
                instagram_url = VALUES(instagram_url),
                youtube_url = VALUES(youtube_url),
                whatsapp_number = VALUES(whatsapp_number),
                theme_preset_id = VALUES(theme_preset_id),
                primary_color = VALUES(primary_color),
                secondary_color = VALUES(secondary_color),
                accent_color = VALUES(accent_color),
                background_color = VALUES(background_color),
                text_color = VALUES(text_color),
                button_color = VALUES(button_color),
                updated_at = NOW()'
        );
        $statement->execute([
            'restaurant_id' => $restaurantId,
            'logo' => $input['logo'],
            'favicon' => $input['favicon'],
            'site_title' => $input['site_title'],
            'hero_title' => $input['hero_title'],
            'hero_subtitle' => $input['hero_subtitle'],
            'hero_button_text' => $input['hero_button_text'],
            'hero_button_link' => $input['hero_button_link'],
            'hero_image' => $input['hero_image'],
            'about_title' => $input['about_title'],
            'about_text' => $input['about_text'],
            'about_image' => $input['about_image'],
            'phone' => $input['phone'],
            'email' => $input['email'],
            'address' => $input['address'],
            'google_map_embed_url' => $input['google_map_embed_url'],
            'opening_hours' => $input['opening_hours'],
            'facebook_url' => $input['facebook_url'],
            'instagram_url' => $input['instagram_url'],
            'youtube_url' => $input['youtube_url'],
            'whatsapp_number' => $input['whatsapp_number'],
            'theme_preset_id' => $input['theme_preset_id'],
            'primary_color' => $input['primary_color'],
            'secondary_color' => $input['secondary_color'],
            'accent_color' => $input['accent_color'],
            'background_color' => $input['background_color'],
            'text_color' => $input['text_color'],
            'button_color' => $input['button_color'],
        ]);
    } catch (Throwable $throwable) {
        json_response([
            'success' => false,
            'message' => 'Database error.',
        ], 500);
    }

    json_response([
        'success' => true,
        'message' => 'Settings saved successfully.',
        'data' => [
            'restaurant' => restaurant_public_summary($restaurant),
            'settings' => settings_public_payload(settings_row($pdo, $restaurantId) ?: $input),
        ],
    ]);
}

json_response([
    'success' => false,
    'message' => 'Method not allowed.',
], 405);
