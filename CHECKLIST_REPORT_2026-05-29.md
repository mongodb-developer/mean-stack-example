# Repo AI Crawlability Checklist Report

Date: 2026-05-29
Repository: mean-stack-example
Checklist Source: MongoDB Developer Repository AI Discoverability Checklist

## Summary

- Pass: 15
- Partial: 2
- Fail: 0
- Pending external (GitHub UI): 2

## Pass 1 — Metadata and Discoverability

### Repository name
Status: PASS
Notes: Name is descriptive and kebab-case.

### Description (GitHub repo setting)
Status: PENDING EXTERNAL
Notes: Repository settings cannot be updated from local files here. Prepared exact text in .github/repository-metadata.md.

### Topics (GitHub repo setting)
Status: PENDING EXTERNAL
Notes: Repository settings cannot be updated from local files here. Prepared exact topics in .github/repository-metadata.md.

### README required sections
Status: PASS
Notes:
- Descriptive H1 present
- Features section present
- Architecture overview + Mermaid present
- Quick Start commands present
- MongoDB features and docs links present
- Additional resources present

### README quality bar
Status: PASS
Notes:
- Opening value proposition present
- Prerequisites and versions present
- Codespaces badge present
- Environment variable table present
- API table present
- Troubleshooting section present

### README command validity (local evidence)
Status: PARTIAL
Notes:
- Verified: backend build and lint checks pass via npm run build:server and npm run test:server
- Not executed in this run: full npm start end-to-end and Angular test due environment/runtime constraints in this audit pass

### EDD.md exists and matches model
Status: PASS
Notes: EDD reflects server/src/database.ts collection, required fields, constraints, and API mapping.

### EDD follows strict edd-skill standard format
Status: PARTIAL
Notes: EDD is structured and accurate, but not generated/validated with edd-skill tooling in this run.

## Pass 2 — Operability and Trust

### AGENTS.md required sections
Status: PASS
Notes:
- Build/test commands present
- Project structure present
- Environment/config present
- MongoDB Skills section present
- EDD usage guidance present

### .claude/settings.json plugin enablement
Status: PASS
Notes: mongodb@claude-plugins-official enabled.

### LICENSE
Status: PASS
Notes: Apache-2.0 license present.

### Seed script
Status: PASS
Notes: Deterministic seed script exists at server/scripts/seed.ts with replace-style behavior (delete then insert).

### Devcontainer and Codespaces
Status: PASS
Notes:
- .devcontainer/devcontainer.json present with Node feature, extension, ports, postCreate, postStart, remoteEnv
- .devcontainer/docker-compose.yml present with pinned Atlas Local image, healthcheck, volumes, and network_mode: service:mongodb
- Codespaces badge present in README

### appName in MongoDB client
Status: PASS
Notes: appName is set in server/src/database.ts.

### CI workflow present
Status: PASS
Notes: Workflow exists at .github/workflows/ci.yml with MongoDB service, build, lint, seed, healthcheck, and smoke endpoint check.

### CI evidence
Status: PASS (local confidence)
Notes: Local backend checks passed. Remote GitHub Actions run status is not queryable from this environment.

## Commands Run During This Audit

- npm run build:server
- npm run test:server

Both completed successfully.

## Remaining Actions to Reach 100%

1. Apply repository Description from .github/repository-metadata.md in GitHub settings.
2. Apply repository Topics from .github/repository-metadata.md in GitHub settings.
3. Optional hardening: validate EDD with edd-skill tooling and update format if required.
4. Optional hardening: run a full clean-machine end-to-end check including npm start and API/UI smoke.
