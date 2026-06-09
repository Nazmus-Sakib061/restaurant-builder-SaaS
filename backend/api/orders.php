<?php
declare(strict_types=1);

require_once __DIR__ . '/_helpers.php';

function order_row(PDO $pdo, int $restaurantId, int $id): ?array
{
    $statement = $pdo->prepare(
        'SELECT
            id,
            restaurant_id,
            customer_name,
            customer_phone,
            customer_email,
            customer_address,
            order_type,
            subtotal,
            discount_amount,
            delivery_charge,
            total_amount,
            payment_method,
            payment_status,
            order_status,
            note,
            created_at,
            updated_at
         FROM orders
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

function order_items_map(PDO $pdo, int $restaurantId, array $orderIds): array
{
    if (empty($orderIds)) {
        return [];
    }

    $placeholders = implode(',', array_fill(0, count($orderIds), '?'));
    $statement = $pdo->prepare(
        'SELECT
            oi.order_id,
            oi.menu_item_id,
            oi.item_name,
            oi.quantity,
            oi.unit_price,
            oi.total_price,
            mi.slug AS menu_item_slug,
            mi.image AS menu_item_image
         FROM order_items oi
         LEFT JOIN menu_items mi
            ON mi.id = oi.menu_item_id
           AND mi.restaurant_id = ?
         WHERE oi.order_id IN (' . $placeholders . ')
         ORDER BY oi.id ASC'
    );
    $statement->execute(array_merge([$restaurantId], $orderIds));

    $grouped = [];

    foreach ($statement->fetchAll() as $row) {
        $orderId = (int) $row['order_id'];
        if (!isset($grouped[$orderId])) {
            $grouped[$orderId] = [];
        }
        $grouped[$orderId][] = $row;
    }

    return $grouped;
}

function order_snapshot(PDO $pdo, int $restaurantId, int $id): ?array
{
    $order = order_row($pdo, $restaurantId, $id);

    if ($order === null) {
        return null;
    }

    $itemsMap = order_items_map($pdo, $restaurantId, [$id]);
    $order['items'] = $itemsMap[$id] ?? [];

    return $order;
}

function order_payload(array $payload): array
{
    $status = $payload['order_status'] ?? ($payload['status'] ?? 'pending');

    return [
        'customer_name' => trim((string) ($payload['customer_name'] ?? '')),
        'customer_phone' => trim((string) ($payload['customer_phone'] ?? ($payload['phone'] ?? ''))),
        'customer_email' => trim((string) ($payload['customer_email'] ?? ($payload['email'] ?? ''))),
        'customer_address' => trim((string) ($payload['customer_address'] ?? '')),
        'order_type' => status_or_default($payload['order_type'] ?? 'delivery', 'delivery', ['dine_in', 'takeaway', 'delivery']),
        'subtotal' => is_numeric($payload['subtotal'] ?? null) ? (float) $payload['subtotal'] : null,
        'discount_amount' => is_numeric($payload['discount_amount'] ?? null) ? max(0, (float) $payload['discount_amount']) : 0.00,
        'delivery_charge' => is_numeric($payload['delivery_charge'] ?? null) ? max(0, (float) $payload['delivery_charge']) : 0.00,
        'total_amount' => is_numeric($payload['total_amount'] ?? null) ? max(0, (float) $payload['total_amount']) : null,
        'payment_method' => status_or_default($payload['payment_method'] ?? 'cash', 'cash', ['cash', 'bkash', 'nagad', 'card', 'other']),
        'payment_status' => status_or_default($payload['payment_status'] ?? 'unpaid', 'unpaid', ['unpaid', 'paid', 'partial', 'refunded']),
        'order_status' => status_or_default($status, 'pending', ['pending', 'accepted', 'preparing', 'completed', 'cancelled']),
        'note' => trim((string) ($payload['note'] ?? ($payload['message'] ?? ''))),
        'food_item' => trim((string) ($payload['food_item'] ?? '')),
        'items' => $payload['items'] ?? $payload['order_items'] ?? null,
    ];
}

function normalize_order_items_payload(PDO $pdo, int $restaurantId, mixed $itemsPayload, string $fallbackFoodItem): array
{
    $itemsPayload = is_array($itemsPayload) ? $itemsPayload : [];

    if (empty($itemsPayload) && $fallbackFoodItem !== '') {
        $itemsPayload = [
            [
                'item_name' => $fallbackFoodItem,
                'quantity' => 1,
                'unit_price' => 0,
                'total_price' => 0,
            ],
        ];
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
            throw new InvalidArgumentException('Each order item must have a name or menu item reference.');
        }

        if ($unitPrice === null) {
            $unitPrice = 0.00;
        }

        $totalPrice = isset($rawItem['total_price']) && is_numeric($rawItem['total_price'])
            ? (float) $rawItem['total_price']
            : round($unitPrice * $quantity, 2);

        $items[] = [
            'menu_item_id' => $menuItemId,
            'item_name' => $itemName,
            'quantity' => $quantity,
            'unit_price' => $unitPrice,
            'total_price' => $totalPrice,
        ];
    }

    if (empty($items)) {
        throw new InvalidArgumentException('At least one order item is required.');
    }

    return $items;
}

function calculate_order_totals(array $payload, array $items): array
{
    $calculatedSubtotal = round(array_reduce(
        $items,
        static fn (float $carry, array $item): float => $carry + (float) $item['total_price'],
        0.0
    ), 2);

    $subtotal = $payload['subtotal'];
    if ($subtotal === null || $subtotal <= 0) {
        $subtotal = $calculatedSubtotal;
    }

    $discount = (float) ($payload['discount_amount'] ?? 0);
    $delivery = (float) ($payload['delivery_charge'] ?? 0);
    $total = $payload['total_amount'];

    if ($total === null || $total <= 0) {
        $total = max(0, round($subtotal - $discount + $delivery, 2));
    }

    return [
        'subtotal' => round((float) $subtotal, 2),
        'discount_amount' => round(max(0, $discount), 2),
        'delivery_charge' => round(max(0, $delivery), 2),
        'total_amount' => round((float) $total, 2),
    ];
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
api_require_write_enabled($method);
$pdo = require_connection();
$restaurant = restaurant_context();
$restaurantId = (int) $restaurant['restaurant_id'];

if ($method === 'GET') {
    $id = input_id();

    if ($id) {
        $order = order_snapshot($pdo, $restaurantId, $id);

        if ($order === null) {
            json_response([
                'success' => false,
                'message' => 'Order not found.',
            ], 404);
        }

        json_response([
            'success' => true,
            'data' => $order,
        ]);
    }

    $statement = $pdo->prepare(
        'SELECT
            id,
            restaurant_id,
            customer_name,
            customer_phone,
            customer_email,
            customer_address,
            order_type,
            subtotal,
            discount_amount,
            delivery_charge,
            total_amount,
            payment_method,
            payment_status,
            order_status,
            note,
            created_at,
            updated_at
         FROM orders
         WHERE restaurant_id = :restaurant_id
         ORDER BY created_at DESC, id DESC'
    );
    $statement->execute(['restaurant_id' => $restaurantId]);
    $orders = $statement->fetchAll();
    $orderIds = array_map(static fn (array $row): int => (int) $row['id'], $orders);
    $itemsMap = order_items_map($pdo, $restaurantId, $orderIds);

    foreach ($orders as &$order) {
        $order['items'] = $itemsMap[(int) $order['id']] ?? [];
    }
    unset($order);

    json_response([
        'success' => true,
        'data' => $orders,
    ]);
}

if ($method === 'POST') {
    $payload = request_payload();
    $input = order_payload($payload);

    if ($input['customer_name'] === '' || $input['customer_phone'] === '') {
        json_response([
            'success' => false,
            'message' => 'Customer name and phone are required.',
        ], 422);
    }

    if ($input['customer_email'] !== '' && !filter_var($input['customer_email'], FILTER_VALIDATE_EMAIL)) {
        json_response([
            'success' => false,
            'message' => 'Please enter a valid email address.',
        ], 422);
    }

    try {
        $items = normalize_order_items_payload($pdo, $restaurantId, $input['items'], $input['food_item']);
    } catch (InvalidArgumentException $exception) {
        json_response([
            'success' => false,
            'message' => $exception->getMessage(),
        ], 422);
    }

    $totals = calculate_order_totals($input, $items);

    try {
        $pdo->beginTransaction();

        $statement = $pdo->prepare(
            'INSERT INTO orders
                (restaurant_id, customer_name, customer_phone, customer_email, customer_address, order_type, subtotal, discount_amount, delivery_charge, total_amount, payment_method, payment_status, order_status, note)
             VALUES
                (:restaurant_id, :customer_name, :customer_phone, :customer_email, :customer_address, :order_type, :subtotal, :discount_amount, :delivery_charge, :total_amount, :payment_method, :payment_status, :order_status, :note)'
        );
        $statement->execute([
            'restaurant_id' => $restaurantId,
            'customer_name' => $input['customer_name'],
            'customer_phone' => $input['customer_phone'],
            'customer_email' => $input['customer_email'] !== '' ? $input['customer_email'] : null,
            'customer_address' => $input['customer_address'] !== '' ? $input['customer_address'] : null,
            'order_type' => $input['order_type'],
            'subtotal' => $totals['subtotal'],
            'discount_amount' => $totals['discount_amount'],
            'delivery_charge' => $totals['delivery_charge'],
            'total_amount' => $totals['total_amount'],
            'payment_method' => $input['payment_method'],
            'payment_status' => $input['payment_status'],
            'order_status' => $input['order_status'],
            'note' => $input['note'] !== '' ? $input['note'] : null,
        ]);

        $orderId = (int) $pdo->lastInsertId();

        foreach ($items as $item) {
            $itemStatement = $pdo->prepare(
                'INSERT INTO order_items
                    (order_id, menu_item_id, item_name, quantity, unit_price, total_price)
                 VALUES
                    (:order_id, :menu_item_id, :item_name, :quantity, :unit_price, :total_price)'
            );
            $itemStatement->execute([
                'order_id' => $orderId,
                'menu_item_id' => $item['menu_item_id'],
                'item_name' => $item['item_name'],
                'quantity' => $item['quantity'],
                'unit_price' => $item['unit_price'],
                'total_price' => $item['total_price'],
            ]);
        }

        $pdo->commit();
    } catch (Throwable $throwable) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }

        throw $throwable;
    }

    json_response([
        'success' => true,
        'data' => order_snapshot($pdo, $restaurantId, $orderId),
        'message' => 'Order created successfully.',
    ], 201);
}

if ($method === 'PUT') {
    $payload = request_payload();
    $id = input_id($payload);

    if (!$id) {
        json_response([
            'success' => false,
            'message' => 'Order id is required.',
        ], 422);
    }

    $existing = order_row($pdo, $restaurantId, $id);

    if ($existing === null) {
        json_response([
            'success' => false,
            'message' => 'Order not found.',
        ], 404);
    }

    $input = order_payload($payload);

    $statement = $pdo->prepare(
        'UPDATE orders
         SET order_status = :order_status,
             payment_status = :payment_status,
             payment_method = :payment_method,
             note = :note,
             updated_at = NOW()
         WHERE id = :id
           AND restaurant_id = :restaurant_id'
    );
    $statement->execute([
        'order_status' => $input['order_status'],
        'payment_status' => $input['payment_status'],
        'payment_method' => $input['payment_method'],
        'note' => $input['note'] !== '' ? $input['note'] : null,
        'id' => $id,
        'restaurant_id' => $restaurantId,
    ]);

    json_response([
        'success' => true,
        'data' => order_snapshot($pdo, $restaurantId, $id),
        'message' => 'Order updated successfully.',
    ]);
}

if ($method === 'DELETE') {
    $payload = request_payload();
    $id = input_id($payload);

    if (!$id) {
        json_response([
            'success' => false,
            'message' => 'Order id is required.',
        ], 422);
    }

    $existing = order_row($pdo, $restaurantId, $id);

    if ($existing === null) {
        json_response([
            'success' => false,
            'message' => 'Order not found.',
        ], 404);
    }

    $statement = $pdo->prepare(
        'DELETE FROM orders
         WHERE id = :id
           AND restaurant_id = :restaurant_id'
    );
    $statement->execute([
        'id' => $id,
        'restaurant_id' => $restaurantId,
    ]);

    json_response([
        'success' => true,
        'data' => ['id' => $id],
        'message' => 'Order deleted successfully.',
    ]);
}

json_response([
    'success' => false,
    'message' => 'Method not allowed.',
], 405);
