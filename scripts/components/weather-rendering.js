/**
 * weather-rendering.js - Rendering condiviso delle viste meteo
 * 
 * Modulo responsabile del rendering dei dati meteo in card e previsioni.
 * Fornisce una funzione unified per visualizzare meteo in diverse parti dell'app
 * (page ricerca, modale, ecc.) usando layout consistenti e riutilizzabili.
 */

import { clearContainer } from "../core/errors.js";
import { createDailyForecast, createWeatherCard } from "./weather-ui.js";

/**
 * Renderizza card meteo e previsioni in una coppia di contenitori.
 * 
 * Pulisce i contenitori, crea la card meteo e le previsioni, poi li monta
 * nei contenitori specificati. Supporta layout compatto per modali.
 * 
 * @param {Object} config - Configurazione del rendering
 * @param {Object} config.weather - Dati meteo Open-Meteo con current e daily
 * @param {string} [config.locationName="Posizione"] - Nome da mostrare nella card
 * @param {HTMLElement} config.resultContainer - Contenitore della card principale
 * @param {HTMLElement} config.forecastContainer - Contenitore delle previsioni
 * @param {boolean} [config.compact=false] - Usa layout compatto per la card e le previsioni
 * @param {string} [config.forecastTitle] - Titolo opzionale per il blocco previsioni
 * @param {Function} [config.onCardCreated] - Callback eseguita dopo il montaggio della card
 * @returns {Object|null} - Oggetto con `weatherCard` e `forecast` elementi renderizzati, oppure null se parametri invalidi
 * 
 * @example
 * // Renderizzare meteo nella pagina ricerca
 * renderWeatherPanels({
 *   weather: weatherData,
 *   locationName: "Milano, IT",
 *   resultContainer: document.getElementById("result"),
 *   forecastContainer: document.getElementById("forecast"),
 *   compact: false,
 *   forecastTitle: "📅 Previsioni 7 giorni",
 *   onCardCreated: (card) => console.log("Card renderizzata!")
 * });
 */
export function renderWeatherPanels({
    weather,
    locationName = "Posizione",
    resultContainer,
    forecastContainer,
    compact = false,
    forecastTitle,
    onCardCreated,
}) {
    if (!weather || !resultContainer || !forecastContainer) {
        return null;
    }

    const weatherCard = createWeatherCard(weather, locationName, { compact });
    clearContainer(resultContainer);
    resultContainer.appendChild(weatherCard);

    if (typeof onCardCreated === "function") {
        onCardCreated(weatherCard);
    }

    const forecast = createDailyForecast(weather, {
        compact,
        title: forecastTitle,
    });

    clearContainer(forecastContainer);
    forecastContainer.appendChild(forecast);

    return { weatherCard, forecast };
}
