variable "neon_api_key" {
  description = "Neon API key with project and branch management rights."
  type        = string
  sensitive   = true
}

variable "project_name" {
  description = "Project name for the Neon stack."
  type        = string
}

variable "region_id" {
  description = "Neon region identifier."
  type        = string
  default     = "aws-us-east-1"
}

variable "database_name" {
  description = "Primary application database name."
  type        = string
  default     = "codebase_visualizer"
}
