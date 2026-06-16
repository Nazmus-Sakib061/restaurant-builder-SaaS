<?php
declare(strict_types=1);

$rootConfig = __DIR__ . '/../../config.php';
if (is_file($rootConfig)) {
    require_once $rootConfig;
}

if (!defined('DB_HOST')) {
    define('DB_HOST', '127.0.0.1');
}

if (!defined('DB_NAME')) {
    define('DB_NAME', 'restaurant_builder_db');
}

if (!defined('DB_USER')) {
    define('DB_USER', 'root');
}

if (!defined('DB_PASS')) {
    define('DB_PASS', '');
}

if (!defined('DB_CHARSET')) {
    define('DB_CHARSET', 'utf8mb4');
}

function db(): ?PDO
{
    static $pdo = null;
    static $attempted = false;

    if ($attempted) {
        return $pdo;
    }

    $attempted = true;

    $dsn = sprintf(
        'mysql:host=%s;dbname=%s;charset=%s',
        DB_HOST,
        DB_NAME,
        DB_CHARSET
    );

    try {
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
    } catch (Throwable $e) {
        $pdo = null;
    }

    return $pdo;
}
