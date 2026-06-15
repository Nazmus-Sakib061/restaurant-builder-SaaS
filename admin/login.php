<?php
declare(strict_types=1);

require_once __DIR__ . '/../backend/api/_helpers.php';

$pdo = db();
if ($pdo instanceof PDO && auth_current_user($pdo) !== null) {
    header('Location: dashboard.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Pizza House admin login for secure restaurant management.">
  <title>Pizza House Admin | Login</title>
  <link rel="stylesheet" href="assets/css/admin.css?v=auth-foundation-1">
</head>
<body class="admin-page">
  <main class="auth-shell">
    <section class="auth-intro">
      <a class="admin-brand" href="../index.html">
        <span class="admin-brand__mark" aria-hidden="true">
          <svg viewBox="0 0 64 64" aria-hidden="true">
            <path d="M11 15c11-4 30-4 42 0-3 6-7 10-16 12 7 3 10 8 10 15 0 10-8 17-16 17S15 52 15 42c0-9 4-15 12-17-6-2-11-6-16-10Z" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round"/>
            <path d="M28 21c2-3 4-5 8-7" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>
            <circle cx="28" cy="34" r="3.2" fill="currentColor"/>
            <circle cx="39" cy="28" r="3.2" fill="currentColor"/>
            <circle cx="36" cy="42" r="3.2" fill="currentColor"/>
          </svg>
        </span>
        <span class="admin-brand__text">
          <strong>Pizza House</strong>
          <small>Admin Control</small>
        </span>
      </a>

      <span class="admin-tag">Restaurant Dashboard</span>
      <h1>Sign in to manage restaurants with role-based access.</h1>
      <p>
        This login now uses a PHP session foundation so each user only sees the restaurants they are allowed to manage.
      </p>

      <div class="auth-points">
        <article class="auth-point">
          <strong>Secure sessions</strong>
          <span>Login persists through a server-side PHP session, not localStorage.</span>
        </article>
        <article class="auth-point">
          <strong>Role access</strong>
          <span>Super admins and restaurant owners are separated at the API layer.</span>
        </article>
        <article class="auth-point">
          <strong>Restaurant scope</strong>
          <span>Each account can only load restaurants assigned to it.</span>
        </article>
      </div>

      <div class="auth-demo">
        <span>Seeded super admin</span>
        <strong>admin@example.com</strong>
      </div>
    </section>

    <section class="auth-card">
      <span class="auth-card__eyebrow">Secure Sign In</span>
      <h2>Welcome back</h2>
      <p>Use your email and password to open the dashboard.</p>

      <form id="loginForm" class="auth-form" novalidate>
        <div class="form-group">
          <label for="adminEmail">Email</label>
          <input id="adminEmail" name="email" type="email" autocomplete="username" placeholder="admin@example.com" required>
        </div>
        <div class="form-group">
          <label for="adminPass">Password</label>
          <input id="adminPass" name="password" type="password" autocomplete="current-password" placeholder="Your password" required>
        </div>

        <button type="submit" class="btn btn--primary btn--block">Enter Dashboard</button>
      </form>

      <p class="auth-feedback" id="loginFeedback" aria-live="polite"></p>

      <p class="auth-footer-note">
        Local development seed: Super Admin is created with `admin@example.com` and the password from the SQL seed docs.
      </p>
    </section>
  </main>

  <script src="assets/js/admin.js?v=auth-foundation-1"></script>
</body>
</html>
