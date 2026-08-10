"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LocationBar from "./LocationBar";

const LINKS = [
  { href: "/", label: "Today" },
  { href: "/calendar", label: "Calendar" },
  { href: "/festivals", label: "Festivals" },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <>
      <header className="top">
        <div className="brand">
          <span className="glyph">☾</span>
          <div>
            <h1>Panchang</h1>
            <div className="tag">Hindu Lunisolar Almanac</div>
          </div>
        </div>
        <nav className="navlinks">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={pathname === l.href ? "active" : ""}>
              {l.label}
            </Link>
          ))}
        </nav>
      </header>
      <LocationBar />
    </>
  );
}
