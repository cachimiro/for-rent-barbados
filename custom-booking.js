const PROPERTY_MAP = {
  "azzurro-03-3-bed": "c31e2cdb-8698-42f5-bc5d-98253e3a1287",
  "azzurro-03-2-bed": "",
  "westmoreland-hill-35-4-bed": "c31e2cdb-8698-42f5-bc5d-98253e3a1287",
  "westmoreland-hill-35-3-bed": "",
  "coral-beach-105": "df72e9d0-e5e1-4ed0-94f9-3cf478032b19",
  "coral-beach-105-2": "ca5ea27b-9029-4ab7-9699-059f8c250aec",
  "lantana-44-2-bed": "8a432bbc-5bec-47de-8fa7-b6d6821e8958",
  "lantana-44-3-bed": "26599d90-09d7-4c5f-b873-5edd07ced505",
  "turtle-view-3-bed": "102dba7c-501d-47be-9c2a-260d5e32e61f",
  "turtle-view-2-bed": "0ee36049-0736-408a-aa48-5e1ead0c4753",
  "westmoreland-hill-13-2-bed": "b951edd5-a40d-4c6d-ac66-88a764fc1d21",
  "westmoreland-hill-13-3-bed": "1e2448f2-ce2c-4023-8e52-8edde6b7f454",
  "westmoreland-hill-2-3-bed": "",
  "westmoreland-hill-22-4-bed": "",
  "brownes-2b-1-bed": "9fef34b5-e1fa-4f28-aafe-c3511dbd8f3f",
};

const ROOM_TYPE_MAP = {
  "azzurro-03-2-bed":               1148,
  "azzurro-03-3-bed":               1146,
  "brownes-2b-1-bed":               1524,
  "coral-beach-105":                85,
  "coral-beach-105-2":              1061,
  "ixora-101":                      329646,
  "jamestown-park-1-2-bed":         269504,
  "jamestown-park-1-2-bed-2":       1526,
  "lantana-44-2-bed":               1503,
  "lantana-44-3-bed":               1506,
  "mullins-reef-3-bed":             19006,
  "the-crane-resort":               329655,
  "turtle-view-2-bed":              1509,
  "turtle-view-3-bed":              1508,
  "westmoreland-hill-13-2-bed":     1512,
  "westmoreland-hill-13-3-bed":     1514,
  "westmoreland-hill-2-3-bed":      1516,
  "westmoreland-hill-35-3-bed":     1520,
  "westmoreland-hill-35-4-bed":     1522,
  "westmoreland-hills-1-villa-savannah": 35666,
};

// Property name map
const PROPERTY_NAMES = {
  "azzurro-03-3-bed": "Azzurro 03 – 3 BED",
  "azzurro-03-2-bed": "Azzurro 03 – 2 BED",
  "westmoreland-hill-35-4-bed": "Westmoreland Hill 35 – 4 BED",
  "westmoreland-hill-35-3-bed": "Westmoreland Hill 35 – 3 BED",
  "coral-beach-105": "Coral Beach 105",
  "coral-beach-105-2": "Coral Beach 105/2",
  "lantana-44-2-bed": "Lantana 44 – 2 BED",
  "lantana-44-3-bed": "Lantana 44 – 3 BED",
  "turtle-view-3-bed": "Turtle View – 3 BED",
  "turtle-view-2-bed": "Turtle View – 2 BED",
  "westmoreland-hill-13-2-bed": "Westmoreland Hill 13 – 2 BED",
  "westmoreland-hill-13-3-bed": "Westmoreland Hill 13 – 3 BED",
  "westmoreland-hill-2-3-bed": "Westmoreland Hill 2 – 3 BED",
  "westmoreland-hill-22-4-bed": "Westmoreland Hill 22 – 4 BED",
  "westmoreland-hills-1-villa-savannah": "Westmoreland Hills 1 – Villa Savannah",
  "brownes-2b-1-bed": "Brownes 2B – 1 BED",
  "ixora-101": "Ixora 101",
  "jamestown-park-1-2-bed": "Jamestown Park 1 – 2 BED",
  "jamestown-park-1-1-bed": "Jamestown Park 1 – 1 BED",
  "mullins-reef-3-bed": "Mullins Reef – 3 BED",
  "the-crane-resort": "The Crane Resort",
  "coconut-grove-3-sienna": "Coconut Grove 3 – Sienna",
};

const SUPABASE_URL = "https://bkqnviewrnafvvkqkhej.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrcW52aWV3cm5hZnZ2a3FraGVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1MDUyMDMsImV4cCI6MjA2MzA4MTIwM30.QZfw839K9zACIhO9bCC-1-Aln_g8CcqYnO6hBCQQqnc";
const TAX_RATE = 0.175;

document.addEventListener("DOMContentLoaded", function () {
  // 0. Convert MotoPress text inputs to native datepickers
  const allDateInputs = document.querySelectorAll('input[id*="mphb_check_in_date"]:not([type="hidden"]), input[id*="mphb_check_out_date"]:not([type="hidden"])');
  allDateInputs.forEach(input => {
      input.type = 'date';
      if (input.id.includes('check_in')) input.name = 'mphb_check_in_date';
      if (input.id.includes('check_out')) input.name = 'mphb_check_out_date';
      input.removeAttribute('inputmode');
  });

  // 1. Intercept search forms (e.g. on Homepage)
  const forms = document.querySelectorAll(".mphb_sc_search-form");
  forms.forEach(form => {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const checkInInput = form.querySelector('input[name="mphb_check_in_date"]');
      const checkOutInput = form.querySelector('input[name="mphb_check_out_date"]');
      const adultsInput = form.querySelector('select[name="mphb_adults"]');
      
      const params = new URLSearchParams();
      if (checkInInput && checkInInput.value) params.set("checkIn", checkInInput.value);
      if (checkOutInput && checkOutInput.value) params.set("checkOut", checkOutInput.value);
      if (adultsInput && adultsInput.value) params.set("guests", adultsInput.value);
      
      window.location.href = `/availability-search-2/index.html?${params.toString()}`;
    });
  });

  // 2. Filter properties on Search Results Page
  if (window.location.pathname.includes('/availability-search-2')) {
    const urlParams = new URLSearchParams(window.location.search);
    const checkIn = urlParams.get('checkIn');
    const checkOut = urlParams.get('checkOut');

    if (checkIn && checkOut) {
      let grid = document.querySelector('.th-portfolio');
      if (!grid) grid = document.querySelector('.elementor-widget-themo-accommodation-search-results');
      
      if (grid) {
          const loadingMsg = document.createElement('div');
          loadingMsg.id = 'availability-loading';
          loadingMsg.innerHTML = '<h3 style="text-align: center; padding: 40px;">Checking live availability on Hospitable...</h3>';
          grid.prepend(loadingMsg);
      }

      const propertyCards = document.querySelectorAll('.th-portfolio-item.mphb_room_type, .mphb_room_type');
      
      const promises = Array.from(propertyCards).map(card => {
        const link = card.querySelector('.th-port-card-link, a');
        if (!link) return Promise.resolve();
        const href = link.getAttribute('href');

        try {
          const newUrl = new URL(href, window.location.href);
          newUrl.searchParams.set('checkIn', checkIn);
          newUrl.searchParams.set('checkOut', checkOut);
          link.setAttribute('href', newUrl.toString());
        } catch(e) {}

        const match = href.match(/accommodation\/([^\/]+)/);
        if (!match) return Promise.resolve();
        const slug = match[1];

        return fetch(`${SUPABASE_URL}/functions/v1/availability?propertySlug=${slug}&checkIn=${checkIn}&checkOut=${checkOut}`)
          .then(res => res.json())
          .then(data => {
            if (!data.available) {
              card.style.display = 'none';
            }
          })
          .catch(err => {
             console.error("Availability check failed for", slug, err);
          });
      });

      Promise.all(promises).then(() => {
        const loadingMsg = document.getElementById('availability-loading');
        if (loadingMsg) loadingMsg.remove();
      });
    }
  }

  // Pre-fill dates from URL on individual property pages
  const globalUrlParams = new URLSearchParams(window.location.search);
  const gCheckIn = globalUrlParams.get('checkIn');
  const gCheckOut = globalUrlParams.get('checkOut');
  if (gCheckIn) {
      const inputs = document.querySelectorAll('input[name="mphb_check_in_date"]');
      inputs.forEach(i => i.value = gCheckIn);
  }
  if (gCheckOut) {
      const inputs = document.querySelectorAll('input[name="mphb_check_out_date"]');
      inputs.forEach(i => i.value = gCheckOut);
  }

  // 3. Intercept individual property booking form — show inline booking overlay
  const bookingForms = document.querySelectorAll(".mphb-booking-form");
  bookingForms.forEach(form => {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      let checkIn  = "";
      let checkOut = "";

      const ciHidden = form.querySelector('input[type="hidden"][name="mphb_check_in_date"]');
      const coHidden = form.querySelector('input[type="hidden"][name="mphb_check_out_date"]');
      if (ciHidden && ciHidden.value) checkIn  = ciHidden.value;
      if (coHidden && coHidden.value) checkOut = coHidden.value;

      if (!checkIn || !checkOut) {
        const ciVis = form.querySelector('input[type="date"][name="mphb_check_in_date"]');
        const coVis = form.querySelector('input[type="date"][name="mphb_check_out_date"]');
        if (ciVis && ciVis.value) checkIn  = ciVis.value;
        if (coVis && coVis.value) checkOut = coVis.value;
      }

      if (!checkIn || !checkOut) {
        const ciAny = form.querySelector('input[name="mphb_check_in_date"]');
        const coAny = form.querySelector('input[name="mphb_check_out_date"]');
        if (ciAny && ciAny.value) checkIn  = ciAny.value;
        if (coAny && coAny.value) checkOut = coAny.value;
      }

      if (!checkIn || !checkOut) {
        checkIn  = globalUrlParams.get('checkIn')  || "";
        checkOut = globalUrlParams.get('checkOut') || "";
      }

      if (!checkIn || !checkOut) {
        alert("Please select check-in and check-out dates before booking.");
        return;
      }

      const pathMatch = window.location.pathname.match(/accommodation\/([^\/]+)/);
      if (!pathMatch) return;
      const slug   = pathMatch[1];
      const adults = (form.querySelector('select[name="mphb_adults"]') || {}).value || "2";

      // Show the booking overlay instead of redirecting
      showBookingOverlay(slug, checkIn, checkOut, adults);
    });
  });
});


// ========================
// BOOKING OVERLAY (full-page)
// ========================

function showBookingOverlay(slug, checkIn, checkOut, adultsCount) {
  const propertyName = PROPERTY_NAMES[slug] || slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  const nights = Math.round((new Date(checkOut) - new Date(checkIn)) / (86400000));
  const adults = parseInt(adultsCount) || 2;

  const fmtDate = (d) => {
    try { return new Date(d + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }); }
    catch { return d; }
  };

  // Build adults options
  let adultsOpts = "";
  for (let i = 1; i <= 12; i++) {
    adultsOpts += `<option value="${i}" ${i === adults ? "selected" : ""}>${i}</option>`;
  }

  // Create overlay
  const overlay = document.createElement("div");
  overlay.id = "frb-booking-overlay";
  overlay.innerHTML = `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Spinnaker&family=Montserrat:wght@300;400;500;600&family=Roboto+Slab:wght@300;400;500&display=swap');
      #frb-booking-overlay {
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        z-index: 99999; background: #fff; overflow-y: auto;
      }
      #frb-booking-overlay * { box-sizing: border-box; margin: 0; padding: 0; }
      .frb-bk-header {
        background: #042E28; padding: 14px 40px;
        display: flex; align-items: center; justify-content: space-between;
      }
      .frb-bk-header img { height: 36px; }
      .frb-bk-close {
        background: none; border: none; color: #fff; font-size: 28px;
        cursor: pointer; font-family: sans-serif; line-height: 1; padding: 4px 12px;
      }
      .frb-bk-close:hover { opacity: .7; }
      .frb-bk-hero {
        background: linear-gradient(rgba(0,0,0,.55), rgba(0,0,0,.55)),
                    url('/wp-content/uploads/2024/07/DJI_0182-scaled.jpg') center/cover no-repeat;
        padding: 80px 40px; text-align: center; min-height: 200px;
        display: flex; flex-direction: column; align-items: center; justify-content: flex-end;
      }
      .frb-bk-hero h1 {
        font-family: 'Spinnaker', sans-serif; font-size: 42px; font-weight: 400;
        color: #fff; margin: 0; letter-spacing: 1px; text-transform: none;
      }
      @media (max-width: 600px) { .frb-bk-hero { padding: 50px 20px; } .frb-bk-hero h1 { font-size: 28px; } }
      .frb-bk-content {
        display: grid; grid-template-columns: 1fr 1fr; gap: 0;
        max-width: 100%; margin: 0;
      }
      @media (max-width: 860px) { .frb-bk-content { grid-template-columns: 1fr; } }
      .frb-bk-form {
        padding: 48px 60px 60px; background: #fff;
      }
      @media (max-width: 600px) { .frb-bk-form { padding: 32px 20px 40px; } }
      .frb-bk-form h2 {
        font-family: 'Roboto Slab', serif; font-size: 22px; font-weight: 400;
        color: #363636; margin: 0 0 28px;
      }
      .frb-bk-row { margin-bottom: 20px; }
      .frb-bk-row label {
        display: block; font-family: 'Montserrat', sans-serif; font-size: 12px;
        font-weight: 500; text-transform: uppercase; letter-spacing: 1px;
        color: #6c6c6c; margin-bottom: 8px;
      }
      .frb-bk-row input, .frb-bk-row select, .frb-bk-row textarea {
        width: 100%; border: 1px solid #d3d3d3; padding: 12px 14px;
        font-family: 'Montserrat', sans-serif; font-size: 14px; color: #363636;
        outline: none; background: #fff; border-radius: 0; transition: border-color .2s;
      }
      .frb-bk-row textarea { resize: vertical; min-height: 90px; }
      .frb-bk-row input:focus, .frb-bk-row select:focus, .frb-bk-row textarea:focus { border-color: #042E28; }
      .frb-bk-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
      @media (max-width: 500px) { .frb-bk-grid { grid-template-columns: 1fr; } }
      .frb-bk-summary {
        background: #f7f7f7; border: 1px solid #eaeaea; padding: 20px 24px; margin-bottom: 28px;
      }
      .frb-bk-summary h3 {
        font-family: 'Roboto Slab', serif; font-size: 16px; font-weight: 400;
        color: #363636; margin: 0 0 16px; padding-bottom: 12px;
        border-bottom: 1px solid #eaeaea;
      }
      .frb-bk-srow { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px; font-size: 13px; font-family: 'Montserrat', sans-serif; color: #555; }
      .frb-bk-srow .val { font-weight: 600; color: #363636; }
      .frb-bk-total { margin-top: 12px; padding-top: 12px; border-top: 1px solid #eaeaea; font-size: 15px; }
      .frb-bk-total .val { color: #042E28; }
      .frb-bk-deposit { font-size: 13px; margin-top: 4px; }
      .frb-bk-deposit .val { color: #FFBC7D; }
      .frb-bk-submit {
        display: block; width: 100%; background: #151515; color: #fff; border: none;
        font-family: 'Montserrat', sans-serif; font-size: 13px; font-weight: 500;
        text-transform: uppercase; letter-spacing: 3px; text-align: center;
        padding: 16px 20px; cursor: pointer; transition: background .2s; margin-top: 8px;
      }
      .frb-bk-submit:hover { background: #333; }
      .frb-bk-submit:disabled { background: #aaa; cursor: not-allowed; }

      /* RIGHT SIDEBAR — dark with accordions */
      .frb-bk-sidebar {
        background: #1a1a1a; padding: 48px 40px; color: #fff; align-self: stretch;
      }
      @media (max-width: 600px) { .frb-bk-sidebar { padding: 32px 20px; } }
      .frb-bk-sidebar-title {
        font-family: 'Spinnaker', sans-serif; font-size: 20px; font-weight: 400;
        color: #fff; margin: 0 0 28px; letter-spacing: 0.5px;
      }
      .frb-bk-acc { border-bottom: 1px solid rgba(255,255,255,.1); }
      .frb-bk-acc-head {
        display: flex; justify-content: space-between; align-items: center;
        padding: 16px 0; cursor: pointer; user-select: none;
      }
      .frb-bk-acc-head span {
        font-family: 'Montserrat', sans-serif; font-size: 13px; font-weight: 600;
        color: rgba(255,255,255,.85); letter-spacing: 0.3px;
      }
      .frb-bk-acc-icon {
        font-family: sans-serif; font-size: 18px; font-weight: 300;
        color: rgba(255,255,255,.5); transition: transform .2s; line-height: 1;
      }
      .frb-bk-acc-body {
        max-height: 0; overflow: hidden; transition: max-height .3s ease, padding .3s ease;
        padding: 0 0;
      }
      .frb-bk-acc-body.open { max-height: 500px; padding: 0 0 16px; }
      .frb-bk-acc-body ul {
        list-style: disc; padding-left: 18px; margin: 0;
      }
      .frb-bk-acc-body li {
        font-family: 'Montserrat', sans-serif; font-size: 13px; line-height: 1.9;
        color: rgba(255,255,255,.6); margin-bottom: 2px;
      }

      .frb-bk-confirm { text-align: center; padding: 60px 20px; grid-column: 1 / -1; }
      .frb-bk-confirm .chk {
        width: 64px; height: 64px; border-radius: 50%; background: #042E28;
        display: flex; align-items: center; justify-content: center; margin: 0 auto 24px;
      }
      .frb-bk-confirm h2 { font-family: 'Roboto Slab', serif; font-size: 26px; font-weight: 400; color: #363636; margin: 0 0 12px; }
      .frb-bk-confirm p { font-size: 14px; line-height: 1.8; color: #888; max-width: 500px; margin: 0 auto 24px; font-family: 'Montserrat', sans-serif; }
      .frb-bk-confirm .btn-back {
        display: inline-block; background: #042E28; color: #fff;
        font-family: 'Montserrat', sans-serif; font-size: 12px; text-transform: uppercase;
        letter-spacing: 3px; padding: 14px 40px; text-decoration: none; transition: opacity .2s;
      }
      .frb-bk-confirm .btn-back:hover { opacity: .85; }

      .frb-bk-footer {
        background: #042E28; padding: 32px 40px; text-align: center;
      }
      .frb-bk-footer p { font-family: 'Montserrat', sans-serif; font-size: 12px; color: rgba(255,255,255,.45); margin: 0; }
    </style>

    <div class="frb-bk-header">
      <a href="/index.html"><img src="/wp-content/uploads/2021/10/LOGO-FRB-10.svg" alt="For Rent Barbados"></a>
      <button class="frb-bk-close" id="frb-bk-close-btn">&times;</button>
    </div>

    <div class="frb-bk-hero">
      <h1>Booking reservation</h1>
    </div>

    <div class="frb-bk-content" id="frb-bk-content">
      <!-- LEFT: Form + Summary -->
      <div class="frb-bk-form">
        <div class="frb-bk-summary">
          <h3>Booking Summary</h3>
          <div class="frb-bk-srow"><span class="lbl">Property</span><span class="val">${propertyName}</span></div>
          <div class="frb-bk-srow"><span class="lbl">Check-in</span><span class="val">${fmtDate(checkIn)}</span></div>
          <div class="frb-bk-srow"><span class="lbl">Check-out</span><span class="val">${fmtDate(checkOut)}</span></div>
          <div class="frb-bk-srow"><span class="lbl">Nights</span><span class="val">${nights}</span></div>
          <div class="frb-bk-srow"><span class="lbl">Guests</span><span class="val">${adults}</span></div>
          <div class="frb-bk-srow frb-bk-total"><span class="lbl">Estimated Total</span><span class="val" id="frb-sum-total">Loading…</span></div>
          <div class="frb-bk-srow frb-bk-deposit"><span class="lbl">50% Deposit Due</span><span class="val" id="frb-sum-deposit">—</span></div>
        </div>

        <h2>Your Details</h2>
        <form id="frb-bk-form">
          <div class="frb-bk-grid">
            <div class="frb-bk-row"><label>First Name *</label><input type="text" id="frb-firstName" required></div>
            <div class="frb-bk-row"><label>Last Name *</label><input type="text" id="frb-lastName" required></div>
          </div>
          <div class="frb-bk-grid">
            <div class="frb-bk-row"><label>Email Address *</label><input type="email" id="frb-email" required></div>
            <div class="frb-bk-row"><label>Phone Number</label><input type="tel" id="frb-phone"></div>
          </div>
          <div class="frb-bk-grid">
            <div class="frb-bk-row"><label>Adults</label><select id="frb-adults">${adultsOpts}</select></div>
            <div class="frb-bk-row"><label>Children</label>
              <select id="frb-children"><option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option></select>
            </div>
          </div>
          <div class="frb-bk-row"><label>Special Requests / Notes</label><textarea id="frb-message" placeholder="Any special requirements or questions..."></textarea></div>
          <button type="submit" class="frb-bk-submit" id="frb-bk-submit">Confirm Booking Enquiry</button>
          <p style="font-size:11px;color:#999;text-align:center;margin-top:14px;font-family:'Montserrat',sans-serif;">You won't be charged yet. We'll confirm availability and send payment details.</p>
        </form>
      </div>

      <!-- RIGHT: Dark sidebar with accordion policies -->
      <div class="frb-bk-sidebar">
        <p class="frb-bk-sidebar-title">Terms &amp; Conditions</p>

        <div class="frb-bk-acc">
          <div class="frb-bk-acc-head" onclick="this.querySelector('.frb-bk-acc-icon').textContent=this.nextElementSibling.classList.toggle('open')?'−':'+';"><span>Payment Terms</span><span class="frb-bk-acc-icon">+</span></div>
          <div class="frb-bk-acc-body"><ul>
            <li>50% non-refundable deposit to confirm the booking</li>
            <li>Final 50% due 60 days before arrival</li>
            <li>Full payment required if booking within 60 days</li>
          </ul></div>
        </div>

        <div class="frb-bk-acc">
          <div class="frb-bk-acc-head" onclick="this.querySelector('.frb-bk-acc-icon').textContent=this.nextElementSibling.classList.toggle('open')?'−':'+';"><span>Cancellation Policy</span><span class="frb-bk-acc-icon">+</span></div>
          <div class="frb-bk-acc-body"><ul>
            <li>Cancellations &gt;60 days: Refund minus 50% deposit</li>
            <li>&lt;60 days: No refund</li>
            <li>Refunds exclude bank/FX charges</li>
          </ul></div>
        </div>

        <div class="frb-bk-acc">
          <div class="frb-bk-acc-head" onclick="this.querySelector('.frb-bk-acc-icon').textContent=this.nextElementSibling.classList.toggle('open')?'−':'+';"><span>Damage &amp; Liability</span><span class="frb-bk-acc-icon">+</span></div>
          <div class="frb-bk-acc-body"><ul>
            <li>Covered up to USD$500 via Truvi Insurance</li>
            <li>You are responsible for any additional damages or losses</li>
          </ul></div>
        </div>

        <div class="frb-bk-acc">
          <div class="frb-bk-acc-head" onclick="this.querySelector('.frb-bk-acc-icon').textContent=this.nextElementSibling.classList.toggle('open')?'−':'+';"><span>House Rules</span><span class="frb-bk-acc-icon">+</span></div>
          <div class="frb-bk-acc-body"><ul>
            <li>No more than 2 guests per room</li>
            <li>No events, parties, or indoor smoking</li>
            <li>Visitors: max 2 allowed during the day only</li>
            <li>Check-In: 3 PM | Check-Out: 11 AM</li>
            <li>Maintain property as found – clean and damage-free</li>
            <li>You're responsible for bank fees or exchange rate differences</li>
          </ul></div>
        </div>

        <div class="frb-bk-acc">
          <div class="frb-bk-acc-head" onclick="this.querySelector('.frb-bk-acc-icon').textContent=this.nextElementSibling.classList.toggle('open')?'−':'+';"><span>Additional Info</span><span class="frb-bk-acc-icon">+</span></div>
          <div class="frb-bk-acc-body"><ul>
            <li>Concierge services (e.g., groceries, transport) at guest's cost</li>
            <li>Rental Agent not liable for injuries, personal loss, or utility failures</li>
            <li>Breach of terms may lead to eviction without refund</li>
            <li>If double-booked, similar options or full refund offered</li>
          </ul></div>
        </div>

        <div class="frb-bk-acc">
          <div class="frb-bk-acc-head" onclick="this.querySelector('.frb-bk-acc-icon').textContent=this.nextElementSibling.classList.toggle('open')?'−':'+';"><span>Legal Note</span><span class="frb-bk-acc-icon">+</span></div>
          <div class="frb-bk-acc-body"><ul>
            <li>Agreement governed by Barbados law</li>
            <li>Rental Agent not liable for claims, damages, or legal disputes</li>
          </ul></div>
        </div>
      </div>
    </div>

    <div class="frb-bk-footer"><p>© 2026 For Rent Barbados. All rights reserved.</p></div>
  `;

  document.body.appendChild(overlay);
  document.body.style.overflow = "hidden";

  // Close button
  document.getElementById("frb-bk-close-btn").addEventListener("click", function () {
    overlay.remove();
    document.body.style.overflow = "";
  });

  // Fetch pricing
  let totalWithTax = null;
  let deposit50 = null;
  if (slug && nights > 0) {
    fetch(`${SUPABASE_URL}/functions/v1/pricing?propertySlug=${slug}&checkIn=${checkIn}&checkOut=${checkOut}`)
      .then(r => r.json())
      .then(data => {
        if (data && data.totalPrice && !data.notConfigured) {
          totalWithTax = Math.round(data.totalPrice * (1 + TAX_RATE) * 100) / 100;
          deposit50 = Math.round(totalWithTax * 0.5 * 100) / 100;
          document.getElementById("frb-sum-total").textContent = "$" + totalWithTax.toLocaleString(undefined, { maximumFractionDigits: 2 });
          document.getElementById("frb-sum-deposit").textContent = "$" + deposit50.toLocaleString(undefined, { maximumFractionDigits: 2 });
        } else {
          document.getElementById("frb-sum-total").textContent = "Contact for price";
        }
      })
      .catch(() => {
        document.getElementById("frb-sum-total").textContent = "Contact for price";
      });
  }

  // Form submission
  document.getElementById("frb-bk-form").addEventListener("submit", async function (ev) {
    ev.preventDefault();
    const btn = document.getElementById("frb-bk-submit");
    btn.disabled = true;
    btn.textContent = "Sending…";

    const payload = {
      firstName: document.getElementById("frb-firstName").value.trim(),
      lastName:  document.getElementById("frb-lastName").value.trim(),
      email:     document.getElementById("frb-email").value.trim(),
      phone:     document.getElementById("frb-phone").value.trim(),
      adults:    parseInt(document.getElementById("frb-adults").value),
      children:  parseInt(document.getElementById("frb-children").value),
      message:   document.getElementById("frb-message").value.trim(),
      property:  propertyName,
      checkIn, checkOut, nights, totalWithTax, deposit50,
    };

    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/booking-enquiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${SUPABASE_ANON}` },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("fail");
    } catch (err) {
      // Fallback: mailto
      const subj = encodeURIComponent("Booking Enquiry – " + propertyName);
      const body = encodeURIComponent(
        "Name: " + payload.firstName + " " + payload.lastName + "\n" +
        "Email: " + payload.email + "\nPhone: " + payload.phone + "\n" +
        "Property: " + propertyName + "\nCheck-in: " + checkIn + "\nCheck-out: " + checkOut + "\n" +
        "Nights: " + nights + "\nAdults: " + payload.adults + "\nChildren: " + payload.children + "\n" +
        "Total: $" + (totalWithTax || "TBD") + "\n\nMessage: " + payload.message
      );
      window.open("mailto:maisha@forrentbarbados.com?subject=" + subj + "&body=" + body, "_self");
    }

    // Show confirmation
    const fmtLong = (d) => { try { return new Date(d + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }); } catch { return d; } };
    document.getElementById("frb-bk-content").innerHTML = `
      <div class="frb-bk-confirm">
        <div class="chk">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
        <h2>Thank You!</h2>
        <p>Your booking enquiry for <strong>${propertyName}</strong> has been received.<br>
        We'll review availability and get back to you within 24 hours with confirmation and payment details.</p>
        <p><strong>${fmtLong(checkIn)}</strong> to <strong>${fmtLong(checkOut)}</strong> · ${nights} night${nights !== 1 ? "s" : ""}</p>
        <a href="/index.html" class="btn-back">Back to Home</a>
      </div>
    `;
  });
}
