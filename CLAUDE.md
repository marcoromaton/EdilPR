# Edox

Web app per preventivi edili (form + anteprima A4 live + stampa/PDF dal browser). Struttura
standard di `romaton-srl` (modello: Gruppomedica Prima Nota, ADR in `docs/adr/0001-struttura-repository.md`).

## Regole del progetto

- Stack: HTML + CSS + JavaScript puro. Nessuna libreria, nessun server, nessun build. Deve aprirsi
  con doppio clic su `src/preventivi/index.html` (protocollo `file://`).
- Chi mantiene il codice: Marco, non tecnico esperto. Nomi chiari, commenti sul perché,
  nessuna magia. Lingua del codice, dei commenti e dei commit: italiano.
- I soldi si calcolano in **centesimi interi** (mai decimali): le funzioni stanno in
  `src/preventivi/calcoli.js` e hanno test in `tests/`.
- Utente finale non tecnico: ogni testo visibile in italiano semplice.

## Nome, link e dati salvati

- Nome dell'app: **Edox** (logo: E di travi inclinata di 30°, verde `#2f6b4f` e panna `#f6f1e4`, file `assets/logo-edox.svg`).
- Repository e link pubblico si chiamano ancora `EdilPR` (vecchio nome): `https://marcoromaton.github.io/EdilPR/`. Rinominarli cambia l'indirizzo e il browser lega i dati all'indirizzo: prima va fatta una copia dei dati.
- **Non cambiare** `CHIAVE = 'preventivi-edili-v1'` in `index.html`: è il nome sotto cui il browser salva i preventivi, cambiarlo li fa sparire.

## Dove stanno stato e decisioni

- **Backlog**: Issues. **Log**: `LOG.md` (regola in `.claude/rules/log-modifiche.md`, skill `/log-sessione`).
- **Decisioni di struttura e architettura**: `docs/adr/`.

## Dati sensibili

Preventivi reali, dati di clienti, P.IVA e IBAN veri non vanno mai nel repo: stanno in `dati/`
(in `.gitignore`) o su Drive. Negli esempi e nei test solo dati inventati, con i segnaposto
`XXXXXX00X00X000X` (codice fiscale) e `IT00X0000000000000000000000` (IBAN).
`scripts/controlla-dati-sensibili.sh` blocca codici fiscali e IBAN (hook prima di `git commit` e CI).

## Struttura

- `src/preventivi/` app (`index.html`, `calcoli.js`) · `tests/` test · `scripts/` supporto · `docs/` (`adr/`) · `assets/`
- `dati/` dati veri, in `.gitignore` · `.tmp/` file generati, in `.gitignore` · `.env` chiavi, in `.gitignore` (in repo solo `.env.example`)
- `LOG.md`, `CHANGELOG.md`, `archivio/` nella radice
- `.claude/` — `settings.json` (permessi e hook), `agents/` (`research`, `reviewer`, `qa`), `rules/`
  (`log-modifiche`, `security`, `git`), `skills/log-sessione/`, `hooks/`
