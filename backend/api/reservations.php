<?php
declare(strict_types=1);

require_once __DIR__ . '/_helpers.php';

function reservation_row(PDO $pdo, int $restaurantId, int $id): ?array
{
    $statement = $pdo->prepare(
        'SELECT id, restaurant_id, customer_name, customer_phone, customer_email, reservation_date, reservation_time, number_of_people, message, status, created_at, updated_at
         FROM reservations
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

function reservation_payload(array $payload): array
{
    $customerEmail = trim((string) ($payload['customer_email'] ?? ($payload['email'] ?? '')));

    return [
        'customer_name' => trim((string) ($payload['customer_name'] ?? '')),
        'customer_phone' => trim((string) ($payload['customer_phone'] ?? ($payload['phone'] ?? ''))),
        'customer_email' => $customerEmail,
        'reservation_date' => trim((string) ($payload['reservation_date'] ?? '')),
        'reservation_time' => trim((string) ($payload['reservation_time'] ?? '')),
        'number_of_people' => max(1, (int) ($payload['number_of_people'] ?? 2)),
        'message' => trim((string) ($payload['message'] ?? '')),
        'status' => status_or_default($payload['status'] ?? 'pending', 'pending', ['pending', 'confirmed', 'cancelled', 'completed']),
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
        $row = reservation_row($pdo, $restaurantId, $id);

        if ($row === null) {
            json_response([
                'success' => false,
                'message' => 'Reservation not found.',
            ], 404);
        }

        json_response([
            'success' => true,
            'data' => $row,
        ]);
    }

    $statement = $pdo->prepare(
        'SELECT id, restaurant_id, customer_name, customer_phone, customer_email, reservation_date, reservation_time, number_of_people, message, status, created_at, updated_at
         FROM reservations
         WHERE restaurant_id = :restaurant_id
         ORDER BY created_at DESC, reservation_date DESC, reservation_time DESC'
    );
    $statement->execute(['restaurant_id' => $restaurantId]);

    json_response([
        'success' => true,
        'data' => $statement->fetchAll(),
    ]);
}

if ($method === 'POST') {
    $payload = request_payload();
    $input = reservation_payload($payload);

    if ($input['customer_name'] === '' || $input['customer_phone'] === '' || $input['reservation_date'] === '' || $input['reservation_time'] === '') {
        json_response([
            'success' => false,
            'message' => 'Name, phone, reservation date, and reservation time are required.',
        ], 422);
    }

    if ($input['customer_email'] !== '' && !filter_var($input['customer_email'], FILTER_VALIDATE_EMAIL)) {
        json_response([
            'success' => false,
            'message' => 'Please enter a valid email address.',
        ], 422);
    }

    $statement = $pdo->prepare(
        'INSERT INTO reservations
            (restaurant_id, customer_name, customer_phone, customer_email, reservation_date, reservation_time, number_of_people, message, status)
         VALUES
            (:restaurant_id, :customer_name, :customer_phone, :customer_email, :reservation_date, :reservation_time, :number_of_people, :message, :status)'
    );
    $statement->execute([
        'restaurant_id' => $restaurantId,
        'customer_name' => $input['customer_name'],
        'customer_phone' => $input['customer_phone'],
        'customer_email' => $input['customer_email'] !== '' ? $input['customer_email'] : null,
        'reservation_date' => $input['reservation_date'],
        'reservation_time' => $input['reservation_time'],
        'number_of_people' => $input['number_of_people'],
        'message' => $input['message'] !== '' ? $input['message'] : null,
        'status' => $input['status'],
    ]);

    json_response([
        'success' => true,
        'data' => reservation_row($pdo, $restaurantId, (int) $pdo->lastInsertId()),
        'message' => 'Reservation created successfully.',
    ], 201);
}

if ($method === 'PUT') {
    $payload = request_payload();
    $id = input_id($payload);

    if (!$id) {
        json_response([
            'success' => false,
            'message' => 'Reservation id is required.',
        ], 422);
    }

    $existing = reservation_row($pdo, $restaurantId, $id);

    if ($existing === null) {
        json_response([
            'success' => false,
            'message' => 'Reservation not found.',
        ], 404);
    }

    $input = reservation_payload($payload);

    if (!array_key_exists('status', $payload)) {
        json_response([
            'success' => false,
            'message' => 'Reservation status is required.',
        ], 422);
    }

    $statement = $pdo->prepare(
        'UPDATE reservations
         SET status = :status,
             updated_at = NOW()
         WHERE id = :id
           AND restaurant_id = :restaurant_id'
    );
    $statement->execute([
        'status' => $input['status'],
        'id' => $id,
        'restaurant_id' => $restaurantId,
    ]);

    json_response([
        'success' => true,
        'data' => reservation_row($pdo, $restaurantId, $id),
        'message' => 'Reservation status updated successfully.',
    ]);
}

json_response([
    'success' => false,
    'message' => 'Method not allowed.',
], 405);
