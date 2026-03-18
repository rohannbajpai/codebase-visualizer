variable "cloudflare_api_token" {
  description = "Cloudflare API token for R2 bucket management."
  type        = string
  sensitive   = true
}

variable "cloudflare_account_id" {
  description = "Cloudflare account ID."
  type        = string
}

variable "bucket_name" {
  description = "Artifact bucket name."
  type        = string
  default     = "codebase-visualizer-prod"
}
