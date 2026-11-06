# Come contribuire

1. Lavora su un branch (`git checkout -b nome-breve`), non direttamente su `main`.
2. Un commit per intervento, messaggio in italiano che dice cosa e perché; cita l'Issue (`#3`).
3. Aggiorna `LOG.md` e `CHANGELOG.md`.
4. Mai dati reali di clienti, IBAN, codici fiscali o credenziali nel diff (vedi
   [.github/SECURITY.md](.github/SECURITY.md)); prima del commit puoi lanciare
   `bash scripts/controlla-dati-sensibili.sh --staged`.
5. Apri una Pull Request: il modello ti guida nei controlli.
