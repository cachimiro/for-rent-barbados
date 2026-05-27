import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const {
      firstName, lastName, email, phone,
      adults, children, message,
      property, checkIn, checkOut, nights,
      totalWithTax, deposit50,
    } = data;

    // ── Format the email body ──────────────────────────────────────────────
    const subject = `Booking Enquiry – ${property} (${checkIn} → ${checkOut})`;

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #042E28; padding: 30px; text-align: center;">
          <h1 style="color: #FFFFFF; font-size: 24px; margin: 0; font-weight: 400;">
            New Booking Enquiry
          </h1>
        </div>

        <div style="padding: 32px; background: #FFFFFF;">
          <h2 style="color: #363636; font-size: 18px; border-bottom: 1px solid #EAEAEA; padding-bottom: 12px;">
            Property &amp; Dates
          </h2>
          <table style="width: 100%; font-size: 14px; color: #555; line-height: 2;">
            <tr><td style="font-weight: bold; width: 140px;">Property</td><td>${property}</td></tr>
            <tr><td style="font-weight: bold;">Check-in</td><td>${checkIn} (from 3:00 pm)</td></tr>
            <tr><td style="font-weight: bold;">Check-out</td><td>${checkOut} (until 11:00 am)</td></tr>
            <tr><td style="font-weight: bold;">Nights</td><td>${nights}</td></tr>
            <tr><td style="font-weight: bold;">Adults</td><td>${adults}</td></tr>
            <tr><td style="font-weight: bold;">Children</td><td>${children}</td></tr>
          </table>

          <h2 style="color: #363636; font-size: 18px; border-bottom: 1px solid #EAEAEA; padding-bottom: 12px; margin-top: 28px;">
            Guest Details
          </h2>
          <table style="width: 100%; font-size: 14px; color: #555; line-height: 2;">
            <tr><td style="font-weight: bold; width: 140px;">Name</td><td>${firstName} ${lastName}</td></tr>
            <tr><td style="font-weight: bold;">Email</td><td><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="font-weight: bold;">Phone</td><td>${phone || "–"}</td></tr>
            ${message ? `<tr><td style="font-weight: bold; vertical-align: top;">Message</td><td>${message}</td></tr>` : ""}
          </table>

          <h2 style="color: #363636; font-size: 18px; border-bottom: 1px solid #EAEAEA; padding-bottom: 12px; margin-top: 28px;">
            Pricing
          </h2>
          <table style="width: 100%; font-size: 14px; color: #555; line-height: 2;">
            <tr><td style="font-weight: bold; width: 140px;">Total (inc. tax)</td><td>$${totalWithTax?.toLocaleString()}</td></tr>
            <tr><td style="font-weight: bold;">50% Deposit</td><td>$${deposit50?.toLocaleString()}</td></tr>
          </table>

          <div style="background: #F9F9F9; border: 1px solid #EAEAEA; padding: 20px; margin-top: 28px; border-radius: 2px;">
            <p style="margin: 0; font-size: 13px; color: #555; line-height: 1.8;">
              <strong>Next steps:</strong> Contact the guest to confirm availability and
              send the 50% deposit payment link. Once received, the booking is confirmed.
            </p>
          </div>
        </div>

        <div style="background: #000; padding: 20px; text-align: center;">
          <p style="color: rgba(255,255,255,0.6); font-size: 12px; margin: 0;">
            For Rent Barbados · Booking Enquiry System
          </p>
        </div>
      </div>
    `;

    // ── Try to send via Resend (if configured) ────────────────────────────
    const resendKey = process.env.RESEND_API_KEY;
    const toEmail   = process.env.BOOKING_EMAIL ?? "maisha@forrentbarbados.com";

    if (resendKey) {
      const resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from:    "For Rent Barbados <bookings@forrentbarbados.com>",
          to:      [toEmail],
          reply_to: email,
          subject,
          html:    htmlBody,
        }),
      });

      if (!resendRes.ok) {
        const errText = await resendRes.text();
        console.error("Resend error:", errText);
        return NextResponse.json({ error: "Email failed" }, { status: 500 });
      }

      return NextResponse.json({ ok: true });
    }

    // ── Fallback: log to console (no email provider configured) ────────────
    console.log("=== BOOKING ENQUIRY (no email provider configured) ===");
    console.log(JSON.stringify(data, null, 2));
    console.log("=== END BOOKING ENQUIRY ===");

    // Still return success so the guest sees the confirmation screen
    return NextResponse.json({ ok: true });

  } catch (err) {
    console.error("Booking enquiry error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
