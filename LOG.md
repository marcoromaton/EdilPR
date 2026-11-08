# Log sessioni — Preventivi Edili

Registro delle modifiche e decisioni reali sul progetto (Marco). **Più recente in cima.**

Formato:

```
## GG/MM/AAAA
### Nome
- HH:MM — <cosa è cambiato, dove, perché>
```

## 08/11/2026
### Marco
- 13:11 — **Tolto il piè di pagina del browser dalla stampa/PDF** (indirizzo del file, data, titolo, visibili aprendo da Finder). In `src/preventivi/index.html`: `@page` con margine 0 e distanza dai bordi data dal padding del foglio (`box-decoration-break: clone`, così si ripete su ogni pagina). Provato con un PDF di 40 righe (3 pagine) generato da Chrome senza interfaccia: nel testo del PDF non compaiono indirizzo né titolo, margini e intestazione tabella presenti anche a pagina 2. Non provato: la stampa dalla finestra normale di Chrome e altri browser (Safari/Firefox).
- 13:11 — **Provata l'apertura con doppio clic (`file://`)**: i dati si salvano e restano dopo aver chiuso e riaperto la scheda in Chrome (verificato da Marco).
- 13:13 — **Pubblicazione con link (GitHub Pages).** Aggiunto `.github/workflows/pubblica.yml`: a ogni push su `main` pubblica solo `src/preventivi`. Repository pubblico `marcoromaton/EdilPR` (scelta di Marco: il codice è visibile, i dati dei preventivi restano nel browser di chi usa l'app).
- 13:15 — **Corretta la CI**: su GitHub (Node 22) `node --test tests/` falliva (cercava un file "tests"). Ora il comando è `node --test` senza argomenti, in CI e nella documentazione.

## 06/11/2026
### Marco
- 15:45 — **Prima versione dell'app.** Creata la struttura standard romaton-srl (copiata da Prima Nota, adattata). `src/preventivi/calcoli.js` (calcoli in centesimi interi, 16 test in `tests/`) e `index.html` (modulo + anteprima A4 live, stampa/PDF dal browser, salvataggio in localStorage, copia/recupero dati in JSON, esempio). Provata in Chrome via server locale: totali, ricarica, ripristino. Non provati: stampa reale, Safari/Firefox, apertura da `file://`.
