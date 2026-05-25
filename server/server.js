require("dotenv").config({ path: "../.env" });
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Hospitable API Configuration
const BASE_URL = "https://api.hospitable.com/v1";

const PROPERTY_MAP = {
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

async function hospitableFetch(apiPath) {
  const token = process.env.HOSPITABLE_API_TOKEN;
  if (!token) throw new Error("HOSPITABLE_API_TOKEN not set");
  return global.fetch(`${BASE_URL}${apiPath}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
}

// /api/availability endpoint
app.get("/api/availability", async (req, res) => {
  const { propertySlug, checkIn, checkOut } = req.query;
  
  if (!propertySlug || !checkIn || !checkOut) {
    return res.status(400).json({ error: "propertySlug, checkIn, and checkOut are required" });
  }

  const propertyId = PROPERTY_MAP[propertySlug];
  if (!propertyId || !process.env.HOSPITABLE_API_TOKEN) {
    return res.json({ available: true, blockedDates: [] });
  }

  try {
    const apiRes = await hospitableFetch(
      `/properties/${propertyId}/availability?start_date=${checkIn}&end_date=${checkOut}`
    );
    if (!apiRes.ok) throw new Error(`Hospitable API ${apiRes.status}`);
    const data = await apiRes.json();
    
    const blocked = (data.blocked ?? []).flatMap((range) => {
      const dates = [];
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
    const available = !blocked.some((d) => {
      const date = new Date(d);
      return date >= checkInDate && date < checkOutDate;
    });
    
    return res.json({ available, blockedDates: blocked });
  } catch (error) {
    console.error("Availability error:", error);
    return res.json({ available: true, blockedDates: [] });
  }
});

// /api/pricing endpoint
app.get("/api/pricing", async (req, res) => {
  const { propertySlug, checkIn, checkOut } = req.query;
  
  if (!propertySlug || !checkIn || !checkOut) {
    return res.status(400).json({ error: "propertySlug, checkIn, and checkOut are required" });
  }

  const propertyId = PROPERTY_MAP[propertySlug];
  if (!propertyId || !process.env.HOSPITABLE_API_TOKEN) {
    return res.json({ notConfigured: true });
  }

  try {
    const apiRes = await hospitableFetch(
      `/properties/${propertyId}/pricing?start_date=${checkIn}&end_date=${checkOut}`
    );
    if (!apiRes.ok) throw new Error(`Hospitable API ${apiRes.status}`);
    const data = await apiRes.json();
    
    const nights = Math.round(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    return res.json({
      totalPrice: data.total ?? 0,
      nightlyRate: nights > 0 ? Math.round((data.total ?? 0) / nights) : 0,
      nights,
      currency: data.currency ?? "USD",
    });
  } catch (error) {
    console.error("Pricing error:", error);
    return res.json({ notConfigured: true });
  }
});

// Catch-all to serve index.html for unknown routes (like SPA but static)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});
