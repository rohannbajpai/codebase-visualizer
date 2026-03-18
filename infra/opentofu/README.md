# OpenTofu starter modules

This directory holds the initial infrastructure-as-code scaffolding for managed
resources used by the app.

Current scope:

- `neon/` — project, production branch, and database bootstrap
- `r2/` — artifact bucket bootstrap

These modules are intended as starter templates for the engineering plan rather
than production-hardened platform code. Validate provider versions and resource
shapes against the latest vendor docs before a real `tofu apply`.
