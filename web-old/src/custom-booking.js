const PROPERTY_MAP = {
  "azzurro-03-3-bed": "c31e2cdb-8698-42f5-bc5d-98253e3a1287",   // placeholder — fill real ID if available
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

// Maps property slug → WordPress room type ID (mphb_room_type_id)
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

// Live WordPress site base URL
const LIVE_SITE = "https://forrentbarbados.com";

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

  // 2. Filter properties on Search Results Page (/availability-search-2/index.html)
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

        // Propagate dates to the property page
        try {
          const newUrl = new URL(href, window.location.href);
          newUrl.searchParams.set('checkIn', checkIn);
          newUrl.searchParams.set('checkOut', checkOut);
          link.setAttribute('href', newUrl.toString());
        } catch(e) {}

        const match = href.match(/accommodation\/([^\/]+)/);
        if (!match) return Promise.resolve();
        const slug = match[1];

        const supabaseUrl = "https://bkqnviewrnafvvkqkhej.supabase.co/functions/v1/availability";
        return fetch(`${supabaseUrl}?propertySlug=${slug}&checkIn=${checkIn}&checkOut=${checkOut}`)
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

  // 3. Intercept individual property booking form — redirect to live forrentbarbados.com
  const bookingForms = document.querySelectorAll(".mphb-booking-form");
  bookingForms.forEach(form => {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Read dates — try multiple sources in priority order:
      // a) Hidden date inputs (set by frb-calendar syncForm)
      // b) Visible date inputs converted to type="date"
      // c) URL params (from availability-search-2 redirect)
      let checkIn  = "";
      let checkOut = "";

      // Try hidden inputs first (MotoPress stores actual value here)
      const ciHidden = form.querySelector('input[type="hidden"][name="mphb_check_in_date"]');
      const coHidden = form.querySelector('input[type="hidden"][name="mphb_check_out_date"]');
      if (ciHidden && ciHidden.value) checkIn  = ciHidden.value;
      if (coHidden && coHidden.value) checkOut = coHidden.value;

      // Fallback: visible date inputs
      if (!checkIn || !checkOut) {
        const ciVis = form.querySelector('input[type="date"][name="mphb_check_in_date"]');
        const coVis = form.querySelector('input[type="date"][name="mphb_check_out_date"]');
        if (ciVis && ciVis.value) checkIn  = ciVis.value;
        if (coVis && coVis.value) checkOut = coVis.value;
      }

      // Fallback: any input with that name
      if (!checkIn || !checkOut) {
        const ciAny = form.querySelector('input[name="mphb_check_in_date"]');
        const coAny = form.querySelector('input[name="mphb_check_out_date"]');
        if (ciAny && ciAny.value) checkIn  = ciAny.value;
        if (coAny && coAny.value) checkOut = coAny.value;
      }

      // Last resort: URL params
      if (!checkIn || !checkOut) {
        checkIn  = globalUrlParams.get('checkIn')  || "";
        checkOut = globalUrlParams.get('checkOut') || "";
      }

      if (!checkIn || !checkOut) {
        alert("Please select check-in and check-out dates before booking.");
        return;
      }

      // Extract slug from current URL
      const pathMatch = window.location.pathname.match(/accommodation\/([^\/]+)/);
      if (!pathMatch) return;

      const slug       = pathMatch[1];
      const roomTypeId = ROOM_TYPE_MAP[slug];
      const adults     = (form.querySelector('select[name="mphb_adults"]') || {}).value || "2";

      // Redirect to the internal booking reservation page (no WordPress needed)
      const params = new URLSearchParams({
        slug:     slug,
        checkIn:  checkIn,
        checkOut: checkOut,
        adults:   adults
      });
      window.location.href = `/booking-reservation/index.html?${params.toString()}`;
    });
  });
});
