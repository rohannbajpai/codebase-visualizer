import { processRunJob } from "@/worker/jobs/process-run-job";

async function main() {
  const demoResult = await processRunJob({
    repository: "rohannbajpai/codebase-visualizer",
    sha: "local-dev",
    branch: "feat-nextjs-foundation"
  });

  console.log(
    JSON.stringify(
      {
        message: "Worker bootstrapped",
        stages: demoResult.stages,
        manifest: demoResult.manifest.outputs.length
      },
      null,
      2
    )
  );
}

void main().catch((error) => {
  console.error("worker_boot_failed", error);
  process.exitCode = 1;
});
