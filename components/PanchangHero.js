"use client";

import { usePanchang } from "@/context/PanchangContext";
import {
  computePanchangForDate,
  sunriseSunset,
  rahuKalam,
  fmtTime,
  WEEKDAYS,
  VAAR,
} from "@/lib/astro";
import MoonPhase from "./MoonPhase";

export default function PanchangHero() {
  const { date, lat, lon, tzOffset } = usePanchang();
  const p = computePanchangForDate(date);
  const { sunrise, sunset } = sunriseSunset(date, lat, lon);
  const rahu = rahuKalam(sunrise, sunset, p.weekdayIdx);
  const waxing = p.t.idx < 15;
  const illumPct = Math.round(p.illum * 100);

  return (
    <div className="hero">
      <div className="moonwrap">
        <MoonPhase illum={p.illum} waxing={waxing} />
        <div className="moon-phase-label">
          {waxing ? "Waxing" : "Waning"} · {p.t.name}
        </div>
        <div className="illum">{illumPct}% illuminated</div>
      </div>
      <div className="hero-main">
        <div className="datestr">
          {date.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            timeZone: "UTC",
          })}
        </div>
        <div className="tithi-name">{p.t.name}</div>
        <div className="paksha-name">
          {p.t.paksha} · {VAAR[p.weekdayIdx]}
        </div>
        <div className="facts">
          <Fact k="Nakshatra" v={p.n.name} />
          <Fact k="Yoga" v={p.y.name} />
          <Fact k="Karana" v={p.k.name} />
          <Fact k="Weekday" v={WEEKDAYS[p.weekdayIdx]} />
          <Fact k="Sunrise" v={fmtTime(sunrise, tzOffset)} />
          <Fact k="Sunset" v={fmtTime(sunset, tzOffset)} />
          <Fact
            k="Rahu Kalam"
            v={rahu ? `${fmtTime(rahu.start, tzOffset)} – ${fmtTime(rahu.end, tzOffset)}` : "—"}
            warn
          />
          <Fact k="Ayanamsa (Lahiri, approx.)" v={`${p.ayan.toFixed(2)}°`} />
        </div>
      </div>
    </div>
  );
}

function Fact({ k, v, warn }) {
  return (
    <div className="fact">
      <div className="k">{k}</div>
      <div className={"v" + (warn ? " warn" : "")}>{v}</div>
    </div>
  );
}
