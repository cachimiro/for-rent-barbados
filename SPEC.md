# For Rent Barbados — Rebuild Specification

This document captures everything needed to rebuild the For Rent Barbados website as a modern Next.js application, faithfully reproducing the design, content, and functionality of the original WordPress/Elementor site.

---

## 1. Project Overview

**Site:** forrentbarbados.com  
**Owner:** Maisha Ward — Property Manager, Rental & Sales Agent  
**Purpose:** Luxury vacation rental listings for Barbados properties, with concierge services and direct booking.

### Pages

| Route | Description |
|---|---|
| `/` | Home page |
| `/rentals` | All listings (availability search) |
| `/accommodation/[slug]` | Individual property detail |
| `/contact` | Contact form + business info |
| `/volunteer` | Community giving page |
| `/terms-conditions` | Terms of service |

> The original site has a "Concierge" nav link that anchors to `/#services` on the home page — not a separate page.

---

## 2. Design Tokens

### 2.1 Colour Palette

These are the Elementor kit CSS variables (`--e-global-color-*`) plus additional colours found in page-level CSS.

```css
/* Brand / Theme */
--color-primary:     #042E28;   /* deep forest green — main brand colour */
--color-accent:      #191B18;   /* near-black */
--color-dark:        #191B18;
--color-shadow:      #555754;
--color-midtone:     #9C9F9B;
--color-highlight:   #EAEAEA;
--color-light:       #FFFFFF;

/* Elementor defaults (kept for plugin compatibility) */
--color-el-primary:  #6EC1E4;
--color-el-secondary:#54595F;
--color-el-text:     #7A7A7A;
--color-el-accent:   #61CE70;

/* Page-level colours */
--color-body-text:   #363636;
--color-muted:       #888888;
--color-subtle:      #9F9F9F;
--color-dark-alt:    #212121;
--color-near-black:  #272727;
--color-warm-white:  #FAFAFA;
--color-off-white:   #F3F3F3;
--color-warm-bg:     #FFFDFB;
--color-light-green: #f4f6f2;
--color-amber:       #FFBC7D;   /* used for star ratings / highlights */

/* Overlays */
--overlay-dark:      rgba(0,0,0,0.75);   /* hero video overlay */
--overlay-mid:       rgba(0,0,0,0.40);
--overlay-light:     rgba(0,0,0,0.12);
```

### 2.2 Typography

| Role | Family | Weight | Notes |
|---|---|---|---|
| Body / default | `Spinnaker`, sans-serif | 400 | 16px / 2em line-height |
| Headings (primary) | `Roboto` | 600 | |
| Subheadings (secondary) | `Roboto Slab` | 400 | |
| UI / buttons | `Poppins` | 400 | uppercase, letter-spacing 4.2px |
| Cards / labels | `Lato` | 700 / 900 | |
| Property detail body | `Montserrat` | varies | |
| Decorative / serif accent | `Times New Roman` | 400 | used sparingly |

**Font sizes found in CSS:**  
`12px`, `13px`, `14px`, `16px`, `18px`, `20px`, `22px`, `26px`, `29px`, `30px`, `33px`, `35px`, `40px`, `60px`, `72px`, `1rem`, `1.25rem`, `1.3rem`, `1.8rem`, `3rem`

**Letter spacing:** `0px` (body), `3px` (labels), `4.2px` (buttons/CTAs)

### 2.3 Spacing

Section vertical padding follows an 80px rhythm:

```
section padding: 80px 0
inner content:   0 100px (desktop), 0 20px (mobile)
card gap:        ~20–24px
button padding:  10px 20px
```

### 2.4 Border Radius & Shadows

- Cards: `8px` radius (inferred from visual)
- Buttons: `4px` or pill-shaped depending on context
- Box shadow: `rgba(0,0,0,0.05)` subtle card shadow

---

## 3. Assets

### 3.1 Logo

- **Primary logo:** `wp-content/uploads/2021/10/LOGO-FRB-10.svg` — used in header
- **Favicon:** `wp-content/uploads/2025/05/LOGO-FRB-fav-02.svg`

### 3.2 Hero

- **Video:** `wp-content/uploads/2025/05/FRB-HOMEPAGE-VIDEO-UPDATED.mp4` (not captured in clone — needs to be sourced or replaced with `banner.jpg` fallback)
- **Fallback image:** `wp-content/uploads/2025/04/banner.jpg`
- **Overlay:** `rgba(0,0,0,0.75)` dark overlay on top of video

### 3.3 Property Images

All property images are in `wp-content/uploads/2025/05/` and `wp-content/uploads/2025/09/`. Each property has 10–25 photos. See `accommodation/*/index.html` for the exact image list per property.

### 3.4 Concierge / Feature Images

- `wp-content/uploads/2025/04/L5.png` through `L8.png` — used in concierge/feature sections
- `wp-content/uploads/2021/10/GReviews.png` — Google Reviews badge
- `wp-content/uploads/2021/10/booking.webp` — Booking.com badge
- `wp-content/uploads/2025/05/Steps-to-the-Mullins-Beach.png`

---

## 4. Header & Navigation

### Structure

```
[Logo SVG]                    [Home] [Rentals] [Concierge] [Testimonials] [Contact] [Volunteer]
```

- Sticky header, transparent over hero, white/solid on scroll
- Logo links to `/`
- Nav links: Home `/`, Rentals `/rentals`, Concierge `/#services`, Testimonials `/#reviews`, Contact `/contact`, Volunteer `/volunteer`
- Mobile: hamburger menu (full-screen or slide-in overlay)
- No CTA button in header on the original — just text links

---

## 5. Footer

### Structure

Two-part footer:

**Upper footer (newsletter strip):**
- Heading: "Stay Updated on New Homes & Exclusive Deals"
- Subtext: "Subscribe to our newsletter for early access to new listings, special offers, and the latest editorial insights."
- Email input + submit (honeypot anti-spam field included)
- Background: dark green (`#042E28`) or near-black

**Lower footer:**
- Tagline: "Inspired Stays. Lasting Moments."
- Links: Home · Rentals · Contact · Terms & Conditions
- Copyright: "© 2025 For Rent Barbados. Terms of Service"
- Background: dark (`#191B18`)

---

## 6. Home Page (`/`)

### Section 1 — Hero

- **Background:** full-screen autoplay muted looping video (`FRB-HOMEPAGE-VIDEO-UPDATED.mp4`) with dark overlay
- **Headline:** "Escape ordinary, stay extraordinary." (large, white, centered)
- **Booking widget:** inline date-picker form overlaid on or below hero
  - Fields: Check-in (date), Check-out (date), Adults (1–10 select), Children (0–6 select)
  - CTA button: "Search" or "Check Availability"

### Section 2 — Featured Properties

- **Heading:** "Where Barbados Feels Like Home"
- **Subheading:** "Handpicked villas and townhomes designed for island living at its finest."
- **Layout:** horizontal card carousel / slider (3 cards visible on desktop)
- **Cards shown:** Azzurro 03 – 3 BED, Westmoreland Hill 35 – 4 BED, Poinciana at the Crane
- Each card: property photo, name, guest/bed/bath counts, price per night, "Check Availability" link
- **CTA:** "view all rentals" link → `/rentals`

### Section 3 — Concierge Services

- **Heading:** "Island Experiences & Concierge Services"
- **Subheading:** "We handle the details — you enjoy the island."
- **Layout:** 2×3 or 3×2 icon/image grid
- **Services:**
  1. VIP Airport Arrival & Transfers — "Enjoy a smooth welcome with fast-track airport service and private transport straight to your villa."
  2. Personal Driver Services — "Move around Barbados in comfort and style with your own dedicated driver, on your schedule."
  3. Private Chef at Your Villa — "Savor gourmet meals prepared fresh in your villa — tailored to your taste, without lifting a finger."
  4. Guided Fishing Excursions — "Head out on the water with expert guides for a memorable day of deep-sea or coastal fishing."
  5. Unseen Barbados Boat Tours — "Discover hidden coves, quiet beaches, and breathtaking coastal views on a private boat tour."
  6. Curated Picnics — "Relax seaside with a beautifully set picnic — locally inspired, thoughtfully prepared, and entirely effortless."
- Each service has an icon/image, title, and description
- Section anchor: `id="services"`

### Section 4 — Why Book With Us

- **Heading:** "Why Book with Us?"
- **Subheading:** "Your Barbados escape, handled with care."
- **Layout:** 3-column icon + text cards
- **Points:**
  1. Handpicked Island Stays — "Every villa, condo, and townhouse is carefully selected for quality, comfort, and location."
  2. Personalized Concierge Services — "From private chefs to boat tours, we tailor your stay to match your travel style."
  3. Local Expertise, Seamless Support — "Barbados is our home — count on us for insider tips, responsive help, and effortless bookings."

### Section 5 — Testimonials

- **Heading:** "Our Guests, Their Words"
- **Subheading:** "Our guests' words capture the beauty and comfort of Barbados living."
- **Layout:** card carousel / slider
- **CTA:** "view all reviews" link
- Section anchor: `id="reviews"`
- **Reviews shown on home page:**
  1. Lizzie — Westmoreland Hills 35 — 5★ — "Spent 3 weeks in this beautiful villa. It exceeded our expectations to the full..."
  2. Lola — Azzurro 03 — 5★ — "We enjoyed our stay! Thank you for all the proactive responses..."
  3. Teri — Coral Beach 105 — 5★ — "Really enjoyed our stay. The place is nice and spacious and worth every penny..."
- Each card: truncated review with "Read More" expand, reviewer name, property name

### Section 6 — Newsletter

- (Shared with footer — see Footer section above)

---

## 7. Rentals / Listings Page (`/rentals`)

### Structure

- **Page heading:** "Availability Search"
- **Booking search form** at top (same fields as hero widget: check-in, check-out, adults, children)
- **Property grid:** all 22 listings displayed as cards

### Property Card

```
[Property photo]
$XXX/night
[Property Name]
[N] guests · [N] bedroom · [N] bed · [N] bath
```

### Full Listing (22 properties)

| Name | Guests | Beds | Baths | Price/night |
|---|---|---|---|---|
| Coral Beach 105 1 Bed | 2 | 1 | 1 | $188 |
| Coral Beach 105 2 Bed | 4 | 2 | 2 | $200 |
| Azzurro 03 3 BED | 6 | 3 | 3 | $438 |
| Azzurro 03 2 BED | 4 | 2 | 2 | $394 |
| Lantana 44 2 BED | 4 | 2 | 2 | $160 |
| Lantana 44 3 BED | 6 | 3 | 2 | $185 |
| Turtle View 3 BED | 6 | 3 | 2 | $263 |
| Turtle View 2 BED | 4 | 2 | 2 | $185 |
| Westmoreland Hill 13 2 BED | 4 | 2 | 2 | $375 |
| Westmoreland Hill 13 3 BED | 6 | 3 | 2 | $435 |
| Westmoreland Hill 2 3 BED | 6 | 3 | 2 | $750 |
| Westmoreland Hill 22 4 BED | 8 | 4 | 4 | $810 |
| Westmoreland Hill 35 3 BED | 6 | 3 | 3.5 | $600 |
| Westmoreland Hill 35 4 BED | 8 | 4 | 4.5 | $700 |
| Brownes 2B 1 Bed | 2 | 1 | 1 | $165 |
| Jamestown Park 1 2 BED | 4 | 2 | 2 | $120 |
| Coconut Grove 3 – Sienna | 6 | 3 | 3.5 | $1,500 |
| Poinciana at the Crane | 4 | 2 | 2 | $490 |
| Mullins Reef 3 BED | 6 | 3 | 3 | $625 |
| Westmoreland Hills 1, Villa Savannah | 6 | 3 | 2 | $450 |
| Ixora 101 | 4 | 2 | 1.5 | $150 |
| Jamestown Park 1 1 BED | 2 | 1 | 1 | $102 |

---

## 8. Property Detail Page (`/accommodation/[slug]`)

### Layout

**Above the fold:**
- Full-width photo gallery (lightbox grid — 4–6 photos visible, click to expand all ~20 photos)
- Property name as `<h1>` (e.g. "Azzurro 03")
- Location: "Porters, St. James"
- Quick stats row: `[N] guests · [N] bedroom · [N] bathroom`

**Body (two-column on desktop, stacked on mobile):**

Left column (main content):
- Long-form description (2–4 paragraphs)
- "Welcome pack" callout (complimentary snacks on arrival)
- Seasonal pricing table:
  | Season | Dates | Price/night |
  |---|---|---|
  | Summer | Apr 15 – Dec 15 | $438 |
  | Winter | Dec 15–20 & Jan 10 – Apr 15 | $550 |
  | Christmas | Dec 20 – Jan 10 | $850 |
- Property-specific reviews (same card style as home page)

Right column (sticky booking widget):
- Heading: "Starting from $XXX/night" / "Enter dates for seasonal pricing"
- Fields: Check-in Date, Check-out Date, Adults (1–6 select)
- CTA button: "Reserve"
- Availability note: "1 of 1 available accommodations. [Property] is available for selected dates."

**Below fold:**
- Testimonials section (same as home page)
- Newsletter section

### URL Slugs (from `accommodation/` directory)

```
azzurro-03-2-bed
azzurro-03-3-bed
brownes-2b-1-bed
coconut-grove-3-sienna
coral-beach-105
coral-beach-105-2
ixora-101
jamestown-park-1-2-bed
jamestown-park-1-2-bed-2
lantana-44-2-bed
lantana-44-3-bed
mullins-reef-3-bed
the-crane-resort
turtle-view-2-bed
turtle-view-3-bed
westmoreland-hill-13-2-bed
westmoreland-hill-13-3-bed
westmoreland-hill-2-3-bed
westmoreland-hill-22-4-bed
westmoreland-hill-35-3-bed
westmoreland-hill-35-4-bed
westmoreland-hills-1-villa-savannah
```

---

## 9. Contact Page (`/contact`)

### Layout

- **Page heading:** "Get in Touch" / "Contact Us"
- **Two-column layout:**

Left — Contact form:
- Fields: Name (first), Email, Subject, Message (textarea)
- Submit button
- Honeypot anti-spam field

Right — Business info:
- **Business Hours (AST / UTC−4):**  
  Monday to Saturday: 9:00 AM – 5:00 PM  
  Sunday: Closed
- **Email:** holiday@forrentbarbados.com
- **Phone:** +1 (246) 247-2229

---

## 10. Volunteer Page (`/volunteer`)

### Layout

- **Page heading:** "Support Local Causes During Your Stay"
- **Subheading:** "Volunteer in Barbados"
- **Intro text:** "Barbados is more than just sun, sand, and sea — it's a vibrant community full of opportunities to make a meaningful impact..."

**Two organisation cards:**

1. **Slow Food Barbados**
   - Initiative: Slow Soup Drive
   - Description: provides nutritious meals to vulnerable groups — single parents, elderly, people with disabilities, low-income families
   - Bullet points: Prepare and distribute healthy, local meals · Support local farmers, chefs, and food producers · Strengthen Barbados' sustainable food systems
   - CTA: "Learn More & Donate" (external link)

2. **Ocean Acres Animal Sanctuary**
   - Description: safe haven for 200+ rescued dogs and cats; rescue, rehabilitate, rehome; spay/neuter clinics
   - Bullet points: Volunteer with feeding, walking, or caring for animals · Become a travel buddy to help rehome pets abroad · Donate to support shelter operations and medical care
   - CTA: "Support Animal Welfare" (external link)

---

## 11. Terms & Conditions Page (`/terms-conditions`)

Standard legal page — content from `terms-conditions/index.html`.

---

## 12. Booking Widget

The booking widget appears in three places:
1. Hero section overlay (home page)
2. Top of Rentals page
3. Sticky sidebar on property detail pages
4. Floating modal (triggered from a persistent "Enter your desired dates" bar at the bottom of some pages)

### Fields

| Field | Type | Options |
|---|---|---|
| Check-in | Date picker | — |
| Check-out | Date picker | — |
| Adults | Select | 1–10 (home/rentals), 1–6 (property detail) |
| Children | Select | 0–6 (home/rentals only) |

The original uses the **MotoPress Hotel Booking** WordPress plugin. In the rebuild this should be replaced with a custom booking form that either:
- Integrates with an external booking API (e.g. Lodgify, Hostaway, Guesty), or
- Submits an enquiry email via a serverless function

---

## 13. Tech Stack Recommendation

| Layer | Choice | Rationale |
|---|---|---|
| Framework | Next.js 14 (App Router) | SSG for property pages, ISR for availability |
| Styling | Tailwind CSS | Utility-first, easy to match design tokens |
| Fonts | `next/font` with Google Fonts | Poppins, Roboto, Roboto Slab, Lato, Montserrat |
| Images | `next/image` | Optimised WebP delivery from local assets |
| Animations | Framer Motion | Carousel, scroll reveals |
| Forms | React Hook Form + Resend/Nodemailer | Contact + booking enquiry |
| CMS (optional) | Contentlayer or Sanity | If property data needs to be editable |
| Deployment | Vercel | Native Next.js support |

---

## 14. File / Folder Structure

```
/
├── app/
│   ├── page.tsx                        # Home
│   ├── rentals/page.tsx                # Listings
│   ├── accommodation/[slug]/page.tsx   # Property detail
│   ├── contact/page.tsx
│   ├── volunteer/page.tsx
│   └── terms-conditions/page.tsx
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── home/
│   │   ├── HeroSection.tsx
│   │   ├── FeaturedProperties.tsx
│   │   ├── ConciergeServices.tsx
│   │   ├── WhyBookWithUs.tsx
│   │   └── Testimonials.tsx
│   ├── property/
│   │   ├── PropertyCard.tsx
│   │   ├── PropertyGallery.tsx
│   │   └── BookingWidget.tsx
│   └── shared/
│       ├── NewsletterSection.tsx
│       └── BookingSearchBar.tsx
├── data/
│   └── properties.ts                   # All 22 property records
├── public/
│   └── assets/                         # Copied from wp-content/uploads
└── styles/
    └── globals.css                     # CSS variables / tokens
```

---

## 15. Data Model

### Property

```typescript
interface Property {
  slug: string;
  name: string;
  location: string;           // e.g. "Porters, St. James"
  guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;          // supports .5 increments
  description: string;        // long-form HTML or markdown
  welcomePack?: string;       // callout text
  pricing: SeasonalPrice[];
  images: string[];           // relative paths under /public/assets/
  coverImage: string;
  reviews: Review[];
}

interface SeasonalPrice {
  season: 'summer' | 'winter' | 'christmas' | string;
  label: string;              // e.g. "Summer Season"
  dateRange: string;          // e.g. "April 15th – December 15th"
  pricePerNight: number;      // USD
}

interface Review {
  author: string;
  property: string;
  date: string;
  body: string;
  rating: number;             // 1–5
  source?: 'airbnb' | 'google' | 'direct';
}
```

---

## 16. Key Copy

### Brand tagline
> "Inspired Stays. Lasting Moments."

### Hero headline
> "Escape ordinary, stay extraordinary."

### About (used in meta / intro)
> "Hello from sunny Barbados! I'm Maisha Ward, a Property Manager and Rental and Sales Agent with over 10 years of experience in luxury vacation rentals. I manage over 10 carefully selected properties on the West and South coasts, offering personalized concierge services to make your stay unforgettable. Whether you're renting or buying, I'm here to ensure a hassle-free and memorable experience in beautiful Barbados."

### Newsletter CTA
> "Stay Updated on New Homes & Exclusive Deals"  
> "Subscribe to our newsletter for early access to new listings, special offers, and the latest editorial insights."

---

## 17. SEO & Meta

- Page title pattern: `[Page Name] – For Rent Barbados`
- Home title: `For Rent Barbados – Hello from sunny Barbados! I'm Maisha Ward…`
- OG image: hero banner or property cover photo
- Canonical URLs: `https://forrentbarbados.com/[path]`
- Structured data: `schema.org/LodgingBusiness` on property pages

---

## 18. Responsive Breakpoints

Based on Elementor defaults used in the original:

| Breakpoint | Width |
|---|---|
| Mobile | < 767px |
| Tablet | 768px – 1024px |
| Desktop | > 1025px |

Key responsive changes:
- Header: hamburger menu on mobile/tablet
- Property grid: 3 cols → 2 cols → 1 col
- Concierge grid: 3 cols → 2 cols → 1 col
- Property detail: 2-col → stacked (booking widget moves below content)
- Section padding: `80px 100px` → `60px 20px`
