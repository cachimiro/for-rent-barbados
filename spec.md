# Fix: Remaining Visual Gaps vs Original Site

## Problem

The rebuild is close but has several remaining differences from the original forrentbarbados.com. All gaps have been identified by diffing the original Elementor CSS/HTML against the current component output.

---

## Gap 1 — Featured Properties: wrong cards + wrong card style

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

## Gap 2 — Concierge Services: no images, wrong layout

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

## Gap 3 — Why Book With Us: wrong icons

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

## Gap 4 — Testimonials: wrong background + slider layout

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

## Gap 5 — Footer: layout structure

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

## Gap 6 — Hero video: self-hosted on Supabase

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

## Acceptance Criteria

- [ ] Featured Properties shows exactly 3 cards: Azzurro 03 3BED, WMH35 4BED, Poinciana at the Crane
- [ ] Property cards show image-only at rest; hover reveals dark overlay with title/price/CTA
- [ ] Concierge section has no images — heading + text only per card
- [ ] Why Book icons use travelpack font (airplane, camera, compass) in white circles
- [ ] Testimonials section background is white
- [ ] Footer bands match original padding/typography exactly
- [ ] Hero video plays from Supabase Storage URL (not forrentbarbados.com)
- [ ] `azzurro5-7-scaled.jpg` used as video `poster` and image fallback
- [ ] TypeScript compiles clean (`npx tsc --noEmit`)
- [ ] Dev server returns 200 with no errors in logs

---

## Implementation Steps

1. Download hero video from live site → upload to Supabase Storage bucket `media` via REST API
2. Fix `data/properties.ts` — set `featured: true` only on `azzurro-03-3-bed`, `westmoreland-hill-35-4-bed`, `the-crane-resort`
3. Update `HeroSection.tsx` — use Supabase video URL, `azzurro5-7-scaled.jpg` as poster/fallback
4. Add travelpack `@font-face` to `globals.css`
5. Rewrite `FeaturedProperties.tsx` — hover-overlay card pattern
6. Rewrite `ConciergeServices.tsx` — remove images, heading+text only
7. Rewrite `WhyBookWithUs.tsx` — travelpack icon font
8. Fix `Testimonials.tsx` — white background, correct typography
9. Verify `Footer.tsx` padding/font sizes match spec above
10. Run `npx tsc --noEmit` and confirm dev server is clean
