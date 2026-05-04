# Weather App

Applicazione web sviluppata in Vanilla JavaScript, HTML5 e CSS3 per la consultazione di dati meteorologici attuali, previsioni e dati storici. Il sistema consuma la REST API pubblica e no-auth di [Open-Meteo](https://open-meteo.com/).

### Architettura e Struttura Directory

Il progetto adotta un approccio modulare basato su ES6 Modules, strutturando il codice in base al principio di *Separation of Concerns* per disaccoppiare strato dati, logica di view e controller di pagina.

```text
├── public/                # Viste HTML
│   ├── style.css          # Foglio di stile globale
│   ├── archive.html       # Interfaccia query dati storici
│   ├── favorites.html     # Tabella e gestione posizioni preferite
│   ├── history.html       # Tabella cronologia interrogazioni
│   ├── index.html         # Entry point e panoramica app
│   └── search.html        # View per ricerca coordinate/città e forecast
├── scripts/               # Logica di business e manipolazione DOM
│   ├── components/        # UI Modules (rendering, tabelle, modali, suggestions)
│   ├── core/              # Gestione stato globale, bootstrap ed error handling
│   ├── pages/             # Controller di binding per l'inizializzazione delle singole view
│   └── services/          # Data access layer (wrapper Fetch API, persistenza localStorage)
├── .gitignore
├── LICENSE
└── README.md
```

### Funzionalità Core

* **Geocoding e Forecasting (`search.js`, `api.js`):** Ricerca asincrona di località e parsing del payload JSON per mostrare metriche correnti e previsioni a 7 giorni.
* **Historical Data Recovery (`archive.js`):** Estrazione di dati meteorologici passati tramite query parametrizzate su range di date (Start Date / End Date).
* **Client-Side Persistence (`storage.js`):** Utilizzo delle Web Storage API (`localStorage`) per mantenere persistente lo stato della cronologia di ricerca e dei preferiti dell'utente tra diverse sessioni.
* **Dynamic UI (`weather-rendering.js`):** Aggiornamento dinamico e asincrono dell'albero DOM per il rendering dei nodi dati, intercettazione eventi e mappatura degli status code meteo in emoji e descrizioni testuali.

### Setup ed Esecuzione

Trattandosi di un'architettura puramente front-end (statica) priva di build step, non è richiesta l'installazione di pacchetti npm. È sufficiente servire i file statici tramite un local web server (es. estensione `Live Server` per VS Code o Node `http-server`) puntando alla directory root del progetto. L'entry point di navigazione è `public/index.html`.

A quel punto l'applicazione sarà accessibile all'indirizzo locale e potete esplorare tutte le funzionalità offerte, testando la ricerca di città, la visualizzazione dei dati meteo e la gestione di preferiti e cronologia.

<video controls src="./assets/01_Sito.mp4" title="Title"></video>

# Esercizi da Svolgere

Gli esercizi totali sono suddivisi in 3 macro-aree di intervento, ognuna con un peso specifico in termini di punteggio finale.
I primi due avranno anche dei commenti `TODO` all'interno del codice per guidarvi nei punti esatti in cui intervenire.
Il terzo esercizio richiede invece un'attività di debugging logico, per cui dovrete esplorare autonomamente i file per trovare e risolvere il problema.

### 1. INTEGRAZIONI DATI (60p)

**Obiettivo:** Ripristinare il sistema di autocompletamento per la ricerca delle città. Attualmente, digitando un testo negli input di ricerca, l'applicazione non effettua chiamate di rete e non fornisce suggerimenti.

**Task richiesti:**

1. **Data Fetching in [scripts/services/api.js](scripts/services/api.js)**\
   Completa la logica della funzione `getCoordinatesByCity` in modo che effettui la chiamata corretta all'API di Open-Meteo per la ricerca geocoding, gestendo eventuali errori e ritornando i risultati attesi. Segui i TODO nel file per i dettagli tecnici.

2. **Data Binding & UI Rendering in [scripts/components/city-suggestions.js](scripts/components/city-suggestions.js)**\
   Completa la funzione `renderList` in modo che i dati recuperati dall'API vengano trasformati in elementi HTML (una lista di `div`) da iniettare nel menu a tendina dei suggerimenti, assicurandoti di agganciare i dati necessari per il corretto funzionamento del click. Segui i TODO nel file.

### 2. CORREZIONE LAYOUT (30p)

**Obiettivo:** Ripristinare la visualizzazione di alcune sezioni del sito che presentano anomalie strutturali ed estetiche.

**Task richiesti:**

1. **Struttura a Griglia in [public/index.html](public/index.html)**\
   Nella pagina principale (Home), la sezione "Come funziona" mostra le card informative impilate verticalmente in modo errato. Individua la classe CSS corretta (già esistente) e applicala al tag `<div>` contrassegnato dal `TODO` per ripristinare il layout a griglia.

2. **Layout Disallineato in [style.css](style.css)**\
   Nella pagina di Ricerca, il blocco contenente l'icona gigante del meteo e la temperatura odierna (`.weather-current`) è formattato in modo errato (gli elementi vanno a capo). Modifica la regola CSS per fare in modo che gli elementi si affianchino sulla stessa riga e siano centrati verticalmente.

3. **Design del Componente in [style.css](style.css)**\
   Il pulsante di salvataggio rapido (quello con la spunta/cuore in alto a destra nella card meteo) ha perso la sua formattazione originaria. Cerca il selettore `.btn-favorite-inline` e ricreane lo stile seguendo le indicazioni specifiche scritte nel `TODO` al suo interno.

### 3. DEBUGGING LOGICO (10p)

**Obiettivo:** Individuare e risolvere un'anomalia nel flusso esecutivo della user interface.

**Problema riscontrato:**\
Nelle sezioni "Cronologia" e "Preferiti" è presente un pulsante per eliminare globalmente tutti i record salvati. Tuttavia, se viene cliccato, la cancellazione avviene in modo contro-intuitivo: i dati vengono eliminati *solo* se l'utente clicca su "Annulla" nel popup di conferma del browser, mentre vengono conservati se si clicca "Ok".

**Task richiesti:**
1. Esamina il codice, comprendi da dove viene generato il popup di conferma e quale logica viene eseguita in base alla scelta dell'utente.
2. Correggi il bug in modo che i dati vengano eliminati in modo sicuro e coerente con la scelta effettuata.