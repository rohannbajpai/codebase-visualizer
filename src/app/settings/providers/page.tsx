import { DashboardCard } from "@/components/dashboard-card";
import { SiteShell } from "@/components/site-shell";
import { demoProviders } from "@/server/demo-data";

export default function ProvidersPage() {
  return (
    <SiteShell
      eyebrow="Settings / Providers"
      title="Model policy without model chaos."
      description="This page is the thin control surface for provider secrets and default model selection. The initial scaffold keeps the UX narrow on purpose: validate, label, assign."
    >
      <div className="split">
        <DashboardCard title="Configured providers" accent="teal">
          <div className="list-grid">
            {demoProviders.map((provider) => (
              <article key={provider.name} className="provider-row">
                <p className="label">{provider.name}</p>
                <code>{provider.recommendedModel}</code>
                <p>{provider.policy}</p>
              </article>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard title="Policy rules">
          <div className="list-grid">
            <article className="artifact-row">
              <p className="label">Default first</p>
              <p>One recommended model policy per repository, with advanced overrides deferred behind later settings.</p>
            </article>
            <article className="artifact-row">
              <p className="label">Validation</p>
              <p>Every key is tested via an API route before it can become active.</p>
            </article>
            <article className="artifact-row">
              <p className="label">Storage</p>
              <p>Secrets belong in app-managed storage, never in the GitHub Action itself.</p>
            </article>
          </div>
        </DashboardCard>
      </div>
    </SiteShell>
  );
}
