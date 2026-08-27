#!/usr/bin/env bash
# CI checks out this repo alone, but the app spans four sibling repos and every
# one of them imports types from ../../shared-types — so recreate that layout
# next to the checkout, start the backends, then hand the foreground to vite.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PARENT="$(dirname "$ROOT")"

for repo in shared-types auth-service notes-api; do
  if [ -d "$PARENT/$repo" ]; then
    echo "[ci-stack] $repo already present"
  else
    echo "[ci-stack] cloning $repo"
    git clone --depth 1 --quiet "https://github.com/jaedy-QA/$repo.git" "$PARENT/$repo"
  fi
done

pids=()
# Stop the backends when Playwright shuts this process down.
trap 'if [ ${#pids[@]} -gt 0 ]; then kill "${pids[@]}" 2>/dev/null || true; fi' EXIT

for svc in auth-service notes-api; do
  echo "[ci-stack] installing $svc"
  # Those repos have no lockfile, and their start script needs tsx from devDependencies.
  npm install --prefix "$PARENT/$svc" --include=dev --no-audit --no-fund
  echo "[ci-stack] starting $svc"
  (cd "$PARENT/$svc" && npm start) &
  pids+=($!)
done

# global-setup.ts waits for both services through the vite proxy, so readiness
# is not re-checked here.
echo "[ci-stack] starting vite"
npm run dev
