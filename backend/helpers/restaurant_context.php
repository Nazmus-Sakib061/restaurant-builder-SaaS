<?php
declare(strict_types=1);

function restaurant_default_slug(): string
{
    return 'demo-pizza-house';
}

function restaurant_slug_is_valid(string $slug): bool
{
    return (bool) preg_match('/^[a-z0-9]+(?:-[a-z0-9]+)*$/', $slug);
}

function restaurant_requested_slug(mixed $override = null): string
{
    if ($override !== null) {
        $candidate = trim((string) $override);
        if ($candidate !== '') {
            $candidate = function_exists('mb_strtolower') ? mb_strtolower($candidate) : strtolower($candidate);
            return $candidate;
        }
    }

    $requestCandidates = [
        $_GET['restaurant'] ?? null,
        $_POST['restaurant'] ?? null,
    ];

    foreach ($requestCandidates as $candidate) {
        $candidate = trim((string) $candidate);
        if ($candidate !== '') {
            $candidate = function_exists('mb_strtolower') ? mb_strtolower($candidate) : strtolower($candidate);
            return $candidate;
        }
    }

    return restaurant_default_slug();
}

function slugify_text(string $value): string
{
    $value = trim($value);

    if ($value === '') {
        return 'item-' . substr(bin2hex(random_bytes(4)), 0, 8);
    }

    $value = function_exists('mb_strtolower') ? mb_strtolower($value) : strtolower($value);
    $value = preg_replace('/[^\pL\pN]+/u', '-', $value) ?? '';
    $value = trim($value, '-');
    $value = preg_replace('/-+/', '-', $value) ?? $value;

    if ($value === '') {
        return 'item-' . substr(bin2hex(random_bytes(4)), 0, 8);
    }

    return $value;
}

function generate_slug(string $text): string
{
    return slugify_text($text);
}

function unique_restaurant_slug(
    PDO $pdo,
    string $table,
    string $restaurantIdColumn,
    string $restaurantId,
    string $baseText,
    ?int $ignoreId = null
): string {
    $allowedTables = ['menu_categories', 'menu_items'];
    if (!in_array($table, $allowedTables, true)) {
        throw new InvalidArgumentException('Invalid slug table.');
    }

    if (!preg_match('/^[a-z_]+$/', $restaurantIdColumn)) {
        throw new InvalidArgumentException('Invalid restaurant id column.');
    }

    $baseSlug = generate_slug($baseText);
    if ($baseSlug === '') {
        $baseSlug = 'item-' . substr(bin2hex(random_bytes(4)), 0, 8);
    }

    $candidate = $baseSlug;
    $suffix = 2;

    while (true) {
        $sql = sprintf(
            'SELECT id
             FROM %s
             WHERE %s = :restaurant_id
               AND slug = :slug',
            $table,
            $restaurantIdColumn
        );

        if ($ignoreId !== null) {
            $sql .= ' AND id <> :ignore_id';
        }

        $sql .= ' LIMIT 1';

        $statement = $pdo->prepare($sql);
        $params = [
            'restaurant_id' => $restaurantId,
            'slug' => $candidate,
        ];

        if ($ignoreId !== null) {
            $params['ignore_id'] = $ignoreId;
        }

        $statement->execute($params);

        if (!$statement->fetchColumn()) {
            return $candidate;
        }

        $candidate = $baseSlug . '-' . $suffix++;
    }
}

function restaurant_context(mixed $slug = null): array
{
    $pdo = db();

    if (!$pdo instanceof PDO) {
        if (function_exists('json_response')) {
            json_response([
                'success' => false,
                'message' => 'Database connection is not available.',
            ], 503);
        }

        throw new RuntimeException('Database connection is not available.');
    }

    $resolvedSlug = restaurant_requested_slug($slug);
    if (!restaurant_slug_is_valid($resolvedSlug)) {
        if (function_exists('json_error')) {
            json_error('Invalid restaurant slug.', 400);
        }

        throw new InvalidArgumentException('Invalid restaurant slug.');
    }

    $statement = $pdo->prepare(
        'SELECT
            id,
            name,
            slug,
            business_type,
            owner_name,
            owner_email,
            owner_phone,
            status,
            subscription_status,
            trial_ends_at,
            created_at,
            updated_at
         FROM restaurants
         WHERE slug = :slug
           AND status = "active"
         LIMIT 1'
    );
    $statement->execute(['slug' => $resolvedSlug]);
    $restaurant = $statement->fetch();

    if (!$restaurant) {
        if (function_exists('json_response')) {
            json_response([
                'success' => false,
                'message' => 'Restaurant not found.',
            ], 404);
        }

        throw new RuntimeException('Restaurant not found.');
    }

    return [
        'restaurant_id' => (int) $restaurant['id'],
        'id' => (int) $restaurant['id'],
        'name' => (string) $restaurant['name'],
        'slug' => (string) $restaurant['slug'],
        'business_type' => (string) $restaurant['business_type'],
        'owner_name' => $restaurant['owner_name'] !== null ? (string) $restaurant['owner_name'] : null,
        'owner_email' => $restaurant['owner_email'] !== null ? (string) $restaurant['owner_email'] : null,
        'owner_phone' => $restaurant['owner_phone'] !== null ? (string) $restaurant['owner_phone'] : null,
        'status' => (string) $restaurant['status'],
        'subscription_status' => (string) $restaurant['subscription_status'],
        'trial_ends_at' => $restaurant['trial_ends_at'],
        'created_at' => $restaurant['created_at'],
        'updated_at' => $restaurant['updated_at'],
    ];
}

function restaurant_public_summary(array $restaurant): array
{
    return [
        'id' => (int) ($restaurant['restaurant_id'] ?? $restaurant['id'] ?? 0),
        'name' => (string) ($restaurant['name'] ?? ''),
        'slug' => (string) ($restaurant['slug'] ?? ''),
        'business_type' => (string) ($restaurant['business_type'] ?? 'restaurant'),
    ];
}
