"use client";

import { usePanchang } from "@/context/PanchangContext";
import { getFestivalsForYear } from "@/lib/astro";
import { useMemo } from "react";

export default function FestivalList() {
  const { date } = usePanchang();
  const year = date.getUTCFullYear();
  const festMap = useMemo(() => getFestivalsForYear(year), [year]);

  const entries = Object.entries(festMap).sort((a, b) => a[0].localeCompare(b[0]));

  return (
    <section>
      <div className="sec-head">
        <h2>Major festivals — {year}</h2>
      </div>
      <div className="fest-list">
        {entries.length === 0 && (
          <div className="fest-row">
            <span className="name">No festivals detected for this year</span>
          </div>
        )}
        {entries.map(([iso, names]) =>
          names.map((name) => {
            const dObj = new Date(iso + "T12:00:00Z");
            return (
              <div className="fest-row" key={iso + name}>
                <span className="name">{name}</span>
                <span className="date">
                  {dObj.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    timeZone: "UTC",
                  })}
                </span>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
