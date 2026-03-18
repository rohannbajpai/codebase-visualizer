import Link from "next/link";
import type { ReactNode } from "react";

const navItems = [
  { href: "/", label: "Atlas" },
  { href: "/onboarding", label: "Onboarding" },
  { href: "/settings/providers", label: "Providers" },
  { href: "/settings/github", label: "GitHub" }
] as const;

type SiteShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function SiteShell({
  eyebrow,
  title,
  description,
  children
}: SiteShellProps) {
  return (
    <div className="page-shell">
      <div className="page-grid" />
      <header className="topbar">
        <Link href="/" className="brand">
          <span className="brand-mark" aria-hidden="true">
            CV
          </span>
          <span>
            Codebase Visualizer
            <small>Engineering atlas for fast-moving repos</small>
          </span>
        </Link>
        <nav className="nav">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="nav-link">
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="main-shell">
        <section className="hero-card">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="hero-description">{description}</p>
        </section>
        {children}
      </main>
    </div>
  );
}
