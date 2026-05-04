/**
 * weather-ui.js - Crea gli elementi HTML per mostrare il meteo
 * 
 * Queste sono funzioni che creano elementi HTML (tipo card, tabella, ecc)
 * ma NON li mettono nel DOM. Ritornano solo l'elemento creato,
 * così chi le chiama può deciderà dove metterlo.
 */

import { sanitizeHTML } from "../core/errors.js";
import { getWeatherEmoji, getWeatherDescription } from "../services/weather-codes.js";

/**
 * Crea la card grande con il meteo attuale
 * 
 * Mostra: temperatura, umidità, vento, direzione vento, timezone
 * 
 * @param {Object} weather - I dati del meteo (da Open-Meteo)
 * @param {string} [locationName="Posizione"] - Nome della città/posizione
 * @param {Object} [options={}] - Opzioni
 * @param {boolean} [options.compact=false] - Se true, la card è più piccola
 * @returns {HTMLElement} - La card creata (non ancora nel DOM)
 */
export function createWeatherCard(weather, locationName = "Posizione", options = {}) {
    const { current, latitude, longitude, timezone } = weather;

    // Ottiene l'emoji e la descrizione dal codice meteo
    const emoji = getWeatherEmoji(current.weather_code);
    const descrizione = getWeatherDescription(current.weather_code);

    // Crea l'elemento HTML
    const card = document.createElement("article");
    card.className = "weather-card";
    
    if (options.compact) {
        card.classList.add("compact");
    }

    // Mette il contenuto nella card
    card.innerHTML = `
        <div class="weather-card-header">
            <div class="weather-title-block">
                <h2>${sanitizeHTML(locationName)}</h2>
                <p class="weather-coords">📍 ${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°</p>
            </div>
        </div>

        <div class="weather-current">
            <div class="weather-emoji" style="font-size: 60px;">${emoji}</div>
            <div class="weather-temp">
                <div class="temp-main" style="font-size: 36px;">${current.temperature_2m}°C</div>
                <div class="temp-desc">${descrizione}</div>
            </div>
        </div>

        <div class="weather-details-grid">
            <div class="detail-item">
                <span class="detail-label">Umidità</span>
                <span class="detail-value">${current.relative_humidity_2m}%</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Vento</span>
                <span class="detail-value">${current.wind_speed_10m} km/h</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Direzione</span>
                <span class="detail-value">${current.wind_direction_10m}°</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Timezone</span>
                <span class="detail-value">${timezone}</span>
            </div>
        </div>
    `;

    return card;
}

/**
 * Crea il box con le previsioni a 7 giorni
 * 
 * Mostra: data, temperatura min/max, pioggia per i prossimi 7 giorni
 * 
 * @param {Object} weather - I dati del meteo
 * @param {Object} [options={}] - Opzioni
 * @param {boolean} [options.compact=false] - Se true, il box è più piccolo
 * @param {string} [options.title] - Il titolo (default: "📅 Previsioni 7 giorni")
 * @returns {HTMLElement} - Il box delle previsioni creato
 */
export function createDailyForecast(weather, options = {}) {
    const { daily } = weather;

    // Crea il contenitore
    const container = document.createElement("div");
    container.className = "daily-forecast";

    if (options.compact) {
        container.classList.add("compact");
    }

    // Aggiunge il titolo
    const title = document.createElement("h3");
    title.textContent = options.title || "📅 Previsioni 7 giorni";
    container.appendChild(title);

    // Crea la griglia dei giorni
    const forecastList = document.createElement("div");
    forecastList.className = "forecast-grid";
    forecastList.style = "display: grid; grid-template-columns: repeat(7, 1fr); gap: 10px;";

    // Per ogni giorno, crea un box
    daily.time.forEach((date, index) => {
        const giorno = new Date(date);
        const nomeDia = giorno.toLocaleDateString("it-IT", { weekday: "short" });
        const numero = giorno.toLocaleDateString("it-IT", { day: "numeric" });

        const emoji = getWeatherEmoji(daily.weather_code[index]);
        const tempMax = daily.temperature_2m_max[index];
        const tempMin = daily.temperature_2m_min[index];
        const pioggia = daily.precipitation_sum[index];

        const boxGiorno = document.createElement("div");
        boxGiorno.className = "forecast-day";
        boxGiorno.style = "border: 1px solid #ddd; border-radius: 5px; padding: 10px; text-align: center;";

        boxGiorno.innerHTML = `
            <div class="forecast-date" style="font-weight: bold;">${nomeDia} ${numero}</div>
            <div class="forecast-emoji" style="font-size: 30px; margin: 5px 0;">${emoji}</div>
            <div class="forecast-temps" style="font-size: 12px;">
                <span class="temp-high">${tempMax}°</span> / 
                <span class="temp-low">${tempMin}°</span>
            </div>
            <div class="forecast-precip" style="font-size: 12px;">💧 ${pioggia}mm</div>
        `;

        forecastList.appendChild(boxGiorno);
    });

    container.appendChild(forecastList);
    return container;
}
