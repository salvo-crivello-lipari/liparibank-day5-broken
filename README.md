# LipariBank Dashboard - Day 5 - Fix Mission

Benvenuto al quinto sprint! Questo progetto integra un **backend mock con json-server** e si concentra su integrazione REST, hook HTTP e gestione degli errori. Troverai 3 bug legati a `useEffect` con dipendenze oggetto, race condition nelle fetch e mancata gestione degli errori HTTP.

---

## Come avviare

```bash
npm install
npm run dev:all
```

Questo comando avvia in parallelo:
- Frontend React su `http://localhost:5173`
- Backend json-server su `http://localhost:3001`

> ⚠️ Il server applica una latenza random di **300–1500ms** ad ogni richiesta. È intenzionale.

---

## Le tue 3 missioni

### Missione 1 — Fetch ripetuta ad ogni render

Apri la scheda **Network** di DevTools e seleziona il filtro "Fetch/XHR". Senza toccare nulla, osserva quante volte viene chiamato l'endpoint `/transactions`. Poi prova a cliccare sul filtro "Accrediti" o "Addebiti".

Vedrai che le richieste si moltiplicano ad ogni interazione con la pagina, anche quando `accountId` non cambia. Il timestamp "Dati aggiornati alle:" nella UI cambia continuamente.

Identifica perché `TransactionList` rilancia la fetch a ogni render del padre e correggi il problema nella struttura dei dati passati come prop.

### Missione 2 — Dati del conto sbagliato visualizzati

Clicca rapidamente tra i 3 conti bancari (Conto Corrente → Conto Deposito → Conto Investimenti → Conto Corrente). Osserva la lista dei movimenti: in alcuni casi vedrai transazioni che appartengono a un conto diverso da quello selezionato, oppure la lista si aggiornerà con dati "vecchi" dopo che quelli nuovi erano già apparsi.

Il server ha una latenza variabile. Una richiesta più lenta può completarsi **dopo** una più recente, sovrascrivendo i dati corretti con quelli sbagliati.

Trova il punto del codice in cui la risposta HTTP aggiorna lo stato senza verificare se è ancora rilevante, e applica il meccanismo corretto per cancellare le richieste obsolete.

### Missione 3 — Errore del server non mostrato nell'UI

Clicca sul tab **"Conto Premium ✦"** nella dashboard. Osserva il pannello `AccountCard`: invece di mostrare un messaggio di errore chiaro come *"Conto non trovato"*, vedrai comportamento inatteso — il componente mostra dati vuoti, un oggetto serializzato o nulla.

Apri il Network tab e guarda la risposta: il server restituisce **HTTP 404** con body `{ "message": "Conto non trovato" }`. Ma il codice non controlla `response.ok` e non legge mai il messaggio di errore dal body della risposta.

Trova `useApi.ts`, correggi la gestione degli errori HTTP e verifica che il messaggio del server venga propagato e mostrato nell'UI.

---

## Strumenti consigliati

- **Browser DevTools — Network tab** — filtra per "Fetch/XHR", osserva frequenza e status delle richieste
- **Browser DevTools — Console** — per i log della timestamp di ogni fetch
- **React DevTools — Profiler** — per visualizzare i re-render che scatenano le fetch
- **json-server log** — il terminale mostra ogni richiesta ricevuta con timestamp

---

## Bonus Mission — Feature da Implementare (opzionale, ~1 ora)

Una volta risolti i 3 bug, crea un custom hook `usePaginatedTransactions(accountId)` che gestisce il caricamento paginato delle transazioni (**10 per pagina**).

### API del hook

```ts
const { transactions, loadMore, hasMore, isLoading, isLoadingMore, error } =
  usePaginatedTransactions(accountId);
```

### Requisiti

- Al cambio di `accountId`, la lista si azzera e riparte dalla prima pagina
- `loadMore` appende le transazioni senza cancellare quelle già caricate
- Quando `hasMore` è `false`, il pulsante "Carica altre" non appare
- Cambiando conto, la richiesta in corso viene **annullata** con `AbortController`
- Il hook è riutilizzabile e non contiene logica specifica del componente

### Criteri di accettazione

- [ ] La lista si azzera correttamente al cambio di conto
- [ ] Le transazioni della pagina 2 si accodano a quelle della pagina 1
- [ ] Quando tutte le transazioni sono caricate, `hasMore` diventa `false`
- [ ] Cambiando conto rapidamente, le risposte obsolete non aggiornano la lista
- [ ] Il hook è testabile in isolamento (nessun import di componenti)
- [ ] Nessun bug risolto in precedenza viene reintrodotto
