<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/_response.php';
require_once __DIR__ . '/_tenant.php';

function request_payload(): array
{
    $raw = file_get_contents('php://input');
    $contentType = strtolower((string) request_header_value('Content-Type'));
    $expectsJson = $contentType !== '' && str_contains($contentType, 'application/json');
    $isJsonLike = $contentType !== '' && (str_contains($contentType, '/json') || str_contains($contentType, '+json'));

    if ($raw === false || trim($raw) === '') {
        return $_POST;
    }

    $decoded = json_decode($raw, true);
    if (is_array($decoded)) {
        return $decoded;
    }

    if ($expectsJson || $isJsonLike) {
        json_response([
            'success' => false,
            'message' => 'Invalid JSON body.',
        ], 400);
    }

    parse_str($raw, $parsed);
    return is_array($parsed) ? $parsed : [];
}

function request_header_value(string $headerName): ?string
{
    $normalized = strtoupper(str_replace('-', '_', $headerName));
    $serverKey = 'HTTP_' . $normalized;

    if (isset($_SERVER[$serverKey])) {
        return trim((string) $_SERVER[$serverKey]);
    }

    if (!function_exists('getallheaders')) {
        return null;
    }

    foreach (getallheaders() as $name => $value) {
        if (strcasecmp($name, $headerName) === 0) {
            return trim((string) $value);
        }
    }

    return null;
}

function require_connection(): PDO
{
    $pdo = db();
    if (!$pdo instanceof PDO) {
        json_response([
            'success' => false,
            'message' => 'Database connection is not available yet.'
        ], 503);
    }

    return $pdo;
}

function api_write_enabled(): bool
{
    return true;
}

function api_require_write_enabled(string $method): void
{
    // Legacy compatibility hook. Authentication is enforced directly in each endpoint now.
}

function require_admin_write_access(): void
{
    $pdo = require_connection();
    auth_require_login($pdo);
}

function require_admin_read_access(): void
{
    $pdo = require_connection();
    auth_require_login($pdo);
}

function strict_positive_int(mixed $value): ?int
{
    if ($value === null || $value === '') {
        return null;
    }

    if (is_int($value)) {
        return $value >= 1 ? $value : null;
    }

    if (is_string($value) && preg_match('/^[+-]?\d+$/', trim($value))) {
        $intValue = (int) trim($value);
        return $intValue >= 1 ? $intValue : null;
    }

    return null;
}

function input_id(array $payload = []): ?int
{
    if (array_key_exists('id', $payload)) {
        return strict_positive_int($payload['id']);
    }

    if (array_key_exists('id', $_GET)) {
        return strict_positive_int($_GET['id']);
    }

    return null;
}

function bool_int($value): int
{
    $error = null;
    $parsed = parse_request_bool($value, $error);
    return $parsed ?? 0;
}

function parse_request_bool(mixed $value, ?string &$error = null): ?int
{
    $error = null;

    if (is_bool($value)) {
        return $value ? 1 : 0;
    }

    if (is_int($value)) {
        if ($value === 1 || $value === 0) {
            return $value;
        }

        $error = 'Invalid boolean value.';
        return null;
    }

    $normalized = strtolower(trim((string) $value));
    if ($normalized === '') {
        $error = 'Invalid boolean value.';
        return null;
    }

    if (in_array($normalized, ['1', 'true', 'yes', 'on'], true)) {
        return 1;
    }

    if (in_array($normalized, ['0', 'false', 'no', 'off'], true)) {
        return 0;
    }

    $error = 'Invalid boolean value.';
    return null;
}

function status_or_default($value, string $default, array $allowed): string
{
    $normalized = strtolower(trim((string) $value));
    return in_array($normalized, $allowed, true) ? $normalized : $default;
}

function query_bool_param(string $key, ?string &$error = null): ?int
{
    $error = null;

    if (!array_key_exists($key, $_GET)) {
        return null;
    }

    $value = trim((string) $_GET[$key]);

    if ($value === '') {
        $error = 'Invalid boolean value.';
        return null;
    }

    $normalized = strtolower($value);
    if (in_array($normalized, ['1', 'true', 'yes', 'on'], true)) {
        return 1;
    }

    if (in_array($normalized, ['0', 'false', 'no', 'off'], true)) {
        return 0;
    }

    $error = 'Invalid boolean value.';
    return null;
}

function is_duplicate_key_error(Throwable $throwable): bool
{
    return (int) $throwable->getCode() === 23000
        || str_contains($throwable->getMessage(), 'Duplicate entry');
}

require_once __DIR__ . '/../helpers/restaurant_context.php';
require_once __DIR__ . '/../helpers/auth.php';
