<?php
declare(strict_types=1);

require_once __DIR__ . '/_helpers.php';

function gallery_row(PDO $pdo, int $restaurantId, int $id): ?array
{
    $statement = $pdo->prepare(
        'SELECT id, restaurant_id, title, caption, image, alt_text, sort_order, status, created_at, updated_at
         FROM gallery_images
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

function gallery_payload(array $payload): array
{
    $sortOrderRaw = trim((string) ($payload['sort_order'] ?? ''));
    $statusRaw = trim((string) ($payload['status'] ?? ''));

    return [
        'title' => trim((string) ($payload['title'] ?? '')),
        'caption' => trim((string) ($payload['caption'] ?? '')),
        'image' => trim((string) ($payload['image'] ?? '')),
        'alt_text' => trim((string) ($payload['alt_text'] ?? '')),
        'sort_order_raw' => $sortOrderRaw,
        'sort_order' => $sortOrderRaw === ''
            ? 0
            : (preg_match('/^\d+$/', $sortOrderRaw) ? (int) $sortOrderRaw : null),
        'status_raw' => $statusRaw,
        'status' => $statusRaw === '' ? 'active' : strtolower($statusRaw),
    ];
}

function gallery_validate_input(array $input): array
{
    $errors = [];

    if ($input['title'] === '') {
        $errors['title'] = 'Gallery title is required.';
    } elseif (strlen($input['title']) > 150) {
        $errors['title'] = 'Gallery title must be 150 characters or fewer.';
    }

    if ($input['caption'] !== '' && strlen($input['caption']) > 1000) {
        $errors['caption'] = 'Caption must be 1000 characters or fewer.';
    }

    if ($input['image'] === '') {
        $errors['image'] = 'Gallery image is required.';
    } elseif (strlen($input['image']) > 255) {
        $errors['image'] = 'Image path must be 255 characters or fewer.';
    }

    if ($input['alt_text'] !== '' && strlen($input['alt_text']) > 255) {
        $errors['alt_text'] = 'Alt text must be 255 characters or fewer.';
    }

    $sortOrderRaw = trim((string) ($input['sort_order_raw'] ?? ''));
    if ($sortOrderRaw !== '') {
        if (!preg_match('/^\d+$/', $sortOrderRaw)) {
            $errors['sort_order'] = 'Sort order must be a whole number.';
        }
    }

    $statusRaw = trim((string) ($input['status_raw'] ?? ''));
    if ($statusRaw !== '' && !in_array(strtolower($statusRaw), ['active', 'inactive'], true)) {
        $errors['status'] = 'Invalid gallery status.';
    }

    return $errors;
}

$method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
$pdo = require_connection();
$restaurant = restaurant_context();
$restaurantId = (int) $restaurant['restaurant_id'];

if ($method === 'GET') {
    $id = input_id();
    $includeInactive = false;
    $includeInactiveError = null;

    if (array_key_exists('include_inactive', $_GET)) {
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
        $row = gallery_row($pdo, $restaurantId, $id);

        if ($row === null || ((!$includeInactive) && (string) $row['status'] !== 'active')) {
            json_response([
                'success' => false,
                'message' => 'Gallery image not found.',
            ], 404);
        }

        json_response([
            'success' => true,
            'data' => $row,
        ]);
    }

    $statement = $pdo->prepare(
        'SELECT id, restaurant_id, title, caption, image, alt_text, sort_order, status, created_at, updated_at
         FROM gallery_images
         WHERE restaurant_id = :restaurant_id
           ' . ($includeInactive ? '' : 'AND status = "active"') . '
         ORDER BY sort_order ASC, created_at DESC'
    );
    $statement->execute(['restaurant_id' => $restaurantId]);

    json_response([
        'success' => true,
        'data' => $statement->fetchAll(),
    ]);
}

if (in_array($method, ['POST', 'PUT', 'PATCH', 'DELETE'], true)) {
    require_admin_write_access();
}

if ($method === 'POST') {
    $payload = request_payload();
    $input = gallery_payload($payload);
    $errors = gallery_validate_input($input);

    if (!empty($errors)) {
        json_response([
            'success' => false,
            'message' => 'Validation error.',
            'errors' => $errors,
        ], 422);
    }

    $statement = $pdo->prepare(
        'INSERT INTO gallery_images (restaurant_id, title, caption, image, alt_text, sort_order, status)
         VALUES (:restaurant_id, :title, :caption, :image, :alt_text, :sort_order, :status)'
    );
    $statement->execute([
        'restaurant_id' => $restaurantId,
        'title' => $input['title'],
        'caption' => $input['caption'] !== '' ? $input['caption'] : null,
        'image' => $input['image'],
        'alt_text' => $input['alt_text'] !== '' ? $input['alt_text'] : null,
        'sort_order' => (int) $input['sort_order'],
        'status' => $input['status'],
    ]);

    json_response([
        'success' => true,
        'data' => gallery_row($pdo, $restaurantId, (int) $pdo->lastInsertId()),
        'message' => 'Gallery image created successfully.',
    ], 201);
}

if ($method === 'PUT' || $method === 'PATCH') {
    $payload = request_payload();
    $id = input_id($payload);

    if (!$id) {
        json_response([
            'success' => false,
            'message' => 'Gallery image id is required.',
        ], 422);
    }

    $existing = gallery_row($pdo, $restaurantId, $id);

    if ($existing === null) {
        json_response([
            'success' => false,
            'message' => 'Gallery image not found.',
        ], 404);
    }

    $input = gallery_payload($payload);
    $errors = gallery_validate_input($input);

    if (!empty($errors)) {
        json_response([
            'success' => false,
            'message' => 'Validation error.',
            'errors' => $errors,
        ], 422);
    }

    $statement = $pdo->prepare(
        'UPDATE gallery_images
         SET title = :title,
             caption = :caption,
             image = :image,
             alt_text = :alt_text,
             sort_order = :sort_order,
             status = :status,
             updated_at = NOW()
         WHERE id = :id
           AND restaurant_id = :restaurant_id'
    );
    $statement->execute([
        'title' => $input['title'],
        'caption' => $input['caption'] !== '' ? $input['caption'] : null,
        'image' => $input['image'],
        'alt_text' => $input['alt_text'] !== '' ? $input['alt_text'] : null,
        'sort_order' => (int) $input['sort_order'],
        'status' => $input['status'],
        'id' => $id,
        'restaurant_id' => $restaurantId,
    ]);

    json_response([
        'success' => true,
        'data' => gallery_row($pdo, $restaurantId, $id),
        'message' => 'Gallery image updated successfully.',
    ]);
}

if ($method === 'DELETE') {
    $payload = request_payload();
    $id = input_id($payload);

    if (!$id) {
        json_response([
            'success' => false,
            'message' => 'Gallery image id is required.',
        ], 422);
    }

    $existing = gallery_row($pdo, $restaurantId, $id);

    if ($existing === null) {
        json_response([
            'success' => false,
            'message' => 'Gallery image not found.',
        ], 404);
    }

    $statement = $pdo->prepare(
        'UPDATE gallery_images
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
        'data' => ['id' => $id, 'status' => 'inactive'],
        'message' => 'Gallery image deleted successfully.',
    ]);
}

json_response([
    'success' => false,
    'message' => 'Method not allowed.',
], 405);
