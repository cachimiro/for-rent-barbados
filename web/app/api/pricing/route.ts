import { NextRequest, NextResponse } from "next/server";
import { getPricing } from "@/lib/hospitable";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const slug = searchParams.get("propertySlug") ?? "";
  const checkIn = searchParams.get("checkIn") ?? "";
  const checkOut = searchParams.get("checkOut") ?? "";

  if (!slug || !checkIn || !checkOut) {
    return NextResponse.json(
      { error: "propertySlug, checkIn, and checkOut are required" },
      { status: 400 }
    );
  }

  const result = await getPricing(slug, checkIn, checkOut);
  // null means API not configured — caller falls back to static pricing
  return NextResponse.json(result ?? { notConfigured: true });
}
