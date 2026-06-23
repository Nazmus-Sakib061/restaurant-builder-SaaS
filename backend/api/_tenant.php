<?php
declare(strict_types=1);

function tenant_default_slug(): string
{
    return 'default';
}

function tenant_legacy_slug_aliases(): array
{
    return [
        'demo-pizza-house' => tenant_default_slug(),
    ];
}

function tenant_slug_is_valid(string $slug): bool
{
    return (bool) preg_match('/^[a-z0-9]+(?:-[a-z0-9]+)*$/', $slug);
}

function tenant_normalize_slug(mixed $value): string
{
    $candidate = trim((string) $value);

    if ($candidate === '') {
        return '';
    }

    return function_exists('mb_strtolower') ? mb_strtolower($candidate) : strtolower($candidate);
}

function tenant_canonical_slug(string $slug): string
{
    $normalized = tenant_normalize_slug($slug);

    if ($normalized === '') {
        return '';
    }

    $aliases = tenant_legacy_slug_aliases();

    return $aliases[$normalized] ?? $normalized;
}

function tenant_requested_slug(mixed $override = null): string
{
    if ($override !== null) {
        $candidate = tenant_canonical_slug((string) $override);
        if ($candidate !== '') {
            return $candidate;
        }
    }

    $requestCandidates = [
        $_GET['tenant'] ?? null,
        $_POST['tenant'] ?? null,
        $_GET['restaurant'] ?? null,
        $_POST['restaurant'] ?? null,
    ];

    foreach ($requestCandidates as $candidate) {
        $resolved = tenant_canonical_slug((string) $candidate);
        if ($resolved !== '') {
            return $resolved;
        }
    }

    return tenant_default_slug();
}

function tenant_cache_key(string $prefix, array $query = [], mixed $override = null): string
{
    $tenantSlug = tenant_requested_slug($override);
    ksort($query);

    return sprintf(
        '%s:%s:%s',
        $prefix,
        $tenantSlug,
        hash('sha256', json_encode($query, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) ?: '{}')
    );
}
