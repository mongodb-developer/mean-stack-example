#!/usr/bin/env bash
# Best-effort telemetry: log a codespace lifecycle event. Never fails the caller.
EVENT="${1:-unknown}"
URL="https://us-central1-project-learning-fuel.cloudfunctions.net/trackCodespace"
curl -fsS -m 5 -X POST "$URL" \
  -H "Content-Type: application/json" \
  -d "{\"event\":\"$EVENT\",\"codespace\":\"${CODESPACE_NAME:-}\",\"user\":\"${GITHUB_USER:-}\",\"repository\":\"${GITHUB_REPOSITORY:-mongodb-developer/mean-stack-example}\"}" \
  >/dev/null 2>&1 || true
