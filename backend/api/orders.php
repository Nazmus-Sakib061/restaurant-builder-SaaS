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
            cash_received_at,
            revenue_posted_at,
            revenue_amount,
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
            oi.food_name,
            oi.item_name,
            oi.food_image,
            oi.item_image,
            oi.quantity,
            oi.unit_price,
            oi.total_price,
            mi.price AS menu_item_price,
            mi.slug AS menu_item_slug,
            COALESCE(NULLIF(oi.food_name, \'\'), NULLIF(oi.item_name, \'\'), mi.name) AS menu_item_name,
            COALESCE(NULLIF(oi.food_image, \'\'), NULLIF(oi.item_image, \'\'), mi.image) AS food_image,
            COALESCE(NULLIF(oi.food_image, \'\'), NULLIF(oi.item_image, \'\'), mi.image) AS image,
            COALESCE(NULLIF(oi.food_image, \'\'), NULLIF(oi.item_image, \'\'), mi.image) AS menu_item_image
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

function order_row_for_update(PDO $pdo, int $restaurantId, int $id): ?array
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
            cash_received_at,
            revenue_posted_at,
            revenue_amount,
            order_status,
            note,
            created_at,
            updated_at
         FROM orders
         WHERE id = :id
           AND restaurant_id = :restaurant_id
         LIMIT 1 FOR UPDATE'
    );
    $statement->execute([
        'id' => $id,
        'restaurant_id' => $restaurantId,
    ]);

    $row = $statement->fetch();

    return $row ?: null;
}

function order_snapshot_for_update(PDO $pdo, int $restaurantId, int $id): ?array
{
    $order = order_row_for_update($pdo, $restaurantId, $id);

    if ($order === null) {
        return null;
    }

    $itemsMap = order_items_map($pdo, $restaurantId, [$id]);
    $order['items'] = $itemsMap[$id] ?? [];

    return $order;
}

function table_exists(PDO $pdo, string $tableName): bool
{
    $statement = $pdo->prepare(
        'SELECT 1
         FROM information_schema.TABLES
         WHERE TABLE_SCHEMA = DATABASE()
           AND TABLE_NAME = :table_name
         LIMIT 1'
    );
    $statement->execute(['table_name' => $tableName]);

    return (bool) $statement->fetchColumn();
}

function column_exists(PDO $pdo, string $tableName, string $columnName): bool
{
    $statement = $pdo->prepare(
        'SELECT 1
         FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE()
           AND TABLE_NAME = :table_name
           AND COLUMN_NAME = :column_name
         LIMIT 1'
    );
    $statement->execute([
        'table_name' => $tableName,
        'column_name' => $columnName,
    ]);

    return (bool) $statement->fetchColumn();
}

function ensure_order_revenue_schema(PDO $pdo): void
{
    $alterParts = [];

    if (column_exists($pdo, 'orders', 'payment_status')) {
        $statement = $pdo->prepare(
            'SELECT COLUMN_TYPE
             FROM information_schema.COLUMNS
             WHERE TABLE_SCHEMA = DATABASE()
               AND TABLE_NAME = :table_name
               AND COLUMN_NAME = :column_name
             LIMIT 1'
        );
        $statement->execute([
            'table_name' => 'orders',
            'column_name' => 'payment_status',
        ]);
        $columnType = strtolower((string) ($statement->fetchColumn() ?: ''));
        if (!str_contains($columnType, 'cash_received')) {
            $alterParts[] = "MODIFY COLUMN payment_status ENUM('unpaid', 'paid', 'partial', 'cash_received', 'refunded') NOT NULL DEFAULT 'unpaid'";
        }
    }

    if (!column_exists($pdo, 'orders', 'cash_received_at')) {
        $alterParts[] = 'ADD COLUMN cash_received_at DATETIME NULL DEFAULT NULL AFTER payment_status';
    }

    if (!column_exists($pdo, 'orders', 'revenue_posted_at')) {
        $alterParts[] = 'ADD COLUMN revenue_posted_at DATETIME NULL DEFAULT NULL AFTER cash_received_at';
    }

    if (!column_exists($pdo, 'orders', 'revenue_amount')) {
        $alterParts[] = 'ADD COLUMN revenue_amount DECIMAL(10,2) NULL DEFAULT NULL AFTER revenue_posted_at';
    }

    if ($alterParts !== []) {
        $pdo->exec('ALTER TABLE orders ' . implode(', ', $alterParts));
    }

    if (!column_exists($pdo, 'order_items', 'food_name')) {
        $pdo->exec('ALTER TABLE order_items ADD COLUMN food_name VARCHAR(150) NULL DEFAULT NULL AFTER menu_item_id');
    }

    if (!column_exists($pdo, 'order_items', 'food_image')) {
        $pdo->exec('ALTER TABLE order_items ADD COLUMN food_image VARCHAR(255) NULL DEFAULT NULL AFTER food_name');
    }

    if (column_exists($pdo, 'order_items', 'food_name') || column_exists($pdo, 'order_items', 'food_image')) {
        $pdo->exec(
            'UPDATE order_items
             SET
                food_name = COALESCE(NULLIF(food_name, \'\'), NULLIF(item_name, \'\')),
                food_image = COALESCE(NULLIF(food_image, \'\'), NULLIF(item_image, \'\'))
             WHERE
                (food_name IS NULL OR food_name = \'\' OR food_image IS NULL OR food_image = \'\')
                AND (item_name IS NOT NULL OR item_image IS NOT NULL)'
        );
    }

    if (!table_exists($pdo, 'revenue_transactions')) {
        $pdo->exec(
            'CREATE TABLE revenue_transactions (
                id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                restaurant_id BIGINT UNSIGNED NOT NULL,
                order_id BIGINT UNSIGNED NOT NULL,
                type VARCHAR(50) NOT NULL DEFAULT \'cash_received\',
                amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
                payment_method VARCHAR(30) NOT NULL DEFAULT \'cash\',
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY (id),
                UNIQUE KEY uq_revenue_transactions_order_id (order_id),
                KEY idx_revenue_transactions_restaurant_id (restaurant_id),
                KEY idx_revenue_transactions_type (type),
                KEY idx_revenue_transactions_created_at (created_at),
                CONSTRAINT fk_revenue_transactions_restaurant
                    FOREIGN KEY (restaurant_id) REFERENCES restaurants (id)
                    ON DELETE CASCADE
                    ON UPDATE CASCADE,
                CONSTRAINT fk_revenue_transactions_order
                    FOREIGN KEY (order_id) REFERENCES orders (id)
                    ON DELETE CASCADE
                    ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
        );
    }
}

function is_cash_received_order(array $order): bool
{
    $paymentStatus = strtolower(trim((string) ($order['payment_status'] ?? '')));

    return $paymentStatus === 'cash_received'
        || !empty($order['cash_received_at'])
        || !empty($order['revenue_posted_at']);
}

function money_value(mixed $value): ?float
{
    if ($value === null || $value === '') {
        return null;
    }

    if (!is_numeric($value)) {
        return null;
    }

    $number = (float) $value;
    return $number >= 0 ? round($number, 2) : null;
}

function normalize_image_path_value(mixed $value): string
{
    $path = trim((string) $value);
    if ($path === '') {
        return '';
    }

    if (preg_match('#^(?:https?:)?//#i', $path) || preg_match('#^(?:data:|blob:)#i', $path)) {
        return $path;
    }

    $path = str_replace('\\', '/', $path);
    $path = preg_replace('#^/restaurant_builder/#i', '', $path) ?? $path;
    $path = preg_replace('#^\.?/+#', '', $path) ?? $path;

    for ($index = 0; $index < 3; $index++) {
        $decoded = rawurldecode($path);
        if ($decoded === $path) {
            break;
        }
        $path = $decoded;
    }

    return $path;
}

function order_item_line_total(array $item): ?float
{
    $quantity = strict_positive_int($item['quantity'] ?? null) ?? 1;
    $unitPrice = money_value($item['unit_price'] ?? null);
    $menuItemPrice = money_value($item['menu_item_price'] ?? null);

    if ($unitPrice !== null && $unitPrice > 0) {
        return round($quantity * $unitPrice, 2);
    }

    if ($menuItemPrice !== null && $menuItemPrice > 0) {
        return round($quantity * $menuItemPrice, 2);
    }

    $fallbackTotal = money_value($item['total_price'] ?? null);

    return $fallbackTotal !== null && $fallbackTotal > 0 ? $fallbackTotal : null;
}

function calculate_order_total(array $order): ?float
{
    $items = $order['items'] ?? [];
    if (is_array($items) && $items !== []) {
        $lineTotals = [];
        foreach ($items as $item) {
            if (!is_array($item)) {
                continue;
            }

            $lineTotal = order_item_line_total($item);
            if ($lineTotal !== null) {
                $lineTotals[] = $lineTotal;
            }
        }

        if ($lineTotals !== []) {
            return round(array_sum($lineTotals), 2);
        }
    }

    $orderTotal = money_value($order['total_amount'] ?? null);
    return $orderTotal !== null && $orderTotal > 0 ? $orderTotal : null;
}

function revenue_total_for_restaurant(PDO $pdo, int $restaurantId): float
{
    if (table_exists($pdo, 'revenue_transactions')) {
        $statement = $pdo->prepare(
            'SELECT COALESCE(SUM(amount), 0) AS revenue_total
             FROM revenue_transactions
             WHERE restaurant_id = :restaurant_id
               AND type = :type'
        );
        $statement->execute([
            'restaurant_id' => $restaurantId,
            'type' => 'cash_received',
        ]);

        return round((float) ($statement->fetchColumn() ?: 0), 2);
    }

    $statement = $pdo->prepare(
        'SELECT COALESCE(SUM(COALESCE(revenue_amount, total_amount)), 0) AS revenue_total
         FROM orders
         WHERE restaurant_id = :restaurant_id
           AND (cash_received_at IS NOT NULL OR revenue_posted_at IS NOT NULL OR payment_status = :payment_status)'
    );
    $statement->execute([
        'restaurant_id' => $restaurantId,
        'payment_status' => 'cash_received',
    ]);

    return round((float) ($statement->fetchColumn() ?: 0), 2);
}

function cash_received_order(PDO $pdo, int $restaurantId, array $payload): void
{
    require_admin_write_access();

    $id = input_id($payload);
    if (!$id) {
        json_response([
            'success' => false,
            'message' => 'Order id is required.',
        ], 422);
    }

    ensure_order_revenue_schema($pdo);

    try {
        $pdo->beginTransaction();

        $order = order_snapshot_for_update($pdo, $restaurantId, $id);
        if ($order === null) {
            $pdo->rollBack();
            json_response([
                'success' => false,
                'message' => 'Order not found.',
            ], 404);
        }

        if (normalize_admin_order_status((string) ($order['order_status'] ?? $order['status'] ?? 'pending')) === 'cancelled') {
            $pdo->rollBack();
            json_response([
                'success' => false,
                'message' => 'Cancelled orders cannot be marked as cash received.',
            ], 422);
        }

        $calculatedTotal = calculate_order_total($order);
        if ($calculatedTotal === null || $calculatedTotal <= 0) {
            $pdo->rollBack();
            json_response([
                'success' => false,
                'message' => 'Order total is missing or zero.',
            ], 422);
        }

        $existingRevenueRow = null;
        if (table_exists($pdo, 'revenue_transactions')) {
            $revenueStatement = $pdo->prepare(
                'SELECT id, amount
                 FROM revenue_transactions
                 WHERE order_id = :order_id
                   AND restaurant_id = :restaurant_id
                 LIMIT 1 FOR UPDATE'
            );
            $revenueStatement->execute([
                'order_id' => $id,
                'restaurant_id' => $restaurantId,
            ]);
            $existingRevenueRow = $revenueStatement->fetch() ?: null;
        }

        if ($existingRevenueRow !== null || is_cash_received_order($order)) {
            if ($existingRevenueRow === null && table_exists($pdo, 'revenue_transactions')) {
                $existingAmount = money_value($order['revenue_amount'] ?? null);
                $transactionAmount = $existingAmount !== null && $existingAmount > 0 ? $existingAmount : $calculatedTotal;
                $insertRevenue = $pdo->prepare(
                    'INSERT INTO revenue_transactions
                        (restaurant_id, order_id, type, amount, payment_method)
                     VALUES
                        (:restaurant_id, :order_id, :type, :amount, :payment_method)'
                );
                $insertRevenue->execute([
                    'restaurant_id' => $restaurantId,
                    'order_id' => $id,
                    'type' => 'cash_received',
                    'amount' => $transactionAmount,
                    'payment_method' => 'cash',
                ]);
            }

            if (money_value($order['revenue_amount'] ?? null) === null || money_value($order['revenue_amount'] ?? null) <= 0) {
                $orderUpdate = $pdo->prepare(
                    'UPDATE orders
                     SET payment_status = :payment_status,
                         cash_received_at = COALESCE(cash_received_at, NOW()),
                         revenue_posted_at = COALESCE(revenue_posted_at, NOW()),
                         revenue_amount = CASE
                             WHEN revenue_amount IS NULL OR revenue_amount <= 0 THEN :revenue_amount
                             ELSE revenue_amount
                         END,
                         updated_at = NOW()
                     WHERE id = :id
                       AND restaurant_id = :restaurant_id'
                );
                $orderUpdate->execute([
                    'payment_status' => 'cash_received',
                    'revenue_amount' => $existingRevenueRow['amount'] ?? $calculatedTotal,
                    'id' => $id,
                    'restaurant_id' => $restaurantId,
                ]);
            }

            $pdo->commit();

            $updatedOrder = order_snapshot($pdo, $restaurantId, $id);
            $normalized = $updatedOrder !== null ? normalize_admin_order($updatedOrder) : null;

            json_response([
                'success' => true,
                'message' => 'Cash received was already recorded for this order.',
                'already_recorded' => true,
                'data' => $normalized,
                'order' => $normalized,
                'revenue_total' => revenue_total_for_restaurant($pdo, $restaurantId),
            ]);
        }

        if (table_exists($pdo, 'revenue_transactions')) {
            $insertRevenue = $pdo->prepare(
                'INSERT INTO revenue_transactions
                    (restaurant_id, order_id, type, amount, payment_method)
                 VALUES
                    (:restaurant_id, :order_id, :type, :amount, :payment_method)'
            );
            $insertRevenue->execute([
                'restaurant_id' => $restaurantId,
                'order_id' => $id,
                'type' => 'cash_received',
                'amount' => $calculatedTotal,
                'payment_method' => 'cash',
            ]);
        }

        $orderUpdate = $pdo->prepare(
            'UPDATE orders
             SET payment_status = :payment_status,
                 cash_received_at = NOW(),
                 revenue_posted_at = NOW(),
                 revenue_amount = :revenue_amount,
                 updated_at = NOW()
             WHERE id = :id
               AND restaurant_id = :restaurant_id'
        );
        $orderUpdate->execute([
            'payment_status' => 'cash_received',
            'revenue_amount' => $calculatedTotal,
            'id' => $id,
            'restaurant_id' => $restaurantId,
        ]);

        $pdo->commit();
    } catch (Throwable $throwable) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }

        if (is_duplicate_key_error($throwable)) {
            $updatedOrder = order_snapshot($pdo, $restaurantId, $id);
            $normalized = $updatedOrder !== null ? normalize_admin_order($updatedOrder) : null;

            json_response([
                'success' => true,
                'message' => 'Cash received was already recorded for this order.',
                'already_recorded' => true,
                'data' => $normalized,
                'order' => $normalized,
                'revenue_total' => revenue_total_for_restaurant($pdo, $restaurantId),
            ]);
        }

        json_response([
            'success' => false,
            'message' => 'Unable to record cash received right now.',
        ], 500);
    }

    $updatedOrder = order_snapshot($pdo, $restaurantId, $id);
    $normalized = $updatedOrder !== null ? normalize_admin_order($updatedOrder) : null;

    json_response([
        'success' => true,
        'message' => 'Cash received recorded successfully.',
        'data' => $normalized,
        'order' => $normalized,
        'revenue_total' => revenue_total_for_restaurant($pdo, $restaurantId),
    ]);
}

function normalize_admin_order_status(string $status): string
{
    $normalized = strtolower(trim($status));

    if ($normalized === 'completed') {
        return 'delivered';
    }

    if (in_array($normalized, ['accepted', 'preparing'], true)) {
        return 'pending';
    }

    return in_array($normalized, ['pending', 'delivered', 'cancelled'], true)
        ? $normalized
        : 'pending';
}

function normalize_admin_order_items(array $items): array
{
    $normalizedItems = [];

    foreach ($items as $item) {
        if (!is_array($item)) {
            continue;
        }

        $foodName = trim((string) (
            $item['food_name']
            ?? $item['menu_item_name']
            ?? $item['item_name']
            ?? $item['name']
            ?? ''
        ));
        $foodImage = trim((string) (
            normalize_image_path_value($item['food_image'] ?? '')
            ?: normalize_image_path_value($item['image'] ?? '')
            ?: normalize_image_path_value($item['menu_image'] ?? '')
            ?: normalize_image_path_value($item['menu_item_image'] ?? '')
            ?: normalize_image_path_value($item['item_image'] ?? '')
        ));
        $quantity = strict_positive_int($item['quantity'] ?? 1) ?? 1;
        $unitPrice = isset($item['unit_price']) && is_numeric($item['unit_price'])
            ? (float) $item['unit_price']
            : null;

        $normalizedItems[] = [
            'menu_item_id' => strict_positive_int($item['menu_item_id'] ?? null),
            'food_name' => $foodName,
            'food_image' => $foodImage,
            'image' => $foodImage,
            'quantity' => $quantity,
            'unit_price' => $unitPrice,
            'menu_item_price' => isset($item['menu_item_price']) && is_numeric($item['menu_item_price'])
                ? (float) $item['menu_item_price']
                : null,
        ];
    }

    return $normalizedItems;
}

function normalize_admin_order(array $order, array $items = []): array
{
    $normalizedItems = normalize_admin_order_items($items ?: ($order['items'] ?? []));
    $primaryItem = $normalizedItems[0] ?? [];
    $displayStatus = normalize_admin_order_status((string) ($order['order_status'] ?? $order['status'] ?? 'pending'));
    $foodName = trim((string) ($primaryItem['food_name'] ?? $order['food_item'] ?? ''));
    $foodImage = trim((string) ($primaryItem['food_image'] ?? $primaryItem['image'] ?? $order['food_image'] ?? $order['image'] ?? ''));
    $orderTotal = calculate_order_total([
        'items' => $normalizedItems,
        'total_amount' => $order['total_amount'] ?? null,
    ]);

    return [
        'id' => (int) ($order['id'] ?? 0),
        'restaurant_id' => (int) ($order['restaurant_id'] ?? 0),
        'customer_name' => (string) ($order['customer_name'] ?? ''),
        'customer_phone' => (string) ($order['customer_phone'] ?? ''),
        'phone' => (string) ($order['customer_phone'] ?? $order['phone'] ?? ''),
        'customer_email' => $order['customer_email'] ?? null,
        'customer_address' => (string) ($order['customer_address'] ?? ''),
        'address' => (string) ($order['customer_address'] ?? $order['address'] ?? ''),
        'order_type' => (string) ($order['order_type'] ?? 'delivery'),
        'subtotal' => $order['subtotal'] ?? 0,
        'discount_amount' => $order['discount_amount'] ?? 0,
        'delivery_charge' => $order['delivery_charge'] ?? 0,
        'total_amount' => $order['total_amount'] ?? 0,
        'payment_method' => (string) ($order['payment_method'] ?? 'cash'),
        'payment_status' => (string) ($order['payment_status'] ?? 'unpaid'),
        'cash_received_at' => $order['cash_received_at'] ?? null,
        'revenue_posted_at' => $order['revenue_posted_at'] ?? null,
        'revenue_amount' => $order['revenue_amount'] ?? null,
        'order_status' => $displayStatus,
        'status' => $displayStatus,
        'note' => (string) ($order['note'] ?? ''),
        'message' => (string) ($order['note'] ?? $order['message'] ?? ''),
        'food_item' => $foodName,
        'food_image' => $foodImage,
        'image' => $foodImage,
        'order_total' => $orderTotal,
        'created_at' => (string) ($order['created_at'] ?? ''),
        'updated_at' => (string) ($order['updated_at'] ?? ''),
        'items' => $normalizedItems,
    ];
}

function update_order_status(PDO $pdo, int $restaurantId, array $payload): array
{
    require_admin_write_access();

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

    $status = strtolower(trim((string) ($payload['status'] ?? '')));
    if (!in_array($status, ['pending', 'delivered', 'cancelled'], true)) {
        json_response([
            'success' => false,
            'message' => 'Invalid order status',
        ], 422);
    }

    $persistedStatus = $status === 'delivered' ? 'completed' : $status;
    $statement = $pdo->prepare(
        'UPDATE orders
         SET order_status = :order_status,
             updated_at = NOW()
         WHERE id = :id
           AND restaurant_id = :restaurant_id'
    );
    $statement->execute([
        'order_status' => $persistedStatus,
        'id' => $id,
        'restaurant_id' => $restaurantId,
    ]);

    $updated = order_snapshot($pdo, $restaurantId, $id);
    if ($updated === null) {
        json_response([
            'success' => false,
            'message' => 'Order not found.',
        ], 404);
    }

    $normalized = normalize_admin_order($updated);

    json_response([
        'success' => true,
        'message' => 'Order status updated successfully',
        'status' => $status,
        'data' => $normalized,
        'order' => $normalized,
    ]);
}

function menu_item_snapshot(PDO $pdo, int $restaurantId, int $menuItemId): ?array
{
    $statement = $pdo->prepare(
        'SELECT
            id,
            name,
            image,
            price
         FROM menu_items
         WHERE id = :id
           AND restaurant_id = :restaurant_id
           AND status = "active"
           AND is_available = 1
         LIMIT 1'
    );
    $statement->execute([
        'id' => $menuItemId,
        'restaurant_id' => $restaurantId,
    ]);

    $row = $statement->fetch();

    return $row ?: null;
}

function order_payload(array $payload): array
{
    $status = $payload['order_status'] ?? ($payload['status'] ?? 'pending');
    $hasQuantity = array_key_exists('quantity', $payload);
    $quantity = strict_positive_int($hasQuantity ? $payload['quantity'] : 1);
    $hasAddress = array_key_exists('customer_address', $payload) || array_key_exists('address', $payload);
    $customerAddress = trim((string) ($payload['customer_address'] ?? ($payload['address'] ?? '')));

    return [
        'customer_name' => trim((string) ($payload['customer_name'] ?? '')),
        'customer_phone' => trim((string) ($payload['customer_phone'] ?? ($payload['phone'] ?? ''))),
        'customer_email' => trim((string) ($payload['customer_email'] ?? ($payload['email'] ?? ''))),
        'customer_address' => $customerAddress,
        'customer_address_error' => strlen($customerAddress) < 5 ? 'Address must be at least 5 characters long.' : null,
        'order_type' => status_or_default($payload['order_type'] ?? 'delivery', 'delivery', ['dine_in', 'takeaway', 'delivery']),
        'quantity' => $quantity ?? 1,
        'quantity_error' => $hasQuantity && $quantity === null ? 'Quantity must be a whole number of 1 or greater.' : null,
        'subtotal' => is_numeric($payload['subtotal'] ?? null) ? (float) $payload['subtotal'] : null,
        'discount_amount' => is_numeric($payload['discount_amount'] ?? null) ? max(0, (float) $payload['discount_amount']) : 0.00,
        'delivery_charge' => is_numeric($payload['delivery_charge'] ?? null) ? max(0, (float) $payload['delivery_charge']) : 0.00,
        'total_amount' => is_numeric($payload['total_amount'] ?? null) ? max(0, (float) $payload['total_amount']) : null,
        'payment_method' => status_or_default($payload['payment_method'] ?? 'cash', 'cash', ['cash', 'bkash', 'nagad', 'card', 'other']),
        'payment_status' => status_or_default($payload['payment_status'] ?? 'unpaid', 'unpaid', ['unpaid', 'paid', 'partial', 'cash_received', 'refunded']),
        'order_status' => status_or_default($status, 'pending', ['pending', 'accepted', 'preparing', 'completed', 'cancelled']),
        'note' => trim((string) ($payload['note'] ?? ($payload['message'] ?? ''))),
        'food_item' => trim((string) ($payload['food_item'] ?? '')),
        'items' => $payload['items'] ?? $payload['order_items'] ?? null,
    ];
}

function normalize_order_items_payload(PDO $pdo, int $restaurantId, mixed $itemsPayload, string $fallbackFoodItem, int $fallbackQuantity = 1): array
{
    $itemsPayload = is_array($itemsPayload) ? $itemsPayload : [];

    if (empty($itemsPayload) && $fallbackFoodItem !== '') {
        $itemsPayload = [
            [
                'food_name' => $fallbackFoodItem,
                'item_name' => $fallbackFoodItem,
                'quantity' => max(1, $fallbackQuantity),
                'unit_price' => 0,
                'total_price' => 0,
                'food_image' => null,
                'item_image' => null,
            ],
        ];
    }

    $items = [];

    foreach ($itemsPayload as $rawItem) {
        if (!is_array($rawItem)) {
            continue;
        }

        $menuItemId = strict_positive_int($rawItem['menu_item_id'] ?? null);
        $quantity = strict_positive_int($rawItem['quantity'] ?? 1);
        if ($quantity === null) {
            throw new InvalidArgumentException('Each order item quantity must be a whole number of 1 or greater.');
        }

        $itemName = trim((string) (
            $rawItem['food_name']
            ?? $rawItem['item_name']
            ?? $rawItem['name']
            ?? ''
        ));
        $itemImage = normalize_image_path_value(
            $rawItem['food_image']
            ?? $rawItem['image']
            ?? $rawItem['menu_image']
            ?? $rawItem['item_image']
            ?? ''
        );
        $unitPrice = isset($rawItem['unit_price']) && is_numeric($rawItem['unit_price'])
            ? (float) $rawItem['unit_price']
            : null;

        if ($menuItemId !== null) {
            $menuItem = menu_item_snapshot($pdo, $restaurantId, $menuItemId);

            if (!$menuItem) {
                throw new InvalidArgumentException('One of the selected menu items is not valid for this restaurant.');
            }

            if ($itemName === '') {
                $itemName = (string) $menuItem['name'];
            }

            if ($itemImage === '') {
                $itemImage = normalize_image_path_value($menuItem['image'] ?? '');
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
            'food_name' => $itemName,
            'item_name' => $itemName,
            'food_image' => $itemImage !== '' ? $itemImage : null,
            'item_image' => $itemImage !== '' ? $itemImage : null,
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
$pdo = require_connection();

if ($method === 'POST') {
    $restaurant = restaurant_context();
} else {
    $restaurant = auth_admin_restaurant_context($pdo);
    ensure_order_revenue_schema($pdo);
}

$restaurantId = (int) $restaurant['restaurant_id'];

if ($method === 'GET') {
    $action = strtolower(trim((string) ($_GET['action'] ?? '')));

    if ($action === 'summary') {
        json_response([
            'success' => true,
            'data' => [
                'revenue_total' => revenue_total_for_restaurant($pdo, $restaurantId),
            ],
            'message' => 'Success',
        ]);
    }

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
            cash_received_at,
            revenue_posted_at,
            revenue_amount,
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
        $order = normalize_admin_order($order, $itemsMap[(int) $order['id']] ?? []);
    }
    unset($order);

    json_response([
        'success' => true,
        'data' => $orders,
        'orders' => $orders,
        'message' => 'Success',
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

    if (!empty($input['quantity_error'])) {
        json_response([
            'success' => false,
            'message' => $input['quantity_error'],
        ], 422);
    }

    if (!empty($input['customer_address_error'])) {
        json_response([
            'success' => false,
            'message' => $input['customer_address_error'],
        ], 422);
    }

    if ($input['customer_email'] !== '' && !filter_var($input['customer_email'], FILTER_VALIDATE_EMAIL)) {
        json_response([
            'success' => false,
            'message' => 'Please enter a valid email address.',
        ], 422);
    }

    try {
        $items = normalize_order_items_payload($pdo, $restaurantId, $input['items'], $input['food_item'], (int) $input['quantity']);
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
                    (order_id, menu_item_id, food_name, food_image, item_name, item_image, quantity, unit_price, total_price)
                 VALUES
                    (:order_id, :menu_item_id, :food_name, :food_image, :item_name, :item_image, :quantity, :unit_price, :total_price)'
            );
            $itemStatement->execute([
                'order_id' => $orderId,
                'menu_item_id' => $item['menu_item_id'],
                'food_name' => $item['food_name'],
                'food_image' => $item['food_image'],
                'item_name' => $item['item_name'],
                'item_image' => $item['item_image'],
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

        json_response([
            'success' => false,
            'message' => 'Unable to save the order right now.',
        ], 500);
    }

    json_response([
        'success' => true,
        'data' => normalize_admin_order(order_snapshot($pdo, $restaurantId, $orderId) ?? []),
        'message' => 'Order created successfully.',
    ], 201);
}

if ($method === 'PUT') {
    $payload = request_payload();
    $action = strtolower(trim((string) ($payload['action'] ?? ($_GET['action'] ?? ''))));

    if ($action === 'update_status') {
        update_order_status($pdo, $restaurantId, $payload);
    }

    if ($action === 'cash_received') {
        cash_received_order($pdo, $restaurantId, $payload);
    }

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
        'data' => normalize_admin_order(order_snapshot($pdo, $restaurantId, $id) ?? []),
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
