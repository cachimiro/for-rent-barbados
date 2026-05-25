/**
 * Hospitable Public API client.
 *
 * Slug → Hospitable property ID mapping must be populated once API credentials
 * are available. Until then all API calls gracefully degrade to static data.
 *
 * Token is read from HOSPITABLE_API_TOKEN env var (server-side only).
 */

const BASE_URL = "https://api.hospitable.com/v1";

// Populate values with Hospitable property IDs once credentials are available.
export const PROPERTY_MAP: Record<string, string> = {
  "azzurro-03-3-bed": "",
  "azzurro-03-2-bed": "",
  "westmoreland-hill-35-4-bed": "",
  "westmoreland-hill-35-3-bed": "",
  "coral-beach-105": "",
  "coral-beach-105-2": "",
  "lantana-44-2-bed": "",
  "lantana-44-3-bed": "",
  "turtle-view-3-bed": "",
  "turtle-view-2-bed": "",
  "westmoreland-hill-13-2-bed": "",
  "westmoreland-hill-13-3-bed": "",
  "westmoreland-hill-2-3-bed": "",
  "westmoreland-hill-22-4-bed": "",
  "brownes-2b-1-bed": "",
  "jamestown-park-1-2-bed": "",
  "jamestown-park-1-1-bed": "",
  "coconut-grove-3-sienna": "",
  "the-crane-resort": "",
  "mullins-reef-3-bed": "",
  "westmoreland-hills-1-villa-savannah": "",
  "ixora-101": "",
};

/** Returns true if the API token is configured and the property ID is mapped. */
export function isHospitableConfigured(slug: string): boolean {
  return (
    Boolean(process.env.HOSPITABLE_API_TOKEN) &&
    Boolean(PROPERTY_MAP[slug])
  );
}

export interface AvailabilityResult {
  available: boolean;
  blockedDates: string[];
}

export interface PricingResult {
  totalPrice: number;
  nightlyRate: number;
  nights: number;
  currency: string;
}

async function hospitableFetch(path: string): Promise<Response> {
  const token = process.env.HOSPITABLE_API_TOKEN;
  if (!token) throw new Error("HOSPITABLE_API_TOKEN not set");
  return fetch(`${BASE_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    next: { revalidate: 300 }, // cache 5 min
  });
}

export async function getAvailability(
  slug: string,
  checkIn: string,
  checkOut: string
): Promise<AvailabilityResult> {
  const propertyId = PROPERTY_MAP[slug];
  if (!propertyId || !process.env.HOSPITABLE_API_TOKEN) {
    return { available: true, blockedDates: [] };
  }
  try {
    const res = await hospitableFetch(
      `/properties/${propertyId}/availability?start_date=${checkIn}&end_date=${checkOut}`
    );
    if (!res.ok) throw new Error(`Hospitable API ${res.status}`);
    const data = await res.json();
    // Hospitable returns an array of blocked date ranges; flatten to date strings
    const blocked: string[] = (data.blocked ?? []).flatMap(
      (range: { start: string; end: string }) => {
        const dates: string[] = [];
        const cur = new Date(range.start);
        const end = new Date(range.end);
        while (cur <= end) {
          dates.push(cur.toISOString().slice(0, 10));
          cur.setDate(cur.getDate() + 1);
        }
        return dates;
      }
    );
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const available = !blocked.some((d) => {
      const date = new Date(d);
      return date >= checkInDate && date < checkOutDate;
    });
    return { available, blockedDates: blocked };
  } catch {
    return { available: true, blockedDates: [] };
  }
}

export async function getPricing(
  slug: string,
  checkIn: string,
  checkOut: string
): Promise<PricingResult | null> {
  const propertyId = PROPERTY_MAP[slug];
  if (!propertyId || !process.env.HOSPITABLE_API_TOKEN) return null;
  try {
    const res = await hospitableFetch(
      `/properties/${propertyId}/pricing?start_date=${checkIn}&end_date=${checkOut}`
    );
    if (!res.ok) throw new Error(`Hospitable API ${res.status}`);
    const data = await res.json();
    const nights = Math.round(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    return {
      totalPrice: data.total ?? 0,
      nightlyRate: nights > 0 ? Math.round((data.total ?? 0) / nights) : 0,
      nights,
      currency: data.currency ?? "USD",
    };
  } catch {
    return null;
  }
}

/** Direct booking URL for a property on Hospitable's hosted checkout. */
export function getBookingUrl(
  slug: string,
  checkIn?: string,
  checkOut?: string,
  guests?: number
): string {
  const propertyId = PROPERTY_MAP[slug];
  if (!propertyId) return "/contact";
  const params = new URLSearchParams();
  if (checkIn) params.set("checkIn", checkIn);
  if (checkOut) params.set("checkOut", checkOut);
  if (guests) params.set("guests", String(guests));
  const qs = params.toString();
  return `https://direct.hospitable.com/property/${propertyId}${qs ? `?${qs}` : ""}`;
}
