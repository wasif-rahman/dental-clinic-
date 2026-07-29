"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/doctors", label: "Doctors" },
  { href: "/appointments", label: "Appointments" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="w-56 shrink-0 bg-white border-r border-slate-200 h-[calc(100vh-4rem)] p-4">
      <ul className="space-y-1">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`block px-3 py-2 rounded-md text-sm font-medium transition ${
                  active
                    ? "bg-blue-600 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
