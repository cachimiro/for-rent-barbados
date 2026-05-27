/**
 * FRB Availability Calendar Widget — v4
 * - Event delegation (no inline onclick) — CSP safe
 * - Fills native <input type="date"> via name="mphb_check_in/out_date"
 * - Enforces minimum stay from Hospitable API
 * - Updates price heading live
 */
(function () {
  "use strict";

  const SUPABASE_URL = "https://bkqnviewrnafvvkqkhej.supabase.co";

  function getSlug() {
    const m = window.location.pathname.match(/\/accommodation\/([^/]+)/);
    return m ? m[1] : null;
  }

  /* ── Date helpers ──────────────────────────────────────────────────────── */
  const TODAY = new Date();
  TODAY.setHours(0,0,0,0);
  const TODAY_STR = toISO(TODAY);

  function toISO(d)      { return d.toISOString().slice(0,10); }
  function parseISO(s)   { const[y,m,d]=s.split("-").map(Number); return new Date(y,m-1,d); }
  function addM(y,m,dlt) { let nm=m+dlt,ny=y; while(nm>12){nm-=12;ny++;} while(nm<1){nm+=12;ny--;} return[ny,nm]; }
  function dim(y,m)      { return new Date(y,m,0).getDate(); }
  function dayOff(y,m)   { return (new Date(y,m-1,1).getDay()+6)%7; }
  function pad(n)        { return String(n).padStart(2,"0"); }
  function ymd(y,m,d)    { return `${y}-${pad(m)}-${pad(d)}`; }
  function nights(a,b)   { return Math.round((parseISO(b)-parseISO(a))/86400000); }

  const MO = ["January","February","March","April","May","June",
              "July","August","September","October","November","December"];
  const DY = ["Mo","Tu","We","Th","Fr","Sa","Su"];

  /* ── State ─────────────────────────────────────────────────────────────── */
  let calData   = {};   // { "2026-06-01": { available, priceFormatted, minStay } }
  let loading   = false;
  let ci        = "";   // check-in ISO
  let co        = "";   // check-out ISO
  let hover     = "";
  let vy        = TODAY.getFullYear();
  let vm        = TODAY.getMonth()+1;
  let mountEl   = null;
  let gridEl    = null;
  let statusEl  = null;
  let msgEl     = null; // min-stay / error message

  /* ── Fetch ───────────────────────────────────────────────────────────────*/
  async function fetchMonth(slug, y, m) {
    try {
      const r = await fetch(
        `${SUPABASE_URL}/functions/v1/calendar?propertySlug=${encodeURIComponent(slug)}&year=${y}&month=${m}`
      );
      const j = await r.json();
      if (j.days) j.days.forEach(day => { calData[day.date] = day; });
    } catch(_) {}
    loading = false;
    setStatus("Select check-in date");
    renderGrid();
  }

  /* ── Fill the booking form inputs ────────────────────────────────────────*/
  function syncForm() {
    // custom-booking.js converts MPHB text inputs to type="date" with name="mphb_check_in/out_date"
    // Native date inputs expect YYYY-MM-DD format
    const ciIn = document.querySelector('input[name="mphb_check_in_date"]');
    const coIn = document.querySelector('input[name="mphb_check_out_date"]');

    if (ciIn) {
      ciIn.value = ci;
      ciIn.dispatchEvent(new Event("input",  {bubbles:true}));
      ciIn.dispatchEvent(new Event("change", {bubbles:true}));
    }
    if (coIn) {
      coIn.value = co;
      coIn.dispatchEvent(new Event("input",  {bubbles:true}));
      coIn.dispatchEvent(new Event("change", {bubbles:true}));
    }

    updatePriceHeading();
  }

  /* ── Update the "Starting from $X/night" heading ─────────────────────────*/
  function updatePriceHeading() {
    const slug = getSlug();
    if (!slug || !ci || !co) {
      resetPriceHeading();
      return;
    }
    const n = nights(ci, co);
    if (n <= 0) { resetPriceHeading(); return; }

    // Optimistic: show night count immediately
    setHeading(`Calculating total for ${n} night${n>1?"s":""}…`);

    fetch(`${SUPABASE_URL}/functions/v1/pricing?propertySlug=${encodeURIComponent(slug)}&checkIn=${ci}&checkOut=${co}`)
      .then(r => r.json())
      .then(data => {
        if (data && data.totalPrice) {
          const withTax = Math.round(data.totalPrice * 1.175);
          setHeading(`$${withTax.toLocaleString()} total · ${n} night${n>1?"s":""}`);
          setSubHeading("Includes 17.5% tax and fees");
        } else {
          // Fall back to calendar day price × nights
          const day = calData[ci];
          if (day && day.priceFormatted) {
            const rate = parseFloat(day.priceFormatted.replace(/[^0-9.]/g,"")) || 0;
            if (rate > 0) {
              setHeading(`~$${Math.round(rate * n * 1.175).toLocaleString()} total · ${n} night${n>1?"s":""}`);
              setSubHeading("Estimated total inc. taxes");
            } else {
              setHeading(`${n} night${n>1?"s":""} selected`);
              setSubHeading("Contact us for pricing");
            }
          }
        }
      })
      .catch(() => {
        const n2 = nights(ci, co);
        setHeading(`${n2} night${n2>1?"s":""} selected`);
        setSubHeading("Pricing unavailable — contact us");
      });
  }

  function findHeading() {
    // The property page has an h2 inside .elementor-widget-heading with price
    return document.querySelector(
      '.elementor-widget-heading h2.elementor-heading-title, ' +
      '.elementor-heading-title'
    );
  }
  function findSubHeading() {
    return document.querySelector('.elementor-widget-text-editor p');
  }
  function setHeading(txt) {
    const el = findHeading(); if(el) el.textContent = txt;
  }
  function setSubHeading(txt) {
    const el = findSubHeading(); if(el) el.textContent = txt;
  }
  function resetPriceHeading() {
    const el = findHeading();
    if(el && !el.textContent.includes("Starting")) el.textContent = "Starting from $700/night";
    const sub = findSubHeading();
    if(sub && !sub.textContent.includes("Enter")) sub.textContent = "Enter dates for seasonal pricing";
  }

  /* ── Minimum stay check ──────────────────────────────────────────────────*/
  function getMinStay(dateStr) {
    const day = calData[dateStr];
    return (day && day.minStay && day.minStay > 1) ? day.minStay : 0;
  }
  function setMsg(txt, color) {
    if(!msgEl) return;
    msgEl.textContent = txt;
    msgEl.style.color = color || "#c0392b";
    msgEl.style.display = txt ? "block" : "none";
  }
  function setStatus(txt) {
    if(statusEl) statusEl.textContent = txt;
  }

  /* ── Click handler ─────────────────────────────────────────────────────── */
  function handleClick(dateStr) {
    if (dateStr < TODAY_STR) return;
    const day = calData[dateStr];
    if (day && !day.available) return;

    setMsg("");

    if (!ci || (ci && co)) {
      // Start new selection
      ci = dateStr; co = "";
      const minS = getMinStay(dateStr);
      if (minS > 1) setMsg(`Minimum stay: ${minS} nights`, "#888");
      setStatus("Now select check-out date");
    } else if (dateStr <= ci) {
      ci = dateStr; co = "";
      const minS = getMinStay(dateStr);
      if (minS > 1) setMsg(`Minimum stay: ${minS} nights`, "#888");
      setStatus("Now select check-out date");
    } else {
      // Validate range
      const n = nights(ci, dateStr);
      const minS = getMinStay(ci);

      // Check blocked dates in range
      let blocked = false;
      const cursor = parseISO(ci);
      cursor.setDate(cursor.getDate()+1);
      const end = parseISO(dateStr);
      while(cursor < end) {
        const d = toISO(cursor);
        if(calData[d] && !calData[d].available) { blocked=true; break; }
        cursor.setDate(cursor.getDate()+1);
      }

      if (blocked) {
        // Reset and start fresh from clicked date
        ci = dateStr; co = "";
        setMsg("Blocked dates in that range — starting fresh", "#c0392b");
        setStatus("Now select check-out date");
      } else if (minS > 0 && n < minS) {
        // Minimum stay not met
        setMsg(`Minimum stay is ${minS} nights — please select a later check-out`, "#c0392b");
        // Don't set co, keep ci and let user pick again
      } else {
        co = dateStr;
        setMsg("");
        setStatus("Dates selected ✓");
        syncForm();
      }
    }
    renderGrid();
  }

  /* ── Render one month ──────────────────────────────────────────────────── */
  function monthHTML(y, m) {
    const offset = dayOff(y, m);
    const total  = dim(y, m);

    let html = `<div style="flex:1;min-width:0">
      <p style="font-family:Montserrat,sans-serif;font-size:11px;font-weight:700;
                text-transform:uppercase;letter-spacing:1.5px;color:#363636;
                text-align:center;margin:0 0 10px 0">${MO[m-1]} ${y}</p>
      <div style="display:grid;grid-template-columns:repeat(7,1fr);margin-bottom:4px">`;
    DY.forEach(d=>{
      html+=`<div style="font-family:Montserrat,sans-serif;font-size:9px;color:#bbb;
                         text-align:center;font-weight:600;letter-spacing:0.5px;
                         padding-bottom:4px">${d}</div>`;
    });
    html+=`</div><div style="display:grid;grid-template-columns:repeat(7,1fr);gap:1px">`;

    for(let i=0;i<offset;i++) html+=`<div></div>`;

    const rangeEnd = co || hover;
    const[lo,hi]   = (ci&&rangeEnd) ? (ci<rangeEnd?[ci,rangeEnd]:[rangeEnd,ci]) : ["",""];

    for(let d=1;d<=total;d++){
      const ds      = ymd(y,m,d);
      const dayData = calData[ds];
      const past    = ds < TODAY_STR;
      const blocked = dayData && !dayData.available;
      const sel     = ds===ci||ds===co;
      const inR     = lo&&hi&&ds>lo&&ds<hi;
      const isH     = ci&&!co&&hover===ds&&ds>ci;
      const isToday = ds===TODAY_STR;

      // Min stay: dim dates that can't satisfy minimum from check-in
      const minS    = ci && !co ? getMinStay(ci) : 0;
      const tooShort= ci && !co && minS > 1 && ds > ci && nights(ci,ds) < minS;

      let bg="transparent",color="#363636",cursor="pointer",op=1;
      if(past)      { color="#ccc"; cursor="default"; op=0.38; }
      else if(sel)  { bg="#042E28"; color="#fff"; }
      else if(isH)  { bg="rgba(4,46,40,0.25)"; color="#042E28"; }
      else if(inR)  { bg="rgba(4,46,40,0.1)";  color="#042E28"; }
      else if(blocked) { bg="#1a1a1a"; color="#fff"; cursor="not-allowed"; }
      else if(tooShort){ op=0.4; cursor="not-allowed"; }

      const outline = (isToday&&!sel)?"1px solid #042E28":"none";
      const prC = sel?"rgba(255,255,255,0.8)":inR?"#042E28":"#aaa";
      const prS = (!past&&!blocked&&dayData&&dayData.available&&dayData.priceFormatted)
        ? dayData.priceFormatted.replace(".00","").replace(/\$\s*/,"") : "";

      html+=`<div
        data-date="${ds}"
        data-past="${past}"
        data-blocked="${!!blocked}"
        data-tooshort="${tooShort}"
        style="display:flex;flex-direction:column;align-items:center;justify-content:center;
               min-height:36px;padding:3px 1px;background:${bg};color:${color};
               cursor:${cursor};opacity:${op};border-radius:2px;outline:${outline};
               user-select:none;box-sizing:border-box;transition:background 0.08s">
        <span style="font-family:Montserrat,sans-serif;font-size:12px;
                     font-weight:${sel?700:400};line-height:1.1">${d}</span>
        ${prS?`<span style="font-size:8px;margin-top:1px;line-height:1;color:${prC}">${prS}</span>`:""}
      </div>`;
    }
    return html+`</div></div>`;
  }

  /* ── Render grid ───────────────────────────────────────────────────────── */
  function renderGrid() {
    if(!gridEl) return;
    const[ny,nm] = addM(vy,vm,1);
    const selLabel = ci&&co
      ? `${ci} → ${co} · ${nights(ci,co)} night${nights(ci,co)>1?"s":""}`
      : ci ? `${ci} → pick check-out` : "";

    gridEl.innerHTML=`
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:10px">
        ${monthHTML(vy,vm)}
        ${monthHTML(ny,nm)}
      </div>
      ${selLabel?`
      <div style="display:flex;justify-content:space-between;align-items:center;
                  padding:10px 0;border-top:1px solid #EAEAEA">
        <span style="font-family:Montserrat,sans-serif;font-size:12px;
                     color:#363636;font-weight:500">${selLabel}</span>
        <button id="frb-clear"
          style="font-family:Montserrat,sans-serif;background:none;border:none;
                 cursor:pointer;font-size:11px;text-transform:uppercase;
                 letter-spacing:1px;color:#c0392b;padding:0">Clear</button>
      </div>`:""}
      <div id="frb-msg" style="font-family:Montserrat,sans-serif;font-size:12px;
                                margin-top:8px;display:none"></div>
      <div style="display:flex;gap:16px;margin-top:10px;flex-wrap:wrap">
        ${[["#1a1a1a","Unavailable"],["#042E28","Selected"],["rgba(4,46,40,0.1)","Stay period"]]
          .map(([c,l])=>`<div style="display:flex;align-items:center;gap:5px">
            <div style="width:10px;height:10px;background:${c};border:1px solid #ddd;border-radius:2px"></div>
            <span style="font-family:Montserrat,sans-serif;font-size:10px;color:#888">${l}</span>
          </div>`).join("")}
      </div>`;

    msgEl = gridEl.querySelector("#frb-msg");

    const clr = gridEl.querySelector("#frb-clear");
    if(clr) clr.addEventListener("click",()=>{
      ci=""; co=""; hover="";
      setMsg(""); setStatus("Select check-in date");
      syncForm(); resetPriceHeading(); renderGrid();
    });
  }

  /* ── Mount (once) ──────────────────────────────────────────────────────── */
  function mount() {
    mountEl.innerHTML=`
      <div style="font-family:Montserrat,sans-serif">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
          <button id="frb-prev" style="background:none;border:none;cursor:pointer;
            font-size:24px;color:#363636;padding:0 10px;line-height:1;font-weight:200">‹</button>
          <span id="frb-status"
            style="font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#888">
            Loading…</span>
          <button id="frb-next" style="background:none;border:none;cursor:pointer;
            font-size:24px;color:#363636;padding:0 10px;line-height:1;font-weight:200">›</button>
        </div>
        <div id="frb-grid"></div>
      </div>`;

    gridEl   = mountEl.querySelector("#frb-grid");
    statusEl = mountEl.querySelector("#frb-status");

    /* Event delegation — click */
    gridEl.addEventListener("click", e => {
      const cell = e.target.closest("[data-date]");
      if (!cell) return;
      if (cell.dataset.past==="true") return;
      if (cell.dataset.blocked==="true") return;
      handleClick(cell.dataset.date);
    });

    /* Event delegation — hover */
    gridEl.addEventListener("mouseover", e => {
      const cell = e.target.closest("[data-date]");
      if (!cell||cell.dataset.past==="true"||cell.dataset.blocked==="true") return;
      if (hover!==cell.dataset.date) { hover=cell.dataset.date; renderGrid(); }
    });
    gridEl.addEventListener("mouseleave", ()=>{ if(hover){hover="";renderGrid();} });

    /* Nav */
    mountEl.querySelector("#frb-prev").addEventListener("click",()=>{
      const ty=TODAY.getFullYear(),tm=TODAY.getMonth()+1;
      if(vy===ty&&vm===tm) return;
      [vy,vm]=addM(vy,vm,-1);
      loadMonths();
    });
    mountEl.querySelector("#frb-next").addEventListener("click",()=>{
      [vy,vm]=addM(vy,vm,1);
      loadMonths();
    });

    renderGrid();
  }

  async function loadMonths() {
    loading = true;
    setStatus("Loading…");
    const slug = getSlug();
    const[ny,nm]=addM(vy,vm,1);
    await Promise.all([
      fetchMonth(slug,vy,vm),
      fetchMonth(slug,ny,nm)
    ]);
  }

  /* ── Init ───────────────────────────────────────────────────────────────── */
  function init() {
    if (!getSlug()) return;

    mountEl = document.querySelector(
      ".mphb-calendar--direct-booking, " +
      ".mphb_sc_availability_calendar-wrapper, " +
      ".mphb-calendar"
    );

    if (!mountEl) {
      const form = document.querySelector(".mphb-booking-form, .mphb_sc_booking_form-wrapper");
      if (form) {
        mountEl = document.createElement("div");
        mountEl.id = "frb-cal-mount";
        form.parentNode.insertBefore(mountEl, form);
      }
    }
    if (!mountEl) return;

    mountEl.style.cssText += "min-height:200px;padding:16px;box-sizing:border-box;";

    // Pre-fill from URL params if coming from search page
    const params = new URLSearchParams(window.location.search);
    ci = params.get("checkIn") || "";
    co = params.get("checkOut") || "";
    if (ci && co) { setTimeout(syncForm, 500); } // let custom-booking.js init first

    mount();
    loadMonths();
  }

  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
