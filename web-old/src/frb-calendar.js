/**
 * FRB Availability Calendar Widget — v2
 * Replaces the empty MPHB calendar div on static DO-hosted property pages.
 * Syncs selected dates into MPHB hidden inputs so the booking form works.
 */
(function () {
  "use strict";

  const SUPABASE_URL = "https://bkqnviewrnafvvkqkhej.supabase.co";

  /* ── Extract property slug from URL path ────────────────────────────────── */
  function getPropertySlug() {
    const m = window.location.pathname.match(/\/accommodation\/([^/]+)/);
    return m ? m[1] : null;
  }

  /* ── Date helpers ──────────────────────────────────────────────────────── */
  const TODAY = new Date();
  TODAY.setHours(0, 0, 0, 0);

  function toISO(d)   { return d.toISOString().slice(0, 10); }
  function parseDate(s) { const [y,m,d] = s.split("-").map(Number); return new Date(y,m-1,d); }
  function addMonths(year, month, delta) {
    let m = month + delta, y = year;
    while (m > 12) { m -= 12; y++; }
    while (m < 1)  { m += 12; y--; }
    return [y, m];
  }
  function daysInMonth(y, m) { return new Date(y, m, 0).getDate(); }
  function startOffset(y, m) { return (new Date(y, m-1, 1).getDay() + 6) % 7; } // Mon=0
  function fmtDate(y, m, d)  { return `${y}-${String(m).padStart(2,"0")}-${String(d).padStart(2,"0")}`; }
  function toDDMMYYYY(iso)   { if (!iso) return ""; const [y,m,d] = iso.split("-"); return `${d}/${m}/${y}`; }

  const MONTHS = ["January","February","March","April","May","June",
                  "July","August","September","October","November","December"];
  const DAYS   = ["Mo","Tu","We","Th","Fr","Sa","Su"];

  /* ── State ─────────────────────────────────────────────────────────────── */
  let calData   = {};
  let loading   = false;
  let checkIn   = "";
  let checkOut  = "";
  let hoverDate = "";
  let viewYear  = TODAY.getFullYear();
  let viewMonth = TODAY.getMonth() + 1;
  let mountEl   = null; // the mphb-calendar div we take over

  /* ── Fetch calendar data ────────────────────────────────────────────────── */
  async function fetchCalendar(slug, year, month) {
    loading = true; render();
    try {
      const r = await fetch(
        `${SUPABASE_URL}/functions/v1/calendar?propertySlug=${encodeURIComponent(slug)}&year=${year}&month=${month}`
      );
      if (!r.ok) throw new Error("fetch failed");
      const json = await r.json();
      if (json.days) {
        for (const day of json.days) calData[day.date] = day;
      }
    } catch (_) { /* silent fallback */ }
    loading = false; render();
  }

  /* ── Sync selected dates into MPHB form inputs ──────────────────────────── */
  function syncToForm() {
    // MPHB uses a visible text input (display) + a hidden input (actual value)
    // We set both.
    const ciDisplay = document.querySelector('input[id^="mphb_check_in_date-"]:not([type="hidden"])');
    const ciHidden  = document.querySelector('input[id^="mphb_check_in_date-"][type="hidden"], input[name="mphb_check_in_date"]');
    const coDisplay = document.querySelector('input[id^="mphb_check_out_date-"]:not([type="hidden"])');
    const coHidden  = document.querySelector('input[id^="mphb_check_out_date-"][type="hidden"], input[name="mphb_check_out_date"]');

    if (ciDisplay) ciDisplay.value = toDDMMYYYY(checkIn);
    if (ciHidden)  ciHidden.value  = toDDMMYYYY(checkIn);
    if (coDisplay) coDisplay.value = toDDMMYYYY(checkOut);
    if (coHidden)  coHidden.value  = toDDMMYYYY(checkOut);

    // Also update the "Starting from" heading if dates are set
    if (checkIn && checkOut) {
      const nights = Math.round((parseDate(checkOut) - parseDate(checkIn)) / 86400000);
      const heading = document.querySelector('.elementor-widget-heading h2, h2.elementor-heading-title');
      if (heading && nights > 0) {
        // Try to get live price from Supabase pricing function
        const slug = getPropertySlug();
        if (slug) {
          fetch(`${SUPABASE_URL}/functions/v1/pricing?propertySlug=${encodeURIComponent(slug)}&checkIn=${checkIn}&checkOut=${checkOut}`)
            .then(r => r.json())
            .then(data => {
              if (data && data.totalPrice) {
                const total = (data.totalPrice * 1.175).toFixed(0); // +17.5% tax
                heading.innerHTML = `$${Number(total).toLocaleString()} total · ${nights} night${nights>1?'s':''}`;
              }
            })
            .catch(() => {});
        }
      }
    }
  }

  /* ── Click handler ─────────────────────────────────────────────────────── */
  function handleDayClick(dateStr) {
    const todayStr = toISO(TODAY);
    if (dateStr < todayStr) return;
    const day = calData[dateStr];
    if (day && !day.available) return;

    if (!checkIn || (checkIn && checkOut)) {
      checkIn = dateStr; checkOut = "";
    } else {
      if (dateStr <= checkIn) {
        checkIn = dateStr; checkOut = "";
      } else {
        // Check no blocked dates in range
        let blocked = false;
        const cursor = parseDate(checkIn);
        cursor.setDate(cursor.getDate() + 1);
        const end = parseDate(dateStr);
        while (cursor < end) {
          const d = toISO(cursor);
          if (calData[d] && !calData[d].available) { blocked = true; break; }
          cursor.setDate(cursor.getDate() + 1);
        }
        if (blocked) { checkIn = dateStr; checkOut = ""; }
        else { checkOut = dateStr; syncToForm(); }
      }
    }
    render();
  }

  /* ── Render one month ──────────────────────────────────────────────────── */
  function renderMonth(y, m) {
    const offset   = startOffset(y, m);
    const total    = daysInMonth(y, m);
    const todayStr = toISO(TODAY);

    let html = `<div style="flex:1;min-width:0;box-sizing:border-box">
      <p style="font-family:Montserrat,sans-serif;font-size:11px;font-weight:700;
                text-transform:uppercase;letter-spacing:1.5px;color:#363636;
                text-align:center;margin:0 0 12px 0">${MONTHS[m-1]} ${y}</p>
      <div style="display:grid;grid-template-columns:repeat(7,1fr);margin-bottom:6px">`;

    DAYS.forEach(d => {
      html += `<div style="font-family:Montserrat,sans-serif;font-size:9px;color:#aaa;
                           text-align:center;padding-bottom:4px;font-weight:600;
                           letter-spacing:0.5px">${d}</div>`;
    });
    html += `</div><div style="display:grid;grid-template-columns:repeat(7,1fr);gap:1px">`;

    for (let i = 0; i < offset; i++) html += `<div></div>`;

    for (let d = 1; d <= total; d++) {
      const dateStr  = fmtDate(y, m, d);
      const dayData  = calData[dateStr];
      const past     = dateStr < todayStr;
      const blocked  = dayData && !dayData.available;
      const selected = dateStr === checkIn || dateStr === checkOut;
      const end      = checkOut || hoverDate;
      const inRange  = checkIn && end && dateStr > (checkIn < end ? checkIn : end) && dateStr < (checkIn < end ? end : checkIn);
      const isHover  = checkIn && !checkOut && hoverDate === dateStr && dateStr > checkIn;
      const isToday  = dateStr === todayStr;

      let bg = "transparent", color = "#363636", cursor = "pointer", opacity = 1;

      if (past)          { color = "#ccc"; cursor = "default"; opacity = 0.45; }
      else if (selected) { bg = "#042E28"; color = "#fff"; }
      else if (isHover)  { bg = "rgba(4,46,40,0.25)"; color = "#042E28"; }
      else if (inRange)  { bg = "rgba(4,46,40,0.1)";  color = "#042E28"; }
      else if (blocked)  { bg = "#2a2a2a"; color = "#fff"; cursor = "default"; }

      const outline = (isToday && !selected) ? "1px solid #042E28" : "none";
      const price   = (dayData && dayData.available && !past && dayData.priceFormatted)
        ? `<span style="font-size:8px;display:block;margin-top:1px;line-height:1;
                        color:${selected ? "rgba(255,255,255,0.75)" : inRange ? "#042E28" : "#999"}">
             ${dayData.priceFormatted.replace(".00","").replace("$","")}
           </span>` : "";

      html += `<div
        data-date="${dateStr}"
        style="display:flex;flex-direction:column;align-items:center;justify-content:center;
               padding:5px 1px;background:${bg};color:${color};cursor:${cursor};opacity:${opacity};
               border-radius:2px;outline:${outline};transition:background 0.1s;
               user-select:none;min-height:34px"
        ${!past && !blocked ? `onmouseenter="window._frbCal.hover('${dateStr}')" onmouseleave="window._frbCal.unhover()"` : ""}
        ${!past ? `onclick="window._frbCal.click('${dateStr}')"` : ""}
      >
        <span style="font-family:Montserrat,sans-serif;font-size:12px;
                     font-weight:${selected?700:400};line-height:1">${d}</span>
        ${price}
      </div>`;
    }

    return html + `</div></div>`;
  }

  /* ── Main render ────────────────────────────────────────────────────────── */
  function render() {
    if (!mountEl) return;

    const [ny, nm]   = addMonths(viewYear, viewMonth, 1);
    const todayY     = TODAY.getFullYear(), todayM = TODAY.getMonth() + 1;
    const canPrev    = !(viewYear === todayY && viewMonth === todayM);
    const todayStr   = toISO(TODAY);

    const selLabel = checkIn && checkOut
      ? `${toDDMMYYYY(checkIn)} → ${toDDMMYYYY(checkOut)}  ·  ${Math.round((parseDate(checkOut)-parseDate(checkIn))/86400000)} nights`
      : checkIn
      ? `${toDDMMYYYY(checkIn)} → select check-out`
      : "";

    mountEl.innerHTML = `
    <div style="font-family:Montserrat,sans-serif;padding:0">
      <!-- Nav row -->
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
        <button onclick="window._frbCal.prev()"
          style="background:none;border:none;cursor:${canPrev?"pointer":"default"};
                 font-size:22px;color:${canPrev?"#363636":"#ddd"};padding:2px 10px;
                 line-height:1;font-weight:300" ${canPrev?"":"disabled"} aria-label="Previous month">‹</button>
        <span style="font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#888">
          ${loading ? "Loading…" : "Select Dates"}
        </span>
        <button onclick="window._frbCal.next()"
          style="background:none;border:none;cursor:pointer;font-size:22px;
                 color:#363636;padding:2px 10px;line-height:1;font-weight:300"
          aria-label="Next month">›</button>
      </div>

      <!-- Two-month grid -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
        ${renderMonth(viewYear, viewMonth)}
        ${renderMonth(ny, nm)}
      </div>

      <!-- Selection summary -->
      ${selLabel ? `
      <div style="display:flex;justify-content:space-between;align-items:center;
                  margin-top:14px;padding-top:12px;border-top:1px solid #EAEAEA">
        <span style="font-size:12px;color:#363636;font-weight:500">${selLabel}</span>
        <button onclick="window._frbCal.clear()"
          style="background:none;border:none;cursor:pointer;font-size:11px;
                 text-transform:uppercase;letter-spacing:1px;color:#c0392b;padding:0">
          Clear
        </button>
      </div>` : ""}

      <!-- Legend -->
      <div style="display:flex;gap:16px;margin-top:12px;flex-wrap:wrap">
        ${[["#2a2a2a","Unavailable"],["#042E28","Selected"],["rgba(4,46,40,0.1)","In range"]]
          .map(([c,l])=>`<div style="display:flex;align-items:center;gap:5px">
            <div style="width:11px;height:11px;background:${c};border:1px solid #ddd;
                        border-radius:2px;flex-shrink:0"></div>
            <span style="font-size:10px;color:#888">${l}</span>
          </div>`).join("")}
      </div>
    </div>`;
  }

  /* ── Public API ─────────────────────────────────────────────────────────── */
  window._frbCal = {
    click(d)  { handleDayClick(d); },
    hover(d)  { hoverDate = d; render(); },
    unhover() { hoverDate = ""; render(); },
    prev() {
      const todayY = TODAY.getFullYear(), todayM = TODAY.getMonth() + 1;
      if (viewYear === todayY && viewMonth === todayM) return;
      [viewYear, viewMonth] = addMonths(viewYear, viewMonth, -1);
      fetchCalendar(getPropertySlug(), viewYear, viewMonth);
    },
    next() {
      [viewYear, viewMonth] = addMonths(viewYear, viewMonth, 1);
      fetchCalendar(getPropertySlug(), viewYear, viewMonth);
    },
    clear() { checkIn = ""; checkOut = ""; hoverDate = ""; syncToForm(); render(); }
  };

  /* ── Init ───────────────────────────────────────────────────────────────── */
  function init() {
    const slug = getPropertySlug();
    if (!slug) return;

    // Target the empty MPHB calendar div directly
    mountEl = document.querySelector(".mphb-calendar--direct-booking, .mphb_sc_availability_calendar-wrapper, .mphb-calendar");

    if (!mountEl) {
      // Fallback: insert before the booking form
      const form = document.querySelector(".mphb-booking-form, .mphb_sc_booking_form-wrapper");
      if (form) {
        mountEl = document.createElement("div");
        mountEl.id = "frb-cal-mount";
        form.parentNode.insertBefore(mountEl, form);
      }
    }

    if (!mountEl) return;

    // Style the container to match the original layout
    mountEl.style.cssText += `min-height:200px;padding:16px;box-sizing:border-box;
      background:#fff;border:1px solid #EAEAEA;`;

    render();
    fetchCalendar(slug, viewYear, viewMonth);
    // Pre-fetch next month too
    const [ny, nm] = addMonths(viewYear, viewMonth, 1);
    fetchCalendar(slug, ny, nm);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
