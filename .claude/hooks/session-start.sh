#!/bin/bash
set -euo pipefail

# Only run in remote (Claude Code on the web) environments
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-.}"

# Ensure output/briefings directory exists for daily briefing archive
mkdir -p "$PROJECT_DIR/output/briefings"

# Validate all JSON files are well-formed
echo "Validating JSON files..."
errors=0
for f in "$PROJECT_DIR"/memory/*.json "$PROJECT_DIR"/config/*.json; do
  if [ -f "$f" ]; then
    if ! python3 -m json.tool "$f" > /dev/null 2>&1; then
      echo "ERROR: Invalid JSON in $f"
      errors=$((errors + 1))
    fi
  fi
done

if [ "$errors" -gt 0 ]; then
  echo "WARNING: $errors JSON file(s) have syntax errors"
else
  echo "All JSON files valid"
fi

echo "Session start hook completed"
