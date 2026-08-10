import "./globals.css";
import { PanchangProvider } from "@/context/PanchangContext";
import Nav from "@/components/Nav";

export const metadata = {
  title: "Panchang — Hindu Lunisolar Calendar",
  description: "Daily tithi, nakshatra, yoga, karana, sunrise/sunset, Rahu Kalam, and festival calendar.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <PanchangProvider>
          <div className="wrap">
            <Nav />
            {children}
            <Footer />
          </div>
        </PanchangProvider>
      </body>
    </html>
  );
}

function Footer() {
  return (
    <footer>
      Tithi, Nakshatra, Yoga, and Karana are computed from Sun and Moon ecliptic longitudes using
      standard low-precision astronomical series (Meeus), with a linear approximation of Lahiri
      ayanamsa for sidereal positions. Sunrise/sunset use the NOAA solar position algorithm.
      Festival dates are detected by scanning tithi occurrences against approximate solar-month
      boundaries. This is accurate to within a few minutes for most purposes but is{" "}
      <strong>not</strong> a substitute for a regional/temple-verified panchang for exact muhurat
      or ritual timing — conventions (Amanta vs Purnimanta, adhik maas handling, regional festival
      rules) vary and are not all modeled here.
    </footer>
  );
}
