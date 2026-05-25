document.addEventListener("DOMContentLoaded", function () {
  const forms = document.querySelectorAll(".mphb_sc_search-form");
  forms.forEach(form => {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      
      const checkInInput = form.querySelector('input[name="mphb_check_in_date"]');
      const checkOutInput = form.querySelector('input[name="mphb_check_out_date"]');
      const adultsInput = form.querySelector('select[name="mphb_adults"]');
      const childrenInput = form.querySelector('select[name="mphb_children"]');
      
      const params = new URLSearchParams();
      if (checkInInput && checkInInput.value) params.set("checkIn", checkInInput.value);
      if (checkOutInput && checkOutInput.value) params.set("checkOut", checkOutInput.value);
      if (adultsInput && adultsInput.value) params.set("adults", adultsInput.value);
      if (childrenInput && childrenInput.value) params.set("children", childrenInput.value);
      
      // Redirect to our local rentals page which we will set up
      window.location.href = `/availability-search-2/index.html?${params.toString()}`;
    });
  });
});
