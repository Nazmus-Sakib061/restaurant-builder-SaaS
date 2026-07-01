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

## 13. Not Included

- billing
- payment gateway integration
- invoices
- real subscription renewal
- custom domain implementation
