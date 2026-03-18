import { DashboardCard } from "@/components/dashboard-card";
import { SiteShell } from "@/components/site-shell";

export default function GitHubSettingsPage() {
  return (
    <SiteShell
      eyebrow="Settings / GitHub"
      title="GitHub is an identity and delivery layer."
      description="The app should ask GitHub for repo selection, webhook events, and source archives. It should not ask users to move secrets around manually."
    >
      <div className="split">
        <DashboardCard title="Install health" accent="amber">
          <div className="list-grid">
            <article className="artifact-row">
              <p className="label">Connection state</p>
              <p>Ready for GitHub OAuth, GitHub App install sync, and webhook reconciliation.</p>
            </article>
            <article className="artifact-row">
              <p className="label">Action trigger</p>
              <p>Workflow template posts repository metadata to the ingest endpoint after every merge to main.</p>
            </article>
          </div>
        </DashboardCard>

        <DashboardCard title="What gets templated">
          <div className="route-list">
            <article className="route-row">
              <strong>Workflow template</strong>
              <p>Generates the GitHub Action that signs and submits a run.</p>
            </article>
            <article className="route-row">
              <strong>Repo config template</strong>
              <p>Stores include/exclude paths, token budget, and artifact toggles in version control.</p>
            </article>
            <article className="route-row">
              <strong>Setup PR copy</strong>
              <p>Explains what the user is merging and why it is safe.</p>
            </article>
          </div>
        </DashboardCard>
      </div>
    </SiteShell>
  );
}
