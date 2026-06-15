<?php
declare(strict_types=1);

require_once __DIR__ . '/_helpers.php';

$method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
$pdo = require_connection();

if ($method === 'GET') {
    json_response([
        'success' => true,
        'data' => auth_current_user_payload($pdo),
    ]);
}

$payload = request_payload();
$action = strtolower(trim((string) ($payload['action'] ?? ($_GET['action'] ?? ''))));

if ($method === 'DELETE' || $action === 'logout') {
    auth_logout();

    json_response([
        'success' => true,
        'message' => 'Logged out successfully.',
        'data' => [
            'logged_out' => true,
        ],
    ]);
}

if ($method !== 'POST') {
    json_response([
        'success' => false,
        'message' => 'Method not allowed.',
    ], 405);
}

$email = strtolower(trim((string) ($payload['email'] ?? $payload['username'] ?? '')));
$password = (string) ($payload['password'] ?? '');
$errors = [];

if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'Enter a valid email address.';
}

if ($password === '') {
    $errors['password'] = 'Password is required.';
}

if (!empty($errors)) {
    json_response([
        'success' => false,
        'message' => 'Validation error.',
        'errors' => $errors,
    ], 422);
}

$attempt = auth_attempt_login($pdo, $email, $password);

if (empty($attempt['success'])) {
    json_response([
        'success' => false,
        'message' => (string) ($attempt['message'] ?? 'Invalid credentials.'),
        'errors' => $attempt['errors'] ?? null,
    ], (int) ($attempt['status'] ?? 422));
}

json_response([
    'success' => true,
    'message' => 'Login successful.',
    'data' => auth_current_user_payload($pdo),
]);
