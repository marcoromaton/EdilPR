# Log sessioni — Edox

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
- 13:18 — **Logo EdilPR** (casetta bianca su blu, porta arancione): file `assets/logo-edilpr.svg`, copiato in linea nella barra in alto e come icona della scheda in `src/preventivi/index.html`. Controllato con uno screenshot di Chrome senza interfaccia (solo barra, schermo largo); non controllato su telefono e Safari/Firefox.
- 13:25 — **Cambio nome in Edox e nuovo logo**: E di travi con una "d" piccola, panna e verde (scelta di Marco, al posto di EdilPR). File `assets/logo-edox.svg` (sostituisce `logo-edilpr.svg`, mai committato); in `src/preventivi/index.html` cambiati nome nella barra, titolo della pagina e icona della scheda. Controllato con screenshot della barra in Chrome senza interfaccia. Non toccati: colori dell'app (restano blu) e nome del repository/link (restano EdilPR). Non ancora committato né pubblicato.
- 13:27 — **Logo Edox cambiato**: tolta la "d", la E di travi è ruotata di 30° verso sinistra (decisione di Marco). Aggiornati `assets/logo-edox.svg`, barra e icona della scheda in `src/preventivi/index.html`. Verificato con screenshot in Chrome senza interfaccia; non verificata l'icona a 16 px nella scheda reale. Non ancora committato né pubblicato.
- 13:28 — **Colori dell'app in verde e panna** (coerenti col logo Edox), in `src/preventivi/index.html`: sfondi panna, barra e pulsanti verdi `#2f6b4f`, foglio del preventivo con colore predefinito verde (la carta resta bianca). Chi aveva ancora il blu predefinito `#2b4a6f` salvato passa al verde; un colore scelto a mano resta. Verificato con screenshot in Chrome senza interfaccia (modulo e foglio, schermo largo, anche con il blu vecchio salvato). Non verificati: stampa in PDF con il nuovo colore, telefono, Safari/Firefox. Non ancora committato né pubblicato.
- 14:09 — **Testi allineati al nome Edox**: README, CLAUDE.md (nuova sezione "Nome, link e dati salvati"), guida per il papà (ora apre dal link), ADR, skill del log, intestazione di LOG.md e commenti di `index.html`. Il repository e il link restano `EdilPR`; la chiave di salvataggio `preventivi-edili-v1` resta invariata di proposito (cambiarla farebbe sparire i preventivi salvati). Controllo con ricerca testuale del vecchio nome. Non ancora committato.

## 06/11/2026
### Marco
- 15:45 — **Prima versione dell'app.** Creata la struttura standard romaton-srl (copiata da Prima Nota, adattata). `src/preventivi/calcoli.js` (calcoli in centesimi interi, 16 test in `tests/`) e `index.html` (modulo + anteprima A4 live, stampa/PDF dal browser, salvataggio in localStorage, copia/recupero dati in JSON, esempio). Provata in Chrome via server locale: totali, ricarica, ripristino. Non provati: stampa reale, Safari/Firefox, apertura da `file://`.
