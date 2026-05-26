/**
 * Hospitable Public API client.
 *
 * Slug → Hospitable property ID mapping must be populated once API credentials
 * are available. Until then all API calls gracefully degrade to static data.
 *
 * Token is read from HOSPITABLE_API_TOKEN env var (server-side only).
 */

const BASE_URL = "https://public.api.hospitable.com/v2";

// Populate values with Hospitable property IDs once credentials are available.
export const PROPERTY_MAP: Record<string, string> = {
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
      `/properties/${propertyId}/calendar?start_date=${checkIn}&end_date=${checkOut}`
    );
    if (!res.ok) throw new Error(`Hospitable API ${res.status}`);
    const data = await res.json();
    const blocked: string[] = [];
    let available = true;
    for (const day of data.data?.days || []) {
      if (day.status && !day.status.available) {
        blocked.push(day.date);
        available = false;
      }
    }
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
      `/properties/${propertyId}/calendar?start_date=${checkIn}&end_date=${checkOut}`
    );
    if (!res.ok) throw new Error(`Hospitable API ${res.status}`);
    const data = await res.json();
    
    const nights = Math.round(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    
    let totalPrice = 0;
    let currency = "USD";
    for (const day of data.data?.days || []) {
      if (day.price && day.price.amount) {
        totalPrice += (day.price.amount / 100);
        currency = day.price.currency || currency;
      }
    }

    return {
      totalPrice,
      nightlyRate: nights > 0 ? Math.round(totalPrice / nights) : 0,
      nights,
      currency,
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
