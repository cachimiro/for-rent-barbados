const PROPERTY_MAP = {
  "azzurro-03-3-bed": "",
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

  // 3. Intercept individual property booking form
  const bookingForms = document.querySelectorAll(".mphb-booking-form");
  bookingForms.forEach(form => {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const checkInInput = form.querySelector('input[name="mphb_check_in_date"]');
      const checkOutInput = form.querySelector('input[name="mphb_check_out_date"]');
      const checkIn = checkInInput ? checkInInput.value : '';
      const checkOut = checkOutInput ? checkOutInput.value : '';

      // Extract slug from current URL
      const match = window.location.pathname.match(/accommodation\/([^\/]+)/);
      if (match) {
         const slug = match[1];
         const hospitableId = PROPERTY_MAP[slug];
         if (hospitableId) {
             // Redirect to Hospitable Direct Booking Page
             const directUrl = `https://direct.hospitable.com/${hospitableId}?check_in=${checkIn}&check_out=${checkOut}`;
             window.location.href = directUrl;
         } else {
             alert("This property cannot be booked online at the moment.");
         }
      }
    });
  });
});
