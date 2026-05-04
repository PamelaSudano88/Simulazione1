// archive.js - Logica pagina ARCHIVIO (meteo passato)

import { mountFooter } from "../core/footer.js";
import { mountHeader } from "../core/header.js";

import { runAsyncSection } from "../core/view-state.js";
import { getCoordinatesByCity, getHistoricalWeatherByCoordinates } from "../services/api.js";
import { showError, showEmpty, sanitizeHTML } from "../core/errors.js";
import { getWeatherEmoji, getWeatherDescription } from "../services/weather-codes.js";
import { setupCitySuggestions } from "../components/city-suggestions.js";

let selectedCity = null;

const cityInput = document.getElementById("archive-city-input");
const citySuggestions = document.getElementById("archive-city-suggestions");
const btnSearch = document.getElementById("btn-archive-search");
const startDateInput = document.getElementById("archive-start-date");
const endDateInput = document.getElementById("archive-end-date");
const resultContainer = document.getElementById("archive-result-container");

function setupDefaultDates() {
    const sevenDaysAsMilliseconds = 7 * 24 * 60 * 60 * 1000;

    const today = new Date("05/04/2025");
    const lastWeek = new Date(today.valueOf() - sevenDaysAsMilliseconds);

    endDateInput.value = formatDate(today);
    startDateInput.value = formatDate(lastWeek);
}

function setupEventListeners() {
    setupCitySuggestions({
        input: cityInput,
        suggestions: citySuggestions,
        fetchSuggestions: getCoordinatesByCity,
        onSelect: ({ name, latitude, longitude }) => {
            selectedCity = { name, latitude, longitude };
            cityInput.value = name;
        },
    });

    cityInput.addEventListener("input", () => {
        selectedCity = null;
    });

    cityInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            searchArchive();
        }
    });

    btnSearch.addEventListener("click", searchArchive);
}

async function searchArchive() {
    const rawCity = cityInput.value.trim();
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;

    if (!rawCity) {
        alert("Inserisci una citta");
        return;
    }

    if (!startDate || !endDate) {
        alert("Seleziona sia la data iniziale che quella finale");
        return;
    }

    if (startDate > endDate) {
        alert("La data iniziale deve essere precedente alla data finale");
        return;
    }

    return runAsyncSection({
        loadingContainer: resultContainer,
        loadingMessage: "Caricamento archivio meteo...",
        request: async () => {
            if (!selectedCity) {
                const candidates = await getCoordinatesByCity(rawCity);

                if (!candidates.length) {
                    return { empty: true };
                }

                const first = candidates[0];
                selectedCity = {
                    name: `${first.name}, ${first.country}`,
                    latitude: first.latitude,
                    longitude: first.longitude,
                };
                cityInput.value = selectedCity.name;
            }

            return getHistoricalWeatherByCoordinates(
                selectedCity.latitude,
                selectedCity.longitude,
                startDate,
                endDate
            );
        },
        onSuccess: (archiveData) => {
            if (archiveData?.empty) {
                showEmpty(resultContainer, "Nessuna citta trovata");
                return;
            }

            renderArchiveTable(selectedCity, archiveData);
        },
        onError: (error) => {
            showError(resultContainer, "Errore nel caricamento archivio", error.message);
        },
    });
}

function renderArchiveTable(city, data) {
    if (!data.daily || !data.daily.time || data.daily.time.length === 0) {
        showEmpty(resultContainer, "Nessun dato storico disponibile per il periodo selezionato.");
        return;
    }

    const { daily } = data;

    const rows = daily.time
        .map((date, index) => {
            const weatherCode = daily.weather_code[index];
            const emoji = getWeatherEmoji(weatherCode);
            const description = getWeatherDescription(weatherCode);
            const max = daily.temperature_2m_max[index];
            const min = daily.temperature_2m_min[index];
            const rain = daily.precipitation_sum[index];

            return `
                <tr>
                    <td>${new Date(date).toLocaleDateString("it-IT")}</td>
                    <td>${emoji} ${sanitizeHTML(description)}</td>
                    <td>${max}°C</td>
                    <td>${min}°C</td>
                    <td>${rain} mm</td>
                </tr>
            `;
        })
        .join("");

    resultContainer.innerHTML = `
        <article class="archive-card">
            <div class="archive-card-header">
                <h3>Storico meteo: ${sanitizeHTML(city.name)}</h3>
                <p>Coordinate: ${city.latitude.toFixed(2)}°, ${city.longitude.toFixed(2)}°</p>
            </div>
            <div class="archive-table-wrapper">
                <table class="archive-table">
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Condizione</th>
                            <th>Max</th>
                            <th>Min</th>
                            <th>Pioggia</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows}
                    </tbody>
                </table>
            </div>
        </article>
    `;
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}



/**
 * Inizializza la pagina.
 * Crea header e footer, imposta le date di default e i listener per la ricerca
 */
function init() {
    const currentPage = "archive";
    mountHeader(currentPage);
    mountFooter();

    setupDefaultDates();
    setupEventListeners();
}

init();
