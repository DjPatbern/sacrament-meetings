"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { NavLinks } from "./NavLinks";
const subscribe = () => () => undefined;
const getCurrentDate = () =>
  new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "Africa/Lagos",
  }).format(new Date());
export function Header() {
  const today = useSyncExternalStore(subscribe, getCurrentDate, () => "Today");
  return (
    <header className="site-header">
      <div className="header-inner shell">
        <Link className="brand" href="/" aria-label="Meadowbrook Ward home">
          <span className="brand-mark" aria-hidden="true">
            M
          </span>
          <span>
            <strong>Meadowbrook Ward</strong>
            <small>{today}</small>
          </span>
        </Link>
        <NavLinks />
      </div>
    </header>
  );
}
