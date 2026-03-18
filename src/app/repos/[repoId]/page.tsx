import { DashboardCard } from "@/components/dashboard-card";
import { SiteShell } from "@/components/site-shell";
import {
  demoArtifacts,
  demoFlows,
  demoWorkspace
} from "@/server/demo-data";

type RepoDashboardPageProps = {
  params: Promise<{
    repoId: string;
  }>;
};

export default async function RepoDashboardPage({
  params
}: RepoDashboardPageProps) {
  const { repoId } = await params;

  return (
    <SiteShell
      eyebrow={`Repository / ${repoId}`}
      title="Versioned merge-aware dashboard."
      description="This is the repository view the engineering plan expects: latest published state, artifact slices, and the operational trail that explains how the dashboard was produced."
    >
      <div className="status-banner">
        <p className="eyebrow">Current pointer</p>
        <strong>{demoWorkspace.repo}</strong>
        <p>
          Latest published branch: <code>{demoWorkspace.branch}</code>. Artifact source SHA:{" "}
          <code>{demoWorkspace.lastSha}</code>.
        </p>
      </div>

      <div className="dashboard-grid">
        <DashboardCard title="Artifact set" accent="teal">
          <div className="list-grid">
            {demoArtifacts.map((artifact) => (
              <article key={artifact.kind} className="artifact-row">
                <p className="label">{artifact.kind}</p>
                <p>{artifact.coverage}</p>
              </article>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard title="Data paths">
          <div className="timeline">
            {demoFlows.map((flow) => (
              <article key={flow.title} className="timeline-item">
                <p className="label">{flow.title}</p>
                <p>{flow.detail}</p>
              </article>
            ))}
          </div>
        </DashboardCard>
      </div>
    </SiteShell>
  );
}
