# Panchang — Hindu Lunisolar Calendar

A Next.js (App Router) web app for daily Panchang: Tithi, Nakshatra, Yoga, Karana, sunrise/sunset,
Rahu Kalam, a month calendar view, and a detected festival list — all computed client-side from
real Sun/Moon astronomical formulas (no external API required).

## Setup

```bash
npm install
npm run dev
```

Then open http://localhost:3000

## Deploy

Works out of the box on Vercel:

```bash
npm install -g vercel
vercel
```

Or any Node hosting that supports Next.js (`npm run build && npm run start`).

## Project structure

```
app/
  layout.js          — root layout, nav, footer, font loading
  page.js             — "/" Today's panchang
  calendar/page.js     — "/calendar" month grid
  festivals/page.js    — "/festivals" year's festival list
  globals.css          — theme
components/
  Nav.js, LocationBar.js, PanchangHero.js, MonthCalendar.js, FestivalList.js, MoonPhase.js
context/
  PanchangContext.js  — shared date/location/timezone state (persisted to localStorage)
lib/
  astro.js            — all astronomy + panchang calculation functions (pure JS, no dependencies)
```

## Accuracy notes

- Sun/Moon longitudes: Meeus low-precision periodic series.
- Ayanamsa: linear approximation of Lahiri ayanamsa (fine for the present era; drifts slowly over centuries).
- Sunrise/sunset: NOAA solar position algorithm, verified against known values (e.g. Delhi and NYC
  sunrise/sunset in August 2026).
- Festival dates: detected by scanning each day of the year for tithi + approximate solar-month
  (rashi) combinations. This is a simplification — it does not model Amanta vs Purnimanta month
  conventions, adhik/kshaya maas, or region-specific festival rules. Treat results as a helpful
  approximation, not a substitute for a temple-verified panchang.

## Extending

- `lib/astro.js` is dependency-free and fully unit-testable — add more festival rules to
  `FESTIVAL_RULES`, or swap in a higher-precision ephemeris library (e.g. `astronomy-engine`) later
  without touching the UI components.
- To add user accounts / saved locations, wire `context/PanchangContext.js` to a database instead
  of `localStorage`.
- To move calculation server-side (e.g. for SEO-friendly pre-rendered pages), the functions in
  `lib/astro.js` can be called directly inside a Server Component or a Route Handler.
