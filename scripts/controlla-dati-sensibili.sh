#!/bin/bash
# Cerca codici fiscali e IBAN italiani reali nei file del repository.
#   --staged  i file in staging (lo usa l'hook di Claude prima di "git commit")
#   --tutti   tutti i file tracciati (lo usa la CI)
# Esce con 1 e l'elenco dei casi trovati, 0 se è tutto pulito.
# Segnaposto ammessi: XXXXXX00X00X000X (codice fiscale), IT00X0000000000000000000000 (IBAN).

CF='[A-Za-z]{6}[0-9]{2}[A-Za-z][0-9]{2}[A-Za-z][0-9]{3}[A-Za-z]'
IBAN='IT[0-9]{2}[A-Z][0-9]{10}[0-9A-Z]{12}'
SEGNAPOSTO='^(XXXXXX00X00X000X|IT00X0000000000000000000000)$'

case "$1" in
  --staged) FILES=$(git diff --cached --name-only --diff-filter=ACMR); leggi() { git show ":$1"; } ;;
  --tutti)  FILES=$(git ls-files); leggi() { cat "$1"; } ;;
  *) echo "uso: $0 --staged | --tutti" >&2; exit 2 ;;
esac

TROVATI=""
while IFS= read -r f; do
  [ -z "$f" ] && continue
  HIT=$(leggi "$f" 2>/dev/null | tr -d ' ' | grep -aoE "$CF|$IBAN" | grep -vE "$SEGNAPOSTO" | sort -u | tr '\n' ' ')
  [ -n "$HIT" ] && TROVATI="${TROVATI}
${f}: ${HIT}"
done <<< "$FILES"

if [ -n "$TROVATI" ]; then
  echo "Trovati codici fiscali o IBAN che sembrano reali (segnaposto esclusi):$TROVATI" >&2
  exit 1
fi
exit 0
