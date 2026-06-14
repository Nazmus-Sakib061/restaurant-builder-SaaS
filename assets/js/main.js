const navbar = document.getElementById("navbar");
const navToggle = document.querySelector(".navbar__toggle");
const navMenu = document.getElementById("siteNav");
const yearNode = document.getElementById("year");
const backToTop = document.getElementById("backToTop");
const toast = document.getElementById("toast");
const skipLink = document.querySelector(".skip-link");
const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));
const menuCards = Array.from(document.querySelectorAll(".food-card"));
const orderForm = document.getElementById("orderForm");
const nameField = document.getElementById("customerName");
const phoneField = document.getElementById("customerPhone");
const orderItemsContainer = document.getElementById("orderItems");
const addOrderItemButton = document.getElementById("addOrderItem");
const addressField = document.getElementById("customerAddress");
const messageField = document.getElementById("orderMessage");
const allAnchors = Array.from(document.querySelectorAll('a[href^="#"]:not(.skip-link)'));
const revealItems = Array.from(document.querySelectorAll(".reveal"));
const navLinks = Array.from(document.querySelectorAll(".navbar__link"));

const ORDER_STORAGE_KEY = "demoRestaurantOrders";
const ORDER_PREVIEW_IMAGE = window.RESTAURANT_FALLBACK_IMAGE || "images/hero image.png";
let currentMenuItems = [];

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

const setNavOpen = (open) => {
  if (!navMenu || !navToggle) {
    return;
  }

  navMenu.classList.toggle("is-open", open);
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
};

const showToast = (message, state = "success") => {
  if (!toast) {
    return;
  }

  toast.textContent = message;
  toast.className = `toast is-visible is-${state}`;

  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.className = "toast";
  }, 3200);
};

const scrollToTarget = (selector) => {
  const target = document.querySelector(selector);
  if (!target) {
    return;
  }

  target.scrollIntoView({ behavior: "smooth", block: "start" });
};

const escapeHTML = (value) => String(value ?? "")
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#39;");

skipLink?.addEventListener("click", (event) => {
  const mainContent = document.getElementById("mainContent");
  if (!mainContent) {
    return;
  }

  event.preventDefault();
  mainContent.focus({ preventScroll: true });
  scrollToTarget("#mainContent");
});

const updateActiveFilter = (activeFilter) => {
  document.querySelectorAll("[data-filter]").forEach((button) => {
    const isActive = button.dataset.filter === activeFilter;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  document.querySelectorAll(".food-card").forEach((card) => {
    const matches = activeFilter === "all" || card.dataset.category === activeFilter;
    card.classList.toggle("is-hidden", !matches);
  });
};

const isPositiveInteger = (value) => /^\d+$/.test(String(value ?? "").trim()) && Number(value) >= 1;

const refreshMenuItemsFromWindow = () => {
  const rawItems = Array.isArray(window.currentRestaurantMenuItems)
    ? window.currentRestaurantMenuItems
    : [];

  currentMenuItems = rawItems
    .map((item, index) => ({
      id: item?.id ?? index + 1,
      name: String(item?.name || "").trim(),
      image: String(item?.image || "").trim(),
      category: String(item?.category || "").trim(),
      price: Number(item?.price || 0)
    }))
    .filter((item) => item.name !== "");

  return currentMenuItems;
};

const findMenuItem = (value) => {
  const needle = String(value ?? "").trim();
  if (!needle) {
    return null;
  }

  return currentMenuItems.find((item) => String(item.id) === needle)
    || currentMenuItems.find((item) => item.name.toLowerCase() === needle.toLowerCase())
    || null;
};

const renderOrderItemOptions = (select, selectedValue = "") => {
  if (!select) {
    return;
  }

  const currentValue = String(selectedValue || select.value || "").trim();
  select.innerHTML = "";

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = currentMenuItems.length ? "Select a dish" : "Menu items are loading...";
  select.appendChild(placeholder);

  currentMenuItems.forEach((item) => {
    const option = document.createElement("option");
    option.value = String(item.id);
    option.textContent = item.name;
    select.appendChild(option);
  });

  select.disabled = currentMenuItems.length === 0;

  if (currentValue && Array.from(select.options).some((option) => option.value === currentValue)) {
    select.value = currentValue;
  } else {
    select.value = "";
  }
};

const updateOrderItemPreview = (row) => {
  if (!row) {
    return;
  }

  const select = row.querySelector("[data-order-item-select]");
  const imageNode = row.querySelector("[data-order-item-preview]");
  const nameNode = row.querySelector("[data-order-item-preview-name]");
  const metaNode = row.querySelector("[data-order-item-preview-meta]");
  const selectedItem = findMenuItem(select?.value);
  const priceLabel = selectedItem ? `BDT ${Number(selectedItem.price || 0).toLocaleString("en-US", { maximumFractionDigits: 0 })}` : "";

  if (imageNode) {
    imageNode.hidden = false;
    imageNode.src = selectedItem?.image || ORDER_PREVIEW_IMAGE;
    imageNode.alt = selectedItem ? `${selectedItem.name} preview` : "Select a dish preview";
  }

  if (nameNode) {
    nameNode.textContent = selectedItem ? selectedItem.name : "Select a dish";
  }

  if (metaNode) {
    metaNode.textContent = selectedItem
      ? `${selectedItem.category || "Menu item"}${priceLabel ? ` - ${priceLabel}` : ""}`
      : "Choose an item to see the preview image.";
  }

  row.dataset.selectedMenuItemId = selectedItem ? String(selectedItem.id) : "";
};

const createOrderItemRow = (initial = {}) => {
  if (!orderItemsContainer) {
    return null;
  }

  const row = document.createElement("div");
  row.className = "order-item-row";
  row.dataset.orderItemRow = "true";
  row.innerHTML = `
    <div class="form-group">
      <label>Food Item</label>
      <select data-order-item-select></select>
    </div>
    <div class="form-group">
      <label>Quantity</label>
      <input data-order-item-quantity type="number" min="1" step="1" inputmode="numeric" value="${escapeHTML(String(initial.quantity || 1))}" placeholder="1">
    </div>
    <div class="order-item-row__preview">
      <img data-order-item-preview src="${escapeHTML(ORDER_PREVIEW_IMAGE)}" alt="Select a dish preview" loading="lazy">
      <div class="order-item-row__preview-copy">
        <strong data-order-item-preview-name>Select a dish</strong>
        <span data-order-item-preview-meta>Choose an item to see the preview image.</span>
      </div>
    </div>
    <div class="order-item-row__actions">
      <button class="btn btn--ghost order-item-row__remove" type="button" data-order-item-remove>Remove item</button>
    </div>
  `;

  const select = row.querySelector("[data-order-item-select]");
  const quantityInput = row.querySelector("[data-order-item-quantity]");
  const removeButton = row.querySelector("[data-order-item-remove]");

  if (initial.menuItemId) {
    row.dataset.pendingMenuItemId = String(initial.menuItemId);
  }

  if (initial.menuItemName) {
    row.dataset.pendingMenuItemName = String(initial.menuItemName);
  }

  renderOrderItemOptions(select, initial.menuItemId || "");

  const pendingItem = initial.menuItemId ? findMenuItem(initial.menuItemId) : findMenuItem(initial.menuItemName);
  if (pendingItem) {
    select.value = String(pendingItem.id);
    delete row.dataset.pendingMenuItemId;
    delete row.dataset.pendingMenuItemName;
  }

  select?.addEventListener("change", () => {
    delete row.dataset.pendingMenuItemId;
    delete row.dataset.pendingMenuItemName;
    updateOrderItemPreview(row);
  });

  removeButton?.addEventListener("click", () => {
    if (!orderItemsContainer) {
      return;
    }

    if (orderItemsContainer.querySelectorAll("[data-order-item-row]").length > 1) {
      row.remove();
      return;
    }

    if (select) {
      select.value = "";
    }
    if (quantityInput) {
      quantityInput.value = "1";
    }
    delete row.dataset.pendingMenuItemId;
    delete row.dataset.pendingMenuItemName;
    updateOrderItemPreview(row);
  });

  updateOrderItemPreview(row);
  return row;
};

const ensureOrderItemRow = () => {
  if (!orderItemsContainer) {
    return null;
  }

  const existing = orderItemsContainer.querySelector("[data-order-item-row]");
  if (existing) {
    return existing;
  }

  const row = createOrderItemRow();
  if (row) {
    orderItemsContainer.appendChild(row);
  }
  return row;
};

const syncOrderItemRows = () => {
  if (!orderItemsContainer) {
    return;
  }

  refreshMenuItemsFromWindow();

  const rows = Array.from(orderItemsContainer.querySelectorAll("[data-order-item-row]"));
  if (rows.length === 0) {
    ensureOrderItemRow();
    return;
  }

  rows.forEach((row) => {
    const select = row.querySelector("[data-order-item-select]");
    const pendingId = row.dataset.pendingMenuItemId || "";
    const pendingName = row.dataset.pendingMenuItemName || "";
    const currentValue = select?.value || pendingId || "";

    renderOrderItemOptions(select, currentValue);

    if (!select?.value && pendingName) {
      const matched = findMenuItem(pendingName);
      if (matched) {
        select.value = String(matched.id);
        delete row.dataset.pendingMenuItemId;
        delete row.dataset.pendingMenuItemName;
      }
    }

    updateOrderItemPreview(row);
  });
};

addOrderItemButton?.addEventListener("click", () => {
  if (!orderItemsContainer) {
    return;
  }

  const row = createOrderItemRow();
  if (!row) {
    return;
  }

  orderItemsContainer.appendChild(row);
  row.querySelector("[data-order-item-select]")?.focus();
});

const resetOrderFormState = () => {
  orderForm?.reset();

  if (!orderItemsContainer) {
    return;
  }

  orderItemsContainer.innerHTML = "";
  const row = createOrderItemRow();
  if (row) {
    orderItemsContainer.appendChild(row);
  }
};

const collectOrderItems = () => {
  if (!orderItemsContainer) {
    return null;
  }

  const rows = Array.from(orderItemsContainer.querySelectorAll("[data-order-item-row]"));
  const items = [];

  if (!currentMenuItems.length) {
    showToast("Menu items are still loading. Please try again in a moment.", "error");
    return null;
  }

  for (const row of rows) {
    const select = row.querySelector("[data-order-item-select]");
    const quantityInput = row.querySelector("[data-order-item-quantity]");
    const menuItemId = String(select?.value || "").trim();
    const quantityValue = String(quantityInput?.value || "").trim();
    const menuItem = findMenuItem(menuItemId);

    if (!menuItemId || !menuItem) {
      showToast("Please select a food item for every order line.", "error");
      select?.focus();
      return null;
    }

    if (!isPositiveInteger(quantityValue)) {
      showToast("Please enter a quantity of 1 or more for each item.", "error");
      quantityInput?.focus();
      return null;
    }

    const unitPrice = Number(menuItem.price || 0);
    const itemQuantity = Number(quantityValue);

    items.push({
      menu_item_id: Number(menuItem.id),
      food_name: menuItem.name,
      item_name: menuItem.name,
      food_image: menuItem.image || "",
      image: menuItem.image || "",
      item_image: menuItem.image || "",
      quantity: itemQuantity,
      unit_price: unitPrice,
      total_price: Number((unitPrice * itemQuantity).toFixed(2))
    });
  }

  if (!items.length) {
    showToast("Please add at least one order item.", "error");
    return null;
  }

  return items;
};

const prefillOrder = (button) => {
  refreshMenuItemsFromWindow();

  const label = String(button?.dataset?.food || "").trim();
  const menuItemId = String(button?.dataset?.menuItemId || "").trim();
  const matchedItem = menuItemId ? findMenuItem(menuItemId) : findMenuItem(label);

  if (!matchedItem && !menuItemId) {
    scrollToTarget("#contact");
    showToast(label ? `${label} is not a menu item. Choose a dish from the order form.` : "Choose a dish from the order form.", "error");
    return;
  }

  const existingRows = Array.from(orderItemsContainer?.querySelectorAll("[data-order-item-row]") || []);
  let row = existingRows.find((candidate) => !String(candidate.querySelector("[data-order-item-select]")?.value || "").trim()) || null;
  if (!row) {
    row = createOrderItemRow();
    if (row) {
      orderItemsContainer?.appendChild(row);
    }
  }

  const select = row?.querySelector("[data-order-item-select]");

  if (matchedItem && select) {
    select.value = String(matchedItem.id);
    delete row.dataset.pendingMenuItemId;
    delete row.dataset.pendingMenuItemName;
    updateOrderItemPreview(row);
    showToast(`${matchedItem.name} added to your order list.`);
  } else if (row && menuItemId) {
    row.dataset.pendingMenuItemId = menuItemId;
    row.dataset.pendingMenuItemName = label;
    updateOrderItemPreview(row);
    if (label) {
      showToast(`${label} will be ready in the order form.`);
    }
  }

  scrollToTarget("#contact");
  window.setTimeout(() => {
    select?.focus();
  }, 500);
};

const saveLocalOrder = (payload) => {
  const subtotal = Array.isArray(payload.items)
    ? payload.items.reduce((sum, item) => sum + Number(item.total_price || 0), 0)
    : 0;
  const previousOrders = JSON.parse(window.localStorage.getItem(ORDER_STORAGE_KEY) || "[]");
  previousOrders.unshift({
    ...payload,
    subtotal: Number(subtotal.toFixed(2)),
    total_amount: Number(subtotal.toFixed(2)),
    payment_method: "cash",
    payment_status: "unpaid",
    cash_received_at: null,
    revenue_posted_at: null,
    revenue_amount: null,
    created_at: new Date().toISOString()
  });
  window.localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(previousOrders.slice(0, 25)));
};

const validateOrder = () => {
  const phonePattern = /^[0-9+\-\s()]{7,}$/;
  const addressValue = String(addressField?.value ?? "").trim();

  if (!nameField.value.trim()) {
    showToast("Please enter your name.", "error");
    nameField.focus();
    return false;
  }

  if (!phonePattern.test(phoneField.value.trim())) {
    showToast("Please enter a valid phone number.", "error");
    phoneField.focus();
    return false;
  }

  if (addressValue.length < 5) {
    showToast("Please enter your delivery address.", "error");
    addressField?.focus();
    return false;
  }

  if (messageField.value.trim().length < 10) {
    showToast("Please add a short message with at least 10 characters.", "error");
    messageField.focus();
    return false;
  }

  const items = collectOrderItems();
  if (!items) {
    return false;
  }

  return items;
};

if (navToggle) {
  navToggle.addEventListener("click", () => {
    const isOpen = !navMenu.classList.contains("is-open");
    setNavOpen(isOpen);
  });
}

document.addEventListener("click", (event) => {
  if (!navMenu || !navToggle) {
    return;
  }

  const clickInsideNav = navMenu.contains(event.target);
  const clickOnToggle = navToggle.contains(event.target);

  if (!clickInsideNav && !clickOnToggle) {
    setNavOpen(false);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navMenu?.classList.contains("is-open")) {
    setNavOpen(false);
    navToggle?.focus();
  }
});

allAnchors.forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const href = anchor.getAttribute("href");
    if (!href || !href.startsWith("#")) {
      return;
    }

    if (href === "#") {
      event.preventDefault();
      return;
    }

    const target = document.querySelector(href);
    if (!target) {
      return;
    }

    event.preventDefault();
    scrollToTarget(href);
    setNavOpen(false);
  });
});

document.addEventListener("click", (event) => {
  const filterButton = event.target.closest("[data-filter]");
  if (filterButton) {
    updateActiveFilter(filterButton.dataset.filter);
    return;
  }

  const orderButton = event.target.closest(".order-trigger");
  if (orderButton) {
    prefillOrder(orderButton);
  }
});

if (orderForm) {
  orderForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const items = validateOrder();
    if (!items) {
      return;
    }

    const firstItem = items[0];
    const matchedItem = firstItem ? findMenuItem(String(firstItem.menu_item_id)) : null;
    const payload = {
      customer_name: nameField.value.trim(),
      phone: phoneField.value.trim(),
      food_item: matchedItem?.name || "",
      quantity: Number(firstItem?.quantity || 1),
      customer_address: String(addressField?.value || "").trim(),
      message: messageField.value.trim(),
      items,
      order_items: items,
      status: "pending"
    };

    const submitButton = orderForm.querySelector('button[type="submit"]');
    const originalLabel = submitButton?.textContent || "";

    try {
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Sending...";
      }

      const response = await fetch("backend/api/orders.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json().catch(() => ({}));

      if (response.status === 422) {
        showToast(result.message || "Please review the highlighted order details.", "error");
        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Backend unavailable");
      }

      resetOrderFormState();
      showToast(result.message || "Your order request has been sent successfully.");
    } catch (error) {
      saveLocalOrder(payload);
      resetOrderFormState();
      showToast("Saved locally. The backend can be connected later.", "success");
      console.info("Order fallback:", error.message);
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalLabel;
      }
    }
  });
}

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.18
});

revealItems.forEach((item) => revealObserver.observe(item));

window.refreshRestaurantInteractions = () => {
  document.querySelectorAll(".reveal:not(.is-visible)").forEach((item) => {
    revealObserver.observe(item);
  });
  updateActiveFilter("all");
  syncOrderItemRows();
};

syncOrderItemRows();

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting || !entry.target.id) {
      return;
    }

    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
    });
  });
}, {
  threshold: 0.45,
  rootMargin: "-20% 0px -50% 0px"
});

document.querySelectorAll("main section[id]").forEach((section) => {
  sectionObserver.observe(section);
});

const handleScroll = () => {
  const scrolled = window.scrollY > 20;
  navbar?.classList.toggle("is-scrolled", scrolled);
  backToTop?.classList.toggle("is-visible", window.scrollY > 550);
};

handleScroll();
window.addEventListener("scroll", handleScroll, { passive: true });

backToTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
