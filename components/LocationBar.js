"use client";

import { usePanchang } from "@/context/PanchangContext";
import { isoDateUTC } from "@/lib/astro";
import { useState } from "react";

const TZ_OPTIONS = [
  [-720, "UTC-12:00"], [-600, "UTC-10:00"], [-480, "UTC-08:00 (PST)"], [-420, "UTC-07:00 (MST)"],
  [-360, "UTC-06:00 (CST)"], [-300, "UTC-05:00 (EST)"], [-240, "UTC-04:00"], [0, "UTC+00:00"],
  [60, "UTC+01:00"], [120, "UTC+02:00"], [180, "UTC+03:00"], [210, "UTC+03:30"],
  [270, "UTC+04:30"], [300, "UTC+05:00"], [330, "UTC+05:30 (IST)"], [345, "UTC+05:45"],
  [360, "UTC+06:00"], [420, "UTC+07:00"], [480, "UTC+08:00"], [540, "UTC+09:00"],
  [570, "UTC+09:30"], [600, "UTC+10:00"], [660, "UTC+11:00"], [720, "UTC+12:00"],
];

export default function LocationBar() {
  const { date, setDate, lat, setLat, lon, setLon, tzOffset, setTzOffset } = usePanchang();
  const [status, setStatus] = useState("");

  function handleDateChange(e) {
    const [y, m, d] = e.target.value.split("-").map(Number);
    setDate(new Date(Date.UTC(y, m - 1, d, 12)));
  }

  function useMyLocation() {
    if (!navigator.geolocation) {
      setStatus("Geolocation unavailable");
      return;
    }
    setStatus("Locating…");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(+pos.coords.latitude.toFixed(4));
        setLon(+pos.coords.longitude.toFixed(4));
        setTzOffset(-new Date().getTimezoneOffset());
        setStatus("Location set");
      },
      () => setStatus("Permission denied")
    );
  }

  return (
    <div className="controls">
      <input type="date" value={isoDateUTC(date)} onChange={handleDateChange} />
      <input
        type="number"
        step="0.0001"
        value={lat}
        onChange={(e) => setLat(parseFloat(e.target.value))}
        placeholder="Latitude"
        style={{ width: 110 }}
      />
      <input
        type="number"
        step="0.0001"
        value={lon}
        onChange={(e) => setLon(parseFloat(e.target.value))}
        placeholder="Longitude"
        style={{ width: 110 }}
      />
      <select value={tzOffset} onChange={(e) => setTzOffset(parseInt(e.target.value))}>
        {TZ_OPTIONS.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
      <button onClick={useMyLocation}>Use my location</button>
      <span className="loc-status">{status}</span>
    </div>
  );
}
