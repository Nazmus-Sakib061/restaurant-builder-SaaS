<?php
declare(strict_types=1);

require_once __DIR__ . '/_helpers.php';

function restaurant_owner_management_find_restaurant(PDO $pdo, int|string $identifier): ?array
{
    if (is_int($identifier) || (is_string($identifier) && preg_match('/^[1-9]\d*$/', $identifier))) {
        $statement = $pdo->prepare(
            'SELECT id, name, slug, status, owner_user_id, owner_name, owner_email
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
        'SELECT id, name, slug, status, owner_user_id, owner_name, owner_email
         FROM restaurants
         WHERE slug = :slug
         LIMIT 1'
    );
    $statement->execute(['slug' => $slug]);

    $row = $statement->fetch();
    return $row ?: null;
}

function restaurant_owner_management_format_assignment(array $restaurant): array
{
    $ownerId = isset($restaurant['owner_user_id']) && $restaurant['owner_user_id'] !== null
        ? (int) $restaurant['owner_user_id']
        : null;

    return [
        'restaurant' => [
            'id' => (int) $restaurant['id'],
            'name' => (string) $restaurant['name'],
            'slug' => (string) $restaurant['slug'],
            'status' => (string) $restaurant['status'],
        ],
        'owner' => $ownerId !== null
            ? [
                'id' => $ownerId,
                'name' => (string) ($restaurant['owner_name'] ?? ''),
                'email' => (string) ($restaurant['owner_email'] ?? ''),
                'role' => 'restaurant_owner',
            ]
            : null,
    ];
}

$method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
$pdo = require_connection();

if ($method === 'GET') {
    auth_require_super_admin($pdo);

    $statement = $pdo->prepare(
        'SELECT
            r.id,
            r.name,
            r.slug,
            r.status,
            r.owner_user_id,
            r.owner_name,
            r.owner_email
         FROM restaurants r
         ORDER BY (r.status = "active") DESC, r.name ASC, r.created_at DESC'
    );
    $statement->execute();

    $assignments = array_map(static fn (array $restaurant): array => restaurant_owner_management_format_assignment($restaurant), $statement->fetchAll());

    json_response([
        'success' => true,
        'data' => $assignments,
    ]);
}

if ($method !== 'POST') {
    json_response([
        'success' => false,
        'message' => 'Method not allowed.',
    ], 405);
}

auth_require_super_admin($pdo);
$payload = request_payload();

$name = trim((string) ($payload['name'] ?? ''));
$email = strtolower(trim((string) ($payload['email'] ?? '')));
$password = trim((string) ($payload['password'] ?? ''));
$restaurantIdentifier = $payload['restaurant_id'] ?? $payload['restaurant_slug'] ?? $payload['restaurant'] ?? $payload['slug'] ?? null;
$errors = [];

if ($name === '' || strlen($name) > 150) {
    $errors['name'] = 'Owner name is required and must be 150 characters or fewer.';
}

if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'Enter a valid email address.';
}

if ($password !== '' && strlen($password) < 8) {
    $errors['password'] = 'Password must be at least 8 characters.';
}

$restaurant = $restaurantIdentifier !== null
    ? restaurant_owner_management_find_restaurant($pdo, is_string($restaurantIdentifier) ? strtolower(trim($restaurantIdentifier)) : $restaurantIdentifier)
    : null;

if ($restaurant === null) {
    $errors['restaurant_id'] = 'Restaurant not found.';
}

if (!empty($errors)) {
    json_response([
        'success' => false,
        'message' => 'Validation error.',
        'errors' => $errors,
    ], 422);
}

$existingUser = auth_user_row_by_email($pdo, $email);
if ($existingUser !== null && strtolower((string) ($existingUser['status'] ?? 'inactive')) !== 'active') {
    json_response([
        'success' => false,
        'message' => 'This user account is inactive or blocked.',
    ], 403);
}

if ($existingUser !== null && auth_role_is_super_admin($existingUser['role'] ?? null)) {
    json_response([
        'success' => false,
        'message' => 'Super admin accounts cannot be assigned as restaurant owners.',
    ], 403);
}

try {
    $pdo->beginTransaction();

    if ($existingUser !== null) {
        $userId = (int) $existingUser['id'];

        $statement = $pdo->prepare(
            'UPDATE users
             SET name = :name,
                 role = "restaurant_owner",
                 status = "active"
             WHERE id = :id'
        );
        $statement->execute([
            'id' => $userId,
            'name' => $name,
        ]);
    } else {
        $statement = $pdo->prepare(
            'INSERT INTO users
                (name, email, password_hash, role, status)
             VALUES
                (:name, :email, :password_hash, "restaurant_owner", "active")'
        );
        $statement->execute([
            'name' => $name,
            'email' => $email,
            'password_hash' => password_hash($password, PASSWORD_DEFAULT),
        ]);
        $userId = (int) $pdo->lastInsertId();
    }

    $previousOwnerId = isset($restaurant['owner_user_id']) && $restaurant['owner_user_id'] !== null
        ? (int) $restaurant['owner_user_id']
        : null;

    if ($previousOwnerId !== null && $previousOwnerId !== $userId) {
        $statement = $pdo->prepare(
            'UPDATE restaurant_users
             SET role = "restaurant_staff"
             WHERE restaurant_id = :restaurant_id
               AND user_id = :user_id'
        );
        $statement->execute([
            'restaurant_id' => (int) $restaurant['id'],
            'user_id' => $previousOwnerId,
        ]);
    }

    $statement = $pdo->prepare(
        'INSERT INTO restaurant_users
            (restaurant_id, user_id, role)
         VALUES
            (:restaurant_id, :user_id, "restaurant_owner")
         ON DUPLICATE KEY UPDATE
            role = VALUES(role)'
    );
    $statement->execute([
        'restaurant_id' => (int) $restaurant['id'],
        'user_id' => $userId,
    ]);

    $statement = $pdo->prepare(
        'UPDATE restaurants
         SET owner_user_id = :owner_user_id,
             owner_name = :owner_name,
             owner_email = :owner_email
         WHERE id = :id'
    );
    $statement->execute([
        'id' => (int) $restaurant['id'],
        'owner_user_id' => $userId,
        'owner_name' => $name,
        'owner_email' => $email,
    ]);

    $pdo->commit();
} catch (Throwable $throwable) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    json_response([
        'success' => false,
        'message' => 'Unable to save owner assignment.',
    ], 500);
}

$updatedRestaurant = restaurant_owner_management_find_restaurant($pdo, (int) $restaurant['id']);

json_response([
    'success' => true,
    'message' => $existingUser !== null
        ? 'Owner assigned successfully.'
        : 'Owner created and assigned successfully.',
    'data' => restaurant_owner_management_format_assignment($updatedRestaurant ?: $restaurant),
]);
