// ui/weather-details-modal.js - Modale condiviso per i dettagli meteo

import { clearContainer, showLoading } from "../core/errors.js";
import { renderWeatherPanels } from "./weather-rendering.js";

let modalState = null;

function createModalState() {
    const overlay = document.createElement("div");
    overlay.className = "weather-modal-overlay hidden";
    overlay.innerHTML = `
        <div class="weather-modal" role="dialog" aria-modal="true" aria-labelledby="weather-modal-title">
            <div class="weather-modal-header">
                <div>
                    <p class="weather-modal-kicker">Dettagli meteo</p>
                    <h2 id="weather-modal-title"></h2>
                    <p class="weather-modal-subtitle"></p>
                </div>
                <button type="button" class="weather-modal-close" aria-label="Chiudi modale">✕</button>
            </div>
            <div class="weather-modal-body">
                <div class="weather-modal-weather"></div>
                <div class="weather-modal-forecast"></div>
            </div>
        </div>
    `;

    const title = overlay.querySelector("#weather-modal-title");
    const subtitle = overlay.querySelector(".weather-modal-subtitle");
    const weatherContainer = overlay.querySelector(".weather-modal-weather");
    const forecastContainer = overlay.querySelector(".weather-modal-forecast");
    const closeButton = overlay.querySelector(".weather-modal-close");

    function close() {
        overlay.classList.add("hidden");
        clearContainer(weatherContainer);
        clearContainer(forecastContainer);
    }

    closeButton.addEventListener("click", close);
    overlay.addEventListener("click", (event) => {
        if (event.target === overlay) {
            close();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (!overlay.classList.contains("hidden") && event.key === "Escape") {
            close();
        }
    });

    document.body.appendChild(overlay);

    return {
        overlay,
        title,
        subtitle,
        weatherContainer,
        forecastContainer,
        open(recordTitle, recordSubtitle = "") {
            title.textContent = recordTitle;
            subtitle.textContent = recordSubtitle;
            overlay.classList.remove("hidden");
            showLoading(weatherContainer, "⏳ Caricamento dettagli...");
            clearContainer(forecastContainer);
        },
        close,
        destroy() {
            overlay.remove();
        },
    };
}

/**
 * Restituisce una modale singleton per mostrare i dettagli meteo.
 * @returns {{ open: Function, close: Function, weatherContainer: HTMLElement, forecastContainer: HTMLElement, destroy: Function }} - Controller della modale.
 */
export function getWeatherDetailsModal() {
    if (!modalState) {
        modalState = createModalState();
    }

    return modalState;
}

/**
 * Apre la modale e visualizza il meteo richiesto.
 * @param {Object} config - Configurazione del contenuto.
 * @param {string} config.title - Titolo da mostrare nella modale.
 * @param {string} [config.subtitle] - Sottotitolo opzionale.
 * @param {Object} config.weather - Dati meteo Open-Meteo.
 * @param {string} config.locationName - Nome della località.
 * @param {boolean} [config.compact=true] - Usa il layout compatto.
 * @returns {{ close: Function }} - Controlli base della modale.
 */
export function openWeatherDetailsModal({ title, subtitle = "", weather, locationName, compact = true }) {
    const modal = getWeatherDetailsModal();
    modal.open(title, subtitle);

    renderWeatherPanels({
        weather,
        locationName,
        resultContainer: modal.weatherContainer,
        forecastContainer: modal.forecastContainer,
        compact,
    });

    return {
        close: modal.close,
    };
}