import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BASE_URL = "https://public.api.hospitable.com/v2";

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
      `${BASE_URL}/properties/${propertyId}/calendar?start_date=${checkIn}&end_date=${checkOut}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!apiRes.ok) throw new Error(`Hospitable API returned ${apiRes.status}`);

    const data = await apiRes.json();
    
    const blocked: string[] = [];
    let available = true;
    for (const day of data.data?.days || []) {
      if (day.status && !day.status.available) {
        blocked.push(day.date);
        available = false;
      }
    }

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
