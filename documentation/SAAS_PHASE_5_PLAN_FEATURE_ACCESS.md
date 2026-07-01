# SaaS Phase 5.1 - Package, Plan, and Feature Access Control Foundation

## 1. Purpose

Phase 5.1 adds the plan and feature access foundation for the SaaS build.
It introduces package records, per-plan feature flags, restaurant subscription state, backend gating, and a minimal admin UI hint for locked features.

Billing, invoices, payment gateways, and custom domain routing are not included.

## 2. Plans Added

- `free`
- `basic`
- `pro`
- `premium`

## 3. Feature Keys

- `categories`
- `menu_items`
- `orders`
- `payments`
- `gallery`
- `deals`
- `statistics`
- `exports`
- `staff_management`
- `branding`
- `custom_domain`

## 4. Plan Matrix

| Plan | Key access summary |
|---|---|
| Free | categories, menu items, and orders are enabled; paid/advanced features are locked |
| Basic | adds payments, gallery, and branding |
| Pro | adds deals, statistics, exports, and staff management |
| Premium | all feature flags are enabled, including custom_domain as a placeholder only |

## 5. Database Tables

- `plans`
- `plan_features`
- `restaurant_subscriptions`

The migration is update-only and does not drop existing tenant data.

## 6. Feature Gate Helper

File:

- `backend/helpers/feature_gate.php`

Functions:

- `getRestaurantPlan($restaurantId)`
- `getPlanFeatures($planId)`
- `canUseFeature($restaurantId, $featureKey)`
- `requireFeature($restaurantId, $featureKey)`

Locked API response:

```json
{
  "success": false,
  "error": "feature_locked",
  "message": "This feature is not available on your current plan.",
  "feature": "gallery",
  "upgrade_required": true
}
```

## 7. APIs Gated

- `backend/api/deals.php`
- `backend/api/gallery.php`
- `backend/api/site-data.php`
- `backend/api/current-user.php`
- `backend/api/restaurant-plans.php`
- `backend/api/restaurants.php` for default plan assignment on new restaurants

## 8. Backend vs Frontend Locking

Frontend locking only helps the UI present a clear state.
Backend checks still enforce the real rule, so direct API calls cannot bypass the plan restrictions.

## 9. Plan Assignment

- Super-admins can read and update plan assignments through `backend/api/restaurant-plans.php`.
- Owners and staff remain blocked from changing plans.
- The current local setup uses the existing `restaurants` table as the tenant table and stores plan state in `restaurant_subscriptions`.

## 10. Validation

Passed on the local branch:

- PHP lint on all PHP files
- `node --check admin/assets/js/admin.js`
- homepage `200`
- admin login page `200`
- site-data for `default` and `demo-coffee-house`
- current-user after tenant selection
- select-restaurant switch
- unauthorized category write blocked with `401`
- owner cross-tenant writes blocked with `403`
- plan assignment to `free` and restore to `premium`
- locked site-data filtering for `gallery` and `deals`

## 11. Security Checks

- backend feature gates are enforced
- unauthorized writes are blocked
- owner cannot self-upgrade through the plan endpoint
- no payment data is collected or stored
- no secret or config values are exposed by the plan payloads

## 12. Remaining Risks

- Statistics, exports, and staff management are wired as plan flags but may need more UI coverage in later phases.
- Custom domain is only a feature flag placeholder at this stage.
- Subscription renewals and billing flows are still out of scope.

## 13. Phase 5.5 UI Expansion

The Phase 5.5 regression pass expanded the admin dashboard so plan access is visible at a glance.

- A new feature-access summary card now shows the active plan state for:
  - statistics
  - exports
  - staff management
  - branding
  - custom domain
- The settings panel now shows a branding availability note and becomes read-only when branding is not included in the current plan.
- `backend/api/settings.php` now enforces the `branding` feature on write requests.
- `backend/api/uploads.php` now blocks gallery, deals, and branding uploads when the active plan does not allow them.
- The custom domain row remains a placeholder and does not change routing behavior yet.

## 14. Smoke Regression

Repeatable verification command:

```bash
php tests/smoke-saas-plan-features.php
```

The smoke script covers:

- public homepage and admin login smoke checks
- `current-user.php` and `select-restaurant.php` session handling
- tenant-scoped plan assignment checks for temporary free and pro restaurants
- branding write protection on the free plan
- gallery and deals locks on the free plan
- gallery and deals access on the pro plan
- inactive tenant `site-data.php` behavior after cleanup

## 15. Not Included

- billing
- payment gateway integration
- invoices
- real subscription renewal
- custom domain implementation
