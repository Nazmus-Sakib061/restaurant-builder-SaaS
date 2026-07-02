const ordersKey = "demoRestaurantOrders";
const selectedRestaurantKey = "demoRestaurantSelectedSlug";
const DEFAULT_RESTAURANT_SLUG = window.RESTAURANT_DEFAULT_SLUG || "default";
const apiBase = "../backend/api";
const loginPageUrl = "login.php";
const dashboardPageUrl = "dashboard.php";

const loginForm = document.getElementById("loginForm");
const sidebar = document.getElementById("adminSidebar");
const sidebarToggle = document.getElementById("sidebarToggle");
const sidebarOverlay = document.getElementById("sidebarOverlay");
const logoutButtons = Array.from(document.querySelectorAll('[data-action="logout"]'));
const ordersTableBody = document.getElementById("ordersTableBody");
const ordersSourcePill = document.getElementById("ordersSourcePill");
const menuSnapshotList = document.getElementById("menuSnapshotList");
const categoryPills = document.getElementById("categoryPills");
const settingsDetails = document.getElementById("settingsDetails");
const loginFeedback = document.getElementById("loginFeedback");
const statOrders = document.getElementById("statOrders");
const statFoods = document.getElementById("statFoods");
const statDeals = document.getElementById("statDeals");
const statRevenue = document.getElementById("statRevenue");
const restaurantSelect = document.getElementById("restaurantSelect");
const settingsForm = document.getElementById("settingsForm");
const settingsFeedback = document.getElementById("settingsFeedback");
const settingsSaveButton = document.getElementById("settingsSaveButton");
const activeRestaurantContext = document.getElementById("activeRestaurantContext");
const activeRestaurantName = document.getElementById("activeRestaurantName");
const activeRestaurantMeta = document.getElementById("activeRestaurantMeta");
const tenantManagementPanel = document.getElementById("tenantManagement");
const tenantManagementFeedback = document.getElementById("tenantManagementFeedback");
const restaurantManagementTableBody = document.getElementById("restaurantManagementTableBody");
const restaurantManagementForm = document.getElementById("restaurantManagementForm");
const restaurantManagementIdField = document.getElementById("restaurantManagementIdField");
const restaurantManagementNameField = document.getElementById("restaurantManagementNameField");
const restaurantManagementSlugField = document.getElementById("restaurantManagementSlugField");
const restaurantManagementStatusField = document.getElementById("restaurantManagementStatusField");
const restaurantManagementSaveButton = document.getElementById("restaurantManagementSaveButton");
const restaurantManagementResetButtons = Array.from(document.querySelectorAll('[data-action="reset-restaurant-management-form"]'));
const restaurantOwnerTableBody = document.getElementById("restaurantOwnerTableBody");
const restaurantOwnerForm = document.getElementById("restaurantOwnerForm");
const restaurantOwnerNameField = document.getElementById("restaurantOwnerNameField");
const restaurantOwnerEmailField = document.getElementById("restaurantOwnerEmailField");
const restaurantOwnerPasswordField = document.getElementById("restaurantOwnerPasswordField");
const restaurantOwnerRestaurantField = document.getElementById("restaurantOwnerRestaurantField");
const restaurantOwnerSaveButton = document.getElementById("restaurantOwnerSaveButton");
const restaurantOwnerResetButtons = Array.from(document.querySelectorAll('[data-action="reset-restaurant-owner-form"]'));
const restaurantPlanFeedback = document.getElementById("restaurantPlanFeedback");
const restaurantPlanRestaurantField = document.getElementById("restaurantPlanRestaurantField");
const restaurantPlanField = document.getElementById("restaurantPlanField");
const restaurantPlanSaveButton = document.getElementById("restaurantPlanSaveButton");
const logoPathField = document.getElementById("logoPath");
const logoUploadField = document.getElementById("logoUploadField");
const logoUploadButton = document.getElementById("logoUploadButton");
const logoPreview = document.getElementById("logoPreview");
const logoPreviewImage = document.getElementById("logoPreviewImage");
const faviconPathField = document.getElementById("faviconPath");
const faviconUploadField = document.getElementById("faviconUploadField");
const faviconUploadButton = document.getElementById("faviconUploadButton");
const faviconPreview = document.getElementById("faviconPreview");
const faviconPreviewImage = document.getElementById("faviconPreviewImage");
const heroImagePathField = document.getElementById("heroImagePath");
const heroUploadField = document.getElementById("heroUploadField");
const heroUploadButton = document.getElementById("heroUploadButton");
const heroPreview = document.getElementById("heroPreview");
const heroPreviewImage = document.getElementById("heroPreviewImage");
const aboutImagePathField = document.getElementById("aboutImagePath");
const aboutUploadField = document.getElementById("aboutUploadField");
const aboutUploadButton = document.getElementById("aboutUploadButton");
const aboutPreview = document.getElementById("aboutPreview");
const aboutPreviewImage = document.getElementById("aboutPreviewImage");
const publicPreviewLink = document.getElementById("publicPreviewLink");
const categoryTableBody = document.getElementById("categoryTableBody");
const categoryForm = document.getElementById("categoryForm");
const categoryFeedback = document.getElementById("categoryFeedback");
const categorySaveButton = document.getElementById("categorySaveButton");
const categoryCreateResetButtons = Array.from(document.querySelectorAll('[data-action="reset-category-form"]'));
const categoryIdField = document.getElementById("categoryIdField");
const categoryNameField = document.getElementById("categoryNameField");
const categorySlugField = document.getElementById("categorySlugField");
const categoryDescriptionField = document.getElementById("categoryDescriptionField");
const categoryImageField = document.getElementById("categoryImageField");
const categoryUploadField = document.getElementById("categoryUploadField");
const categoryUploadButton = document.getElementById("categoryUploadButton");
const categoryPreview = document.getElementById("categoryPreview");
const categoryPreviewImage = document.getElementById("categoryPreviewImage");
const categorySortField = document.getElementById("categorySortField");
const categoryStatusField = document.getElementById("categoryStatusField");
const menuItemTableBody = document.getElementById("menuItemTableBody");
const menuItemForm = document.getElementById("menuItemForm");
const menuItemFeedback = document.getElementById("menuItemFeedback");
const menuItemSaveButton = document.getElementById("menuItemSaveButton");
const menuItemCreateResetButtons = Array.from(document.querySelectorAll('[data-action="reset-menu-item-form"]'));
const menuItemIdField = document.getElementById("menuItemIdField");
const menuItemCategoryField = document.getElementById("menuItemCategoryField");
const menuItemNameField = document.getElementById("menuItemNameField");
const menuItemSlugField = document.getElementById("menuItemSlugField");
const menuItemDescriptionField = document.getElementById("menuItemDescriptionField");
const menuItemPriceField = document.getElementById("menuItemPriceField");
const menuItemDiscountField = document.getElementById("menuItemDiscountField");
const menuItemImageField = document.getElementById("menuItemImageField");
const menuItemUploadField = document.getElementById("menuItemUploadField");
const menuItemUploadButton = document.getElementById("menuItemUploadButton");
const menuItemPreview = document.getElementById("menuItemPreview");
const menuItemPreviewImage = document.getElementById("menuItemPreviewImage");
const menuItemBadgeField = document.getElementById("menuItemBadgeField");
const menuItemFeaturedField = document.getElementById("menuItemFeaturedField");
const menuItemAvailableField = document.getElementById("menuItemAvailableField");
const menuItemSortField = document.getElementById("menuItemSortField");
const menuItemStatusField = document.getElementById("menuItemStatusField");
const dealTableBody = document.getElementById("dealTableBody");
const dealForm = document.getElementById("dealForm");
const dealFeedback = document.getElementById("dealFeedback");
const dealSaveButton = document.getElementById("dealSaveButton");
const dealCreateResetButtons = Array.from(document.querySelectorAll('[data-action="reset-deal-form"]'));
const dealIdField = document.getElementById("dealIdField");
const dealTitleField = document.getElementById("dealTitleField");
const dealDescriptionField = document.getElementById("dealDescriptionField");
const dealBadgeField = document.getElementById("dealBadgeField");
const dealRegularPriceField = document.getElementById("dealRegularPriceField");
const dealPriceField = document.getElementById("dealPriceField");
const dealImageField = document.getElementById("dealImageField");
const dealUploadField = document.getElementById("dealUploadField");
const dealUploadButton = document.getElementById("dealUploadButton");
const dealPreview = document.getElementById("dealPreview");
const dealPreviewImage = document.getElementById("dealPreviewImage");
const dealStartsAtField = document.getElementById("dealStartsAtField");
const dealEndsAtField = document.getElementById("dealEndsAtField");
const dealSortField = document.getElementById("dealSortField");
const dealStatusField = document.getElementById("dealStatusField");
const galleryTableBody = document.getElementById("galleryTableBody");
const galleryForm = document.getElementById("galleryForm");
const galleryFeedback = document.getElementById("galleryFeedback");
const gallerySaveButton = document.getElementById("gallerySaveButton");
const galleryCreateResetButtons = Array.from(document.querySelectorAll('[data-action="reset-gallery-form"]'));
const galleryIdField = document.getElementById("galleryIdField");
const galleryTitleField = document.getElementById("galleryTitleField");
const galleryCaptionField = document.getElementById("galleryCaptionField");
const galleryImageField = document.getElementById("galleryImageField");
const galleryUploadField = document.getElementById("galleryUploadField");
const galleryUploadButton = document.getElementById("galleryUploadButton");
const galleryPreview = document.getElementById("galleryPreview");
const galleryPreviewImage = document.getElementById("galleryPreviewImage");
const galleryPreviewFallback = document.getElementById("galleryPreviewFallback");
const galleryAltField = document.getElementById("galleryAltField");
const gallerySortField = document.getElementById("gallerySortField");
const galleryStatusField = document.getElementById("galleryStatusField");
const featureAccessCard = document.getElementById("featureAccessCard");
const featureAccessHeadline = document.getElementById("featureAccessHeadline");
const featureAccessSummary = document.getElementById("featureAccessSummary");
const featureAccessStatisticsNote = document.getElementById("featureAccessStatisticsNote");
const featureAccessStatisticsStatus = document.getElementById("featureAccessStatisticsStatus");
const featureAccessExportsNote = document.getElementById("featureAccessExportsNote");
const featureAccessExportsStatus = document.getElementById("featureAccessExportsStatus");
const featureAccessStaffNote = document.getElementById("featureAccessStaffNote");
const featureAccessStaffStatus = document.getElementById("featureAccessStaffStatus");
const featureAccessBrandingNote = document.getElementById("featureAccessBrandingNote");
const featureAccessBrandingStatus = document.getElementById("featureAccessBrandingStatus");
const featureAccessDomainNote = document.getElementById("featureAccessDomainNote");
const featureAccessDomainStatus = document.getElementById("featureAccessDomainStatus");
const settingsAccessNote = document.getElementById("settingsAccessNote");

const menuSnapshot = [
  { name: "Margherita Blaze Pizza", category: "Pizza", price: "$12.90" },
  { name: "Tandoori Fire Pizza", category: "Pizza", price: "$14.50" },
  { name: "Classic Flame Burger", category: "Burger", price: "$8.90" },
  { name: "Chicken Shawarma Wrap", category: "Shawarma", price: "$7.90" },
  { name: "Oreo Dream Shake", category: "Drinks", price: "$5.20" }
];

const categories = ["Pizza", "Burger", "Shawarma", "Drinks"];

const imageUploadMaxBytes = 3 * 1024 * 1024;
const imageUploadMimeTypes = ["image/jpeg", "image/png", "image/webp"];
const imageUploadExtensions = ["jpg", "jpeg", "png", "webp"];
const orderItemPlaceholderImage = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" role="img" aria-label="No image available">
    <defs>
      <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="#2a2a2a"/>
        <stop offset="100%" stop-color="#141414"/>
      </linearGradient>
    </defs>
    <rect width="120" height="120" rx="20" fill="url(#g)"/>
    <circle cx="60" cy="50" r="18" fill="none" stroke="#ef2b24" stroke-width="5"/>
    <path d="M42 82h36" stroke="#b7b7b7" stroke-width="6" stroke-linecap="round"/>
    <path d="M49 45l22 22M71 45L49 67" stroke="#ffd8a1" stroke-width="5" stroke-linecap="round"/>
  </svg>
`)}`;

let galleryPreviewObjectUrl = "";

const normalizeAdminImagePath = (value) => {
  const rawValue = String(value ?? "").trim();

  if (!rawValue) {
    return "";
  }

  if (/^(?:https?:)?\/\//i.test(rawValue) || /^(?:data:|blob:)/i.test(rawValue)) {
    return rawValue;
  }

  let normalized = rawValue.replace(/\\/g, "/");
  normalized = normalized.replace(/^\/restaurant_builder\//i, "");
  normalized = normalized.replace(/^\.\/+/, "").replace(/^\/+/, "");

  for (let index = 0; index < 3; index += 1) {
    try {
      const decoded = decodeURIComponent(normalized);
      if (decoded === normalized) {
        break;
      }
      normalized = decoded;
    } catch {
      break;
    }
  }

  return normalized;
};

const settingsFieldNames = [
  "logo",
  "favicon",
  "site_title",
  "hero_title",
  "hero_subtitle",
  "hero_button_text",
  "hero_button_link",
  "hero_image",
  "about_title",
  "about_text",
  "about_image",
  "phone",
  "email",
  "address",
  "google_map_embed_url",
  "opening_hours",
  "facebook_url",
  "instagram_url",
  "youtube_url",
  "whatsapp_number",
  "primary_color",
  "secondary_color",
  "accent_color",
  "background_color",
  "text_color",
  "button_color"
];

const colorFieldNames = [
  "primary_color",
  "secondary_color",
  "accent_color",
  "background_color",
  "text_color",
  "button_color"
];

const urlLikeFieldNames = [
  "hero_button_link",
  "google_map_embed_url",
  "facebook_url",
  "instagram_url",
  "youtube_url"
];

const featureAccessStatusClasses = [
  "feature-access-status--locked",
  "feature-access-status--available",
  "feature-access-status--placeholder",
  "feature-access-status--pending"
];

const featureAccessRows = [
  {
    featureKey: "statistics",
    noteElement: featureAccessStatisticsNote,
    statusElement: featureAccessStatisticsStatus,
    availableLabel: "Available",
    availableNote: "Statistics dashboards are available on this plan.",
    lockedLabel: "Locked",
    lockedNote: "Statistics dashboards are locked on your current plan.",
    pendingLabel: "Pending",
    pendingNote: "Select a restaurant to inspect statistics access.",
    stateClass: "available"
  },
  {
    featureKey: "exports",
    noteElement: featureAccessExportsNote,
    statusElement: featureAccessExportsStatus,
    availableLabel: "Available",
    availableNote: "Export tools are available on this plan.",
    lockedLabel: "Locked",
    lockedNote: "Export tools are locked on your current plan.",
    pendingLabel: "Pending",
    pendingNote: "Select a restaurant to inspect export access.",
    stateClass: "available"
  },
  {
    featureKey: "staff_management",
    noteElement: featureAccessStaffNote,
    statusElement: featureAccessStaffStatus,
    availableLabel: "Available",
    availableNote: "Tenant staff controls are available on this plan.",
    lockedLabel: "Locked",
    lockedNote: "Tenant staff controls are locked on your current plan.",
    pendingLabel: "Pending",
    pendingNote: "Select a restaurant to inspect staff management access.",
    stateClass: "available"
  },
  {
    featureKey: "branding",
    noteElement: featureAccessBrandingNote,
    statusElement: featureAccessBrandingStatus,
    availableLabel: "Available",
    availableNote: "Website settings remain editable on this plan.",
    lockedLabel: "Locked",
    lockedNote: "Website settings are locked on your current plan.",
    pendingLabel: "Pending",
    pendingNote: "Select a restaurant to inspect branding availability.",
    stateClass: "available"
  },
  {
    featureKey: "custom_domain",
    noteElement: featureAccessDomainNote,
    statusElement: featureAccessDomainStatus,
    availableLabel: "Placeholder",
    availableNote: "Placeholder only. No routing changes are implemented yet.",
    lockedLabel: "Locked",
    lockedNote: "Custom domain is locked on your current plan.",
    pendingLabel: "Pending",
    pendingNote: "Select a restaurant to inspect custom domain access.",
    stateClass: "placeholder"
  }
];

let loadedRestaurants = [];
let currentUserContext = null;
let currentRestaurant = null;
let currentSettings = null;
let currentCategories = [];
let currentMenuItems = [];
let currentDeals = [];
let currentGallery = [];
let currentOrders = [];
let currentOrdersSource = "backend";
let currentRevenueTotal = 0;
let managementRestaurants = [];
let managementOwnerAssignments = [];
let managementPlanAssignments = [];
let managementPlans = [];

const buildApiUrl = (endpoint, params = {}) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    query.set(key, String(value));
  });

  const queryString = query.toString();
  return queryString ? `${apiBase}/${endpoint}?${queryString}` : `${apiBase}/${endpoint}`;
};

const fetchJson = async (endpoint, options = {}) => {
  const {
    method = "GET",
    params = {},
    body,
    headers = {}
  } = options;

  const requestHeaders = {
    Accept: "application/json",
    ...headers
  };

  if (body !== undefined) {
    requestHeaders["Content-Type"] = "application/json";
  }

  const response = await fetch(buildApiUrl(endpoint, params), {
    method,
    headers: requestHeaders,
    credentials: "same-origin",
    body: body !== undefined ? JSON.stringify(body) : undefined
  });

  let result = null;
  try {
    result = await response.json();
  } catch {
    result = null;
  }

  if (!response.ok || !result?.success) {
    const error = new Error(result?.message || `Request failed with status ${response.status}.`);
    error.details = result?.errors || null;
    error.status = response.status;

    if (response.status === 401 && !loginForm) {
      window.location.href = loginPageUrl;
    }

    throw error;
  }

  return result;
};

const formatCurrency = (value) => {
  const number = Number(value);
  if (Number.isNaN(number)) {
    return "$0.00";
  }

  return `$${number.toFixed(2)}`;
};

const slugifyText = (value) => String(value || "")
  .trim()
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "") || "item";

const isNonNegativeInteger = (value) => {
  if (value === "" || value === null || value === undefined) {
    return false;
  }

  return /^\d+$/.test(String(value).trim());
};

const escapeHTML = (value) => String(value ?? "")
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#39;");

const formatDate = (value) => {
  if (!value) {
    return "Just now";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Just now";
  }

  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
};

const getOrders = () => {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(ordersKey) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const persistOrders = (orders) => {
  try {
    window.localStorage.setItem(ordersKey, JSON.stringify(orders.slice(0, 50)));
  } catch {
    // Ignore storage quota issues in demo fallback mode.
  }
};

const normalizeOrderStatus = (value) => {
  const status = String(value ?? "pending").trim().toLowerCase();

  if (status === "completed") {
    return "delivered";
  }

  if (["accepted", "preparing"].includes(status)) {
    return "pending";
  }

  return ["pending", "delivered", "cancelled"].includes(status) ? status : "pending";
};

const normalizeOrderItems = (items) => {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item, index) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const foodName = String(
        item.food_name ?? item.item_name ?? item.name ?? item.title ?? `Item ${index + 1}`
      ).trim();
      const foodImage = String(
        item.food_image ?? item.image ?? item.menu_image ?? item.menu_item_image ?? item.item_image ?? ""
      ).trim();
      const quantity = Number.parseInt(String(item.quantity ?? 1), 10);

      return {
        menu_item_id: item.menu_item_id ?? null,
        food_name: foodName || `Item ${index + 1}`,
        food_image: foodImage,
        quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : 1,
        unit_price: Number.isFinite(Number(item.unit_price)) ? Number(item.unit_price) : null
      };
    })
    .filter(Boolean);
};

const normalizePaymentStatus = (value) => {
  const status = String(value ?? "unpaid").trim().toLowerCase();
  return ["unpaid", "paid", "partial", "cash_received", "refunded"].includes(status)
    ? status
    : "unpaid";
};

const moneyValue = (value) => {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) {
    return null;
  }

  return Math.round(number * 100) / 100;
};

const isOrderCancelled = (order) => String(order?.status ?? order?.order_status ?? "").trim().toLowerCase() === "cancelled";

const isOrderCashReceived = (order) => {
  const paymentStatus = normalizePaymentStatus(order?.payment_status);
  return paymentStatus === "cash_received"
    || Boolean(order?.cash_received_at)
    || Boolean(order?.revenue_posted_at);
};

const calculateOrderItemAmount = (item) => {
  const quantity = Number.parseInt(String(item?.quantity ?? 1), 10);
  const safeQuantity = Number.isFinite(quantity) && quantity > 0 ? quantity : 1;
  const unitPrice = moneyValue(item?.unit_price);
  const menuItemPrice = moneyValue(item?.menu_item_price);
  const fallbackPrice = unitPrice ?? menuItemPrice;

  if (fallbackPrice !== null && fallbackPrice > 0) {
    return Math.round((safeQuantity * fallbackPrice) * 100) / 100;
  }

  const totalPrice = moneyValue(item?.total_price);
  return totalPrice !== null && totalPrice > 0 ? totalPrice : null;
};

const calculateOrderTotal = (order) => {
  const itemAmounts = Array.isArray(order?.items)
    ? order.items.map((item) => calculateOrderItemAmount(item)).filter((value) => value !== null)
    : [];

  if (itemAmounts.length > 0) {
    return Math.round(itemAmounts.reduce((sum, value) => sum + value, 0) * 100) / 100;
  }

  const fallbackTotal = moneyValue(order?.total_amount);
  if (fallbackTotal !== null && fallbackTotal > 0) {
    return fallbackTotal;
  }

  return moneyValue(order?.revenue_amount);
};

const computeRevenueTotal = (orders) => (Array.isArray(orders) ? orders : []).reduce((sum, order) => {
  if (!isOrderCashReceived(order)) {
    return sum;
  }

  const amount = moneyValue(order?.revenue_amount)
    ?? calculateOrderTotal(order)
    ?? moneyValue(order?.total_amount)
    ?? 0;

  return sum + amount;
}, 0);

const normalizeOrderRecord = (order, index = 0) => {
  if (!order || typeof order !== "object") {
    return null;
  }

  const items = normalizeOrderItems(order.items ?? order.order_items ?? []);
  const primaryItem = items[0] ?? null;
  const status = normalizeOrderStatus(order.status ?? order.order_status);
  const paymentStatus = normalizePaymentStatus(order.payment_status);
  const foodItem = String(order.food_item ?? primaryItem?.food_name ?? `Order #${index + 1}`).trim();
  const foodImage = String(order.food_image ?? primaryItem?.food_image ?? "").trim();
  const orderTotal = calculateOrderTotal({
    ...order,
    items,
    total_amount: order.total_amount
  });

  return {
    ...order,
    id: order.id,
    customer_name: String(order.customer_name ?? "Guest").trim() || "Guest",
    customer_phone: String(order.customer_phone ?? order.phone ?? "").trim(),
    phone: String(order.phone ?? order.customer_phone ?? "").trim(),
    customer_address: String(order.customer_address ?? order.address ?? "").trim(),
    address: String(order.address ?? order.customer_address ?? "").trim(),
    message: String(order.message ?? order.note ?? "").trim(),
    note: String(order.note ?? order.message ?? "").trim(),
    food_item: foodItem,
    food_image: foodImage,
    payment_status: paymentStatus,
    cash_received_at: order.cash_received_at ?? null,
    revenue_posted_at: order.revenue_posted_at ?? null,
    revenue_amount: moneyValue(order.revenue_amount),
    order_total: orderTotal,
    status,
    order_status: status,
    items
  };
};

const normalizeOrderList = (orders) => Array.isArray(orders)
  ? orders.map((order, index) => normalizeOrderRecord(order, index)).filter(Boolean)
  : [];

const getStoredOrders = () => normalizeOrderList(getOrders());

const updateOrdersSourcePill = (source) => {
  if (!ordersSourcePill) {
    return;
  }

  const resolvedSource = source === "localStorage" ? "localStorage" : "backend";
  ordersSourcePill.classList.toggle("status-pill--accent", resolvedSource === "localStorage");
  ordersSourcePill.classList.toggle("status-pill--live", resolvedSource === "backend");
  ordersSourcePill.textContent = resolvedSource === "localStorage"
    ? "Demo localStorage fallback"
    : "Live backend orders";
};

const syncOrdersFromStorage = () => {
  const storedOrders = getStoredOrders();
  currentOrders = storedOrders;
  currentOrdersSource = storedOrders.length ? "localStorage" : "backend";
  currentRevenueTotal = computeRevenueTotal(storedOrders);
  updateOrdersSourcePill(currentOrdersSource);
  return storedOrders;
};

const refreshOrderStats = () => {
  if (statOrders) {
    statOrders.textContent = String(currentOrders.length);
  }
  if (statRevenue) {
    statRevenue.textContent = formatCurrency(currentRevenueTotal);
  }
};

const setRevenueTotal = (value) => {
  currentRevenueTotal = Number.isFinite(Number(value)) ? Math.max(0, Number(value)) : 0;
  refreshOrderStats();
};

const updateLocalOrderStatus = (orderId, status) => {
  const storedOrders = getStoredOrders();
  let updated = false;

  const nextOrders = storedOrders.map((order) => {
    if (String(order.id) !== String(orderId)) {
      return order;
    }

    updated = true;
    return {
      ...order,
      status,
      order_status: status,
      updated_at: new Date().toISOString()
    };
  });

  if (updated) {
    persistOrders(nextOrders);
    currentOrders = nextOrders;
    currentOrdersSource = "localStorage";
    updateOrdersSourcePill(currentOrdersSource);
    renderOrders();
  }

  return updated;
};

const updateLocalOrderCashReceived = (orderId) => {
  const storedOrders = getStoredOrders();
  let updated = false;

  const nextOrders = storedOrders.map((order) => {
    if (String(order.id) !== String(orderId)) {
      return order;
    }

    const orderTotal = calculateOrderTotal(order);
    if (orderTotal === null || orderTotal <= 0) {
      return order;
    }

    updated = true;
    return {
      ...order,
      payment_status: "cash_received",
      cash_received_at: order.cash_received_at || new Date().toISOString(),
      revenue_posted_at: order.revenue_posted_at || new Date().toISOString(),
      revenue_amount: order.revenue_amount || orderTotal,
      updated_at: new Date().toISOString()
    };
  });

  if (updated) {
    persistOrders(nextOrders);
    currentOrders = nextOrders;
    currentOrdersSource = "localStorage";
    currentRevenueTotal = computeRevenueTotal(nextOrders);
    updateOrdersSourcePill(currentOrdersSource);
    renderOrders();
  }

  return updated;
};

const renderOrderItems = (items) => {
  const itemList = document.createElement("div");
  itemList.className = "order-items-list";

  items.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "order-item-row";

    const indexBadge = document.createElement("span");
    indexBadge.className = "order-item-index";
    indexBadge.textContent = `#${index + 1}`;

    const thumb = document.createElement("div");
    thumb.className = "order-item-thumb";
    const image = document.createElement("img");
    image.className = "order-item-thumb-img";
    image.loading = "lazy";
    image.decoding = "async";
    image.alt = item.food_name || `Item ${index + 1}`;
    image.src = orderItemPlaceholderImage;

    const resolvedImagePath = resolveAdminImageUrl(resolveOrderItemImagePath(item));
    if (resolvedImagePath && resolvedImagePath !== orderItemPlaceholderImage) {
      const preloadImage = new Image();
      preloadImage.decoding = "async";
      preloadImage.onload = () => {
        image.src = resolvedImagePath;
        image.alt = item.food_name || `Item ${index + 1}`;
        thumb.classList.remove("order-item-thumb--placeholder");
      };
      preloadImage.onerror = () => {
        thumb.classList.add("order-item-thumb--placeholder");
      };
      preloadImage.src = resolvedImagePath;
    } else {
      thumb.classList.add("order-item-thumb--placeholder");
      image.alt = "No image available";
    }
    thumb.appendChild(image);

    const name = document.createElement("span");
    name.className = "order-item-name";
    name.textContent = item.food_name || `Item ${index + 1}`;

    const quantity = document.createElement("span");
    quantity.className = "order-item-qty";
    quantity.textContent = `Ã— ${Number(item.quantity || 1)}`;

    row.append(thumb, indexBadge, name, quantity);
    itemList.appendChild(row);
  });

  return itemList;
};

const renderOrderStatusControl = (order) => {
  const stack = document.createElement("div");
  stack.className = "order-status-stack";

  const badge = document.createElement("span");
  badge.className = `status-badge status-badge--${order.status || "pending"}`;
  badge.textContent = String(order.status || "pending")
    .replace(/^\w/, (letter) => letter.toUpperCase());

  const select = document.createElement("select");
  select.className = "field-control order-status-control";
  select.dataset.orderId = String(order.id);
  select.dataset.orderStatusSelect = "1";

  [
    { value: "pending", label: "Pending" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" }
  ].forEach((option) => {
    const element = document.createElement("option");
    element.value = option.value;
    element.textContent = option.label;
    select.appendChild(element);
  });

  select.value = ["pending", "delivered", "cancelled"].includes(order.status) ? order.status : "pending";
  stack.append(badge, select);
  return stack;
};

const renderOrderPaymentControl = (order) => {
  const stack = document.createElement("div");
  stack.className = "order-payment-stack";

  const orderTotal = calculateOrderTotal(order);
  const totalBadge = document.createElement("span");
  totalBadge.className = `order-total${orderTotal === null ? " order-total--missing" : ""}`;
  totalBadge.textContent = orderTotal === null ? "Amount missing" : `Total ${formatCurrency(orderTotal)}`;

  const paymentStatus = isOrderCashReceived(order)
    ? "cash_received"
    : normalizePaymentStatus(order.payment_status);
  const paymentBadgeState = paymentStatus === "cash_received"
    ? "cash-received"
    : paymentStatus === "refunded"
      ? "refunded"
      : isOrderCancelled(order)
        ? "cancelled"
      : "unpaid";

  const badge = document.createElement("span");
  badge.className = `payment-badge payment-badge--${paymentBadgeState}`;
  badge.textContent = isOrderCancelled(order)
    ? "Cancelled"
    : paymentStatus === "cash_received"
    ? "Cash received"
    : paymentStatus === "refunded"
      ? "Refunded"
      : "Unpaid";

  const button = document.createElement("button");
  button.type = "button";
  button.className = "btn btn--ghost btn--compact cash-received-btn";
  button.dataset.orderId = String(order.id);
  button.dataset.orderCashReceived = "1";
  button.textContent = "Cash Received";

  if (isOrderCancelled(order)) {
    button.disabled = true;
    button.textContent = "Cancelled";
    button.classList.add("cash-received-btn--done");
  } else if (paymentStatus === "cash_received") {
    button.disabled = true;
    button.classList.add("cash-received-btn--done");
  } else if (orderTotal === null || orderTotal <= 0) {
    button.disabled = true;
    button.title = "Amount missing";
  }

  stack.append(totalBadge, badge, button);
  return stack;
};

const loadRevenueSummaryForRestaurant = async (slug) => {
  const resolvedSlug = slug || DEFAULT_RESTAURANT_SLUG;

  if (currentOrdersSource === "localStorage") {
    setRevenueTotal(computeRevenueTotal(currentOrders));
    return currentRevenueTotal;
  }

  try {
    const result = await fetchJson("orders.php", {
      params: { restaurant: resolvedSlug, action: "summary" },
      headers: {
      }
    });

    const revenueTotal = Number(result.data?.revenue_total ?? result.revenue_total ?? 0);
    setRevenueTotal(revenueTotal);
    return currentRevenueTotal;
  } catch {
    setRevenueTotal(computeRevenueTotal(currentOrders));
    return currentRevenueTotal;
  }
};

const loadOrdersForRestaurant = async (slug) => {
  const resolvedSlug = slug || DEFAULT_RESTAURANT_SLUG;

  try {
    const result = await fetchJson("orders.php", {
      params: { restaurant: resolvedSlug },
      headers: {
      }
    });

    const backendOrders = normalizeOrderList(Array.isArray(result.data) ? result.data : (Array.isArray(result.orders) ? result.orders : []));
    if (backendOrders.length > 0) {
      currentOrders = backendOrders;
      currentOrdersSource = "backend";
    } else {
      const fallbackOrders = getStoredOrders();
      currentOrders = fallbackOrders;
      currentOrdersSource = fallbackOrders.length ? "localStorage" : "backend";
    }
    updateOrdersSourcePill(currentOrdersSource);
    renderOrders();
    await loadRevenueSummaryForRestaurant(resolvedSlug);
  } catch (error) {
    const fallbackOrders = getStoredOrders();
    currentOrders = fallbackOrders;
    currentOrdersSource = fallbackOrders.length ? "localStorage" : "backend";
    currentRevenueTotal = computeRevenueTotal(currentOrders);
    updateOrdersSourcePill(currentOrdersSource);
    renderOrders();
    console.warn("Orders fallback:", error.message);
  }
};

const updateOrderStatus = async (orderId, nextStatus, selectElement) => {
  const normalizedStatus = normalizeOrderStatus(nextStatus);
  const existingOrder = (Array.isArray(currentOrders) ? currentOrders : []).find((order) => String(order.id) === String(orderId));

  if (!existingOrder) {
    return;
  }

  if (currentOrdersSource === "localStorage") {
    if (selectElement) {
      selectElement.disabled = true;
    }

    const updated = updateLocalOrderStatus(orderId, normalizedStatus);
    if (!updated) {
      showAdminToast("Could not update the demo order status.", "error");
    } else {
      showAdminToast(`Order marked as ${normalizedStatus}.`);
    }

    if (selectElement) {
      selectElement.disabled = false;
    }
    return;
  }

  if (selectElement) {
    selectElement.disabled = true;
  }

  try {
    const result = await fetchJson("orders.php", {
      method: "PUT",
      params: { restaurant: restaurantSelect?.value || currentRestaurant?.slug || DEFAULT_RESTAURANT_SLUG },
      body: {
        action: "update_status",
        id: orderId,
        status: normalizedStatus
      },
      headers: {
      }
    });

    const updatedOrder = normalizeOrderRecord(result.data || result.order || {
      ...existingOrder,
      status: result.status || normalizedStatus,
      order_status: result.status || normalizedStatus
    });

    currentOrders = currentOrders.map((order) => (
      String(order.id) === String(updatedOrder.id) ? updatedOrder : order
    ));
    currentOrdersSource = "backend";
    updateOrdersSourcePill(currentOrdersSource);
    renderOrders();
    showAdminToast(result.message || `Order marked as ${normalizedStatus}.`);
  } catch (error) {
    if (selectElement) {
      selectElement.value = existingOrder.status || "pending";
    }
    showAdminToast(error.message || "Could not update order status.", "error");
  } finally {
    if (selectElement) {
      selectElement.disabled = false;
    }
  }
};

const updateOrderCashReceived = async (orderId, buttonElement) => {
  const existingOrder = (Array.isArray(currentOrders) ? currentOrders : []).find((order) => String(order.id) === String(orderId));

  if (!existingOrder) {
    return;
  }

  if (isOrderCancelled(existingOrder)) {
    showAdminToast("Cancelled orders cannot be marked as cash received.", "error");
    return;
  }

  const orderTotal = calculateOrderTotal(existingOrder);
  if (orderTotal === null || orderTotal <= 0) {
    showAdminToast("Order amount is missing.", "error");
    return;
  }

  if (currentOrdersSource === "localStorage") {
    if (buttonElement) {
      buttonElement.disabled = true;
    }

    const updated = updateLocalOrderCashReceived(orderId);
    if (!updated) {
      showAdminToast("Could not record cash received for the demo order.", "error");
    } else {
      showAdminToast("Cash received recorded successfully.");
    }

    if (buttonElement) {
      buttonElement.disabled = false;
    }
    return;
  }

  if (buttonElement) {
    buttonElement.disabled = true;
  }

  try {
    const result = await fetchJson("orders.php", {
      method: "PUT",
      params: {
        restaurant: restaurantSelect?.value || currentRestaurant?.slug || DEFAULT_RESTAURANT_SLUG
      },
      body: {
        action: "cash_received",
        id: orderId
      },
      headers: {
      }
    });

    const updatedOrder = normalizeOrderRecord(result.data || result.order || {
      ...existingOrder,
      payment_status: "cash_received",
      cash_received_at: existingOrder.cash_received_at || new Date().toISOString(),
      revenue_posted_at: existingOrder.revenue_posted_at || new Date().toISOString(),
      revenue_amount: result.revenue_total || orderTotal
    });

    currentOrders = currentOrders.map((order) => (
      String(order.id) === String(updatedOrder.id) ? updatedOrder : order
    ));
    currentOrdersSource = "backend";
    updateOrdersSourcePill(currentOrdersSource);
    setRevenueTotal(result.revenue_total ?? computeRevenueTotal(currentOrders));
    renderOrders();
    showAdminToast(result.message || "Cash received recorded successfully.");
  } catch (error) {
    showAdminToast(error.message || "Could not record cash received.", "error");
  } finally {
    if (buttonElement) {
      buttonElement.disabled = false;
    }
  }
};

const openSidebar = (open) => {
  if (!sidebar || !sidebarOverlay) {
    return;
  }

  sidebar.classList.toggle("is-open", open);
  sidebarOverlay.classList.toggle("is-visible", open);
};

const redirectIfNeeded = () => {
  // Session auth is handled by the PHP entry pages and API guards.
};

const setButtonLoading = (loading) => {
  if (!settingsSaveButton) {
    return;
  }

  settingsSaveButton.disabled = loading;
  settingsSaveButton.textContent = loading ? "Saving..." : "Save Settings";
};

const showSettingsFeedback = (message, state = "success") => {
  if (!settingsFeedback) {
    return;
  }

  settingsFeedback.textContent = message;
  settingsFeedback.classList.toggle("is-error", state === "error");
};

const adminToastState = {
  host: null
};

const ensureAdminToastHost = () => {
  if (adminToastState.host && document.body.contains(adminToastState.host)) {
    return adminToastState.host;
  }

  adminToastState.host = document.getElementById("adminToastHost");
  if (!adminToastState.host) {
    adminToastState.host = document.createElement("div");
    adminToastState.host.id = "adminToastHost";
    adminToastState.host.className = "admin-toast-host";
    adminToastState.host.setAttribute("aria-live", "polite");
    adminToastState.host.setAttribute("aria-atomic", "true");
    document.body.appendChild(adminToastState.host);
  }

  return adminToastState.host;
};

const showAdminToast = (message, type = "success") => {
  const text = String(message ?? "").trim();
  if (!text) {
    return null;
  }

  const host = ensureAdminToastHost();
  if (!host) {
    return null;
  }

  const safeType = ["success", "error", "warning"].includes(type) ? type : "success";
  const toast = document.createElement("div");
  let timerId = null;

  toast.className = `admin-toast admin-toast--${safeType}`;
  toast.setAttribute("role", safeType === "error" ? "alert" : "status");
  toast.innerHTML = `
    <span class="admin-toast__dot" aria-hidden="true"></span>
    <div class="admin-toast__body">
      <strong class="admin-toast__title">${safeType === "error" ? "Error" : safeType === "warning" ? "Notice" : "Success"}</strong>
      <p class="admin-toast__message">${escapeHTML(text)}</p>
    </div>
    <button type="button" class="admin-toast__close" aria-label="Dismiss notification">Ã—</button>
  `;

  const dismissToast = () => {
    if (!toast.isConnected) {
      return;
    }

    toast.classList.remove("is-visible");
    if (timerId !== null) {
      window.clearTimeout(timerId);
      timerId = null;
    }

    window.setTimeout(() => {
      toast.remove();
    }, 220);
  };

  toast.querySelector(".admin-toast__close")?.addEventListener("click", dismissToast);
  host.appendChild(toast);
  window.requestAnimationFrame(() => {
    toast.classList.add("is-visible");
  });
  timerId = window.setTimeout(dismissToast, 4500);

  return toast;
};

const setFieldValue = (name, value) => {
  if (!settingsForm) {
    return;
  }

  const field = settingsForm.elements.namedItem(name);
  if (!field || typeof field.value === "undefined") {
    return;
  }

  field.value = value ?? "";
};

const getFieldValue = (name) => {
  if (!settingsForm) {
    return "";
  }

  const field = settingsForm.elements.namedItem(name);
  if (!field || typeof field.value === "undefined") {
    return "";
  }

  return String(field.value ?? "").trim();
};

const isHexColor = (value) => /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(String(value || "").trim());

const isUrlLike = (value) => {
  const normalized = String(value || "").trim();
  return normalized === "" || normalized.startsWith("#") || /^https?:\/\/\S+$/i.test(normalized);
};

const validateSettingsImageValue = (value) => {
  return isValidImagePathOrUrl(value);
};

const isValidImagePathOrUrl = (value) => {
  const normalized = String(value ?? "").trim();
  if (normalized === "" || normalized.length > 255) {
    return false;
  }

  if (normalized.includes("\\") || normalized.includes("\0")) {
    return false;
  }

  if (/(^|[\\/])\.\.([\\/]|$)/.test(normalized)) {
    return false;
  }

  const allowedExtensions = ["jpg", "jpeg", "png", "webp"];

  if (normalized.startsWith("/")) {
    return false;
  }

  const pathPart = normalized.split(/[?#]/)[0];
  if (!/^(?:images\/|uploads\/restaurants\/)/i.test(pathPart)) {
    return false;
  }

  const extension = String(pathPart.split(/[?#]/)[0].split(".").pop() || "").toLowerCase();
  return allowedExtensions.includes(extension);
};

const resolveAdminImageUrl = (value) => {
  const rawValue = normalizeAdminImagePath(value);

  if (!rawValue) {
    return orderItemPlaceholderImage;
  }

  if (/^(?:https?:)?\/\//i.test(rawValue) || /^(?:data:|blob:)/i.test(rawValue)) {
    return rawValue;
  }

  if (/(^|[\\/])\.\.([\\/]|$)/.test(rawValue)) {
    return orderItemPlaceholderImage;
  }

  const normalizedPath = `/restaurant_builder/${rawValue.replace(/^\/+/, "")}`;

  try {
    return new URL(normalizedPath, window.location.origin).href;
  } catch {
    return orderItemPlaceholderImage;
  }
};

const resolveOrderItemImagePath = (item) => {
  const menuItems = Array.isArray(currentMenuItems) ? currentMenuItems : [];
  const menuMatch = menuItems.find((menuItem) => {
    if (item?.menu_item_id !== null && item?.menu_item_id !== undefined) {
      return String(menuItem.id) === String(item.menu_item_id);
    }

    const itemName = String(item?.food_name ?? "").trim().toLowerCase();
    return itemName !== "" && String(menuItem.name ?? "").trim().toLowerCase() === itemName;
  }) || null;

  return item?.food_image
    || item?.image
    || item?.menu_image
    || item?.menu_item_image
    || item?.item_image
    || menuMatch?.image
    || "";
};

const renderOrders = () => {
  if (!ordersTableBody) {
    return;
  }

  const orders = Array.isArray(currentOrders) ? currentOrders : [];
  if (statOrders) {
    statOrders.textContent = String(orders.length);
  }
  if (statFoods) {
    statFoods.textContent = String(currentMenuItems.length);
  }
  if (statDeals) {
    statDeals.textContent = String(currentDeals.length);
  }
  if (statRevenue) {
    statRevenue.textContent = formatCurrency(currentRevenueTotal);
  }
  updateOrdersSourcePill(currentOrdersSource);

  ordersTableBody.innerHTML = "";

  if (!orders.length) {
    const emptyRow = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 7;
    cell.textContent = currentOrdersSource === "localStorage"
      ? "No demo orders saved yet. Submit the public order form to see local fallback data here."
      : "No orders found for this restaurant yet.";
    emptyRow.appendChild(cell);
    ordersTableBody.appendChild(emptyRow);
    return;
  }

  orders.slice(0, 12).forEach((order) => {
    const row = document.createElement("tr");
    const customerCell = document.createElement("td");
    customerCell.innerHTML = `
      <strong>${escapeHTML(order.customer_name || "Guest")}</strong>
      ${order.address ? `<span class="order-meta">${escapeHTML(order.address)}</span>` : ""}
    `;

    const foodCell = document.createElement("td");
    const displayItems = Array.isArray(order.items) && order.items.length > 0
      ? order.items
      : [{
          food_name: order.food_item || "-",
          food_image: order.food_image || "",
          quantity: Number(order.quantity || order.item_quantity || 1)
        }];
    foodCell.appendChild(renderOrderItems(displayItems));

    const phoneCell = document.createElement("td");
    phoneCell.textContent = order.phone || order.customer_phone || "-";

    const messageCell = document.createElement("td");
    messageCell.textContent = order.message || order.note || "-";

    const statusCell = document.createElement("td");
    statusCell.appendChild(renderOrderStatusControl(order));

    const paymentCell = document.createElement("td");
    paymentCell.appendChild(renderOrderPaymentControl(order));

    const timeCell = document.createElement("td");
    timeCell.textContent = formatDate(order.created_at);

    row.append(customerCell, foodCell, phoneCell, messageCell, statusCell, paymentCell, timeCell);

    ordersTableBody.appendChild(row);
  });
};

const renderSnapshot = () => {
  if (menuSnapshotList) {
    const snapshotItems = currentMenuItems.length
      ? currentMenuItems.slice(0, 5).map((item) => ({
          name: item.name,
          category: item.category_name || "Unassigned",
          price: item.discount_price && Number(item.discount_price) < Number(item.price)
            ? `${formatCurrency(item.discount_price)} (was ${formatCurrency(item.price)})`
            : formatCurrency(item.price)
        }))
      : menuSnapshot;

    menuSnapshotList.innerHTML = snapshotItems
      .map((item) => `
        <article class="snapshot-item">
          <strong>${escapeHTML(item.name)}</strong>
          <span>${escapeHTML(item.category)} Â· ${escapeHTML(item.price)}</span>
        </article>
      `)
      .join("");
  }

  if (categoryPills) {
    const categoryCards = currentCategories.length
      ? currentCategories.map((category) => ({
          name: category.name,
          description: category.description || "Ready for add / edit / archive actions."
        }))
      : categories.map((category) => ({
          name: category,
          description: "Ready for add / edit / archive actions."
        }));

    categoryPills.innerHTML = categoryCards
      .map((category) => `
        <article class="pill-item">
          <strong>${escapeHTML(category.name)}</strong>
          <span>${escapeHTML(category.description)}</span>
        </article>
      `)
      .join("");
  }
};

const renderSettingsSummary = () => {
  if (!settingsDetails) {
    return;
  }

  const restaurant = currentRestaurant || {
    id: 0,
    name: "Restaurant",
    slug: DEFAULT_RESTAURANT_SLUG,
    business_type: "restaurant"
  };
  const settings = currentSettings || {};

  settingsDetails.innerHTML = `
    <div class="settings-item">
      <dt>Restaurant</dt>
      <dd>${escapeHTML(restaurant.name || "Restaurant")}</dd>
    </div>
    <div class="settings-item">
      <dt>Slug</dt>
      <dd>${escapeHTML(restaurant.slug || DEFAULT_RESTAURANT_SLUG)}</dd>
    </div>
    <div class="settings-item">
      <dt>Business Type</dt>
      <dd>${escapeHTML(restaurant.business_type || "restaurant")}</dd>
    </div>
    <div class="settings-item">
      <dt>Site Title</dt>
      <dd>${escapeHTML(settings.site_title || "Not loaded yet")}</dd>
    </div>
    <div class="settings-item">
      <dt>Hero Title</dt>
      <dd>${escapeHTML(settings.hero_title || "Not loaded yet")}</dd>
    </div>
    <div class="settings-item">
      <dt>Opening Hours</dt>
      <dd>${escapeHTML(settings.opening_hours || "Not loaded yet")}</dd>
    </div>
  `;
};

const updatePublicPreviewLink = (slug) => {
  if (!publicPreviewLink) {
    return;
  }

  const resolvedSlug = String(slug || "").trim();
  if (!resolvedSlug) {
    publicPreviewLink.href = "../index.html";
    return;
  }

  publicPreviewLink.href = `../index.html?tenant=${encodeURIComponent(resolvedSlug)}`;
};

const renderActiveRestaurantContext = (context = null) => {
  const activeRestaurant = context?.active_restaurant || null;
  const user = context?.user || null;
  const plan = context?.plan || null;
  const sessionId = context?.session?.active_restaurant_id ?? context?.active_restaurant_id ?? null;

  if (activeRestaurantName) {
    activeRestaurantName.textContent = activeRestaurant?.name || "No restaurant selected";
  }

  if (activeRestaurantMeta) {
    const metaParts = [];
    if (user?.email) {
      metaParts.push(user.email);
    }
    if (user?.normalized_role) {
      metaParts.push(String(user.normalized_role).replace(/_/g, " "));
    }
    if (activeRestaurant?.slug) {
      metaParts.push(`tenant: ${activeRestaurant.slug}`);
    } else {
      metaParts.push("Select a restaurant to continue");
    }
    if (plan?.slug) {
      metaParts.push(`plan: ${plan.name || plan.slug}`);
    }
    if (sessionId) {
      metaParts.push(`session id: ${sessionId}`);
    }

    activeRestaurantMeta.textContent = metaParts.join(" · ");
  }

  if (activeRestaurantContext) {
    activeRestaurantContext.dataset.state = activeRestaurant ? "active" : "empty";
  }
};

const setFeatureAccessStatus = (element, state, label) => {
  if (!element) {
    return;
  }

  element.textContent = label;
  element.dataset.state = state;
  featureAccessStatusClasses.forEach((className) => element.classList.remove(className));
  element.classList.add(`feature-access-status--${state}`);
};

const updateSettingsAccessNote = (context = currentUserContext, brandingEnabled = true) => {
  if (!settingsAccessNote) {
    return;
  }

  const hasPlan = hasPlanContext(context);
  let message = "Select a restaurant to review branding availability.";
  let isError = false;

  if (hasPlan) {
    if (brandingEnabled) {
      message = "Branding is available on this plan. Settings remain editable.";
    } else {
      message = "Branding is locked on this plan. Website settings are read-only until you upgrade.";
      isError = true;
    }
  }

  settingsAccessNote.textContent = message;
  settingsAccessNote.classList.toggle("is-error", isError);
};

const updateFeatureAccessCard = (context = currentUserContext, featureStates = {}) => {
  const hasPlan = hasPlanContext(context);
  const plan = context?.plan || null;
  const activeRestaurantName = context?.active_restaurant?.name || currentRestaurant?.name || "this tenant";
  const planName = plan?.name || plan?.slug || "current";

  if (featureAccessCard) {
    featureAccessCard.dataset.planState = hasPlan ? (plan?.slug || "active") : "unselected";
  }

  if (featureAccessHeadline) {
    featureAccessHeadline.textContent = hasPlan
      ? `${planName} plan access`
      : "Select a restaurant";
  }

  if (featureAccessSummary) {
    featureAccessSummary.textContent = hasPlan
      ? `${activeRestaurantName} is currently using the ${planName} plan.`
      : "Advanced feature availability follows the active tenant plan.";
  }

  const rowStates = hasPlan
    ? {
        statistics: featureStates.statisticsEnabled ? "available" : "locked",
        exports: featureStates.exportsEnabled ? "available" : "locked",
        staff_management: featureStates.staffManagementEnabled ? "available" : "locked",
        branding: featureStates.brandingEnabled ? "available" : "locked",
        custom_domain: featureStates.customDomainEnabled ? "placeholder" : "locked"
      }
    : {
        statistics: "pending",
        exports: "pending",
        staff_management: "pending",
        branding: "pending",
        custom_domain: "pending"
      };

  featureAccessRows.forEach((row) => {
    const state = rowStates[row.featureKey] || "pending";
    let statusLabel = row.pendingLabel;
    let noteText = row.pendingNote;
    let stateClass = "pending";

    if (state === "locked") {
      statusLabel = row.lockedLabel;
      noteText = row.lockedNote;
      stateClass = "locked";
    } else if (state === "available" || state === "placeholder") {
      statusLabel = row.availableLabel;
      noteText = row.availableNote;
      stateClass = row.stateClass || "available";
    }

    setFeatureAccessStatus(row.statusElement, stateClass, statusLabel);
    if (row.noteElement) {
      row.noteElement.textContent = noteText;
    }
  });

  updateSettingsAccessNote(context, Boolean(featureStates.brandingEnabled));
};

const featureLockMessage = "This feature is not available on your current plan. Upgrade required.";

const hasPlanContext = (context = currentUserContext) => Boolean(context?.plan?.slug);

const isFeatureEnabled = (featureKey, context = currentUserContext) => {
  if (!hasPlanContext(context)) {
    return true;
  }

  return Boolean(context?.plan?.features?.[featureKey]);
};

const setFormFeatureLock = (form, locked) => {
  if (!form) {
    return;
  }

  form.dataset.featureLocked = locked ? "true" : "false";
  Array.from(form.querySelectorAll("input, select, textarea, button")).forEach((field) => {
    if (field.type === "hidden") {
      return;
    }
    field.disabled = locked;
  });
};

const renderLockedTableMessage = (tableBody, columnCount, message) => {
  if (!tableBody) {
    return;
  }

  tableBody.innerHTML = `
    <tr>
      <td colspan="${columnCount}">${escapeHTML(message)}</td>
    </tr>
  `;
};

const applyPlanFeatureState = (context = currentUserContext) => {
  const hasPlan = hasPlanContext(context);
  const featureStates = {
    galleryEnabled: !hasPlan || Boolean(context?.plan?.features?.gallery),
    dealsEnabled: !hasPlan || Boolean(context?.plan?.features?.deals),
    statisticsEnabled: !hasPlan || Boolean(context?.plan?.features?.statistics),
    exportsEnabled: !hasPlan || Boolean(context?.plan?.features?.exports),
    staffManagementEnabled: !hasPlan || Boolean(context?.plan?.features?.staff_management),
    brandingEnabled: !hasPlan || Boolean(context?.plan?.features?.branding),
    customDomainEnabled: !hasPlan || Boolean(context?.plan?.features?.custom_domain)
  };

  setFormFeatureLock(galleryForm, !featureStates.galleryEnabled);
  setFormFeatureLock(dealForm, !featureStates.dealsEnabled);
  setFormFeatureLock(settingsForm, hasPlan && !featureStates.brandingEnabled);
  updateFeatureAccessCard(context, featureStates);

  if (!featureStates.galleryEnabled) {
    showGalleryFeedback(featureLockMessage, "error");
    renderLockedTableMessage(galleryTableBody, 6, featureLockMessage);
  } else if (currentGallery.length || galleryTableBody) {
    renderGallery();
    showGalleryFeedback("");
  }

  if (!featureStates.dealsEnabled) {
    showDealFeedback(featureLockMessage, "error");
    renderLockedTableMessage(dealTableBody, 6, featureLockMessage);
  } else if (dealTableBody) {
    renderDeals();
    showDealFeedback("");
  }

  return featureStates;
};

const setTenantManagementFeedback = (message, state = "success") => {
  if (!tenantManagementFeedback) {
    return;
  }

  tenantManagementFeedback.textContent = message;
  tenantManagementFeedback.classList.toggle("is-error", state === "error");
};

const renderTenantManagementVisibility = (context = currentUserContext) => {
  const isSuperAdmin = Boolean(context?.user?.is_super_admin);

  if (tenantManagementPanel) {
    tenantManagementPanel.hidden = !isSuperAdmin;
  }

  if (!isSuperAdmin) {
    managementRestaurants = [];
    managementOwnerAssignments = [];
    managementPlanAssignments = [];
    managementPlans = [];
    if (restaurantManagementTableBody) {
      restaurantManagementTableBody.innerHTML = "";
    }
    if (restaurantOwnerTableBody) {
      restaurantOwnerTableBody.innerHTML = "";
    }
    if (restaurantOwnerRestaurantField) {
      restaurantOwnerRestaurantField.innerHTML = "";
    }
    if (restaurantPlanRestaurantField) {
      restaurantPlanRestaurantField.innerHTML = "";
    }
    if (restaurantPlanField) {
      restaurantPlanField.innerHTML = "";
    }
    if (restaurantPlanFeedback) {
      restaurantPlanFeedback.textContent = "";
    }
  }

  return isSuperAdmin;
};

const getActiveRestaurants = (restaurants) => (Array.isArray(restaurants) ? restaurants : [])
  .filter((restaurant) => String(restaurant?.status || "").toLowerCase() === "active");

const populateRestaurantOwnerSelect = (restaurants) => {
  if (!restaurantOwnerRestaurantField) {
    return;
  }

  const activeRestaurants = getActiveRestaurants(restaurants);
  restaurantOwnerRestaurantField.innerHTML = "";

  if (!activeRestaurants.length) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "No active restaurants";
    restaurantOwnerRestaurantField.appendChild(option);
    restaurantOwnerRestaurantField.value = "";
    return;
  }

  activeRestaurants.forEach((restaurant) => {
    const option = document.createElement("option");
    option.value = String(restaurant.id);
    option.textContent = `${restaurant.name} (${restaurant.slug})`;
    restaurantOwnerRestaurantField.appendChild(option);
  });

  restaurantOwnerRestaurantField.value = String(activeRestaurants[0].id);
};

const fillRestaurantManagementForm = (restaurant = null) => {
  if (restaurantManagementIdField) {
    restaurantManagementIdField.value = String(restaurant?.id ?? "");
  }
  if (restaurantManagementNameField) {
    restaurantManagementNameField.value = String(restaurant?.name ?? "");
  }
  if (restaurantManagementSlugField) {
    restaurantManagementSlugField.value = String(restaurant?.slug ?? "");
  }
  if (restaurantManagementStatusField) {
    restaurantManagementStatusField.value = String(restaurant?.status ?? "active");
  }
  if (restaurantManagementSaveButton) {
    restaurantManagementSaveButton.textContent = restaurant?.id ? "Update Restaurant" : "Save Restaurant";
  }
};

const resetRestaurantManagementForm = () => {
  fillRestaurantManagementForm(null);
  setTenantManagementFeedback("Restaurant form reset.");
};

const resetRestaurantOwnerForm = () => {
  if (restaurantOwnerNameField) {
    restaurantOwnerNameField.value = "";
  }
  if (restaurantOwnerEmailField) {
    restaurantOwnerEmailField.value = "";
  }
  if (restaurantOwnerPasswordField) {
    restaurantOwnerPasswordField.value = "";
  }
  if (restaurantOwnerRestaurantField && restaurantOwnerRestaurantField.options.length > 0) {
    restaurantOwnerRestaurantField.selectedIndex = 0;
  }
  setTenantManagementFeedback("Owner form reset.");
};

const renderRestaurantManagementTable = (restaurants) => {
  if (!restaurantManagementTableBody) {
    return;
  }

  const list = Array.isArray(restaurants) ? restaurants : [];
  restaurantManagementTableBody.innerHTML = "";

  if (!list.length) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 7;
    cell.textContent = "No restaurants found.";
    row.appendChild(cell);
    restaurantManagementTableBody.appendChild(row);
    return;
  }

  list.forEach((restaurant) => {
    const row = document.createElement("tr");
    const ownerName = String(restaurant?.owner_name || restaurant?.owner?.name || "Unassigned").trim() || "Unassigned";
    const ownerEmail = String(restaurant?.owner_email || restaurant?.owner?.email || "").trim();
    const ownerLabel = ownerEmail ? `${ownerName} (${ownerEmail})` : ownerName;
    const assignment = Array.isArray(managementPlanAssignments)
      ? managementPlanAssignments.find((entry) => String(entry?.restaurant?.id || "") === String(restaurant?.id || ""))
      : null;
    const planLabel = String(assignment?.plan?.name || assignment?.plan?.slug || "Unassigned").trim() || "Unassigned";

    row.innerHTML = `
      <td>${escapeHTML(restaurant?.name || "")}</td>
      <td><code>${escapeHTML(restaurant?.slug || "")}</code></td>
      <td><span class="status-pill ${String(restaurant?.status || "").toLowerCase() === "active" ? "status-pill--live" : ""}">${escapeHTML(restaurant?.status || "active")}</span></td>
      <td><span class="status-pill status-pill--accent">${escapeHTML(planLabel)}</span></td>
      <td>${escapeHTML(ownerLabel)}</td>
      <td>${escapeHTML(formatDate(restaurant?.updated_at || restaurant?.created_at || null))}</td>
      <td>
        <button type="button" class="btn btn--ghost btn--compact" data-tenant-action="edit-restaurant" data-restaurant-id="${escapeHTML(String(restaurant?.id || ""))}">Edit</button>
      </td>
    `;
    restaurantManagementTableBody.appendChild(row);
  });
};

const renderRestaurantOwnerTable = (assignments) => {
  if (!restaurantOwnerTableBody) {
    return;
  }

  const list = Array.isArray(assignments) ? assignments : [];
  restaurantOwnerTableBody.innerHTML = "";

  if (!list.length) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 4;
    cell.textContent = "No owner assignments found.";
    row.appendChild(cell);
    restaurantOwnerTableBody.appendChild(row);
    return;
  }

  list.forEach((assignment) => {
    const restaurant = assignment?.restaurant || {};
    const owner = assignment?.owner || {};
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${escapeHTML(restaurant?.name || "")}<br><small>${escapeHTML(restaurant?.slug || "")}</small></td>
      <td>${escapeHTML(owner?.name || "Unassigned")}</td>
      <td>${escapeHTML(owner?.email || "—")}</td>
      <td>${escapeHTML(owner?.role || "—")}</td>
    `;
    restaurantOwnerTableBody.appendChild(row);
  });
};

const setRestaurantPlanFeedback = (message, state = "success") => {
  if (!restaurantPlanFeedback) {
    return;
  }

  restaurantPlanFeedback.textContent = message;
  restaurantPlanFeedback.classList.toggle("is-error", state === "error");
};

const getPlanAssignmentForRestaurant = (restaurantId) => {
  if (!Array.isArray(managementPlanAssignments)) {
    return null;
  }

  return managementPlanAssignments.find((entry) => String(entry?.restaurant?.id || "") === String(restaurantId || "")) || null;
};

const populateRestaurantPlanRestaurantSelect = (restaurants, preferredId = "") => {
  if (!restaurantPlanRestaurantField) {
    return;
  }

  const list = Array.isArray(restaurants) ? restaurants : [];
  restaurantPlanRestaurantField.innerHTML = "";

  if (!list.length) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "No restaurants found";
    restaurantPlanRestaurantField.appendChild(option);
    restaurantPlanRestaurantField.value = "";
    return;
  }

  list.forEach((restaurant) => {
    const option = document.createElement("option");
    option.value = String(restaurant.id);
    option.textContent = `${restaurant.name} (${restaurant.slug})`;
    restaurantPlanRestaurantField.appendChild(option);
  });

  const resolvedRestaurantId = list.some((restaurant) => String(restaurant.id) === String(preferredId))
    ? String(preferredId)
    : String(list[0].id);
  restaurantPlanRestaurantField.value = resolvedRestaurantId;
};

const populateRestaurantPlanSelect = (plans, preferredSlug = "") => {
  if (!restaurantPlanField) {
    return;
  }

  const list = Array.isArray(plans) ? plans : [];
  restaurantPlanField.innerHTML = "";

  if (!list.length) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "No plans found";
    restaurantPlanField.appendChild(option);
    restaurantPlanField.value = "";
    return;
  }

  list.forEach((plan) => {
    const option = document.createElement("option");
    option.value = String(plan.slug || "");
    option.textContent = `${plan.name}${plan.description ? ` — ${plan.description}` : ""}`;
    restaurantPlanField.appendChild(option);
  });

  const resolvedPlanSlug = list.some((plan) => String(plan.slug) === String(preferredSlug))
    ? String(preferredSlug)
    : String(list[0].slug || "");
  restaurantPlanField.value = resolvedPlanSlug;
};

const syncRestaurantPlanForm = () => {
  if (!restaurantPlanRestaurantField || !restaurantPlanField) {
    return;
  }

  const restaurantId = String(restaurantPlanRestaurantField.value || "");
  const assignment = getPlanAssignmentForRestaurant(restaurantId);
  const preferredSlug = String(assignment?.plan?.slug || managementPlans[0]?.slug || "");
  populateRestaurantPlanSelect(managementPlans, preferredSlug);

  const selectedRestaurant = Array.isArray(managementRestaurants)
    ? managementRestaurants.find((restaurant) => String(restaurant.id) === restaurantId)
    : null;
  if (selectedRestaurant) {
    const currentPlanName = String(assignment?.plan?.name || assignment?.plan?.slug || "Unassigned").trim();
    setRestaurantPlanFeedback(`Current plan for ${selectedRestaurant.name}: ${currentPlanName}.`);
  }
};

const saveRestaurantPlan = async () => {
  if (!renderTenantManagementVisibility()) {
    return;
  }

  const restaurantId = String(restaurantPlanRestaurantField?.value || "").trim();
  const planSlug = String(restaurantPlanField?.value || "").trim();

  if (!restaurantId) {
    setRestaurantPlanFeedback("Select a restaurant first.", "error");
    return;
  }

  if (!planSlug) {
    setRestaurantPlanFeedback("Select a plan first.", "error");
    return;
  }

  try {
    if (restaurantPlanSaveButton) {
      restaurantPlanSaveButton.disabled = true;
    }

    setRestaurantPlanFeedback("Assigning plan...");
    const result = await fetchJson("restaurant-plans.php", {
      method: "POST",
      body: {
        restaurant_id: restaurantId,
        plan_slug: planSlug
      }
    });

    const message = result.message || "Plan assigned successfully.";
    setRestaurantPlanFeedback(message);
    showAdminToast(message);
    await loadCurrentUserContext();
    await loadTenantManagementData();

    const updatedRestaurant = result.data?.restaurant || null;
    if (updatedRestaurant?.slug && restaurantSelect?.value === updatedRestaurant.slug) {
      await refreshRestaurantCrudData(updatedRestaurant.slug);
    }
  } catch (error) {
    const message = error.message || "Unable to assign plan.";
    setRestaurantPlanFeedback(message, "error");
    showAdminToast(message, "error");
  } finally {
    if (restaurantPlanSaveButton) {
      restaurantPlanSaveButton.disabled = false;
    }
  }
};

const loadTenantManagementData = async () => {
  if (!renderTenantManagementVisibility()) {
    return;
  }

  try {
    const [restaurantsResult, ownersResult, plansResult] = await Promise.all([
      fetchJson("restaurants.php"),
      fetchJson("restaurant-owners.php"),
      fetchJson("restaurant-plans.php")
    ]);

    managementRestaurants = Array.isArray(restaurantsResult.data) ? restaurantsResult.data : [];
    managementOwnerAssignments = Array.isArray(ownersResult.data) ? ownersResult.data : [];
    managementPlans = Array.isArray(plansResult.data?.plans) ? plansResult.data.plans : [];
    managementPlanAssignments = Array.isArray(plansResult.data?.assignments) ? plansResult.data.assignments : [];
    renderRestaurantManagementTable(managementRestaurants);
    renderRestaurantOwnerTable(managementOwnerAssignments);
    populateRestaurantOwnerSelect(managementRestaurants);
    populateRestaurantPlanRestaurantSelect(managementRestaurants, restaurantPlanRestaurantField?.value || managementRestaurants[0]?.id || "");
    syncRestaurantPlanForm();
  } catch (error) {
    const message = error.message || "Unable to load tenant management data.";
    setTenantManagementFeedback(message, "error");
    showAdminToast(message, "error");
  }
};

const extractRestaurantFormPayload = () => ({
  id: String(restaurantManagementIdField?.value || "").trim(),
  name: String(restaurantManagementNameField?.value || "").trim(),
  slug: String(restaurantManagementSlugField?.value || "").trim(),
  status: String(restaurantManagementStatusField?.value || "active").trim()
});

const validateRestaurantFormPayload = (payload) => {
  const errors = {};

  if (!payload.name) {
    errors.name = "Restaurant name is required.";
  } else if (payload.name.length > 150) {
    errors.name = "Restaurant name must be 150 characters or fewer.";
  }

  if (!payload.slug) {
    errors.slug = "Restaurant slug is required.";
  } else if (payload.slug.length > 191) {
    errors.slug = "Restaurant slug must be 191 characters or fewer.";
  } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(payload.slug)) {
    errors.slug = "Restaurant slug may only contain lowercase letters, numbers, and hyphens.";
  }

  if (!["active", "inactive", "suspended"].includes(payload.status)) {
    errors.status = "Invalid restaurant status.";
  }

  return errors;
};

const saveRestaurantManagement = async (event) => {
  event.preventDefault();

  if (!renderTenantManagementVisibility()) {
    return;
  }

  const payload = extractRestaurantFormPayload();
  const errors = validateRestaurantFormPayload(payload);

  if (Object.keys(errors).length > 0) {
    setTenantManagementFeedback("Validation error. Check the highlighted fields.", "error");
    showAdminToast("Validation error. Check the highlighted fields.", "warning");
    const firstField = Object.keys(errors)[0];
    const field = restaurantManagementForm?.elements.namedItem(firstField);
    if (field && typeof field.focus === "function") {
      field.focus();
    }
    return;
  }

  const method = payload.id ? "PATCH" : "POST";
  const body = {
    name: payload.name,
    slug: payload.slug,
    status: payload.status
  };

  try {
    setTenantManagementFeedback(payload.id ? "Updating restaurant..." : "Creating restaurant...");
    if (restaurantManagementSaveButton) {
      restaurantManagementSaveButton.disabled = true;
    }

    const result = await fetchJson("restaurants.php", {
      method,
      body: {
        ...body,
        id: payload.id || undefined
      }
    });

    const message = result.message || (payload.id ? "Restaurant updated successfully." : "Restaurant created successfully.");
    setTenantManagementFeedback(message);
    showAdminToast(message);
    resetRestaurantManagementForm();
    await loadCurrentUserContext();
    await loadRestaurants();
    await loadTenantManagementData();
  } catch (error) {
    const message = error.message || "Unable to save restaurant.";
    setTenantManagementFeedback(message, "error");
    showAdminToast(message, "error");
  } finally {
    if (restaurantManagementSaveButton) {
      restaurantManagementSaveButton.disabled = false;
    }
  }
};

const extractOwnerFormPayload = () => ({
  name: String(restaurantOwnerNameField?.value || "").trim(),
  email: String(restaurantOwnerEmailField?.value || "").trim(),
  password: String(restaurantOwnerPasswordField?.value || "").trim(),
  restaurant_id: String(restaurantOwnerRestaurantField?.value || "").trim()
});

const validateOwnerFormPayload = (payload) => {
  const errors = {};

  if (!payload.name) {
    errors.name = "Owner name is required.";
  } else if (payload.name.length > 150) {
    errors.name = "Owner name must be 150 characters or fewer.";
  }

  if (!payload.email) {
    errors.email = "Owner email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (payload.password && payload.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }

  if (!payload.restaurant_id) {
    errors.restaurant_id = "Select a restaurant.";
  }

  return errors;
};

const saveRestaurantOwner = async (event) => {
  event.preventDefault();

  if (!renderTenantManagementVisibility()) {
    return;
  }

  const payload = extractOwnerFormPayload();
  const errors = validateOwnerFormPayload(payload);

  if (Object.keys(errors).length > 0) {
    setTenantManagementFeedback("Validation error. Check the highlighted fields.", "error");
    showAdminToast("Validation error. Check the highlighted fields.", "warning");
    const firstField = Object.keys(errors)[0];
    const field = restaurantOwnerForm?.elements.namedItem(firstField);
    if (field && typeof field.focus === "function") {
      field.focus();
    }
    return;
  }

  try {
    if (restaurantOwnerSaveButton) {
      restaurantOwnerSaveButton.disabled = true;
    }

    setTenantManagementFeedback("Saving owner assignment...");

    const result = await fetchJson("restaurant-owners.php", {
      method: "POST",
      body: {
        name: payload.name,
        email: payload.email,
        password: payload.password,
        restaurant_id: payload.restaurant_id
      }
    });

    const message = result.message || "Owner saved successfully.";
    setTenantManagementFeedback(message);
    showAdminToast(message);
    resetRestaurantOwnerForm();
    await loadCurrentUserContext();
    await loadRestaurants();
    await loadTenantManagementData();
  } catch (error) {
    const message = error.message || "Unable to save owner assignment.";
    setTenantManagementFeedback(message, "error");
    showAdminToast(message, "error");
  } finally {
    if (restaurantOwnerSaveButton) {
      restaurantOwnerSaveButton.disabled = false;
    }
  }
};

const syncTenantContext = async (slug = "") => {
  const result = await fetchJson("select-restaurant.php", {
    method: "POST",
    body: {
      restaurant_slug: slug
    }
  });

  currentUserContext = result.data || currentUserContext;
  loadedRestaurants = Array.isArray(currentUserContext?.restaurants) ? currentUserContext.restaurants : loadedRestaurants;
  renderActiveRestaurantContext(currentUserContext);
  applyPlanFeatureState(currentUserContext);
  return currentUserContext;
};

const loadCurrentUserContext = async () => {
  const result = await fetchJson("current-user.php");
  currentUserContext = result.data || null;
  loadedRestaurants = Array.isArray(currentUserContext?.restaurants) ? currentUserContext.restaurants : [];
  renderActiveRestaurantContext(currentUserContext);
  applyPlanFeatureState(currentUserContext);
  renderTenantManagementVisibility(currentUserContext);
  return currentUserContext;
};

const populateRestaurantSelect = (restaurants, preferredSlug = "") => {
  if (!restaurantSelect) {
    return;
  }

  restaurantSelect.innerHTML = "";

  if (!Array.isArray(restaurants) || restaurants.length === 0) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "No restaurants assigned";
    restaurantSelect.appendChild(option);
    restaurantSelect.value = "";
    window.localStorage.removeItem(selectedRestaurantKey);
    updatePublicPreviewLink("");
    return;
  }

  restaurants.forEach((restaurant) => {
    const option = document.createElement("option");
    option.value = restaurant.slug;
    option.textContent = `${restaurant.name} (${restaurant.slug})`;
    restaurantSelect.appendChild(option);
  });

  const fallbackSlug = restaurants[0]?.slug || DEFAULT_RESTAURANT_SLUG;
  const resolvedSlug = restaurants.some((restaurant) => restaurant.slug === preferredSlug) ? preferredSlug : fallbackSlug;
  restaurantSelect.value = resolvedSlug;
  window.localStorage.setItem(selectedRestaurantKey, resolvedSlug);
  updatePublicPreviewLink(resolvedSlug);
};

const fillSettingsForm = (settings) => {
  if (!settingsForm) {
    return;
  }

  settingsFieldNames.forEach((fieldName) => {
    setFieldValue(fieldName, settings?.[fieldName] ?? "");
  });

  if (logoUploadField) {
    logoUploadField.value = "";
  }
  if (faviconUploadField) {
    faviconUploadField.value = "";
  }
  if (heroUploadField) {
    heroUploadField.value = "";
  }
  if (aboutUploadField) {
    aboutUploadField.value = "";
  }

  updateLogoPreview(settings?.logo ?? "");
  updateFaviconPreview(settings?.favicon ?? "");
  updateHeroPreview(settings?.hero_image ?? "");
  updateAboutPreview(settings?.about_image ?? "");
};

const collectSettingsPayload = () => {
  const payload = {};
  settingsFieldNames.forEach((fieldName) => {
    payload[fieldName] = getFieldValue(fieldName);
  });
  return payload;
};

const validateSettingsPayload = (payload) => {
  const errors = {};

  const validateImageField = (fieldName, label, required = false) => {
    const value = String(payload[fieldName] || "").trim();

    if (value === "") {
      if (required) {
        errors[fieldName] = `${label} path is required.`;
      }
      return;
    }

    if (value.length > 255) {
      errors[fieldName] = `${label} path must be 255 characters or fewer.`;
      return;
    }

    if (!validateSettingsImageValue(value)) {
      errors[fieldName] = `${label} must be a valid uploaded image path.`;
    }
  };

  if (!payload.site_title || payload.site_title.length > 150) {
    errors.site_title = "Site title must be 150 characters or fewer.";
  }
  if (!payload.hero_title || payload.hero_title.length > 255) {
    errors.hero_title = "Hero title must be 255 characters or fewer.";
  }
  if (!payload.hero_subtitle || payload.hero_subtitle.length > 1000) {
    errors.hero_subtitle = "Hero subtitle must be 1000 characters or fewer.";
  }
  if (!payload.hero_button_text || payload.hero_button_text.length > 80) {
    errors.hero_button_text = "Hero button text must be 80 characters or fewer.";
  }
  if (!isUrlLike(payload.hero_button_link)) {
    errors.hero_button_link = "Hero button link must be empty, # anchor, or a valid URL.";
  }
  if (!payload.about_title || payload.about_title.length > 191) {
    errors.about_title = "About title must be 191 characters or fewer.";
  }
  if (!payload.about_text) {
    errors.about_text = "About text is required.";
  }
  if (!payload.phone || payload.phone.length > 50) {
    errors.phone = "Phone number must be 50 characters or fewer.";
  }
  if (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    errors.email = "Invalid email address.";
  }
  if (!payload.email) {
    errors.email = "Invalid email address.";
  }
  if (!payload.address || payload.address.length > 255) {
    errors.address = "Address must be 255 characters or fewer.";
  }
  if (!payload.opening_hours || payload.opening_hours.length > 191) {
    errors.opening_hours = "Opening hours must be 191 characters or fewer.";
  }
  validateImageField("logo", "Logo");
  validateImageField("favicon", "Favicon");
  validateImageField("hero_image", "Hero image", true);
  validateImageField("about_image", "About image", true);
  urlLikeFieldNames.forEach((fieldName) => {
    if (!isUrlLike(payload[fieldName])) {
      errors[fieldName] = "This field must be empty, #, or a valid URL.";
    }
  });
  if (payload.whatsapp_number && payload.whatsapp_number.length > 30) {
    errors.whatsapp_number = "WhatsApp number must be 30 characters or fewer.";
  }
  colorFieldNames.forEach((fieldName) => {
    if (!isHexColor(payload[fieldName])) {
      errors[fieldName] = "Enter a valid hex color value.";
    }
  });

  return errors;
};

const focusFirstSettingsField = (errors) => {
  if (!settingsForm) {
    return;
  }

  const firstFieldName = Object.keys(errors)[0];
  if (!firstFieldName) {
    return;
  }

  const field = settingsForm.elements.namedItem(firstFieldName);
  if (field && typeof field.focus === "function") {
    field.focus();
  }
};

const loadSettingsForRestaurant = async (slug) => {
  const resolvedSlug = slug || DEFAULT_RESTAURANT_SLUG;

  if (settingsFeedback) {
    showSettingsFeedback(`Loading ${resolvedSlug} settings...`);
  }

  try {
    const result = await fetchJson("settings.php", {
      params: { restaurant: resolvedSlug }
    });

    currentRestaurant = result.data?.restaurant || null;
    currentSettings = result.data?.settings || null;

    if (currentRestaurant && restaurantSelect && restaurantSelect.value !== currentRestaurant.slug) {
      restaurantSelect.value = currentRestaurant.slug;
    }

    fillSettingsForm(currentSettings || {});
    renderSettingsSummary();
    updatePublicPreviewLink(currentRestaurant?.slug || resolvedSlug);
    window.localStorage.setItem(selectedRestaurantKey, currentRestaurant?.slug || resolvedSlug);
    showSettingsFeedback(`Loaded ${currentRestaurant?.name || resolvedSlug} settings.`);
  } catch (error) {
    if (error.status === 401 || error.status === 403) {
      showSettingsFeedback(error.message || "Unable to load settings.", "error");
      showAdminToast(error.message || "Unable to load settings.", "error");
      return;
    }

    showSettingsFeedback(error.message || "Unable to load settings.", "error");
  }
};

const loadRestaurants = async () => {
  if (!restaurantSelect) {
    return;
  }

  const preferredSlug = window.localStorage.getItem(selectedRestaurantKey) || DEFAULT_RESTAURANT_SLUG;

  try {
    const context = await loadCurrentUserContext();
    const restaurants = Array.isArray(context?.restaurants) ? context.restaurants : [];
    const selectableRestaurants = context?.user?.is_super_admin
      ? getActiveRestaurants(restaurants)
      : restaurants;

    if (!selectableRestaurants.length) {
      loadedRestaurants = [];
      populateRestaurantSelect([], preferredSlug);
      const noActiveMessage = context?.user?.is_super_admin
        ? "No active restaurants are available for tenant switching."
        : "No restaurants are assigned to this account.";
      showSettingsFeedback(noActiveMessage, "error");
      showAdminToast(noActiveMessage, "error");
      if (context?.user?.is_super_admin) {
        await loadTenantManagementData();
      }
      return;
    }

    loadedRestaurants = selectableRestaurants;
    const activeSlug = context?.active_restaurant?.slug || "";
    const resolvedPreferredSlug = activeSlug || preferredSlug;
    populateRestaurantSelect(loadedRestaurants, resolvedPreferredSlug);

    const selectedSlug = restaurantSelect.value || resolvedPreferredSlug || loadedRestaurants[0].slug;
    if (!context?.active_restaurant || context.active_restaurant.slug !== selectedSlug) {
      await syncTenantContext(selectedSlug);
    }

    await loadSettingsForRestaurant(selectedSlug);
    await loadCategoriesForRestaurant(selectedSlug);
    await loadMenuItemsForRestaurant(selectedSlug);
    await loadDealsForRestaurant(selectedSlug);
    await loadGalleryForRestaurant(selectedSlug);
    await loadOrdersForRestaurant(selectedSlug);
    await loadTenantManagementData();
  } catch (error) {
    if (error.status === 401 || error.status === 403) {
      showSettingsFeedback(error.message || "Unable to load restaurants.", "error");
      showAdminToast(error.message || "Unable to load restaurants.", "error");
      return;
    }

    loadedRestaurants = [];
    populateRestaurantSelect([], preferredSlug);
    showSettingsFeedback(error.message || "Unable to load restaurants.", "error");
    showAdminToast(error.message || "Unable to load restaurants.", "error");
  }
};

const saveSettings = async (event) => {
  event.preventDefault();

  if (!restaurantSelect) {
    return;
  }

  const selectedSlug = restaurantSelect.value || DEFAULT_RESTAURANT_SLUG;

  if (!isFeatureEnabled("branding")) {
    showSettingsFeedback(featureLockMessage, "error");
    showAdminToast(featureLockMessage, "error");
    return;
  }

  setButtonLoading(true);

  try {
    if (logoUploadField?.files?.[0]) {
      const uploadedPath = await uploadLogoImage({ showToast: false });
      if (!uploadedPath) {
        return;
      }
    }

    if (faviconUploadField?.files?.[0]) {
      const uploadedPath = await uploadFaviconImage({ showToast: false });
      if (!uploadedPath) {
        return;
      }
    }

    if (heroUploadField?.files?.[0]) {
      const uploadedPath = await uploadHeroImage({ showToast: false });
      if (!uploadedPath) {
        return;
      }
    }

    if (aboutUploadField?.files?.[0]) {
      const uploadedPath = await uploadAboutImage({ showToast: false });
      if (!uploadedPath) {
        return;
      }
    }

    const payload = collectSettingsPayload();
    const errors = validateSettingsPayload(payload);

    if (Object.keys(errors).length > 0) {
      showSettingsFeedback("Validation error. Check the highlighted fields.", "error");
      showAdminToast("Validation error. Check the highlighted fields.", "warning");
      focusFirstSettingsField(errors);
      return;
    }

    showSettingsFeedback("Saving settings...");

    const result = await fetchJson("settings.php", {
      method: "PUT",
      params: { restaurant: selectedSlug },
      body: payload
    });

    currentRestaurant = result.data?.restaurant || currentRestaurant;
    currentSettings = result.data?.settings || currentSettings;
    fillSettingsForm(currentSettings || payload);
    renderSettingsSummary();
    updatePublicPreviewLink(currentRestaurant?.slug || selectedSlug);
    showSettingsFeedback(result.message || "Settings saved successfully.");
    showAdminToast(result.message || "Settings saved successfully.");
    window.localStorage.setItem(selectedRestaurantKey, currentRestaurant?.slug || selectedSlug);
  } catch (error) {
    if (error.status === 401 || error.status === 403) {
      showSettingsFeedback(error.message || "Could not save settings.", "error");
      showAdminToast(error.message || "Could not save settings.", "error");
      return;
    }

    const message = error.message || "Unexpected error while saving settings.";
    showSettingsFeedback(message, "error");
    showAdminToast(message, "error");
  } finally {
    setButtonLoading(false);
  }
};

const showCategoryFeedback = (message, state = "success") => {
  if (!categoryFeedback) {
    return;
  }

  categoryFeedback.textContent = message;
  categoryFeedback.classList.toggle("is-error", state === "error");
};

const showMenuItemFeedback = (message, state = "success") => {
  if (!menuItemFeedback) {
    return;
  }

  menuItemFeedback.textContent = message;
  menuItemFeedback.classList.toggle("is-error", state === "error");
};

const setCategoryButtonLoading = (loading) => {
  if (!categorySaveButton) {
    return;
  }

  categorySaveButton.disabled = loading;
  categorySaveButton.textContent = loading ? "Saving..." : (categoryIdField?.value ? "Update Category" : "Save Category");
};

const setMenuItemButtonLoading = (loading) => {
  if (!menuItemSaveButton) {
    return;
  }

  menuItemSaveButton.disabled = loading;
  menuItemSaveButton.textContent = loading ? "Saving..." : (menuItemIdField?.value ? "Update Menu Item" : "Save Menu Item");
};

const focusFirstInvalidField = (form, errors) => {
  if (!form) {
    return;
  }

  const firstFieldName = Object.keys(errors)[0];
  if (!firstFieldName) {
    return;
  }

  const field = form.elements.namedItem(firstFieldName);
  if (field && typeof field.focus === "function") {
    field.focus();
  }
};

const summarizeValidationErrors = (errors, fallbackMessage = "Validation error. Check the highlighted fields.") => {
  if (!errors || typeof errors !== "object") {
    return fallbackMessage;
  }

  const messages = Object.values(errors)
    .map((value) => String(value || "").trim())
    .filter(Boolean);

  if (!messages.length) {
    return fallbackMessage;
  }

  const uniqueMessages = [...new Set(messages)];
  return uniqueMessages.length === 1
    ? `Please fix: ${uniqueMessages[0]}`
    : `Please fix: ${uniqueMessages.join(", ")}`;
};

const getCategoryFormPayload = () => ({
  id: String(categoryIdField?.value || "").trim(),
  name: String(categoryNameField?.value || "").trim(),
  slug: String(categorySlugField?.value || "").trim(),
  description: String(categoryDescriptionField?.value || "").trim(),
  image: String(categoryImageField?.value || "").trim(),
  sort_order: String(categorySortField?.value || "").trim(),
  status: String(categoryStatusField?.value || "active").trim()
});

const validateCategoryFormPayload = (payload) => {
  const errors = {};

  if (!payload.name) {
    errors.name = "Category name is required.";
  } else if (payload.name.length > 150) {
    errors.name = "Category name must be 150 characters or fewer.";
  }

  if (payload.slug.length > 180) {
    errors.slug = "Slug must be 180 characters or fewer.";
  }

  if (payload.image.length > 255) {
    errors.image = "Image path must be 255 characters or fewer.";
  } else if (payload.image && !isValidImagePathOrUrl(payload.image)) {
    errors.image = "Image must be a valid uploaded image path.";
  }

  if (!isNonNegativeInteger(payload.sort_order)) {
    errors.sort_order = "Sort order must be a whole number.";
  }

  if (!["active", "inactive"].includes(payload.status)) {
    errors.status = "Invalid status selected.";
  }

  return errors;
};

const fillCategoryForm = (category = {}) => {
  if (!categoryForm) {
    return;
  }

  categoryIdField.value = category.id ? String(category.id) : "";
  categoryNameField.value = category.name || "";
  categorySlugField.value = category.slug || "";
  categoryDescriptionField.value = category.description || "";
  categoryImageField.value = category.image || "";
  if (categoryUploadField) {
    categoryUploadField.value = "";
  }
  updateCategoryPreview(category.image || "");
  categorySortField.value = category.sort_order ?? 0;
  categoryStatusField.value = category.status || "active";

  if (categorySaveButton) {
    categorySaveButton.textContent = category.id ? "Update Category" : "Save Category";
  }
};

const resetCategoryForm = () => {
  fillCategoryForm({});
  if (categoryForm) {
    categoryForm.reset();
  }
  if (categorySortField) {
    categorySortField.value = 0;
  }
  if (categoryUploadField) {
    categoryUploadField.value = "";
  }
  updateCategoryPreview("");
  if (categoryStatusField) {
    categoryStatusField.value = "active";
  }
  if (categorySaveButton) {
    categorySaveButton.textContent = "Save Category";
  }
  showCategoryFeedback("");
};

const renderCategories = () => {
  if (!categoryTableBody) {
    return;
  }

  if (!currentCategories.length) {
    categoryTableBody.innerHTML = `
      <tr>
        <td colspan="5">No active categories found for this restaurant yet.</td>
      </tr>
    `;
    return;
  }

  categoryTableBody.innerHTML = currentCategories.map((category) => `
    <tr>
      <td>
        <strong>${escapeHTML(category.name)}</strong>
        ${category.description ? `<small class="table-meta">${escapeHTML(category.description)}</small>` : ""}
      </td>
      <td>${escapeHTML(category.slug || "-")}</td>
      <td>${escapeHTML(category.sort_order ?? 0)}</td>
      <td><span class="status-badge status-badge--${category.status === "active" ? "active" : "inactive"}">${escapeHTML(category.status || "active")}</span></td>
      <td>
        <div class="table-actions">
          <button type="button" class="btn btn--ghost btn--compact table-action" data-action="edit-category" data-id="${category.id}">Edit</button>
          <button type="button" class="btn btn--ghost btn--compact table-action table-action--danger" data-action="delete-category" data-id="${category.id}">Delete</button>
        </div>
      </td>
    </tr>
  `).join("");
};

const populateMenuItemCategoryOptions = (selectedCategoryId = "", selectedCategoryLabel = "") => {
  if (!menuItemCategoryField) {
    return;
  }

  const selectedValue = selectedCategoryId === null || selectedCategoryId === undefined
    ? ""
    : String(selectedCategoryId);
  const options = ['<option value="">No category</option>'];
  const activeCategoryIds = new Set();

  currentCategories.forEach((category) => {
    activeCategoryIds.add(String(category.id));
    const isInactive = String(category.status || "").toLowerCase() !== "active";
    const label = isInactive ? `${category.name} (inactive)` : category.name;
    options.push(`<option value="${escapeHTML(category.id)}">${escapeHTML(label)}</option>`);
  });

  if (selectedValue && !activeCategoryIds.has(selectedValue)) {
    const label = selectedCategoryLabel || `Inactive category #${selectedValue}`;
    options.push(`<option value="${escapeHTML(selectedValue)}">${escapeHTML(label)} (inactive)</option>`);
  }

  menuItemCategoryField.innerHTML = options.join("");

  if (selectedValue) {
    menuItemCategoryField.value = selectedValue;
  }
};

const getMenuItemFormPayload = () => ({
  id: String(menuItemIdField?.value || "").trim(),
  category_id: String(menuItemCategoryField?.value || "").trim(),
  name: String(menuItemNameField?.value || "").trim(),
  slug: String(menuItemSlugField?.value || "").trim(),
  description: String(menuItemDescriptionField?.value || "").trim(),
  price: String(menuItemPriceField?.value || "").trim(),
  discount_price: String(menuItemDiscountField?.value || "").trim(),
  image: String(menuItemImageField?.value || "").trim(),
  badge_text: String(menuItemBadgeField?.value || "").trim(),
  is_featured: menuItemFeaturedField?.checked ? 1 : 0,
  is_available: menuItemAvailableField?.checked ? 1 : 0,
  sort_order: String(menuItemSortField?.value || "").trim(),
  status: String(menuItemStatusField?.value || "active").trim()
});

const validateMenuItemFormPayload = (payload) => {
  const errors = {};

  if (!payload.name) {
    errors.name = "Menu item name is required.";
  } else if (payload.name.length > 150) {
    errors.name = "Menu item name must be 150 characters or fewer.";
  }

  if (!payload.price || Number.isNaN(Number(payload.price)) || Number(payload.price) < 0) {
    errors.price = "Price is required and must be zero or greater.";
  }

  if (payload.discount_price !== "") {
    if (Number.isNaN(Number(payload.discount_price)) || Number(payload.discount_price) < 0) {
      errors.discount_price = "Discount price must be zero or greater.";
    } else if (!Number.isNaN(Number(payload.price)) && Number(payload.discount_price) >= Number(payload.price)) {
      errors.discount_price = "Discount price must be less than the regular price.";
    }
  }

  if (payload.slug.length > 180) {
    errors.slug = "Slug must be 180 characters or fewer.";
  }

  if (payload.image.length > 255) {
    errors.image = "Image path must be 255 characters or fewer.";
  } else if (!payload.image) {
    errors.image = "Image path is required.";
  } else if (!isValidImagePathOrUrl(payload.image)) {
    errors.image = "Image must be a valid uploaded image path.";
  }

  if (payload.badge_text.length > 100) {
    errors.badge_text = "Badge text must be 100 characters or fewer.";
  }

  if (!isNonNegativeInteger(payload.sort_order)) {
    errors.sort_order = "Sort order must be a whole number.";
  }

  if (payload.category_id && !/^[1-9]\d*$/.test(payload.category_id)) {
    errors.category_id = "Category must be a valid positive integer.";
  }

  if (!["active", "inactive"].includes(payload.status)) {
    errors.status = "Invalid status selected.";
  }

  return errors;
};

const fillMenuItemForm = (menuItem = {}) => {
  if (!menuItemForm) {
    return;
  }

  menuItemIdField.value = menuItem.id ? String(menuItem.id) : "";
  populateMenuItemCategoryOptions(menuItem.category_id || "", menuItem.category_name || "");
  menuItemCategoryField.value = menuItem.category_id ? String(menuItem.category_id) : "";
  menuItemNameField.value = menuItem.name || "";
  menuItemSlugField.value = menuItem.slug || "";
  menuItemDescriptionField.value = menuItem.description || "";
  menuItemPriceField.value = menuItem.price ?? "";
  menuItemDiscountField.value = menuItem.discount_price ?? "";
  menuItemImageField.value = menuItem.image || "";
  if (menuItemUploadField) {
    menuItemUploadField.value = "";
  }
  updateMenuItemPreview(menuItem.image || "");
  menuItemBadgeField.value = menuItem.badge_text || "";
  menuItemFeaturedField.checked = Number(menuItem.is_featured || 0) === 1;
  menuItemAvailableField.checked = menuItem.is_available === undefined ? true : Number(menuItem.is_available) === 1;
  menuItemSortField.value = menuItem.sort_order ?? 0;
  menuItemStatusField.value = menuItem.status || "active";

  if (menuItemSaveButton) {
    menuItemSaveButton.textContent = menuItem.id ? "Update Menu Item" : "Save Menu Item";
  }
};

const resetMenuItemForm = () => {
  fillMenuItemForm({});
  if (menuItemForm) {
    menuItemForm.reset();
  }
  if (menuItemCategoryField) {
    populateMenuItemCategoryOptions();
  }
  if (menuItemAvailableField) {
    menuItemAvailableField.checked = true;
  }
  if (menuItemFeaturedField) {
    menuItemFeaturedField.checked = false;
  }
  if (menuItemUploadField) {
    menuItemUploadField.value = "";
  }
  updateMenuItemPreview("");
  if (menuItemSortField) {
    menuItemSortField.value = 0;
  }
  if (menuItemStatusField) {
    menuItemStatusField.value = "active";
  }
  if (menuItemSaveButton) {
    menuItemSaveButton.textContent = "Save Menu Item";
  }
  showMenuItemFeedback("");
};

const showDealFeedback = (message, state = "success") => {
  if (!dealFeedback) {
    return;
  }

  dealFeedback.textContent = message;
  dealFeedback.classList.toggle("is-error", state === "error");
};

const setDealButtonLoading = (loading) => {
  if (!dealSaveButton) {
    return;
  }

  dealSaveButton.disabled = loading;
  dealSaveButton.textContent = loading ? "Saving..." : (dealIdField?.value ? "Update Deal" : "Save Deal");
};

const normalizeDateTimeLocalValue = (value) => {
  const normalized = String(value || "").trim();
  if (!normalized) {
    return "";
  }

  const match = normalized.match(/^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2})(?::(\d{2}))?$/);
  if (match) {
    return `${match[1]}T${match[2]}`;
  }

  return normalized.includes("T") ? normalized.slice(0, 16) : normalized.replace(" ", "T").slice(0, 16);
};

const prepareDealDateTimeForApi = (value) => {
  const normalized = String(value || "").trim();
  if (!normalized) {
    return "";
  }

  const match = normalized.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})(?::(\d{2}))?$/);
  if (match) {
    return `${match[1]} ${match[2]}:${match[3] || "00"}`;
  }

  return normalized.replace("T", " ");
};

const getDealFormPayload = () => ({
  id: String(dealIdField?.value || "").trim(),
  title: String(dealTitleField?.value || "").trim(),
  description: String(dealDescriptionField?.value || "").trim(),
  badge_text: String(dealBadgeField?.value || "").trim(),
  regular_price: String(dealRegularPriceField?.value || "").trim(),
  deal_price: String(dealPriceField?.value || "").trim(),
  image: String(dealImageField?.value || "").trim(),
  starts_at: normalizeDateTimeLocalValue(dealStartsAtField?.value || ""),
  ends_at: normalizeDateTimeLocalValue(dealEndsAtField?.value || ""),
  sort_order: String(dealSortField?.value || "").trim(),
  status: String(dealStatusField?.value || "active").trim()
});

const validateDealFormPayload = (payload) => {
  const errors = {};

  if (!payload.title) {
    errors.title = "Deal title is required.";
  } else if (payload.title.length > 150) {
    errors.title = "Deal title must be 150 characters or fewer.";
  }

  if (!payload.description) {
    errors.description = "Deal description is required.";
  }

  if (payload.badge_text.length > 100) {
    errors.badge_text = "Badge text must be 100 characters or fewer.";
  }

  if (!payload.regular_price || Number.isNaN(Number(payload.regular_price)) || Number(payload.regular_price) <= 0) {
    errors.regular_price = "Regular price is required and must be greater than zero.";
  }

  if (!payload.deal_price || Number.isNaN(Number(payload.deal_price)) || Number(payload.deal_price) <= 0) {
    errors.deal_price = "Deal price is required and must be greater than zero.";
  }

  if (!Number.isNaN(Number(payload.regular_price)) && !Number.isNaN(Number(payload.deal_price)) && Number(payload.deal_price) >= Number(payload.regular_price)) {
    errors.deal_price = "Deal price must be less than the regular price.";
  }

  if (!payload.image) {
    errors.image = "Image path is required.";
  } else if (payload.image.length > 255) {
    errors.image = "Image path must be 255 characters or fewer.";
  } else if (!isValidImagePathOrUrl(payload.image)) {
    errors.image = "Image must be a valid uploaded image path.";
  }

  if (!isNonNegativeInteger(payload.sort_order)) {
    errors.sort_order = "Sort order must be a whole number.";
  }

  if (!["active", "inactive"].includes(payload.status)) {
    errors.status = "Invalid status selected.";
  }

  return errors;
};

const fillDealForm = (deal = {}) => {
  if (!dealForm) {
    return;
  }

  dealIdField.value = deal.id ? String(deal.id) : "";
  dealTitleField.value = deal.title || "";
  dealDescriptionField.value = deal.description || "";
  dealBadgeField.value = deal.badge_text || "";
  dealRegularPriceField.value = deal.regular_price ?? "";
  dealPriceField.value = deal.deal_price ?? "";
  dealImageField.value = deal.image || "";
  if (dealUploadField) {
    dealUploadField.value = "";
  }
  updateDealPreview(deal.image || "");
  dealStartsAtField.value = normalizeDateTimeLocalValue(deal.starts_at || "");
  dealEndsAtField.value = normalizeDateTimeLocalValue(deal.ends_at || "");
  dealSortField.value = deal.sort_order ?? 0;
  dealStatusField.value = deal.status || "active";

  if (dealSaveButton) {
    dealSaveButton.textContent = deal.id ? "Update Deal" : "Save Deal";
  }
};

const resetDealForm = () => {
  fillDealForm({});
  if (dealForm) {
    dealForm.reset();
  }
  if (dealUploadField) {
    dealUploadField.value = "";
  }
  updateDealPreview("");
  if (dealSortField) {
    dealSortField.value = 0;
  }
  if (dealStatusField) {
    dealStatusField.value = "active";
  }
  if (dealSaveButton) {
    dealSaveButton.textContent = "Save Deal";
  }
  showDealFeedback("");
};

const renderDeals = () => {
  if (!dealTableBody) {
    return;
  }

  if (statDeals) {
    statDeals.textContent = String(currentDeals.length);
  }

  if (!currentDeals.length) {
    dealTableBody.innerHTML = `
      <tr>
        <td colspan="6">No deals found for this restaurant yet.</td>
      </tr>
    `;
    return;
  }

  dealTableBody.innerHTML = currentDeals.map((deal) => {
    const hasDiscount = Number(deal.deal_price) > 0 && Number(deal.regular_price) > Number(deal.deal_price);
    const priceMarkup = hasDiscount
      ? `<strong>${escapeHTML(formatCurrency(deal.deal_price))}</strong><small class="table-meta">Was ${escapeHTML(formatCurrency(deal.regular_price))}</small>`
      : `<strong>${escapeHTML(formatCurrency(deal.deal_price || deal.regular_price))}</strong>`;

    return `
      <tr>
        <td>
          <strong>${escapeHTML(deal.title)}</strong>
          ${deal.description ? `<small class="table-meta">${escapeHTML(deal.description)}</small>` : ""}
        </td>
        <td>${priceMarkup}</td>
        <td>${escapeHTML(deal.badge_text || "-")}</td>
        <td>${escapeHTML(deal.sort_order ?? 0)}</td>
        <td><span class="status-badge status-badge--${deal.status === "active" ? "active" : "inactive"}">${escapeHTML(deal.status || "active")}</span></td>
        <td>
          <div class="table-actions">
            <button type="button" class="btn btn--ghost btn--compact table-action" data-action="edit-deal" data-id="${deal.id}">Edit</button>
            <button type="button" class="btn btn--ghost btn--compact table-action table-action--danger" data-action="delete-deal" data-id="${deal.id}">Delete</button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
};

const loadDealsForRestaurant = async (slug) => {
  const resolvedSlug = slug || DEFAULT_RESTAURANT_SLUG;
  if (!isFeatureEnabled("deals")) {
    currentDeals = [];
    applyPlanFeatureState(currentUserContext);
    return;
  }

  try {
    const result = await fetchJson("deals.php", {
      params: { restaurant: resolvedSlug, include_inactive: 1 },
      headers: {
      }
    });

    currentDeals = Array.isArray(result.data) ? result.data : [];
    renderDeals();
  } catch (error) {
    currentDeals = [];
    renderDeals();
    showDealFeedback(error.message || "Unable to load deals.", "error");
  }
};

const saveDeal = async (event) => {
  event.preventDefault();

  if (!restaurantSelect || !dealForm) {
    return;
  }

  if (!isFeatureEnabled("deals")) {
    showDealFeedback(featureLockMessage, "error");
    return;
  }

  const selectedSlug = restaurantSelect.value || DEFAULT_RESTAURANT_SLUG;

  setDealButtonLoading(true);

  try {
    if (dealUploadField?.files?.[0]) {
      const uploadedPath = await uploadDealImage({ showToast: false });
      if (!uploadedPath) {
        return;
      }
    }

    const payload = getDealFormPayload();
    const errors = validateDealFormPayload(payload);

    if (Object.keys(errors).length > 0) {
      showDealFeedback("Validation error. Check the highlighted fields.", "error");
      showAdminToast("Validation error. Check the highlighted fields.", "warning");
      focusFirstInvalidField(dealForm, errors);
      return;
    }

    showDealFeedback("Saving deal...");

    const method = payload.id ? "PUT" : "POST";
    const result = await fetchJson("deals.php", {
      method,
      params: { restaurant: selectedSlug },
      body: {
        ...payload,
        starts_at: prepareDealDateTimeForApi(payload.starts_at),
        ends_at: prepareDealDateTimeForApi(payload.ends_at)
      },
      headers: {
      }
    });

    resetDealForm();
    await loadDealsForRestaurant(selectedSlug);
    const successMessage = result.message || "Deal saved successfully.";
    showDealFeedback(successMessage);
    showAdminToast(successMessage);
  } catch (error) {
    const message = error.message || "Could not save deal.";
    showDealFeedback(message, "error");
    showAdminToast(message, "error");
    if (error.details) {
      focusFirstInvalidField(dealForm, error.details);
    }
  } finally {
    setDealButtonLoading(false);
  }
};

const editDeal = (id) => {
  if (!isFeatureEnabled("deals")) {
    showDealFeedback(featureLockMessage, "error");
    return;
  }

  const deal = currentDeals.find((item) => String(item.id) === String(id));
  if (!deal) {
    showDealFeedback("Deal not found.", "error");
    return;
  }

  fillDealForm(deal);
  showDealFeedback(`Editing ${deal.title}.`);
  showAdminToast(`Editing ${deal.title}.`, "warning");
  dealForm?.scrollIntoView({ behavior: "smooth", block: "start" });
};

const deleteDeal = async (id) => {
  if (!isFeatureEnabled("deals")) {
    showDealFeedback(featureLockMessage, "error");
    return;
  }

  const deal = currentDeals.find((item) => String(item.id) === String(id));
  if (!deal) {
    showDealFeedback("Deal not found.", "error");
    return;
  }

  if (!window.confirm(`Archive "${deal.title}"? This will set the deal to inactive.`)) {
    return;
  }

  const selectedSlug = restaurantSelect?.value || DEFAULT_RESTAURANT_SLUG;
  setDealButtonLoading(true);
  showDealFeedback("Deleting deal...");

  try {
    const result = await fetchJson("deals.php", {
      method: "DELETE",
      params: { restaurant: selectedSlug },
      body: { id: deal.id },
      headers: {
      }
    });

    if (String(dealIdField?.value || "") === String(deal.id)) {
      resetDealForm();
    }
    await loadDealsForRestaurant(selectedSlug);
    const successMessage = result.message || "Deal archived successfully.";
    showDealFeedback(successMessage);
    showAdminToast(successMessage);
  } catch (error) {
    const message = error.message || "Could not delete deal.";
    showDealFeedback(message, "error");
    showAdminToast(message, "error");
  } finally {
    setDealButtonLoading(false);
  }
};

const showGalleryFeedback = (message, state = "success") => {
  if (!galleryFeedback) {
    return;
  }

  galleryFeedback.textContent = message;
  galleryFeedback.classList.toggle("is-error", state === "error");
};

const adminAssetUrl = (path) => {
  const value = String(path || "").trim();
  if (!value) {
    return "";
  }

  if (/^(?:https?:|data:|blob:)/i.test(value)) {
    return value;
  }

  if (value.startsWith("/")) {
    return "";
  }

  return `../${value.replace(/^(?:\.\/)+/, "")}`;
};

const releaseGalleryPreviewObjectUrl = () => {
  if (galleryPreviewObjectUrl && galleryPreviewObjectUrl.startsWith("blob:")) {
    URL.revokeObjectURL(galleryPreviewObjectUrl);
  }
  galleryPreviewObjectUrl = "";
};

const updateImagePreview = (path, previewElement, previewImageElement, fallbackElement = null) => {
  if (!previewElement || !previewImageElement) {
    return;
  }

  const previewUrl = adminAssetUrl(path);
  if (!previewUrl) {
    previewElement.hidden = true;
    previewImageElement.removeAttribute("src");
    previewImageElement.hidden = false;
    previewImageElement.onerror = null;
    previewImageElement.onload = null;
    if (fallbackElement) {
      fallbackElement.hidden = true;
    }
    return;
  }

  previewElement.hidden = false;
  previewImageElement.hidden = false;
  if (fallbackElement) {
    fallbackElement.hidden = true;
  }
  previewImageElement.onload = () => {
    previewImageElement.hidden = false;
    if (fallbackElement) {
      fallbackElement.hidden = true;
    }
  };
  previewImageElement.onerror = () => {
    previewImageElement.hidden = true;
    if (fallbackElement) {
      fallbackElement.hidden = false;
      previewElement.hidden = false;
    } else {
      previewElement.hidden = true;
    }
  };
  previewImageElement.src = previewUrl;
};

const updateSettingsImagePreview = (path, previewElement, previewImageElement, fit = "cover") => {
  updateImagePreview(path, previewElement, previewImageElement);
  if (previewImageElement) {
    previewImageElement.style.objectFit = fit;
  }
};

const updateLogoPreview = (path) => {
  updateSettingsImagePreview(path, logoPreview, logoPreviewImage, "contain");
};

const updateHeroPreview = (path) => {
  updateSettingsImagePreview(path, heroPreview, heroPreviewImage);
};

const updateAboutPreview = (path) => {
  updateSettingsImagePreview(path, aboutPreview, aboutPreviewImage);
};

const updateGalleryPreview = (path) => {
  releaseGalleryPreviewObjectUrl();
  updateImagePreview(path, galleryPreview, galleryPreviewImage, galleryPreviewFallback);
};

const updateGalleryPreviewFromFile = (file) => {
  if (!(file instanceof File)) {
    releaseGalleryPreviewObjectUrl();
    updateGalleryPreview("");
    return;
  }

  releaseGalleryPreviewObjectUrl();
  galleryPreviewObjectUrl = URL.createObjectURL(file);
  updateImagePreview(galleryPreviewObjectUrl, galleryPreview, galleryPreviewImage, galleryPreviewFallback);
};

const updateMenuItemPreview = (path) => {
  updateImagePreview(path, menuItemPreview, menuItemPreviewImage);
};

const updateDealPreview = (path) => {
  updateImagePreview(path, dealPreview, dealPreviewImage);
};

const updateCategoryPreview = (path) => {
  updateImagePreview(path, categoryPreview, categoryPreviewImage);
};

const updateFaviconPreview = (path) => {
  updateSettingsImagePreview(path, faviconPreview, faviconPreviewImage, "contain");
};

const previewImageFile = (file, previewUpdater) => {
  if (!(file instanceof File)) {
    previewUpdater("");
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    previewUpdater(String(reader.result || ""));
  };
  reader.onerror = () => {
    previewUpdater("");
  };
  reader.readAsDataURL(file);
};

const validateSelectedImageFile = (file) => {
  if (!(file instanceof File) || file.size < 1) {
    return "Please select an image before saving.";
  }

  const fileName = String(file.name || "");
  const extension = fileName.includes(".") ? fileName.split(".").pop().toLowerCase() : "";

  if (file.size > imageUploadMaxBytes) {
    return "Image must be 3 MB or smaller.";
  }

  if (file.type && !imageUploadMimeTypes.includes(file.type)) {
    return "Only JPG, PNG, and WebP images are allowed.";
  }

  if (!imageUploadExtensions.includes(extension)) {
    return "Only JPG, PNG, and WebP images are allowed.";
  }

  return "";
};

const handleImageFileSelection = (fileInput, previewUpdater, fallbackValue = "", showFeedback = () => {}) => {
  const selectedFile = fileInput?.files?.[0] || null;

  if (!selectedFile) {
    previewUpdater(fallbackValue);
    showFeedback("");
    return;
  }

  const validationMessage = validateSelectedImageFile(selectedFile);
  if (validationMessage) {
    showFeedback(validationMessage, "error");
    showAdminToast(validationMessage, "error");
    if (fileInput) {
      fileInput.value = "";
    }
    previewUpdater(fallbackValue);
    return;
  }

  previewImageFile(selectedFile, previewUpdater);
  showFeedback("");
};

const setUploadButtonLoading = (button, loading) => {
  if (!button) {
    return;
  }

  button.disabled = loading;
  button.textContent = loading ? "Uploading..." : "Upload";
};

const setGalleryUploadButtonLoading = (loading) => {
  setUploadButtonLoading(galleryUploadButton, loading);
};

const setGalleryButtonLoading = (loading) => {
  if (!gallerySaveButton) {
    return;
  }

  gallerySaveButton.disabled = loading;
  gallerySaveButton.textContent = loading
    ? "Saving..."
    : (galleryIdField?.value ? "Update Gallery Item" : "Save Gallery Item");
};

const setMenuItemUploadButtonLoading = (loading) => {
  setUploadButtonLoading(menuItemUploadButton, loading);
};

const setDealUploadButtonLoading = (loading) => {
  setUploadButtonLoading(dealUploadButton, loading);
};

const uploadPurposeFeatureMap = {
  gallery: "gallery",
  deals: "deals",
  settings: "branding"
};

const assertUploadPurposeAllowed = (purpose, showFeedback, showToast = true) => {
  const featureKey = uploadPurposeFeatureMap[purpose];
  if (!featureKey || isFeatureEnabled(featureKey)) {
    return true;
  }

  const message = featureLockMessage;
  showFeedback(message, "error");
  if (showToast) {
    showAdminToast(message, "error");
  }

  return false;
};

const uploadRestaurantImage = async ({
  fileInput,
  imageInput,
  previewUpdater,
  setLoading,
  showFeedback,
  purpose,
  slot = "",
  maxBytes = imageUploadMaxBytes,
  showToast = true
}) => {
  const reportError = (message) => {
    showFeedback(message, "error");
    if (showToast) {
      showAdminToast(message, "error");
    }
    return null;
  };

  if (!restaurantSelect || !fileInput || !imageInput) {
    return null;
  }

  if (!assertUploadPurposeAllowed(purpose, showFeedback, showToast)) {
    return null;
  }

  const file = fileInput.files?.[0];
  if (!file) {
    return reportError("Please select an image to upload.");
  }

  if (file.type && !imageUploadMimeTypes.includes(file.type)) {
    return reportError("Only JPG, PNG, and WebP images are allowed.");
  }

  if (file.size > maxBytes) {
    return reportError("Image must be 3 MB or smaller.");
  }

  const selectedSlug = restaurantSelect.value || DEFAULT_RESTAURANT_SLUG;
  const formData = new FormData();
  formData.append("image", file);
  formData.append("purpose", purpose);
  if (slot) {
    formData.append("slot", slot);
  }

  setLoading(true);
  showFeedback("Uploading image...");

  try {
    const response = await fetch(buildApiUrl("uploads.php", { restaurant: selectedSlug }), {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData
    });

    let result = null;
    try {
      result = await response.json();
    } catch {
      result = null;
    }

    if (!response.ok || !result?.success || !result?.data?.path) {
      throw new Error(result?.errors?.image || result?.errors?.purpose || result?.message || `Upload failed with status ${response.status}.`);
    }

    imageInput.value = result.data.path;
    previewUpdater(result.data.path);
    if (fileInput) {
      fileInput.value = "";
    }
    showFeedback(result.message || "Image uploaded successfully.");
    if (showToast) {
      showAdminToast(result.message || "Image uploaded successfully.");
    }
    return result.data.path;
  } catch (error) {
    const message = error.message || "Could not upload image.";
    showFeedback(message, "error");
    if (showToast) {
      showAdminToast(message, "error");
    }
    return null;
  } finally {
    setLoading(false);
  }
};

const createSettingsImageUploadHandler = (slot, fileInput, imageInput, previewUpdater, button) => {
  return async (options = {}) => uploadRestaurantImage({
    fileInput,
    imageInput,
    previewUpdater,
    setLoading: (loading) => setUploadButtonLoading(button, loading),
    showFeedback: showSettingsFeedback,
    purpose: "settings",
    slot,
    showToast: options.showToast ?? true
  });
};

const uploadLogoImage = createSettingsImageUploadHandler("logo", logoUploadField, logoPathField, updateLogoPreview, logoUploadButton);
const uploadFaviconImage = createSettingsImageUploadHandler("favicon", faviconUploadField, faviconPathField, updateFaviconPreview, faviconUploadButton);
const uploadHeroImage = createSettingsImageUploadHandler("hero", heroUploadField, heroImagePathField, updateHeroPreview, heroUploadButton);
const uploadAboutImage = createSettingsImageUploadHandler("about", aboutUploadField, aboutImagePathField, updateAboutPreview, aboutUploadButton);

const uploadCategoryImage = async (options = {}) => uploadRestaurantImage({
  fileInput: categoryUploadField,
  imageInput: categoryImageField,
  previewUpdater: updateCategoryPreview,
  setLoading: (loading) => setUploadButtonLoading(categoryUploadButton, loading),
  showFeedback: showCategoryFeedback,
  purpose: "category",
  showToast: options.showToast ?? true
});

const uploadMenuItemImage = async (options = {}) => uploadRestaurantImage({
  fileInput: menuItemUploadField,
  imageInput: menuItemImageField,
  previewUpdater: updateMenuItemPreview,
  setLoading: setMenuItemUploadButtonLoading,
  showFeedback: showMenuItemFeedback,
  purpose: "menu",
  showToast: options.showToast ?? true
});

const uploadDealImage = async (options = {}) => uploadRestaurantImage({
  fileInput: dealUploadField,
  imageInput: dealImageField,
  previewUpdater: updateDealPreview,
  setLoading: setDealUploadButtonLoading,
  showFeedback: showDealFeedback,
  purpose: "deals",
  showToast: options.showToast ?? true
});

const getGalleryFormPayload = () => ({
  id: String(galleryIdField?.value || "").trim(),
  title: String(galleryTitleField?.value || "").trim(),
  caption: String(galleryCaptionField?.value || "").trim(),
  image: String(galleryImageField?.value || "").trim(),
  alt_text: String(galleryAltField?.value || "").trim(),
  sort_order: String(gallerySortField?.value ?? "").trim() || "0",
  status: String(galleryStatusField?.value || "active").trim()
});

const isGalleryImagePath = (value) => {
  const normalized = String(value ?? "").trim();
  if (normalized === "" || normalized.length > 255) {
    return false;
  }

  if (normalized.includes("\\") || normalized.includes("\0")) {
    return false;
  }

  if (/(^|[\\/])\.\.([\\/]|$)/.test(normalized)) {
    return false;
  }

  if (normalized.startsWith("/")) {
    return false;
  }

  const pathPart = normalized.split(/[?#]/)[0];
  if (!/^(?:images\/|uploads\/restaurants\/)/i.test(pathPart)) {
    return false;
  }

  const extension = String(pathPart.split(".").pop() || "").toLowerCase();
  return ["jpg", "jpeg", "png", "webp"].includes(extension);
};

const validateGalleryFormPayload = (payload, options = {}) => {
  const { skipImageValidation = false } = options;
  const errors = {};

  if (!payload.title) {
    errors.title = "Gallery title is required.";
  } else if (payload.title.length > 150) {
    errors.title = "Gallery title must be 150 characters or fewer.";
  }

  if (payload.caption.length > 1000) {
    errors.caption = "Caption must be 1000 characters or fewer.";
  }

  if (!skipImageValidation) {
    if (!payload.image) {
      errors.image = "Gallery image is required.";
    } else if (payload.image.length > 255) {
      errors.image = "Image path must be 255 characters or fewer.";
    } else if (!isGalleryImagePath(payload.image)) {
      errors.image = "Image must be a valid uploaded image path.";
    }
  }

  if (payload.alt_text.length > 255) {
    errors.alt_text = "Alt text must be 255 characters or fewer.";
  }

  const sortOrder = String(payload.sort_order ?? "").trim() || "0";
  if (!/^\d+$/.test(sortOrder)) {
    errors.sort_order = "Sort order must be a whole number.";
  }

  if (!["active", "inactive"].includes(payload.status)) {
    errors.status = "Invalid status selected.";
  }

  return errors;
};

const fillGalleryForm = (gallery = {}) => {
  if (!galleryForm) {
    return;
  }

  releaseGalleryPreviewObjectUrl();
  galleryIdField.value = gallery.id ? String(gallery.id) : "";
  galleryTitleField.value = gallery.title || "";
  galleryCaptionField.value = gallery.caption || "";
  galleryImageField.value = gallery.image || "";
  galleryAltField.value = gallery.alt_text || "";
  gallerySortField.value = gallery.sort_order ?? 0;
  galleryStatusField.value = gallery.status || "active";
  if (galleryUploadField) {
    galleryUploadField.value = "";
  }
  updateGalleryPreview(gallery.image || "");

  if (gallerySaveButton) {
    gallerySaveButton.textContent = gallery.id ? "Update Gallery Item" : "Save Gallery Item";
  }
};

const resetGalleryForm = () => {
  releaseGalleryPreviewObjectUrl();
  fillGalleryForm({});
  if (galleryForm) {
    galleryForm.reset();
  }
  if (gallerySortField) {
    gallerySortField.value = 0;
  }
  if (galleryStatusField) {
    galleryStatusField.value = "active";
  }
  if (galleryUploadField) {
    galleryUploadField.value = "";
  }
  updateGalleryPreview("");
  if (gallerySaveButton) {
    gallerySaveButton.textContent = "Save Gallery Item";
  }
  showGalleryFeedback("");
};

const uploadGalleryImage = async (options = {}) => {
  const { silent = false } = options;
  const uploadedPath = await uploadRestaurantImage({
    fileInput: galleryUploadField,
    imageInput: galleryImageField,
    previewUpdater: updateGalleryPreview,
    setLoading: setGalleryUploadButtonLoading,
    showFeedback: silent ? () => {} : showGalleryFeedback,
    purpose: "gallery",
    showToast: !silent
  });

  if (uploadedPath && galleryUploadField) {
    galleryUploadField.value = "";
  }

  return uploadedPath;
};

const validateGallerySelectedFile = (file) => {
  if (!(file instanceof File)) {
    return "Please choose an image before saving.";
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  const allowedExtensions = ["jpg", "jpeg", "png", "webp"];
  const fileName = String(file.name || "");
  const extension = fileName.includes(".") ? fileName.split(".").pop().toLowerCase() : "";

  if (file.size < 1) {
    return "Please choose an image before saving.";
  }

  if (file.size > 3 * 1024 * 1024) {
    return "Image must be 3 MB or smaller.";
  }

  if (file.type && !allowedTypes.includes(file.type)) {
    return "Only JPG, PNG, and WebP images are allowed.";
  }

  if (!allowedExtensions.includes(extension)) {
    return "Only JPG, PNG, and WebP images are allowed.";
  }

  return "";
};

const handleGalleryUploadSelection = () => {
  const selectedFile = galleryUploadField?.files?.[0] || null;
  const selectedImagePath = String(galleryImageField?.value || "").trim();

  if (!selectedFile) {
    if (selectedImagePath) {
      updateGalleryPreview(selectedImagePath);
    } else {
      updateGalleryPreview("");
    }
    return;
  }

  const validationMessage = validateGallerySelectedFile(selectedFile);
  if (validationMessage) {
    showGalleryFeedback(validationMessage, "error");
    showAdminToast(validationMessage, "error");
    if (galleryUploadField) {
      galleryUploadField.value = "";
    }
    if (selectedImagePath) {
      updateGalleryPreview(selectedImagePath);
    } else {
      updateGalleryPreview("");
    }
    return;
  }

  updateGalleryPreviewFromFile(selectedFile);
  showGalleryFeedback("");
};

const renderGallery = () => {
  if (!galleryTableBody) {
    return;
  }

  if (!currentGallery.length) {
    galleryTableBody.innerHTML = `
      <tr>
        <td colspan="6">No gallery items found for this restaurant yet.</td>
      </tr>
    `;
    return;
  }

  galleryTableBody.innerHTML = currentGallery.map((gallery) => `
    <tr>
      <td>
        <strong>${escapeHTML(gallery.title)}</strong>
        ${gallery.caption ? `<small class="table-meta">${escapeHTML(gallery.caption)}</small>` : ""}
      </td>
      <td>${escapeHTML(gallery.image || "-")}</td>
      <td>${escapeHTML(gallery.alt_text || "-")}</td>
      <td>${escapeHTML(gallery.sort_order ?? 0)}</td>
      <td><span class="status-badge status-badge--${gallery.status === "active" ? "active" : "inactive"}">${escapeHTML(gallery.status || "active")}</span></td>
      <td>
        <div class="table-actions">
          <button type="button" class="btn btn--ghost btn--compact table-action" data-action="edit-gallery" data-id="${gallery.id}">Edit</button>
          <button type="button" class="btn btn--ghost btn--compact table-action table-action--danger" data-action="delete-gallery" data-id="${gallery.id}">Delete</button>
        </div>
      </td>
    </tr>
  `).join("");
};

const loadGalleryForRestaurant = async (slug) => {
  const resolvedSlug = slug || DEFAULT_RESTAURANT_SLUG;
  if (!isFeatureEnabled("gallery")) {
    currentGallery = [];
    applyPlanFeatureState(currentUserContext);
    return;
  }

  try {
    const result = await fetchJson("gallery.php", {
      params: { restaurant: resolvedSlug, include_inactive: 1 },
      headers: {
      }
    });

    currentGallery = Array.isArray(result.data) ? result.data : [];
    renderGallery();
  } catch (error) {
    currentGallery = [];
    renderGallery();
    showGalleryFeedback(error.message || "Unable to load gallery items.", "error");
  }
};

const saveGallery = async (event) => {
  event.preventDefault();

  if (!restaurantSelect || !galleryForm) {
    return;
  }

  if (!isFeatureEnabled("gallery")) {
    showGalleryFeedback(featureLockMessage, "error");
    return;
  }

  const selectedSlug = restaurantSelect.value || DEFAULT_RESTAURANT_SLUG;
  const payload = getGalleryFormPayload();
  const selectedFile = galleryUploadField?.files?.[0] || null;
  const hasExistingImage = String(payload.image || "").trim() !== "";
  const errors = validateGalleryFormPayload(payload, {
    skipImageValidation: Boolean(selectedFile)
  });

  if (!selectedFile && !hasExistingImage) {
    errors.image = "Please choose an image before saving.";
  }

  if (Object.keys(errors).length > 0) {
    showGalleryFeedback("Validation error. Check the highlighted fields.", "error");
    showAdminToast("Validation error. Check the highlighted fields.", "warning");
    if (errors.image === "Please choose an image before saving." && galleryUploadField) {
      galleryUploadField.focus();
    } else {
      focusFirstInvalidField(galleryForm, errors);
    }
    return;
  }

  setGalleryButtonLoading(true);

  try {
    if (selectedFile) {
      showGalleryFeedback("Uploading image...");
      const uploadedPath = await uploadGalleryImage({ silent: true });
      if (!uploadedPath) {
        const message = "Image upload failed. Gallery item was not saved.";
        showGalleryFeedback(message, "error");
        showAdminToast(message, "error");
        return;
      }

      payload.image = uploadedPath;
      if (galleryImageField) {
        galleryImageField.value = uploadedPath;
      }
    }

    showGalleryFeedback("Saving gallery item...");

    const method = payload.id ? "PUT" : "POST";
    const result = await fetchJson("gallery.php", {
      method,
      params: { restaurant: selectedSlug },
      body: payload,
      headers: {
      }
    });

    resetGalleryForm();
    await loadGalleryForRestaurant(selectedSlug);
    const successMessage = result.message || "Gallery item saved successfully.";
    showGalleryFeedback(successMessage);
    showAdminToast(successMessage);
  } catch (error) {
    const message = error.message || "Could not save gallery item.";
    showGalleryFeedback(message, "error");
    showAdminToast(message, "error");
    if (error.details) {
      focusFirstInvalidField(galleryForm, error.details);
    }
  } finally {
    setGalleryButtonLoading(false);
  }
};

const editGallery = (id) => {
  if (!isFeatureEnabled("gallery")) {
    showGalleryFeedback(featureLockMessage, "error");
    return;
  }

  const gallery = currentGallery.find((item) => String(item.id) === String(id));
  if (!gallery) {
    showGalleryFeedback("Gallery item not found.", "error");
    return;
  }

  fillGalleryForm(gallery);
  showGalleryFeedback(`Editing ${gallery.title}.`);
  showAdminToast(`Editing ${gallery.title}.`, "warning");
  galleryForm?.scrollIntoView({ behavior: "smooth", block: "start" });
};

const deleteGallery = async (id) => {
  if (!isFeatureEnabled("gallery")) {
    showGalleryFeedback(featureLockMessage, "error");
    return;
  }

  const gallery = currentGallery.find((item) => String(item.id) === String(id));
  if (!gallery) {
    showGalleryFeedback("Gallery item not found.", "error");
    return;
  }

  if (!window.confirm(`Archive "${gallery.title}"? This will set the gallery item to inactive.`)) {
    return;
  }

  const selectedSlug = restaurantSelect?.value || DEFAULT_RESTAURANT_SLUG;
  setGalleryButtonLoading(true);
  showGalleryFeedback("Deleting gallery item...");

  try {
    const result = await fetchJson("gallery.php", {
      method: "DELETE",
      params: { restaurant: selectedSlug },
      body: { id: gallery.id },
      headers: {
      }
    });

    if (String(galleryIdField?.value || "") === String(gallery.id)) {
      resetGalleryForm();
    }
    await loadGalleryForRestaurant(selectedSlug);
    const successMessage = result.message || "Gallery item archived successfully.";
    showGalleryFeedback(successMessage);
    showAdminToast(successMessage);
  } catch (error) {
    const message = error.message || "Could not delete gallery item.";
    showGalleryFeedback(message, "error");
    showAdminToast(message, "error");
  } finally {
    setGalleryButtonLoading(false);
  }
};

const renderMenuItems = () => {
  if (!menuItemTableBody) {
    return;
  }

  if (statFoods) {
    statFoods.textContent = String(currentMenuItems.length);
  }

  if (!currentMenuItems.length) {
    menuItemTableBody.innerHTML = `
      <tr>
        <td colspan="7">No menu items found for this restaurant yet.</td>
      </tr>
    `;
    return;
  }

  menuItemTableBody.innerHTML = currentMenuItems.map((item) => {
    const hasDiscount = item.discount_price !== null && item.discount_price !== "" && Number(item.discount_price) < Number(item.price);
    const priceMarkup = hasDiscount
      ? `<strong>${escapeHTML(formatCurrency(item.discount_price))}</strong><small class="table-meta">Was ${escapeHTML(formatCurrency(item.price))}</small>`
      : `<strong>${escapeHTML(formatCurrency(item.price))}</strong>`;

    return `
      <tr>
        <td>
          <strong>${escapeHTML(item.name)}</strong>
          ${item.badge_text ? `<small class="table-meta">${escapeHTML(item.badge_text)}</small>` : ""}
        </td>
        <td>${escapeHTML(item.category_name || "Unassigned")}</td>
        <td>${priceMarkup}</td>
        <td><span class="status-badge status-badge--${Number(item.is_featured) === 1 ? "yes" : "no"}">${Number(item.is_featured) === 1 ? "Yes" : "No"}</span></td>
        <td><span class="status-badge status-badge--${Number(item.is_available) === 1 ? "active" : "inactive"}">${Number(item.is_available) === 1 ? "Available" : "Hidden"}</span></td>
        <td><span class="status-badge status-badge--${item.status === "active" ? "active" : "inactive"}">${escapeHTML(item.status || "active")}</span></td>
        <td>
          <div class="table-actions">
            <button type="button" class="btn btn--ghost btn--compact table-action" data-action="edit-menu-item" data-id="${item.id}">Edit</button>
            <button type="button" class="btn btn--ghost btn--compact table-action table-action--danger" data-action="delete-menu-item" data-id="${item.id}">Delete</button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
};

const loadCategoriesForRestaurant = async (slug) => {
  const resolvedSlug = slug || DEFAULT_RESTAURANT_SLUG;
  try {
    const result = await fetchJson("categories.php", {
      params: { restaurant: resolvedSlug },
      headers: {
      }
    });

    currentCategories = Array.isArray(result.data) ? result.data : [];
    renderCategories();

    const currentSelection = menuItemIdField?.value ? (menuItemCategoryField?.value || "") : "";
    const currentSelectionLabel = menuItemCategoryField?.selectedOptions?.[0]?.textContent || "";
    populateMenuItemCategoryOptions(currentSelection, currentSelectionLabel);
    renderSnapshot();
  } catch (error) {
    currentCategories = [];
    renderCategories();
    populateMenuItemCategoryOptions();
    showCategoryFeedback(error.message || "Unable to load categories.", "error");
  }
};

const loadMenuItemsForRestaurant = async (slug) => {
  const resolvedSlug = slug || DEFAULT_RESTAURANT_SLUG;
  try {
    const result = await fetchJson("menu-items.php", {
      params: { restaurant: resolvedSlug },
      headers: {
      }
    });

    currentMenuItems = Array.isArray(result.data) ? result.data : [];
    renderMenuItems();
    renderSnapshot();
  } catch (error) {
    currentMenuItems = [];
    renderMenuItems();
    renderSnapshot();
    showMenuItemFeedback(error.message || "Unable to load menu items.", "error");
  }
};

const refreshRestaurantCrudData = async (slug) => {
  const resolvedSlug = slug || restaurantSelect?.value || DEFAULT_RESTAURANT_SLUG;
  await loadCategoriesForRestaurant(resolvedSlug);
  await loadMenuItemsForRestaurant(resolvedSlug);
  await loadDealsForRestaurant(resolvedSlug);
  await loadGalleryForRestaurant(resolvedSlug);
  await loadOrdersForRestaurant(resolvedSlug);
};

const saveCategory = async (event) => {
  event.preventDefault();

  if (!restaurantSelect || !categoryForm) {
    return;
  }

  const selectedSlug = restaurantSelect.value || DEFAULT_RESTAURANT_SLUG;

  setCategoryButtonLoading(true);

  try {
    if (categoryUploadField?.files?.[0]) {
      const uploadedPath = await uploadCategoryImage({ showToast: false });
      if (!uploadedPath) {
        return;
      }
    }

    const payload = getCategoryFormPayload();
    const errors = validateCategoryFormPayload(payload);

    if (Object.keys(errors).length > 0) {
      showCategoryFeedback("Validation error. Check the highlighted fields.", "error");
      showAdminToast("Validation error. Check the highlighted fields.", "warning");
      focusFirstInvalidField(categoryForm, errors);
      return;
    }

    showCategoryFeedback("Saving category...");

    const method = payload.id ? "PUT" : "POST";
    const result = await fetchJson("categories.php", {
      method,
      params: { restaurant: selectedSlug },
      body: payload,
      headers: {
      }
    });

    resetCategoryForm();
    await refreshRestaurantCrudData(selectedSlug);
    const successMessage = result.message || "Category saved successfully.";
    showCategoryFeedback(successMessage);
    showAdminToast(successMessage);
  } catch (error) {
    const message = error.message || "Could not save category.";
    showCategoryFeedback(message, "error");
    showAdminToast(message, "error");
    if (error.details) {
      focusFirstInvalidField(categoryForm, error.details);
    }
  } finally {
    setCategoryButtonLoading(false);
  }
};

const saveMenuItem = async (event) => {
  event.preventDefault();

  if (!restaurantSelect || !menuItemForm) {
    return;
  }

  const selectedSlug = restaurantSelect.value || DEFAULT_RESTAURANT_SLUG;

  setMenuItemButtonLoading(true);

  try {
    if (menuItemUploadField?.files?.[0]) {
      const uploadedPath = await uploadMenuItemImage({ showToast: false });
      if (!uploadedPath) {
        return;
      }
    }

    const payload = getMenuItemFormPayload();
    const errors = validateMenuItemFormPayload(payload);

    if (Object.keys(errors).length > 0) {
      const summary = summarizeValidationErrors(errors);
      console.warn("Menu item validation failed", { errors, payload });
      showMenuItemFeedback(summary, "error");
      showAdminToast(summary, "warning");
      focusFirstInvalidField(menuItemForm, errors);
      return;
    }

    showMenuItemFeedback("Saving menu item...");

    const method = payload.id ? "PUT" : "POST";
    const result = await fetchJson("menu-items.php", {
      method,
      params: { restaurant: selectedSlug },
      body: payload,
      headers: {
      }
    });

    resetMenuItemForm();
    await loadMenuItemsForRestaurant(selectedSlug);
    const successMessage = result.message || "Menu item saved successfully.";
    showMenuItemFeedback(successMessage);
    showAdminToast(successMessage);
  } catch (error) {
    const message = error.details
      ? summarizeValidationErrors(error.details, error.message || "Could not save menu item.")
      : (error.message || "Could not save menu item.");
    showMenuItemFeedback(message, "error");
    showAdminToast(message, "error");
    if (error.details) {
      console.warn("Menu item save failed with backend validation", error.details);
      focusFirstInvalidField(menuItemForm, error.details);
    }
  } finally {
    setMenuItemButtonLoading(false);
  }
};

const editCategory = (id) => {
  const category = currentCategories.find((item) => String(item.id) === String(id));
  if (!category) {
    showCategoryFeedback("Category not found.", "error");
    return;
  }

  fillCategoryForm(category);
  showCategoryFeedback(`Editing ${category.name}.`);
  showAdminToast(`Editing ${category.name}.`, "warning");
  categoryForm?.scrollIntoView({ behavior: "smooth", block: "start" });
};

const deleteCategory = async (id) => {
  const category = currentCategories.find((item) => String(item.id) === String(id));
  if (!category) {
    showCategoryFeedback("Category not found.", "error");
    return;
  }

  if (!window.confirm(`Archive "${category.name}"? This will set the category to inactive.`)) {
    return;
  }

  const selectedSlug = restaurantSelect?.value || DEFAULT_RESTAURANT_SLUG;
  setCategoryButtonLoading(true);
  showCategoryFeedback("Deleting category...");

  try {
    const result = await fetchJson("categories.php", {
      method: "DELETE",
      params: { restaurant: selectedSlug },
      body: { id: category.id },
      headers: {
      }
    });

    if (String(categoryIdField?.value || "") === String(category.id)) {
      resetCategoryForm();
    }
    await refreshRestaurantCrudData(selectedSlug);
    const successMessage = result.message || "Category archived successfully.";
    showCategoryFeedback(successMessage);
    showAdminToast(successMessage);
  } catch (error) {
    const message = error.message || "Could not delete category.";
    showCategoryFeedback(message, "error");
    showAdminToast(message, "error");
  } finally {
    setCategoryButtonLoading(false);
  }
};

const editMenuItem = (id) => {
  const menuItem = currentMenuItems.find((item) => String(item.id) === String(id));
  if (!menuItem) {
    showMenuItemFeedback("Menu item not found.", "error");
    return;
  }

  fillMenuItemForm(menuItem);
  showMenuItemFeedback(`Editing ${menuItem.name}.`);
  showAdminToast(`Editing ${menuItem.name}.`, "warning");
  menuItemForm?.scrollIntoView({ behavior: "smooth", block: "start" });
};

const deleteMenuItem = async (id) => {
  const menuItem = currentMenuItems.find((item) => String(item.id) === String(id));
  if (!menuItem) {
    showMenuItemFeedback("Menu item not found.", "error");
    return;
  }

  if (!window.confirm(`Archive "${menuItem.name}"? This will set the item to inactive.`)) {
    return;
  }

  const selectedSlug = restaurantSelect?.value || DEFAULT_RESTAURANT_SLUG;
  setMenuItemButtonLoading(true);
  showMenuItemFeedback("Deleting menu item...");

  try {
    const result = await fetchJson("menu-items.php", {
      method: "DELETE",
      params: { restaurant: selectedSlug },
      body: { id: menuItem.id },
      headers: {
      }
    });

    if (String(menuItemIdField?.value || "") === String(menuItem.id)) {
      resetMenuItemForm();
    }
    await loadMenuItemsForRestaurant(selectedSlug);
    const successMessage = result.message || "Menu item archived successfully.";
    showMenuItemFeedback(successMessage);
    showAdminToast(successMessage);
  } catch (error) {
    const message = error.message || "Could not delete menu item.";
    showMenuItemFeedback(message, "error");
    showAdminToast(message, "error");
  } finally {
    setMenuItemButtonLoading(false);
  }
};

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (loginFeedback) {
      loginFeedback.textContent = "";
      loginFeedback.classList.remove("is-error");
    }

    const submitButton = loginForm.querySelector('button[type="submit"]');
    const formData = new FormData(loginForm);
    const email = String(formData.get("email") || formData.get("username") || "").trim();
    const password = String(formData.get("password") || "").trim();

    if (!email || !password) {
      if (loginFeedback) {
        loginFeedback.textContent = "Email and password are required.";
        loginFeedback.classList.add("is-error");
      }
      return;
    }

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Signing in...";
    }

    try {
      await fetchJson("auth.php", {
        method: "POST",
        body: {
          email,
          password
        }
      });

      window.location.href = dashboardPageUrl;
    } catch (error) {
      const validationMessages = error.details && typeof error.details === "object"
        ? Object.values(error.details)
          .map((value) => String(value || "").trim())
          .filter(Boolean)
        : [];
      const message = validationMessages[0] || error.message || "Unable to sign in.";

      if (loginFeedback) {
        loginFeedback.textContent = message;
        loginFeedback.classList.add("is-error");
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Enter Dashboard";
      }
    }
  });
}

if (ordersTableBody) {
  syncOrdersFromStorage();
  redirectIfNeeded();
  renderOrders();
  renderSnapshot();
}

ordersTableBody?.addEventListener("change", (event) => {
  const select = event.target.closest("[data-order-status-select]");
  if (!select) {
    return;
  }

  void updateOrderStatus(select.dataset.orderId, select.value, select);
});

ordersTableBody?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-order-cash-received]");
  if (!button) {
    return;
  }

  const orderId = button.dataset.orderId;
  if (!orderId) {
    return;
  }

  const order = (Array.isArray(currentOrders) ? currentOrders : []).find((entry) => String(entry.id) === String(orderId));
  if (!order) {
    return;
  }

  if (button.disabled || isOrderCancelled(order) || isOrderCashReceived(order)) {
    return;
  }

  if (!window.confirm("Confirm cash received for this order?")) {
    return;
  }

  void updateOrderCashReceived(orderId, button);
});

if (settingsForm && restaurantSelect) {
  redirectIfNeeded();
  loadRestaurants();
  settingsForm.addEventListener("submit", saveSettings);
  restaurantSelect.addEventListener("change", (event) => {
    const nextSlug = event.target.value;
    showSettingsFeedback(`Switching to ${nextSlug}...`);
    void (async () => {
      try {
        await syncTenantContext(nextSlug);
        window.localStorage.setItem(selectedRestaurantKey, nextSlug);
        updatePublicPreviewLink(nextSlug);
        resetCategoryForm();
        resetMenuItemForm();
        resetDealForm();
        resetGalleryForm();
        await loadSettingsForRestaurant(nextSlug);
        await loadCategoriesForRestaurant(nextSlug);
        await loadMenuItemsForRestaurant(nextSlug);
        await loadDealsForRestaurant(nextSlug);
        await loadGalleryForRestaurant(nextSlug);
        await loadOrdersForRestaurant(nextSlug);
        showSettingsFeedback(`Switched to ${currentRestaurant?.name || nextSlug}.`);
        showAdminToast(`Switched to ${currentRestaurant?.name || nextSlug}.`);
      } catch (error) {
        const message = error.message || "Unable to switch restaurants.";
        const fallbackSlug = currentUserContext?.active_restaurant?.slug || loadedRestaurants[0]?.slug || "";
        if (restaurantSelect && fallbackSlug) {
          restaurantSelect.value = fallbackSlug;
          updatePublicPreviewLink(fallbackSlug);
        }
        showSettingsFeedback(message, "error");
        showAdminToast(message, "error");
      }
    })();
  });
}

if (restaurantManagementForm) {
  restaurantManagementForm.addEventListener("submit", saveRestaurantManagement);
}

restaurantManagementResetButtons.forEach((button) => {
  button.addEventListener("click", resetRestaurantManagementForm);
});

restaurantManagementTableBody?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-tenant-action=\"edit-restaurant\"]");
  if (!button) {
    return;
  }

  const restaurantId = button.dataset.restaurantId;
  const restaurant = (Array.isArray(managementRestaurants) ? managementRestaurants : []).find((entry) => String(entry.id) === String(restaurantId));
  if (!restaurant) {
    setTenantManagementFeedback("Restaurant not found.", "error");
    return;
  }

  fillRestaurantManagementForm(restaurant);
  setTenantManagementFeedback(`Editing ${restaurant.name}.`);
});

if (restaurantOwnerForm) {
  restaurantOwnerForm.addEventListener("submit", saveRestaurantOwner);
}

restaurantOwnerResetButtons.forEach((button) => {
  button.addEventListener("click", resetRestaurantOwnerForm);
});

restaurantPlanRestaurantField?.addEventListener("change", () => {
  syncRestaurantPlanForm();
});

restaurantPlanField?.addEventListener("change", () => {
  const restaurantName = String(restaurantPlanRestaurantField?.selectedOptions?.[0]?.textContent || "restaurant").trim();
  const planName = String(restaurantPlanField?.selectedOptions?.[0]?.textContent || "plan").trim();
  setRestaurantPlanFeedback(`Ready to assign ${planName} to ${restaurantName}.`);
});

restaurantPlanSaveButton?.addEventListener("click", () => {
  void saveRestaurantPlan();
});

if (categoryForm) {
  categoryForm.addEventListener("submit", saveCategory);
}

if (menuItemForm) {
  menuItemForm.addEventListener("submit", saveMenuItem);
}

if (dealForm) {
  dealForm.addEventListener("submit", saveDeal);
}

if (galleryForm) {
  galleryForm.addEventListener("submit", saveGallery);
}

galleryUploadButton?.addEventListener("click", uploadGalleryImage);
galleryUploadField?.addEventListener("change", handleGalleryUploadSelection);
categoryUploadButton?.addEventListener("click", uploadCategoryImage);
categoryUploadField?.addEventListener("change", () => {
  handleImageFileSelection(
    categoryUploadField,
    updateCategoryPreview,
    String(categoryImageField?.value || "").trim(),
    showCategoryFeedback
  );
});
logoUploadButton?.addEventListener("click", uploadLogoImage);
logoPathField?.addEventListener("input", () => {
  updateLogoPreview(logoPathField.value);
});
logoUploadField?.addEventListener("change", () => {
  handleImageFileSelection(
    logoUploadField,
    updateLogoPreview,
    String(logoPathField?.value || "").trim(),
    showSettingsFeedback
  );
});
faviconUploadButton?.addEventListener("click", uploadFaviconImage);
faviconUploadField?.addEventListener("change", () => {
  handleImageFileSelection(
    faviconUploadField,
    updateFaviconPreview,
    String(faviconPathField?.value || "").trim(),
    showSettingsFeedback
  );
});
faviconPathField?.addEventListener("input", () => {
  updateFaviconPreview(faviconPathField.value);
});
heroUploadButton?.addEventListener("click", uploadHeroImage);
heroImagePathField?.addEventListener("input", () => {
  updateHeroPreview(heroImagePathField.value);
});
heroUploadField?.addEventListener("change", () => {
  handleImageFileSelection(
    heroUploadField,
    updateHeroPreview,
    String(heroImagePathField?.value || "").trim(),
    showSettingsFeedback
  );
});
aboutUploadButton?.addEventListener("click", uploadAboutImage);
aboutImagePathField?.addEventListener("input", () => {
  updateAboutPreview(aboutImagePathField.value);
});
aboutUploadField?.addEventListener("change", () => {
  handleImageFileSelection(
    aboutUploadField,
    updateAboutPreview,
    String(aboutImagePathField?.value || "").trim(),
    showSettingsFeedback
  );
});
menuItemUploadButton?.addEventListener("click", uploadMenuItemImage);
menuItemImageField?.addEventListener("input", () => {
  updateMenuItemPreview(menuItemImageField.value);
});
menuItemUploadField?.addEventListener("change", () => {
  handleImageFileSelection(
    menuItemUploadField,
    updateMenuItemPreview,
    String(menuItemImageField?.value || "").trim(),
    showMenuItemFeedback
  );
});
dealUploadButton?.addEventListener("click", uploadDealImage);
dealImageField?.addEventListener("input", () => {
  updateDealPreview(dealImageField.value);
});
dealUploadField?.addEventListener("change", () => {
  handleImageFileSelection(
    dealUploadField,
    updateDealPreview,
    String(dealImageField?.value || "").trim(),
    showDealFeedback
  );
});

categoryCreateResetButtons.forEach((button) => {
  button.addEventListener("click", () => {
    resetCategoryForm();
  });
});

menuItemCreateResetButtons.forEach((button) => {
  button.addEventListener("click", () => {
    resetMenuItemForm();
  });
});

dealCreateResetButtons.forEach((button) => {
  button.addEventListener("click", () => {
    resetDealForm();
  });
});

galleryCreateResetButtons.forEach((button) => {
  button.addEventListener("click", () => {
    resetGalleryForm();
  });
});

categoryTableBody?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) {
    return;
  }

  const { action, id } = button.dataset;
  if (action === "edit-category") {
    editCategory(id);
  }
  if (action === "delete-category") {
    deleteCategory(id);
  }
});

menuItemTableBody?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) {
    return;
  }

  const { action, id } = button.dataset;
  if (action === "edit-menu-item") {
    editMenuItem(id);
  }
  if (action === "delete-menu-item") {
    deleteMenuItem(id);
  }
});

dealTableBody?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) {
    return;
  }

  const { action, id } = button.dataset;
  if (action === "edit-deal") {
    editDeal(id);
  }
  if (action === "delete-deal") {
    deleteDeal(id);
  }
});

galleryTableBody?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) {
    return;
  }

  const { action, id } = button.dataset;
  if (action === "edit-gallery") {
    editGallery(id);
  }
  if (action === "delete-gallery") {
    deleteGallery(id);
  }
});

logoutButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    button.disabled = true;

    try {
      await fetchJson("auth.php", {
        method: "DELETE"
      });
    } catch (error) {
      console.warn("Logout request failed:", error.message);
    } finally {
      window.location.href = loginPageUrl;
    }
  });
});

sidebarToggle?.addEventListener("click", () => {
  openSidebar(!sidebar?.classList.contains("is-open"));
});

sidebarOverlay?.addEventListener("click", () => {
  openSidebar(false);
});

document.querySelectorAll(".admin-nav__link").forEach((link) => {
  link.addEventListener("click", () => {
    openSidebar(false);
  });
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    openSidebar(false);
  }
});
