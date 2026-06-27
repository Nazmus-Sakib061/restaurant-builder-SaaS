<?php
declare(strict_types=1);

require_once __DIR__ . '/_helpers.php';

$method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');

if ($method !== 'POST') {
    json_response([
        'success' => false,
        'message' => 'Method not allowed.',
    ], 405);
}

$pdo = require_connection();
$user = auth_require_login($pdo);
$payload = request_payload();

$restaurantId = strict_positive_int(
    $payload['restaurant_id']
    ?? $payload['tenant_id']
    ?? $payload['id']
    ?? $_GET['restaurant_id']
    ?? $_GET['tenant_id']
    ?? $_GET['id']
    ?? null
);

$restaurant = null;

if ($restaurantId !== null) {
    $restaurant = auth_load_active_restaurant($pdo, $restaurantId);
} else {
    $restaurantSlug = tenant_canonical_slug(
        (string) (
            $payload['restaurant_slug']
            ?? $payload['slug']
            ?? $payload['tenant']
            ?? $payload['restaurant']
            ?? $_GET['restaurant_slug']
            ?? $_GET['slug']
            ?? $_GET['tenant']
            ?? $_GET['restaurant']
            ?? ''
        )
    );

    if ($restaurantSlug === '' || !restaurant_slug_is_valid($restaurantSlug)) {
        json_response([
            'success' => false,
            'message' => 'A valid restaurant identifier is required.',
        ], 422);
    }

    $restaurant = auth_load_active_restaurant_by_slug($pdo, $restaurantSlug);
}

if ($restaurant === null) {
    json_response([
        'success' => false,
        'message' => 'Restaurant not found.',
    ], 404);
}

if (!auth_user_can_access_restaurant($pdo, $user, (int) $restaurant['id'])) {
    json_response([
        'success' => false,
        'message' => 'Forbidden.',
    ], 403);
}

auth_store_active_restaurant_id((int) $restaurant['id']);

json_response([
    'success' => true,
    'message' => 'Restaurant selected successfully.',
    'data' => auth_current_user_payload($pdo),
]);
