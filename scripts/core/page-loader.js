/**
 * page-loader.js - Logica condivisa per il caricamento meteo da record (cronologia/preferiti)
 * 
 * Fornisce funzioni riutilizzabili per aprire una modale con dettagli meteo
 * da un record (entrada di cronologia o favorito).
 */

import { getWeatherByCoordinates } from "../services/api.js";
import { runAsyncSection } from "./view-state.js";
import { getWeatherDetailsModal } from "../components/weather-details-modal.js";
import { renderWeatherPanels } from "../components/weather-rendering.js";
import { showError } from "./errors.js";

/**
 * Carica e visualizza il meteo di un record in una modale.
 * 
 * Apre la modale con il titolo e sottotitolo del record, quindi carica il meteo
 * dalle coordinate e lo renderizza all'interno della modale stessa.
 * 
 * @param {Object} entry - Record con coordinate e nome (es. favorito, storia)
 * @param {string} entry.name - Nome della località
 * @param {number} entry.latitude - Latitudine della posizione
 * @param {number} entry.longitude - Longitudine della posizione
 * @param {Function} [onBeforeRequest] - Callback eseguita prima della richiesta API
 * @returns {Promise<void>} - Risolve quando il caricamento è completato
 * 
 * @example
 * // Caricare e mostrare il meteo da un favorito
 * loadWeatherRecord(favorite)
 * 
 * @example
 * // Con side effect (es. aggiungere a cronologia)
 * loadWeatherRecord(favorite, () => addToHistory(favorite.name, ...))
 */
export async function loadWeatherRecord(entry, onBeforeRequest) {
    const modal = getWeatherDetailsModal();
    const subtitle = `${entry.latitude.toFixed(2)}°, ${entry.longitude.toFixed(2)}°`;
    
    modal.open(entry.name, subtitle);

    return runAsyncSection({
        loadingContainer: modal.weatherContainer,
        clearContainers: [modal.forecastContainer],
        request: async () => {
            if (typeof onBeforeRequest === "function") {
                onBeforeRequest();
            }
            return getWeatherByCoordinates(entry.latitude, entry.longitude);
        },
        onSuccess: (weather) => {
            renderWeatherPanels({
                weather,
                locationName: entry.name,
                resultContainer: modal.weatherContainer,
                forecastContainer: modal.forecastContainer,
                compact: true,
            });
        },
        onError: (error) => {
            showError(modal.weatherContainer, "Errore nel caricamento del meteo", error.message);
        },
    });
}
