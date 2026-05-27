/**
 * FRB Availability Calendar Widget — v3
 * Uses event delegation (no inline onclick) to avoid CSP issues.
 */
(function () {
  "use strict";

  const SUPABASE_URL = "https://bkqnviewrnafvvkqkhej.supabase.co";

  function getPropertySlug() {
    const m = window.location.pathname.match(/\/accommodation\/([^/]+)/);
    return m ? m[1] : null;
  }

  /* ── Date helpers ─────────────────────────────────────────────────────── */
  const TODAY = new Date();
  TODAY.setHours(0, 0, 0, 0);

  function toISO(d)     { return d.toISOString().slice(0, 10); }
  function parseDate(s) { const [y,m,d]=s.split("-").map(Number); return new Date(y,m-1,d); }
  function addMonths(year, month, delta) {
    let m=month+delta, y=year;
    while(m>12){m-=12;y++;} while(m<1){m+=12;y--;}
    return [y,m];
  }
  function daysInMonth(y,m) { return new Date(y,m,0).getDate(); }
  function startOffset(y,m) { return (new Date(y,m-1,1).getDay()+6)%7; }
  function fmtDate(y,m,d)   { return `${y}-${String(m).padStart(2,"0")}-${String(d).padStart(2,"0")}`; }
  function toDDMMYYYY(iso)   { if(!iso)return""; const[y,m,d]=iso.split("-"); return`${d}/${m}/${y}`; }
  function nightsBetween(a,b){ return Math.round((parseDate(b)-parseDate(a))/86400000); }

  const MONTHS = ["January","February","March","April","May","June",
                  "July","August","September","October","November","December"];
  const DAYS   = ["Mo","Tu","We","Th","Fr","Sa","Su"];

  /* ── State ────────────────────────────────────────────────────────────── */
  let calData   = {};
  let loading   = false;
  let checkIn   = "";
  let checkOut  = "";
  let hoverDate = "";
  let viewYear  = TODAY.getFullYear();
  let viewMonth = TODAY.getMonth()+1;
  let mountEl   = null;
  let calGrid   = null; // the inner div we re-render into
  let navEl     = null;

  /* ── Fetch ──────────────────────────────────────────────────────────────── */
  async function fetchCalendar(slug, year, month) {
    loading = true; updateNav();
    try {
      const r = await fetch(
        `${SUPABASE_URL}/functions/v1/calendar?propertySlug=${encodeURIComponent(slug)}&year=${year}&month=${month}`
      );
      if (!r.ok) throw new Error();
      const json = await r.json();
      if (json.days) json.days.forEach(day => { calData[day.date] = day; });
    } catch(_) {}
    loading = false; updateNav(); renderGrid();
  }

  /* ── Sync to MPHB form ──────────────────────────────────────────────────── */
  function syncToForm() {
    const ciVis = document.querySelector('input[id^="mphb_check_in_date-"]:not([type="hidden"])');
    const ciHid = document.querySelector('input[id^="mphb_check_in_date-"][type="hidden"], input[name="mphb_check_in_date"]');
    const coVis = document.querySelector('input[id^="mphb_check_out_date-"]:not([type="hidden"])');
    const coHid = document.querySelector('input[id^="mphb_check_out_date-"][type="hidden"], input[name="mphb_check_out_date"]');

    if (ciVis) ciVis.value = toDDMMYYYY(checkIn);
    if (ciHid) ciHid.value = toDDMMYYYY(checkIn);
    if (coVis) coVis.value = toDDMMYYYY(checkOut);
    if (coHid) coHid.value = toDDMMYYYY(checkOut);

    // Update price heading if both dates selected
    if (checkIn && checkOut) {
      const nights = nightsBetween(checkIn, checkOut);
      const slug = getPropertySlug();
      if (slug && nights > 0) {
        fetch(`${SUPABASE_URL}/functions/v1/pricing?propertySlug=${encodeURIComponent(slug)}&checkIn=${checkIn}&checkOut=${checkOut}`)
          .then(r => r.json())
          .then(data => {
            if (data && data.totalPrice) {
              const total = Math.round(data.totalPrice * 1.175).toLocaleString();
              const heading = document.querySelector('h2.elementor-heading-title, .elementor-widget-heading h2');
              if (heading) heading.textContent = `$${total} total · ${nights} night${nights>1?"s":""}`;
            }
          }).catch(()=>{});
      }
    }
  }

  /* ── Click logic ───────────────────────────────────────────────────────── */
  function handleDayClick(dateStr) {
    const todayStr = toISO(TODAY);
    if (dateStr < todayStr) return;
    const day = calData[dateStr];
    if (day && !day.available) return; // blocked

    if (!checkIn || (checkIn && checkOut)) {
      // Start fresh selection
      checkIn = dateStr; checkOut = "";
    } else if (dateStr <= checkIn) {
      // Clicked before or on check-in — reset
      checkIn = dateStr; checkOut = "";
    } else {
      // Validate no blocked nights in range
      let blocked = false;
      const cursor = parseDate(checkIn);
      cursor.setDate(cursor.getDate()+1);
      const end = parseDate(dateStr);
      while (cursor < end) {
        const d = toISO(cursor);
        if (calData[d] && !calData[d].available) { blocked=true; break; }
        cursor.setDate(cursor.getDate()+1);
      }
      if (blocked) { checkIn=dateStr; checkOut=""; }
      else { checkOut=dateStr; syncToForm(); }
    }
    renderGrid();
  }

  /* ── Render month grid ─────────────────────────────────────────────────── */
  function renderMonthHTML(y, m) {
    const offset   = startOffset(y, m);
    const total    = daysInMonth(y, m);
    const todayStr = toISO(TODAY);

    let html = `<div style="flex:1;min-width:0">
      <p style="font-family:Montserrat,sans-serif;font-size:11px;font-weight:700;
                text-transform:uppercase;letter-spacing:1.5px;color:#363636;
                text-align:center;margin:0 0 10px">${MONTHS[m-1]} ${y}</p>
      <div style="display:grid;grid-template-columns:repeat(7,1fr);margin-bottom:4px">`;
    DAYS.forEach(d => {
      html += `<div style="font-family:Montserrat,sans-serif;font-size:9px;color:#bbb;
                           text-align:center;font-weight:600;letter-spacing:0.5px;
                           padding-bottom:4px">${d}</div>`;
    });
    html += `</div><div style="display:grid;grid-template-columns:repeat(7,1fr);gap:1px">`;

    for(let i=0;i<offset;i++) html+=`<div></div>`;

    for(let d=1;d<=total;d++){
      const dateStr  = fmtDate(y,m,d);
      const dayData  = calData[dateStr];
      const past     = dateStr < todayStr;
      const blocked  = dayData && !dayData.available;
      const selected = dateStr===checkIn || dateStr===checkOut;
      const rangeEnd = checkOut || hoverDate;
      const [lo,hi]  = (checkIn&&rangeEnd) ? (checkIn<rangeEnd?[checkIn,rangeEnd]:[rangeEnd,checkIn]) : ["",""];
      const inRange  = lo && hi && dateStr>lo && dateStr<hi;
      const isHover  = checkIn&&!checkOut&&hoverDate===dateStr&&dateStr>checkIn;
      const isToday  = dateStr===todayStr;
      const clickable= !past;

      let bg="transparent",color="#363636",cursor="pointer",opacity=1;
      if(past)           { color="#ccc";cursor="default";opacity=0.4; }
      else if(selected)  { bg="#042E28";color="#fff"; }
      else if(isHover)   { bg="rgba(4,46,40,0.22)";color="#042E28"; }
      else if(inRange)   { bg="rgba(4,46,40,0.1)"; color="#042E28"; }
      else if(blocked)   { bg="#1e1e1e";color="#fff";cursor="not-allowed"; }

      const outline = (isToday&&!selected) ? "1px solid #042E28" : "none";
      const priceColor = selected?"rgba(255,255,255,0.8)":inRange?"#042E28":"#aaa";
      const priceStr = (!past&&dayData&&dayData.available&&dayData.priceFormatted)
        ? dayData.priceFormatted.replace(".00","").replace(/\$\s*/,"") : "";

      html += `<div
        data-date="${dateStr}"
        data-clickable="${clickable}"
        data-blocked="${!!blocked}"
        style="display:flex;flex-direction:column;align-items:center;justify-content:center;
               min-height:36px;padding:4px 1px;background:${bg};color:${color};
               cursor:${cursor};opacity:${opacity};border-radius:2px;
               outline:${outline};user-select:none;box-sizing:border-box;
               transition:background 0.08s ease">
        <span style="font-family:Montserrat,sans-serif;font-size:12px;font-weight:${selected?700:400};line-height:1">${d}</span>
        ${priceStr?`<span style="font-size:8px;margin-top:2px;line-height:1;color:${priceColor}">${priceStr}</span>`:""}
      </div>`;
    }
    return html+`</div></div>`;
  }

  /* ── Render nav bar ────────────────────────────────────────────────────── */
  function updateNav() {
    if(!navEl) return;
    const todayY=TODAY.getFullYear(),todayM=TODAY.getMonth()+1;
    const canPrev=!(viewYear===todayY&&viewMonth===todayM);
    navEl.querySelector("#frb-prev").disabled=!canPrev;
    navEl.querySelector("#frb-prev").style.color=canPrev?"#363636":"#ddd";
    navEl.querySelector("#frb-status").textContent=loading?"Loading…":"Select check-in date";
  }

  /* ── Render grid only (no full rebuild) ─────────────────────────────────── */
  function renderGrid() {
    if(!calGrid) return;
    const [ny,nm] = addMonths(viewYear,viewMonth,1);
    const selLabel = checkIn&&checkOut
      ? `${toDDMMYYYY(checkIn)} → ${toDDMMYYYY(checkOut)}  ·  ${nightsBetween(checkIn,checkOut)} nights`
      : checkIn ? `${toDDMMYYYY(checkIn)} → select check-out date` : "";

    calGrid.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:12px">
        ${renderMonthHTML(viewYear,viewMonth)}
        ${renderMonthHTML(ny,nm)}
      </div>
      ${selLabel ? `
      <div style="display:flex;justify-content:space-between;align-items:center;
                  padding:10px 0;border-top:1px solid #EAEAEA;margin-top:4px">
        <span style="font-family:Montserrat,sans-serif;font-size:12px;
                     color:#363636;font-weight:500">${selLabel}</span>
        <button id="frb-clear"
          style="font-family:Montserrat,sans-serif;background:none;border:none;
                 cursor:pointer;font-size:11px;text-transform:uppercase;
                 letter-spacing:1px;color:#c0392b;padding:0">Clear</button>
      </div>` : ""}
      <div style="display:flex;gap:16px;margin-top:10px;flex-wrap:wrap">
        ${[["#1e1e1e","Unavailable"],["#042E28","Selected"],["rgba(4,46,40,0.1)","Stay period"]]
          .map(([c,l])=>`<div style="display:flex;align-items:center;gap:5px">
            <div style="width:10px;height:10px;background:${c};border:1px solid #ddd;border-radius:2px"></div>
            <span style="font-family:Montserrat,sans-serif;font-size:10px;color:#888">${l}</span>
          </div>`).join("")}
      </div>`;

    // Re-attach clear button listener
    const clearBtn = calGrid.querySelector("#frb-clear");
    if(clearBtn) clearBtn.addEventListener("click", ()=>{
      checkIn=""; checkOut=""; hoverDate=""; syncToForm(); renderGrid();
    });
  }

  /* ── Full mount (runs once) ─────────────────────────────────────────────── */
  function mount() {
    if(!mountEl) return;

    mountEl.innerHTML = `
      <div style="font-family:Montserrat,sans-serif;padding:4px 0">
        <!-- Nav -->
        <div id="frb-nav" style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
          <button id="frb-prev"
            style="background:none;border:none;cursor:pointer;font-size:24px;
                   color:#363636;padding:0 10px;line-height:1;font-weight:200"
            aria-label="Previous month">‹</button>
          <span id="frb-status"
            style="font-size:10px;text-transform:uppercase;letter-spacing:2px;
                   color:#888">Select check-in date</span>
          <button id="frb-next"
            style="background:none;border:none;cursor:pointer;font-size:24px;
                   color:#363636;padding:0 10px;line-height:1;font-weight:200"
            aria-label="Next month">›</button>
        </div>
        <!-- Calendar grid (re-rendered on each state change) -->
        <div id="frb-grid"></div>
      </div>`;

    navEl  = mountEl.querySelector("#frb-nav");
    calGrid= mountEl.querySelector("#frb-grid");

    /* ── Event delegation: ONE listener for all day clicks/hover ── */
    calGrid.addEventListener("click", e => {
      const cell = e.target.closest("[data-date]");
      if(!cell) return;
      if(cell.dataset.clickable==="false") return;
      handleDayClick(cell.dataset.date);
    });

    calGrid.addEventListener("mouseover", e => {
      const cell = e.target.closest("[data-date]");
      if(!cell || cell.dataset.clickable==="false" || cell.dataset.blocked==="true") return;
      if(hoverDate !== cell.dataset.date) {
        hoverDate = cell.dataset.date;
        renderGrid();
      }
    });

    calGrid.addEventListener("mouseleave", () => {
      if(hoverDate) { hoverDate=""; renderGrid(); }
    });

    /* ── Nav buttons ── */
    mountEl.querySelector("#frb-prev").addEventListener("click", ()=>{
      const todayY=TODAY.getFullYear(),todayM=TODAY.getMonth()+1;
      if(viewYear===todayY&&viewMonth===todayM) return;
      [viewYear,viewMonth]=addMonths(viewYear,viewMonth,-1);
      fetchCalendar(getPropertySlug(),viewYear,viewMonth);
    });

    mountEl.querySelector("#frb-next").addEventListener("click", ()=>{
      [viewYear,viewMonth]=addMonths(viewYear,viewMonth,1);
      fetchCalendar(getPropertySlug(),viewYear,viewMonth);
    });

    renderGrid();
  }

  /* ── Init ───────────────────────────────────────────────────────────────── */
  function init() {
    const slug = getPropertySlug();
    if(!slug) return;

    // Mount into the empty MPHB calendar div
    mountEl = document.querySelector(
      ".mphb-calendar--direct-booking, .mphb_sc_availability_calendar-wrapper, .mphb-calendar"
    );

    if(!mountEl) {
      // Fallback: insert before booking form
      const form = document.querySelector(".mphb-booking-form, .mphb_sc_booking_form-wrapper");
      if(form) {
        mountEl = document.createElement("div");
        mountEl.id = "frb-cal-mount";
        form.parentNode.insertBefore(mountEl, form);
      }
    }
    if(!mountEl) return;

    mountEl.style.cssText += "min-height:220px;padding:16px;box-sizing:border-box;";
    mount();

    // Fetch current + next month
    fetchCalendar(slug, viewYear, viewMonth);
    const [ny,nm] = addMonths(viewYear,viewMonth,1);
    fetchCalendar(slug, ny, nm);
  }

  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
