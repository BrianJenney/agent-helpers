#!/bin/bash
set -uo pipefail

global_file="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/CLAUDE.md"
if [ -f "$global_file" ] && grep -q "paved-path:start" "$global_file"; then
  exit 0
fi

cat "${CLAUDE_PLUGIN_ROOT}/skills/setup-global/global-claude.md"
