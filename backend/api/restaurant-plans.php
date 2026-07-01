<?php
declare(strict_types=1);

require_once __DIR__ . '/_helpers.php';

function restaurant_plan_management_find_restaurant(PDO $pdo, int|string $identifier): ?array
{
    if (is_int($identifier) || (is_string($identifier) && preg_match('/^[1-9]\d*$/', $identifier))) {
        $statement = $pdo->prepare(
            'SELECT id, name, slug, business_type, owner_name, owner_email, owner_user_id, status, subscription_status, created_at, updated_at
             FROM restaurants
             WHERE id = :id
             LIMIT 1'
        );
        $statement->execute(['id' => (int) $identifier]);

        $row = $statement->fetch();
        return $row ?: null;
    }

    $slug = strtolower(trim((string) $identifier));
    if ($slug === '' || !tenant_slug_is_valid($slug)) {
        return null;
    }

    $statement = $pdo->prepare(
        'SELECT id, name, slug, business_type, owner_name, owner_email, owner_user_id, status, subscription_status, created_at, updated_at
         FROM restaurants
         WHERE slug = :slug
         LIMIT 1'
    );
    $statement->execute(['slug' => $slug]);

    $row = $statement->fetch();
    return $row ?: null;
}

function restaurant_plan_management_format_restaurant(array $restaurant): array
{
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
        'subscription_status' => (string) ($restaurant['subscription_status'] ?? 'trial'),
        'created_at' => $restaurant['created_at'] ?? null,
        'updated_at' => $restaurant['updated_at'] ?? null,
    ];
}

function restaurant_plan_management_format_assignment(array $restaurant, ?array $subscription = null, ?array $plan = null): array
{
    $planData = $plan ?? getRestaurantPlan((int) $restaurant['id']);

    return [
        'restaurant' => restaurant_plan_management_format_restaurant($restaurant),
        'subscription' => $subscription !== null ? [
            'id' => (int) $subscription['id'],
            'status' => (string) $subscription['status'],
            'starts_at' => $subscription['starts_at'] ?? null,
            'ends_at' => $subscription['ends_at'] ?? null,
            'trial_ends_at' => $subscription['trial_ends_at'] ?? null,
        ] : null,
        'plan' => $planData,
    ];
}

$method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
$pdo = require_connection();
auth_require_super_admin($pdo);

if ($method === 'GET') {
    $identifier = strict_positive_int(
        $_GET['restaurant_id']
        ?? $_GET['tenant_id']
        ?? $_GET['id']
        ?? null
    );

    if ($identifier === null) {
        $slug = tenant_canonical_slug((string) ($_GET['restaurant_slug'] ?? $_GET['slug'] ?? $_GET['tenant'] ?? $_GET['restaurant'] ?? ''));
        if ($slug !== '' && restaurant_slug_is_valid($slug)) {
            $restaurant = restaurant_plan_management_find_restaurant($pdo, $slug);
        } else {
            $restaurant = null;
        }
    } else {
        $restaurant = restaurant_plan_management_find_restaurant($pdo, $identifier);
    }

    $plans = feature_gate_list_plans($pdo);

    if ($restaurant !== null) {
        $subscription = feature_gate_subscription_row($pdo, (int) $restaurant['id']);
        $plan = getRestaurantPlan((int) $restaurant['id']);

        json_response([
            'success' => true,
            'data' => [
                'restaurant' => restaurant_plan_management_format_restaurant($restaurant),
                'subscription' => $subscription,
                'plan' => $plan,
                'plans' => $plans,
            ],
        ]);
    }

    $statement = $pdo->query(
        'SELECT
            r.id,
            r.name,
            r.slug,
            r.business_type,
            r.owner_name,
            r.owner_email,
            r.owner_user_id,
            r.status,
            r.subscription_status,
            r.created_at,
            r.updated_at,
            rs.id AS subscription_id,
            rs.plan_id,
            rs.status AS subscription_state,
            rs.starts_at,
            rs.ends_at,
            rs.trial_ends_at,
            p.name AS plan_name,
            p.slug AS plan_slug,
            p.description AS plan_description,
            p.price_monthly AS plan_price_monthly,
            p.price_yearly AS plan_price_yearly,
            p.status AS plan_status,
            p.sort_order AS plan_sort_order
         FROM restaurants r
         LEFT JOIN restaurant_subscriptions rs
            ON rs.restaurant_id = r.id
         LEFT JOIN plans p
            ON p.id = rs.plan_id
         ORDER BY (r.status = "active") DESC, r.name ASC, r.created_at DESC'
    );

    $assignments = array_map(static function (array $row) use ($pdo): array {
        $restaurant = restaurant_plan_management_format_restaurant($row);
        $subscription = null;
        $plan = null;

        if (($row['subscription_id'] ?? null) !== null) {
            $subscription = [
                'id' => (int) $row['subscription_id'],
                'status' => (string) ($row['subscription_state'] ?? 'active'),
                'starts_at' => $row['starts_at'] ?? null,
                'ends_at' => $row['ends_at'] ?? null,
                'trial_ends_at' => $row['trial_ends_at'] ?? null,
            ];
        }

        if (($row['plan_id'] ?? null) !== null) {
            $plan = feature_gate_plan_summary(
                $pdo,
                [
                    'id' => (int) $row['plan_id'],
                    'name' => (string) ($row['plan_name'] ?? ''),
                    'slug' => (string) ($row['plan_slug'] ?? ''),
                    'description' => (string) ($row['plan_description'] ?? ''),
                    'price_monthly' => $row['plan_price_monthly'] ?? 0,
                    'price_yearly' => $row['plan_price_yearly'] ?? 0,
                    'status' => (string) ($row['plan_status'] ?? 'active'),
                    'sort_order' => (int) ($row['plan_sort_order'] ?? 0),
                ],
                feature_gate_plan_feature_rows($pdo, (int) $row['plan_id'])
            );
        }

        return [
            'restaurant' => $restaurant,
            'subscription' => $subscription,
            'plan' => $plan,
        ];
    }, $statement->fetchAll());

    json_response([
        'success' => true,
        'data' => [
            'plans' => $plans,
            'assignments' => $assignments,
        ],
    ]);
}

if (!in_array($method, ['POST', 'PATCH'], true)) {
    json_response([
        'success' => false,
        'message' => 'Method not allowed.',
    ], 405);
}

$payload = request_payload();
$restaurantId = strict_positive_int(
    $payload['restaurant_id']
    ?? $payload['tenant_id']
    ?? $payload['id']
    ?? null
);

if ($restaurantId === null) {
    $restaurantSlug = tenant_canonical_slug((string) ($payload['restaurant_slug'] ?? $payload['slug'] ?? $payload['tenant'] ?? $payload['restaurant'] ?? ''));
    if ($restaurantSlug === '' || !restaurant_slug_is_valid($restaurantSlug)) {
        json_response([
            'success' => false,
            'message' => 'A valid restaurant identifier is required.',
        ], 422);
    }

    $restaurant = restaurant_plan_management_find_restaurant($pdo, $restaurantSlug);
} else {
    $restaurant = restaurant_plan_management_find_restaurant($pdo, $restaurantId);
}

if ($restaurant === null) {
    json_response([
        'success' => false,
        'message' => 'Restaurant not found.',
    ], 404);
}

$planId = strict_positive_int(
    $payload['plan_id']
    ?? $payload['subscription_plan_id']
    ?? $payload['id_plan']
    ?? null
);

if ($planId === null) {
    $planSlug = strtolower(trim((string) ($payload['plan_slug'] ?? $payload['plan'] ?? '')));
    if ($planSlug === '' || !preg_match('/^[a-z0-9]+(?:-[a-z0-9]+)*$/', $planSlug)) {
        json_response([
            'success' => false,
            'message' => 'A valid plan identifier is required.',
        ], 422);
    }

    $planRow = feature_gate_plan_row_by_slug($pdo, $planSlug);
} else {
    $planRow = feature_gate_plan_row_by_id($pdo, $planId);
}

if ($planRow === null) {
    json_response([
        'success' => false,
        'message' => 'Plan not found.',
    ], 404);
}

if (strtolower((string) ($planRow['status'] ?? 'inactive')) !== 'active') {
    json_response([
        'success' => false,
        'message' => 'Plan is not active.',
    ], 422);
}

$subscription = feature_gate_upsert_restaurant_subscription($pdo, (int) $restaurant['id'], (int) $planRow['id'], 'active');

if ($subscription === null) {
    json_response([
        'success' => false,
        'message' => 'Unable to save plan assignment.',
    ], 500);
}

json_response([
    'success' => true,
    'message' => 'Plan assigned successfully.',
    'data' => [
        'restaurant' => restaurant_plan_management_format_restaurant($restaurant),
        'subscription' => $subscription,
        'plan' => getRestaurantPlan((int) $restaurant['id']),
    ],
]);
