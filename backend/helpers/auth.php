<?php
declare(strict_types=1);

const AUTH_SESSION_NAME = 'restaurant_builder_session';

function auth_session_boot(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    session_name(AUTH_SESSION_NAME);

    $cookieParams = session_get_cookie_params();
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => $cookieParams['path'] ?? '/',
        'domain' => $cookieParams['domain'] ?? '',
        'secure' => !empty($_SERVER['HTTPS']) && strtolower((string) $_SERVER['HTTPS']) !== 'off',
        'httponly' => true,
        'samesite' => 'Lax',
    ]);

    session_start();
}

function auth_session_user_id(): ?int
{
    auth_session_boot();

    return strict_positive_int($_SESSION['auth_user']['id'] ?? null);
}

function auth_store_user_session(array $user): void
{
    auth_session_boot();
    session_regenerate_id(true);
    $_SESSION['auth_user'] = [
        'id' => (int) ($user['id'] ?? 0),
    ];
}

function auth_clear_session(): void
{
    auth_session_boot();

    $_SESSION = [];

    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', [
            'expires' => time() - 3600,
            'path' => $params['path'] ?? '/',
            'domain' => $params['domain'] ?? '',
            'secure' => !empty($_SERVER['HTTPS']) && strtolower((string) $_SERVER['HTTPS']) !== 'off',
            'httponly' => true,
            'samesite' => 'Lax',
        ]);
    }

    session_destroy();
}

function auth_active_restaurant_id(): ?int
{
    auth_session_boot();

    return strict_positive_int($_SESSION['auth_user']['active_restaurant_id'] ?? null);
}

function auth_store_active_restaurant_id(?int $restaurantId): void
{
    auth_session_boot();

    if ($restaurantId === null) {
        unset($_SESSION['auth_user']['active_restaurant_id']);
        return;
    }

    $_SESSION['auth_user']['active_restaurant_id'] = $restaurantId;
}

function auth_normalize_role_value(?string $role): string
{
    $normalized = strtolower(trim((string) $role));

    if (in_array($normalized, ['manager', 'staff'], true)) {
        return 'restaurant_staff';
    }

    if ($normalized === 'owner') {
        return 'restaurant_owner';
    }

    if ($normalized === 'admin') {
        return 'super_admin';
    }

    if (in_array($normalized, ['super_admin', 'restaurant_owner', 'restaurant_staff'], true)) {
        return $normalized;
    }

    return $normalized !== '' ? $normalized : 'restaurant_owner';
}

function auth_role_profile(?string $role): array
{
    $rawRole = strtolower(trim((string) $role));
    $normalizedRole = auth_normalize_role_value($rawRole);

    return [
        'role' => $rawRole !== '' ? $rawRole : $normalizedRole,
        'normalized_role' => $normalizedRole,
        'is_super_admin' => $normalizedRole === 'super_admin',
        'is_restaurant_owner' => $normalizedRole === 'restaurant_owner',
        'is_restaurant_staff' => $normalizedRole === 'restaurant_staff',
    ];
}

function auth_role_is_super_admin(?string $role): bool
{
    return auth_role_profile($role)['is_super_admin'];
}

function auth_role_is_restaurant_owner(?string $role): bool
{
    return auth_role_profile($role)['is_restaurant_owner'];
}

function auth_role_is_restaurant_staff(?string $role): bool
{
    return auth_role_profile($role)['is_restaurant_staff'];
}

function auth_normalize_user_row(array $row): array
{
    return [
        'id' => (int) ($row['id'] ?? 0),
        'name' => (string) ($row['name'] ?? ''),
        'email' => (string) ($row['email'] ?? ''),
        'role' => auth_normalize_role_value($row['role'] ?? 'restaurant_owner'),
        'status' => (string) ($row['status'] ?? 'active'),
        'created_at' => $row['created_at'] ?? null,
        'updated_at' => $row['updated_at'] ?? null,
    ];
}

function auth_user_row_by_id(PDO $pdo, int $userId): ?array
{
    $statement = $pdo->prepare(
        'SELECT id, name, email, password_hash, role, status, created_at, updated_at
         FROM users
         WHERE id = :id
         LIMIT 1'
    );
    $statement->execute(['id' => $userId]);

    $row = $statement->fetch();

    return $row ?: null;
}

function auth_current_user(PDO $pdo): ?array
{
    $userId = auth_session_user_id();

    if ($userId === null) {
        return null;
    }

    $row = auth_user_row_by_id($pdo, $userId);

    if (!$row || strtolower((string) ($row['status'] ?? 'inactive')) !== 'active') {
        auth_clear_session();
        return null;
    }

    return auth_normalize_user_row($row);
}

function auth_require_login(PDO $pdo): array
{
    $user = auth_current_user($pdo);

    if ($user === null) {
        json_response([
            'success' => false,
            'message' => 'Authentication required.',
        ], 401);
    }

    return $user;
}

function auth_require_super_admin(PDO $pdo): array
{
    $user = auth_require_login($pdo);

    if (!auth_role_is_super_admin($user['role'] ?? null)) {
        json_response([
            'success' => false,
            'message' => 'Forbidden.',
        ], 403);
    }

    return $user;
}

function auth_attempt_login(PDO $pdo, string $email, string $password): array
{
    $normalizedEmail = strtolower(trim($email));
    $password = (string) $password;

    $statement = $pdo->prepare(
        'SELECT id, name, email, password_hash, role, status, created_at, updated_at
         FROM users
         WHERE email = :email
         LIMIT 1'
    );
    $statement->execute(['email' => $normalizedEmail]);

    $user = $statement->fetch();

    if (!$user || !password_verify($password, (string) ($user['password_hash'] ?? ''))) {
        return [
            'success' => false,
            'status' => 422,
            'message' => 'Invalid email or password.',
            'errors' => [
                'email' => 'Invalid email or password.',
            ],
        ];
    }

    $status = strtolower((string) ($user['status'] ?? 'inactive'));
    if ($status !== 'active') {
        return [
            'success' => false,
            'status' => 403,
            'message' => 'This account is inactive or blocked.',
            'errors' => [
                'email' => 'This account is inactive or blocked.',
            ],
        ];
    }

    auth_store_user_session($user);

    return [
        'success' => true,
        'user' => auth_normalize_user_row($user),
    ];
}

function auth_user_row_by_email(PDO $pdo, string $email): ?array
{
    $statement = $pdo->prepare(
        'SELECT id, name, email, password_hash, role, status, created_at, updated_at
         FROM users
         WHERE email = :email
         LIMIT 1'
    );
    $statement->execute(['email' => strtolower(trim($email))]);

    $row = $statement->fetch();

    return $row ?: null;
}

function auth_logout(): void
{
    auth_clear_session();
}

function auth_user_restaurants(PDO $pdo, array $user): array
{
    $userId = (int) ($user['id'] ?? 0);
    if ($userId < 1) {
        return [];
    }

    if (auth_role_is_super_admin($user['role'] ?? null)) {
        $statement = $pdo->prepare(
            'SELECT
                id,
                name,
                slug,
                business_type,
                owner_name,
                owner_email,
                owner_user_id,
                status,
                created_at,
                updated_at
             FROM restaurants
             ORDER BY (status = "active") DESC, name ASC, created_at DESC'
        );
        $statement->execute();

        return array_map(static function (array $restaurant): array {
            return [
                'id' => (int) $restaurant['id'],
                'name' => (string) $restaurant['name'],
                'slug' => (string) $restaurant['slug'],
                'business_type' => (string) $restaurant['business_type'],
                'owner_name' => (string) ($restaurant['owner_name'] ?? ''),
                'owner_email' => (string) ($restaurant['owner_email'] ?? ''),
                'owner_user_id' => isset($restaurant['owner_user_id']) && $restaurant['owner_user_id'] !== null
                    ? (int) $restaurant['owner_user_id']
                    : null,
                'status' => (string) $restaurant['status'],
                'created_at' => $restaurant['created_at'] ?? null,
                'updated_at' => $restaurant['updated_at'] ?? null,
                'access_role' => 'super_admin',
            ];
        }, $statement->fetchAll());
    }

    $statement = $pdo->prepare(
        'SELECT
            r.id,
            r.name,
            r.slug,
            r.business_type,
            r.owner_name,
            r.owner_email,
            r.owner_user_id,
            r.status,
            r.created_at,
            r.updated_at,
            COALESCE(ru.role, CASE WHEN r.owner_user_id = :owner_case_user_id THEN "restaurant_owner" END) AS access_role
         FROM restaurants r
         LEFT JOIN restaurant_users ru
            ON ru.restaurant_id = r.id
           AND ru.user_id = :join_user_id
         WHERE r.status = "active"
           AND (
                r.owner_user_id = :owner_where_user_id
                OR ru.id IS NOT NULL
           )
         ORDER BY r.name ASC, r.created_at DESC'
    );
    $statement->execute([
        'join_user_id' => $userId,
        'owner_case_user_id' => $userId,
        'owner_where_user_id' => $userId,
    ]);

    return array_map(static function (array $restaurant): array {
        return [
            'id' => (int) $restaurant['id'],
            'name' => (string) $restaurant['name'],
            'slug' => (string) $restaurant['slug'],
            'business_type' => (string) $restaurant['business_type'],
            'owner_name' => (string) ($restaurant['owner_name'] ?? ''),
            'owner_email' => (string) ($restaurant['owner_email'] ?? ''),
            'owner_user_id' => isset($restaurant['owner_user_id']) && $restaurant['owner_user_id'] !== null
                ? (int) $restaurant['owner_user_id']
                : null,
            'status' => (string) $restaurant['status'],
            'created_at' => $restaurant['created_at'] ?? null,
            'updated_at' => $restaurant['updated_at'] ?? null,
            'access_role' => auth_normalize_role_value($restaurant['access_role'] ?? 'restaurant_owner'),
        ];
    }, $statement->fetchAll());
}

function auth_user_can_access_restaurant(PDO $pdo, array $user, int $restaurantId): bool
{
    if (auth_role_is_super_admin($user['role'] ?? null)) {
        return true;
    }

    $statement = $pdo->prepare(
        'SELECT 1
         FROM restaurants r
         LEFT JOIN restaurant_users ru
            ON ru.restaurant_id = r.id
           AND ru.user_id = :join_user_id
         WHERE r.id = :restaurant_id
           AND r.status = "active"
           AND (
                r.owner_user_id = :owner_where_user_id
                OR ru.id IS NOT NULL
           )
         LIMIT 1'
    );
    $statement->execute([
        'join_user_id' => (int) ($user['id'] ?? 0),
        'owner_where_user_id' => (int) ($user['id'] ?? 0),
        'restaurant_id' => $restaurantId,
    ]);

    return (bool) $statement->fetchColumn();
}

function auth_load_active_restaurant(PDO $pdo, int $restaurantId): ?array
{
    $statement = $pdo->prepare(
        'SELECT id, name, slug, business_type, owner_name, owner_email, owner_user_id, status, created_at, updated_at
         FROM restaurants
         WHERE id = :id
           AND status = "active"
         LIMIT 1'
    );
    $statement->execute(['id' => $restaurantId]);

    $restaurant = $statement->fetch();

    return $restaurant ?: null;
}

function auth_load_active_restaurant_by_slug(PDO $pdo, string $slug): ?array
{
    $statement = $pdo->prepare(
        'SELECT id, name, slug, business_type, owner_name, owner_email, owner_user_id, status, created_at, updated_at
         FROM restaurants
         WHERE slug = :slug
           AND status = "active"
         LIMIT 1'
    );
    $statement->execute(['slug' => $slug]);

    $restaurant = $statement->fetch();

    return $restaurant ?: null;
}

function auth_selected_restaurant_identifier(): array
{
    $restaurantId = strict_positive_int(
        $_GET['restaurant_id']
        ?? $_POST['restaurant_id']
        ?? $_GET['tenant_id']
        ?? $_POST['tenant_id']
        ?? null
    );
    $restaurantSlug = null;

    if (
        array_key_exists('tenant', $_GET)
        || array_key_exists('tenant', $_POST)
        || array_key_exists('restaurant', $_GET)
        || array_key_exists('restaurant', $_POST)
    ) {
        $restaurantSlug = restaurant_requested_slug();
    }

    return [
        'restaurant_id' => $restaurantId,
        'restaurant_slug' => $restaurantSlug,
        'explicit' => $restaurantId !== null || $restaurantSlug !== null,
    ];
}

function auth_format_restaurant_context(array $restaurant): array
{
    return [
        'restaurant_id' => (int) $restaurant['id'],
        'id' => (int) $restaurant['id'],
        'name' => (string) $restaurant['name'],
        'slug' => (string) $restaurant['slug'],
        'business_type' => (string) $restaurant['business_type'],
        'owner_name' => isset($restaurant['owner_name']) && $restaurant['owner_name'] !== null
            ? (string) $restaurant['owner_name']
            : null,
        'owner_email' => isset($restaurant['owner_email']) && $restaurant['owner_email'] !== null
            ? (string) $restaurant['owner_email']
            : null,
        'owner_user_id' => isset($restaurant['owner_user_id']) && $restaurant['owner_user_id'] !== null
            ? (int) $restaurant['owner_user_id']
            : null,
        'status' => (string) $restaurant['status'],
        'created_at' => $restaurant['created_at'] ?? null,
        'updated_at' => $restaurant['updated_at'] ?? null,
    ];
}

function auth_default_visible_restaurant(PDO $pdo, array $user): ?array
{
    $restaurants = auth_user_restaurants($pdo, $user);
    if ($restaurants === []) {
        return null;
    }

    foreach ($restaurants as $restaurant) {
        if (strtolower((string) ($restaurant['status'] ?? '')) !== 'active') {
            continue;
        }

        $resolved = auth_load_active_restaurant($pdo, (int) $restaurant['id']);
        if ($resolved !== null) {
            return $resolved;
        }
    }

    return null;
}

function auth_admin_restaurant_context(PDO $pdo): array
{
    $user = auth_require_login($pdo);
    $identifier = auth_selected_restaurant_identifier();
    $restaurant = null;

    if ($identifier['restaurant_id'] !== null) {
        $restaurant = auth_load_active_restaurant($pdo, (int) $identifier['restaurant_id']);
    } elseif ($identifier['restaurant_slug'] !== null) {
        if (!restaurant_slug_is_valid((string) $identifier['restaurant_slug'])) {
            json_response([
                'success' => false,
                'message' => 'Invalid restaurant slug.',
            ], 400);
        }

        $restaurant = auth_load_active_restaurant_by_slug($pdo, (string) $identifier['restaurant_slug']);
    } else {
        $activeRestaurantId = auth_active_restaurant_id();

        if ($activeRestaurantId !== null) {
            $activeRestaurant = auth_load_active_restaurant($pdo, $activeRestaurantId);
            if ($activeRestaurant !== null && auth_user_can_access_restaurant($pdo, $user, $activeRestaurantId)) {
                $restaurant = $activeRestaurant;
            }
        }

        if ($restaurant === null) {
            $restaurant = auth_default_visible_restaurant($pdo, $user);
        }
    }

    if (!$restaurant) {
        json_response([
            'success' => false,
            'message' => $identifier['explicit'] ? 'Restaurant not found.' : 'No restaurant is assigned to this account.',
        ], $identifier['explicit'] ? 404 : 403);
    }

    if (!auth_user_can_access_restaurant($pdo, $user, (int) $restaurant['id'])) {
        json_response([
            'success' => false,
            'message' => 'Forbidden.',
        ], 403);
    }

    auth_store_active_restaurant_id((int) $restaurant['id']);

    return auth_format_restaurant_context($restaurant);
}

function auth_current_user_payload(PDO $pdo): array
{
    $user = auth_require_login($pdo);
    $rawUserRow = auth_user_row_by_id($pdo, (int) $user['id']);
    $activeRestaurantId = auth_active_restaurant_id();
    $roleProfile = auth_role_profile((string) ($rawUserRow['role'] ?? $user['role'] ?? ''));
    $activeRestaurant = null;
    if ($activeRestaurantId !== null && auth_user_can_access_restaurant($pdo, $user, $activeRestaurantId)) {
        $activeRestaurantRow = auth_load_active_restaurant($pdo, $activeRestaurantId);
        if ($activeRestaurantRow !== null) {
            $activeRestaurant = [
                'id' => (int) $activeRestaurantRow['id'],
                'name' => (string) $activeRestaurantRow['name'],
                'slug' => (string) $activeRestaurantRow['slug'],
                'status' => (string) $activeRestaurantRow['status'],
            ];
        }
    }

    return [
        'user' => [
            'id' => (int) ($rawUserRow['id'] ?? $user['id'] ?? 0),
            'email' => (string) ($rawUserRow['email'] ?? $user['email'] ?? ''),
            'name' => (string) ($rawUserRow['name'] ?? $user['name'] ?? ''),
            'role' => (string) $roleProfile['role'],
            'normalized_role' => (string) $roleProfile['normalized_role'],
            'is_super_admin' => (bool) $roleProfile['is_super_admin'],
            'is_restaurant_owner' => (bool) $roleProfile['is_restaurant_owner'],
            'is_restaurant_staff' => (bool) $roleProfile['is_restaurant_staff'],
        ],
        'active_restaurant' => $activeRestaurant,
        'restaurants' => auth_user_restaurants($pdo, $user),
        'session' => [
            'active_restaurant_id' => $activeRestaurantId,
        ],
        'active_restaurant_id' => $activeRestaurantId,
    ];
}
