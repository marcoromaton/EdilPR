# Sicurezza

Questo repository contiene un'app per fare preventivi edili. **Non vanno mai committati**
preventivi reali, dati di clienti, IBAN, P.IVA, codici fiscali, credenziali (chiavi API). I dati veri stanno su Google Drive o nella
cartella locale `dati/`, esclusa da git. Nei test e negli esempi solo dati inventati.

`scripts/controlla-dati-sensibili.sh` blocca codici fiscali e IBAN: lo lanciano l'hook di Claude
prima di ogni commit e la CI su ogni push. Non riconosce tutto (nomi, importi, numeri di conto
scritti in altro modo): non sostituisce l'attenzione.

Se hai committato per errore un dato sensibile o una credenziale, non basta cancellarla in un
commit successivo: avvisa subito Marco per ruotare la credenziale e ripulire la storia.
Non scrivere il dettaglio in una Issue.
