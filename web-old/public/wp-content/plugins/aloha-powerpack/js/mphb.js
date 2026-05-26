jQuery(document).ready(function ($) {
    if ($('#mphb-booking-details').length) {
        for (const key in aloha_mphb.room_fields) {

            var field = '#mphb_room_details-0-' + key;
            if ($(field).length && $(field).val() == '') {
                if (key === 'guest-name' && !aloha_mphb.is_demo) {
                    continue;
                }
                $(field).val(aloha_mphb.room_fields[key]);
            }

        }

    }
    if ($('#mphb-customer-details').length) {
        if (aloha_mphb.is_demo) {
            for (const key in aloha_mphb.customer_fields) {

                var field = '#mphb_' + key;
                if ($(field).length && $(field).val() == '') {
                    $(field).val(aloha_mphb.customer_fields[key]);
                }

            }
            if ($('#mphb_accept_terms').length) {
                $('#mphb_accept_terms').prop("checked", true);
            }
        }
    }
});

