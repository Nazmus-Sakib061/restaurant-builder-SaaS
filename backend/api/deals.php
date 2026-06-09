<?php
declare(strict_types=1);

require_once __DIR__ . '/_helpers.php';

function deal_row(PDO $pdo, int $restaurantId, int $id): ?array
{
    $statement = $pdo->prepare(
        'SELECT id, restaurant_id, title, slug, description, regular_price, deal_price, image, badge_text, starts_at, ends_at, sort_order, status, created_at, updated_at
         FROM deals
         WHERE id = :id
           AND restaurant_id = :restaurant_id
         LIMIT 1'
    );
    $statement->execute([
        'id' => $id,
        'restaurant_id' => $restaurantId,
    ]);

    $row = $statement->fetch();

    return $row ?: null;
}

function deal_items_map(PDO $pdo, int $restaurantId, array $dealIds): array
{
    if (empty($dealIds)) {
        return [];
    }

    $placeholders = implode(',', array_fill(0, count($dealIds), '?'));
    $statement = $pdo->prepare(
        'SELECT
            di.deal_id,
            di.menu_item_id,
            di.quantity,
            mi.name AS item_name,
            mi.slug AS item_slug,
            mi.price AS item_price,
            mi.image AS item_image
         FROM deal_items di
         LEFT JOIN menu_items mi
            ON mi.id = di.menu_item_id
           AND mi.restaurant_id = ?
         WHERE di.deal_id IN (' . $placeholders . ')
         ORDER BY di.id ASC'
    );
    $statement->execute(array_merge([$restaurantId], $dealIds));

    $grouped = [];

    foreach ($statement->fetchAll() as $row) {
        $dealId = (int) $row['deal_id'];
        $grouped[$dealId] ??= [];
        $grouped[$dealId][] = $row;
    }

    return $grouped;
}

function deal_snapshot(PDO $pdo, int $restaurantId, int $id): ?array
{
    $deal = deal_row($pdo, $restaurantId, $id);

    if ($deal === null) {
        return null;
    }

    $itemsMap = deal_items_map($pdo, $restaurantId, [$id]);
    $deal['items'] = $itemsMap[$id] ?? [];

    return $deal;
}

function deal_payload(array $payload): array
{
    $title = trim((string) ($payload['title'] ?? ''));
    $slug = trim((string) ($payload['slug'] ?? ''));

    return [
        'title' => $title,
        'slug' => $slug !== '' ? $slug : slugify_text($title),
        'description' => trim((string) ($payload['description'] ?? '')),
        'regular_price' => (float) ($payload['regular_price'] ?? 0),
        'deal_price' => (float) ($payload['deal_price'] ?? 0),
        'image' => trim((string) ($payload['image'] ?? '')),
        'badge_text' => trim((string) ($payload['badge_text'] ?? '')),
        'starts_at' => trim((string) ($payload['starts_at'] ?? '')),
        'ends_at' => trim((string) ($payload['ends_at'] ?? '')),
        'sort_order' => max(0, (int) ($payload['sort_order'] ?? 0)),
        'status' => status_or_default($payload['status'] ?? 'active', 'active', ['active', 'inactive']),
        'items' => $payload['items'] ?? $payload['deal_items'] ?? null,
    ];
}

function normalize_deal_items_payload(PDO $pdo, int $restaurantId, mixed $itemsPayload): array
{
    if (!is_array($itemsPayload)) {
        return [];
    }

    $items = [];

    foreach ($itemsPayload as $rawItem) {
        if (!is_array($rawItem)) {
            continue;
        }

        $menuItemId = isset($rawItem['menu_item_id']) && $rawItem['menu_item_id'] !== '' ? (int) $rawItem['menu_item_id'] : null;
        $quantity = max(1, (int) ($rawItem['quantity'] ?? 1));
        $itemName = trim((string) ($rawItem['item_name'] ?? $rawItem['name'] ?? ''));
        $unitPrice = isset($rawItem['unit_price']) && is_numeric($rawItem['unit_price'])
            ? (float) $rawItem['unit_price']
            : null;

        if ($menuItemId !== null) {
            $statement = $pdo->prepare(
                'SELECT id, name, price
                 FROM menu_items
                 WHERE id = :id
                   AND restaurant_id = :restaurant_id
                   AND status = "active"
                 LIMIT 1'
            );
            $statement->execute([
                'id' => $menuItemId,
                'restaurant_id' => $restaurantId,
            ]);
            $menuItem = $statement->fetch();

            if (!$menuItem) {
                throw new InvalidArgumentException('One of the selected menu items is not valid for this restaurant.');
            }

            if ($itemName === '') {
                $itemName = (string) $menuItem['name'];
            }

            if ($unitPrice === null || $unitPrice <= 0) {
                $unitPrice = (float) $menuItem['price'];
            }
        }

        if ($itemName === '') {
            throw new InvalidArgumentException('Each deal item must have a name or menu item reference.');
        }

        if ($unitPrice === null) {
            $unitPrice = 0.00;
        }

        $totalPrice = isset($rawItem['total_price']) && is_numeric($rawItem['total_price'])
            ? (float) $rawItem['total_price']
            : round($unitPrice * $quantity, 2);

        $items[] = [
            'menu_item_id' => $menuItemId,
            'quantity' => $quantity,
            'item_name' => $itemName,
            'unit_price' => $unitPrice,
            'total_price' => $totalPrice,
        ];
    }

    return $items;
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
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
        $deal = deal_snapshot($pdo, $restaurantId, $id);

        if ($deal === null || ((!$includeInactive) && (string) $deal['status'] !== 'active')) {
            json_response([
                'success' => false,
                'message' => 'Deal not found.',
            ], 404);
        }

        json_response([
            'success' => true,
            'data' => $deal,
        ]);
    }

    $statement = $pdo->prepare(
        'SELECT id, restaurant_id, title, slug, description, regular_price, deal_price, image, badge_text, starts_at, ends_at, sort_order, status, created_at, updated_at
         FROM deals
         WHERE restaurant_id = :restaurant_id
           ' . ($includeInactive ? '' : 'AND status = "active"') . '
         ORDER BY sort_order ASC, title ASC, created_at DESC'
    );
    $statement->execute(['restaurant_id' => $restaurantId]);
    $deals = $statement->fetchAll();
    $dealIds = array_map(static fn (array $row): int => (int) $row['id'], $deals);
    $itemsMap = deal_items_map($pdo, $restaurantId, $dealIds);

    foreach ($deals as &$deal) {
        $deal['items'] = $itemsMap[(int) $deal['id']] ?? [];
    }
    unset($deal);

    json_response([
        'success' => true,
        'data' => $deals,
    ]);
}

if (in_array($method, ['POST', 'PUT', 'PATCH', 'DELETE'], true)) {
    require_admin_write_access();
}

if ($method === 'POST') {
    $payload = request_payload();
    $input = deal_payload($payload);
    $itemsProvided = array_key_exists('items', $payload) || array_key_exists('deal_items', $payload);

    if ($input['title'] === '') {
        json_response([
            'success' => false,
            'message' => 'Deal title is required.',
        ], 422);
    }

    if ($input['description'] === '') {
        json_response([
            'success' => false,
            'message' => 'Deal description is required.',
        ], 422);
    }

    if ($input['image'] === '') {
        json_response([
            'success' => false,
            'message' => 'Deal image is required.',
        ], 422);
    }

    if ($input['regular_price'] <= 0 || $input['deal_price'] <= 0) {
        json_response([
            'success' => false,
            'message' => 'Deal prices must be greater than zero.',
        ], 422);
    }

    $items = [];

    try {
        if ($itemsProvided) {
            $items = normalize_deal_items_payload($pdo, $restaurantId, $input['items']);
        }
    } catch (InvalidArgumentException $exception) {
        json_response([
            'success' => false,
            'message' => $exception->getMessage(),
        ], 422);
    }

    try {
        $pdo->beginTransaction();

        $statement = $pdo->prepare(
            'INSERT INTO deals
                (restaurant_id, title, slug, description, regular_price, deal_price, image, badge_text, starts_at, ends_at, sort_order, status)
             VALUES
                (:restaurant_id, :title, :slug, :description, :regular_price, :deal_price, :image, :badge_text, :starts_at, :ends_at, :sort_order, :status)'
        );
        $statement->execute([
            'restaurant_id' => $restaurantId,
            'title' => $input['title'],
            'slug' => $input['slug'],
            'description' => $input['description'],
            'regular_price' => $input['regular_price'],
            'deal_price' => $input['deal_price'],
            'image' => $input['image'],
            'badge_text' => $input['badge_text'] !== '' ? $input['badge_text'] : null,
            'starts_at' => $input['starts_at'] !== '' ? $input['starts_at'] : null,
            'ends_at' => $input['ends_at'] !== '' ? $input['ends_at'] : null,
            'sort_order' => $input['sort_order'],
            'status' => $input['status'],
        ]);

        $dealId = (int) $pdo->lastInsertId();

        foreach ($items as $item) {
            $itemStatement = $pdo->prepare(
                'INSERT INTO deal_items (deal_id, menu_item_id, quantity)
                 VALUES (:deal_id, :menu_item_id, :quantity)'
            );
            $itemStatement->execute([
                'deal_id' => $dealId,
                'menu_item_id' => $item['menu_item_id'],
                'quantity' => $item['quantity'],
            ]);
        }

        $pdo->commit();
    } catch (Throwable $throwable) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }

        if (is_duplicate_key_error($throwable)) {
            json_response([
                'success' => false,
                'message' => 'Deal slug already exists for this restaurant.',
            ], 409);
        }

        throw $throwable;
    }

    json_response([
        'success' => true,
        'data' => deal_snapshot($pdo, $restaurantId, $dealId),
        'message' => 'Deal created successfully.',
    ], 201);
}

if ($method === 'PUT') {
    $payload = request_payload();
    $id = input_id($payload);

    if (!$id) {
        json_response([
            'success' => false,
            'message' => 'Deal id is required.',
        ], 422);
    }

    $existing = deal_row($pdo, $restaurantId, $id);

    if ($existing === null) {
        json_response([
            'success' => false,
            'message' => 'Deal not found.',
        ], 404);
    }

    $input = deal_payload($payload);
    $itemsProvided = array_key_exists('items', $payload) || array_key_exists('deal_items', $payload);

    if ($input['title'] === '') {
        json_response([
            'success' => false,
            'message' => 'Deal title is required.',
        ], 422);
    }

    if ($input['description'] === '') {
        json_response([
            'success' => false,
            'message' => 'Deal description is required.',
        ], 422);
    }

    if ($input['image'] === '') {
        json_response([
            'success' => false,
            'message' => 'Deal image is required.',
        ], 422);
    }

    if ($input['regular_price'] <= 0 || $input['deal_price'] <= 0) {
        json_response([
            'success' => false,
            'message' => 'Deal prices must be greater than zero.',
        ], 422);
    }

    $items = [];

    try {
        if ($itemsProvided) {
            $items = normalize_deal_items_payload($pdo, $restaurantId, $input['items']);
        }
    } catch (InvalidArgumentException $exception) {
        json_response([
            'success' => false,
            'message' => $exception->getMessage(),
        ], 422);
    }

    try {
        $pdo->beginTransaction();

        $statement = $pdo->prepare(
            'UPDATE deals
             SET title = :title,
                 slug = :slug,
                 description = :description,
                 regular_price = :regular_price,
                 deal_price = :deal_price,
                 image = :image,
                 badge_text = :badge_text,
                 starts_at = :starts_at,
                 ends_at = :ends_at,
                 sort_order = :sort_order,
                 status = :status,
                 updated_at = NOW()
             WHERE id = :id
               AND restaurant_id = :restaurant_id'
        );
        $statement->execute([
            'title' => $input['title'],
            'slug' => $input['slug'],
            'description' => $input['description'],
            'regular_price' => $input['regular_price'],
            'deal_price' => $input['deal_price'],
            'image' => $input['image'],
            'badge_text' => $input['badge_text'] !== '' ? $input['badge_text'] : null,
            'starts_at' => $input['starts_at'] !== '' ? $input['starts_at'] : null,
            'ends_at' => $input['ends_at'] !== '' ? $input['ends_at'] : null,
            'sort_order' => $input['sort_order'],
            'status' => $input['status'],
            'id' => $id,
            'restaurant_id' => $restaurantId,
        ]);

        if ($itemsProvided) {
            $deleteItems = $pdo->prepare('DELETE FROM deal_items WHERE deal_id = :deal_id');
            $deleteItems->execute(['deal_id' => $id]);

            foreach ($items as $item) {
                $itemStatement = $pdo->prepare(
                    'INSERT INTO deal_items (deal_id, menu_item_id, quantity)
                     VALUES (:deal_id, :menu_item_id, :quantity)'
                );
                $itemStatement->execute([
                    'deal_id' => $id,
                    'menu_item_id' => $item['menu_item_id'],
                    'quantity' => $item['quantity'],
                ]);
            }
        }

        $pdo->commit();
    } catch (Throwable $throwable) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }

        if (is_duplicate_key_error($throwable)) {
            json_response([
                'success' => false,
                'message' => 'Deal slug already exists for this restaurant.',
            ], 409);
        }

        throw $throwable;
    }

    json_response([
        'success' => true,
        'data' => deal_snapshot($pdo, $restaurantId, $id),
        'message' => 'Deal updated successfully.',
    ]);
}

if ($method === 'DELETE') {
    $payload = request_payload();
    $id = input_id($payload);

    if (!$id) {
        json_response([
            'success' => false,
            'message' => 'Deal id is required.',
        ], 422);
    }

    $existing = deal_row($pdo, $restaurantId, $id);

    if ($existing === null) {
        json_response([
            'success' => false,
            'message' => 'Deal not found.',
        ], 404);
    }

    $statement = $pdo->prepare(
        'UPDATE deals
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
        'data' => ['id' => $id, 'status' => 'inactive'],
        'message' => 'Deal deleted successfully.',
    ]);
}

json_response([
    'success' => false,
    'message' => 'Method not allowed.',
], 405);
