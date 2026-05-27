"use client";

import { useState, useEffect, useCallback } from "react";

const SUPABASE_URL = "https://bkqnviewrnafvvkqkhej.supabase.co";

interface CalendarDay {
  date: string;
  available: boolean;
  reason: string;
  priceAmount: number;
  priceFormatted: string;
  minStay: number;
}

interface BookingCalendarProps {
  propertySlug: string;
  checkIn: string;
  checkOut: string;
  onDatesChange: (checkIn: string, checkOut: string) => void;
}

const DAY_LABELS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getMonthStart(year: number, month: number): Date {
  return new Date(year, month - 1, 1);
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

// Monday = 0, Sunday = 6
function getMondayOffset(year: number, month: number): number {
  const day = new Date(year, month - 1, 1).getDay(); // 0=Sun
  return (day + 6) % 7;
}

function formatDate(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function addMonth(year: number, month: number, delta: number): [number, number] {
  let m = month + delta;
  let y = year;
  while (m > 12) { m -= 12; y++; }
  while (m < 1) { m += 12; y--; }
  return [y, m];
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function BookingCalendar({
  propertySlug,
  checkIn,
  checkOut,
  onDatesChange,
}: BookingCalendarProps) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth() + 1); // 1-based

  const [calendarData, setCalendarData] = useState<Record<string, CalendarDay>>({});
  const [loading, setLoading] = useState(false);
  const [hoverDate, setHoverDate] = useState<string | null>(null);

  // Fetch calendar data for current 2-month view
  const fetchCalendar = useCallback(async (year: number, month: number) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${SUPABASE_URL}/functions/v1/calendar?propertySlug=${propertySlug}&year=${year}&month=${month}`
      );
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      if (data.days) {
        const map: Record<string, CalendarDay> = {};
        for (const day of data.days) {
          map[day.date] = day;
        }
        setCalendarData((prev) => ({ ...prev, ...map }));
      }
    } catch {
      // silently fail — calendar will show no data
    } finally {
      setLoading(false);
    }
  }, [propertySlug]);

  useEffect(() => {
    fetchCalendar(viewYear, viewMonth);
  }, [viewYear, viewMonth, fetchCalendar]);

  const handlePrev = () => {
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth() + 1;
    if (viewYear === todayYear && viewMonth === todayMonth) return; // don't go before today's month
    const [y, m] = addMonth(viewYear, viewMonth, -1);
    setViewYear(y);
    setViewMonth(m);
  };

  const handleNext = () => {
    const [y, m] = addMonth(viewYear, viewMonth, 1);
    setViewYear(y);
    setViewMonth(m);
  };

  const handleDayClick = (dateStr: string) => {
    const dayData = calendarData[dateStr];
    // Don't allow clicking blocked/reserved dates
    if (dayData && !dayData.available) return;
    // Don't allow past dates
    if (dateStr < today.toISOString().slice(0, 10)) return;

    if (!checkIn || (checkIn && checkOut)) {
      // Start new selection
      onDatesChange(dateStr, "");
    } else if (checkIn && !checkOut) {
      // Set checkout
      if (dateStr <= checkIn) {
        onDatesChange(dateStr, "");
      } else {
        // Validate no blocked dates in the range
        let hasBlocked = false;
        const cursor = new Date(checkIn);
        cursor.setDate(cursor.getDate() + 1);
        const end = new Date(dateStr);
        while (cursor < end) {
          const d = cursor.toISOString().slice(0, 10);
          if (calendarData[d] && !calendarData[d].available) {
            hasBlocked = true;
            break;
          }
          cursor.setDate(cursor.getDate() + 1);
        }
        if (hasBlocked) {
          // Reset and start new selection from clicked date
          onDatesChange(dateStr, "");
        } else {
          onDatesChange(checkIn, dateStr);
        }
      }
    }
  };

  const handleClear = () => {
    onDatesChange("", "");
    setHoverDate(null);
  };

  // Determine if a date is in the selected range
  const isInRange = (dateStr: string) => {
    if (!checkIn) return false;
    const end = checkOut || hoverDate;
    if (!end) return false;
    const [lo, hi] = checkIn < end ? [checkIn, end] : [end, checkIn];
    return dateStr > lo && dateStr < hi;
  };

  const isCheckIn = (dateStr: string) => dateStr === checkIn;
  const isCheckOut = (dateStr: string) => dateStr === checkOut;
  const isSelected = (dateStr: string) => isCheckIn(dateStr) || isCheckOut(dateStr);

  const isPast = (dateStr: string) => dateStr < today.toISOString().slice(0, 10);

  // Render one month grid
  function renderMonth(year: number, month: number) {
    const offset = getMondayOffset(year, month);
    const daysInMonth = getDaysInMonth(year, month);

    const cells: React.ReactNode[] = [];

    // Empty leading cells
    for (let i = 0; i < offset; i++) {
      cells.push(<div key={`empty-${i}`} />);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = formatDate(year, month, d);
      const dayData = calendarData[dateStr];
      const available = dayData ? dayData.available : null; // null = loading
      const past = isPast(dateStr);
      const selected = isSelected(dateStr);
      const inRange = isInRange(dateStr);
      const blocked = dayData && !dayData.available;
      const isToday = dateStr === today.toISOString().slice(0, 10);

      const isHoverEnd =
        checkIn && !checkOut && hoverDate && dateStr === hoverDate && dateStr > checkIn;

      let bg = "transparent";
      let color = "#363636";
      let cursor = "pointer";
      let opacity = 1;

      if (past) {
        color = "#ccc";
        cursor = "default";
        opacity = 0.5;
      } else if (selected) {
        bg = "#042E28";
        color = "#fff";
      } else if (isHoverEnd) {
        bg = "#042E2844";
        color = "#042E28";
      } else if (inRange) {
        bg = "#042E2818";
        color = "#042E28";
      } else if (blocked) {
        bg = "#1a1a1a";
        color = "#fff";
        cursor = "default";
      } else if (available === null && loading) {
        color = "#ccc";
        cursor = "default";
      }

      cells.push(
        <div
          key={dateStr}
          onClick={() => !past && handleDayClick(dateStr)}
          onMouseEnter={() => {
            if (checkIn && !checkOut && !past) setHoverDate(dateStr);
          }}
          onMouseLeave={() => setHoverDate(null)}
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 6,
            paddingBottom: 6,
            background: bg,
            color,
            cursor,
            opacity,
            borderRadius: 2,
            outline: isToday && !selected ? "1px solid #042E28" : "none",
            transition: "background 0.1s",
            userSelect: "none",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-montserrat), sans-serif",
              fontSize: 13,
              fontWeight: selected ? 600 : 400,
              lineHeight: 1,
            }}
          >
            {d}
          </span>
          {dayData && dayData.available && !past && (
            <span
              style={{
                fontFamily: "var(--font-montserrat), sans-serif",
                fontSize: 9,
                marginTop: 2,
                color: selected ? "rgba(255,255,255,0.8)" : inRange ? "#042E28" : "#888",
                lineHeight: 1,
              }}
            >
              {dayData.priceFormatted.replace(".00", "")}
            </span>
          )}
        </div>
      );
    }

    return (
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontFamily: "var(--font-montserrat), sans-serif",
            fontSize: 12,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "1px",
            color: "#363636",
            textAlign: "center",
            marginBottom: 10,
          }}
        >
          {MONTH_NAMES[month - 1]} {year}
        </p>
        {/* Day header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            marginBottom: 4,
          }}
        >
          {DAY_LABELS.map((l) => (
            <div
              key={l}
              style={{
                fontFamily: "var(--font-montserrat), sans-serif",
                fontSize: 10,
                color: "#aaa",
                textAlign: "center",
                paddingBottom: 4,
              }}
            >
              {l}
            </div>
          ))}
        </div>
        {/* Day grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "2px 0",
          }}
        >
          {cells}
        </div>
      </div>
    );
  }

  const [nextYear, nextMonth] = addMonth(viewYear, viewMonth, 1);
  const canGoPrev =
    !(viewYear === today.getFullYear() && viewMonth === today.getMonth() + 1);

  const selectionLabel =
    checkIn && checkOut
      ? `${checkIn.split("-").reverse().join("/")} – ${checkOut.split("-").reverse().join("/")}`
      : checkIn
      ? `${checkIn.split("-").reverse().join("/")} – Select checkout`
      : "";

  return (
    <div
      style={{
        border: "1px solid #EAEAEA",
        background: "#fff",
        padding: "16px",
        marginBottom: 24,
      }}
    >
      {/* Navigation */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <button
          onClick={handlePrev}
          disabled={!canGoPrev}
          style={{
            background: "none",
            border: "none",
            cursor: canGoPrev ? "pointer" : "default",
            fontSize: 18,
            color: canGoPrev ? "#363636" : "#ccc",
            padding: "4px 8px",
            lineHeight: 1,
          }}
          aria-label="Previous month"
        >
          ‹
        </button>
        <span
          style={{
            fontFamily: "var(--font-poppins), sans-serif",
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "2px",
            color: "#888",
          }}
        >
          {loading ? "Loading…" : "TODAY"}
        </span>
        <button
          onClick={handleNext}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 18,
            color: "#363636",
            padding: "4px 8px",
            lineHeight: 1,
          }}
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      {/* Two-month grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
        }}
      >
        {renderMonth(viewYear, viewMonth)}
        {renderMonth(nextYear, nextMonth)}
      </div>

      {/* Bottom bar */}
      {selectionLabel && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 12,
            paddingTop: 12,
            borderTop: "1px solid #EAEAEA",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-montserrat), sans-serif",
              fontSize: 12,
              color: "#363636",
            }}
          >
            {selectionLabel}
          </span>
          <button
            onClick={handleClear}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-poppins), sans-serif",
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "1px",
              color: "#c0392b",
            }}
          >
            Clear
          </button>
        </div>
      )}

      {/* Legend */}
      <div
        style={{
          display: "flex",
          gap: 16,
          marginTop: 12,
          flexWrap: "wrap",
        }}
      >
        {[
          { color: "#1a1a1a", label: "Unavailable" },
          { color: "#042E28", label: "Selected" },
          { color: "#042E2818", label: "In range" },
        ].map(({ color, label }) => (
          <div
            key={label}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                background: color,
                border: "1px solid #eee",
                borderRadius: 2,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-montserrat), sans-serif",
                fontSize: 10,
                color: "#888",
              }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
