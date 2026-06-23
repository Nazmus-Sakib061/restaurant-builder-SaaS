# Restaurant Builder SaaS Demo

A premium restaurant website and admin demo built for `localhost` with a dark luxury restaurant look, tenant-aware menu filtering, deal cards, contact/order form validation, and backend-ready PHP/MySQL structure.

## Project Structure

```text
restaurant_builder_SaaS/
├── index.html
├── README.md
├── assets/
│   ├── css/style.css
│   ├── js/main.js
│   └── icons/
├── images/
├── admin/
│   ├── index.html
│   ├── dashboard.html
│   └── assets/
│       ├── css/admin.css
│       └── js/admin.js
└── backend/
    ├── config/db.php
    ├── api/
    │   ├── _helpers.php
    │   ├── foods.php
    │   ├── categories.php
    │   ├── deals.php
    │   ├── orders.php
    │   └── settings.php
    └── database/restaurant.sql
```

## How To Run In XAMPP

1. Copy or keep the project folder here:
   `C:\xampp\htdocs\restaurant_builder_SaaS`
2. Start **Apache** and **MySQL** from XAMPP.
3. Open the homepage in your browser:
   `http://localhost/restaurant_builder_SaaS/`

### Demo Profiles

Switch the restaurant profile by adding `?demo=` to the URL:

- `http://localhost/restaurant_builder/?demo=pizza`
- `http://localhost/restaurant_builder/?demo=coffee`
- `http://localhost/restaurant_builder/?demo=biryani`

### Database API Profiles

When `?tenant=` is present, the public website loads data from `backend/api/site-data.php` and falls back to the local demo profile if the API is unavailable:

- `http://localhost/restaurant_builder_SaaS/?tenant=default`
- `http://localhost/restaurant_builder_SaaS/?tenant=demo-coffee-house`
- `http://localhost/restaurant_builder_SaaS/?tenant=demo-biryani-house`

4. To use the current builder database, import `backend/database/restaurant_builder_schema.sql` first, then `backend/database/restaurant_builder_seed.sql` into phpMyAdmin.
5. If you want to override the local database settings, copy `config.example.php` to `config.php` and edit the credentials.
   The backend will use `config.php` automatically when it exists, otherwise it falls back to the safe local defaults in `backend/config/db.php`.

## Admin Demo

Open:
`http://localhost/restaurant_builder/admin/`

The admin area is a static demo shell for now, designed for future login and CRUD wiring.
Use the demo login: `admin` / `123456`.

## Features

- Sticky responsive navbar with mobile menu
- Premium hero section with dark pizza-house styling
- Glassmorphism feature cards
- Filterable online menu
- Deals section with discount badges
- About section with image collage
- Contact/order form validation
- Backend-ready PHP API structure
- MySQL schema for multi-tenant settings, categories, menu items, deals, gallery, orders, and reservations

## Image Performance Guidelines

- Hero image target size: 300KB to 800KB.
- Food card, deal, and gallery image target size: 100KB to 300KB.
- Use compressed WebP or JPG images in production.
- Avoid shipping 8MB to 18MB source images directly to public pages.
- Dynamically rendered menu, deal, and gallery images use lazy loading where possible.

## Images Used

These local files from `images/` were used in the design:

- `images/Pizza/pizza 1.png`
- `images/Pizza/pizza 2.png`
- `images/Pizza/pizza 3.jpg`
- `images/Pizza/pizza 4.jpg`
- `images/Pizza/pizza 5.jpg`
- `images/Burger/burger 1.jpg`
- `images/Burger/Burger 2.jpg`
- `images/Burger/Burger  3.jpg`
- `images/Burger/Burger  4.jpg`
- `images/Combo/Combo 1.jpg`
- `images/Combo/Combo 2.jpg`
- `images/Combo/Combo 3.jpg`
- `images/Dinks/Drinks 1.jpg`
- `images/Dinks/Drinks 2.jpg`
- `images/Dinks/Drinks 3.jpg`
- `images/Dinks/Drinks 4.jpg`
- `images/Dinks/Drinks 5.jpg`

## Notes

- The folder name `Dinks` is kept exactly as it appears on disk.
- Image paths in HTML use `%20` where filenames contain spaces.
- The order form will try to post to the backend API and gracefully fall back to local demo storage if the database is not connected yet.


## Backlogs

BACKLOG
- API privacy cleanup
- Discount display
- .gitignore
- Image optimization

hero_button_link clear behavior
visible dev token
fallback message polish
