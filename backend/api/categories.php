<?php
declare(strict_types=1);

require_once __DIR__ . '/_helpers.php';

function category_row(PDO $pdo, int $restaurantId, int $id): ?array
{
    $statement = $pdo->prepare(
        'SELECT
            id,
            name,
            slug,
            description,
            image,
            sort_order,
            status
         FROM menu_categories
         WHERE id = :id
           AND restaurant_id = :restaurant_id
         LIMIT 1'
    );
    $statement->execute([
        'id' => $id,
        'restaurant_id' => $restaurantId,
    ]);

    $row = $statement->fetch();

    return $row ?: null;
}

function category_list(PDO $pdo, int $restaurantId, bool $includeInactive = false): array
{
    $statusFilter = $includeInactive ? '' : 'AND status = "active"';

    $statement = $pdo->prepare(
        'SELECT
            id,
            name,
            slug,
            description,
            image,
            sort_order,
            status
         FROM menu_categories
         WHERE restaurant_id = :restaurant_id
           ' . $statusFilter . '
         ORDER BY sort_order ASC, id ASC'
    );
    $statement->execute(['restaurant_id' => $restaurantId]);

    return $statement->fetchAll();
}

function category_payload(array $payload): array
{
    $has = static fn (string $key): bool => array_key_exists($key, $payload);

    return [
        'name' => $has('name') ? trim((string) $payload['name']) : '',
        'slug' => $has('slug') ? trim((string) $payload['slug']) : '',
        'description' => $has('description') ? trim((string) $payload['description']) : '',
        'image' => $has('image') ? trim((string) $payload['image']) : '',
        'sort_order' => $has('sort_order') ? trim((string) $payload['sort_order']) : '0',
        'status' => $has('status') ? trim((string) $payload['status']) : 'active',
    ];
}

function category_update_payload(array $payload, array $existing): array
{
    $has = static fn (string $key): bool => array_key_exists($key, $payload);

    return [
        'name' => $has('name') ? trim((string) $payload['name']) : (string) ($existing['name'] ?? ''),
        'slug' => $has('slug') ? trim((string) $payload['slug']) : (string) ($existing['slug'] ?? ''),
        'description' => $has('description') ? trim((string) $payload['description']) : (string) ($existing['description'] ?? ''),
        'image' => $has('image') ? trim((string) $payload['image']) : (string) ($existing['image'] ?? ''),
        'sort_order' => $has('sort_order') ? trim((string) $payload['sort_order']) : (string) ($existing['sort_order'] ?? 0),
        'status' => $has('status') ? trim((string) $payload['status']) : (string) ($existing['status'] ?? 'active'),
    ];
}

function category_validate(array $input): array
{
    $errors = [];

    if ($input['name'] === '') {
        $errors['name'] = 'Category name is required.';
    } elseif (strlen($input['name']) > 150) {
        $errors['name'] = 'Category name must be 150 characters or fewer.';
    }

    if ($input['slug'] !== '' && strlen($input['slug']) > 180) {
        $errors['slug'] = 'Category slug must be 180 characters or fewer.';
    }

    if (!in_array($input['status'], ['active', 'inactive'], true)) {
        $errors['status'] = 'Invalid category status.';
    }

    if (filter_var($input['sort_order'], FILTER_VALIDATE_INT, ['options' => ['min_range' => 0]]) === false) {
        $errors['sort_order'] = 'Sort order must be an integer.';
    }

    return $errors;
}

function category_resolved_slug(PDO $pdo, int $restaurantId, array $input, ?int $ignoreId = null): string
{
    $base = $input['slug'] !== '' ? $input['slug'] : $input['name'];
    return unique_restaurant_slug($pdo, 'menu_categories', 'restaurant_id', (string) $restaurantId, $base, $ignoreId);
}

$method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
$pdo = require_connection();
$restaurant = restaurant_context();
$restaurantId = (int) $restaurant['restaurant_id'];

if ($method === 'GET') {
    $id = input_id();
    $includeInactive = false;

    if (array_key_exists('include_inactive', $_GET)) {
        $includeInactiveError = null;
        $includeInactive = query_bool_param('include_inactive', $includeInactiveError);

        if ($includeInactiveError !== null) {
            json_response([
                'success' => false,
                'message' => 'Validation error.',
                'errors' => [
                    'include_inactive' => $includeInactiveError,
                ],
            ], 422);
        }
    }

    if (array_key_exists('id', $_GET) && $id === null) {
        json_response([
            'success' => false,
            'message' => 'Validation error.',
            'errors' => [
                'id' => 'Invalid id.',
            ],
        ], 422);
    }

    if ($id) {
        $row = category_row($pdo, $restaurantId, $id);

        if ($row === null || ((!$includeInactive) && (string) $row['status'] !== 'active')) {
            json_response([
                'success' => false,
                'message' => 'Category not found.',
            ], 404);
        }

        json_response([
            'success' => true,
            'data' => $row,
        ]);
    }

    json_response([
        'success' => true,
        'data' => category_list($pdo, $restaurantId, (bool) $includeInactive),
    ]);
}

if (in_array($method, ['POST', 'PUT', 'PATCH', 'DELETE'], true)) {
    require_admin_write_access();
}

if ($method === 'POST') {
    $payload = request_payload();
    $input = category_payload($payload);
    $errors = category_validate($input);

    if (!empty($errors)) {
        json_response([
            'success' => false,
            'message' => 'Validation error.',
            'errors' => $errors,
        ], 422);
    }

    $slug = category_resolved_slug($pdo, $restaurantId, $input);

    $statement = $pdo->prepare(
        'INSERT INTO menu_categories
            (restaurant_id, name, slug, description, image, sort_order, status)
         VALUES
            (:restaurant_id, :name, :slug, :description, :image, :sort_order, :status)'
    );
    $statement->execute([
        'restaurant_id' => $restaurantId,
        'name' => $input['name'],
        'slug' => $slug,
        'description' => $input['description'] !== '' ? $input['description'] : null,
        'image' => $input['image'] !== '' ? $input['image'] : null,
        'sort_order' => (int) $input['sort_order'],
        'status' => $input['status'],
    ]);

    json_response([
        'success' => true,
        'message' => 'Category created successfully.',
        'data' => category_row($pdo, $restaurantId, (int) $pdo->lastInsertId()),
    ], 201);
}

if ($method === 'PUT' || $method === 'PATCH') {
    $payload = request_payload();
    $id = input_id($payload);

    if (!$id) {
        json_response([
            'success' => false,
            'message' => 'Category id is required.',
        ], 422);
    }

    $existing = category_row($pdo, $restaurantId, $id);
    if ($existing === null) {
        json_response([
            'success' => false,
            'message' => 'Category not found.',
        ], 404);
    }

    $input = category_update_payload($payload, $existing);

    $errors = category_validate($input);
    if (!empty($errors)) {
        json_response([
            'success' => false,
            'message' => 'Validation error.',
            'errors' => $errors,
        ], 422);
    }

    if (array_key_exists('slug', $payload)) {
        $slugBase = $input['slug'] !== '' ? $input['slug'] : $input['name'];
        $slug = unique_restaurant_slug($pdo, 'menu_categories', 'restaurant_id', (string) $restaurantId, $slugBase, $id);
    } else {
        $slug = (string) $existing['slug'];
    }

    $statement = $pdo->prepare(
        'UPDATE menu_categories
         SET name = :name,
             slug = :slug,
             description = :description,
             image = :image,
             sort_order = :sort_order,
             status = :status,
             updated_at = NOW()
         WHERE id = :id
           AND restaurant_id = :restaurant_id'
    );
    $statement->execute([
        'name' => $input['name'],
        'slug' => $slug,
        'description' => $input['description'] !== '' ? $input['description'] : null,
        'image' => $input['image'] !== '' ? $input['image'] : null,
        'sort_order' => (int) $input['sort_order'],
        'status' => $input['status'],
        'id' => $id,
        'restaurant_id' => $restaurantId,
    ]);

    json_response([
        'success' => true,
        'message' => 'Category updated successfully.',
        'data' => category_row($pdo, $restaurantId, $id),
    ]);
}

if ($method === 'DELETE') {
    $payload = request_payload();
    $id = input_id($payload);

    if (!$id) {
        json_response([
            'success' => false,
            'message' => 'Category id is required.',
        ], 422);
    }

    $existing = category_row($pdo, $restaurantId, $id);
    if ($existing === null) {
        json_response([
            'success' => false,
            'message' => 'Category not found.',
        ], 404);
    }

    $statement = $pdo->prepare(
        'UPDATE menu_categories
         SET status = "inactive",
             updated_at = NOW()
         WHERE id = :id
           AND restaurant_id = :restaurant_id'
    );
    $statement->execute([
        'id' => $id,
        'restaurant_id' => $restaurantId,
    ]);

    json_response([
        'success' => true,
        'message' => 'Category deleted successfully.',
        'data' => ['id' => $id, 'status' => 'inactive'],
    ]);
}

json_response([
    'success' => false,
    'message' => 'Method not allowed.',
], 405);
