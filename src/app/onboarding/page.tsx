import { DashboardCard } from "@/components/dashboard-card";
import { SiteShell } from "@/components/site-shell";

const steps = [
  "Connect a GitHub account and install the app on a repository.",
  "Paste provider keys once and validate them immediately.",
  "Generate a setup PR containing the workflow and repo config.",
  "Merge to main and let the first dashboard publish itself."
];

export default function OnboardingPage() {
  return (
    <SiteShell
      eyebrow="Onboarding"
      title="Five minutes to first signal."
      description="The onboarding surface is intentionally linear. Owners should never wonder which prerequisite is blocking them or where their secrets live."
    >
      <div className="split">
        <DashboardCard title="Happy path" accent="amber">
          <div className="timeline">
            {steps.map((step, index) => (
              <article key={step} className="timeline-item">
                <p className="label">Step 0{index + 1}</p>
                <p>{step}</p>
              </article>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard title="Guardrails">
          <div className="list-grid">
            <article className="artifact-row">
              <p className="label">Only true blockers</p>
              <p>No GitHub install, no valid provider key, or no merged setup PR.</p>
            </article>
            <article className="artifact-row">
              <p className="label">Immediate validation</p>
              <p>Provider keys are tested as soon as they are entered so the user never reaches a broken first run.</p>
            </article>
            <article className="artifact-row">
              <p className="label">Generated setup</p>
              <p>The repo receives a templated workflow and config file rather than a wall of manual instructions.</p>
            </article>
          </div>
        </DashboardCard>
      </div>
    </SiteShell>
  );
}
