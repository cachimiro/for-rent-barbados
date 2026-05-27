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
      #frb-booking-overlay {
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        z-index: 99999; background: #fff; overflow-y: auto;
      }
      #frb-booking-overlay * { box-sizing: border-box; }
      .frb-bk-header {
        background: #042E28; padding: 16px 40px;
        display: flex; align-items: center; justify-content: space-between;
      }
      .frb-bk-header img { height: 40px; }
      .frb-bk-close {
        background: none; border: none; color: #fff; font-size: 28px;
        cursor: pointer; font-family: sans-serif; line-height: 1; padding: 4px 12px;
      }
      .frb-bk-close:hover { opacity: .7; }
      .frb-bk-title-bar {
        background: #042E28; padding: 24px 40px 32px; text-align: center;
      }
      .frb-bk-title-bar h1 {
        font-family: 'Roboto Slab', 'Times New Roman', serif;
        font-size: 28px; font-weight: 400; color: #fff; margin: 0 0 6px;
      }
      .frb-bk-title-bar p {
        font-family: 'Montserrat', sans-serif; font-size: 14px;
        color: rgba(255,255,255,.6); margin: 0;
      }
      .frb-bk-content {
        max-width: 1100px; margin: 0 auto; padding: 48px 40px 80px;
        display: grid; grid-template-columns: 1fr 360px; gap: 48px;
      }
      @media (max-width: 860px) {
        .frb-bk-content { grid-template-columns: 1fr; padding: 28px 20px 60px; }
      }
      .frb-bk-form h2 {
        font-family: 'Roboto Slab', 'Times New Roman', serif;
        font-size: 22px; font-weight: 400; color: #363636; margin: 0 0 24px;
      }
      .frb-bk-row { margin-bottom: 18px; }
      .frb-bk-row label {
        display: block; font-family: 'Poppins', sans-serif; font-size: 10px;
        text-transform: uppercase; letter-spacing: 1px; color: #888; margin-bottom: 6px;
      }
      .frb-bk-row input, .frb-bk-row select, .frb-bk-row textarea {
        width: 100%; border: 1px solid #EAEAEA; padding: 10px 12px;
        font-family: 'Montserrat', sans-serif; font-size: 13px; color: #363636;
        outline: none; background: #fff; border-radius: 0;
      }
      .frb-bk-row textarea { resize: vertical; min-height: 80px; }
      .frb-bk-row input:focus, .frb-bk-row select:focus, .frb-bk-row textarea:focus { border-color: #042E28; }
      .frb-bk-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
      @media (max-width: 500px) { .frb-bk-grid { grid-template-columns: 1fr; } }
      .frb-bk-submit {
        display: block; width: 100%; background: #1a1a1a; color: #fff; border: none;
        font-family: 'Poppins', sans-serif; font-size: 13px; font-weight: 400;
        text-transform: uppercase; letter-spacing: 4.2px; text-align: center;
        padding: 16px 20px; cursor: pointer; transition: opacity .2s; margin-top: 8px;
      }
      .frb-bk-submit:hover { opacity: .85; }
      .frb-bk-submit:disabled { background: #aaa; cursor: not-allowed; }

      .frb-bk-sidebar { background: #1a1a1a; padding: 32px 28px; color: #fff; align-self: start; }
      .frb-bk-sidebar h3 {
        font-family: 'Roboto Slab', 'Times New Roman', serif; font-size: 18px;
        font-weight: 400; margin: 0 0 20px; padding-bottom: 12px;
        border-bottom: 1px solid rgba(255,255,255,.15);
      }
      .frb-bk-srow { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 10px; font-size: 13px; }
      .frb-bk-srow .lbl { color: rgba(255,255,255,.6); }
      .frb-bk-srow .val { font-weight: 500; }
      .frb-bk-total { margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,.15); font-size: 16px; font-weight: 600; }
      .frb-bk-deposit { font-size: 13px; color: #FFBC7D; margin-top: 6px; }

      .frb-bk-policy { margin-top: 24px; }
      .frb-bk-policy h4 {
        font-family: 'Poppins', sans-serif; font-size: 10px; text-transform: uppercase;
        letter-spacing: 1.5px; color: rgba(255,255,255,.5); margin: 0; padding: 10px 0;
        cursor: pointer; display: flex; justify-content: space-between; align-items: center;
        border-bottom: 1px solid rgba(255,255,255,.08);
      }
      .frb-bk-policy h4::after { content: '▾'; font-size: 11px; }
      .frb-bk-policy h4.open::after { content: '▴'; }
      .frb-bk-policy-body {
        display: none; font-size: 12px; line-height: 1.7; color: rgba(255,255,255,.6);
        padding: 10px 0 16px;
      }
      .frb-bk-policy-body.open { display: block; }

      .frb-bk-confirm { text-align: center; padding: 60px 20px; grid-column: 1 / -1; }
      .frb-bk-confirm .chk {
        width: 64px; height: 64px; border-radius: 50%; background: #042E28;
        display: flex; align-items: center; justify-content: center; margin: 0 auto 24px;
      }
      .frb-bk-confirm h2 { font-family: 'Roboto Slab', serif; font-size: 26px; font-weight: 400; color: #363636; margin: 0 0 12px; }
      .frb-bk-confirm p { font-size: 14px; line-height: 1.8; color: #888; max-width: 500px; margin: 0 auto 24px; }
      .frb-bk-confirm .btn-back {
        display: inline-block; background: #042E28; color: #fff;
        font-family: 'Poppins', sans-serif; font-size: 12px; text-transform: uppercase;
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
    <div class="frb-bk-title-bar">
      <h1>Booking Reservation</h1>
      <p>${propertyName}</p>
    </div>

    <div class="frb-bk-content" id="frb-bk-content">
      <div class="frb-bk-form">
        <h2>Guest Details</h2>
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
          <div class="frb-bk-row"><label>Special Requests / Notes</label><textarea id="frb-message" placeholder="Any special requirements..."></textarea></div>
          <button type="submit" class="frb-bk-submit" id="frb-bk-submit">Confirm Booking Enquiry</button>
          <p style="font-size:11px;color:#aaa;text-align:center;margin-top:12px;">You won't be charged yet. We'll confirm availability and send payment details.</p>
        </form>
      </div>

      <div class="frb-bk-sidebar">
        <h3>Booking Summary</h3>
        <div class="frb-bk-srow"><span class="lbl">Property</span><span class="val">${propertyName}</span></div>
        <div class="frb-bk-srow"><span class="lbl">Check-in</span><span class="val">${fmtDate(checkIn)}</span></div>
        <div class="frb-bk-srow"><span class="lbl">Check-out</span><span class="val">${fmtDate(checkOut)}</span></div>
        <div class="frb-bk-srow"><span class="lbl">Nights</span><span class="val">${nights}</span></div>
        <div class="frb-bk-srow"><span class="lbl">Guests</span><span class="val">${adults}</span></div>
        <div class="frb-bk-srow frb-bk-total"><span class="lbl">Estimated Total</span><span class="val" id="frb-sum-total">Loading…</span></div>
        <div class="frb-bk-srow frb-bk-deposit"><span class="lbl">50% Deposit Due</span><span class="val" id="frb-sum-deposit">—</span></div>

        <div class="frb-bk-policy">
          <h4 onclick="this.classList.toggle('open');this.nextElementSibling.classList.toggle('open')">Payment Terms</h4>
          <div class="frb-bk-policy-body">A 50% deposit is required to confirm the booking. The remaining balance is due 30 days before arrival. For bookings made within 30 days of arrival, full payment is required at the time of booking.</div>
        </div>
        <div class="frb-bk-policy">
          <h4 onclick="this.classList.toggle('open');this.nextElementSibling.classList.toggle('open')">Cancellation Policy</h4>
          <div class="frb-bk-policy-body">Cancellations made more than 30 days before check-in receive a full refund of the deposit minus a 10% administration fee. Cancellations within 30 days of check-in are non-refundable.</div>
        </div>
        <div class="frb-bk-policy">
          <h4 onclick="this.classList.toggle('open');this.nextElementSibling.classList.toggle('open')">House Rules</h4>
          <div class="frb-bk-policy-body">Check-in: 3:00 PM – Check-out: 11:00 AM. No smoking indoors. No parties or events. Pets allowed on request only.</div>
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
