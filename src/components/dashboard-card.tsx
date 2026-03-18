import type { ReactNode } from "react";

type DashboardCardProps = {
  title: string;
  accent?: string;
  children: ReactNode;
};

export function DashboardCard({
  title,
  accent = "default",
  children
}: DashboardCardProps) {
  return (
    <section className={`panel panel-${accent}`}>
      <div className="panel-heading">
        <span className="panel-kicker">Panel</span>
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}
