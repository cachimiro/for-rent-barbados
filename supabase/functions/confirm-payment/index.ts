import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const HOSPITABLE_BASE = "https://public.api.hospitable.com/v2";

const PROPERTY_MAP: Record<string, string> = {
  "azzurro-03-3-bed": "0423f8bd-5bbc-4092-a537-f07be22c80d2",
  "azzurro-03-2-bed": "0a71c300-9e93-48a0-8c48-1c0cd617dc89",
  "westmoreland-hill-35-4-bed": "c31e2cdb-8698-42f5-bc5d-98253e3a1287",
  "westmoreland-hill-35-3-bed": "661a00a4-ba4f-472c-a5e9-66d8fca125b2",
  "coral-beach-105": "df72e9d0-e5e1-4ed0-94f9-3cf478032b19",
  "coral-beach-105-2": "ca5ea27b-9029-4ab7-9699-059f8c250aec",
  "lantana-44-2-bed": "8a432bbc-5bec-47de-8fa7-b6d6821e8958",
  "lantana-44-3-bed": "26599d90-09d7-4c5f-b873-5edd07ced505",
  "turtle-view-3-bed": "102dba7c-501d-47be-9c2a-260d5e32e61f",
  "turtle-view-2-bed": "0ee36049-0736-408a-aa48-5e1ead0c4753",
  "westmoreland-hill-13-2-bed": "b951edd5-a40d-4c6d-ac66-88a764fc1d21",
  "westmoreland-hill-13-3-bed": "1e2448f2-ce2c-4023-8e52-8edde6b7f454",
  "westmoreland-hill-2-3-bed": "",
  "westmoreland-hill-22-4-bed": "a1660e90-df2a-41af-93a0-f150b89e2aaf",
  "brownes-2b-1-bed": "9fef34b5-e1fa-4f28-aafe-c3511dbd8f3f",
  "jamestown-park-1-2-bed": "658e9590-0f7a-4f0d-bff3-f4aec181c76c",
  "jamestown-park-1-1-bed": "fe3dc196-5f98-4155-acc7-1654aaa69151",
  "coconut-grove-3-sienna": "",
  "the-crane-resort": "",
  "mullins-reef-3-bed": "",
  "westmoreland-hills-1-villa-savannah": "35ec9db9-c01d-4bb2-b519-203d06c0c5be",
  "ixora-101": "80a7147e-eddf-41c8-9681-3e2fa1c6a651",
};

/**
 * Block dates on Hospitable by setting them as unavailable.
 */
async function blockDatesOnHospitable(propertySlug: string, checkIn: string, checkOut: string): Promise<{ success: boolean; error?: string }> {
  const token = Deno.env.get("HOSPITABLE_API_TOKEN");
  const propertyId = PROPERTY_MAP[propertySlug];

  if (!token || !propertyId) {
    console.warn(`Cannot block dates: token=${!!token}, propertyId=${propertyId}, slug=${propertySlug}`);
    return { success: false, error: "Property not configured for Hospitable" };
  }

  // Build the days array - mark each day as unavailable
  const days: Array<{ date: string; available: boolean }> = [];
  const start = new Date(checkIn + "T00:00:00Z");
  const end = new Date(checkOut + "T00:00:00Z");

  for (let d = new Date(start); d < end; d.setUTCDate(d.getUTCDate() + 1)) {
    days.push({
      date: d.toISOString().split("T")[0],
      available: false,
    });
  }

  try {
    const res = await fetch(`${HOSPITABLE_BASE}/properties/${propertyId}/calendar`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ days }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error(`Hospitable block dates failed (${res.status}):`, errBody);
      return { success: false, error: `Hospitable API ${res.status}: ${errBody}` };
    }

    console.log(`✅ Dates blocked on Hospitable: ${propertySlug} ${checkIn} → ${checkOut}`);
    return { success: true };
  } catch (err) {
    console.error("Hospitable block dates error:", err);
    return { success: false, error: String(err) };
  }
}

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
    const { fygaroReference, bookingRef, checkoutData } = await req.json();

    if (!checkoutData && !bookingRef) {
      return new Response(JSON.stringify({ error: "Missing booking data" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const d = checkoutData || {};
    const property = d.property || "Unknown Property";
    const propertySlug = d.propertySlug || "";
    const checkIn = d.checkIn || "";
    const checkOut = d.checkOut || "";
    const nights = d.nights || 0;
    const firstName = d.billingFirstName || d.firstName || "";
    const lastName = d.billingLastName || d.lastName || "";
    const email = d.billingEmail || d.email || "";
    const phone = d.billingPhone || d.phone || "";
    const totalWithTax = d.totalWithTax || 0;
    const deposit50 = d.deposit50 || 0;
    const ref = bookingRef || fygaroReference || "N/A";

    console.log(`=== CONFIRMING PAYMENT ===`);
    console.log(`Ref: ${ref}, Property: ${property}, Dates: ${checkIn} → ${checkOut}`);
    console.log(`Fygaro Ref: ${fygaroReference}`);

    // 1. Block dates on Hospitable (ONLY if payment is confirmed)
    let blockResult = { success: false, error: "Not attempted" };
    if (propertySlug && checkIn && checkOut) {
      blockResult = await blockDatesOnHospitable(propertySlug, checkIn, checkOut);
    } else {
      console.warn("Cannot block dates: missing propertySlug, checkIn, or checkOut");
    }

    // 2. Send confirmation emails
    const resendKey = Deno.env.get("RESEND_API_KEY");
    const ownerEmail = Deno.env.get("BOOKING_EMAIL") ?? "johannaguirre55@gmail.com";

    if (resendKey) {
      // Email to owner - booking confirmed + payment received
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "For Rent Barbados Bookings <onboarding@resend.dev>",
          to: [ownerEmail],
          reply_to: email,
          subject: `✅ Payment Received – ${property} (${checkIn} → ${checkOut}) – Ref: ${ref}`,
          html: `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
  <div style="background:#042E28;padding:24px 32px;text-align:center;">
    <h1 style="color:#fff;font-size:20px;margin:0;">✅ Payment Confirmed</h1>
    <p style="color:rgba(255,255,255,.7);font-size:12px;margin:6px 0 0;">For Rent Barbados</p>
  </div>
  <div style="padding:32px;">
    <p style="font-size:15px;color:#363636;margin:0 0 16px;">A deposit payment has been received via Fygaro.</p>

    <h3 style="color:#042E28;border-bottom:2px solid #042E28;padding-bottom:6px;font-size:14px;text-transform:uppercase;letter-spacing:1px;">Booking Details</h3>
    <table style="width:100%;border-collapse:collapse;font-size:14px;color:#444;">
      <tr><td style="padding:6px 0;font-weight:bold;">Reference</td><td>${ref}</td></tr>
      <tr style="background:#f9f9f9;"><td style="padding:6px 0;font-weight:bold;">Fygaro Ref</td><td>${fygaroReference || "–"}</td></tr>
      <tr><td style="padding:6px 0;font-weight:bold;">Property</td><td>${property}</td></tr>
      <tr style="background:#f9f9f9;"><td style="padding:6px 0;font-weight:bold;">Check-in</td><td>${checkIn} (3:00 PM)</td></tr>
      <tr><td style="padding:6px 0;font-weight:bold;">Check-out</td><td>${checkOut} (11:00 AM)</td></tr>
      <tr style="background:#f9f9f9;"><td style="padding:6px 0;font-weight:bold;">Nights</td><td>${nights}</td></tr>
      <tr><td style="padding:6px 0;font-weight:bold;">Guest</td><td>${firstName} ${lastName}</td></tr>
      <tr style="background:#f9f9f9;"><td style="padding:6px 0;font-weight:bold;">Email</td><td>${email}</td></tr>
      <tr><td style="padding:6px 0;font-weight:bold;">Phone</td><td>${phone || "–"}</td></tr>
      <tr style="background:#f9f9f9;"><td style="padding:6px 0;font-weight:bold;">Deposit Paid</td><td style="color:#042E28;font-weight:bold;">$${Number(deposit50).toLocaleString()}</td></tr>
      <tr><td style="padding:6px 0;font-weight:bold;">Total</td><td>$${Number(totalWithTax).toLocaleString()}</td></tr>
    </table>

    <div style="margin-top:20px;padding:12px 16px;border-left:4px solid ${blockResult.success ? '#042E28' : '#e67e22'};background:${blockResult.success ? '#f0f7f5' : '#fff5eb'};">
      <p style="margin:0;font-size:13px;color:#363636;">
        <strong>Calendar:</strong> ${blockResult.success ? '✅ Dates automatically blocked on Hospitable' : '⚠️ Dates NOT blocked – ' + (blockResult.error || 'Please block manually')}
      </p>
    </div>
  </div>
  <div style="background:#000;padding:16px;text-align:center;">
    <p style="color:rgba(255,255,255,.5);font-size:11px;margin:0;">FOR RENT BARBADOS · BOOKING SYSTEM</p>
  </div>
</div>`,
        }),
      }).catch(err => console.warn("Owner email failed:", err));

      // Email to guest - booking confirmation
      if (email) {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "For Rent Barbados <onboarding@resend.dev>",
            to: [email],
            subject: `Booking Confirmed – ${property} – Ref: ${ref}`,
            html: `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
  <div style="background:#042E28;padding:24px 32px;text-align:center;">
    <h1 style="color:#fff;font-size:20px;margin:0;">Booking Confirmed</h1>
    <p style="color:rgba(255,255,255,.7);font-size:12px;margin:6px 0 0;">For Rent Barbados</p>
  </div>
  <div style="padding:32px;">
    <p style="font-size:15px;color:#363636;margin:0 0 16px;">Dear ${firstName},</p>
    <p style="font-size:15px;color:#363636;line-height:1.8;margin:0 0 24px;">
      Thank you! Your deposit payment has been received and your booking for <strong>${property}</strong> is now confirmed.
    </p>

    <div style="background:#f9f9f9;border:1px solid #eee;padding:20px 24px;margin-bottom:24px;">
      <p style="font-size:12px;font-weight:bold;color:#888;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px;">Your Booking</p>
      <p style="font-size:14px;color:#363636;margin:4px 0;">Property: <strong>${property}</strong></p>
      <p style="font-size:14px;color:#363636;margin:4px 0;">Check-in: <strong>${checkIn}</strong> (from 3:00 PM)</p>
      <p style="font-size:14px;color:#363636;margin:4px 0;">Check-out: <strong>${checkOut}</strong> (until 11:00 AM)</p>
      <p style="font-size:14px;color:#363636;margin:4px 0;">Nights: <strong>${nights}</strong></p>
      <p style="font-size:14px;color:#042E28;margin:12px 0 0;font-weight:bold;">Deposit Paid: $${Number(deposit50).toLocaleString()}</p>
      <p style="font-size:13px;color:#888;margin:4px 0;">Total: $${Number(totalWithTax).toLocaleString()}</p>
      <p style="font-size:13px;color:#888;margin:4px 0;">Booking Ref: ${ref}</p>
    </div>

    <p style="font-size:14px;color:#363636;line-height:1.8;margin:0 0 8px;">
      <strong>Remaining balance:</strong> $${(Number(totalWithTax) - Number(deposit50)).toLocaleString()} due 60 days before arrival.
    </p>
    <p style="font-size:13px;color:#888;line-height:1.8;margin:0;">
      If you have any questions, contact us at <a href="mailto:maisha@forrentbarbados.com" style="color:#042E28;">maisha@forrentbarbados.com</a>.
    </p>
  </div>
  <div style="background:#000;padding:16px;text-align:center;">
    <p style="color:rgba(255,255,255,.5);font-size:11px;margin:0;">FOR RENT BARBADOS</p>
  </div>
</div>`,
          }),
        }).catch(err => console.warn("Guest email failed:", err));
      }
    }

    return new Response(JSON.stringify({
      ok: true,
      datesBlocked: blockResult.success,
      booking: {
        property, checkIn, checkOut, nights,
        firstName, lastName, email,
        totalWithTax, deposit50,
        ref,
      },
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("confirm-payment error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
