<?php
declare(strict_types=1);

require_once __DIR__ . '/_helpers.php';

$method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');

if ($method !== 'GET') {
    json_response([
        'success' => false,
        'message' => 'Method not allowed.',
    ], 405);
}

$pdo = require_connection();

json_response([
    'success' => true,
    'data' => auth_current_user_payload($pdo),
]);
