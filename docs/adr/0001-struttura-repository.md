# ADR 0001 — Struttura standard del repository

**Stato:** attuata il 06/11/2026, alla creazione del repository

## Decisione
Il repository segue lo standard comune di `romaton-srl`, copiato da Gruppomedica Prima Nota:
`.github/`, `docs/`, `src/`, `tests/`, `scripts/`, `assets/`, `archivio/`, `LOG.md` più `README`,
`CHANGELOG`, `CONTRIBUTING`, `LICENSE`, `.editorconfig`, `.gitattributes`. Configurazione di Claude:
`CLAUDE.md` + `.claude/{rules,agents,skills,hooks,settings.json}`.

## Differenze rispetto a Prima Nota
| Prima Nota | Edox | Perché |
|---|---|---|
| test Python (`unittest`) nella CI | test JavaScript (`node --test`) | l'app è in JavaScript |
| `*.csv` e `*.xlsx` fuori da git | non esclusi | qui non ci sono export di banca |
| skill n8n, `dati/prototipo/`, `dati/state/` | assenti | specifici di Prima Nota |
| regola git con riferimento al repo del QMS | senza | questo repo è autonomo |

## Scelta dello stack
HTML + CSS + JavaScript puro, senza server né build: l'utente finale non è tecnico e non deve
installare nulla. I calcoli sono in un file separato (`calcoli.js`) per poterli testare con
`node --test`; l'app resta apribile con doppio clic.
