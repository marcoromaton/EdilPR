#!/bin/bash
# PreToolUse hook su Bash: prima di un "git commit" controlla i file in staging con
# scripts/controlla-dati-sensibili.sh (codici fiscali e IBAN) e blocca il comando se trova qualcosa.
# Controlla codici fiscali e IBAN (stessa idea dello standard romaton-srl).

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // ""')

if echo "$COMMAND" | grep -qE '\bgit[[:space:]]+commit\b'; then
  cd "$CLAUDE_PROJECT_DIR" || exit 0
  if ! bash scripts/controlla-dati-sensibili.sh --staged; then
    echo "Commit bloccato. Se è un dato reale, toglilo dallo staging. Se è un falso positivo, chiedi a Marco di fare il commit fuori da Claude Code." >&2
    exit 2
  fi
fi

exit 0
