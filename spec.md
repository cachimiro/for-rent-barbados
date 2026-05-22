# Spec: Push Everything to Git

## Problem Statement

The repository has no commits yet. All files are untracked. The goal is to make an initial commit of everything (site files, devcontainer config, spec.md) and push to `origin/main` on GitHub (`https://github.com/cachimiro/for-rent-barbados.git`), excluding the HTTrack internal cache directory (`hts-cache/`).

## Requirements

- Create a `.gitignore` that excludes `For Rent Barbados Clone/hts-cache/`
- Stage all remaining files
- Commit with message `Initial commit`
- Push to `origin main`

## Acceptance Criteria

- [ ] `.gitignore` excludes `hts-cache/`
- [ ] `git log` shows one commit on `main`
- [ ] GitHub remote reflects the commit

## Implementation Steps

1. Create `.gitignore` excluding `For Rent Barbados Clone/hts-cache/`
2. `git add .`
3. `git commit -m "Initial commit"`
4. `git push -u origin main`

---

# Spec: Serve Site Directly — Eliminate HTTrack Index Page

## Problem Statement

When the preview URL is opened, the HTTrack Website Copier index page still appears. The current setup serves from `For Rent Barbados Clone/` and uses a meta-refresh redirect in the root `index.html` to forward to `forrentbarbados.com/index.html`. The redirect causes a visible intermediate page (blank or HTTrack-branded) before the actual site loads.

The root cause is the server's working directory. The fix is to serve directly from `For Rent Barbados Clone/forrentbarbados.com/` so the site's `index.html` is the root — no redirect needed at all.

## Why This Works Without HTML Changes

All asset and navigation paths in the HTML files are already relative to their own location within `forrentbarbados.com/`:
- `forrentbarbados.com/index.html` uses `wp-content/...`, `wp-includes/...` — still correct
- `forrentbarbados.com/accommodation/X/index.html` uses `../../wp-content/...` — still resolves correctly

## Requirements

- Stop the current Python server (serving from `For Rent Barbados Clone/`)
- Restart it serving from `For Rent Barbados Clone/forrentbarbados.com/` on the same port (8080)
- The preview URL root (`/`) must load the For Rent Barbados home page directly

## Acceptance Criteria

- [ ] Opening the preview URL loads the For Rent Barbados home page immediately — no intermediate page
- [ ] All pages still load correctly (home, accommodation listings, contact, availability search)
- [ ] All assets (CSS, JS, images) still load correctly

## Implementation Steps

1. Kill the running Python http.server process
2. Restart `python3 -m http.server 8080` from `For Rent Barbados Clone/forrentbarbados.com/`
3. Verify root URL returns the actual site home page (not a redirect page)

---

# Spec: Fix index.html — Remove HTTrack Wrapper Document

## Problem Statement

The HTTrack update run replaced `forrentbarbados.com/index.html` with a **wrapper document** that embeds the original page content inside it. The file now contains two complete HTML documents:

- **Outer document (lines 1–352):** HTTrack-generated shell with a `<head>` containing CSS/JS links and a `<body>` that wraps everything in `<div class="wrap"><div class="content">`. The outer `<body>` is missing the `elementor-template-full-width` class.
- **Inner document (lines 353–2550):** The real WordPress/Elementor page with the correct `<body>` classes and all page content — but its `<head>` has **no stylesheet links** (they were moved to the outer head).

The browser renders the outer body structure (extra wrapper divs, wrong body classes) with the inner content embedded inside it. Elementor's CSS selectors don't match correctly, resulting in a completely unstyled page.

Only `index.html` is affected. All other pages (accommodation listings, contact, etc.) are clean single-document HTML files.

## Requirements

- Replace `forrentbarbados.com/index.html` with a clean copy fetched from the live site (`https://forrentbarbados.com/`)
- Re-apply the same URL rewrites that were applied to all other pages:
  - Rewrite absolute `https://forrentbarbados.com/` `href=`/`src=` asset URLs to relative local paths
  - Rewrite navigation `href=` links to relative local paths
- The resulting file must be a single valid HTML document with correct body classes and all CSS/JS links intact

## Acceptance Criteria

- [ ] `index.html` contains exactly one `<!DOCTYPE html>` declaration
- [ ] `index.html` `<body>` tag includes `elementor-template-full-width` class
- [ ] No `<div class="wrap">` or `<div class="content">` wrapper from HTTrack
- [ ] All stylesheet `href=` links are relative local paths (no `https://forrentbarbados.com/`)
- [ ] Home page loads with full Elementor styling and layout matching the live site

## Implementation Steps

1. **Fetch** a clean `index.html` from `https://forrentbarbados.com/` using `wget` or `curl`, saving over the existing file
2. **Re-run the URL rewrite script** (`rewrite_urls.py`) on just this one file to convert absolute URLs to relative local paths
3. **Verify** — confirm single doctype, correct body classes, no absolute asset URLs remain
4. **Smoke-test** — home page loads with full styling via the preview server

---

# Spec: Fix CSS url() References — Restore Visual Style

## Problem Statement

The site's visual style is broken because 26 CSS files contain absolute `url(https://forrentbarbados.com/...)` references that were not rewritten by the previous HTML fix. These CSS files load from the local server but their internal `url()` references still point to the live site for:

- **Background images** — Elementor page CSS files (`wp-content/uploads/elementor/css/post-*.css`) reference hero images and section backgrounds via absolute URLs
- **Font files** — Google Fonts CSS files (`wp-content/uploads/elementor/google-fonts/css/*.css`) reference `.woff2` font files via absolute URLs

All referenced files exist locally — the fonts (125 `.woff2` files) and images are already on disk. Two images (`banner.jpg`, `1.avif`) are missing and need downloading.

## Scope

- **26 CSS files** with absolute `url(https://forrentbarbados.com/...)` references
- **~129 unique absolute url() references** across those files
- **2 missing image files** (`wp-content/uploads/2025/04/banner.jpg`, `wp-content/uploads/2025/06/1.avif`)

## Requirements

### R1 — Rewrite url() in CSS files
- Replace every `url("https://forrentbarbados.com/wp-content/...")` and `url(https://forrentbarbados.com/wp-content/...)` in all 26 CSS files with a relative path
- The relative path must be computed from the CSS file's own directory to the target file
- Example: `wp-content/uploads/elementor/css/post-117.css` referencing `wp-content/uploads/2025/05/image.jpg` → `../../2025/05/image.jpg`
- Example: `wp-content/uploads/elementor/google-fonts/css/inter.css` referencing `wp-content/uploads/elementor/google-fonts/fonts/inter-*.woff2` → `../fonts/inter-*.woff2`

### R2 — Download 2 missing images
- Fetch `https://forrentbarbados.com/wp-content/uploads/2025/04/banner.jpg` → save locally
- Fetch `https://forrentbarbados.com/wp-content/uploads/2025/06/1.avif` → save locally

## Acceptance Criteria

- [ ] Zero `url(https://forrentbarbados.com/...)` references remain in any CSS file
- [ ] Both missing images are present on disk
- [ ] Home page loads with correct hero/background images and correct fonts (Poppins, Inter, etc.)
- [ ] Accommodation listing pages load with correct section background images
- [ ] Visual appearance matches the original `forrentbarbados.com` site

## Implementation Steps

1. **Download 2 missing images** using `wget`
2. **Write a Python script** to rewrite `url()` references in all 26 CSS files — compute correct relative paths from each CSS file's directory to the target asset
3. **Run the script** across all CSS files under `wp-content/`
4. **Verify** — confirm zero absolute `forrentbarbados.com` references remain in any CSS file
5. **Smoke-test** — check home page and one accommodation page load with correct background images and fonts

---

# Spec: Fix All Broken Connections in the For Rent Barbados Static Mirror

## Problem Statement

The static HTML mirror of `forrentbarbados.com` has three categories of broken connections that prevent it from working fully as a self-contained local site:

1. **Navigation links point to the live site** — all `<a href="https://forrentbarbados.com/...">` links send users to the live website instead of staying local
2. **CSS/JS assets load from the live site** — 118 stylesheet and script references use absolute `https://forrentbarbados.com/wp-content/...` URLs, but the files exist locally under hashed filenames (e.g. `frontend.min.js` → `frontend.minfb3d.js`). The HTML never references the local copies.
3. **173 asset files are missing entirely** — property images, plugin CSS/JS, and theme files that were not downloaded by HTTrack and have no local equivalent

The server is already running. The live site (`https://forrentbarbados.com`) is accessible and all missing files can be fetched from it.

## Scope

- **31 HTML files** contain absolute `https://forrentbarbados.com/` references
- **42 unique navigation URLs** point to the live site instead of local pages
- **118 asset URLs** reference local files via absolute URL but the local file has a hashed name
- **173 asset files** are completely absent locally

## Requirements

### R1 — Download the 173 missing assets
- Use `wget` to fetch each missing file from `https://forrentbarbados.com/<path>` and save it to the correct local path under `forrentbarbados.com/`
- All 173 files must be present on disk after this step

### R2 — Rewrite absolute asset URLs to local relative paths
- For each of the 118 absolute `https://forrentbarbados.com/wp-content/...` or `https://forrentbarbados.com/wp-includes/...` asset references in HTML files, replace the absolute URL with a relative path pointing to the local hashed file
- The relative path must be correct from each HTML file's directory (e.g. from `accommodation/X/index.html` the path to `wp-content/` is `../../wp-content/`)
- Use a script to automate this across all 31 affected HTML files

### R3 — Rewrite absolute navigation links to local relative paths
- For each `href="https://forrentbarbados.com/<page>/"` navigation link, replace with a relative path to the local `index.html` for that page
- Example: `https://forrentbarbados.com/contact-us/` → `../../contact-us/index.html` (depth-aware)
- Trailing-slash URLs map to `<slug>/index.html`; root `/` maps to `index.html`

### R4 — Verify all connections
- Re-run the asset audit: 0 missing files, 0 absolute `forrentbarbados.com` references remaining in HTML
- Smoke-test: home page, one accommodation page, contact page all load with full styling and images via the preview server

## Acceptance Criteria

- [ ] All 173 missing assets downloaded and present on disk
- [ ] All 118 absolute asset URLs rewritten to relative local paths in all 31 HTML files
- [ ] All 42 navigation link patterns rewritten to relative local paths
- [ ] Zero `https://forrentbarbados.com/` references remain in any HTML file (except inside inline JS/JSON data blobs that don't affect page rendering)
- [ ] Home page loads with full styling (CSS applied, logo visible, images visible)
- [ ] Clicking a navigation link (e.g. "Accommodation") stays on the local preview — does not redirect to the live site
- [ ] At least one accommodation listing page loads with property images

## Implementation Steps

1. **Generate missing-asset list** — extract all 173 missing file paths from the audit into a text file
2. **Download missing assets** — run `wget` in batch mode against the live site for each missing file, saving to the correct local path
3. **Build URL rewrite map** — for each absolute asset URL in the HTML files, determine the correct relative path to the local (possibly hashed) file
4. **Rewrite asset URLs in HTML** — apply sed/Python substitutions across all 31 HTML files to replace absolute asset URLs with relative local paths
5. **Rewrite navigation links in HTML** — replace all `href="https://forrentbarbados.com/<slug>/"` patterns with depth-correct relative paths to local `index.html` files
6. **Verify** — re-run the audit script to confirm 0 remaining absolute references and 0 missing files
7. **Smoke-test** — curl-check home, contact, and one accommodation page; confirm CSS and images load (HTTP 200)
