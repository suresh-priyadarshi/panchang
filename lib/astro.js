// lib/astro.js
// Astronomical + Panchang calculation core.
// Sun/Moon longitudes: Meeus low-precision series. Sunrise/sunset: NOAA simplified algorithm.
// Ayanamsa: linear approximation of Lahiri ayanamsa (good to a few arcminutes near present era).
// This is accurate enough for a general-purpose panchang, but is not a substitute for a
// regional/temple-verified panchang for exact ritual muhurat timing.

const DEG = Math.PI / 180;

export function norm360(x) {
  x = x % 360;
  return x < 0 ? x + 360 : x;
}

export function toJD(date) {
  return date.getTime() / 86400000 + 2440587.5;
}

export function sunLongitudeApparent(T) {
  const L0 = norm360(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
  const M = norm360(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
  const Mr = M * DEG;
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mr) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * Mr) +
    0.000289 * Math.sin(3 * Mr);
  const trueLong = L0 + C;
  const omega = 125.04 - 1934.136 * T;
  const lambda = trueLong - 0.00569 - 0.00478 * Math.sin(omega * DEG);
  return norm360(lambda);
}

export function moonLongitude(T) {
  const Lp = norm360(218.3164477 + 481267.88123421 * T - 0.0015786 * T * T);
  const D = norm360(297.8501921 + 445267.1114034 * T - 0.0018819 * T * T);
  const M = norm360(357.5291092 + 35999.0502909 * T - 0.0001536 * T * T);
  const Mp = norm360(134.9633964 + 477198.8675055 * T + 0.0087414 * T * T);
  const F = norm360(93.272095 + 483202.0175233 * T - 0.0036539 * T * T);
  const d = D * DEG,
    m = M * DEG,
    mp = Mp * DEG,
    f = F * DEG;
  let sum = 0;
  sum += 6.288774 * Math.sin(mp);
  sum += 1.274027 * Math.sin(2 * d - mp);
  sum += 0.658314 * Math.sin(2 * d);
  sum += 0.213618 * Math.sin(2 * mp);
  sum -= 0.185116 * Math.sin(m);
  sum -= 0.114332 * Math.sin(2 * f);
  sum += 0.058793 * Math.sin(2 * d - 2 * mp);
  sum += 0.057066 * Math.sin(2 * d - m - mp);
  sum += 0.053322 * Math.sin(2 * d + mp);
  sum += 0.045758 * Math.sin(2 * d - m);
  sum -= 0.040923 * Math.sin(m - mp);
  sum -= 0.03472 * Math.sin(d);
  sum -= 0.030383 * Math.sin(m + mp);
  sum += 0.015327 * Math.sin(2 * d - 2 * f);
  sum -= 0.012528 * Math.sin(mp + 2 * f);
  sum += 0.01098 * Math.sin(mp - 2 * f);
  sum += 0.010675 * Math.sin(4 * d - mp);
  sum += 0.010034 * Math.sin(3 * mp);
  sum += 0.008548 * Math.sin(4 * d - 2 * mp);
  sum -= 0.007888 * Math.sin(2 * d + m - mp);
  sum -= 0.006766 * Math.sin(2 * d + m);
  sum -= 0.005163 * Math.sin(d - mp);
  sum += 0.004987 * Math.sin(d + m);
  sum += 0.003994 * Math.sin(2 * d - m + mp);
  sum += 0.003994 * Math.sin(2 * d + 2 * mp);
  sum += 0.003861 * Math.sin(4 * d);
  return norm360(Lp + sum);
}

export function ayanamsaLahiri(T) {
  const year = 2000 + T * 100;
  return 23.85 + (year - 1900) * 0.013972;
}

export function sunMoonLongitudes(date) {
  const jd = toJD(date);
  const T = (jd - 2451545.0) / 36525;
  const sunTrop = sunLongitudeApparent(T);
  const moonTrop = moonLongitude(T);
  const ayan = ayanamsaLahiri(T);
  return {
    sunTrop,
    moonTrop,
    sunSid: norm360(sunTrop - ayan),
    moonSid: norm360(moonTrop - ayan),
    ayan,
  };
}

export const TITHI_NAMES = [
  "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi",
  "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi",
  "Trayodashi", "Chaturdashi", "Purnima/Amavasya",
];

export function tithiInfo(sunTrop, moonTrop) {
  const diff = norm360(moonTrop - sunTrop);
  const idx = Math.floor(diff / 12); // 0..29
  const paksha = idx < 15 ? "Shukla Paksha" : "Krishna Paksha";
  let name;
  if (idx === 14) name = "Purnima";
  else if (idx === 29) name = "Amavasya";
  else name = TITHI_NAMES[idx % 15];
  return { idx, name, paksha, pctIntoTithi: (diff % 12) / 12, diff };
}

export const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
  "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
  "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
  "Purva Bhadrapada", "Uttara Bhadrapada", "Revati",
];

export function nakshatraInfo(moonSid) {
  const idx = Math.floor(moonSid / (360 / 27));
  return { idx, name: NAKSHATRAS[idx % 27] };
}

export const YOGAS = [
  "Vishkambha", "Priti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda",
  "Sukarman", "Dhriti", "Shula", "Ganda", "Vriddhi", "Dhruva",
  "Vyaghata", "Harshana", "Vajra", "Siddhi", "Vyatipata", "Variyana",
  "Parigha", "Shiva", "Siddha", "Sadhya", "Shubha", "Shukla",
  "Brahma", "Indra", "Vaidhriti",
];

export function yogaInfo(sunSid, moonSid) {
  const sum = norm360(sunSid + moonSid);
  const idx = Math.floor(sum / (360 / 27));
  return { idx, name: YOGAS[idx % 27] };
}

const KARANA_MOVABLE = ["Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti"];

export function karanaInfo(sunTrop, moonTrop) {
  const diff = norm360(moonTrop - sunTrop);
  const knum = Math.floor(diff / 6); // 0..59
  let name;
  if (knum === 0) name = "Kimstughna";
  else if (knum === 57) name = "Shakuni";
  else if (knum === 58) name = "Chatushpada";
  else if (knum === 59) name = "Naga";
  else name = KARANA_MOVABLE[(knum - 1) % 7];
  return { idx: knum, name };
}

export const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const VAAR = ["Ravivar", "Somvar", "Mangalvar", "Budhvar", "Guruvar", "Shukravar", "Shanivar"];
export const RASHI = ["Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya", "Tula", "Vrischika", "Dhanu", "Makara", "Kumbha", "Meena"];

// NOAA simplified solar position algorithm (standard, well-tested formulation).
export function sunriseSunset(date, lat, lon) {
  // date: any Date representing the calendar day (time-of-day ignored; noon UTC recommended)
  const jd = Math.floor(toJD(date)) + 0.5; // JD at UTC midnight for this calendar day
  const jc = (jd - 2451545) / 36525; // Julian century from J2000, at UTC midnight

  function geomMeanLongSun(t) {
    return norm360(280.46646 + t * (36000.76983 + t * 0.0003032));
  }
  function geomMeanAnomalySun(t) {
    return 357.52911 + t * (35999.05029 - 0.0001537 * t);
  }
  function eccentEarthOrbit(t) {
    return 0.016708634 - t * (0.000042037 + 0.0000001267 * t);
  }
  function sunEqOfCenter(t) {
    const m = geomMeanAnomalySun(t) * DEG;
    return (
      Math.sin(m) * (1.914602 - t * (0.004817 + 0.000014 * t)) +
      Math.sin(2 * m) * (0.019993 - 0.000101 * t) +
      Math.sin(3 * m) * 0.000289
    );
  }
  function sunTrueLong(t) {
    return geomMeanLongSun(t) + sunEqOfCenter(t);
  }
  function sunAppLong(t) {
    return sunTrueLong(t) - 0.00569 - 0.00478 * Math.sin((125.04 - 1934.136 * t) * DEG);
  }
  function meanObliqEcliptic(t) {
    return 23 + (26 + (21.448 - t * (46.815 + t * (0.00059 - t * 0.001813))) / 60) / 60;
  }
  function obliqCorr(t) {
    return meanObliqEcliptic(t) + 0.00256 * Math.cos((125.04 - 1934.136 * t) * DEG);
  }
  function sunDeclination(t) {
    const e = obliqCorr(t) * DEG;
    const lambda = sunAppLong(t) * DEG;
    return Math.asin(Math.sin(e) * Math.sin(lambda)) / DEG; // degrees
  }
  function eqOfTime(t) {
    const epsilon = obliqCorr(t) * DEG;
    const l0 = geomMeanLongSun(t) * DEG;
    const e = eccentEarthOrbit(t);
    const m = geomMeanAnomalySun(t) * DEG;
    const y = Math.tan(epsilon / 2) ** 2;
    const Etime =
      y * Math.sin(2 * l0) -
      2 * e * Math.sin(m) +
      4 * e * y * Math.sin(m) * Math.cos(2 * l0) -
      0.5 * y * y * Math.sin(4 * l0) -
      1.25 * e * e * Math.sin(2 * m);
    return 4 * (Etime / DEG); // minutes
  }
  function hourAngle(latDeg, declDeg) {
    const latR = latDeg * DEG;
    const declR = declDeg * DEG;
    const cosH = Math.cos(90.833 * DEG) / (Math.cos(latR) * Math.cos(declR)) - Math.tan(latR) * Math.tan(declR);
    if (cosH > 1 || cosH < -1) return null; // polar day/night
    return Math.acos(cosH) / DEG; // degrees
  }

  const eqtime = eqOfTime(jc); // minutes
  const decl = sunDeclination(jc); // degrees
  const ha = hourAngle(lat, decl); // degrees, or null
  if (ha === null) return { sunrise: null, sunset: null };

  const solarNoonUTCmin = 720 - 4 * lon - eqtime; // minutes from UTC midnight
  const sunriseUTCmin = solarNoonUTCmin - 4 * ha;
  const sunsetUTCmin = solarNoonUTCmin + 4 * ha;

  const dayStartUTC = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  const sunrise = new Date(dayStartUTC + sunriseUTCmin * 60000);
  const sunset = new Date(dayStartUTC + sunsetUTCmin * 60000);
  return { sunrise, sunset };
}

export function rahuKalam(sunrise, sunset, weekdayIdx) {
  if (!sunrise || !sunset) return null;
  const order = [7, 1, 6, 4, 5, 3, 2]; // segment index (0-7) by weekday Sun..Sat
  const seg = order[weekdayIdx];
  const dur = (sunset - sunrise) / 8;
  const start = new Date(sunrise.getTime() + seg * dur);
  const end = new Date(start.getTime() + dur);
  return { start, end };
}

export function fmtTime(d, tzOffsetMin) {
  if (!d) return "—";
  const local = new Date(d.getTime() + tzOffsetMin * 60000);
  let h = local.getUTCHours(),
    m = local.getUTCMinutes();
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${String(m).padStart(2, "0")} ${ampm}`;
}

export function computePanchangForDate(d) {
  const { sunTrop, moonTrop, sunSid, moonSid, ayan } = sunMoonLongitudes(d);
  const t = tithiInfo(sunTrop, moonTrop);
  const n = nakshatraInfo(moonSid);
  const y = yogaInfo(sunSid, moonSid);
  const k = karanaInfo(sunTrop, moonTrop);
  const weekdayIdx = d.getUTCDay();
  const illum = (1 - Math.cos(norm360(moonTrop - sunTrop) * DEG)) / 2;
  const rashiIdx = Math.floor(sunSid / 30);
  return { t, n, y, k, weekdayIdx, illum, ayan, rashiIdx, sunTrop, moonTrop, sunSid, moonSid };
}

// Festival detection rules: {rashi (sun's sidereal sign index), paksha, tithi(0-14 local), name}
export const FESTIVAL_RULES = [
  { rashi: 11, paksha: "S", tithi: 8, name: "Ram Navami" },
  { rashi: 0, paksha: "S", tithi: 2, name: "Akshaya Tritiya" },
  { rashi: 2, paksha: "K", tithi: 7, name: "Krishna Janmashtami" },
  { rashi: 4, paksha: "S", tithi: 3, name: "Ganesh Chaturthi" },
  { rashi: 5, paksha: "S", tithi: 8, name: "Durga Ashtami (Navratri)" },
  { rashi: 5, paksha: "S", tithi: 9, name: "Dussehra (Vijayadashami)" },
  { rashi: 6, paksha: "K", tithi: 13, name: "Diwali (Amavasya)" },
  { rashi: 6, paksha: "K", tithi: 12, name: "Dhanteras" },
  { rashi: 10, paksha: "S", tithi: 14, name: "Holi (Purnima)" },
  { rashi: 9, paksha: "S", tithi: 14, name: "Makar Sankranti window" },
  { rashi: 9, paksha: "K", tithi: 13, name: "Maha Shivratri" },
];

export function isoDateUTC(d) {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(
    d.getUTCDate()
  ).padStart(2, "0")}`;
}

export function getFestivalsForYear(year) {
  const map = {};
  let prevKey = null;
  for (let doy = 0; doy < 366; doy++) {
    const dd = new Date(Date.UTC(year, 0, 1, 12) + doy * 86400000);
    if (dd.getUTCFullYear() !== year) break;
    const { sunTrop, moonTrop, sunSid } = sunMoonLongitudes(dd);
    const t = tithiInfo(sunTrop, moonTrop);
    const rashiIdx = Math.floor(sunSid / 30);
    const pk = t.idx < 15 ? "S" : "K";
    const localTithi = t.idx < 15 ? t.idx : t.idx - 15;
    const key = rashiIdx + "-" + pk + "-" + localTithi;
    if (key !== prevKey) {
      FESTIVAL_RULES.forEach((r) => {
        if (r.rashi === rashiIdx && r.paksha === pk && r.tithi === localTithi) {
          const iso = isoDateUTC(dd);
          map[iso] = map[iso] || [];
          map[iso].push(r.name);
        }
      });
    }
    prevKey = key;
  }
  return map;
}
