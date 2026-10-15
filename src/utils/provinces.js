/**
 * Raggruppamento dei comuni per provincia.
 *
 * I dati sulle province NON sono inventati: vengono da src/data/comuni-provinces.json, generato
 * una volta da scripts/fetch-comuni-provinces.mjs a partire dall'elenco ufficiale dei comuni
 * italiani derivato dai dati ISTAT (CC BY 3.0 IT). L'abbinamento copre 377 comuni su 377.
 *
 * Le province sono quelle ufficiali in vigore (riforma del 2016): Cagliari, Nuoro, Oristano,
 * Sassari e Sud Sardegna. Le otto "province storiche" (Gallura, Ogliastra, Medio Campidano,
 * Sulcis Iglesiente...) non esistono piu' come enti e non vengono usate per non pubblicare
 * informazione amministrativa scorretta.
 */

import cities from '../data/sardinian-cities-corrected.json';
import provincesData from '../data/comuni-provinces.json';

const BY_NAME = provincesData.comuni;

export const PROVINCE = {
  CA: { sigla: 'CA', nome: 'Città metropolitana di Cagliari', breve: 'Cagliari', slug: 'cagliari' },
  NU: { sigla: 'NU', nome: 'Provincia di Nuoro', breve: 'Nuoro', slug: 'nuoro' },
  OR: { sigla: 'OR', nome: 'Provincia di Oristano', breve: 'Oristano', slug: 'oristano' },
  SS: { sigla: 'SS', nome: 'Provincia di Sassari', breve: 'Sassari', slug: 'sassari' },
  SU: { sigla: 'SU', nome: 'Provincia del Sud Sardegna', breve: 'Sud Sardegna', slug: 'sud-sardegna' },
};

/** Sigla della provincia di un comune, oppure null se il dato manca. */
export function provinceOf(cityName) {
  return BY_NAME[cityName]?.sigla || null;
}

/** Tutti i comuni di una provincia. */
export function citiesByProvince(sigla) {
  return cities.filter((c) => provinceOf(c.name) === sigla);
}

/** Elenco delle province con il numero di comuni, in ordine decrescente. */
export function provinceGroups() {
  return Object.values(PROVINCE)
    .map((p) => ({ ...p, cities: citiesByProvince(p.sigla) }))
    .filter((p) => p.cities.length > 0)
    .sort((a, b) => b.cities.length - a.cities.length);
}

/** Legge la provincia richiesta dall'indirizzo (?provincia=SS). Restituisce null se non valida. */
export function provinceFromSearch(search) {
  try {
    const sigla = (new URLSearchParams(search).get('provincia') || '').trim().toUpperCase();
    return PROVINCE[sigla] ? PROVINCE[sigla] : null;
  } catch (err) {
    return null;
  }
}
