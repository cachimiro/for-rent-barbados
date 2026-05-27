import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const {
      firstName, lastName, email, phone,
      adults, children, message,
      property, checkIn, checkOut, nights,
      totalWithTax, deposit50,
    } = await req.json();

    const resendKey = Deno.env.get("RESEND_API_KEY");
    // Until forrentbarbados.com is verified at resend.com/domains,
    // host notification goes to the Resend account owner's email.
    // After verification, change BOOKING_EMAIL to maisha@forrentbarbados.com.
    const toEmail   = Deno.env.get("BOOKING_EMAIL") ?? "johannaguirre55@gmail.com";

    if (!resendKey) {
      // Log enquiry if Resend not configured — at least don't lose the data
      console.log("=== BOOKING ENQUIRY (RESEND_API_KEY not set) ===");
      console.log(JSON.stringify({ firstName, lastName, email, phone, adults, children, message, property, checkIn, checkOut, nights, totalWithTax, deposit50 }, null, 2));
      return new Response(JSON.stringify({ ok: true, note: "logged" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const subject = `Booking Enquiry – ${property} (${checkIn} → ${checkOut})`;

    const htmlBody = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#F4F4F4;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F4F4;padding:40px 0;">
    <tr><td>
      <table width="600" align="center" cellpadding="0" cellspacing="0" style="background:#FFFFFF;max-width:600px;margin:0 auto;">

        <!-- Header -->
        <tr>
          <td style="background:#042E28;padding:32px 40px;text-align:center;">
            <h1 style="color:#FFFFFF;font-size:22px;font-weight:400;margin:0;letter-spacing:2px;text-transform:uppercase;">
              New Booking Enquiry
            </h1>
            <p style="color:rgba(255,255,255,0.7);font-size:13px;margin:8px 0 0;">For Rent Barbados</p>
          </td>
        </tr>

        <!-- Property & dates -->
        <tr>
          <td style="padding:32px 40px 0;">
            <h2 style="font-size:16px;color:#042E28;border-bottom:2px solid #042E28;padding-bottom:8px;margin:0 0 16px;text-transform:uppercase;letter-spacing:1px;">
              Property &amp; Dates
            </h2>
            <table width="100%" cellpadding="6" cellspacing="0" style="font-size:14px;color:#444;">
              <tr><td style="font-weight:bold;width:140px;color:#363636;">Property</td><td>${property}</td></tr>
              <tr style="background:#F9F9F9;"><td style="font-weight:bold;color:#363636;">Check-in</td><td>${checkIn} &nbsp;<span style="color:#888;">(from 3:00 pm)</span></td></tr>
              <tr><td style="font-weight:bold;color:#363636;">Check-out</td><td>${checkOut} &nbsp;<span style="color:#888;">(until 11:00 am)</span></td></tr>
              <tr style="background:#F9F9F9;"><td style="font-weight:bold;color:#363636;">Nights</td><td>${nights}</td></tr>
              <tr><td style="font-weight:bold;color:#363636;">Adults</td><td>${adults}</td></tr>
              <tr style="background:#F9F9F9;"><td style="font-weight:bold;color:#363636;">Children</td><td>${children}</td></tr>
            </table>
          </td>
        </tr>

        <!-- Guest details -->
        <tr>
          <td style="padding:28px 40px 0;">
            <h2 style="font-size:16px;color:#042E28;border-bottom:2px solid #042E28;padding-bottom:8px;margin:0 0 16px;text-transform:uppercase;letter-spacing:1px;">
              Guest Details
            </h2>
            <table width="100%" cellpadding="6" cellspacing="0" style="font-size:14px;color:#444;">
              <tr><td style="font-weight:bold;width:140px;color:#363636;">Name</td><td>${firstName} ${lastName}</td></tr>
              <tr style="background:#F9F9F9;"><td style="font-weight:bold;color:#363636;">Email</td><td><a href="mailto:${email}" style="color:#042E28;">${email}</a></td></tr>
              <tr><td style="font-weight:bold;color:#363636;">Phone</td><td>${phone || "–"}</td></tr>
              ${message ? `<tr style="background:#F9F9F9;"><td style="font-weight:bold;color:#363636;vertical-align:top;">Message</td><td style="line-height:1.6;">${message.replace(/\n/g, "<br>")}</td></tr>` : ""}
            </table>
          </td>
        </tr>

        <!-- Pricing -->
        <tr>
          <td style="padding:28px 40px 0;">
            <h2 style="font-size:16px;color:#042E28;border-bottom:2px solid #042E28;padding-bottom:8px;margin:0 0 16px;text-transform:uppercase;letter-spacing:1px;">
              Pricing
            </h2>
            <table width="100%" cellpadding="6" cellspacing="0" style="font-size:14px;color:#444;">
              <tr style="background:#F9F9F9;"><td style="font-weight:bold;color:#363636;">Total (inc. 17.5% tax)</td><td><strong>$${Number(totalWithTax).toLocaleString()}</strong></td></tr>
              <tr><td style="font-weight:bold;color:#363636;">50% Deposit Due Now</td><td><strong style="color:#042E28;">$${Number(deposit50).toLocaleString()}</strong></td></tr>
            </table>
          </td>
        </tr>

        <!-- Next steps -->
        <tr>
          <td style="padding:28px 40px 32px;">
            <div style="background:#F0F7F5;border-left:4px solid #042E28;padding:16px 20px;border-radius:2px;">
              <p style="margin:0;font-size:13px;color:#363636;line-height:1.8;">
                <strong>Next steps:</strong> Reply to the guest at
                <a href="mailto:${email}" style="color:#042E28;">${email}</a>
                to confirm availability, then send a payment link for the
                <strong>$${Number(deposit50).toLocaleString()} deposit</strong> to secure the booking.
              </p>
            </div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#000;padding:20px 40px;text-align:center;">
            <p style="color:rgba(255,255,255,0.5);font-size:12px;margin:0;letter-spacing:1px;">
              FOR RENT BARBADOS · BOOKING ENQUIRY SYSTEM
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

    // Send via Resend
    // Using onboarding@resend.dev as the from address until forrentbarbados.com
    // is verified as a sending domain at https://resend.com/domains
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from:     "For Rent Barbados Bookings <onboarding@resend.dev>",
        to:       [toEmail],
        reply_to: email,
        subject,
        html:     htmlBody,
      }),
    });

    if (!resendRes.ok) {
      const errBody = await resendRes.text();
      console.error("Resend error:", errBody);
      return new Response(JSON.stringify({ error: "Email failed", detail: errBody }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Also send a confirmation email to the guest
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from:    "For Rent Barbados <onboarding@resend.dev>",
        to:      [email],
        subject: `Your Booking Enquiry – ${property}`,
        html: `
<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#F4F4F4;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F4F4;padding:40px 0;">
    <tr><td>
      <table width="600" align="center" cellpadding="0" cellspacing="0" style="background:#FFFFFF;max-width:600px;margin:0 auto;">
        <tr><td style="background:#042E28;padding:32px 40px;text-align:center;">
          <h1 style="color:#FFFFFF;font-size:22px;font-weight:400;margin:0;letter-spacing:2px;">Booking Enquiry Received</h1>
          <p style="color:rgba(255,255,255,0.7);font-size:13px;margin:8px 0 0;">For Rent Barbados</p>
        </td></tr>
        <tr><td style="padding:40px;">
          <p style="font-size:15px;color:#363636;line-height:1.8;margin:0 0 16px;">Dear ${firstName},</p>
          <p style="font-size:15px;color:#363636;line-height:1.8;margin:0 0 24px;">
            Thank you for your booking enquiry for <strong>${property}</strong>. We have received your request for
            <strong>${checkIn}</strong> to <strong>${checkOut}</strong> (${nights} nights) and will be in touch
            within 24 hours to confirm availability.
          </p>
          <div style="background:#F9F9F9;border:1px solid #EAEAEA;padding:20px 24px;margin-bottom:24px;">
            <p style="font-size:12px;font-weight:bold;color:#888;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px;">Summary</p>
            <p style="font-size:14px;color:#363636;margin:4px 0;">Property: <strong>${property}</strong></p>
            <p style="font-size:14px;color:#363636;margin:4px 0;">Check-in: <strong>${checkIn}</strong> (from 3:00 pm)</p>
            <p style="font-size:14px;color:#363636;margin:4px 0;">Check-out: <strong>${checkOut}</strong> (until 11:00 am)</p>
            <p style="font-size:14px;color:#363636;margin:4px 0;">Nights: <strong>${nights}</strong> · Adults: <strong>${adults}</strong> · Children: <strong>${children}</strong></p>
            <p style="font-size:14px;color:#042E28;margin:12px 0 0;font-weight:bold;">Total (inc. tax): $${Number(totalWithTax).toLocaleString()}</p>
            <p style="font-size:13px;color:#888;margin:4px 0;">50% deposit to confirm: $${Number(deposit50).toLocaleString()}</p>
          </div>
          <p style="font-size:13px;color:#888;line-height:1.8;margin:0;">
            If you have any questions, reply to this email or contact us at
            <a href="mailto:maisha@forrentbarbados.com" style="color:#042E28;">maisha@forrentbarbados.com</a>.
          </p>
        </td></tr>
        <tr><td style="background:#000;padding:20px 40px;text-align:center;">
          <p style="color:rgba(255,255,255,0.5);font-size:12px;margin:0;letter-spacing:1px;">FOR RENT BARBADOS</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`,
      }),
    }).catch((err) => console.warn("Guest confirmation email failed:", err));

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("booking-enquiry error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
