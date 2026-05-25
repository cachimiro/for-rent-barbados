import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BASE_URL = "https://api.hospitable.com/v1";
const PROPERTY_MAP: Record<string, string> = {
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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const propertySlug = url.searchParams.get("propertySlug");
    const checkIn = url.searchParams.get("checkIn");
    const checkOut = url.searchParams.get("checkOut");

    if (!propertySlug || !checkIn || !checkOut) {
      return new Response(JSON.stringify({ error: "Missing parameters" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const propertyId = PROPERTY_MAP[propertySlug];
    const token = Deno.env.get("HOSPITABLE_API_TOKEN");

    if (!propertyId || !token) {
      return new Response(JSON.stringify({ available: true, blockedDates: [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiRes = await fetch(
      `${BASE_URL}/properties/${propertyId}/availability?start_date=${checkIn}&end_date=${checkOut}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!apiRes.ok) throw new Error(`Hospitable API returned ${apiRes.status}`);

    const data = await apiRes.json();
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const blocked = (data.blocked ?? []).flatMap((range: any) => {
      const dates: string[] = [];
      const cur = new Date(range.start);
      const end = new Date(range.end);
      while (cur <= end) {
        dates.push(cur.toISOString().slice(0, 10));
        cur.setDate(cur.getDate() + 1);
      }
      return dates;
    });

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const available = !blocked.some((d: string) => {
      const date = new Date(d);
      return date >= checkInDate && date < checkOutDate;
    });

    return new Response(JSON.stringify({ available, blockedDates: blocked }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ available: true, blockedDates: [] }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
