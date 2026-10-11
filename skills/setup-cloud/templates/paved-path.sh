#!/bin/bash
set -uo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

if claude plugin list 2>/dev/null | grep -q "paved-path@agent-helpers"; then
  exit 0
fi

claude plugin marketplace add BrianJenney/agent-helpers >/dev/null 2>&1
if claude plugin install paved-path@agent-helpers >/dev/null 2>&1; then
  installed="yes"
else
  installed="no"
fi

cat "$CLAUDE_PROJECT_DIR/.claude/hooks/paved-path-rules.md"
echo
if [ "$installed" = "yes" ]; then
  echo "The paved-path plugin was installed for this cloud session. If its /paved-path:* commands are not listed yet, run /reload-plugins."
else
  echo "The paved-path plugin could not be installed in this cloud session, so its /paved-path:* commands are not available. The starting rules above still apply. Tell the user once: the BrianJenney/agent-helpers repo was not reachable from this session."
fi
exit 0
