#!/usr/bin/env bash
set -euo pipefail

# Simple wrapper to run the Python dev server script with sane defaults.

HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/.." && pwd)"

cd "$ROOT"

PY=${PYTHON:-python3}

ORIGINS=${CORS_ALLOW_ORIGINS:-"http://localhost:3000,http://127.0.0.1:3000"}
PREFERRED=${PREFERRED_PORTS:-"9090,8000,8080"}

exec "$PY" "$ROOT/scripts/dev_server.py" --app app:app --reload --origins "$ORIGINS" --preferred-ports "$PREFERRED"









