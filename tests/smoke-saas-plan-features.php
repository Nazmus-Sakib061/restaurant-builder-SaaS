<?php
declare(strict_types=1);

$baseUrl = rtrim((string) (getenv('SAAS_SMOKE_BASE_URL') ?: 'http://localhost/restaurant_builder_SaaS'), '/');
$adminEmail = (string) (getenv('SAAS_SMOKE_ADMIN_EMAIL') ?: 'admin@example.com');
$adminPassword = (string) (getenv('SAAS_SMOKE_ADMIN_PASSWORD') ?: 'change-me-later');
$ownerEmail = (string) (getenv('SAAS_SMOKE_OWNER_EMAIL') ?: 'owner@example.com');
$ownerPassword = (string) (getenv('SAAS_SMOKE_OWNER_PASSWORD') ?: 'owner-change-me');
$planPrefix = (string) (getenv('SAAS_SMOKE_PLAN_PREFIX') ?: 'saas-smoke-plan');
$slugPrefix = strtolower(preg_replace('/[^a-z0-9]+/i', '-', $planPrefix) ?? 'saas-smoke-plan');
$slugPrefix = trim($slugPrefix, '-') ?: 'saas-smoke-plan';
$runId = date('His') . '-' . random_int(1000, 9999);
$tempFreeSlug = sprintf('%s-free-%s', $slugPrefix, $runId);
$tempProSlug = sprintf('%s-pro-%s', $slugPrefix, $runId);
$tempFreeName = sprintf('SAAS Smoke Plan Free %s', $runId);
$tempProName = sprintf('SAAS Smoke Plan Pro %s', $runId);

$stats = [
    'passed' => 0,
    'failed' => 0,
    'skipped' => 0,
];

$cleanupQueue = [];

function line(string $message): void
{
    fwrite(STDOUT, $message . PHP_EOL);
}

function report(array &$stats, string $label, bool $passed, string $details = ''): void
{
    if ($passed) {
        $stats['passed'] += 1;
        line('[PASS] ' . $label . ($details !== '' ? ' - ' . $details : ''));
        return;
    }

    $stats['failed'] += 1;
    line('[FAIL] ' . $label . ($details !== '' ? ' - ' . $details : ''));
}

function skip_result(array &$stats, string $label, string $details = ''): void
{
    $stats['skipped'] += 1;
    line('[SKIP] ' . $label . ($details !== '' ? ' - ' . $details : ''));
}

function build_url(string $baseUrl, string $path, array $query = []): string
{
    $url = $baseUrl . '/' . ltrim($path, '/');
    if ($query !== []) {
        $url .= '?' . http_build_query($query);
    }

    return $url;
}

function make_cookie_file(string $prefix): string
{
    $file = tempnam(sys_get_temp_dir(), $prefix);
    if ($file === false) {
        throw new RuntimeException('Unable to create a temporary cookie jar.');
    }

    return $file;
}

function request_raw(
    string $method,
    string $url,
    ?string $cookieFile = null,
    mixed $body = null,
    array $headers = [],
    string $bodyMode = 'json'
): array {
    $curl = curl_init($url);
    if ($curl === false) {
        throw new RuntimeException('Unable to initialize cURL.');
    }

    $normalizedHeaders = array_merge(['Accept: application/json'], $headers);
    $options = [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HEADER => true,
        CURLOPT_FOLLOWLOCATION => false,
        CURLOPT_CUSTOMREQUEST => strtoupper($method),
        CURLOPT_TIMEOUT => 30,
        CURLOPT_CONNECTTIMEOUT => 15,
        CURLOPT_HTTPHEADER => $normalizedHeaders,
    ];

    if ($cookieFile !== null) {
        $options[CURLOPT_COOKIEJAR] = $cookieFile;
        $options[CURLOPT_COOKIEFILE] = $cookieFile;
    }

    if ($body !== null) {
        if ($bodyMode === 'json') {
            $json = json_encode($body, JSON_UNESCAPED_SLASHES);
            if ($json === false) {
                throw new RuntimeException('Unable to encode JSON payload.');
            }
            $options[CURLOPT_POSTFIELDS] = $json;
            $options[CURLOPT_HTTPHEADER] = array_merge($normalizedHeaders, ['Content-Type: application/json']);
        } elseif ($bodyMode === 'form') {
            $options[CURLOPT_POSTFIELDS] = http_build_query($body);
            $options[CURLOPT_HTTPHEADER] = array_merge($normalizedHeaders, ['Content-Type: application/x-www-form-urlencoded']);
        } else {
            $options[CURLOPT_POSTFIELDS] = $body;
        }
    }

    curl_setopt_array($curl, $options);
    $response = curl_exec($curl);
    if ($response === false) {
        $error = curl_error($curl);
        curl_close($curl);
        throw new RuntimeException('cURL request failed: ' . $error);
    }

    $info = curl_getinfo($curl);
    curl_close($curl);

    $headerSize = (int) ($info['header_size'] ?? 0);
    $rawHeaders = substr($response, 0, $headerSize);
    $rawBody = substr($response, $headerSize);

    $decoded = null;
    $trimmedBody = trim($rawBody);
    if ($trimmedBody !== '') {
        $decoded = json_decode($trimmedBody, true);
    }

    return [
        'status' => (int) ($info['http_code'] ?? 0),
        'headers' => $rawHeaders,
        'body' => $rawBody,
        'json' => $decoded,
        'url' => $url,
    ];
}

function request_json(
    string $method,
    string $url,
    ?string $cookieFile = null,
    ?array $body = null,
    array $headers = []
): array {
    return request_raw($method, $url, $cookieFile, $body, $headers, 'json');
}

function response_json_value(array $response, string $path, mixed $default = null): mixed
{
    $value = $response['json'] ?? null;
    if (!is_array($value)) {
        return $default;
    }

    foreach (explode('.', $path) as $segment) {
        if (!is_array($value) || !array_key_exists($segment, $value)) {
            return $default;
        }
        $value = $value[$segment];
    }

    return $value;
}

function response_summary(array $response): string
{
    $json = $response['json'] ?? null;
    if (is_array($json)) {
        return json_encode($json, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) ?: '';
    }

    $body = trim((string) ($response['body'] ?? ''));
    if ($body === '') {
        return '';
    }

    return substr($body, 0, 220);
}

function assert_status(array &$stats, string $label, array $response, int $expectedStatus, string $details = ''): bool
{
    $status = (int) ($response['status'] ?? 0);
    $ok = $status === $expectedStatus;
    report($stats, $label, $ok, $ok ? $details : trim(sprintf('expected %d, got %d. %s', $expectedStatus, $status, $details)));

    return $ok;
}

function assert_json_field(array &$stats, string $label, array $response, string $path, mixed $expected, string $details = ''): bool
{
    $actual = response_json_value($response, $path, null);
    $ok = $actual === $expected;
    report(
        $stats,
        $label,
        $ok,
        $ok
            ? $details
            : trim(sprintf('expected %s, got %s. %s', var_export($expected, true), var_export($actual, true), $details))
    );

    return $ok;
}

function assert_json_truthy(array &$stats, string $label, array $response, string $path, string $details = ''): bool
{
    $actual = response_json_value($response, $path, null);
    $ok = (bool) $actual;
    report(
        $stats,
        $label,
        $ok,
        $ok ? $details : trim(sprintf('missing or falsey value at %s. %s', $path, $details))
    );

    return $ok;
}

function assert_contains(array &$stats, string $label, string $haystack, string $needle, string $details = ''): bool
{
    $ok = str_contains($haystack, $needle);
    report($stats, $label, $ok, $ok ? $details : trim(sprintf('missing %s. %s', $needle, $details)));

    return $ok;
}

function delete_restaurant_by_id(array &$stats, string $baseUrl, string $cookieFile, int $restaurantId, string $label): void
{
    $response = request_json(
        'DELETE',
        build_url($baseUrl, 'backend/api/restaurants.php'),
        $cookieFile,
        ['id' => $restaurantId]
    );

    assert_status($stats, $label, $response, 200);
}

function create_temp_restaurant(
    array &$stats,
    string $baseUrl,
    string $cookieFile,
    string $name,
    string $slug
): ?array {
    $response = request_json(
        'POST',
        build_url($baseUrl, 'backend/api/restaurants.php'),
        $cookieFile,
        [
            'name' => $name,
            'slug' => $slug,
            'business_type' => 'restaurant',
            'status' => 'active',
        ]
    );

    if (!assert_status($stats, sprintf('Create restaurant %s', $slug), $response, 201)) {
        line('  ' . response_summary($response));
        return null;
    }

    $restaurantId = (int) response_json_value($response, 'data.id', 0);
    if ($restaurantId < 1) {
        report($stats, sprintf('Restaurant id returned for %s', $slug), false, 'Missing id in response.');
        return null;
    }

    line(sprintf('[INFO] Created %s (id=%d)', $slug, $restaurantId));

    return [
        'id' => $restaurantId,
        'slug' => $slug,
        'name' => $name,
    ];
}

function assign_plan(
    array &$stats,
    string $baseUrl,
    string $cookieFile,
    int $restaurantId,
    string $planSlug,
    string $label
): ?array {
    $response = request_json(
        'PATCH',
        build_url($baseUrl, 'backend/api/restaurant-plans.php'),
        $cookieFile,
        [
            'restaurant_id' => $restaurantId,
            'plan_slug' => $planSlug,
        ]
    );

    if (!assert_status($stats, $label, $response, 200)) {
        line('  ' . response_summary($response));
        return null;
    }

    $returnedPlanSlug = (string) response_json_value($response, 'data.plan.slug', '');
    if ($returnedPlanSlug !== $planSlug) {
        report($stats, $label . ' returned plan slug', false, sprintf('expected %s, got %s', $planSlug, $returnedPlanSlug));
        return null;
    }

    return $response;
}

function select_restaurant(
    array &$stats,
    string $baseUrl,
    string $cookieFile,
    string $slug,
    string $label
): ?array {
    $response = request_json(
        'POST',
        build_url($baseUrl, 'backend/api/select-restaurant.php'),
        $cookieFile,
        [
            'restaurant_slug' => $slug,
        ]
    );

    if (!assert_status($stats, $label, $response, 200)) {
        line('  ' . response_summary($response));
        return null;
    }

    if ((string) response_json_value($response, 'data.active_restaurant.slug', '') !== $slug) {
        report($stats, $label . ' active tenant', false, sprintf('expected %s', $slug));
        return null;
    }

    return $response;
}

function settings_write_blocked_check(
    array &$stats,
    string $baseUrl,
    string $cookieFile,
    string $slug,
    string $expectedTitle
): void {
    $response = request_json(
        'PUT',
        build_url($baseUrl, 'backend/api/settings.php', ['restaurant' => $slug]),
        $cookieFile,
        [
            'site_title' => $expectedTitle,
        ]
    );

    $statusOk = assert_status($stats, sprintf('Settings write blocked for %s', $slug), $response, 403);
    $errorOk = (string) response_json_value($response, 'error', '') === 'feature_locked';

    report(
        $stats,
        sprintf('Settings feature lock payload for %s', $slug),
        $statusOk && $errorOk,
        $errorOk ? '' : sprintf('response: %s', response_summary($response))
    );
}

function gallery_create_check(
    array &$stats,
    string $baseUrl,
    string $cookieFile,
    string $slug,
    int $expectedStatus,
    string $label
): void {
    $response = request_json(
        'POST',
        build_url($baseUrl, 'backend/api/gallery.php', ['restaurant' => $slug]),
        $cookieFile,
        [
            'title' => 'Smoke Gallery Item',
            'caption' => 'Smoke caption',
            'image' => 'images/Pizza/pizza 1.png',
            'alt_text' => 'Smoke alt text',
            'sort_order' => 0,
            'status' => 'active',
        ]
    );

    assert_status($stats, $label, $response, $expectedStatus);

    if ($expectedStatus === 201) {
        assert_json_truthy($stats, $label . ' response id', $response, 'data.id');
    } else {
        report(
            $stats,
            $label . ' feature lock payload',
            (string) response_json_value($response, 'error', '') === 'feature_locked',
            'response: ' . response_summary($response)
        );
    }
}

function deals_create_check(
    array &$stats,
    string $baseUrl,
    string $cookieFile,
    string $slug,
    int $expectedStatus,
    string $label
): void {
    $response = request_json(
        'POST',
        build_url($baseUrl, 'backend/api/deals.php', ['restaurant' => $slug]),
        $cookieFile,
        [
            'title' => 'Smoke Deal',
            'description' => 'Smoke deal description',
            'regular_price' => 19.99,
            'deal_price' => 9.99,
            'image' => 'images/Pizza/pizza 1.png',
            'badge_text' => 'Smoke',
            'sort_order' => 0,
            'status' => 'active',
        ]
    );

    assert_status($stats, $label, $response, $expectedStatus);

    if ($expectedStatus === 201) {
        assert_json_truthy($stats, $label . ' response id', $response, 'data.id');
    } else {
        report(
            $stats,
            $label . ' feature lock payload',
            (string) response_json_value($response, 'error', '') === 'feature_locked',
            'response: ' . response_summary($response)
        );
    }
}

function site_data_check(
    array &$stats,
    string $baseUrl,
    string $slug,
    int $expectedStatus,
    ?int $expectedDeals = null,
    ?int $expectedGallery = null
): void {
    $response = request_json(
        'GET',
        build_url($baseUrl, 'backend/api/site-data.php', ['tenant' => $slug])
    );

    assert_status($stats, sprintf('site-data.php?tenant=%s', $slug), $response, $expectedStatus);

    if ($expectedStatus !== 200) {
        return;
    }

    assert_json_truthy($stats, sprintf('%s site-data success', $slug), $response, 'success');
    if ($expectedDeals !== null) {
        $actualDeals = count((array) response_json_value($response, 'data.deals', []));
        report(
            $stats,
            sprintf('%s deals count', $slug),
            $actualDeals === $expectedDeals,
            sprintf('expected %d, got %d', $expectedDeals, $actualDeals)
        );
    }
    if ($expectedGallery !== null) {
        $actualGallery = count((array) response_json_value($response, 'data.gallery', []));
        report(
            $stats,
            sprintf('%s gallery count', $slug),
            $actualGallery === $expectedGallery,
            sprintf('expected %d, got %d', $expectedGallery, $actualGallery)
        );
    }
}

function cleanup_temp_tenants(
    array &$stats,
    string $baseUrl,
    string $cookieFile,
    array $cleanupQueue
): void {
    foreach ($cleanupQueue as $cleanupItem) {
        if (!is_array($cleanupItem) || (int) ($cleanupItem['id'] ?? 0) < 1) {
            continue;
        }

        $slug = (string) ($cleanupItem['slug'] ?? '');
        $restaurantId = (int) $cleanupItem['id'];

        delete_restaurant_by_id(
            $stats,
            $baseUrl,
            $cookieFile,
            $restaurantId,
            sprintf('Archive temp tenant %s', $slug)
        );

        $siteDataResponse = request_json(
            'GET',
            build_url($baseUrl, 'backend/api/site-data.php', ['tenant' => $slug])
        );
        assert_status($stats, sprintf('Inactive tenant %s returns 404', $slug), $siteDataResponse, 404);
    }
}

try {
    line(sprintf('Smoke base URL: %s', $baseUrl));
    line(sprintf('Run id: %s', $runId));

    $adminSession = make_cookie_file('saas_admin_cookie_');
    $ownerSession = make_cookie_file('saas_owner_cookie_');

    $homepage = request_raw('GET', build_url($baseUrl, 'index.html'));
    assert_status($stats, 'Homepage returned 200', $homepage, 200);

    $adminLoginPage = request_raw('GET', build_url($baseUrl, 'admin/login.php'));
    assert_status($stats, 'Admin login page returned 200', $adminLoginPage, 200);

    $defaultSiteData = request_json('GET', build_url($baseUrl, 'backend/api/site-data.php', ['tenant' => 'default']));
    assert_status($stats, 'site-data default returned 200', $defaultSiteData, 200);
    assert_json_truthy($stats, 'site-data default success', $defaultSiteData, 'success');
    assert_json_field($stats, 'site-data default slug', $defaultSiteData, 'data.restaurant.slug', 'default');

    $demoSiteData = request_json('GET', build_url($baseUrl, 'backend/api/site-data.php', ['tenant' => 'demo-coffee-house']));
    assert_status($stats, 'site-data demo-coffee-house returned 200', $demoSiteData, 200);
    assert_json_truthy($stats, 'site-data demo success', $demoSiteData, 'success');
    assert_json_field($stats, 'site-data demo slug', $demoSiteData, 'data.restaurant.slug', 'demo-coffee-house');

    $adminLogin = request_json(
        'POST',
        build_url($baseUrl, 'backend/api/auth.php'),
        $adminSession,
        [
            'email' => $adminEmail,
            'password' => $adminPassword,
        ]
    );
    assert_status($stats, 'Admin login returned 200', $adminLogin, 200);
    assert_json_truthy($stats, 'Admin login success', $adminLogin, 'success');
    assert_json_field($stats, 'Admin login email', $adminLogin, 'data.user.email', $adminEmail);
    assert_json_truthy($stats, 'Admin login super-admin role', $adminLogin, 'data.user.is_super_admin');

    $dashboard = request_raw('GET', build_url($baseUrl, 'admin/dashboard.php'), $adminSession);
    assert_status($stats, 'Admin dashboard returned 200', $dashboard, 200);
    assert_contains($stats, 'Dashboard feature card present', (string) ($dashboard['body'] ?? ''), 'featureAccessCard');
    assert_contains($stats, 'Dashboard settings note present', (string) ($dashboard['body'] ?? ''), 'settingsAccessNote');

    $currentUserBefore = request_json('GET', build_url($baseUrl, 'backend/api/current-user.php'), $adminSession);
    assert_status($stats, 'current-user before selection returned 200', $currentUserBefore, 200);
    assert_json_truthy($stats, 'current-user before selection has user', $currentUserBefore, 'data.user.id');

    $selectedDefault = select_restaurant($stats, $baseUrl, $adminSession, 'default', 'Select default tenant');
    if ($selectedDefault !== null) {
        assert_json_field($stats, 'Selected default tenant slug', $selectedDefault, 'data.active_restaurant.slug', 'default');
    }

    $currentUserAfterDefault = request_json('GET', build_url($baseUrl, 'backend/api/current-user.php'), $adminSession);
    assert_status($stats, 'current-user after default selection returned 200', $currentUserAfterDefault, 200);
    assert_json_field($stats, 'current-user active tenant slug', $currentUserAfterDefault, 'data.active_restaurant.slug', 'default');
    assert_json_truthy($stats, 'current-user active tenant id after selection', $currentUserAfterDefault, 'data.active_restaurant_id');
    $defaultActiveRestaurantId = (int) response_json_value($currentUserAfterDefault, 'data.active_restaurant_id', 0);

    $unauthorizedCategoryWrite = request_json(
        'POST',
        build_url($baseUrl, 'backend/api/categories.php', ['tenant' => 'default']),
        null,
        [
            'name' => 'Smoke Category',
        ]
    );
    assert_status($stats, 'Unauthorized category write blocked', $unauthorizedCategoryWrite, 401);

    $ownerLogin = request_json(
        'POST',
        build_url($baseUrl, 'backend/api/auth.php'),
        $ownerSession,
        [
            'email' => $ownerEmail,
            'password' => $ownerPassword,
        ]
    );
    assert_status($stats, 'Owner login returned 200', $ownerLogin, 200);
    assert_json_truthy($stats, 'Owner login success', $ownerLogin, 'success');
    assert_json_truthy($stats, 'Owner login normalized role', $ownerLogin, 'data.user.is_restaurant_owner');

    $ownerCrossTenant = request_json(
        'POST',
        build_url($baseUrl, 'backend/api/select-restaurant.php'),
        $ownerSession,
        [
            'restaurant_slug' => 'demo-coffee-house',
        ]
    );
    assert_status($stats, 'Owner cross-tenant select blocked', $ownerCrossTenant, 403);

    $freeRestaurant = create_temp_restaurant($stats, $baseUrl, $adminSession, $tempFreeName, $tempFreeSlug);
    if ($freeRestaurant !== null) {
        $cleanupQueue[] = $freeRestaurant;
        assign_plan($stats, $baseUrl, $adminSession, (int) $freeRestaurant['id'], 'free', 'Assign free plan to temp tenant');
    }

    $proRestaurant = create_temp_restaurant($stats, $baseUrl, $adminSession, $tempProName, $tempProSlug);
    if ($proRestaurant !== null) {
        $cleanupQueue[] = $proRestaurant;
        assign_plan($stats, $baseUrl, $adminSession, (int) $proRestaurant['id'], 'pro', 'Assign pro plan to temp tenant');
    }

    if ($freeRestaurant !== null) {
        $freeSelect = select_restaurant($stats, $baseUrl, $adminSession, $tempFreeSlug, 'Select temp free tenant');
        if ($freeSelect !== null) {
            assert_json_field($stats, 'Temp free tenant active slug', $freeSelect, 'data.active_restaurant.slug', $tempFreeSlug);
            assert_json_field($stats, 'Temp free tenant plan slug', $freeSelect, 'data.plan.slug', 'free');
        }

        $currentFree = request_json('GET', build_url($baseUrl, 'backend/api/current-user.php'), $adminSession);
        assert_status($stats, 'current-user free plan returned 200', $currentFree, 200);
        assert_json_field($stats, 'current-user free active slug', $currentFree, 'data.active_restaurant.slug', $tempFreeSlug);
        assert_json_field($stats, 'current-user free plan slug', $currentFree, 'data.plan.slug', 'free');

        $settingsFreeRead = request_json(
            'GET',
            build_url($baseUrl, 'backend/api/settings.php', ['restaurant' => $tempFreeSlug]),
            $adminSession
        );
        assert_status($stats, 'settings.php free read returned 200', $settingsFreeRead, 200);
        assert_json_field($stats, 'settings.php free read slug', $settingsFreeRead, 'data.restaurant.slug', $tempFreeSlug);

        settings_write_blocked_check($stats, $baseUrl, $adminSession, $tempFreeSlug, 'Smoke Title Free');
        gallery_create_check($stats, $baseUrl, $adminSession, $tempFreeSlug, 403, 'Free plan gallery create blocked');
        deals_create_check($stats, $baseUrl, $adminSession, $tempFreeSlug, 403, 'Free plan deals create blocked');
        site_data_check($stats, $baseUrl, $tempFreeSlug, 200, 0, 0);
    }

    if ($proRestaurant !== null) {
        $proSelect = select_restaurant($stats, $baseUrl, $adminSession, $tempProSlug, 'Select temp pro tenant');
        if ($proSelect !== null) {
            assert_json_field($stats, 'Temp pro tenant active slug', $proSelect, 'data.active_restaurant.slug', $tempProSlug);
            assert_json_field($stats, 'Temp pro tenant plan slug', $proSelect, 'data.plan.slug', 'pro');
        }

        $currentPro = request_json('GET', build_url($baseUrl, 'backend/api/current-user.php'), $adminSession);
        assert_status($stats, 'current-user pro plan returned 200', $currentPro, 200);
        assert_json_field($stats, 'current-user pro active slug', $currentPro, 'data.active_restaurant.slug', $tempProSlug);
        assert_json_field($stats, 'current-user pro plan slug', $currentPro, 'data.plan.slug', 'pro');

        $settingsProRead = request_json(
            'GET',
            build_url($baseUrl, 'backend/api/settings.php', ['restaurant' => $tempProSlug]),
            $adminSession
        );
        assert_status($stats, 'settings.php pro read returned 200', $settingsProRead, 200);
        assert_json_field($stats, 'settings.php pro read slug', $settingsProRead, 'data.restaurant.slug', $tempProSlug);

        $settingsProWrite = request_json(
            'PUT',
            build_url($baseUrl, 'backend/api/settings.php', ['restaurant' => $tempProSlug]),
            $adminSession,
            [
                'site_title' => 'Smoke Title Pro',
            ]
        );
        assert_status($stats, 'Settings write allowed for pro plan', $settingsProWrite, 200);
        assert_json_field($stats, 'Settings write pro title', $settingsProWrite, 'data.settings.site_title', 'Smoke Title Pro');

        gallery_create_check($stats, $baseUrl, $adminSession, $tempProSlug, 201, 'Pro plan gallery create allowed');
        deals_create_check($stats, $baseUrl, $adminSession, $tempProSlug, 201, 'Pro plan deals create allowed');
        site_data_check($stats, $baseUrl, $tempProSlug, 200, 1, 1);
    }

    if ($defaultActiveRestaurantId > 0) {
        $restoreDefault = select_restaurant($stats, $baseUrl, $adminSession, 'default', 'Restore default tenant');
        if ($restoreDefault !== null) {
            assert_json_field($stats, 'Restored default tenant slug', $restoreDefault, 'data.active_restaurant.slug', 'default');
        }
    }

    cleanup_temp_tenants($stats, $baseUrl, $adminSession, $cleanupQueue);

    line(sprintf('Summary: %d passed, %d failed, %d skipped', $stats['passed'], $stats['failed'], $stats['skipped']));

    foreach ([$adminSession, $ownerSession] as $cookieFile) {
        if (is_string($cookieFile) && $cookieFile !== '' && file_exists($cookieFile)) {
            @unlink($cookieFile);
        }
    }
} catch (Throwable $throwable) {
    report($stats, 'Smoke script fatal error', false, $throwable->getMessage());
    line(sprintf('Summary: %d passed, %d failed, %d skipped', $stats['passed'], $stats['failed'], $stats['skipped']));
    exit(1);
}

if ($stats['failed'] > 0) {
    exit(1);
}

exit(0);
