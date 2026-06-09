<?php
declare(strict_types=1);

require_once __DIR__ . '/_helpers.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    $pdo = require_connection();

    $statement = $pdo->prepare(
        'SELECT id, name, slug, business_type
         FROM restaurants
         WHERE status = "active"
         ORDER BY name ASC, created_at DESC'
    );
    $statement->execute();

    json_response([
        'success' => true,
        'data' => $statement->fetchAll(),
    ]);
}

json_response([
    'success' => false,
    'message' => 'Method not allowed.',
], 405);
