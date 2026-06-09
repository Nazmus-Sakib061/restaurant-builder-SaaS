/*
  Temporary restaurant profile data.
  Later this content can move into MySQL and be edited from an admin panel.
  The renderer reads the active profile from ?demo=slug and keeps the layout intact.
*/

window.RESTAURANT_FALLBACK_IMAGE = "images/hero image.png";
window.RESTAURANT_DEFAULT_PROFILE = "pizza";

window.RESTAURANT_PROFILES = {
  pizza: {
    slug: "pizza",
    restaurantName: "Pizza House",
    tagline: "Premium Restaurant",
    logo: "",
    currency: "৳",
    theme: {
      primaryColor: "#ef2b24",
      secondaryColor: "#0b0b0b",
      accentColor: "#ff9f1c",
      backgroundColor: "#050505",
      textColor: "#ffffff",
      buttonColor: "#ff3b30"
    },
    hero: {
      badge: "HOT & FRESH",
      title: "Best Food in Your Town",
      highlight: "Town",
      subtitle: "Premium pizza-house flavors, juicy burgers, spicy shawarma wraps, and cool drinks, all crafted for a bold late-night craving or a family feast.",
      primaryButtonText: "Order Now",
      secondaryButtonText: "View Menu",
      image: "images/hero image.png",
      imageAlt: "Floating Pizza Hero Image",
      floatingCards: [
        { label: "Today's special", value: "Family Combo" },
        { label: "Free delivery", value: "Over ৳1000" }
      ],
      stats: [
        { value: "30 min", label: "Fast delivery" },
        { value: "4.9/5", label: "Top-rated taste" },
        { value: "50+", label: "Menu choices" }
      ]
    },
    about: {
      title: "Built like a local favorite, styled like a premium brand",
      text1: "Pizza House is designed as a modern neighborhood restaurant with a luxury black-and-red identity. The concept is flexible enough to support pizza, burgers, shawarma, and drinks, while keeping the look bold enough for social posts, ads, and future online ordering.",
      text2: "The kitchen story is simple: fresh ingredients, well-balanced spice, quick service, and generous portions that keep customers coming back.",
      image: "images/Pizza/pizza 5.jpg",
      imageAlt: "Premium family pizza",
      statValue: "4.9",
      statLabel: "Guest rating"
    },
    contact: {
      phone: "+880 1712 345 678",
      email: "hello@pizzahouse.demo",
      address: "Demo Restaurant Road, Dhaka, Bangladesh",
      openingHours: "Every day, 11:00 AM - 11:30 PM"
    },
    social: {
      facebook: "#",
      instagram: "#",
      whatsapp: "#",
      youtube: "#"
    },
    menuCategories: ["Pizza", "Burger", "Shawarma", "Drinks"],
    menuItems: [
      {
        name: "Margherita Blaze Pizza",
        category: "Pizza",
        description: "Wood-fired crust, mozzarella, basil, and a smoky tomato glaze.",
        price: 450,
        image: "images/Pizza/pizza 2.png",
        rating: 4.9,
        isFeatured: true,
        badge: "Best Seller",
        status: "active"
      },
      {
        name: "Tandoori Fire Pizza",
        category: "Pizza",
        description: "Tandoori chicken, peppers, onions, and a rich spiced sauce.",
        price: 550,
        image: "images/Pizza/pizza 3.jpg",
        rating: 4.8,
        isFeatured: true,
        badge: "Hot",
        status: "active"
      },
      {
        name: "Loaded Supreme Pizza",
        category: "Pizza",
        description: "Layers of cheese, olives, chicken, and peppers for a full bite.",
        price: 620,
        image: "images/Pizza/pizza 4.jpg",
        rating: 5.0,
        isFeatured: true,
        badge: "Chef's pick",
        status: "active"
      },
      {
        name: "Classic Flame Burger",
        category: "Burger",
        description: "Beef patty, crisp lettuce, tomato, and melted cheddar in a soft bun.",
        price: 320,
        image: "images/Burger/burger 1.jpg",
        rating: 4.7,
        isFeatured: true,
        badge: "Juicy",
        status: "active"
      },
      {
        name: "Double Cheese Crunch",
        category: "Burger",
        description: "Crispy chicken, double cheese, onion, and our signature house sauce.",
        price: 380,
        image: "images/Burger/Burger 2.jpg",
        rating: 4.8,
        isFeatured: false,
        badge: "Double cheese",
        status: "active"
      },
      {
        name: "Crispy Chicken Tower",
        category: "Burger",
        description: "Golden fried chicken, cheddar, pickles, and a smoky glaze.",
        price: 420,
        image: "images/Burger/Burger  3.jpg",
        rating: 4.9,
        isFeatured: false,
        badge: "Crispy",
        status: "active"
      },
      {
        name: "Chicken Shawarma Wrap",
        category: "Shawarma",
        description: "Soft wrap filled with shawarma strips, garlic sauce, and fresh salad.",
        price: 280,
        image: "images/Combo/Combo 1.jpg",
        rating: 4.8,
        isFeatured: true,
        badge: "Wrap",
        status: "active"
      },
      {
        name: "Royal Shawarma Feast Box",
        category: "Shawarma",
        description: "A loaded box with wraps, fries, dips, and a street-food style finish.",
        price: 470,
        image: "images/Combo/Combo 2.jpg",
        rating: 4.7,
        isFeatured: false,
        badge: "Feast box",
        status: "active"
      },
      {
        name: "Mixed Grill Shawarma Platter",
        category: "Shawarma",
        description: "Smoky mix of grilled bites, wraps, and sides for sharing at the table.",
        price: 620,
        image: "images/Combo/Combo 3.jpg",
        rating: 4.9,
        isFeatured: false,
        badge: "Mixed grill",
        status: "active"
      },
      {
        name: "Lime Spark Soda",
        category: "Drinks",
        description: "Bright citrus bubbles to cut through the richness of a big meal.",
        price: 120,
        image: "images/Dinks/Drinks 1.jpg",
        rating: 4.6,
        isFeatured: false,
        badge: "Chilled",
        status: "active"
      },
      {
        name: "Strawberry Chill Juice",
        category: "Drinks",
        description: "Sweet, cool, and refreshing with a smooth finish on warm evenings.",
        price: 150,
        image: "images/Dinks/Drinks 3.jpg",
        rating: 4.8,
        isFeatured: false,
        badge: "Fresh",
        status: "active"
      },
      {
        name: "Oreo Dream Shake",
        category: "Drinks",
        description: "Thick, creamy, and topped like a dessert worth slowing down for.",
        price: 220,
        image: "images/Dinks/Drinks 5.jpg",
        rating: 4.9,
        isFeatured: true,
        badge: "Shake",
        status: "active"
      }
    ],
    deals: [
      {
        title: "Family Pizza Combo",
        description: "A large pizza, extra dip, and a soft drink bundle for easy family dinners.",
        oldPrice: 1499,
        newPrice: 999,
        image: "images/Pizza/pizza 5.jpg",
        badge: "Save 33%",
        status: "active"
      },
      {
        title: "Burger Meal Deal",
        description: "Two burgers, fries, and a cool drink packed into one easy lunch option.",
        oldPrice: 899,
        newPrice: 649,
        image: "images/Burger/Burger  4.jpg",
        badge: "Save 28%",
        status: "active"
      },
      {
        title: "Shawarma + Drinks Combo",
        description: "A wrap-heavy combo with a cold drink to keep the meal balanced and lively.",
        oldPrice: 999,
        newPrice: 749,
        image: "images/Combo/Combo 1.jpg",
        badge: "Save 25%",
        status: "active",
        layout: "split",
        splitImages: ["images/Combo/Combo 1.jpg", "images/Dinks/Drinks 4.jpg"]
      }
    ]
  },

  coffee: {
    slug: "coffee",
    restaurantName: "Demo Coffee House",
    tagline: "Premium Cafe",
    logo: "",
    currency: "৳",
    theme: {
      primaryColor: "#6f4e37",
      secondaryColor: "#120d0a",
      accentColor: "#d7a86e",
      backgroundColor: "#090603",
      textColor: "#ffffff",
      buttonColor: "#6f4e37"
    },
    hero: {
      badge: "AROMA & FRESH",
      title: "Fresh Coffee, Fresh Morning",
      highlight: "Morning",
      subtitle: "Premium coffee, snacks, and desserts for every mood. Designed for a warm café vibe with quick ordering and future admin control.",
      primaryButtonText: "Book Now",
      secondaryButtonText: "Explore Menu",
      image: "images/Dinks/Drinks 4.jpg",
      imageAlt: "Floating coffee house hero image",
      floatingCards: [
        { label: "Today's brew", value: "Latte + pastry" },
        { label: "Free delivery", value: "Over ৳600" }
      ],
      stats: [
        { value: "20 min", label: "Fresh brew" },
        { value: "4.8/5", label: "Cafe rating" },
        { value: "30+", label: "Snacks & drinks" }
      ]
    },
    about: {
      title: "A cozy cafe with a premium, modern feel",
      text1: "Demo Coffee House keeps the same elegant single-page structure but shifts the flavor story toward coffee, desserts, and quick café bites. The builder-ready content makes it easy to swap the menu for another cafe profile later.",
      text2: "Warm lighting, rich drinks, and relaxed delivery choices make the layout feel welcoming without changing the overall design system.",
      image: "images/Dinks/Drinks 5.jpg",
      imageAlt: "Premium milkshake dessert",
      statValue: "4.8",
      statLabel: "Cafe rating"
    },
    contact: {
      phone: "+880 1701 234 567",
      email: "hello@coffeehouse.demo",
      address: "Demo Coffee Road, Dhaka, Bangladesh",
      openingHours: "Every day, 08:00 AM - 10:30 PM"
    },
    social: {
      facebook: "#",
      instagram: "#",
      whatsapp: "#",
      youtube: "#"
    },
    menuCategories: ["Coffee", "Snacks", "Dessert", "Drinks"],
    menuItems: [
      {
        name: "Signature Cappuccino",
        category: "Coffee",
        description: "Smooth espresso, steamed milk, and a soft cocoa finish.",
        price: 260,
        image: "images/Dinks/Drinks 4.jpg",
        rating: 4.9,
        isFeatured: true,
        badge: "Hot cup",
        status: "active"
      },
      {
        name: "Iced Mocha",
        category: "Coffee",
        description: "Chocolate-kissed iced coffee with a cool, rich aftertaste.",
        price: 280,
        image: "images/Dinks/Drinks 5.jpg",
        rating: 4.8,
        isFeatured: false,
        badge: "Cold brew",
        status: "active"
      },
      {
        name: "Caramel Latte",
        category: "Coffee",
        description: "A silky latte with caramel notes and a velvety finish.",
        price: 290,
        image: "images/Dinks/Drinks 3.jpg",
        rating: 4.9,
        isFeatured: false,
        badge: "Silky",
        status: "active"
      },
      {
        name: "Club Sandwich",
        category: "Snacks",
        description: "Layered snack sandwich with crisp fillings and café-style toast.",
        price: 380,
        image: "images/Burger/burger 1.jpg",
        rating: 4.7,
        isFeatured: true,
        badge: "Lunch",
        status: "active"
      },
      {
        name: "Loaded Panini",
        category: "Snacks",
        description: "Toasted panini-style comfort snack with a golden finish.",
        price: 420,
        image: "images/Burger/Burger 2.jpg",
        rating: 4.8,
        isFeatured: false,
        badge: "Toasted",
        status: "active"
      },
      {
        name: "Crispy Fries Platter",
        category: "Snacks",
        description: "A simple, shareable side that fits the café mood.",
        price: 220,
        image: "images/Burger/Burger  3.jpg",
        rating: 4.6,
        isFeatured: false,
        badge: "Side",
        status: "active"
      },
      {
        name: "Chocolate Fudge Shake",
        category: "Dessert",
        description: "Creamy dessert shake with a deep chocolate finish.",
        price: 320,
        image: "images/Dinks/Drinks 1.jpg",
        rating: 4.9,
        isFeatured: true,
        badge: "Sweet",
        status: "active"
      },
      {
        name: "Berry Sundae",
        category: "Dessert",
        description: "Cold and bright dessert with a soft fruity finish.",
        price: 350,
        image: "images/Dinks/Drinks 2.jpg",
        rating: 4.8,
        isFeatured: false,
        badge: "Chill",
        status: "active"
      },
      {
        name: "Oat Milk Cold Brew",
        category: "Drinks",
        description: "Modern café drink with a balanced, low-sugar profile.",
        price: 300,
        image: "images/Dinks/Drinks 5.jpg",
        rating: 4.7,
        isFeatured: false,
        badge: "Cold brew",
        status: "active"
      }
    ],
    deals: [
      {
        title: "Morning Brew Duo",
        description: "A coffee and a snack combo to start the day smooth and simple.",
        oldPrice: 699,
        newPrice: 499,
        image: "images/Dinks/Drinks 4.jpg",
        badge: "Save 29%",
        status: "active"
      },
      {
        title: "Dessert Break Combo",
        description: "A dessert shake and a café snack for an afternoon reset.",
        oldPrice: 899,
        newPrice: 649,
        image: "images/Dinks/Drinks 5.jpg",
        badge: "Save 28%",
        status: "active"
      },
      {
        title: "Cafe Feast Box",
        description: "A balanced box with drinks and toastables for a full café spread.",
        oldPrice: 1299,
        newPrice: 949,
        image: "images/Burger/burger 1.jpg",
        badge: "Save 27%",
        status: "active",
        layout: "split",
        splitImages: ["images/Dinks/Drinks 2.jpg", "images/Burger/burger 1.jpg"]
      }
    ]
  },

  biryani: {
    slug: "biryani",
    restaurantName: "Demo Biryani House",
    tagline: "Authentic Desi Food",
    logo: "",
    currency: "৳",
    theme: {
      primaryColor: "#b45309",
      secondaryColor: "#160d04",
      accentColor: "#facc15",
      backgroundColor: "#050302",
      textColor: "#ffffff",
      buttonColor: "#b45309"
    },
    hero: {
      badge: "SPICE & FEAST",
      title: "Authentic Biryani Taste",
      highlight: "Biryani",
      subtitle: "Traditional kacchi, tehari, kebab and desi meals cooked with rich spices. Built as a premium restaurant builder profile, ready for future admin updates.",
      primaryButtonText: "Order Now",
      secondaryButtonText: "See Menu",
      image: "images/Combo/Combo 2.jpg",
      imageAlt: "Floating biryani feast hero image",
      floatingCards: [
        { label: "Today's special", value: "Feast platter" },
        { label: "Free delivery", value: "Over ৳1200" }
      ],
      stats: [
        { value: "35 min", label: "Hot delivery" },
        { value: "4.9/5", label: "Customer love" },
        { value: "40+", label: "Desi items" }
      ]
    },
    about: {
      title: "A warm desi food profile with the same premium layout",
      text1: "Demo Biryani House shows how the same page structure can serve a biryani-focused restaurant without rewriting the design. Only the content, colors, and food visuals change.",
      text2: "The concept keeps the dark luxury style but swaps in warmer spice tones so the brand still feels rich, modern, and local.",
      image: "images/Combo/Combo 3.jpg",
      imageAlt: "Premium feast platter",
      statValue: "4.9",
      statLabel: "Spice rating"
    },
    contact: {
      phone: "+880 1702 345 678",
      email: "hello@biryanihouse.demo",
      address: "Demo Biryani Lane, Dhaka, Bangladesh",
      openingHours: "Every day, 11:00 AM - 12:00 AM"
    },
    social: {
      facebook: "#",
      instagram: "#",
      whatsapp: "#",
      youtube: "#"
    },
    menuCategories: ["Biryani", "Kebab", "Drinks"],
    menuItems: [
      {
        name: "Kacchi Royal Biryani",
        category: "Biryani",
        description: "A rich, layered biryani built for a premium feast feel.",
        price: 520,
        image: "images/Combo/Combo 2.jpg",
        rating: 4.9,
        isFeatured: true,
        badge: "Signature",
        status: "active"
      },
      {
        name: "Beef Tehari Plate",
        category: "Biryani",
        description: "Warm, spiced rice with a smooth house-style finish.",
        price: 480,
        image: "images/Combo/Combo 3.jpg",
        rating: 4.8,
        isFeatured: false,
        badge: "Spice",
        status: "active"
      },
      {
        name: "Chicken Dum Biryani",
        category: "Biryani",
        description: "Slow-cooked comfort biryani with a rich aroma.",
        price: 450,
        image: "images/Combo/Combo 1.jpg",
        rating: 4.9,
        isFeatured: false,
        badge: "Classic",
        status: "active"
      },
      {
        name: "Seekh Kebab Roll",
        category: "Kebab",
        description: "Charred roll with a soft wrap and a smoky finish.",
        price: 260,
        image: "images/Burger/burger 1.jpg",
        rating: 4.7,
        isFeatured: true,
        badge: "Roll",
        status: "active"
      },
      {
        name: "Chicken Roast Box",
        category: "Kebab",
        description: "A heavier box option with classic desi-style richness.",
        price: 380,
        image: "images/Burger/Burger 2.jpg",
        rating: 4.8,
        isFeatured: false,
        badge: "Roast",
        status: "active"
      },
      {
        name: "Smoky Kebab Platter",
        category: "Kebab",
        description: "Grilled bites with a spicy surface and a soft interior.",
        price: 420,
        image: "images/Burger/Burger  3.jpg",
        rating: 4.9,
        isFeatured: false,
        badge: "Grill",
        status: "active"
      },
      {
        name: "Borhani",
        category: "Drinks",
        description: "Cool, tangy drink to balance a rich biryani plate.",
        price: 120,
        image: "images/Dinks/Drinks 1.jpg",
        rating: 4.6,
        isFeatured: false,
        badge: "Cool",
        status: "active"
      },
      {
        name: "Lemon Mint Mojito",
        category: "Drinks",
        description: "Fresh and bright with a clean citrus finish.",
        price: 150,
        image: "images/Dinks/Drinks 2.jpg",
        rating: 4.7,
        isFeatured: false,
        badge: "Fresh",
        status: "active"
      },
      {
        name: "Falooda",
        category: "Drinks",
        description: "Sweet dessert drink that works well after a spicy meal.",
        price: 180,
        image: "images/Dinks/Drinks 5.jpg",
        rating: 4.8,
        isFeatured: true,
        badge: "Sweet",
        status: "active"
      }
    ],
    deals: [
      {
        title: "Family Biryani Feast",
        description: "Large biryani plates, sides, and a drink built for sharing.",
        oldPrice: 1899,
        newPrice: 1399,
        image: "images/Combo/Combo 3.jpg",
        badge: "Save 26%",
        status: "active"
      },
      {
        title: "Kebab Plate Deal",
        description: "A kebab-focused platter that works for lunch or dinner.",
        oldPrice: 999,
        newPrice: 749,
        image: "images/Burger/Burger  4.jpg",
        badge: "Save 25%",
        status: "active"
      },
      {
        title: "Biryani + Drink Special",
        description: "A full meal combo with a cold drink to keep it balanced.",
        oldPrice: 1299,
        newPrice: 999,
        image: "images/Combo/Combo 2.jpg",
        badge: "Save 23%",
        status: "active",
        layout: "split",
        splitImages: ["images/Combo/Combo 2.jpg", "images/Dinks/Drinks 1.jpg"]
      }
    ]
  }
};
