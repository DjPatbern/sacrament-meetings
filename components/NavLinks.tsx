"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
const links = [
  { href: "/", label: "Home" },
  { href: "/meetings", label: "Meetings" },
  { href: "/meetings/current", label: "This Sunday" },
  { href: "/login", label: "Leader sign in" },
];
export function NavLinks() {
  const pathname = usePathname();
  return (
    <nav aria-label="Primary navigation">
      <ul className="nav-list">
        {links.map((link) => {
          const active =
            link.href === "/"
              ? pathname === "/"
              : link.href === "/meetings"
                ? pathname === "/meetings" || /^\/meetings\/\d+/.test(pathname)
                : pathname === link.href;
          return (
            <li key={link.href}>
              <Link href={link.href} aria-current={active ? "page" : undefined}>
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
