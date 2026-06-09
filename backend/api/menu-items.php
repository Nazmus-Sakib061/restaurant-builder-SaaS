<?php
declare(strict_types=1);

require_once __DIR__ . '/_helpers.php';

function menu_item_row(PDO $pdo, int $restaurantId, int $id): ?array
{
    $statement = $pdo->prepare(
        'SELECT
            mi.id,
            mi.category_id,
            mc.name AS category_name,
            mc.slug AS category_slug,
            mc.status AS category_status,
            mi.name,
            mi.slug,
            mi.description,
            mi.price,
            mi.discount_price,
            mi.image,
            mi.badge_text,
            mi.is_featured,
            mi.is_available,
            mi.sort_order,
            mi.status
         FROM menu_items mi
         LEFT JOIN menu_categories mc
            ON mc.id = mi.category_id
           AND mc.restaurant_id = mi.restaurant_id
         WHERE mi.id = :id
           AND mi.restaurant_id = :restaurant_id
         LIMIT 1'
    );
    $statement->execute([
        'id' => $id,
        'restaurant_id' => $restaurantId,
    ]);

    $row = $statement->fetch();

    return $row ?: null;
}

function menu_item_list(PDO $pdo, int $restaurantId, array $filters): array
{
    $includeInactive = !empty($filters['include_inactive']);
    $conditions = ['mi.restaurant_id = :restaurant_id'];
    $params = ['restaurant_id' => $restaurantId];

    $categoryFilter = trim((string) ($filters['category'] ?? ''));
    if ($categoryFilter !== '') {
        if (ctype_digit($categoryFilter)) {
            $conditions[] = 'mi.category_id = :category_id';
            $params['category_id'] = (int) $categoryFilter;
        } else {
            $categoryStatement = $pdo->prepare(
                'SELECT id
                 FROM menu_categories
                 WHERE restaurant_id = :restaurant_id
                   AND slug = :slug
                 LIMIT 1'
            );
            $categoryStatement->execute([
                'restaurant_id' => $restaurantId,
                'slug' => $categoryFilter,
            ]);

            $categoryId = $categoryStatement->fetchColumn();
            if (!$categoryId) {
                return [];
            }

            $conditions[] = 'mi.category_id = :category_id';
            $params['category_id'] = (int) $categoryId;
        }
    }

    if (!$includeInactive) {
        $conditions[] = 'mi.status = "active"';
        $conditions[] = 'mi.is_available = 1';
        $conditions[] = '(mi.category_id IS NULL OR mc.status = "active")';
    }

    if (array_key_exists('featured', $filters) && $filters['featured'] !== null) {
        $conditions[] = 'mi.is_featured = :featured';
        $params['featured'] = (int) $filters['featured'];
    }

    if (array_key_exists('available', $filters) && $filters['available'] !== null) {
        $conditions[] = 'mi.is_available = :available';
        $params['available'] = (int) $filters['available'];
    }

    $statement = $pdo->prepare(
        'SELECT
            mi.id,
            mi.category_id,
            mc.name AS category_name,
            mc.slug AS category_slug,
            mi.name,
            mi.slug,
            mi.description,
            mi.price,
            mi.discount_price,
            mi.image,
            mi.badge_text,
            mi.is_featured,
            mi.is_available,
            mi.sort_order,
            mi.status
         FROM menu_items mi
         LEFT JOIN menu_categories mc
            ON mc.id = mi.category_id
           AND mc.restaurant_id = mi.restaurant_id
         WHERE ' . implode(' AND ', $conditions) . '
         ORDER BY mi.sort_order ASC, mi.id ASC'
    );
    $statement->execute($params);

    return $statement->fetchAll();
}

function menu_item_payload(array $payload, ?array $existing = null): array
{
    $has = static fn (string $key): bool => array_key_exists($key, $payload);
    $categoryIdError = null;
    $featuredError = null;
    $availableError = null;

    $categoryId = $existing['category_id'] ?? null;
    if ($has('category_id')) {
        $categoryRaw = trim((string) $payload['category_id']);
        if ($categoryRaw === '') {
            $categoryId = null;
        } elseif (!preg_match('/^[1-9]\d*$/', $categoryRaw)) {
            $categoryId = null;
            $categoryIdError = 'Category must be a valid positive integer.';
        } else {
            $validatedCategoryId = filter_var(
                $categoryRaw,
                FILTER_VALIDATE_INT,
                ['options' => ['min_range' => 1]]
            );
            if ($validatedCategoryId === false) {
                $categoryId = null;
                $categoryIdError = 'Category must be a valid positive integer.';
            } else {
                $categoryId = $validatedCategoryId;
            }
        }
    }

    $name = $existing['name'] ?? '';
    if ($has('name')) {
        $name = trim((string) $payload['name']);
    }

    $slug = $existing['slug'] ?? '';
    if ($has('slug')) {
        $slug = trim((string) $payload['slug']);
    }

    $description = $existing['description'] ?? '';
    if ($has('description')) {
        $description = trim((string) $payload['description']);
    }

    $price = $existing['price'] ?? null;
    if ($has('price')) {
        $priceRaw = trim((string) $payload['price']);
        $price = $priceRaw === '' ? null : $priceRaw;
    }

    $discountPrice = $existing['discount_price'] ?? null;
    if ($has('discount_price')) {
        $discountRaw = trim((string) $payload['discount_price']);
        $discountPrice = $discountRaw === '' ? null : $discountRaw;
    }

    $image = $existing['image'] ?? '';
    if ($has('image')) {
        $image = trim((string) $payload['image']);
    }

    $badgeText = $existing['badge_text'] ?? '';
    if ($has('badge_text')) {
        $badgeText = trim((string) $payload['badge_text']);
    }

    $isFeatured = (int) ($existing['is_featured'] ?? 0);
    if (array_key_exists('is_featured', $payload)) {
        $parsedFeatured = parse_request_bool($payload['is_featured'], $featuredError);
        if ($parsedFeatured !== null) {
            $isFeatured = $parsedFeatured;
        }
    }

    $isAvailable = (int) ($existing['is_available'] ?? 1);
    if (array_key_exists('is_available', $payload)) {
        $parsedAvailable = parse_request_bool($payload['is_available'], $availableError);
        if ($parsedAvailable !== null) {
            $isAvailable = $parsedAvailable;
        }
    }

    $sortOrder = $existing['sort_order'] ?? 0;
    if ($has('sort_order')) {
        $sortOrder = trim((string) $payload['sort_order']);
    }

    $status = $existing['status'] ?? 'active';
    if ($has('status')) {
        $status = trim((string) $payload['status']);
    }

    return [
        'category_id' => $categoryId,
        'category_id_error' => $categoryIdError,
        'name' => $name,
        'slug' => $slug,
        'description' => $description,
        'price' => $price,
        'discount_price' => $discountPrice,
        'image' => $image,
        'badge_text' => $badgeText,
        'is_featured' => $isFeatured,
        'is_available' => $isAvailable,
        'is_featured_error' => $featuredError,
        'is_available_error' => $availableError,
        'sort_order' => $sortOrder,
        'status' => $status,
    ];
}

function menu_item_validate(PDO $pdo, int $restaurantId, array $input, ?int $ignoreId = null): array
{
    $errors = [];

    if ($input['name'] === '') {
        $errors['name'] = 'Menu item name is required.';
    } elseif (strlen($input['name']) > 150) {
        $errors['name'] = 'Menu item name must be 150 characters or fewer.';
    }

    if ($input['price'] === null || !is_numeric($input['price']) || (float) $input['price'] < 0) {
        $errors['price'] = 'Price is required.';
    }

    if ($input['discount_price'] !== null) {
        if (!is_numeric($input['discount_price']) || (float) $input['discount_price'] < 0) {
            $errors['discount_price'] = 'Discount price must be zero or greater.';
        } elseif ($input['price'] !== null && is_numeric($input['price']) && (float) $input['discount_price'] >= (float) $input['price']) {
            $errors['discount_price'] = 'Discount price must be less than price.';
        }
    }

    if ($input['slug'] !== '' && strlen($input['slug']) > 180) {
        $errors['slug'] = 'Menu item slug must be 180 characters or fewer.';
    }

    if (!in_array($input['status'], ['active', 'inactive'], true)) {
        $errors['status'] = 'Invalid menu item status.';
    }

    if (!is_int($input['is_featured'])) {
        $errors['is_featured'] = 'Featured flag must be a boolean.';
    }

    if (!is_int($input['is_available'])) {
        $errors['is_available'] = 'Available flag must be a boolean.';
    }

    if (!empty($input['is_featured_error'])) {
        $errors['is_featured'] = $input['is_featured_error'];
    }

    if (!empty($input['is_available_error'])) {
        $errors['is_available'] = $input['is_available_error'];
    }

    if (filter_var($input['sort_order'], FILTER_VALIDATE_INT, ['options' => ['min_range' => 0]]) === false) {
        $errors['sort_order'] = 'Sort order must be an integer.';
    }

    if ($input['image'] === '') {
        $errors['image'] = 'Image path is required.';
    } elseif (strlen($input['image']) > 255) {
        $errors['image'] = 'Image path must be 255 characters or fewer.';
    }

    if (strlen($input['badge_text']) > 100) {
        $errors['badge_text'] = 'Badge text must be 100 characters or fewer.';
    }

    if (!empty($input['category_id_error'])) {
        $errors['category_id'] = $input['category_id_error'];
    } elseif ($input['category_id'] !== null) {
        $categoryStatement = $pdo->prepare(
            'SELECT id
             FROM menu_categories
             WHERE id = :id
               AND restaurant_id = :restaurant_id
             LIMIT 1'
        );
        $categoryStatement->execute([
            'id' => $input['category_id'],
            'restaurant_id' => $restaurantId,
        ]);

        if (!$categoryStatement->fetchColumn()) {
            $errors['category_id'] = 'Selected category is not valid for this restaurant.';
        }
    }

    return $errors;
}

function menu_item_resolved_slug(PDO $pdo, int $restaurantId, array $input, ?int $ignoreId = null): string
{
    $base = $input['slug'] !== '' ? $input['slug'] : $input['name'];
    return unique_restaurant_slug($pdo, 'menu_items', 'restaurant_id', (string) $restaurantId, $base, $ignoreId);
}

$method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
$pdo = require_connection();
$restaurant = restaurant_context();
$restaurantId = (int) $restaurant['restaurant_id'];

if ($method === 'GET') {
    $id = input_id();
    $includeInactive = false;
    $includeInactiveError = null;

    if (array_key_exists('include_inactive', $_GET)) {
        $includeInactive = query_bool_param('include_inactive', $includeInactiveError);
        if ($includeInactiveError !== null) {
            json_response([
                'success' => false,
                'message' => 'Validation error.',
                'errors' => [
                    'include_inactive' => $includeInactiveError,
                ],
            ], 422);
        }
    }

    if (array_key_exists('id', $_GET) && $id === null) {
        json_response([
            'success' => false,
            'message' => 'Validation error.',
            'errors' => [
                'id' => 'Invalid id.',
            ],
        ], 422);
    }

    if ($id) {
        $row = menu_item_row($pdo, $restaurantId, $id);

        if ($row === null) {
            json_response([
                'success' => false,
                'message' => 'Menu item not found.',
            ], 404);
        }

        $isHiddenFromPublic = (string) $row['status'] !== 'active'
            || ((int) $row['is_available'] !== 1)
            || ((int) $row['category_id'] !== 0 && (string) ($row['category_status'] ?? '') !== 'active');

        if ((!$includeInactive) && $isHiddenFromPublic) {
            json_response([
                'success' => false,
                'message' => 'Menu item not found.',
            ], 404);
        }

        json_response([
            'success' => true,
            'data' => $row,
        ]);
    }

    $errors = [];
    $featuredError = null;
    $availableError = null;
    $featured = query_bool_param('featured', $featuredError);
    $available = query_bool_param('available', $availableError);
    $includeInactiveError = null;
    $includeInactive = false;
    if (array_key_exists('include_inactive', $_GET)) {
        $includeInactive = query_bool_param('include_inactive', $includeInactiveError);
    }

    if ($featuredError !== null) {
        $errors['featured'] = $featuredError;
    }

    if ($availableError !== null) {
        $errors['available'] = $availableError;
    }

    if ($includeInactiveError !== null) {
        $errors['include_inactive'] = $includeInactiveError;
    }

    if (!empty($errors)) {
        json_response([
            'success' => false,
            'message' => 'Validation error.',
            'errors' => $errors,
        ], 422);
    }

    $filters = [
        'category' => isset($_GET['category']) ? trim((string) $_GET['category']) : '',
        'featured' => $featured,
        'available' => $available,
        'include_inactive' => $includeInactive,
    ];

    json_response([
        'success' => true,
        'data' => menu_item_list($pdo, $restaurantId, $filters),
    ]);
}

if (in_array($method, ['POST', 'PUT', 'PATCH', 'DELETE'], true)) {
    require_admin_write_access();
}

if ($method === 'POST') {
    $payload = request_payload();
    $input = menu_item_payload($payload);
    $errors = menu_item_validate($pdo, $restaurantId, $input);

    if (!empty($errors)) {
        json_response([
            'success' => false,
            'message' => 'Validation error.',
            'errors' => $errors,
        ], 422);
    }

    $slug = menu_item_resolved_slug($pdo, $restaurantId, $input);
    $description = $input['description'];
    $image = $input['image'] !== '' ? $input['image'] : '';

    $statement = $pdo->prepare(
        'INSERT INTO menu_items
            (restaurant_id, category_id, name, slug, description, price, discount_price, image, badge_text, is_featured, is_available, sort_order, status)
         VALUES
            (:restaurant_id, :category_id, :name, :slug, :description, :price, :discount_price, :image, :badge_text, :is_featured, :is_available, :sort_order, :status)'
    );
    $statement->execute([
        'restaurant_id' => $restaurantId,
        'category_id' => $input['category_id'],
        'name' => $input['name'],
        'slug' => $slug,
        'description' => $description,
        'price' => (float) $input['price'],
        'discount_price' => $input['discount_price'] !== null ? (float) $input['discount_price'] : null,
        'image' => $image,
        'badge_text' => $input['badge_text'] !== '' ? $input['badge_text'] : null,
        'is_featured' => $input['is_featured'],
        'is_available' => $input['is_available'],
        'sort_order' => (int) $input['sort_order'],
        'status' => $input['status'],
    ]);

    json_response([
        'success' => true,
        'message' => 'Menu item created successfully.',
        'data' => menu_item_row($pdo, $restaurantId, (int) $pdo->lastInsertId()),
    ], 201);
}

if ($method === 'PUT' || $method === 'PATCH') {
    $payload = request_payload();
    $id = input_id($payload);

    if (!$id) {
        json_response([
            'success' => false,
            'message' => 'Menu item id is required.',
        ], 422);
    }

    $existing = menu_item_row($pdo, $restaurantId, $id);
    if ($existing === null) {
        json_response([
            'success' => false,
            'message' => 'Menu item not found.',
        ], 404);
    }

    $input = menu_item_payload($payload, $existing);
    if ($input['name'] === '') {
        $input['name'] = (string) $existing['name'];
    }
    if ($input['price'] === null) {
        $input['price'] = $existing['price'];
    }

    $errors = menu_item_validate($pdo, $restaurantId, $input, $id);
    if (!empty($errors)) {
        json_response([
            'success' => false,
            'message' => 'Validation error.',
            'errors' => $errors,
        ], 422);
    }

    $slug = menu_item_resolved_slug($pdo, $restaurantId, $input, $id);

    $statement = $pdo->prepare(
        'UPDATE menu_items
         SET category_id = :category_id,
             name = :name,
             slug = :slug,
             description = :description,
             price = :price,
             discount_price = :discount_price,
             image = :image,
             badge_text = :badge_text,
             is_featured = :is_featured,
             is_available = :is_available,
             sort_order = :sort_order,
             status = :status,
             updated_at = NOW()
         WHERE id = :id
           AND restaurant_id = :restaurant_id'
    );
    $statement->execute([
        'category_id' => $input['category_id'],
        'name' => $input['name'],
        'slug' => $slug,
        'description' => $input['description'],
        'price' => (float) $input['price'],
        'discount_price' => $input['discount_price'] !== null ? (float) $input['discount_price'] : null,
        'image' => $input['image'],
        'badge_text' => $input['badge_text'] !== '' ? $input['badge_text'] : null,
        'is_featured' => $input['is_featured'],
        'is_available' => $input['is_available'],
        'sort_order' => (int) $input['sort_order'],
        'status' => $input['status'],
        'id' => $id,
        'restaurant_id' => $restaurantId,
    ]);

    json_response([
        'success' => true,
        'message' => 'Menu item updated successfully.',
        'data' => menu_item_row($pdo, $restaurantId, $id),
    ]);
}

if ($method === 'DELETE') {
    $payload = request_payload();
    $id = input_id($payload);

    if (!$id) {
        json_response([
            'success' => false,
            'message' => 'Menu item id is required.',
        ], 422);
    }

    $existing = menu_item_row($pdo, $restaurantId, $id);
    if ($existing === null) {
        json_response([
            'success' => false,
            'message' => 'Menu item not found.',
        ], 404);
    }

    $statement = $pdo->prepare(
        'UPDATE menu_items
         SET status = "inactive",
             updated_at = NOW()
         WHERE id = :id
           AND restaurant_id = :restaurant_id'
    );
    $statement->execute([
        'id' => $id,
        'restaurant_id' => $restaurantId,
    ]);

    json_response([
        'success' => true,
        'message' => 'Menu item deleted successfully.',
        'data' => ['id' => $id, 'status' => 'inactive'],
    ]);
}

json_response([
    'success' => false,
    'message' => 'Method not allowed.',
], 405);
