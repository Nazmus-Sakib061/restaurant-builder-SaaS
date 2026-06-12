const navbar = document.getElementById("navbar");
const navToggle = document.querySelector(".navbar__toggle");
const navMenu = document.getElementById("siteNav");
const yearNode = document.getElementById("year");
const backToTop = document.getElementById("backToTop");
const toast = document.getElementById("toast");
const skipLink = document.querySelector(".skip-link");
const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));
const menuCards = Array.from(document.querySelectorAll(".food-card"));
const orderButtons = Array.from(document.querySelectorAll(".order-trigger"));
const orderForm = document.getElementById("orderForm");
const nameField = document.getElementById("customerName");
const phoneField = document.getElementById("customerPhone");
const foodField = document.getElementById("foodItem");
const messageField = document.getElementById("orderMessage");
const allAnchors = Array.from(document.querySelectorAll('a[href^="#"]:not(.skip-link)'));
const revealItems = Array.from(document.querySelectorAll(".reveal"));
const navLinks = Array.from(document.querySelectorAll(".navbar__link"));

const ORDER_STORAGE_KEY = "demoRestaurantOrders";

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

const ensureOrderOption = (value) => {
  const existingOption = Array.from(foodField.options).find((option) => option.value === value);
  if (existingOption) {
    foodField.value = value;
    return;
  }

  const option = document.createElement("option");
  option.value = value;
  option.textContent = value;
  foodField.appendChild(option);
  foodField.value = value;
};

const prefillOrder = (value) => {
  ensureOrderOption(value);
  scrollToTarget("#contact");
  window.setTimeout(() => {
    nameField?.focus();
  }, 500);
  showToast(`${value} added to your quick order.`);
};

const saveLocalOrder = (payload) => {
  const previousOrders = JSON.parse(window.localStorage.getItem(ORDER_STORAGE_KEY) || "[]");
  previousOrders.unshift({
    ...payload,
    created_at: new Date().toISOString()
  });
  window.localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(previousOrders.slice(0, 25)));
};

const validateOrder = () => {
  const phonePattern = /^[0-9+\-\s()]{7,}$/;

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

  if (!foodField.value.trim()) {
    showToast("Please select a food item.", "error");
    foodField.focus();
    return false;
  }

  if (messageField.value.trim().length < 10) {
    showToast("Please add a short message with at least 10 characters.", "error");
    messageField.focus();
    return false;
  }

  return true;
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
    prefillOrder(orderButton.dataset.food);
  }
});

if (orderForm) {
  orderForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!validateOrder()) {
      return;
    }

    const payload = {
      customer_name: nameField.value.trim(),
      phone: phoneField.value.trim(),
      food_item: foodField.value.trim(),
      message: messageField.value.trim(),
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

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Backend unavailable");
      }

      orderForm.reset();
      showToast(result.message || "Your order request has been sent successfully.");
    } catch (error) {
      saveLocalOrder(payload);
      orderForm.reset();
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
};

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
