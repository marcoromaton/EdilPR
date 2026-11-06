# Log sessioni — Preventivi Edili

Registro delle modifiche e decisioni reali sul progetto (Marco). **Più recente in cima.**

Formato:

```
## GG/MM/AAAA
### Nome
- HH:MM — <cosa è cambiato, dove, perché>
```

## 06/11/2026
### Marco
- 15:45 — **Prima versione dell'app.** Creata la struttura standard romaton-srl (copiata da Prima Nota, adattata). `src/preventivi/calcoli.js` (calcoli in centesimi interi, 16 test in `tests/`) e `index.html` (modulo + anteprima A4 live, stampa/PDF dal browser, salvataggio in localStorage, copia/recupero dati in JSON, esempio). Provata in Chrome via server locale: totali, ricarica, ripristino. Non provati: stampa reale, Safari/Firefox, apertura da `file://`.
