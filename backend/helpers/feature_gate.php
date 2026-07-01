<?php
declare(strict_types=1);

function feature_gate_default_assignment_plan_slug(): string
{
    return defined('FEATURE_GATE_DEFAULT_ASSIGNMENT_PLAN_SLUG')
        ? strtolower(trim((string) FEATURE_GATE_DEFAULT_ASSIGNMENT_PLAN_SLUG))
        : 'premium';
}

function feature_gate_fallback_plan_slug(): string
{
    return defined('FEATURE_GATE_FALLBACK_PLAN_SLUG')
        ? strtolower(trim((string) FEATURE_GATE_FALLBACK_PLAN_SLUG))
        : 'free';
}

function feature_gate_plan_definitions(): array
{
    return [
        'free' => [
            'name' => 'Free',
            'description' => 'Starter plan for basic content management.',
            'price_monthly' => 0.00,
            'price_yearly' => 0.00,
            'sort_order' => 10,
            'features' => [
                'categories' => ['is_enabled' => 1, 'limit_value' => null],
                'menu_items' => ['is_enabled' => 1, 'limit_value' => 12],
                'orders' => ['is_enabled' => 1, 'limit_value' => null],
                'payments' => ['is_enabled' => 0, 'limit_value' => null],
                'gallery' => ['is_enabled' => 0, 'limit_value' => null],
                'deals' => ['is_enabled' => 0, 'limit_value' => null],
                'statistics' => ['is_enabled' => 0, 'limit_value' => null],
                'exports' => ['is_enabled' => 0, 'limit_value' => null],
                'staff_management' => ['is_enabled' => 0, 'limit_value' => null],
                'branding' => ['is_enabled' => 0, 'limit_value' => null],
                'custom_domain' => ['is_enabled' => 0, 'limit_value' => null],
            ],
        ],
        'basic' => [
            'name' => 'Basic',
            'description' => 'For restaurants that need payments and gallery support.',
            'price_monthly' => 29.00,
            'price_yearly' => 290.00,
            'sort_order' => 20,
            'features' => [
                'categories' => ['is_enabled' => 1, 'limit_value' => null],
                'menu_items' => ['is_enabled' => 1, 'limit_value' => null],
                'orders' => ['is_enabled' => 1, 'limit_value' => null],
                'payments' => ['is_enabled' => 1, 'limit_value' => null],
                'gallery' => ['is_enabled' => 1, 'limit_value' => null],
                'deals' => ['is_enabled' => 0, 'limit_value' => null],
                'statistics' => ['is_enabled' => 0, 'limit_value' => null],
                'exports' => ['is_enabled' => 0, 'limit_value' => null],
                'staff_management' => ['is_enabled' => 0, 'limit_value' => null],
                'branding' => ['is_enabled' => 1, 'limit_value' => null],
                'custom_domain' => ['is_enabled' => 0, 'limit_value' => null],
            ],
        ],
        'pro' => [
            'name' => 'Pro',
            'description' => 'For growing restaurants that need deeper operations.',
            'price_monthly' => 59.00,
            'price_yearly' => 590.00,
            'sort_order' => 30,
            'features' => [
                'categories' => ['is_enabled' => 1, 'limit_value' => null],
                'menu_items' => ['is_enabled' => 1, 'limit_value' => null],
                'orders' => ['is_enabled' => 1, 'limit_value' => null],
                'payments' => ['is_enabled' => 1, 'limit_value' => null],
                'gallery' => ['is_enabled' => 1, 'limit_value' => null],
                'deals' => ['is_enabled' => 1, 'limit_value' => null],
                'statistics' => ['is_enabled' => 1, 'limit_value' => null],
                'exports' => ['is_enabled' => 1, 'limit_value' => null],
                'staff_management' => ['is_enabled' => 1, 'limit_value' => null],
                'branding' => ['is_enabled' => 1, 'limit_value' => null],
                'custom_domain' => ['is_enabled' => 0, 'limit_value' => null],
            ],
        ],
        'premium' => [
            'name' => 'Premium',
            'description' => 'Full access plan with all unlocked feature flags.',
            'price_monthly' => 99.00,
            'price_yearly' => 990.00,
            'sort_order' => 40,
            'features' => [
                'categories' => ['is_enabled' => 1, 'limit_value' => null],
                'menu_items' => ['is_enabled' => 1, 'limit_value' => null],
                'orders' => ['is_enabled' => 1, 'limit_value' => null],
                'payments' => ['is_enabled' => 1, 'limit_value' => null],
                'gallery' => ['is_enabled' => 1, 'limit_value' => null],
                'deals' => ['is_enabled' => 1, 'limit_value' => null],
                'statistics' => ['is_enabled' => 1, 'limit_value' => null],
                'exports' => ['is_enabled' => 1, 'limit_value' => null],
                'staff_management' => ['is_enabled' => 1, 'limit_value' => null],
                'branding' => ['is_enabled' => 1, 'limit_value' => null],
                'custom_domain' => ['is_enabled' => 1, 'limit_value' => null],
            ],
        ],
    ];
}

function feature_gate_feature_keys(): array
{
    return [
        'categories',
        'menu_items',
        'orders',
        'payments',
        'gallery',
        'deals',
        'statistics',
        'exports',
        'staff_management',
        'branding',
        'custom_domain',
    ];
}

function feature_gate_fallback_plan_row(string $slug): array
{
    $definitions = feature_gate_plan_definitions();
    $key = array_key_exists($slug, $definitions) ? $slug : feature_gate_fallback_plan_slug();
    $definition = $definitions[$key] ?? $definitions['free'];

    return [
        'id' => 0,
        'name' => $definition['name'],
        'slug' => $key,
        'description' => $definition['description'],
        'price_monthly' => $definition['price_monthly'],
        'price_yearly' => $definition['price_yearly'],
        'status' => 'active',
        'sort_order' => $definition['sort_order'],
    ];
}

function feature_gate_map_plan_features(array $planFeatureRows): array
{
    $features = [];

    foreach (feature_gate_feature_keys() as $featureKey) {
        $row = $planFeatureRows[$featureKey] ?? ['is_enabled' => 0, 'limit_value' => null];
        $features[$featureKey] = [
            'is_enabled' => (bool) ($row['is_enabled'] ?? 0),
            'limit_value' => $row['limit_value'] !== null ? (int) $row['limit_value'] : null,
        ];
    }

    return $features;
}

function feature_gate_fallback_plan_features(string $slug): array
{
    $definitions = feature_gate_plan_definitions();
    $key = array_key_exists($slug, $definitions) ? $slug : feature_gate_fallback_plan_slug();

    return feature_gate_map_plan_features($definitions[$key]['features'] ?? []);
}

function feature_gate_plan_row_by_slug(PDO $pdo, string $slug): ?array
{
    try {
        $statement = $pdo->prepare(
            'SELECT id, name, slug, description, price_monthly, price_yearly, status, sort_order, created_at, updated_at
             FROM plans
             WHERE slug = :slug
             LIMIT 1'
        );
        $statement->execute(['slug' => strtolower(trim($slug))]);

        $row = $statement->fetch();
        return $row ?: null;
    } catch (Throwable) {
        return null;
    }
}

function feature_gate_plan_row_by_id(PDO $pdo, int $planId): ?array
{
    try {
        $statement = $pdo->prepare(
            'SELECT id, name, slug, description, price_monthly, price_yearly, status, sort_order, created_at, updated_at
             FROM plans
             WHERE id = :id
             LIMIT 1'
        );
        $statement->execute(['id' => $planId]);

        $row = $statement->fetch();
        return $row ?: null;
    } catch (Throwable) {
        return null;
    }
}

function feature_gate_plan_feature_rows(PDO $pdo, int $planId): array
{
    try {
        $statement = $pdo->prepare(
            'SELECT feature_key, is_enabled, limit_value
             FROM plan_features
             WHERE plan_id = :plan_id'
        );
        $statement->execute(['plan_id' => $planId]);

        $rows = [];
        foreach ($statement->fetchAll() as $row) {
            $rows[(string) $row['feature_key']] = [
                'is_enabled' => (int) ($row['is_enabled'] ?? 0),
                'limit_value' => $row['limit_value'] !== null ? (int) $row['limit_value'] : null,
            ];
        }

        return $rows;
    } catch (Throwable) {
        return [];
    }
}

function feature_gate_list_plans(PDO $pdo): array
{
    try {
        $statement = $pdo->query(
            'SELECT id, name, slug, description, price_monthly, price_yearly, status, sort_order, created_at, updated_at
             FROM plans
             WHERE status = "active"
             ORDER BY sort_order ASC, name ASC, id ASC'
        );

        return array_map(static fn (array $plan): array => [
            'id' => (int) $plan['id'],
            'name' => (string) $plan['name'],
            'slug' => (string) $plan['slug'],
            'description' => (string) ($plan['description'] ?? ''),
            'price_monthly' => isset($plan['price_monthly']) ? (float) $plan['price_monthly'] : 0.0,
            'price_yearly' => isset($plan['price_yearly']) ? (float) $plan['price_yearly'] : 0.0,
            'status' => (string) $plan['status'],
            'sort_order' => (int) ($plan['sort_order'] ?? 0),
        ], $statement->fetchAll());
    } catch (Throwable) {
        $definitions = feature_gate_plan_definitions();
        return array_map(static fn (string $slug, array $plan): array => [
            'id' => 0,
            'name' => $plan['name'],
            'slug' => $slug,
            'description' => $plan['description'],
            'price_monthly' => $plan['price_monthly'],
            'price_yearly' => $plan['price_yearly'],
            'status' => 'active',
            'sort_order' => $plan['sort_order'],
        ], array_keys($definitions), array_values($definitions));
    }
}

function feature_gate_subscription_row(PDO $pdo, int $restaurantId): ?array
{
    try {
        $statement = $pdo->prepare(
            'SELECT id, restaurant_id, plan_id, status, starts_at, ends_at, trial_ends_at, created_at, updated_at
             FROM restaurant_subscriptions
             WHERE restaurant_id = :restaurant_id
             LIMIT 1'
        );
        $statement->execute(['restaurant_id' => $restaurantId]);

        $row = $statement->fetch();
        return $row ?: null;
    } catch (Throwable) {
        return null;
    }
}

function feature_gate_upsert_restaurant_subscription(PDO $pdo, int $restaurantId, int $planId, string $status = 'active'): ?array
{
    try {
        $existing = feature_gate_subscription_row($pdo, $restaurantId);

        if ($existing === null) {
            $statement = $pdo->prepare(
                'INSERT INTO restaurant_subscriptions
                    (restaurant_id, plan_id, status, starts_at, ends_at, trial_ends_at)
                 VALUES
                    (:restaurant_id, :plan_id, :status, NOW(), NULL, NULL)'
            );
            $statement->execute([
                'restaurant_id' => $restaurantId,
                'plan_id' => $planId,
                'status' => $status,
            ]);
        } else {
            $statement = $pdo->prepare(
                'UPDATE restaurant_subscriptions
                 SET plan_id = :plan_id,
                     status = :status,
                     ends_at = NULL,
                     trial_ends_at = NULL,
                     updated_at = CURRENT_TIMESTAMP
                 WHERE restaurant_id = :restaurant_id'
            );
            $statement->execute([
                'restaurant_id' => $restaurantId,
                'plan_id' => $planId,
                'status' => $status,
            ]);
        }

        return feature_gate_subscription_row($pdo, $restaurantId);
    } catch (Throwable) {
        return null;
    }
}

function feature_gate_plan_summary(PDO $pdo, array $planRow, ?array $planFeatureRows = null): array
{
    $planId = (int) ($planRow['id'] ?? 0);
    if ($planFeatureRows !== null) {
        $featureMap = feature_gate_map_plan_features($planFeatureRows);
    } elseif ($planId > 0) {
        $featureMap = feature_gate_map_plan_features(feature_gate_plan_feature_rows($pdo, $planId));
    } else {
        $featureMap = feature_gate_fallback_plan_features((string) ($planRow['slug'] ?? feature_gate_fallback_plan_slug()));
    }

    return [
        'id' => $planId,
        'name' => (string) ($planRow['name'] ?? ''),
        'slug' => (string) ($planRow['slug'] ?? feature_gate_fallback_plan_slug()),
        'description' => (string) ($planRow['description'] ?? ''),
        'price_monthly' => isset($planRow['price_monthly']) ? (float) $planRow['price_monthly'] : 0.0,
        'price_yearly' => isset($planRow['price_yearly']) ? (float) $planRow['price_yearly'] : 0.0,
        'status' => (string) ($planRow['status'] ?? 'active'),
        'sort_order' => (int) ($planRow['sort_order'] ?? 0),
        'features' => array_map(static fn (array $feature): bool => (bool) $feature['is_enabled'], $featureMap),
        'limits' => array_map(static fn (array $feature): ?int => $feature['limit_value'], $featureMap),
    ];
}

function getPlanFeatures(int $planId): array
{
    $pdo = db();
    if (!$pdo instanceof PDO || $planId < 1) {
        return feature_gate_fallback_plan_features(feature_gate_fallback_plan_slug());
    }

    $plan = feature_gate_plan_row_by_id($pdo, $planId);
    if ($plan === null) {
        return feature_gate_fallback_plan_features(feature_gate_fallback_plan_slug());
    }

    return feature_gate_plan_summary($pdo, $plan)['features'];
}

function getRestaurantPlan(int $restaurantId): array
{
    $pdo = db();
    if (!$pdo instanceof PDO || $restaurantId < 1) {
        $fallbackPlan = feature_gate_fallback_plan_row(feature_gate_fallback_plan_slug());
        $fallbackFeatures = feature_gate_fallback_plan_features((string) $fallbackPlan['slug']);

        return [
            'id' => (int) $fallbackPlan['id'],
            'name' => (string) $fallbackPlan['name'],
            'slug' => (string) $fallbackPlan['slug'],
            'description' => (string) $fallbackPlan['description'],
            'price_monthly' => (float) $fallbackPlan['price_monthly'],
            'price_yearly' => (float) $fallbackPlan['price_yearly'],
            'status' => (string) $fallbackPlan['status'],
            'sort_order' => (int) $fallbackPlan['sort_order'],
            'features' => array_map(static fn (array $feature): bool => (bool) $feature['is_enabled'], $fallbackFeatures),
            'limits' => array_map(static fn (array $feature): ?int => $feature['limit_value'], $fallbackFeatures),
        ];
    }

    $subscription = feature_gate_subscription_row($pdo, $restaurantId);
    $planRow = null;

    if ($subscription !== null) {
        $planRow = feature_gate_plan_row_by_id($pdo, (int) $subscription['plan_id']);
    }

    if ($planRow === null) {
        $planRow = feature_gate_plan_row_by_slug($pdo, feature_gate_fallback_plan_slug());
    }

    if ($planRow === null) {
        $planRow = feature_gate_fallback_plan_row(feature_gate_fallback_plan_slug());
        return feature_gate_plan_summary($pdo, $planRow, feature_gate_fallback_plan_features((string) $planRow['slug']));
    }

    return feature_gate_plan_summary($pdo, $planRow);
}

function canUseFeature(int $restaurantId, string $featureKey): bool
{
    $featureKey = strtolower(trim($featureKey));
    if ($featureKey === '') {
        return false;
    }

    $plan = getRestaurantPlan($restaurantId);
    return (bool) ($plan['features'][$featureKey] ?? false);
}

function requireFeature(int $restaurantId, string $featureKey): void
{
    if (canUseFeature($restaurantId, $featureKey)) {
        return;
    }

    json_response([
        'success' => false,
        'error' => 'feature_locked',
        'message' => 'This feature is not available on your current plan.',
        'feature' => strtolower(trim($featureKey)),
        'upgrade_required' => true,
    ], 403);
}
