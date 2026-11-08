---
name: log-sessione
description: Aggiunge una voce a LOG.md di Edox per una modifica o decisione reale appena fatta, nel formato data/persona/orario. Usare dopo ogni modifica o decisione reale (non un tentativo, non una bozza) — un buon momento pratico è lo stesso istante di un git commit — o quando si invoca /log-sessione.
when_to_use: Subito dopo aver fatto una modifica o decisione reale sul progetto (codice scritto, script eseguito, file committato, decisione presa) — non per lavoro ancora in corso o non confermato.
---

## Dove scrivi

`LOG.md` nella radice di questo repository (Edox).

## Formato (fisso, non cambiarlo)

```
## GG/MM/AAAA
### <Nome persona>
- HH:MM — <descrizione della modifica/decisione, concreta e verificabile>
```

Una riga per voce, orario nel fuso locale (`date '+%H:%M'`), descrizione breve ma specifica
(cosa è cambiato, dove, perché).

## Procedura

1. Leggi l'inizio di `LOG.md` fino alla prima intestazione `## GG/MM/AAAA`.
2. Se quella intestazione è la data di oggi:
   - c'è già `### <Nome persona>` → aggiungi la riga in fondo alle sue righe;
   - non c'è → aggiungi `### <Nome persona>` subito dopo `## GG/MM/AAAA` e la riga sotto.
3. Se non è la data di oggi: crea `## GG/MM/AAAA` + `### <Nome persona>` + riga, **sopra** tutte
   le altre date.
4. Edit con sostituzione mirata: le voci passate non si toccano.
5. Se l'utente ha chiesto il commit, la voce va nello stesso commit della modifica.
6. Conferma con il link a [LOG.md](LOG.md).

## Non fare

- Non riscrivere o riordinare voci passate.
- Non loggare bozze, tentativi falliti o lavoro non confermato.
- Non inventare l'orario: se non è noto, scrivi "mattina", "pomeriggio", "sera".
- Niente dati personali o bancari (codici fiscali, IBAN, importi riferiti a persone) nel log.
