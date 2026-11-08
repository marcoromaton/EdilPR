# Edox

Edox è una web app per fare preventivi edili: si compilano i dati a sinistra, a destra compare il documento
A4 già impaginato (stile PandaDoc, semplice), poi si stampa o si salva in PDF dal browser.
Nata per un freelancer del settore edile. Struttura standard di `romaton-srl`.

L'app è pubblicata su https://marcoromaton.github.io/EdilPR/ (il repository e il link si chiamano ancora `EdilPR`, il vecchio nome: rinominarli cambierebbe l'indirizzo e i dati salvati nel browser non comparirebbero più da quello nuovo).

## Come si usa

Apri il link qui sopra, oppure `src/preventivi/index.html` con doppio clic (meglio Chrome o Edge). Nessuna installazione,
nessun server, nessuna connessione internet. Guida per l'utente: [docs/uso-per-papa.md](docs/uso-per-papa.md).

## Da dove partire

| Cosa cerchi | Dove |
|---|---|
| L'app | [src/preventivi/index.html](src/preventivi/index.html) |
| I calcoli (totali, IVA, sconti) | [src/preventivi/calcoli.js](src/preventivi/calcoli.js), test in [tests/](tests/) |
| Cosa è stato fatto, giorno per giorno | [LOG.md](LOG.md) (più recente in cima) |
| Decisioni di struttura e architettura | [docs/adr/](docs/adr/) |
| Istruzioni per Claude | [CLAUDE.md](CLAUDE.md) |

## Test

```
node --test
```

## Dati

I preventivi stanno nella memoria del browser (`localStorage`), non nel repo. Preventivi reali,
dati di clienti, IBAN e P.IVA veri non vanno mai committati: lo blocca l'hook
`.claude/hooks/blocca-dati-sensibili.sh` e la CI (vedi [.github/SECURITY.md](.github/SECURITY.md)).
