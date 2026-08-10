"use client";

import { createContext, useContext, useEffect, useState } from "react";

const PanchangCtx = createContext(null);

const DEFAULTS = {
  lat: 28.6139,
  lon: 77.209,
  tzOffset: 330, // IST
};

export function PanchangProvider({ children }) {
  const [date, setDate] = useState(() => {
    const now = new Date();
    return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 12));
  });
  const [lat, setLat] = useState(DEFAULTS.lat);
  const [lon, setLon] = useState(DEFAULTS.lon);
  const [tzOffset, setTzOffset] = useState(DEFAULTS.tzOffset);
  const [hydrated, setHydrated] = useState(false);

  // Load saved location preferences on mount
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("panchang-prefs");
      if (saved) {
        const p = JSON.parse(saved);
        if (typeof p.lat === "number") setLat(p.lat);
        if (typeof p.lon === "number") setLon(p.lon);
        if (typeof p.tzOffset === "number") setTzOffset(p.tzOffset);
      }
    } catch (e) {
      // ignore malformed storage
    }
    setHydrated(true);
  }, []);

  // Persist on change
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem("panchang-prefs", JSON.stringify({ lat, lon, tzOffset }));
    } catch (e) {
      // ignore storage failures (e.g. private browsing)
    }
  }, [lat, lon, tzOffset, hydrated]);

  const value = { date, setDate, lat, setLat, lon, setLon, tzOffset, setTzOffset };
  return <PanchangCtx.Provider value={value}>{children}</PanchangCtx.Provider>;
}

export function usePanchang() {
  const ctx = useContext(PanchangCtx);
  if (!ctx) throw new Error("usePanchang must be used within PanchangProvider");
  return ctx;
}
