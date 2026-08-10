"use client";

import { usePanchang } from "@/context/PanchangContext";
import { computePanchangForDate, getFestivalsForYear, isoDateUTC } from "@/lib/astro";
import { useMemo } from "react";

export default function MonthCalendar() {
  const { date, setDate } = usePanchang();
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();

  const festMap = useMemo(() => getFestivalsForYear(year), [year]);

  const firstDay = new Date(Date.UTC(year, month, 1, 12));
  const startWeekday = firstDay.getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const todayIso = isoDateUTC(new Date());

  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(day);

  function prevMonth() {
    setDate(new Date(Date.UTC(year, month - 1, date.getUTCDate(), 12)));
  }
  function nextMonth() {
    setDate(new Date(Date.UTC(year, month + 1, date.getUTCDate(), 12)));
  }

  const monthLabel = new Date(Date.UTC(year, month, 1)).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  return (
    <section>
      <div className="sec-head">
        <h2>Month view</h2>
        <div className="nav">
          <button onClick={prevMonth}>‹</button>
          <span className="month-label">{monthLabel}</span>
          <button onClick={nextMonth}>›</button>
        </div>
      </div>
      <div className="cal">
        <div className="cal-weekdays">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>
        <div className="cal-grid">
          {cells.map((day, i) => {
            if (day === null) return <div key={"e" + i} className="day empty" />;
            const dd = new Date(Date.UTC(year, month, day, 12));
            const iso = isoDateUTC(dd);
            const p = computePanchangForDate(dd);
            const fests = festMap[iso] || [];
            const isToday = iso === todayIso;
            return (
              <div
                key={iso}
                className={"day" + (isToday ? " today" : "") + (fests.length ? " festival" : "")}
                onClick={() => setDate(dd)}
              >
                <div className="gdate">{day}</div>
                <div className="tithi-mini">{p.t.name}</div>
                {fests.length > 0 && <div className="fest-mini">{fests[0]}</div>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
