#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

CANDIDATES=(
  "$ROOT/backend/backend.log"
  "$ROOT/frontend/frontend.log"
  "/tmp/backend.log"
  "/tmp/frontend.log"
)

pids=()
found=0

start_tail() {
  local file="$1"
  local label="$2"

  if [ -f "$file" ]; then
    found=1
    echo "--- Tail $label ($file) ---"
    tail -n 80 -f "$file" &
    pids+=("$!")
  else
    echo "Skip $label (missing)"
  fi
}

start_tail "${CANDIDATES[0]}" "backend"
start_tail "${CANDIDATES[1]}" "frontend"
start_tail "${CANDIDATES[2]}" "backend/tmp"
start_tail "${CANDIDATES[3]}" "frontend/tmp"

if [ "$found" -eq 0 ]; then
  echo "No log files found. Start services first."
  exit 1
fi

cleanup() {
  for pid in "${pids[@]:-}"; do
    kill "$pid" 2>/dev/null || true
  done
}

trap cleanup INT TERM EXIT

wait
