/*
  Chooses between database-backed restaurant data and the local demo profiles.
  The existing demo data remains the fallback while the backend matures.
*/

(() => {
  const DEFAULT_DEMO = window.RESTAURANT_DEFAULT_PROFILE || "pizza";
  const RESTAURANT_TO_DEMO = {
    "demo-pizza-house": "pizza",
    "default": "pizza",
    "demo-coffee-house": "coffee",
    "demo-biryani-house": "biryani"
  };

  const DEMO_TO_RESTAURANT = Object.fromEntries(
    Object.entries(RESTAURANT_TO_DEMO).map(([restaurantSlug, demoKey]) => [demoKey, restaurantSlug])
  );

  const slugify = (value) => String(value ?? "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const isValidHexColor = (value) => /^#?[0-9a-fA-F]{6}$/.test(String(value || "").trim());

  const hexToRgb = (value) => {
    const normalized = String(value || "").trim().replace("#", "");
    if (!isValidHexColor(normalized)) {
      return null;
    }

    const r = Number.parseInt(normalized.slice(0, 2), 16);
    const g = Number.parseInt(normalized.slice(2, 4), 16);
    const b = Number.parseInt(normalized.slice(4, 6), 16);
    return { r, g, b };
  };

  const isBrightColor = (value) => {
    const rgb = hexToRgb(value);
    if (!rgb) {
      return false;
    }

    const luminance = ((0.299 * rgb.r) + (0.587 * rgb.g) + (0.114 * rgb.b)) / 255;
    return luminance > 0.62;
  };

  const normalizeTheme = (theme = {}) => {
    const rawPrimary = String(theme.primary_color || "#f97316").trim();
    const rawAccent = String(theme.secondary_color || theme.accent_color || "#facc15").trim();
    const primary = isValidHexColor(rawPrimary) ? rawPrimary : "#f97316";
    const accent = isValidHexColor(rawAccent) ? rawAccent : "#facc15";
    const background = isValidHexColor(theme.background_color) ? theme.background_color : "#0b0f14";
    const text = isValidHexColor(theme.text_color) ? theme.text_color : "#f8fafc";
    const button = isValidHexColor(theme.button_color) ? theme.button_color : primary;

    return {
      primaryColor: primary,
      secondaryColor: "#10151d",
      accentColor: isBrightColor(accent) ? accent : "#facc15",
      backgroundColor: background,
      textColor: text,
      buttonColor: button
    };
  };

  const demoProfile = (key = DEFAULT_DEMO) => {
    if (typeof window.getRestaurantDemoProfile === "function") {
      return window.getRestaurantDemoProfile(key);
    }

    const profiles = window.RESTAURANT_PROFILES || {};
    return profiles[key] || profiles[DEFAULT_DEMO] || Object.values(profiles)[0] || null;
  };

  const fallbackProfileForRestaurant = (restaurantSlug) => {
    return demoProfile(RESTAURANT_TO_DEMO[restaurantSlug] || DEFAULT_DEMO);
  };

  const fetchRestaurantProfile = async (restaurantSlug) => {
    const response = await fetch(`backend/api/site-data.php?tenant=${encodeURIComponent(restaurantSlug)}`, {
      headers: { Accept: "application/json" }
    });

    let result = null;
    try {
      result = await response.json();
    } catch {
      result = null;
    }

    if (!response.ok || !result?.success) {
      const error = new Error(result?.message || "Restaurant API unavailable");
      error.status = response.status;
      error.details = result?.errors || null;
      throw error;
    }

    return result.data || {};
  };

  const mapDeal = (deal) => ({
    title: deal.title || "Special Deal",
    description: deal.description || "",
    oldPrice: Number(deal.regular_price || deal.old_price || 0),
    newPrice: Number(deal.deal_price || deal.new_price || 0),
    image: deal.image || window.RESTAURANT_FALLBACK_IMAGE,
    badge: deal.badge_text || deal.badge || "Special",
    status: deal.status || "active"
  });

  function mapApiDataToRestaurantProfile(apiData) {
    const restaurant = apiData.restaurant || {};
    const settings = apiData.settings || {};
    const theme = apiData.theme || settings || {};
    const menuItems = apiData.menu_items || [];
    const categories = apiData.categories || [];
    const gallery = apiData.gallery || [];
    const primaryGalleryImage = gallery[0]?.image || settings.about_image || settings.hero_image || window.RESTAURANT_FALLBACK_IMAGE;

    return {
      slug: restaurant.slug || "restaurant",
      restaurantName: settings.site_title || restaurant.name || "Restaurant",
      tagline: restaurant.business_type ? `${restaurant.business_type} Restaurant` : "Premium Restaurant",
      logo: settings.logo || "",
      currency: "৳",
      theme: normalizeTheme(theme),
      hero: {
        badge: "HOT & FRESH",
        title: settings.hero_title || restaurant.name || "Welcome",
        highlight: String(settings.hero_title || "").split(" ").slice(-1)[0] || "",
        subtitle: settings.hero_subtitle || "",
        primaryButtonText: settings.hero_button_text || "Order Now",
        primaryButtonLink: settings.hero_button_link || "",
        secondaryButtonText: "View Menu",
        image: settings.hero_image || primaryGalleryImage,
        imageAlt: `${settings.site_title || restaurant.name || "Restaurant"} hero image`,
        floatingCards: [
          { label: "Today's special", value: (apiData.deals || [])[0]?.title || "Fresh Menu" },
          { label: "Open hours", value: settings.opening_hours || "Today" }
        ],
        stats: [
          { value: "30 min", label: "Fast delivery" },
          { value: "4.9/5", label: "Guest rating" },
          { value: `${menuItems.length}+`, label: "Menu choices" }
        ]
      },
      about: {
        title: settings.about_title || "About Us",
        text1: settings.about_text || "",
        text2: "Fresh ingredients, careful preparation, and fast local service come together in every order.",
        image: settings.about_image || primaryGalleryImage,
        imageAlt: `${restaurant.name || "Restaurant"} about image`,
        statValue: "4.9",
        statLabel: "Guest rating"
      },
      contact: {
        phone: settings.phone || "",
        email: settings.email || "",
        address: settings.address || "",
        openingHours: settings.opening_hours || ""
      },
      social: {
        facebook: settings.facebook_url || "#",
        instagram: settings.instagram_url || "#",
        youtube: settings.youtube_url || "#",
        whatsapp: settings.whatsapp_number ? `https://wa.me/${String(settings.whatsapp_number).replace(/[^\d]/g, "")}` : "#"
      },
      menuCategories: categories.map((category) => category.name).filter(Boolean),
      menuItems: menuItems.map((item) => ({
        name: item.name || "Menu Item",
        category: item.category_name || "Menu",
        categorySlug: item.category_slug || slugify(item.category_name || "menu"),
        description: item.description || "",
        price: Number(item.discount_price || item.price || 0),
        discountPrice: item.discount_price ? Number(item.discount_price) : null,
        image: item.image || window.RESTAURANT_FALLBACK_IMAGE,
        rating: item.rating ? Number(item.rating) : 4.8,
        badge: item.badge_text || (Number(item.is_featured) === 1 ? "Featured" : item.category_name || "Fresh"),
        badgeText: item.badge_text || "",
        isFeatured: item.is_featured == 1 || item.is_featured === true,
        isAvailable: item.is_available == 1 || item.is_available === true,
        status: item.status || "active"
      })),
      deals: (apiData.deals || []).map(mapDeal),
      gallery
    };
  }

  async function loadRestaurantWebsite() {
    const params = new URLSearchParams(window.location.search);
    const restaurantSlug = params.get("tenant") || params.get("restaurant");
    const demoKey = (params.get("demo") || DEFAULT_DEMO).toLowerCase();
    const mappedRestaurantSlug = DEMO_TO_RESTAURANT[demoKey] || DEMO_TO_RESTAURANT[DEFAULT_DEMO] || "default";
    const requestedRestaurantSlug = String(restaurantSlug || "").trim();

    if (requestedRestaurantSlug) {
      try {
        const apiData = await fetchRestaurantProfile(requestedRestaurantSlug);
        window.renderRestaurantWebsite?.(mapApiDataToRestaurantProfile(apiData));
        return;
      } catch (error) {
        const status = Number(error?.status || 0);
        const notFound = status === 404 || /not found/i.test(String(error?.message || ""));

        window.renderRestaurantError?.({
          restaurantSlug: requestedRestaurantSlug,
          title: notFound ? "Restaurant not found" : "Restaurant unavailable",
          message: notFound
            ? "The restaurant you requested does not exist or is not active. Please check the URL and try again."
            : "We could not load this restaurant right now. Please try again later."
        });
        return;
      }
    }

    try {
      const apiData = await fetchRestaurantProfile(mappedRestaurantSlug);
      window.renderRestaurantWebsite?.(mapApiDataToRestaurantProfile(apiData));
    } catch (error) {
      console.warn("Restaurant API failed, loading demo fallback.", error.message);
      window.renderRestaurantWebsite?.(fallbackProfileForRestaurant(mappedRestaurantSlug));
    }
  }

  window.mapApiDataToRestaurantProfile = mapApiDataToRestaurantProfile;
  window.loadRestaurantWebsite = loadRestaurantWebsite;

  document.addEventListener("DOMContentLoaded", () => {
    window.loadRestaurantWebsite();
  });
})();
