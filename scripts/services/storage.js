/**
 * storage.js - Gestione localStorage per cronologia e preferiti
 * 
 * Modulo per la persistenza dei dati dell'app su browser storage.
 * Gestisce le ricerche recenti (cronologia) e le località salvate (preferiti).
 * 
 * Usa localStorage nativamente senza librerie esterne.
 * Limita la cronologia a 50 voci per evitare overflow.
 * Evita duplicati consecutivi nella cronologia.
 */

const STORAGE_KEYS = {
    HISTORY: "weather_history",
    FAVORITES: "weather_favorites",
};

/**
 * Legge un array JSON dallo storage.
 * @private
 * @param {string} storageKey - Chiave di storage
 * @returns {Array} - L'array letto, o un array vuoto se non esiste
 */
function readStoredArray(storageKey) {
    try {
        const data = localStorage.getItem(storageKey);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error(`Errore nel recupero di ${storageKey}:`, error);
        return [];
    }
}

/**
 * Codifica e scrive un array JSON nello storage.
 * @private
 * @param {string} storageKey - Chiave di storage
 * @param {Array<Object>} items - Array da salvare
 * @returns {void}
 */
function writeStoredArray(storageKey, items) {
    localStorage.setItem(storageKey, JSON.stringify(items));
}

/**
 * Aggiunge una ricerca alla cronologia evitando duplicati consecutivi.
 * 
 * Se la ricerca è identica all'ultima, la funzione non aggiunge la voce.
 * Mantiene le ultime 50 ricerche; le più vecchie vengono scartate.
 * 
 * @param {string} name - Nome della località cercata
 * @param {number} latitude - Latitudine della località
 * @param {number} longitude - Longitudine della località
 * @returns {void}
 * 
 * @example
 * addToHistory("Milano", 45.46, 9.19);
 */
export function addToHistory(name, latitude, longitude) {
    let history = getHistory();

    if (history.length > 0) {
        const last = history[history.length - 1];
        if (last.name === name && last.latitude === latitude && last.longitude === longitude) {
            return;
        }
    }

    history.push({
        name,
        latitude,
        longitude,
        timestamp: Date.now(),
    });

    if (history.length > 50) {
        history = history.slice(-50);
    }

    writeStoredArray(STORAGE_KEYS.HISTORY, history);
}

/**
 * Rimuove una voce specifica dalla cronologia.
 * 
 * @param {number} timestamp - Timestamp della voce da eliminare (identificatore unico)
 * @returns {void}
 * 
 * @example
 * removeHistoryEntry(1234567890);
 */
export function removeHistoryEntry(timestamp) {
    const history = getHistory().filter((entry) => entry.timestamp !== timestamp);
    writeStoredArray(STORAGE_KEYS.HISTORY, history);
}

/**
 * Cancella completamente la cronologia.
 * @returns {void}
 */
export function clearHistory() {
    writeStoredArray(STORAGE_KEYS.HISTORY, []);
}

/**
 * Restituisce tutta la cronologia salvata.
 * 
 * @returns {Array<Object>} - Lista delle ricerche memorizzate, ordinate dal più vecchio al più recente
 * @example
 * const history = getHistory();
 * history.forEach(entry => console.log(entry.name, entry.timestamp));
 */
export function getHistory() {
    return readStoredArray(STORAGE_KEYS.HISTORY);
}

/**
 * Aggiunge una località ai preferiti se non esiste già.
 * 
 * Le posizioni duplicate (stesse coordinate) non vengono aggiunte.
 * Utilizza il timestamp come ID univoco del preferito.
 * 
 * @param {string} name - Nome della località
 * @param {number} latitude - Latitudine della località
 * @param {number} longitude - Longitudine della località
 * @returns {string|null} - ID del preferito creato, oppure null se già presente
 * 
 * @example
 * const id = addFavorite("Milano", 45.46, 9.19);
 * if (id) console.log("Preferito creato con ID:", id);
 * else console.log("Questo luogo è già nei preferiti");
 */
export function addFavorite(name, latitude, longitude) {
    let favorites = getFavorites();

    if (favorites.some((fav) => fav.latitude === latitude && fav.longitude === longitude)) {
        return null;
    }

    const id = Date.now().toString();
    favorites.push({
        id,
        name,
        latitude,
        longitude,
    });

    writeStoredArray(STORAGE_KEYS.FAVORITES, favorites);
    return id;
}

/**
 * Rimuove un preferito a partire dall'ID.
 * 
 * @param {string} id - ID del preferito da eliminare
 * @returns {void}
 * 
 * @example
 * removeFavorite("1234567890");
 */
export function removeFavorite(id) {
    let favorites = getFavorites();
    favorites = favorites.filter((fav) => fav.id !== id);
    writeStoredArray(STORAGE_KEYS.FAVORITES, favorites);
}

/**
 * Cancella completamente l'elenco dei preferiti.
 * @returns {void}
 */
export function clearFavorites() {
    writeStoredArray(STORAGE_KEYS.FAVORITES, []);
}

/**
 * Restituisce tutti i preferiti salvati.
 * @returns {Array<Object>} - Lista dei preferiti.
 */
export function getFavorites() {
    return readStoredArray(STORAGE_KEYS.FAVORITES);
}

/**
 * Verifica se una posizione è già tra i preferiti.
 * 
 * @param {number} latitude - Latitudine da controllare
 * @param {number} longitude - Longitudine da controllare
 * @returns {boolean} - True se la posizione è già preferita
 * 
 * @example
 * if (isFavorite(45.46, 9.19)) {
 *   console.log("Milano è nei preferiti");
 * }
 */
export function isFavorite(latitude, longitude) {
    return getFavorites().some((fav) => fav.latitude === latitude && fav.longitude === longitude);
}
