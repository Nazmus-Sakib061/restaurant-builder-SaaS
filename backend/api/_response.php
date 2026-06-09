<?php
declare(strict_types=1);

if (!defined('RESTAURANT_BUILDER_DEBUG')) {
    define('RESTAURANT_BUILDER_DEBUG', false);
}

function json_emit(array $payload, int $statusCode = 200): void
{
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(
        $payload,
        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_INVALID_UTF8_SUBSTITUTE
    );
    exit;
}

function json_success(mixed $data = [], string $message = 'Success', int $statusCode = 200): void
{
    json_emit([
        'success' => true,
        'message' => $message,
        'data' => $data,
    ], $statusCode);
}

function json_error(string $message = 'Something went wrong', int $statusCode = 400, mixed $debug = null): void
{
    $payload = [
        'success' => false,
        'message' => $message,
    ];

    if (RESTAURANT_BUILDER_DEBUG && $debug !== null) {
        $payload['debug'] = $debug;
    }

    json_emit($payload, $statusCode);
}

function json_response(array $payload, int $statusCode = 200): void
{
    if (array_key_exists('success', $payload) && !array_key_exists('message', $payload)) {
        $payload['message'] = $payload['success'] ? 'Success' : 'Something went wrong';
    }

    json_emit($payload, $statusCode);
}
