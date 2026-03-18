provider "neon" {
  api_key = var.neon_api_key
}

resource "neon_project" "app" {
  name      = var.project_name
  region_id = var.region_id
}

resource "neon_branch" "production" {
  project_id = neon_project.app.id
  name       = "production"
}

resource "neon_database" "app" {
  project_id = neon_project.app.id
  branch_id  = neon_branch.production.id
  name       = var.database_name
}
