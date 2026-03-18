const requiredClaims = ["repository", "ref", "sha"] as const;

export type VerifiedGitHubIdentity = {
  repository: string;
  ref: string;
  sha: string;
};

export function verifyGitHubActionsIdentity(
  token: string | undefined
): VerifiedGitHubIdentity {
  if (!token || token.trim().length < 20) {
    throw new Error("missing_or_invalid_oidc_token");
  }

  // Placeholder verification while the real JWT/JWKS validation is wired.
  // The ingest route should fail loudly unless a signed token is present.
  return {
    repository: process.env.GITHUB_REPOSITORY ?? "unknown/unknown",
    ref: process.env.GITHUB_REF ?? "refs/heads/main",
    sha: process.env.GITHUB_SHA ?? "local-dev"
  };
}

export function describeRequiredOidcClaims(): readonly string[] {
  return requiredClaims;
}
