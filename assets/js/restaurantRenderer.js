/*
  Dynamic renderer for the restaurant builder demo.
  It maps a selected profile into the
  existing layout so the same design can serve multiple restaurant styles.
*/

(() => {
  const profiles = window.RESTAURANT_PROFILES || {};
  const fallbackProfileKey = window.RESTAURANT_DEFAULT_PROFILE || "pizza";
  const fallbackImage = window.RESTAURANT_FALLBACK_IMAGE || "images/hero image.png";
  const originalBrandMarkHTML = document.querySelector(".brand__mark")?.innerHTML || "";
  let profile = profiles[fallbackProfileKey] || Object.values(profiles)[0] || null;

  const selectDemoProfile = (profileKey = fallbackProfileKey) => {
    const requestedProfileKey = String(profileKey || fallbackProfileKey).toLowerCase();
    return profiles[requestedProfileKey] || profiles[fallbackProfileKey] || Object.values(profiles)[0] || null;
  };

  const escapeHTML = (value) => String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

  const escapeRegExp = (value) => String(value ?? "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const slugify = (value) => String(value ?? "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const formatPrice = (value) => Number(value || 0).toLocaleString("en-US", {
    maximumFractionDigits: 0
  });

  const assetUrl = (path) => {
    const resolved = path || fallbackImage;
    return encodeURI(resolved);
  };

  const hexToRgb = (hex) => {
    const normalized = String(hex || "").trim().replace("#", "");
    const expanded = normalized.length === 3
      ? normalized.split("").map((char) => char + char).join("")
      : normalized;

    if (!/^[0-9a-fA-F]{6}$/.test(expanded)) {
      return "239, 43, 36";
    }

    const int = Number.parseInt(expanded, 16);
    const r = (int >> 16) & 255;
    const g = (int >> 8) & 255;
    const b = int & 255;
    return `${r}, ${g}, ${b}`;
  };

  const setTextAll = (selector, value) => {
    document.querySelectorAll(selector).forEach((node) => {
      node.textContent = value;
    });
  };

  const setHrefAll = (selector, href, text) => {
    document.querySelectorAll(selector).forEach((node) => {
      node.setAttribute("href", href);
      if (typeof text === "string") {
        node.textContent = text;
      }
    });
  };

  const setOptionalHrefAll = (selector, href, text) => {
    const resolvedHref = String(href || "").trim();

    document.querySelectorAll(selector).forEach((node) => {
      if (typeof text === "string") {
        node.textContent = text;
      }

      if (resolvedHref) {
        node.setAttribute("href", resolvedHref);
        node.removeAttribute("aria-disabled");
        node.removeAttribute("tabindex");
        node.classList.remove("is-disabled-cta");
      } else {
        node.removeAttribute("href");
        node.setAttribute("aria-disabled", "true");
        node.setAttribute("tabindex", "-1");
        node.classList.add("is-disabled-cta");
      }
    });
  };

  const setImage = (img, path, alt) => {
    if (!img) {
      return;
    }

    const resolved = assetUrl(path);
    img.dataset.fallbackApplied = "false";
    img.src = resolved;
    if (!img.hasAttribute("loading")) {
      img.loading = "lazy";
    }
    img.decoding = "async";
    if (alt) {
      img.alt = alt;
    }

    img.onerror = () => {
      if (img.dataset.fallbackApplied === "true") {
        return;
      }

      img.dataset.fallbackApplied = "true";
      img.src = assetUrl(fallbackImage);
      if (alt) {
        img.alt = alt;
      }
    };
  };

  const highlightTitle = (title, highlight) => {
    if (!highlight) {
      return escapeHTML(title);
    }

    const pattern = new RegExp(escapeRegExp(highlight), "i");
    const match = String(title || "").match(pattern);
    if (!match || typeof match.index !== "number") {
      return escapeHTML(title);
    }

    const before = title.slice(0, match.index);
    const matched = title.slice(match.index, match.index + match[0].length);
    const after = title.slice(match.index + match[0].length);
    return `${escapeHTML(before)}<span>${escapeHTML(matched)}</span>${escapeHTML(after)}`;
  };

  const applyTheme = (theme) => {
    const root = document.documentElement;
    const resolvedTheme = theme || {};
    const primary = resolvedTheme.primaryColor || "#ef2b24";
    const secondary = resolvedTheme.secondaryColor || "#0b0b0b";
    const accent = resolvedTheme.accentColor || "#ff9f1c";
    const background = resolvedTheme.backgroundColor || "#050505";
    const text = resolvedTheme.textColor || "#ffffff";
    const button = resolvedTheme.buttonColor || primary;

    root.style.setProperty("--primary-color", primary);
    root.style.setProperty("--secondary-color", secondary);
    root.style.setProperty("--accent-color", accent);
    root.style.setProperty("--background-color", background);
    root.style.setProperty("--text-color", text);
    root.style.setProperty("--button-color", button);
    root.style.setProperty("--primary-rgb", hexToRgb(primary));
    root.style.setProperty("--accent-rgb", hexToRgb(accent));
    root.style.setProperty("--bg", background);
    root.style.setProperty("--bg-alt", secondary);
    root.style.setProperty("--text", text);
    root.style.setProperty("--accent", primary);
    root.style.setProperty("--accent-strong", button);
    root.style.setProperty("--accent-secondary", accent);
  };

  const renderBrand = () => {
    const brandNameNodes = document.querySelectorAll("[data-restaurant-name], [data-footer-restaurant-name]");
    const taglineNodes = document.querySelectorAll("[data-restaurant-tagline], [data-footer-restaurant-tagline]");

    brandNameNodes.forEach((node) => {
      node.textContent = profile.restaurantName;
    });

    taglineNodes.forEach((node) => {
      node.textContent = profile.tagline;
    });

    document.querySelectorAll(".brand__mark").forEach((mark) => {
      if (profile.logo) {
        mark.innerHTML = `<img src="${assetUrl(profile.logo)}" alt="${escapeHTML(profile.restaurantName)} logo">`;
        return;
      }

      if ((profile.slug || "").toLowerCase() === "pizza") {
        mark.innerHTML = originalBrandMarkHTML;
        return;
      }

      const initial = String(profile.slug || profile.restaurantName || "R").charAt(0).toUpperCase();
      mark.innerHTML = `<span class="brand__initial">${escapeHTML(initial)}</span>`;
    });

    setOptionalHrefAll("[data-navbar-cta], [data-hero-primary-cta]", profile.hero?.primaryButtonLink || "", profile.hero?.primaryButtonText || "Order Now");
    setTextAll("[data-hero-secondary-cta]", profile.hero?.secondaryButtonText || "View Menu");
  };

  const renderHero = () => {
    const hero = profile.hero || {};
    const heroBadge = document.querySelector("[data-hero-badge]");
    const heroTitle = document.querySelector("[data-hero-title]");
    const heroSubtitle = document.querySelector("[data-hero-subtitle]");
    const heroImage = document.querySelector("[data-hero-image]");

    if (heroBadge) {
      heroBadge.textContent = hero.badge || "HOT & FRESH";
    }

    if (heroTitle) {
      heroTitle.innerHTML = highlightTitle(hero.title || profile.restaurantName, hero.highlight || "");
    }

    if (heroSubtitle) {
      heroSubtitle.textContent = hero.subtitle || "";
    }

    setImage(heroImage, hero.image || fallbackImage, hero.imageAlt || `${profile.restaurantName} hero image`);

    const floatingTopLabel = document.querySelector("[data-hero-floating-top-label]");
    const floatingTopValue = document.querySelector("[data-hero-floating-top-value]");
    const floatingBottomLabel = document.querySelector("[data-hero-floating-bottom-label]");
    const floatingBottomValue = document.querySelector("[data-hero-floating-bottom-value]");
    const floatingCards = Array.isArray(hero.floatingCards) ? hero.floatingCards : [];

    if (floatingCards[0]) {
      if (floatingTopLabel) {
        floatingTopLabel.textContent = floatingCards[0].label || "";
      }
      if (floatingTopValue) {
        floatingTopValue.textContent = floatingCards[0].value || "";
      }
    }

    if (floatingCards[1]) {
      if (floatingBottomLabel) {
        floatingBottomLabel.textContent = floatingCards[1].label || "";
      }
      if (floatingBottomValue) {
        floatingBottomValue.textContent = floatingCards[1].value || "";
      }
    }

    const statNodes = Array.from(document.querySelectorAll("[data-hero-stat]"));
    const stats = Array.isArray(hero.stats) ? hero.stats : [];

    statNodes.forEach((node, index) => {
      const stat = stats[index];
      if (!stat) {
        node.style.display = "none";
        return;
      }

      node.style.display = "";
      const strong = node.querySelector("strong");
      const span = node.querySelector("span");
      if (strong) {
        strong.textContent = stat.value || "";
      }
      if (span) {
        span.textContent = stat.label || "";
      }
    });

    const heading = `${profile.restaurantName} | ${hero.title || "Restaurant Builder"}`;
    document.title = heading;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", hero.subtitle || `Explore the ${profile.restaurantName} demo menu and offers.`);
    }
  };

  const createMenuCard = (item) => {
    const badge = item.badge || (item.isFeatured ? "Featured" : item.category);
    const categorySlug = slugify(item.category);
    return `
      <article class="food-card reveal" data-category="${escapeHTML(categorySlug)}">
        <div class="food-card__media">
          <span class="food-card__tag">${escapeHTML(badge)}</span>
          <img src="${assetUrl(item.image)}" alt="${escapeHTML(item.name)}" loading="lazy">
        </div>
        <div class="food-card__body">
          <h3>${escapeHTML(item.name)}</h3>
          <p>${escapeHTML(item.description)}</p>
          <div class="food-card__meta">
            <span class="food-card__price">${profile.currency || "৳"}${formatPrice(item.price)}</span>
            <span class="food-card__rating">★ ${Number(item.rating || 0).toFixed(1)}</span>
          </div>
          <button class="food-card__btn order-trigger" type="button" data-food="${escapeHTML(item.name)}">Add to Cart</button>
        </div>
      </article>
    `;
  };

  const createDealCard = (deal) => {
    const oldPrice = `${profile.currency || "৳"}${formatPrice(deal.oldPrice)}`;
    const newPrice = `${profile.currency || "৳"}${formatPrice(deal.newPrice)}`;

    if (deal.layout === "split" && Array.isArray(deal.splitImages) && deal.splitImages.length >= 2) {
      return `
        <article class="deal-card reveal deal-card--split">
          <div class="deal-card__media deal-card__media--split">
            <div class="deal-card__split-image">
              <img src="${assetUrl(deal.splitImages[0])}" alt="${escapeHTML(deal.title)} first image" loading="lazy">
            </div>
            <div class="deal-card__split-image">
              <img src="${assetUrl(deal.splitImages[1])}" alt="${escapeHTML(deal.title)} second image" loading="lazy">
            </div>
            <span class="deal-card__badge">${escapeHTML(deal.badge || "Special")}</span>
          </div>
          <div class="deal-card__body">
            <h3>${escapeHTML(deal.title)}</h3>
            <p>${escapeHTML(deal.description)}</p>
            <div class="deal-card__price">
              <del>${oldPrice}</del>
              <strong>${newPrice}</strong>
            </div>
            <button class="deal-card__cta order-trigger" type="button" data-food="${escapeHTML(deal.title)}">Claim Deal</button>
          </div>
        </article>
      `;
    }

    return `
      <article class="deal-card reveal">
        <div class="deal-card__media">
          <span class="deal-card__badge">${escapeHTML(deal.badge || "Special")}</span>
          <img src="${assetUrl(deal.image)}" alt="${escapeHTML(deal.title)}" loading="lazy">
        </div>
        <div class="deal-card__body">
          <h3>${escapeHTML(deal.title)}</h3>
          <p>${escapeHTML(deal.description)}</p>
          <div class="deal-card__price">
            <del>${oldPrice}</del>
            <strong>${newPrice}</strong>
          </div>
          <button class="deal-card__cta order-trigger" type="button" data-food="${escapeHTML(deal.title)}">Claim Deal</button>
        </div>
      </article>
    `;
  };

  const renderMenu = () => {
    const filterBar = document.getElementById("menuFilters");
    const menuGrid = document.querySelector("[data-menu-grid]") || document.getElementById("menuGrid");
    const menuItems = (profile.menuItems || []).filter((item) => String(item.status || "active") === "active");
    const categories = Array.from(new Set((profile.menuCategories || []).filter(Boolean)));

    if (filterBar) {
      filterBar.innerHTML = `
        <button class="filter-btn is-active" type="button" data-filter="all">All</button>
        ${categories.map((category) => {
          const slug = slugify(category);
          return `<button class="filter-btn" type="button" data-filter="${escapeHTML(slug)}">${escapeHTML(category)}</button>`;
        }).join("")}
      `;
    }

    if (menuGrid) {
      menuGrid.innerHTML = menuItems.map((item) => createMenuCard(item)).join("");
    }

    const select = document.querySelector("[data-order-select]") || document.getElementById("foodItem");
    if (select) {
      const currentValue = select.value;
      const options = [
        { label: "Menu Items", items: menuItems.map((item) => item.name) },
        { label: "Deals", items: (profile.deals || []).filter((deal) => String(deal.status || "active") === "active").map((deal) => deal.title) }
      ];

      select.innerHTML = "";

      const placeholder = document.createElement("option");
      placeholder.value = "";
      placeholder.textContent = "Select a dish";
      select.appendChild(placeholder);

      options.forEach((groupData) => {
        if (!groupData.items.length) {
          return;
        }

        const group = document.createElement("optgroup");
        group.label = groupData.label;
        groupData.items.forEach((label) => {
          const option = document.createElement("option");
          option.value = label;
          option.textContent = label;
          group.appendChild(option);
        });
        select.appendChild(group);
      });

      const hasCurrent = Array.from(select.options).some((option) => option.value === currentValue);
      if (hasCurrent) {
        select.value = currentValue;
      }
    }

    return { menuItems };
  };

  const renderDeals = () => {
    const dealGrid = document.querySelector("[data-deal-grid]") || document.getElementById("dealGrid");
    const deals = (profile.deals || []).filter((deal) => String(deal.status || "active") === "active");

    if (dealGrid) {
      dealGrid.innerHTML = deals.map((deal) => createDealCard(deal)).join("");
    }
  };

  const renderAbout = (menuItems) => {
    const about = profile.about || {};
    const itemImages = menuItems.map((item) => item.image).filter(Boolean);
    const primary = about.image || itemImages[0] || fallbackImage;
    const secondary = itemImages[0] || primary;
    const tertiary = itemImages[1] || itemImages[2] || primary;

    setTextAll("[data-about-title]", about.title || "");
    setTextAll("[data-about-text-1]", about.text1 || "");
    setTextAll("[data-about-text-2]", about.text2 || "");
    setTextAll("[data-about-stat-value]", about.statValue || "");
    setTextAll("[data-about-stat-label]", about.statLabel || "");

    setImage(document.querySelector("[data-about-image-primary]"), primary, about.imageAlt || `${profile.restaurantName} about image`);
    setImage(document.querySelector("[data-about-image-secondary]"), secondary, menuItems[0]?.name || about.imageAlt || profile.restaurantName);
    setImage(document.querySelector("[data-about-image-tertiary]"), tertiary, menuItems[1]?.name || about.imageAlt || profile.restaurantName);
  };

  const renderContact = () => {
    const contact = profile.contact || {};
    const social = profile.social || {};
    const telHref = `tel:${String(contact.phone || "").replace(/[^\d+]/g, "")}`;

    setHrefAll("[data-contact-phone]", telHref, contact.phone || "");
    setTextAll("[data-contact-address]", contact.address || "");
    setTextAll("[data-contact-hours]", contact.openingHours || "");

    setHrefAll("[data-footer-phone]", telHref, contact.phone || "");
    setHrefAll("[data-footer-email]", `mailto:${contact.email || ""}`, contact.email || "");
    setTextAll("[data-footer-address]", contact.address || "");

    document.querySelectorAll("[data-social-link]").forEach((link) => {
      const key = link.dataset.socialLink;
      const href = social[key] || "#";
      link.setAttribute("href", href);
      if (href === "#") {
        link.removeAttribute("target");
        link.removeAttribute("rel");
      } else {
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener noreferrer");
      }
    });
  };

  const render = () => {
    if (!profile) {
      return;
    }

    document.body.dataset.restaurant = profile.slug || fallbackProfileKey;
    applyTheme(profile.theme);
    renderBrand();
    renderHero();
    const { menuItems } = renderMenu();
    renderDeals();
    renderAbout(menuItems);
    renderContact();
  };

  window.getRestaurantDemoProfile = selectDemoProfile;
  window.renderRestaurantWebsite = (nextProfile) => {
    profile = nextProfile || selectDemoProfile();
    render();
    window.refreshRestaurantInteractions?.();
  };
})();
