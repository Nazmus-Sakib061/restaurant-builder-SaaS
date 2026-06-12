<?php
declare(strict_types=1);

require_once __DIR__ . '/_helpers.php';

const UPLOAD_MAX_BYTES = 3 * 1024 * 1024;

function upload_error(string $message, array $errors = [], int $status = 422): never
{
    $response = [
        'success' => false,
        'message' => $message,
    ];

    if ($errors !== []) {
        $response['errors'] = $errors;
    }

    json_response($response, $status);
}

function upload_mime_extensions(): array
{
    return [
        'image/jpeg' => ['jpg', 'jpeg'],
        'image/png' => ['png'],
        'image/webp' => ['webp'],
    ];
}

function upload_error_message(int $errorCode): string
{
    return match ($errorCode) {
        UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE => 'Image must be 3 MB or smaller.',
        UPLOAD_ERR_PARTIAL => 'Image upload was interrupted. Please try again.',
        UPLOAD_ERR_NO_FILE => 'Please select an image to upload.',
        default => 'Image upload failed. Please try again.',
    };
}

function upload_original_extension(string $originalName): ?string
{
    if (
        $originalName === ''
        || str_contains($originalName, "\0")
        || str_contains($originalName, '/')
        || str_contains($originalName, '\\')
    ) {
        return null;
    }

    $baseName = basename($originalName);
    if (preg_match('/\.(?:php\d*|phtml|phar|cgi|pl|py|sh|exe|html?|js|svg)(?:\.|$)/i', $baseName)) {
        return null;
    }

    $extension = strtolower((string) pathinfo($baseName, PATHINFO_EXTENSION));

    return preg_match('/^[a-z0-9]+$/', $extension) ? $extension : null;
}

function upload_target_directory(int $restaurantId, string $purpose): array
{
    $projectRoot = dirname(__DIR__, 2);
    $uploadRoot = $projectRoot . DIRECTORY_SEPARATOR . 'uploads';
    $targetDirectory = $uploadRoot
        . DIRECTORY_SEPARATOR . 'restaurants'
        . DIRECTORY_SEPARATOR . $restaurantId
        . DIRECTORY_SEPARATOR . $purpose;

    if (!is_dir($targetDirectory) && !mkdir($targetDirectory, 0755, true) && !is_dir($targetDirectory)) {
        upload_error('Upload directory is not available.', [], 500);
    }

    $resolvedRoot = realpath($uploadRoot);
    $resolvedTarget = realpath($targetDirectory);
    if (
        $resolvedRoot === false
        || $resolvedTarget === false
        || !str_starts_with($resolvedTarget . DIRECTORY_SEPARATOR, $resolvedRoot . DIRECTORY_SEPARATOR)
    ) {
        upload_error('Upload directory is not available.', [], 500);
    }

    return [$resolvedTarget, "uploads/restaurants/{$restaurantId}/{$purpose}"];
}

$method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');

if ($method !== 'POST') {
    json_response([
        'success' => false,
        'message' => 'Method not allowed.',
    ], 405);
}

require_admin_write_access();

$restaurant = restaurant_context();
$restaurantId = (int) $restaurant['restaurant_id'];
$restaurantSlug = (string) $restaurant['slug'];
$purpose = strtolower(trim((string) ($_POST['purpose'] ?? $_POST['context'] ?? $_POST['type'] ?? 'gallery')));
$slot = strtolower(trim((string) ($_POST['slot'] ?? '')));

if (!in_array($purpose, ['gallery', 'menu', 'deals', 'settings'], true)) {
    upload_error('Validation error.', [
        'purpose' => 'Invalid upload context.',
    ]);
}

if ($purpose === 'settings' && !in_array($slot, ['logo', 'hero', 'about'], true)) {
    upload_error('Validation error.', [
        'slot' => 'Invalid upload slot.',
    ]);
}

$file = $_FILES['image'] ?? null;
if (!is_array($file)) {
    upload_error('Validation error.', [
        'image' => 'Please select an image to upload.',
    ]);
}

$fileError = $file['error'] ?? null;
$fileName = $file['name'] ?? null;
$fileTemporaryPath = $file['tmp_name'] ?? null;
$fileByteSize = $file['size'] ?? null;

if (
    (!is_int($fileError) && !(is_string($fileError) && ctype_digit($fileError)))
    || !is_string($fileName)
    || !is_string($fileTemporaryPath)
    || (!is_int($fileByteSize) && !(is_string($fileByteSize) && ctype_digit($fileByteSize)))
) {
    upload_error('Validation error.', [
        'image' => 'Invalid uploaded file.',
    ]);
}

$uploadError = (int) $fileError;
if ($uploadError !== UPLOAD_ERR_OK) {
    upload_error('Validation error.', [
        'image' => upload_error_message($uploadError),
    ]);
}

$temporaryPath = $fileTemporaryPath;
$originalName = trim($fileName);
$fileSize = (int) $fileByteSize;

if ($fileSize < 1 || $fileSize > UPLOAD_MAX_BYTES) {
    upload_error('Validation error.', [
        'image' => 'Image must be 3 MB or smaller.',
    ]);
}

if ($temporaryPath === '' || !is_uploaded_file($temporaryPath)) {
    upload_error('Validation error.', [
        'image' => 'Invalid uploaded file.',
    ]);
}

$originalExtension = upload_original_extension($originalName);
if ($originalExtension === null) {
    upload_error('Validation error.', [
        'image' => 'Invalid image filename or extension.',
    ]);
}

$fileInfo = new finfo(FILEINFO_MIME_TYPE);
$detectedMime = (string) $fileInfo->file($temporaryPath);
$mimeExtensions = upload_mime_extensions();
$allowedExtensions = $mimeExtensions[$detectedMime] ?? null;

if ($allowedExtensions === null || !in_array($originalExtension, $allowedExtensions, true)) {
    upload_error('Validation error.', [
        'image' => 'Only JPG, PNG, and WebP images are allowed.',
    ]);
}

if (@getimagesize($temporaryPath) === false) {
    upload_error('Validation error.', [
        'image' => 'Uploaded file is not a valid image.',
    ]);
}

[$targetDirectory, $relativeDirectory] = upload_target_directory($restaurantId, $purpose);
$extension = $allowedExtensions[0];
$filenamePrefix = $purpose === 'settings' ? $slot : $purpose;

do {
    $fileName = sprintf(
        '%s_%s_%s.%s',
        $filenamePrefix,
        gmdate('Ymd_His'),
        bin2hex(random_bytes(6)),
        $extension
    );
    $targetPath = $targetDirectory . DIRECTORY_SEPARATOR . $fileName;
} while (file_exists($targetPath));

if (!move_uploaded_file($temporaryPath, $targetPath)) {
    upload_error('Image could not be saved. Please try again.', [], 500);
}

$relativePath = $relativeDirectory . '/' . $fileName;

json_response([
    'success' => true,
    'data' => [
        'path' => $relativePath,
        'file_name' => $fileName,
        'mime_type' => $detectedMime,
        'size' => $fileSize,
        'restaurant_id' => $restaurantId,
        'restaurant' => $restaurantSlug,
        'purpose' => $purpose,
        'slot' => $purpose === 'settings' ? $slot : null,
    ],
    'message' => 'Image uploaded successfully.',
], 201);
