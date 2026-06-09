<?php
declare(strict_types=1);

require_once __DIR__ . '/_helpers.php';

function gallery_row(PDO $pdo, int $restaurantId, int $id): ?array
{
    $statement = $pdo->prepare(
        'SELECT id, restaurant_id, title, image, alt_text, sort_order, status, created_at, updated_at
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
    return [
        'title' => trim((string) ($payload['title'] ?? '')),
        'image' => trim((string) ($payload['image'] ?? '')),
        'alt_text' => trim((string) ($payload['alt_text'] ?? '')),
        'sort_order' => max(0, (int) ($payload['sort_order'] ?? 0)),
        'status' => status_or_default($payload['status'] ?? 'active', 'active', ['active', 'inactive']),
    ];
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
api_require_write_enabled($method);
$pdo = require_connection();
$restaurant = restaurant_context();
$restaurantId = (int) $restaurant['restaurant_id'];

if ($method === 'GET') {
    $id = input_id();

    if ($id) {
        $row = gallery_row($pdo, $restaurantId, $id);

        if ($row === null || (string) $row['status'] !== 'active') {
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
        'SELECT id, restaurant_id, title, image, alt_text, sort_order, status, created_at, updated_at
         FROM gallery_images
         WHERE restaurant_id = :restaurant_id
           AND status = "active"
         ORDER BY sort_order ASC, created_at DESC'
    );
    $statement->execute(['restaurant_id' => $restaurantId]);

    json_response([
        'success' => true,
        'data' => $statement->fetchAll(),
    ]);
}

if ($method === 'POST') {
    $payload = request_payload();
    $input = gallery_payload($payload);

    if ($input['title'] === '') {
        json_response([
            'success' => false,
            'message' => 'Gallery title is required.',
        ], 422);
    }

    if ($input['image'] === '') {
        json_response([
            'success' => false,
            'message' => 'Gallery image is required.',
        ], 422);
    }

    $statement = $pdo->prepare(
        'INSERT INTO gallery_images (restaurant_id, title, image, alt_text, sort_order, status)
         VALUES (:restaurant_id, :title, :image, :alt_text, :sort_order, :status)'
    );
    $statement->execute([
        'restaurant_id' => $restaurantId,
        'title' => $input['title'],
        'image' => $input['image'],
        'alt_text' => $input['alt_text'] !== '' ? $input['alt_text'] : null,
        'sort_order' => $input['sort_order'],
        'status' => $input['status'],
    ]);

    json_response([
        'success' => true,
        'data' => gallery_row($pdo, $restaurantId, (int) $pdo->lastInsertId()),
        'message' => 'Gallery image created successfully.',
    ], 201);
}

if ($method === 'PUT') {
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

    if ($input['title'] === '') {
        json_response([
            'success' => false,
            'message' => 'Gallery title is required.',
        ], 422);
    }

    if ($input['image'] === '') {
        json_response([
            'success' => false,
            'message' => 'Gallery image is required.',
        ], 422);
    }

    $statement = $pdo->prepare(
        'UPDATE gallery_images
         SET title = :title,
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
        'image' => $input['image'],
        'alt_text' => $input['alt_text'] !== '' ? $input['alt_text'] : null,
        'sort_order' => $input['sort_order'],
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
