# For Rent Barbados — Full Rebuild Update Spec

---

## Header Redesign

### Problem

The current `Header.tsx` does not match the design shown in the reference screenshot. Specific gaps:

| Property | Screenshot (target) | Current code |
|---|---|---|
| Background | Always fully transparent | Solid white `#FFFFFF` always |
| Layout | Two rows: logo centred top, nav centred below | Single row: logo left, nav right |
| Logo | Centred, white SVG | Left-aligned (white SVG invisible on white bg) |
| Nav links | White text, centred, wider spacing | Black text, right-aligned, 15px padding |
| "Volunteer" link | White filled box, black text | Plain text link identical to others |
| Scroll behaviour | No change (stays transparent) | Adds box-shadow on scroll |

### Requirements

1. **Always transparent background** — `background: transparent` at all times, no scroll-triggered colour change. Remove the `scrolled` state and its `background`/`boxShadow` logic.

2. **Two-row centred layout:**
   - Row 1: logo centred horizontally, `padding-top: ~20px`
   - Row 2: nav links centred horizontally, directly below the logo

3. **Logo:** centred, white SVG (`LOGO-FRB-10.svg`). Keep current `width: 180px` / `height: auto`.

4. **Nav links:**
   - Font: `Montserrat`, uppercase, `letter-spacing: 1px`, `font-size: 13px`, `font-weight: 500`
   - Colour: `#FFFFFF` (white)
   - Spacing: `padding: 10px 20px` between links
   - No underline, hover: slight opacity reduction (`opacity: 0.75`)

5. **"Volunteer" link special style:**
   - White filled box: `background: #FFFFFF`, `color: #000000`
   - `padding: 8px 20px`, no border-radius (square corners as shown)
   - Hover: `opacity: 0.85`

6. **Scroll behaviour:** none — header stays transparent and identical regardless of scroll position. Remove `scrolled` state entirely.

7. **Mobile hamburger:** icon lines change from black to **white** to remain visible on transparent background. Mobile dropdown menu stays `background: #042E28` (dark green) as currently implemented.

8. **`z-index`:** keep `9999` so header overlays hero video and page banners.

9. **All other pages** (`/rentals`, `/contact`, etc.) already have a dark green (`#042E28`) banner behind the header area, so white text remains legible — no per-page logic needed.

### Acceptance Criteria

- [ ] Header background is transparent on home page (hero video visible behind it)
- [ ] Header background is transparent on all other pages
- [ ] Logo is centred horizontally
- [ ] Nav links are centred below the logo in a second row
- [ ] All nav link text is white
- [ ] "Volunteer" link renders as a white filled box with black text
- [ ] No scroll-triggered style changes
- [ ] Mobile hamburger lines are white
- [ ] TypeScript compiles clean
- [ ] Dev server returns 200 with no console errors

### Implementation Steps

1. Remove `scrolled` state and `useEffect` scroll listener from `Header.tsx`
2. Set `background: transparent` on the `<header>` element (remove `background: "#FFFFFF"` and `boxShadow`)
3. Change layout to two stacked rows (column flex or two separate divs), both centred
4. Move logo to its own centred row
5. Move nav to its own centred row below the logo
6. Update all nav link colours to `#FFFFFF`
7. Apply white-box style to the "Volunteer" link only
8. Update mobile hamburger bar colour from `#000` to `#FFFFFF`
9. Run `npx tsc --noEmit` and verify dev server

---

## Overview

Two parallel workstreams:

1. **Visual gap fixes** — the home page rebuild has 6 remaining differences vs the original site
2. **Missing pages** — only `/` exists; build `/rentals`, `/accommodation/[slug]`, `/contact`, `/volunteer`, `/terms-conditions`

Booking availability on property detail pages integrates with the **Hospitable Public API** (real-time calendar + pricing). The contact form is UI-only (no backend). All page content matches the live site at forrentbarbados.com.

---

## Part A — Visual Gap Fixes

### Gap 1 — Featured Properties: wrong cards + wrong card style

**Original behaviour:**
- Shows exactly 3 cards: Azzurro 03 3BED, Westmoreland Hill 35 4BED, Poinciana at the Crane
- Card style: image fills the full card square. At rest, only the image is visible. On hover, a dark blue overlay (`rgba(4,80,137,0.8)`) fades in and the title, guest stats, price, and "check availability" pill button slide up from below (opacity 0→1, translateY 8px→0)
- The "check availability" button is a pill (`border-radius:50px`), white border, white text, `padding:8px 22px`, `font-weight:600`
- Price is `font-size:28px`, white, shown inside the hover overlay
- Title is `font-size:28px`, uppercase, white, `font-weight:normal`
- Guest stats line: `font-size:14px`, white, `line-height:200%`
- Card border: `5px solid transparent` (gutter between cards)
- Section background: `linear-gradient(180deg, #FFFFFF 0%, #F6F6F6 100%)`, `padding:80px 0`

**Current rebuild:** 4 cards (wrong), text always visible below image, no hover overlay.

**Fix:**
1. In `data/properties.ts`: mark only `azzurro-03-3-bed`, `westmoreland-hill-35-4-bed`, `the-crane-resort` as `featured: true`. Remove `featured` from all others.
2. Rewrite `FeaturedProperties.tsx` to use the hover-overlay card pattern matching the original `th-port-*` CSS.

---

### Gap 2 — Concierge Services: no images, wrong layout

**Original behaviour:**
- No images — each service card is just a heading + paragraph text
- 3 columns × 2 rows, each column is a full-width Elementor column with `background-color` alternating `#F3F3F3` / `#FAFAFA`, `border:1px solid #9F9F9F`, `padding:50px`
- Service title: `Times New Roman`, `20px`, `font-weight:700`, `text-transform:capitalize`, `color:#363636`
- Service description: `Montserrat`, `12px`, `line-height:18px`, `text-align:center`, `color:#888`
- Section outer padding: `80px 0px 0px 0px` (no bottom padding — the cards themselves provide it)
- Section heading: `Times New Roman`, `3rem`, `font-weight:500`, `capitalize`, `color:#363636`
- Section subheading: `Times New Roman`, `1.25rem`, `font-weight:400`, `color:#363636`

**Current rebuild:** Shows L5-L8 images as icons. Remove images entirely.

---

### Gap 3 — Why Book With Us: wrong icons

**Original behaviour:**
- Uses `travelpack` icon font (already copied to `public/fonts/travelpack/`)
- Icon classes: `travelpack-airplane` (`\f10a`), `travelpack-camera` (`\f169`), `travelpack-compass` (`\f148`)
- Icon size: `33px`, white colour, inside a white circle (`background-color:#FFFFFF`, circle shape)
- Icon title: `Times New Roman`, `18px`, `font-weight:400`, white
- Icon description: `Montserrat`, `16px`, `line-height:26px`, white
- Column dividers: `border-right:1px solid #FFFFFF` on first two columns
- Section background: `#000000`, `padding:80px 0`

**Fix:** Add `@font-face` for travelpack in `globals.css`, use `<i className="travelpack travelpack-airplane">` etc. in `WhyBookWithUs.tsx`.

---

### Gap 4 — Testimonials: wrong background + slider layout

**Original behaviour:**
- Section background: white (no explicit background set — inherits page white)
- Section padding: `80px 0px 20px 0px`
- Inner content padding: `0px 100px` (desktop)
- Slider shows 3 items on desktop, 1 on tablet/mobile
- Each card: white bg, no explicit border, `padding:40px 10px 10px 10px`
- Reviewer name: `Times New Roman`, `18px`, `font-weight:600`, `color:#272727`
- Reviewer property: `Montserrat`, `12px`, `color:#272727`
- Review text: `Montserrat`, `14px`, `color:#383737`
- Star rating: `font-size:22px`, `color:#0000001F` (empty) / filled amber
- Airbnb logo image shown per card (already in `/assets/Airbnb-Logo-2014-scaled.png`)

**Current rebuild:** `#FAFAFA` background. Fix to white.

---

### Gap 5 — Footer: layout structure

**Original structure (3 bands):**

**Band 1 — Newsletter** (`background:#000000`, `padding:50px`):
- Left col: heading "Stay Updated on New" (`Times New Roman`, `48px`, `weight:400`, white) + "Homes & Exclusive Deals" (`Times New Roman`, `48px`, `weight:900`, italic, white) + subtitle (`Times New Roman`, `20px`, white)
- Right col: email input + subscribe button

**Band 2 — Tagline + Nav** (`background:#FFFFFF`, `border-top:1px solid #707070`, `padding:50px`):
- Left: "Inspired Stays. Lasting Moments." (`Times New Roman`, `30px`, `weight:500`, `uppercase`, `letter-spacing:5px`)
- Right: nav links as icon-list (`Montserrat`, `14px`, `uppercase`, `letter-spacing:1px`, `color:#FFFFFF` on black bg pills)

**Band 3 — Copyright** (`background:#FFFFFF`, `padding:10px 0`):
- "© 2025 For Rent Barbados. Terms of Service" (`Inter`, `12px`, `weight:700`, `uppercase`, `letter-spacing:1.2px`, `color:#000000`)

**Current rebuild:** Structure is approximately correct but nav links in Band 2 are styled as black pill buttons — this is correct per the original. Verify padding and font sizes match exactly.

---

### Gap 6 — Hero video: self-hosted on Supabase

**Problem:** The hero video (`FRB-HOMEPAGE-VIDEO-UPDATED.mp4`, 154MB) is currently loaded from `forrentbarbados.com` which may block cross-origin requests. It needs to be self-hosted.

**Supabase project:** `https://bkqnviewrnafvvkqkhej.supabase.co`  
**Credentials:** in `/workspaces/for-rent-barbados/.env` (`SUPABASE_URL`, `SUPABASE_SERVICE_KEY`)  
**Target bucket:** create a new public bucket `media` (or reuse `property-images`)

**Steps:**
1. Download video from `https://forrentbarbados.com/wp-content/uploads/2025/05/FRB-HOMEPAGE-VIDEO-UPDATED.mp4` to a temp file
2. Upload to Supabase Storage bucket `media` via the Storage REST API (`PUT /storage/v1/object/media/hero-video.mp4`)
3. Public URL will be: `https://bkqnviewrnafvvkqkhej.supabase.co/storage/v1/object/public/media/hero-video.mp4`
4. Update `HeroSection.tsx` to use this URL as the `<source src>` for the video
5. Keep `azzurro5-7-scaled.jpg` as the `poster` attribute and fallback image

**Note:** The upload is a one-time operation. The `.env` keys must not be committed to git. The public video URL is hardcoded in the component (no runtime env var needed for the video URL itself).

---

## Part B — Missing Pages

### B1 — `/rentals` — Listings Page

**Layout:**
- Page heading: "Availability Search" (`Times New Roman`, `3rem`, `weight:500`, `color:#363636`)
- Booking search bar at top (same 4-field form as hero: check-in, check-out, adults, children)
- Property grid below: all 22 listings as cards

**Search / filtering:**
- On submit, filter the grid by guest count (`adults + children ≤ property.guests`)
- Date filtering requires Hospitable API availability check (see B4). If API not yet configured, filter by guest count only and show a note that dates are indicative.
- URL params: `?checkIn=YYYY-MM-DD&checkOut=YYYY-MM-DD&adults=N&children=N`
- On page load, pre-fill form from URL params if present

**Property card** (matches original):
```
[Cover image — full width, aspect 4:3]
$XXX/night  (Times New Roman, 28px, weight:400)
[Property Name]  (Times New Roman, 20px, uppercase)
[N] guests · [N] bedroom · [N] bed · [N] bath  (Montserrat, 14px)
```
Card links to `/accommodation/[slug]`.

---

### B2 — `/accommodation/[slug]` — Property Detail Page

**Route:** `app/accommodation/[slug]/page.tsx` — statically generated from `data/properties.ts` slugs.

**Layout (matches live site):**

**Above fold:**
- Full-width photo gallery: first 4–6 images shown in a grid; "View all X photos" button opens a lightbox/modal showing all images
- `<h1>` property name
- Location line (e.g. "Porters, St. James")
- Quick stats: `[N] guests · [N] bedroom · [N] bathroom`

**Body — two-column desktop, stacked mobile:**

Left column (main content):
- Long-form description (from `property.description` — render as paragraphs split on `\n\n`)
- Welcome pack callout box if `property.welcomePack` is set (amber/gold accent border)
- Seasonal pricing table:
  | Season | Dates | Price/night |
  |---|---|---|
  | Summer | Apr 15 – Dec 15 | $438 |
  | Winter | Dec 15–20 & Jan 10 – Apr 15 | $550 |
  | Christmas | Dec 20 – Jan 10 | $850 |
- Property reviews section (same card style as home page Testimonials)

Right column (sticky booking widget):
- Heading: "Starting from $[min price]/night" / "Enter dates for seasonal pricing"
- Fields: Check-in Date, Check-out Date, Adults (1–[property.guests] select)
- CTA button: "Reserve" — on click, opens Hospitable booking flow (see B4)
- Availability note below button

**Below fold:**
- Testimonials section (shared component, filtered to this property's reviews)
- Footer

**Data:** All content comes from `data/properties.ts`. The live site has richer descriptions for some properties (Coral Beach 105, Mullins Reef, Poinciana, WMH35) — update `data/properties.ts` with the full descriptions scraped from the live site (see Data Updates section below).

---

### B3 — `/contact` — Contact Page

**Layout (two-column desktop, stacked mobile):**

Left — Contact form (UI only, no backend):
- Fields: First Name, Email, Subject, Message (textarea)
- Honeypot: `<input type="text" name="_gotcha" style="display:none" />`
- Submit button: "Send Message" (Poppins, uppercase, letter-spacing 4.2px)
- On submit: show inline success message "Thank you! We'll be in touch soon."

Right — Business info:
- **Business Hours (AST / UTC−4):**
  Monday to Saturday: 9:00 AM – 5:00 PM
  Sunday: Closed
- **Email:** holiday@forrentbarbados.com
- **Phone:** +1 (246) 247-2229

**Styling:** Section padding `80px 0`, heading `Times New Roman 3rem weight:500`.

---

### B4 — Hospitable API Integration

**What Hospitable provides:**
- Public API at `https://api.hospitable.com/v1/` (OAuth2 Bearer token)
- Endpoints needed:
  - `GET /properties` — list all properties (to map Hospitable property IDs to our slugs)
  - `GET /properties/{id}/availability?start_date=&end_date=` — returns blocked/available dates
  - `GET /properties/{id}/pricing?start_date=&end_date=` — returns nightly rates for date range
  - Direct booking widget / booking URL per property

**Integration approach:**
- Store `HOSPITABLE_API_TOKEN` in `.env.local` (never committed)
- Create a Next.js Route Handler `app/api/availability/route.ts`:
  - Accepts `?propertySlug=&checkIn=&checkOut=`
  - Maps slug → Hospitable property ID (via a static mapping in `lib/hospitable.ts`)
  - Calls Hospitable availability endpoint server-side (token never exposed to client)
  - Returns `{ available: boolean, blockedDates: string[] }`
- Create `app/api/pricing/route.ts`:
  - Accepts `?propertySlug=&checkIn=&checkOut=`
  - Returns `{ totalPrice: number, nightlyRate: number, nights: number }`
- The booking widget on property detail pages calls these routes client-side when dates are selected
- "Reserve" button links to the Hospitable direct booking URL for that property (format: `https://direct.hospitable.com/property/{hospitable_id}?checkIn=&checkOut=&guests=`)

**Slug → Hospitable ID mapping:**
- Stored in `lib/hospitable.ts` as a static object `PROPERTY_MAP: Record<string, string>`
- IDs will be populated once the API token is available; for now the map is empty and the widget falls back to showing static seasonal pricing from `data/properties.ts`

**Graceful degradation:**
- If `HOSPITABLE_API_TOKEN` is not set, skip API calls and show static pricing only
- Availability check failure shows "Contact us to check availability" with a mailto link

---

### B5 — `/volunteer` — Volunteer Page

**Content (from live site):**

Page heading: "Support Local Causes During Your Stay"
Subheading: "Volunteer in Barbados"

Intro paragraph:
> "Barbados is more than just sun, sand, and sea—it's a vibrant community full of opportunities to make a meaningful impact. At ForRentBarbados.com, we encourage visitors to give back while enjoying everything the island has to offer."

**Organisation 1 — Slow Food Barbados:**
- Heading: "Support Community Wellness with Slow Food Barbados"
- Body: "Slow Food Barbados runs the Slow Soup Drive, a powerful initiative that provides nutritious meals to the island's most vulnerable groups—single parents, the elderly, people with disabilities, and low-income families."
- Bullet points:
  - Prepare and distribute healthy, local meals
  - Support local farmers, chefs, and food producers
  - Strengthen Barbados' sustainable food systems
- Note: "This program operates across multiple parishes, creating real, lasting impact every week."
- Image: `/assets/concierge/L5.png` (or closest available local asset — the live site uses `slowfoodbarbados.avif` which is not in our assets)
- CTA: "Learn More & Donate" (external link — URL TBD, use `#` placeholder)

**Organisation 2 — Ocean Acres Animal Sanctuary:**
- Heading: "Help Animals in Need at Ocean Acres Animal Sanctuary"
- Body: "Ocean Acres is a safe haven for over 200 rescued dogs and cats. Their team works tirelessly to rescue, rehabilitate, and rehome animals, while also running essential programs like spay/neuter clinics and community outreach."
- Bullet points:
  - Volunteer with feeding, walking, or caring for animals
  - Become a travel buddy to help rehome pets abroad
  - Donate to support shelter operations and medical care
- Image: `/assets/concierge/L6.png` (placeholder — live site uses `ocean-acres.webp`)
- CTA: "Support Animal Welfare" (external link — URL TBD, use `#` placeholder)

**Layout:** Two full-width cards stacked vertically, each with image left + text right (desktop), stacked (mobile). Section padding `80px 0`.

---

### B6 — `/terms-conditions` — Terms Page

**Content (from live site, verbatim):**

Effective Date: March 1, 2025
Company: For Rent Barbados | Inspired Real Estate Ltd.

Sections:
1. Booking & Payment Policy — 50% non-refundable deposit within 7 days; balance 60 days prior (90 days for Christmas/NY); full payment if booking within 60 days
2. Cancellation & Refund Policy — >60 days: refund minus deposit; <60 days: no refund; Holiday season: all non-refundable
3. Security & Damage Protection — US$750 security hold; guests liable for excess damage, lost keys, cleaning charges
4. Client Responsibilities — max 2 guests/bedroom; no events/parties; no smoking indoors; check-in 3pm / check-out 11am
5. Liability & Disclaimers — use at own risk; not liable for injuries, theft, service outages
6. Property Access & Owner Responsibilities — no entry without permission except emergencies; linen and cutlery provided
7. Double Bookings — alternate property offered or full refund
8. Indemnity — hold harmless Inspired Real Estate Ltd. | Barnard Realty Inc.
9. Governing Law — laws of Barbados; contact holiday@forrentbarbados.com / +1 (246) 247-2229

**Layout:** Single-column prose, `max-width: 800px`, centered. Section heading `Times New Roman 3rem`. Body `Montserrat 14px line-height:1.8`. Section padding `80px 0`.

---

## Data Updates Required

Update `data/properties.ts` with richer descriptions scraped from the live site:

| Slug | Update needed |
|---|---|
| `westmoreland-hill-35-4-bed` | Full description + correct winter pricing ($1,000/night, Christmas $1,890/night) |
| `coral-beach-105` | Full description + welcome pack details + winter/Christmas pricing ($275/$490) + Google reviews |
| `the-crane-resort` | Full description (Poinciana) |
| `mullins-reef-3-bed` | Full description |

Also add missing reviews to `data/properties.ts`:
- Westmoreland Hill 35: Al (May 2025), Joe (March 2025)
- Coral Beach 105: Juliet Johnson, Anuj, Justin Palmer, Tracey Fletcher, Aj Johnson, Margaret, Elenaz

---

## Acceptance Criteria

**Part A — Visual fixes:**
- [ ] Featured Properties shows exactly 3 cards: Azzurro 03 3BED, WMH35 4BED, Poinciana at the Crane
- [ ] Property cards show image-only at rest; hover reveals dark blue overlay with title/price/CTA
- [ ] Concierge section has no images — heading + text only per card
- [ ] Why Book icons use travelpack font (airplane, camera, compass) in white circles
- [ ] Testimonials section background is white
- [ ] Footer bands match original padding/typography exactly
- [ ] Hero video plays from Supabase Storage URL

**Part B — Missing pages:**
- [ ] `/rentals` renders all 22 property cards; filters by guest count from URL params
- [ ] `/accommodation/[slug]` renders for all 22 slugs with gallery, description, pricing table, reviews, booking widget
- [ ] Booking widget calls Hospitable API when token is set; falls back to static pricing when not
- [ ] "Reserve" button links to Hospitable direct booking URL
- [ ] `/contact` renders form + business info; shows success message on submit
- [ ] `/volunteer` renders both organisations with correct content
- [ ] `/terms-conditions` renders all 9 sections verbatim
- [ ] All pages include Header and Footer
- [ ] TypeScript compiles clean (`npx tsc --noEmit`)
- [ ] Dev server returns 200 on all routes with no console errors

---

## Implementation Steps

### Part A — Visual fixes
1. Verify `data/properties.ts` has `featured: true` only on `azzurro-03-3-bed`, `westmoreland-hill-35-4-bed`, `the-crane-resort` ✓ (already correct)
2. Verify `HeroSection.tsx` uses Supabase video URL and `azzurro5-7-scaled.jpg` as poster ✓ (already correct)
3. Verify `globals.css` has travelpack `@font-face` ✓ (already correct)
4. Verify `FeaturedProperties.tsx` hover-overlay card pattern ✓ (already correct)
5. Verify `ConciergeServices.tsx` has no images ✓ (already correct)
6. Audit `WhyBookWithUs.tsx` — confirm travelpack icons render (font may not be loading)
7. Confirm `Testimonials.tsx` background is `#FFFFFF` ✓ (already correct)
8. Audit `Footer.tsx` padding/font sizes against spec

### Part B — Missing pages
9. Create `lib/hospitable.ts` — API client + slug→ID map + graceful degradation helper
10. Create `app/api/availability/route.ts` — server-side Hospitable availability proxy
11. Create `app/api/pricing/route.ts` — server-side Hospitable pricing proxy
12. Update `data/properties.ts` — richer descriptions, corrected pricing, additional reviews
13. Create `app/rentals/page.tsx` — listings grid with search/filter
14. Create `app/accommodation/[slug]/page.tsx` — property detail with gallery, booking widget
15. Create `components/property/PropertyGallery.tsx` — image grid + lightbox modal
16. Create `components/property/BookingWidget.tsx` — date picker + Hospitable API integration
17. Create `app/contact/page.tsx` — contact form (UI only) + business info
18. Create `app/volunteer/page.tsx` — two organisation cards
19. Create `app/terms-conditions/page.tsx` — legal content
20. Run `npx tsc --noEmit` and fix any type errors
21. Verify dev server returns 200 on all routes
