import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { encode as base64url } from "https://deno.land/std@0.177.0/encoding/base64url.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
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
    const data = await req.json();

    const {
      firstName, lastName, email, phone, country,
      adults, message, property, propertySlug,
      checkIn, checkOut, nights, totalWithTax, deposit50,
      services, coupon,
      billingFirstName, billingLastName, billingCountry,
      billingAddr1, billingAddr2, billingCity, billingCounty,
      billingPostcode, billingPhone, billingEmail, billingNotes,
    } = data;

    // Generate a unique booking reference
    const bookingRef = "FRB-" + Date.now().toString(36).toUpperCase() + "-" + Math.random().toString(36).substring(2, 6).toUpperCase();

    // Build client reference (compact data for the webhook to use)
    const refData = {
      ref: bookingRef,
      slug: propertySlug || "",
      prop: property,
      ci: checkIn,
      co: checkOut,
      n: nights,
      email: billingEmail || email,
      fname: billingFirstName || firstName,
      lname: billingLastName || lastName,
      phone: billingPhone || phone,
      total: totalWithTax,
      dep: deposit50,
      adults: adults,
      country: billingCountry || country,
      addr: billingAddr1 || "",
      city: billingCity || "",
      post: billingPostcode || "",
      notes: billingNotes || message || "",
      svc: services || [],
      coupon: coupon || "",
    };

    const clientRef = encodeURIComponent(JSON.stringify(refData));

    // Build Fygaro payment URL
    const fygaroButtonUrl = Deno.env.get("FYGARO_BUTTON_URL") || "https://www.fygaro.com/es/pb/72853828-ef11-473c-a73b-06ac25945f1b/";
    const fygaroApiKey = Deno.env.get("FYGARO_API_KEY") || "";

    const paymentAmount = Number(deposit50) || 0;

    let paymentUrl: string;

    if (fygaroApiKey) {
      // JWT approach (secure - amount can't be modified by customer)
      const header = { alg: "HS256", typ: "JWT", kid: fygaroApiKey };
      const payload = {
        amount: paymentAmount.toFixed(2),
        currency: "USD",
        custom_reference: bookingRef,
        exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour expiry
      };

      const headerB64 = base64url(new TextEncoder().encode(JSON.stringify(header)));
      const payloadB64 = base64url(new TextEncoder().encode(JSON.stringify(payload)));
      const signingInput = headerB64 + "." + payloadB64;

      // HMAC-SHA256 sign
      const key = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(fygaroApiKey),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );
      const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(signingInput));
      const sigB64 = base64url(new Uint8Array(sig));

      const jwt = signingInput + "." + sigB64;
      paymentUrl = `${fygaroButtonUrl}?jwt=${jwt}`;
    } else {
      // Fallback: URL parameters (amount pre-filled but editable)
      paymentUrl = `${fygaroButtonUrl}?amount=${paymentAmount.toFixed(2)}&client_reference=${encodeURIComponent(bookingRef)}&client_note=${encodeURIComponent(`Booking deposit: ${property}, ${checkIn} to ${checkOut}`)}`;
    }

    // Also send booking enquiry email immediately (so owner knows about the pending payment)
    const resendKey = Deno.env.get("RESEND_API_KEY");
    const toEmail = Deno.env.get("BOOKING_EMAIL") ?? "johannaguirre55@gmail.com";

    if (resendKey) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "For Rent Barbados Bookings <onboarding@resend.dev>",
          to: [toEmail],
          reply_to: billingEmail || email,
          subject: `⏳ Pending Payment – ${property} (${checkIn} → ${checkOut}) – Ref: ${bookingRef}`,
          html: `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
  <h2 style="color:#042E28;">Pending Payment – Booking Ref: ${bookingRef}</h2>
  <p>A guest has proceeded to Fygaro checkout for:</p>
  <table style="width:100%;border-collapse:collapse;margin:16px 0;">
    <tr style="background:#f9f9f9;"><td style="padding:8px;font-weight:bold;">Property</td><td style="padding:8px;">${property}</td></tr>
    <tr><td style="padding:8px;font-weight:bold;">Dates</td><td style="padding:8px;">${checkIn} → ${checkOut} (${nights} nights)</td></tr>
    <tr style="background:#f9f9f9;"><td style="padding:8px;font-weight:bold;">Guest</td><td style="padding:8px;">${billingFirstName || firstName} ${billingLastName || lastName}</td></tr>
    <tr><td style="padding:8px;font-weight:bold;">Email</td><td style="padding:8px;">${billingEmail || email}</td></tr>
    <tr style="background:#f9f9f9;"><td style="padding:8px;font-weight:bold;">Phone</td><td style="padding:8px;">${billingPhone || phone || "–"}</td></tr>
    <tr><td style="padding:8px;font-weight:bold;">Total</td><td style="padding:8px;">$${Number(totalWithTax).toLocaleString()}</td></tr>
    <tr style="background:#f9f9f9;"><td style="padding:8px;font-weight:bold;">50% Deposit</td><td style="padding:8px;color:#042E28;font-weight:bold;">$${Number(deposit50).toLocaleString()}</td></tr>
  </table>
  <p style="color:#888;">The guest has been redirected to Fygaro for payment. Dates will be blocked automatically upon successful payment.</p>
</div>`,
        }),
      }).catch(err => console.warn("Email notification failed:", err));
    }

    console.log(`Checkout created: ${bookingRef} – ${property} – $${deposit50}`);

    return new Response(JSON.stringify({
      ok: true,
      paymentUrl,
      bookingRef,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("create-checkout error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
