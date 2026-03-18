import { DashboardCard } from "@/components/dashboard-card";
import { SiteShell } from "@/components/site-shell";
import {
  demoArtifacts,
  demoFlows,
  demoMetrics,
  demoWorkspace
} from "@/server/demo-data";

export default function HomePage() {
  return (
    <SiteShell
      eyebrow="Engineering Atlas"
      title="Make codebase drift legible."
      description="This scaffold turns the engineering-manager plan into a real Next.js control room: versioned docs, repository maps, provider policies, and merge-aware dashboards designed for fast shipping on the cheap path."
    >
      <div className="dashboard-grid">
        <div className="stacked-grid">
          <DashboardCard title="Workspace pulse" accent="amber">
            <div className="metric-grid">
              {demoMetrics.map((metric) => (
                <article key={metric.label} className="metric-tile">
                  <p className="label">{metric.label}</p>
                  <span className="metric-value">{metric.value}</span>
                  <p className="metric-note">{metric.note}</p>
                </article>
              ))}
            </div>
          </DashboardCard>

          <DashboardCard title="Flow registry">
            <div className="list-grid">
              {demoFlows.map((flow) => (
                <article key={flow.title} className="artifact-row">
                  <p className="label">{flow.title}</p>
                  <p>{flow.detail}</p>
                </article>
              ))}
            </div>
          </DashboardCard>
        </div>

        <div className="stacked-grid">
          <div className="status-banner">
            <p className="eyebrow">Latest publish</p>
            <strong>{demoWorkspace.status}</strong>
            <p>
              <code>{demoWorkspace.repo}</code> on <code>{demoWorkspace.branch}</code> refreshed{" "}
              {demoWorkspace.lastRunAt} from commit <code>{demoWorkspace.lastSha}</code>.
            </p>
          </div>

          <DashboardCard title="Artifact surfaces" accent="teal">
            <div className="list-grid">
              {demoArtifacts.map((artifact) => (
                <article key={artifact.kind} className="artifact-row">
                  <p className="label">{artifact.kind}</p>
                  <p>{artifact.coverage}</p>
                  <div className="artifact-meta">
                    <span className="meta-chip">{artifact.confidence} confidence</span>
                  </div>
                </article>
              ))}
            </div>
          </DashboardCard>
        </div>
      </div>
    </SiteShell>
  );
}
