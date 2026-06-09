const sessionKey = "demoRestaurantAdminSession";
const ordersKey = "demoRestaurantOrders";
const selectedRestaurantKey = "demoRestaurantSelectedSlug";
const adminDevToken = "local-dev-admin-token-change-later";
const apiBase = "../backend/api";

const loginForm = document.getElementById("loginForm");
const sidebar = document.getElementById("adminSidebar");
const sidebarToggle = document.getElementById("sidebarToggle");
const sidebarOverlay = document.getElementById("sidebarOverlay");
const logoutButtons = Array.from(document.querySelectorAll('[data-action="logout"]'));
const ordersTableBody = document.getElementById("ordersTableBody");
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
const menuItemBadgeField = document.getElementById("menuItemBadgeField");
const menuItemFeaturedField = document.getElementById("menuItemFeaturedField");
const menuItemAvailableField = document.getElementById("menuItemAvailableField");
const menuItemSortField = document.getElementById("menuItemSortField");
const menuItemStatusField = document.getElementById("menuItemStatusField");

const demoCredentials = {
  username: "admin",
  password: "123456"
};

const menuSnapshot = [
  { name: "Margherita Blaze Pizza", category: "Pizza", price: "$12.90" },
  { name: "Tandoori Fire Pizza", category: "Pizza", price: "$14.50" },
  { name: "Classic Flame Burger", category: "Burger", price: "$8.90" },
  { name: "Chicken Shawarma Wrap", category: "Shawarma", price: "$7.90" },
  { name: "Oreo Dream Shake", category: "Drinks", price: "$5.20" }
];

const categories = ["Pizza", "Burger", "Shawarma", "Drinks"];

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

let loadedRestaurants = [];
let currentRestaurant = null;
let currentSettings = null;
let currentCategories = [];
let currentMenuItems = [];

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

  return Number.isInteger(Number(value)) && Number(value) >= 0;
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

const openSidebar = (open) => {
  if (!sidebar || !sidebarOverlay) {
    return;
  }

  sidebar.classList.toggle("is-open", open);
  sidebarOverlay.classList.toggle("is-visible", open);
};

const redirectIfNeeded = () => {
  const isAuthenticated = Boolean(window.localStorage.getItem(sessionKey));
  if (!isAuthenticated && document.body.classList.contains("admin-page") && !loginForm) {
    window.location.href = "index.html";
  }
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

const renderOrders = () => {
  if (!ordersTableBody) {
    return;
  }

  const orders = getOrders();
  if (statOrders) {
    statOrders.textContent = String(orders.length);
  }
  if (statFoods) {
    statFoods.textContent = String(currentMenuItems.length);
  }
  if (statDeals) {
    statDeals.textContent = "3";
  }
  if (statRevenue) {
    statRevenue.textContent = `$${(orders.length * 18.5).toFixed(0)}`;
  }

  ordersTableBody.innerHTML = "";

  if (!orders.length) {
    const emptyRow = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 6;
    cell.textContent = "No local orders saved yet. Submit the public order form to see demo data here.";
    emptyRow.appendChild(cell);
    ordersTableBody.appendChild(emptyRow);
    return;
  }

  orders.slice(0, 12).forEach((order) => {
    const row = document.createElement("tr");
    const cells = [
      order.customer_name || "Guest",
      order.food_item || "-",
      order.phone || "-",
      order.message || "-",
      order.status || "pending",
      formatDate(order.created_at)
    ];

    cells.forEach((value, index) => {
      const cell = document.createElement("td");

      if (index === 4) {
        const badge = document.createElement("span");
        badge.className = `status-badge status-badge--${String(value).toLowerCase()}`;
        badge.textContent = String(value);
        cell.appendChild(badge);
      } else {
        cell.textContent = String(value);
      }

      row.appendChild(cell);
    });

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
          <span>${escapeHTML(item.category)} · ${escapeHTML(item.price)}</span>
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
    slug: "demo-pizza-house",
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
      <dd>${escapeHTML(restaurant.slug || "demo-pizza-house")}</dd>
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

  const resolvedSlug = slug || "demo-pizza-house";
  publicPreviewLink.href = `../index.html?restaurant=${encodeURIComponent(resolvedSlug)}`;
};

const populateRestaurantSelect = (restaurants, preferredSlug = "") => {
  if (!restaurantSelect) {
    return;
  }

  restaurantSelect.innerHTML = "";

  restaurants.forEach((restaurant) => {
    const option = document.createElement("option");
    option.value = restaurant.slug;
    option.textContent = `${restaurant.name} (${restaurant.slug})`;
    restaurantSelect.appendChild(option);
  });

  const fallbackSlug = restaurants[0]?.slug || "demo-pizza-house";
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
  if (!payload.hero_image) {
    errors.hero_image = "Hero image path is required.";
  }
  if (!payload.about_title || payload.about_title.length > 191) {
    errors.about_title = "About title must be 191 characters or fewer.";
  }
  if (!payload.about_text) {
    errors.about_text = "About text is required.";
  }
  if (!payload.about_image) {
    errors.about_image = "About image path is required.";
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
  const resolvedSlug = slug || "demo-pizza-house";

  if (settingsFeedback) {
    showSettingsFeedback(`Loading ${resolvedSlug} settings...`);
  }

  try {
    const response = await fetch(`${apiBase}/settings.php?restaurant=${encodeURIComponent(resolvedSlug)}`, {
      headers: { Accept: "application/json" }
    });
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Unable to load settings");
    }

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
    showSettingsFeedback(error.message || "Unable to load settings.", "error");
  }
};

const loadRestaurants = async () => {
  if (!restaurantSelect) {
    return;
  }

  const preferredSlug = window.localStorage.getItem(selectedRestaurantKey) || "demo-pizza-house";

  try {
    const response = await fetch(`${apiBase}/restaurants.php`, {
      headers: { Accept: "application/json" }
    });
    const result = await response.json();

    if (!response.ok || !result.success || !Array.isArray(result.data) || !result.data.length) {
      throw new Error(result.message || "No restaurants found");
    }

    loadedRestaurants = result.data;
    populateRestaurantSelect(loadedRestaurants, preferredSlug);
    const selectedSlug = restaurantSelect.value || loadedRestaurants[0].slug;
    await loadSettingsForRestaurant(selectedSlug);
    await loadCategoriesForRestaurant(selectedSlug);
    await loadMenuItemsForRestaurant(selectedSlug);
  } catch (error) {
    loadedRestaurants = [{ id: 1, name: "Demo Pizza House", slug: "demo-pizza-house", business_type: "pizza" }];
    populateRestaurantSelect(loadedRestaurants, preferredSlug);
    await loadSettingsForRestaurant(restaurantSelect.value || "demo-pizza-house");
    await loadCategoriesForRestaurant(restaurantSelect.value || "demo-pizza-house");
    await loadMenuItemsForRestaurant(restaurantSelect.value || "demo-pizza-house");
    showSettingsFeedback(`Loaded fallback restaurant list because the API was unavailable.`, "error");
    console.warn("Restaurant list fallback:", error.message);
  }
};

const saveSettings = async (event) => {
  event.preventDefault();

  if (!restaurantSelect) {
    return;
  }

  const selectedSlug = restaurantSelect.value || "demo-pizza-house";
  const payload = collectSettingsPayload();
  const errors = validateSettingsPayload(payload);

  if (Object.keys(errors).length > 0) {
    showSettingsFeedback("Validation error. Check the highlighted fields.", "error");
    focusFirstSettingsField(errors);
    return;
  }

  setButtonLoading(true);
  showSettingsFeedback("Saving settings...");

  try {
    const response = await fetch(`${apiBase}/settings.php?restaurant=${encodeURIComponent(selectedSlug)}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-Admin-Dev-Token": adminDevToken
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      if (result && result.errors) {
        const firstError = Object.values(result.errors)[0];
        showSettingsFeedback(firstError || result.message || "Could not save settings.", "error");
      } else {
        showSettingsFeedback(result.message || "Could not save settings.", "error");
      }
      return;
    }

    currentRestaurant = result.data?.restaurant || currentRestaurant;
    currentSettings = result.data?.settings || currentSettings;
    fillSettingsForm(currentSettings || payload);
    renderSettingsSummary();
    updatePublicPreviewLink(currentRestaurant?.slug || selectedSlug);
    showSettingsFeedback(result.message || "Settings saved successfully.");
    window.localStorage.setItem(selectedRestaurantKey, currentRestaurant?.slug || selectedSlug);
  } catch (error) {
    showSettingsFeedback(error.message || "Unexpected error while saving settings.", "error");
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
  }

  if (payload.badge_text.length > 100) {
    errors.badge_text = "Badge text must be 100 characters or fewer.";
  }

  if (!isNonNegativeInteger(payload.sort_order)) {
    errors.sort_order = "Sort order must be a whole number.";
  }

  if (payload.category_id && !isNonNegativeInteger(payload.category_id)) {
    errors.category_id = "Category must be a valid number.";
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
        <td colspan="7">No active menu items found for this restaurant yet.</td>
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
  const resolvedSlug = slug || "demo-pizza-house";
  try {
    const result = await fetchJson("categories.php", {
      params: { restaurant: resolvedSlug, include_inactive: 1 }
    });

    currentCategories = Array.isArray(result.data) ? result.data : [];
    renderCategories();

    const currentSelection = menuItemCategoryField?.value || "";
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
  const resolvedSlug = slug || "demo-pizza-house";
  try {
    const result = await fetchJson("menu-items.php", {
      params: { restaurant: resolvedSlug, include_inactive: 1 }
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
  const resolvedSlug = slug || restaurantSelect?.value || "demo-pizza-house";
  await loadCategoriesForRestaurant(resolvedSlug);
  await loadMenuItemsForRestaurant(resolvedSlug);
};

const saveCategory = async (event) => {
  event.preventDefault();

  if (!restaurantSelect || !categoryForm) {
    return;
  }

  const selectedSlug = restaurantSelect.value || "demo-pizza-house";
  const payload = getCategoryFormPayload();
  const errors = validateCategoryFormPayload(payload);

  if (Object.keys(errors).length > 0) {
    showCategoryFeedback("Validation error. Check the highlighted fields.", "error");
    focusFirstInvalidField(categoryForm, errors);
    return;
  }

  setCategoryButtonLoading(true);
  showCategoryFeedback("Saving category...");

  try {
    const method = payload.id ? "PUT" : "POST";
    const result = await fetchJson("categories.php", {
      method,
      params: { restaurant: selectedSlug },
      body: payload,
      headers: {
        "X-Admin-Dev-Token": adminDevToken
      }
    });

    showCategoryFeedback(result.message || "Category saved successfully.");
    resetCategoryForm();
    await refreshRestaurantCrudData(selectedSlug);
  } catch (error) {
    showCategoryFeedback(error.message || "Could not save category.", "error");
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

  const selectedSlug = restaurantSelect.value || "demo-pizza-house";
  const payload = getMenuItemFormPayload();
  const errors = validateMenuItemFormPayload(payload);

  if (Object.keys(errors).length > 0) {
    showMenuItemFeedback("Validation error. Check the highlighted fields.", "error");
    focusFirstInvalidField(menuItemForm, errors);
    return;
  }

  setMenuItemButtonLoading(true);
  showMenuItemFeedback("Saving menu item...");

  try {
    const method = payload.id ? "PUT" : "POST";
    const result = await fetchJson("menu-items.php", {
      method,
      params: { restaurant: selectedSlug },
      body: payload,
      headers: {
        "X-Admin-Dev-Token": adminDevToken
      }
    });

    showMenuItemFeedback(result.message || "Menu item saved successfully.");
    resetMenuItemForm();
    await loadMenuItemsForRestaurant(selectedSlug);
  } catch (error) {
    showMenuItemFeedback(error.message || "Could not save menu item.", "error");
    if (error.details) {
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

  const selectedSlug = restaurantSelect?.value || "demo-pizza-house";
  setCategoryButtonLoading(true);
  showCategoryFeedback("Deleting category...");

  try {
    const result = await fetchJson("categories.php", {
      method: "DELETE",
      params: { restaurant: selectedSlug },
      body: { id: category.id },
      headers: {
        "X-Admin-Dev-Token": adminDevToken
      }
    });

    showCategoryFeedback(result.message || "Category archived successfully.");
    if (String(categoryIdField?.value || "") === String(category.id)) {
      resetCategoryForm();
    }
    await refreshRestaurantCrudData(selectedSlug);
  } catch (error) {
    showCategoryFeedback(error.message || "Could not delete category.", "error");
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

  const selectedSlug = restaurantSelect?.value || "demo-pizza-house";
  setMenuItemButtonLoading(true);
  showMenuItemFeedback("Deleting menu item...");

  try {
    const result = await fetchJson("menu-items.php", {
      method: "DELETE",
      params: { restaurant: selectedSlug },
      body: { id: menuItem.id },
      headers: {
        "X-Admin-Dev-Token": adminDevToken
      }
    });

    showMenuItemFeedback(result.message || "Menu item archived successfully.");
    if (String(menuItemIdField?.value || "") === String(menuItem.id)) {
      resetMenuItemForm();
    }
    await loadMenuItemsForRestaurant(selectedSlug);
  } catch (error) {
    showMenuItemFeedback(error.message || "Could not delete menu item.", "error");
  } finally {
    setMenuItemButtonLoading(false);
  }
};

if (loginForm) {
  if (window.localStorage.getItem(sessionKey)) {
    window.location.href = "dashboard.html";
  }

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (loginFeedback) {
      loginFeedback.textContent = "";
      loginFeedback.classList.remove("is-error");
    }

    const username = loginForm.username.value.trim();
    const password = loginForm.password.value.trim();

    if (username !== demoCredentials.username || password !== demoCredentials.password) {
      if (loginFeedback) {
        loginFeedback.textContent = "Demo login failed. Use admin / 123456.";
        loginFeedback.classList.add("is-error");
      }
      return;
    }

    window.localStorage.setItem(
      sessionKey,
      JSON.stringify({
        username: demoCredentials.username,
        signedInAt: new Date().toISOString()
      })
    );

    window.location.href = "dashboard.html";
  });
}

if (ordersTableBody) {
  redirectIfNeeded();
  renderOrders();
  renderSnapshot();
}

if (settingsForm && restaurantSelect) {
  redirectIfNeeded();
  loadRestaurants();
  settingsForm.addEventListener("submit", saveSettings);
  restaurantSelect.addEventListener("change", (event) => {
    const nextSlug = event.target.value;
    window.localStorage.setItem(selectedRestaurantKey, nextSlug);
    updatePublicPreviewLink(nextSlug);
    resetCategoryForm();
    resetMenuItemForm();
    loadSettingsForRestaurant(nextSlug);
    loadCategoriesForRestaurant(nextSlug);
    loadMenuItemsForRestaurant(nextSlug);
  });
}

if (categoryForm) {
  categoryForm.addEventListener("submit", saveCategory);
}

if (menuItemForm) {
  menuItemForm.addEventListener("submit", saveMenuItem);
}

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

logoutButtons.forEach((button) => {
  button.addEventListener("click", () => {
    window.localStorage.removeItem(sessionKey);
    window.location.href = "index.html";
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
