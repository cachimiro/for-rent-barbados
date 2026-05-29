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
    try { return new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }); }
    catch { return d; }
  };

  // Generate per-night date rows
  let dateRows = "";
  const ci = new Date(checkIn + "T00:00:00");
  for (let i = 0; i < nights; i++) {
    const dt = new Date(ci.getTime() + i * 86400000);
    const label = dt.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    dateRows += `<tr class="frb-pr-date"><td>${label}</td><td id="frb-night-${i}">—</td></tr>`;
  }

  // Country options
  const countries = ["Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda","Argentina","Armenia","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cabo Verde","Cambodia","Cameroon","Canada","Central African Republic","Chad","Chile","China","Colombia","Comoros","Congo","Costa Rica","Croatia","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini","Ethiopia","Fiji","Finland","France","Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea-Bissau","Guyana","Haiti","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati","Korea (North)","Korea (South)","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Macedonia","Norway","Oman","Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Qatar","Romania","Russia","Rwanda","Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Sudan","Spain","Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor-Leste","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe"];
  let countryOpts = '<option value="">Select country...</option>';
  countries.forEach(c => { countryOpts += `<option value="${c}">${c}</option>`; });

  // Create overlay
  const overlay = document.createElement("div");
  overlay.id = "frb-booking-overlay";
  overlay.innerHTML = `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Spinnaker&family=Montserrat:wght@300;400;500;600;700&family=Roboto+Slab:wght@300;400;500&family=Lato:wght@300;400;700&display=swap');
      #frb-booking-overlay {
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        z-index: 99999; background: #fff; overflow-y: auto;
      }
      #frb-booking-overlay * { box-sizing: border-box; }
      .frb-bk-header {
        position: relative; z-index: 2;
        background: transparent; padding: 0; text-align: center;
      }
      .frb-bk-header-logo {
        display: block; margin: 0 auto; padding: 20px 0 10px;
      }
      .frb-bk-header-logo img { height: 50px; }
      .frb-bk-nav {
        display: flex; justify-content: center; align-items: center;
        gap: 8px; padding: 8px 20px 16px; flex-wrap: wrap;
      }
      .frb-bk-nav a {
        font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 500;
        color: #fff; text-decoration: none; text-transform: uppercase;
        letter-spacing: 1.5px; padding: 8px 14px; transition: opacity .2s;
      }
      .frb-bk-nav a:hover { opacity: .7; }
      .frb-bk-nav a.frb-nav-outline {
        border: 1px solid #fff; padding: 6px 18px;
      }
      .frb-bk-close {
        position: absolute; top: 16px; right: 20px; background: none; border: none;
        color: #fff; font-size: 28px; cursor: pointer; font-family: sans-serif;
        line-height: 1; padding: 4px 12px; z-index: 3;
      }
      .frb-bk-close:hover { opacity: .7; }
      .frb-bk-hero-wrap {
        background: linear-gradient(rgba(15,30,55,.50), rgba(15,30,55,.45)),
                    url('/wp-content/uploads/2025/04/banner.jpg') center/cover no-repeat;
        min-height: 280px; display: flex; flex-direction: column;
      }
      .frb-bk-hero {
        flex: 1; display: flex; align-items: center; justify-content: center;
        padding: 20px 40px 50px; text-align: center;
      }
      .frb-bk-hero h1 {
        font-family: 'Spinnaker', sans-serif; font-size: 42px; font-weight: 400;
        color: #fff; margin: 0; letter-spacing: 1px; font-style: italic;
      }
      @media (max-width: 768px) {
        .frb-bk-nav { gap: 4px; }
        .frb-bk-nav a { font-size: 10px; padding: 6px 8px; letter-spacing: 1px; }
        .frb-bk-hero { padding: 20px 20px 40px; }
        .frb-bk-hero h1 { font-size: 28px; }
      }

      /* MAIN CONTENT GRID */
      .frb-bk-content {
        display: grid; grid-template-columns: 3fr 2fr; gap: 0;
        max-width: 1400px; margin: 0 auto;
      }
      @media (max-width: 960px) { .frb-bk-content { grid-template-columns: 1fr; } }

      /* LEFT COLUMN */
      .frb-bk-left { padding: 40px 60px 60px; background: #fff; }
      @media (max-width: 600px) { .frb-bk-left { padding: 24px 20px 40px; } }

      /* PRICE BREAKDOWN TABLE */
      .frb-pr-title {
        font-family: 'Lato', sans-serif; font-size: 28px; font-weight: 300;
        color: #363636; margin: 0 0 24px; line-height: 1.3;
      }
      .frb-pr-prop {
        display: flex; justify-content: space-between; align-items: baseline;
        padding: 8px 0; border-bottom: 1px solid #eee; margin-bottom: 4px;
      }
      .frb-pr-prop-name {
        font-family: 'Lato', sans-serif; font-size: 15px; color: #363636;
      }
      .frb-pr-prop-price {
        font-family: 'Lato', sans-serif; font-size: 15px; font-weight: 400; color: #363636;
      }
      .frb-pr-rate {
        font-family: 'Lato', sans-serif; font-size: 13px; color: #888; margin: 4px 0 12px;
      }
      .frb-pr-table {
        width: 100%; border-collapse: collapse; font-family: 'Lato', sans-serif; font-size: 14px;
        margin-bottom: 0;
      }
      .frb-pr-table td { padding: 6px 0; color: #555; }
      .frb-pr-table td:last-child { text-align: right; }
      .frb-pr-table tr.frb-pr-bold td { font-weight: 700; color: #363636; padding-top: 10px; }
      .frb-pr-table tr.frb-pr-header td {
        font-weight: 700; color: #363636; padding-top: 16px; padding-bottom: 6px;
        border-bottom: 1px solid #eee; font-size: 13px;
      }
      .frb-pr-table tr.frb-pr-total td {
        font-weight: 700; color: #363636; font-size: 15px; padding-top: 12px;
        border-top: 2px solid #363636;
      }
      .frb-pr-divider { border: none; border-top: 1px solid #eee; margin: 24px 0; }

      /* YOUR INFORMATION SECTION */
      .frb-info-title {
        font-family: 'Lato', sans-serif; font-size: 28px; font-weight: 300;
        color: #363636; margin: 0 0 8px;
      }
      .frb-info-req {
        font-family: 'Lato', sans-serif; font-size: 13px; color: #888; margin: 0 0 24px;
      }
      .frb-field { margin-bottom: 24px; }
      .frb-field label {
        display: block; font-family: 'Lato', sans-serif; font-size: 14px;
        color: #555; margin-bottom: 8px;
      }
      .frb-field input, .frb-field select, .frb-field textarea {
        width: 100%; border: 1px solid #d3d3d3; border-radius: 5px; padding: 12px 14px;
        font-family: 'Lato', sans-serif; font-size: 15px; color: #363636;
        outline: none; background: #fff; transition: border-color .2s;
        -webkit-appearance: none; appearance: none;
      }
      .frb-field select {
        background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23999' stroke-width='1.5' fill='none'/%3E%3C/svg%3E") no-repeat right 14px center;
        padding-right: 36px;
      }
      .frb-field textarea { resize: vertical; min-height: 120px; }
      .frb-field input:focus, .frb-field select:focus, .frb-field textarea:focus { border-color: #042E28; }

      /* PAYMENT METHOD */
      .frb-pay-title {
        font-family: 'Lato', sans-serif; font-size: 28px; font-weight: 300;
        color: #363636; margin: 0 0 20px;
      }
      .frb-pay-method {
        font-family: 'Lato', sans-serif; font-size: 15px; font-weight: 700; color: #363636;
        margin: 0 0 4px;
      }
      .frb-pay-desc {
        font-family: 'Lato', sans-serif; font-size: 14px; color: #888; margin: 0 0 0;
      }
      .frb-pay-total-row {
        display: flex; justify-content: space-between; align-items: baseline;
        padding: 20px 0; margin: 24px 0;
        border-top: 1px solid #eee; border-bottom: 1px solid #eee;
      }
      .frb-pay-total-label { font-family: 'Lato', sans-serif; font-size: 16px; color: #363636; }
      .frb-pay-total-val { font-family: 'Lato', sans-serif; font-size: 18px; font-weight: 700; color: #363636; }
      .frb-terms-row {
        display: flex; align-items: flex-start; gap: 10px; margin: 24px 0 28px;
        font-family: 'Lato', sans-serif; font-size: 14px; color: #555;
      }
      .frb-terms-row input[type="checkbox"] {
        width: 18px; height: 18px; margin-top: 2px; cursor: pointer;
        accent-color: #042E28; flex-shrink: 0;
      }
      .frb-terms-row a { color: #363636; font-weight: 700; text-decoration: underline; }
      .frb-bk-submit {
        display: block; width: 100%; max-width: 560px;
        background: #042E28; color: #fff; border: none;
        font-family: 'Lato', sans-serif; font-size: 15px; font-weight: 400;
        text-align: center; padding: 16px 20px; cursor: pointer;
        border-radius: 5px; transition: background .2s; margin-top: 0;
      }
      .frb-bk-submit:hover { background: #064e42; }
      .frb-bk-submit:disabled { background: #aaa; cursor: not-allowed; }

      /* ADDITIONAL SERVICES */
      .frb-svc-title {
        font-family: 'Lato', sans-serif; font-size: 28px; font-weight: 300;
        color: #363636; margin: 0 0 20px;
      }
      .frb-svc-item {
        display: flex; align-items: flex-start; gap: 10px; padding: 8px 0;
        font-family: 'Lato', sans-serif; font-size: 15px; color: #363636;
      }
      .frb-svc-item input[type="checkbox"] {
        width: 18px; height: 18px; margin-top: 3px; cursor: pointer;
        accent-color: #042E28; flex-shrink: 0;
      }
      .frb-svc-item label { cursor: pointer; line-height: 1.5; }
      .frb-svc-item label em { font-style: italic; color: #555; }
      .frb-svc-item label strong { font-weight: 700; }
      .frb-svc-sub {
        font-family: 'Lato', sans-serif; font-size: 13px; color: #999;
        margin: 0 0 0 28px; line-height: 1.4;
      }
      .frb-svc-sub.red { color: #e74c3c; }
      .frb-svc-days {
        display: inline-flex; align-items: center; gap: 6px; margin-left: 8px;
      }
      .frb-svc-days input {
        width: 50px; border: 1px solid #d3d3d3; padding: 4px 6px;
        font-family: 'Lato', sans-serif; font-size: 14px; text-align: center;
        outline: none; border-radius: 3px;
      }
      .frb-svc-days span { font-family: 'Lato', sans-serif; font-size: 15px; }
      .frb-svc-link { color: #042E28; font-weight: 700; text-decoration: underline; }

      /* COUPON CODE */
      .frb-coupon-title {
        font-family: 'Lato', sans-serif; font-size: 14px; color: #555; margin: 0 0 8px;
      }
      .frb-coupon-row { display: flex; gap: 0; margin-bottom: 0; }
      .frb-coupon-row input {
        flex: 1; border: 1px solid #d3d3d3; border-radius: 5px 0 0 5px; padding: 10px 14px;
        font-family: 'Lato', sans-serif; font-size: 14px; outline: none;
      }
      .frb-coupon-btn {
        background: #042E28; color: #fff; border: none; padding: 10px 24px;
        font-family: 'Lato', sans-serif; font-size: 14px; font-weight: 400;
        cursor: pointer; border-radius: 0 5px 5px 0; transition: background .2s;
      }
      .frb-coupon-btn:hover { background: #064e42; }

      /* TERMS MODAL */
      .frb-terms-modal {
        display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        z-index: 100000; background: rgba(0,0,0,.6);
        justify-content: center; align-items: center; padding: 20px;
      }
      .frb-terms-modal.open { display: flex; }
      .frb-terms-modal-inner {
        background: #fff; max-width: 700px; width: 100%; max-height: 85vh;
        overflow-y: auto; border-radius: 8px; padding: 40px;
        position: relative; box-shadow: 0 20px 60px rgba(0,0,0,.3);
      }
      .frb-terms-modal-close {
        position: absolute; top: 16px; right: 20px; background: none; border: none;
        font-size: 24px; cursor: pointer; color: #555; line-height: 1;
      }
      .frb-terms-modal-inner h2 {
        font-family: 'Lato', sans-serif; font-size: 24px; font-weight: 300;
        color: #363636; margin: 0 0 24px;
      }
      .frb-terms-modal-inner h3 {
        font-family: 'Lato', sans-serif; font-size: 16px; font-weight: 700;
        color: #363636; margin: 24px 0 8px;
      }
      .frb-terms-modal-inner ul {
        list-style: disc; padding-left: 20px; margin: 0 0 8px;
      }
      .frb-terms-modal-inner li {
        font-family: 'Lato', sans-serif; font-size: 14px; line-height: 1.8;
        color: #555; margin-bottom: 2px;
      }
      .frb-terms-error {
        font-family: 'Lato', sans-serif; font-size: 13px; color: #e74c3c;
        margin: 8px 0 0 28px; display: none;
      }
      .frb-terms-error.show { display: block; }

      /* RIGHT SIDEBAR */
      .frb-bk-sidebar {
        background: #1a1a1a; padding: 48px 40px; color: #fff; align-self: stretch;
      }
      @media (max-width: 960px) { .frb-bk-sidebar { padding: 32px 20px; } }
      .frb-bk-acc { border-bottom: 1px solid rgba(255,255,255,.12); }
      .frb-bk-acc:first-child { border-top: 1px solid rgba(255,255,255,.12); }
      .frb-bk-acc-head {
        display: flex; justify-content: space-between; align-items: center;
        padding: 18px 0; cursor: pointer; user-select: none;
      }
      .frb-bk-acc-head span:first-child {
        font-family: 'Lato', sans-serif; font-size: 15px; font-weight: 700;
        color: #fff; letter-spacing: 0.3px;
      }
      .frb-bk-acc-icon {
        font-size: 18px; font-weight: 300; width: 20px; text-align: center;
        color: rgba(255,255,255,.6); line-height: 1;
      }
      .frb-bk-acc-body {
        max-height: 0; overflow: hidden; transition: max-height .3s ease;
      }
      .frb-bk-acc-body.open { max-height: 500px; }
      .frb-bk-acc-body ul {
        list-style: disc; padding: 0 0 18px 20px; margin: 0;
      }
      .frb-bk-acc-body li {
        font-family: 'Lato', sans-serif; font-size: 14px; line-height: 1.9;
        color: rgba(255,255,255,.7); margin-bottom: 0;
      }

      /* CONFIRMATION */
      .frb-bk-confirm { text-align: center; padding: 60px 20px; grid-column: 1 / -1; }
      .frb-bk-confirm .chk {
        width: 64px; height: 64px; border-radius: 50%; background: #042E28;
        display: flex; align-items: center; justify-content: center; margin: 0 auto 24px;
      }
      .frb-bk-confirm h2 { font-family: 'Lato', sans-serif; font-size: 28px; font-weight: 300; color: #363636; margin: 0 0 12px; }
      .frb-bk-confirm p { font-family: 'Lato', sans-serif; font-size: 15px; line-height: 1.8; color: #888; max-width: 500px; margin: 0 auto 24px; }
      .frb-bk-confirm .btn-back {
        display: inline-block; background: #042E28; color: #fff;
        font-family: 'Lato', sans-serif; font-size: 14px;
        padding: 14px 40px; text-decoration: none; border-radius: 5px; transition: background .2s;
      }
      .frb-bk-confirm .btn-back:hover { background: #064e42; }

      .frb-bk-footer { background: #042E28; padding: 32px 40px; text-align: center; }
      .frb-bk-footer p { font-family: 'Lato', sans-serif; font-size: 12px; color: rgba(255,255,255,.45); margin: 0; }
    </style>

    <div class="frb-bk-hero-wrap">
      <div class="frb-bk-header">
        <button class="frb-bk-close" id="frb-bk-close-btn">&times;</button>
        <a href="/index.html" class="frb-bk-header-logo"><img src="/wp-content/uploads/2021/10/LOGO-FRB-10.svg" alt="For Rent Barbados"></a>
        <nav class="frb-bk-nav">
          <a href="/index.html">Home</a>
          <a href="/rentals/index.html">Rentals</a>
          <a href="/concierge/index.html">Concierge</a>
          <a href="/testimonials/index.html">Testimonials</a>
          <a href="/contact/index.html">Contact</a>
          <a href="/volunteer/index.html" class="frb-nav-outline">Volunteer</a>
        </nav>
      </div>
      <div class="frb-bk-hero">
        <h1>Booking Reservation</h1>
      </div>
    </div>

    <div class="frb-bk-content" id="frb-bk-content">
      <!-- LEFT COLUMN -->
      <div class="frb-bk-left">

        <!-- PRICE BREAKDOWN -->
        <h2 class="frb-pr-title">Price Breakdown</h2>
        <div class="frb-pr-prop">
          <span class="frb-pr-prop-name">☐ #1 ${propertyName}</span>
          <span class="frb-pr-prop-price" id="frb-pr-accom-price">—</span>
        </div>
        <p class="frb-pr-rate">Rate: ${propertyName}</p>
        <table class="frb-pr-table">
          <tr><td>Adults</td><td>${adults}</td></tr>
          <tr><td>Nights</td><td>${nights}</td></tr>
          <tr class="frb-pr-header"><td>Dates</td><td>Amount</td></tr>
          ${dateRows}
          <tr class="frb-pr-bold"><td>Accommodation Total</td><td id="frb-pr-accom-total">—</td></tr>
          <tr class="frb-pr-header"><td>Accommodation Taxes</td><td>Amount</td></tr>
          <tr><td>Card Processing Fee</td><td id="frb-pr-card-fee">—</td></tr>
          <tr class="frb-pr-bold"><td>Accommodation Taxes Total</td><td id="frb-pr-tax-total">—</td></tr>
          <tr class="frb-pr-header"><td>Fees</td><td>Amount</td></tr>
          <tr><td>Travel Insurance</td><td id="frb-pr-insurance">$35</td></tr>
          <tr><td>Cleaning Fee</td><td id="frb-pr-cleaning">$75</td></tr>
          <tr><td>Levy</td><td id="frb-pr-levy">—</td></tr>
          <tr class="frb-pr-bold"><td>Fees Total</td><td id="frb-pr-fees-total">—</td></tr>
          <tr class="frb-pr-header"><td>Fee Taxes</td><td>Amount</td></tr>
          <tr><td>Card Processing Fee</td><td id="frb-pr-fee-tax">—</td></tr>
          <tr class="frb-pr-bold"><td>Fee Taxes Total</td><td id="frb-pr-fee-tax-total">—</td></tr>
          <tr class="frb-pr-bold"><td>Subtotal</td><td id="frb-pr-subtotal">—</td></tr>
          <tr><td>Subtotal (excl. taxes)</td><td id="frb-pr-subtotal-ex">—</td></tr>
          <tr><td>Taxes</td><td id="frb-pr-taxes">—</td></tr>
          <tr class="frb-pr-header"><td>Additional Services</td><td>Amount</td></tr>
          <tr><td>Services Total</td><td id="frb-pr-svc-total">$0.00</td></tr>
          <tr class="frb-pr-total"><td>Total</td><td id="frb-pr-grand-total">Loading…</td></tr>
        </table>

        <hr class="frb-pr-divider">

        <!-- CHOOSE ADDITIONAL SERVICES -->
        <h2 class="frb-svc-title">Choose Additional Services</h2>

        <div class="frb-svc-item"><input type="checkbox" id="frb-svc-picnics"><label for="frb-svc-picnics">Personalized Picnics <em>(Price on Request)</em></label></div>
        <p class="frb-svc-sub">Kids Movie Night | Kids Luxury Picnic | Adults Movie Night | Adults Luxury Picnic</p>
        <p class="frb-svc-sub">Starting from: $385 USD</p>

        <div class="frb-svc-item"><input type="checkbox" id="frb-svc-staging"><label for="frb-svc-staging">Home/Villa Staging <em>(Price on Request)</em></label></div>
        <p class="frb-svc-sub">Professional 1-2 hour staging | Kitchen, Bedroom, Living Room, Bathroom &amp; Dining — perfect for special occasions</p>
        <p class="frb-svc-sub">Starting from: $485 BBD</p>

        <div class="frb-svc-item"><input type="checkbox" id="frb-svc-nails"><label for="frb-svc-nails">Nails <em>(Price on Request)</em></label></div>
        <div class="frb-svc-item"><input type="checkbox" id="frb-svc-massage"><label for="frb-svc-massage">Massage <em>(Price on Request)</em></label></div>
        <div class="frb-svc-item"><input type="checkbox" id="frb-svc-hair"><label for="frb-svc-hair">Hair Removal <em>(Price on Request)</em></label></div>

        <div class="frb-svc-item"><input type="checkbox" id="frb-svc-jetcar"><label for="frb-svc-jetcar">Jet Car <em>(Price on Request)</em></label></div>
        <p class="frb-svc-sub">1 passenger + pro driver, $125/15min, $250/30min, $450/hr</p>

        <div class="frb-svc-item"><input type="checkbox" id="frb-svc-yacht-private"><label for="frb-svc-yacht-private">Unseen Barbados Yacht – Private Coastal Charters <em>(Price on Request)</em></label></div>
        <p class="frb-svc-sub">Starting from: $500 USD / HR | MINIMUM 4 RENTAL</p>

        <div class="frb-svc-item"><input type="checkbox" id="frb-svc-yacht-shared"><label for="frb-svc-yacht-shared">Unseen Boat Yacht – Shared Charter <em>(Price on Request)</em></label></div>
        <p class="frb-svc-sub">Starting from: Adults $200 / Children $100 USD | 4 HR Rental</p>

        <div class="frb-svc-item"><input type="checkbox" id="frb-svc-cot"><label for="frb-svc-cot">Pack and Play (Travel Cot) <strong>($10 / Per Day)</strong></label></div>

        <div class="frb-svc-item"><input type="checkbox" id="frb-svc-reservations"><label for="frb-svc-reservations">Reservations &amp; Bookings <em>(Price on Request)</em></label></div>
        <p class="frb-svc-sub">Restaurants, Boat Trips, Excursions &amp; Activities etc</p>

        <div class="frb-svc-item"><input type="checkbox" id="frb-svc-chef"><label for="frb-svc-chef">Private Chef / Cook Services <em>(Price on Request)</em></label></div>
        <div class="frb-svc-item"><input type="checkbox" id="frb-svc-grocery"><label for="frb-svc-grocery">Grocery Shopping &amp; Delivery <em>(Price on Request)</em></label></div>

        <div class="frb-svc-item"><input type="checkbox" id="frb-svc-airport-out"><label for="frb-svc-airport-out">Property to Airport Transfers ( <a href="https://forrentbarbados.com/airport-transfers/" target="_blank" class="frb-svc-link">Fill Booking Form</a> )</label></div>
        <p class="frb-svc-sub red">Please visit the above link to fill out the form for Airport Transfers</p>
        <p class="frb-svc-sub">You won't be charged yet.</p>

        <div class="frb-svc-item"><input type="checkbox" id="frb-svc-airport-in"><label for="frb-svc-airport-in">Airport to Property Transfers ( <a href="https://forrentbarbados.com/airport-transfers/" target="_blank" class="frb-svc-link">Fill Booking Form</a> )</label></div>
        <p class="frb-svc-sub red">Please visit the above link to fill out the form for Airport Transfers</p>
        <p class="frb-svc-sub">You won't be charged yet.</p>

        <div class="frb-svc-item"><input type="checkbox" id="frb-svc-fasttrack"><label for="frb-svc-fasttrack">Fast Track Services ( <a href="https://forrentbarbados.com/fast-track-services/" target="_blank" class="frb-svc-link">Fill Booking Form</a> )</label></div>
        <p class="frb-svc-sub red">Please visit the above link to fill out the form for Fast Track Services</p>
        <p class="frb-svc-sub">You won't be charged yet.</p>

        <div class="frb-svc-item"><input type="checkbox" id="frb-svc-car-suv"><label for="frb-svc-car-suv">Car Rental: SUV <em>(Price on Request)</em> ×</label><span class="frb-svc-days"><input type="number" value="${nights}" min="1" id="frb-svc-suv-days"><span>day(s)</span></span></div>

        <div class="frb-svc-item"><input type="checkbox" id="frb-svc-car-sedan"><label for="frb-svc-car-sedan">Car Rental: Sedan <em>(Price on Request)</em> ×</label><span class="frb-svc-days"><input type="number" value="${nights}" min="1" id="frb-svc-sedan-days"><span>day(s)</span></span></div>

        <div class="frb-svc-item"><input type="checkbox" id="frb-svc-housekeeping"><label for="frb-svc-housekeeping">Additional housekeeping <strong>($90 / Per Day)</strong> ×</label><span class="frb-svc-days"><input type="number" value="1" min="1" id="frb-svc-hk-days"><span>day(s)</span></span></div>

        <hr class="frb-pr-divider">

        <!-- COUPON CODE -->
        <p class="frb-coupon-title">Coupon Code:</p>
        <div class="frb-coupon-row">
          <input type="text" id="frb-coupon" placeholder="">
          <button type="button" class="frb-coupon-btn" id="frb-coupon-apply">Apply</button>
        </div>

        <hr class="frb-pr-divider">

        <!-- YOUR INFORMATION -->
        <h2 class="frb-info-title">Your Information</h2>
        <p class="frb-info-req">Required fields are followed by *</p>

        <form id="frb-bk-form">
          <div class="frb-field"><label>First Name *</label><input type="text" id="frb-firstName" required></div>
          <div class="frb-field"><label>Last Name *</label><input type="text" id="frb-lastName" required></div>
          <div class="frb-field"><label>Email *</label><input type="email" id="frb-email" required></div>
          <div class="frb-field"><label>Phone *</label><input type="tel" id="frb-phone" required></div>
          <div class="frb-field"><label>Country of residence *</label><select id="frb-country" required>${countryOpts}</select></div>
          <div class="frb-field"><label>Notes</label><textarea id="frb-message" placeholder=""></textarea></div>

          <hr class="frb-pr-divider">

          <!-- PAYMENT METHOD -->
          <h2 class="frb-pay-title">Payment Method</h2>
          <p class="frb-pay-method">Visa / Mastercard / Debit Card Payment</p>
          <p class="frb-pay-desc">Secure payment via your preferred card provider.</p>

          <div class="frb-pay-total-row">
            <span class="frb-pay-total-label">Total Price:</span>
            <span class="frb-pay-total-val" id="frb-pay-total">Loading…</span>
          </div>

          <div class="frb-terms-row">
            <input type="checkbox" id="frb-terms">
            <label for="frb-terms">I've read and accept the <a href="#" id="frb-terms-link">terms &amp; conditions</a> *</label>
          </div>
          <p class="frb-terms-error" id="frb-terms-error">You must agree to the terms and conditions before proceeding.</p>

          <button type="submit" class="frb-bk-submit" id="frb-bk-submit">Reserve Now</button>
        </form>
      </div>

      <!-- TERMS MODAL -->
      <div class="frb-terms-modal" id="frb-terms-modal">
        <div class="frb-terms-modal-inner">
          <button class="frb-terms-modal-close" id="frb-terms-modal-close">&times;</button>
          <h2>Terms &amp; Conditions</h2>
          <h3>Payment Terms</h3>
          <ul>
            <li>50% non-refundable deposit to confirm the booking</li>
            <li>Final 50% due 60 days before arrival</li>
            <li>Full payment required if booking within 60 days</li>
          </ul>
          <h3>Cancellation Policy</h3>
          <ul>
            <li>Cancellations &gt;60 days: Refund minus 50% deposit</li>
            <li>&lt;60 days: No refund</li>
            <li>Refunds exclude bank/FX charges</li>
          </ul>
          <h3>Damage &amp; Liability</h3>
          <ul>
            <li>Covered up to USD$500 via Truvi Insurance</li>
            <li>You are responsible for any additional damages or losses</li>
          </ul>
          <h3>House Rules</h3>
          <ul>
            <li>No more than 2 guests per room</li>
            <li>No events, parties, or indoor smoking</li>
            <li>Visitors: max 2 allowed during the day only</li>
            <li>Check-In: 3 PM | Check-Out: 11 AM</li>
            <li>Maintain property as found – clean and damage-free</li>
            <li>You're responsible for bank fees or exchange rate differences</li>
          </ul>
          <h3>Additional Info</h3>
          <ul>
            <li>Concierge services (e.g., groceries, transport) at guest's cost</li>
            <li>Rental Agent not liable for injuries, personal loss, or utility failures</li>
            <li>Breach of terms may lead to eviction without refund</li>
            <li>If double-booked, similar options or full refund offered</li>
          </ul>
          <h3>Legal Note</h3>
          <ul>
            <li>Agreement governed by Barbados law</li>
            <li>Rental Agent not liable for claims, damages, or legal disputes</li>
          </ul>
        </div>
      </div>

      <!-- RIGHT SIDEBAR -->
      <div class="frb-bk-sidebar">
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

  // Terms modal
  document.getElementById("frb-terms-link").addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById("frb-terms-modal").classList.add("open");
  });
  document.getElementById("frb-terms-modal-close").addEventListener("click", function () {
    document.getElementById("frb-terms-modal").classList.remove("open");
  });
  document.getElementById("frb-terms-modal").addEventListener("click", function (e) {
    if (e.target === this) this.classList.remove("open");
  });
  // Hide error when checkbox toggled
  document.getElementById("frb-terms").addEventListener("change", function () {
    document.getElementById("frb-terms-error").classList.remove("show");
  });

  let totalWithTax = null;
  let deposit50 = null;
  let baseGrandTotal = 0;
  const INSURANCE = 35;
  const CLEANING = 75;
  const CARD_FEE_RATE = 0.06; // 6%

  if (slug && nights > 0) {
    fetch(`${SUPABASE_URL}/functions/v1/pricing?propertySlug=${slug}&checkIn=${checkIn}&checkOut=${checkOut}`)
      .then(r => r.json())
      .then(data => {
        if (data && data.totalPrice && !data.notConfigured) {
          const accomTotal = data.totalPrice;
          const perNight = Math.round(accomTotal / nights * 100) / 100;

          // Fill per-night rows
          for (let i = 0; i < nights; i++) {
            const el = document.getElementById("frb-night-" + i);
            if (el) el.textContent = "$" + perNight.toLocaleString(undefined, { minimumFractionDigits: 0 });
          }

          // Accommodation
          const accomCardFee = Math.round(accomTotal * CARD_FEE_RATE * 100) / 100;
          const accomTaxTotal = accomCardFee;
          const levy = Math.round(accomTotal * 0.10 * 100) / 100; // 10% levy
          const feesSubtotal = INSURANCE + CLEANING + levy;
          const feeCardFee = Math.round(feesSubtotal * CARD_FEE_RATE * 100) / 100;
          const feeTaxTotal = feeCardFee;
          const subtotal = accomTotal + accomTaxTotal + feesSubtotal + feeTaxTotal;
          const subtotalExTax = accomTotal + feesSubtotal;
          const totalTaxes = accomTaxTotal + feeTaxTotal;
          const grandTotal = subtotal;

          totalWithTax = Math.round(grandTotal * 100) / 100;
          deposit50 = Math.round(totalWithTax * 0.5 * 100) / 100;

          // Store base total for service price recalculation
          baseGrandTotal = totalWithTax;
          console.log('[FRB] baseGrandTotal set to:', baseGrandTotal);

          const fmt = (v) => "$" + v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

          document.getElementById("frb-pr-accom-price").textContent = fmt(accomTotal);
          document.getElementById("frb-pr-accom-total").textContent = fmt(accomTotal);
          document.getElementById("frb-pr-card-fee").textContent = fmt(accomCardFee);
          document.getElementById("frb-pr-tax-total").textContent = fmt(accomTaxTotal);
          document.getElementById("frb-pr-levy").textContent = fmt(levy);
          document.getElementById("frb-pr-fees-total").textContent = fmt(feesSubtotal);
          document.getElementById("frb-pr-fee-tax").textContent = fmt(feeCardFee);
          document.getElementById("frb-pr-fee-tax-total").textContent = fmt(feeTaxTotal);
          document.getElementById("frb-pr-subtotal").textContent = fmt(subtotal);
          document.getElementById("frb-pr-subtotal-ex").textContent = fmt(subtotalExTax);
          document.getElementById("frb-pr-taxes").textContent = fmt(totalTaxes);
          document.getElementById("frb-pr-grand-total").textContent = fmt(grandTotal);
          document.getElementById("frb-pay-total").textContent = fmt(grandTotal);
        } else {
          document.getElementById("frb-pr-grand-total").textContent = "Contact for price";
          document.getElementById("frb-pay-total").textContent = "Contact for price";
        }
      })
      .catch(() => {
        document.getElementById("frb-pr-grand-total").textContent = "Contact for price";
        document.getElementById("frb-pay-total").textContent = "Contact for price";
      });
  }

  // --- SERVICE PRICE RECALCULATION ---
  // Services with fixed per-day pricing
  // Services pricing: flat = one-time, perDay = daily rate
  // perDay services multiply by nights or a custom day input
  const SERVICE_PRICES = {
    'frb-svc-picnics':        { flat: 385, perDay: 0, daysInputId: null, useNights: false },
    'frb-svc-staging':        { flat: 242, perDay: 0, daysInputId: null, useNights: false },
    'frb-svc-nails':          { flat: 0,   perDay: 0, daysInputId: null, useNights: false },
    'frb-svc-massage':        { flat: 0,   perDay: 0, daysInputId: null, useNights: false },
    'frb-svc-hair':           { flat: 0,   perDay: 0, daysInputId: null, useNights: false },
    'frb-svc-jetcar':         { flat: 0,   perDay: 0, daysInputId: null, useNights: false },
    'frb-svc-yacht-private':  { flat: 2000,perDay: 0, daysInputId: null, useNights: false },
    'frb-svc-yacht-shared':   { flat: 200, perDay: 0, daysInputId: null, useNights: false },
    'frb-svc-cot':            { flat: 0,   perDay: 10, daysInputId: null, useNights: true },
    'frb-svc-reservations':   { flat: 0,   perDay: 0, daysInputId: null, useNights: false },
    'frb-svc-chef':           { flat: 0,   perDay: 0, daysInputId: null, useNights: false },
    'frb-svc-grocery':        { flat: 0,   perDay: 0, daysInputId: null, useNights: false },
    'frb-svc-airport-out':    { flat: 0,   perDay: 0, daysInputId: null, useNights: false },
    'frb-svc-airport-in':     { flat: 0,   perDay: 0, daysInputId: null, useNights: false },
    'frb-svc-fasttrack':      { flat: 0,   perDay: 0, daysInputId: null, useNights: false },
    'frb-svc-car-suv':        { flat: 0,   perDay: 120, daysInputId: 'frb-svc-suv-days', useNights: false },
    'frb-svc-car-sedan':      { flat: 0,   perDay: 85, daysInputId: 'frb-svc-sedan-days', useNights: false },
    'frb-svc-housekeeping':   { flat: 0,   perDay: 90, daysInputId: 'frb-svc-hk-days', useNights: false },
  };

  function recalcServiceTotal() {
    let svcTotal = 0;
    for (const [cbId, info] of Object.entries(SERVICE_PRICES)) {
      const cb = document.getElementById(cbId);
      if (cb && cb.checked) {
        let lineTotal = info.flat || 0;
        if (info.perDay > 0) {
          let days = nights;
          if (info.daysInputId) {
            days = parseInt(document.getElementById(info.daysInputId)?.value) || 1;
          } else if (!info.useNights) {
            days = 1;
          }
          lineTotal += info.perDay * days;
        }
        svcTotal += lineTotal;
        console.log('[FRB] Service price:', cbId, 'flat:', info.flat, 'perDay:', info.perDay, '=', lineTotal);
      }
    }

    console.log('[FRB] svcTotal:', svcTotal, 'baseGrandTotal:', baseGrandTotal);

    const fmt = (v) => "$" + v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const svcEl = document.getElementById('frb-pr-svc-total');
    console.log('[FRB] svcEl exists:', !!svcEl);
    if (svcEl) svcEl.textContent = fmt(svcTotal);

    // Update grand total, deposit, and payment total
    if (baseGrandTotal > 0) {
      const newGrand = baseGrandTotal + svcTotal;
      totalWithTax = Math.round(newGrand * 100) / 100;
      deposit50 = Math.round(totalWithTax * 0.5 * 100) / 100;

      const gtEl = document.getElementById('frb-pr-grand-total');
      const ptEl = document.getElementById('frb-pay-total');
      console.log('[FRB] Updating total to:', fmt(totalWithTax), 'gtEl:', !!gtEl, 'ptEl:', !!ptEl);
      if (gtEl) gtEl.textContent = fmt(totalWithTax);
      if (ptEl) ptEl.textContent = fmt(totalWithTax);
    } else {
      console.log('[FRB] baseGrandTotal is 0, not updating total');
    }
  }

  // baseGrandTotal is set directly in the pricing fetch .then() callback

  // Attach listeners to ALL service checkboxes
  const allSvcIds = ['frb-svc-picnics','frb-svc-staging','frb-svc-nails','frb-svc-massage','frb-svc-hair','frb-svc-jetcar','frb-svc-yacht-private','frb-svc-yacht-shared','frb-svc-cot','frb-svc-reservations','frb-svc-chef','frb-svc-grocery','frb-svc-airport-out','frb-svc-airport-in','frb-svc-fasttrack','frb-svc-car-suv','frb-svc-car-sedan','frb-svc-housekeeping'];
  allSvcIds.forEach(id => {
    const cb = document.getElementById(id);
    if (cb) {
      cb.addEventListener('change', () => {
        console.log('[FRB] Service toggled:', id, cb.checked, 'baseGrandTotal:', baseGrandTotal);
        recalcServiceTotal();
      });
    }
  });
  // Attach listeners to day count inputs
  ['frb-svc-hk-days', 'frb-svc-suv-days', 'frb-svc-sedan-days'].forEach(id => {
    const inp = document.getElementById(id);
    if (inp) inp.addEventListener('input', recalcServiceTotal);
  });
  console.log('[FRB] Service listeners attached, version v13');

  document.getElementById("frb-bk-form").addEventListener("submit", async function (ev) {
    ev.preventDefault();

    // Terms validation
    const termsCheckbox = document.getElementById("frb-terms");
    const termsError = document.getElementById("frb-terms-error");
    if (!termsCheckbox.checked) {
      termsError.classList.add("show");
      termsCheckbox.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    termsError.classList.remove("show");

    const btn = document.getElementById("frb-bk-submit");
    btn.disabled = true;
    btn.textContent = "Processing…";

    // Collect selected services
    const serviceIds = ['picnics','staging','nails','massage','hair','jetcar','yacht-private','yacht-shared','cot','reservations','chef','grocery','airport-out','airport-in','fasttrack','car-suv','car-sedan','housekeeping'];
    const selectedServices = [];
    serviceIds.forEach(id => {
      const cb = document.getElementById('frb-svc-' + id);
      if (cb && cb.checked) {
        let svc = cb.nextElementSibling ? cb.nextElementSibling.textContent.trim() : id;
        if (id === 'car-suv') svc += ' × ' + (document.getElementById('frb-svc-suv-days')?.value || nights) + ' day(s)';
        if (id === 'car-sedan') svc += ' × ' + (document.getElementById('frb-svc-sedan-days')?.value || nights) + ' day(s)';
        if (id === 'housekeeping') svc += ' × ' + (document.getElementById('frb-svc-hk-days')?.value || 1) + ' day(s)';
        selectedServices.push(svc);
      }
    });
    const couponCode = document.getElementById('frb-coupon')?.value?.trim() || '';

    // Build checkout data
    const checkoutData = {
      firstName: document.getElementById("frb-firstName").value.trim(),
      lastName:  document.getElementById("frb-lastName").value.trim(),
      email:     document.getElementById("frb-email").value.trim(),
      phone:     document.getElementById("frb-phone").value.trim(),
      country:   document.getElementById("frb-country").value,
      adults:    adults,
      children:  0,
      message:   document.getElementById("frb-message").value.trim(),
      property:  propertyName,
      propertySlug: slug,
      checkIn, checkOut, nights, totalWithTax, deposit50,
      services: selectedServices,
      coupon: couponCode,
    };

    // Store in sessionStorage for checkout page
    sessionStorage.setItem("frb_checkout", JSON.stringify(checkoutData));

    // Redirect to checkout page
    window.location.href = "/checkout.html";
  });
}

