# Sicurezza

- Chiavi API e segreti solo in `.env` (in `.gitignore`, mai nel repo); in repo c'è solo `.env.example` con i nomi, senza valori.
- Dati veri di clienti e preventivi reali (nomi, indirizzi, P.IVA, IBAN) solo in `dati/` o su Drive. Negli esempi e nei test: `XXXXXX00X00X000X` (codice fiscale) e `IT00X0000000000000000000000` (IBAN).
- Prima di ogni commit gira `scripts/controlla-dati-sensibili.sh` (hook di Claude e CI). Se segnala un dato, toglilo dallo staging: non aggirare il controllo.
- Non leggere né stampare `.env`; non incollare il contenuto di file di `dati/` in Issue, PR o LOG.
