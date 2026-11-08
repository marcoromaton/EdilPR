// Test dei calcoli del preventivo. Si lanciano con:  node --test
// Ogni test dice in italiano cosa si aspetta; i numeri sono calcolati a mano e scritti in chiaro.
const test = require('node:test');
const assert = require('node:assert/strict');
const C = require('../src/preventivi/calcoli.js');

test('leggiCentesimi: formato italiano e casi strani', () => {
  assert.equal(C.leggiCentesimi('1.234,50'), 123450);
  assert.equal(C.leggiCentesimi('1234,5'), 123450);
  assert.equal(C.leggiCentesimi('1200'), 120000);
  assert.equal(C.leggiCentesimi('1.200'), 120000); // punto + 3 cifre = migliaia
  assert.equal(C.leggiCentesimi('12.5'), 1250); // punto con altre cifre = decimali
  assert.equal(C.leggiCentesimi('1.234.567,89'), 123456789);
  assert.equal(C.leggiCentesimi('1,005'), 101); // arrotonda da 5 in su
  assert.equal(C.leggiCentesimi('0,1') + C.leggiCentesimi('0,2'), C.leggiCentesimi('0,3')); // niente errori dei decimali
  assert.equal(C.leggiCentesimi('-50'), -5000);
  assert.equal(C.leggiCentesimi('  30 € '), 3000);
  assert.equal(C.leggiCentesimi(''), 0);
  assert.equal(C.leggiCentesimi(12.5), 1250); // un numero JS usa il punto come decimale
  assert.equal(C.leggiCentesimi(1.005), 101);
});

test('leggiCentesimi: testi non validi restituiscono null', () => {
  for (const brutto of ['abc', '1,2,3', '1..2', '12a', '-', ',', '1.23.4', '1.2345,5']) {
    assert.equal(C.leggiCentesimi(brutto), null, 'dovrebbe essere non valido: ' + brutto);
  }
});

test('leggiQuantita e leggiPercentuale', () => {
  assert.equal(C.leggiQuantita('2,5'), 2500);
  assert.equal(C.leggiQuantita('0,125'), 125);
  assert.equal(C.leggiQuantita('1.000'), 1000000);
  assert.equal(C.leggiPercentuale('10,5'), 1050);
  assert.equal(C.leggiPercentuale('22'), 2200);
});

test('formattaEuro, formattaQuantita, formattaPercentuale', () => {
  assert.equal(C.formattaEuro(123450), '1.234,50 €');
  assert.equal(C.formattaEuro(5), '0,05 €');
  assert.equal(C.formattaEuro(0), '0,00 €');
  assert.equal(C.formattaEuro(-123450), '-1.234,50 €');
  assert.equal(C.formattaEuro(123456789, false), '1.234.567,89');
  assert.equal(C.formattaQuantita(2500), '2,5');
  assert.equal(C.formattaQuantita(12000), '12');
  assert.equal(C.formattaQuantita(1234567), '1.234,567');
  assert.equal(C.formattaPercentuale(1050), '10,5');
  assert.equal(C.formattaPercentuale(2200), '22');
});

test('importoRiga: quantità x prezzo, arrotondato al centesimo', () => {
  assert.equal(C.importoRiga(2500, 1999), 4998); // 2,5 x 19,99 = 49,975 -> 49,98
  assert.equal(C.importoRiga(1000, 12345), 12345); // 1 x 123,45
  assert.equal(C.importoRiga(0, 5000), 0);
  assert.equal(C.importoRiga(3000, -1000), -3000); // prezzo negativo (rettifica)
});

test('ripartisci: la somma delle parti è sempre il totale', () => {
  assert.deepEqual(C.ripartisci(100, [1, 1, 1]), [34, 33, 33]);
  assert.deepEqual(C.ripartisci(0, [5, 5]), [0, 0]);
  assert.deepEqual(C.ripartisci(10, [0, 0]), [0, 0]);
  const parti = C.ripartisci(99999, [333, 777, 1234, 1]);
  assert.equal(parti.reduce((a, b) => a + b, 0), 99999);
});

test('calcolaPreventivo: caso semplice con una sola aliquota', () => {
  const r = C.calcolaPreventivo({
    righe: [
      { quantita: '10', prezzo: '50', iva: '22' }, // 500,00
      { quantita: '2,5', prezzo: '19,99', iva: '22' }, // 49,98
    ],
  });
  assert.equal(r.subtotale, 54998);
  assert.equal(r.imponibile, 54998);
  assert.equal(r.iva, 12100); // 549,98 x 22% = 120,9956 -> 121,00
  assert.equal(r.totale, 67098);
  assert.equal(r.saldo, 67098);
  assert.equal(r.gruppi.length, 1);
});

test('calcolaPreventivo: più aliquote, ordinate dalla più alta; esente per ultima', () => {
  const r = C.calcolaPreventivo({
    righe: [
      { quantita: '1', prezzo: '1000', iva: 'esente' },
      { quantita: '1', prezzo: '1000', iva: '10' },
      { quantita: '1', prezzo: '1000', iva: '22' },
      { quantita: '1', prezzo: '1000', iva: '4' },
    ],
  });
  assert.deepEqual(r.gruppi.map((g) => g.aliquota), [22, 10, 4, null]);
  assert.deepEqual(r.gruppi.map((g) => g.iva), [22000, 10000, 4000, 0]);
  assert.equal(r.imponibile, 400000);
  assert.equal(r.iva, 36000);
  assert.equal(r.totale, 436000);
});

test('calcolaPreventivo: sconto in percentuale prima dell\'IVA', () => {
  const r = C.calcolaPreventivo({
    righe: [{ quantita: '1', prezzo: '1000', iva: '22' }],
    sconto: { tipo: 'percentuale', valore: '10' },
  });
  assert.equal(r.sconto, 10000); // 100,00
  assert.equal(r.imponibile, 90000);
  assert.equal(r.iva, 19800); // 22% di 900,00
  assert.equal(r.totale, 109800);
});

test('calcolaPreventivo: sconto ripartito tra le aliquote senza perdere centesimi', () => {
  const r = C.calcolaPreventivo({
    righe: [
      { quantita: '1', prezzo: '100', iva: '22' },
      { quantita: '1', prezzo: '200', iva: '10' },
    ],
    sconto: { tipo: 'euro', valore: '30' },
  });
  assert.equal(r.sconto, 3000);
  assert.equal(r.gruppi[0].sconto + r.gruppi[1].sconto, 3000);
  assert.equal(r.gruppi[0].sconto, 1000); // 100/300 di 30
  assert.equal(r.gruppi[1].sconto, 2000);
  assert.equal(r.imponibile, 27000);
  assert.equal(r.iva, 3780); // 22% di 90,00 (= 19,80) + 10% di 180,00 (= 18,00)
});

test('calcolaPreventivo: sconto limitato al totale; percentuale limitata a 100', () => {
  const a = C.calcolaPreventivo({
    righe: [{ quantita: '1', prezzo: '100', iva: '22' }],
    sconto: { tipo: 'euro', valore: '500' },
  });
  assert.equal(a.sconto, 10000);
  assert.equal(a.totale, 0);
  const b = C.calcolaPreventivo({
    righe: [{ quantita: '1', prezzo: '100', iva: '22' }],
    sconto: { tipo: 'percentuale', valore: '250' },
  });
  assert.equal(b.sconto, 10000);
  assert.equal(b.totale, 0);
});

test('calcolaPreventivo: acconto e saldo; l\'acconto non supera il totale', () => {
  const base = { righe: [{ quantita: '1', prezzo: '1000', iva: '22' }] }; // totale 1.220,00
  const a = C.calcolaPreventivo({ ...base, acconto: '400' });
  assert.equal(a.totale, 122000);
  assert.equal(a.acconto, 40000);
  assert.equal(a.saldo, 82000);
  const b = C.calcolaPreventivo({ ...base, acconto: '5000' });
  assert.equal(b.acconto, 122000);
  assert.equal(b.saldo, 0);
});

test('calcolaPreventivo: campi non validi contano zero e vengono segnalati', () => {
  const r = C.calcolaPreventivo({
    righe: [
      { quantita: 'xx', prezzo: '100', iva: '22' },
      { quantita: '1', prezzo: '50', iva: '22' },
    ],
    sconto: { tipo: 'euro', valore: 'boh' },
    acconto: 'zz',
  });
  assert.equal(r.subtotale, 5000);
  assert.deepEqual(r.errori.righe, [{ indice: 0, quantita: true, prezzo: false }]);
  assert.equal(r.errori.sconto, true);
  assert.equal(r.errori.acconto, true);
});

test('calcolaPreventivo: preventivo vuoto non rompe nulla', () => {
  const r = C.calcolaPreventivo({});
  assert.equal(r.totale, 0);
  assert.equal(r.saldo, 0);
  assert.deepEqual(r.gruppi, []);
  assert.equal(C.calcolaPreventivo().totale, 0);
});

test('prossimoNumero: progressivo dell\'anno', () => {
  assert.equal(C.prossimoNumero(2026, []), '2026-001');
  assert.equal(C.prossimoNumero(2026, ['2026-001', '2026-009']), '2026-010');
  assert.equal(C.prossimoNumero(2026, ['2025-050', 'Offerta Rossi', '2026-abc']), '2026-001');
  assert.equal(C.prossimoNumero(2027, ['2026-123']), '2027-001');
});

test('date: formato italiano e somma giorni (anche a cavallo di mese, anno e ora legale)', () => {
  assert.equal(C.formattaData('2026-11-06'), '06/11/2026');
  assert.equal(C.formattaData('boh'), '');
  assert.equal(C.aggiungiGiorni('2026-11-06', 30), '2026-12-06');
  assert.equal(C.aggiungiGiorni('2026-12-20', 30), '2027-01-19');
  assert.equal(C.aggiungiGiorni('2026-03-20', 30), '2026-04-19'); // passa l'ora legale
  assert.equal(C.aggiungiGiorni('2028-02-28', 1), '2028-02-29'); // anno bisestile
  assert.equal(C.aggiungiGiorni('', 30), '');
  assert.equal(C.oggiISO(new Date(2026, 10, 6, 23, 59)), '2026-11-06');
});
