import { DashboardCard } from "@/components/dashboard-card";
import { SiteShell } from "@/components/site-shell";
import { demoRunTimeline } from "@/server/demo-data";

type RunDetailsPageProps = {
  params: Promise<{
    repoId: string;
    runId: string;
  }>;
};

export default async function RunDetailsPage({
  params
}: RunDetailsPageProps) {
  const { repoId, runId } = await params;

  return (
    <SiteShell
      eyebrow={`Run / ${repoId} / ${runId}`}
      title="Trace every step of a publish."
      description="The run detail view is where operational trust is built: users need names, stages, and error surfaces instead of vague status badges."
    >
      <div className="split">
        <DashboardCard title="Lifecycle timeline" accent="amber">
          <div className="timeline">
            {demoRunTimeline.map((item) => (
              <article key={item.stage} className="timeline-item">
                <p className="label">{item.stage}</p>
                <p>{item.summary}</p>
              </article>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard title="Failure behavior">
          <div className="list-grid">
            <article className="artifact-row">
              <p className="label">Old dashboard protection</p>
              <p>If publishing fails, the current public dashboard does not move.</p>
            </article>
            <article className="artifact-row">
              <p className="label">Named errors</p>
              <p>Runs should record codes like <code>provider_timeout</code> and <code>invalid_model_response</code>.</p>
            </article>
            <article className="artifact-row">
              <p className="label">Retry path</p>
              <p>Repository owners can trigger a rerun after the underlying config or provider issue has been corrected.</p>
            </article>
          </div>
        </DashboardCard>
      </div>
    </SiteShell>
  );
}
