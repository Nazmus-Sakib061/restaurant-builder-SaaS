<?php
declare(strict_types=1);

require_once __DIR__ . '/_helpers.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    $pdo = require_connection();
    $user = auth_require_login($pdo);

    $restaurants = auth_user_restaurants($pdo, $user);

    json_response([
        'success' => true,
        'data' => $restaurants,
    ]);
}

json_response([
    'success' => false,
    'message' => 'Method not allowed.',
], 405);
