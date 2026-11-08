/*
 * calcoli.js — tutti i calcoli del preventivo (totali, IVA, sconti, formato euro e date).
 *
 * Perché esiste come file a parte: sono le funzioni dove un errore costa soldi, quindi hanno dei
 * test automatici (tests/calcoli.test.js, si lanciano con: node --test).
 * Non tocca la pagina web: riceve numeri/testi, restituisce numeri/testi.
 *
 * REGOLA CHIAVE: i soldi sono sempre CENTESIMI INTERI (12,50 EUR = 1250).
 * Perché: i numeri con la virgola del computer sbagliano di pochissimo (0.1 + 0.2 = 0.30000000000000004)
 * e su un totale fiscale non è accettabile. Con i numeri interi non si sbaglia.
 * Le quantità sono in MILLESIMI (2,5 mq = 2500) e le percentuali in CENTESIMI DI PERCENTO (10,5% = 1050).
 *
 * Si usa sia nel browser (variabile globale `Calcoli`) sia in Node (require) per i test.
 */
(function (radice, fabbrica) {
  if (typeof module === 'object' && module.exports) module.exports = fabbrica();
  else radice.Calcoli = fabbrica();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // ---------------------------------------------------------------------------------------------
  // Lettura dei numeri scritti dall'utente
  // ---------------------------------------------------------------------------------------------

  /**
   * Legge un numero scritto "all'italiana" e lo restituisce come intero moltiplicato per 10^decimali.
   *   leggiNumero('1.234,50', 2) -> 123450      (il punto separa le migliaia, la virgola i decimali)
   *   leggiNumero('1200', 2)     -> 120000
   *   leggiNumero('1.200', 2)    -> 120000      (punto + 3 cifre = migliaia, come si scrive in Italia)
   *   leggiNumero('12.5', 2)     -> 1250        (un punto con altre cifre = decimali)
   *   leggiNumero('', 2)         -> 0           (campo vuoto = zero)
   *   leggiNumero('abc', 2)      -> null        (non è un numero: l'app lo segnala in rosso)
   * Se ci sono più decimali del previsto si arrotonda (1,005 con 2 decimali -> 1,01).
   * Se riceve un numero JavaScript (non un testo) usa il punto come separatore decimale.
   */
  function leggiNumero(valore, decimali) {
    if (valore === null || valore === undefined) return 0;
    var testo;
    var puntoComeDecimale = false;
    if (typeof valore === 'number') {
      if (!isFinite(valore)) return null;
      // NON usare toFixed: 1.005.toFixed(2) dà "1.00" (errore dei decimali). String(1.005) dà "1.005".
      testo = String(valore);
      puntoComeDecimale = true; // un numero JS ha sempre il punto come decimale, mai migliaia
    } else {
      testo = String(valore).replace(/[\s€]/g, '');
    }
    if (testo === '') return 0;

    var negativo = false;
    if (testo[0] === '-' || testo[0] === '+') {
      negativo = testo[0] === '-';
      testo = testo.slice(1);
    }
    if (testo === '') return null;

    var parteIntera;
    var parteDecimale = '';
    var posVirgola = testo.lastIndexOf(',');
    if (posVirgola !== -1 && !puntoComeDecimale) {
      parteIntera = testo.slice(0, posVirgola);
      parteDecimale = testo.slice(posVirgola + 1);
      // prima della virgola sono ammessi solo punti delle migliaia ben messi (1.234) o nessuno
      if (parteIntera.indexOf('.') !== -1) {
        if (!/^\d{1,3}(\.\d{3})+$/.test(parteIntera)) return null;
        parteIntera = parteIntera.replace(/\./g, '');
      }
    } else if (testo.indexOf('.') !== -1) {
      if (!puntoComeDecimale && /^\d{1,3}(\.\d{3})+$/.test(testo)) {
        parteIntera = testo.replace(/\./g, ''); // 1.200 oppure 1.234.567 = migliaia
      } else {
        var pezzi = testo.split('.');
        if (pezzi.length !== 2) return null;
        parteIntera = pezzi[0];
        parteDecimale = pezzi[1];
      }
    } else {
      parteIntera = testo;
    }

    if (!/^\d*$/.test(parteIntera) || !/^\d*$/.test(parteDecimale)) return null;
    if (parteIntera === '' && parteDecimale === '') return null;
    if (parteIntera === '') parteIntera = '0';

    var cifreUtili = parteDecimale.slice(0, decimali);
    while (cifreUtili.length < decimali) cifreUtili += '0';
    var risultato = Number(parteIntera + cifreUtili);
    // arrotondamento "per eccesso da 5 in su" guardando la prima cifra scartata
    if (parteDecimale.length > decimali && parteDecimale[decimali] >= '5') risultato += 1;
    if (!isFinite(risultato)) return null;
    return negativo ? -risultato : risultato;
  }

  /** Importo scritto dall'utente -> centesimi (null se non valido). */
  function leggiCentesimi(testo) { return leggiNumero(testo, 2); }
  /** Quantità scritta dall'utente -> millesimi (null se non valida). */
  function leggiQuantita(testo) { return leggiNumero(testo, 3); }
  /** Percentuale scritta dall'utente -> centesimi di percento, cioè 10,5 -> 1050 (null se non valida). */
  function leggiPercentuale(testo) { return leggiNumero(testo, 2); }

  // ---------------------------------------------------------------------------------------------
  // Scrittura dei numeri per l'utente
  // ---------------------------------------------------------------------------------------------

  function raggruppaMigliaia(cifre) {
    return cifre.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  /** Centesimi -> testo italiano: 123450 -> "1.234,50"; con simbolo: "1.234,50 €". */
  function formattaEuro(centesimi, conSimbolo) {
    var negativo = centesimi < 0;
    var assoluto = Math.abs(Math.round(centesimi));
    var euro = Math.floor(assoluto / 100);
    var cent = String(assoluto % 100);
    if (cent.length < 2) cent = '0' + cent;
    var testo = raggruppaMigliaia(String(euro)) + ',' + cent;
    if (negativo && assoluto !== 0) testo = '-' + testo;
    return conSimbolo === false ? testo : testo + ' €';
  }

  /** Millesimi -> testo italiano senza zeri inutili: 2500 -> "2,5"; 12000 -> "12". */
  function formattaQuantita(millesimi) {
    var negativo = millesimi < 0;
    var assoluto = Math.abs(Math.round(millesimi));
    var intera = Math.floor(assoluto / 1000);
    var dec = String(assoluto % 1000);
    while (dec.length < 3) dec = '0' + dec;
    dec = dec.replace(/0+$/, '');
    var testo = raggruppaMigliaia(String(intera)) + (dec ? ',' + dec : '');
    return negativo && assoluto !== 0 ? '-' + testo : testo;
  }

  /** Centesimi di percento -> testo: 1050 -> "10,5"; 2200 -> "22". */
  function formattaPercentuale(centesimiDiPercento) {
    var assoluto = Math.abs(Math.round(centesimiDiPercento));
    var intera = Math.floor(assoluto / 100);
    var dec = String(assoluto % 100);
    if (dec.length < 2) dec = '0' + dec;
    dec = dec.replace(/0+$/, '');
    var testo = String(intera) + (dec ? ',' + dec : '');
    return centesimiDiPercento < 0 && assoluto !== 0 ? '-' + testo : testo;
  }

  // ---------------------------------------------------------------------------------------------
  // Calcolo del preventivo
  // ---------------------------------------------------------------------------------------------

  /** Divisione intera arrotondata "da 0,5 in su" (per numeri positivi): evita i decimali del computer. */
  function dividiArrotonda(numeratore, denominatore) {
    return Math.floor((numeratore * 2 + denominatore) / (denominatore * 2));
  }

  /** Importo di una riga = quantità x prezzo unitario, in centesimi. (2,5 mq x 19,99 = 49,98) */
  function importoRiga(quantitaMillesimi, prezzoCentesimi) {
    var prodotto = quantitaMillesimi * prezzoCentesimi; // sempre intero
    var segno = prodotto < 0 ? -1 : 1;
    return segno * dividiArrotonda(Math.abs(prodotto), 1000);
  }

  /**
   * Divide `totale` centesimi tra i gruppi in proporzione ai loro `pesi`, senza perdere nemmeno un
   * centesimo (metodo del "resto più grande"): la somma delle parti è SEMPRE uguale al totale.
   * Usa BigInt perché peso x totale può superare il limite dei numeri normali per importi molto grandi.
   */
  function ripartisci(totale, pesi) {
    var sommaPesi = pesi.reduce(function (a, b) { return a + b; }, 0);
    if (sommaPesi <= 0 || totale === 0) return pesi.map(function () { return 0; });
    var T = BigInt(totale);
    var S = BigInt(sommaPesi);
    var parti = pesi.map(function (p) { return (T * BigInt(p)) / S; }); // parte intera
    var resti = pesi.map(function (p, i) { return { i: i, resto: (T * BigInt(p)) % S }; });
    var distribuito = parti.reduce(function (a, b) { return a + b; }, 0n);
    var daDare = Number(T - distribuito);
    // chi ha il resto più grande riceve il centesimo mancante (a parità, il primo della lista)
    resti.sort(function (a, b) { return a.resto === b.resto ? a.i - b.i : (a.resto > b.resto ? -1 : 1); });
    for (var k = 0; k < daDare; k++) parti[resti[k].i] += 1n;
    return parti.map(Number);
  }

  /**
   * Calcola tutto il preventivo.
   *
   * Ingresso (i valori numerici sono testi come li scrive l'utente, oppure numeri):
   *   righe:  [{ quantita: '2,5', prezzo: '19,99', iva: '22' | '10' | '4' | 'esente' }, ...]
   *   sconto: { tipo: 'percentuale' | 'euro', valore: '5' }       (facoltativo)
   *   acconto: '1.000,00'                                          (facoltativo)
   *
   * Regole:
   *  - Lo sconto si toglie dall'imponibile PRIMA dell'IVA, ripartito tra le aliquote in proporzione
   *    (così l'IVA è calcolata solo su quello che il cliente paga davvero).
   *  - L'IVA si calcola una volta per aliquota sul totale dell'aliquota (non riga per riga).
   *  - Lo sconto non può superare il totale delle voci; l'acconto non può superare il totale.
   *  - Un campo non valido conta come zero e viene segnalato in `errori` (l'app lo mostra in rosso).
   *
   * Uscita: tutti importi in centesimi interi.
   */
  function calcolaPreventivo(ingresso) {
    ingresso = ingresso || {};
    var righeIn = ingresso.righe || [];
    var errori = { righe: [], sconto: false, acconto: false };

    var righe = righeIn.map(function (r, indice) {
      var qta = leggiQuantita(r.quantita);
      var prezzo = leggiCentesimi(r.prezzo);
      var errQta = qta === null;
      var errPrezzo = prezzo === null;
      if (errQta || errPrezzo) errori.righe.push({ indice: indice, quantita: errQta, prezzo: errPrezzo });
      var chiaveIva = (r.iva === 'esente' || r.iva === undefined || r.iva === null || r.iva === '') ? 'esente' : String(r.iva);
      return {
        quantita: errQta ? 0 : qta,
        prezzo: errPrezzo ? 0 : prezzo,
        iva: chiaveIva,
        importo: importoRiga(errQta ? 0 : qta, errPrezzo ? 0 : prezzo),
      };
    });

    // 1) Imponibile per aliquota (prima dello sconto), nell'ordine in cui compaiono le aliquote.
    var chiavi = [];
    var imponibili = {};
    righe.forEach(function (r) {
      if (!(r.iva in imponibili)) { imponibili[r.iva] = 0; chiavi.push(r.iva); }
      imponibili[r.iva] += r.importo;
    });
    // ordine fisso: aliquote dalla più alta alla più bassa, "esente" per ultima
    chiavi.sort(function (a, b) {
      if (a === 'esente') return 1;
      if (b === 'esente') return -1;
      return Number(b) - Number(a);
    });
    var subtotale = chiavi.reduce(function (somma, k) { return somma + imponibili[k]; }, 0);

    // 2) Sconto
    var sconto = 0;
    var s = ingresso.sconto;
    if (s) {
      var inPercentuale = s.tipo === 'percentuale';
      var valoreSconto = inPercentuale ? leggiPercentuale(s.valore) : leggiCentesimi(s.valore);
      if (valoreSconto === null) {
        errori.sconto = true;
      } else if (subtotale > 0) {
        // la percentuale è limitata a 0-100% (10000 centesimi di percento), l'importo al subtotale
        sconto = inPercentuale
          ? dividiArrotonda(subtotale * Math.max(0, Math.min(valoreSconto, 10000)), 10000)
          : Math.max(0, Math.min(valoreSconto, subtotale));
      }
    }

    // 3) Sconto ripartito tra le aliquote (si ripartisce solo su chi ha imponibile positivo)
    var pesi = chiavi.map(function (k) { return Math.max(0, imponibili[k]); });
    var scontiPerAliquota = ripartisci(sconto, pesi);

    // 4) IVA per aliquota
    var gruppi = chiavi.map(function (k, i) {
      var imponibile = imponibili[k] - scontiPerAliquota[i];
      var aliquota = k === 'esente' ? null : Number(k);
      var iva = aliquota === null ? 0 : dividiArrotondaConSegno(imponibile * aliquota, 100);
      return { aliquota: aliquota, imponibileLordo: imponibili[k], sconto: scontiPerAliquota[i], imponibile: imponibile, iva: iva };
    });

    var imponibile = gruppi.reduce(function (a, g) { return a + g.imponibile; }, 0);
    var iva = gruppi.reduce(function (a, g) { return a + g.iva; }, 0);
    var totale = imponibile + iva;

    // 5) Acconto e saldo
    var acconto = 0;
    if (ingresso.acconto !== undefined && ingresso.acconto !== null && ingresso.acconto !== '') {
      var a = leggiCentesimi(ingresso.acconto);
      if (a === null) errori.acconto = true;
      else acconto = Math.max(0, Math.min(a, Math.max(0, totale)));
    }

    return {
      righe: righe,
      subtotale: subtotale,
      sconto: sconto,
      gruppi: gruppi,
      imponibile: imponibile,
      iva: iva,
      totale: totale,
      acconto: acconto,
      saldo: totale - acconto,
      errori: errori,
    };
  }

  function dividiArrotondaConSegno(numeratore, denominatore) {
    var segno = numeratore < 0 ? -1 : 1;
    return segno * dividiArrotonda(Math.abs(numeratore), denominatore);
  }

  // ---------------------------------------------------------------------------------------------
  // Numerazione e date
  // ---------------------------------------------------------------------------------------------

  /**
   * Prossimo numero progressivo dell'anno: ['2026-001','2026-002'] -> '2026-003'.
   * Ignora i numeri scritti a mano in altro formato (es. "Offerta Rossi").
   */
  function prossimoNumero(anno, numeriEsistenti) {
    var massimo = 0;
    var inizio = anno + '-';
    (numeriEsistenti || []).forEach(function (n) {
      var m = typeof n === 'string' && n.indexOf(inizio) === 0 ? /^\d{4}-(\d+)$/.exec(n) : null;
      if (m) massimo = Math.max(massimo, parseInt(m[1], 10));
    });
    var prossimo = String(massimo + 1);
    while (prossimo.length < 3) prossimo = '0' + prossimo;
    return anno + '-' + prossimo;
  }

  /** Data di oggi come testo AAAA-MM-GG (ora locale, non UTC: a mezzanotte non sbaglia giorno). */
  function oggiISO(dataOra) {
    var d = dataOra || new Date();
    var mese = String(d.getMonth() + 1); if (mese.length < 2) mese = '0' + mese;
    var giorno = String(d.getDate()); if (giorno.length < 2) giorno = '0' + giorno;
    return d.getFullYear() + '-' + mese + '-' + giorno;
  }

  /** AAAA-MM-GG -> GG/MM/AAAA (stringa vuota se la data non è valida). */
  function formattaData(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
    return m ? m[3] + '/' + m[2] + '/' + m[1] : '';
  }

  /** Data + N giorni, sempre in AAAA-MM-GG. Usa UTC per non farsi ingannare dall'ora legale. */
  function aggiungiGiorni(iso, giorni) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
    if (!m || !isFinite(giorni)) return '';
    var d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]) + Number(giorni)));
    var mese = String(d.getUTCMonth() + 1); if (mese.length < 2) mese = '0' + mese;
    var giorno = String(d.getUTCDate()); if (giorno.length < 2) giorno = '0' + giorno;
    return d.getUTCFullYear() + '-' + mese + '-' + giorno;
  }

  return {
    leggiNumero: leggiNumero,
    leggiCentesimi: leggiCentesimi,
    leggiQuantita: leggiQuantita,
    leggiPercentuale: leggiPercentuale,
    formattaEuro: formattaEuro,
    formattaQuantita: formattaQuantita,
    formattaPercentuale: formattaPercentuale,
    importoRiga: importoRiga,
    ripartisci: ripartisci,
    calcolaPreventivo: calcolaPreventivo,
    prossimoNumero: prossimoNumero,
    oggiISO: oggiISO,
    formattaData: formattaData,
    aggiungiGiorni: aggiungiGiorni,
  };
});
