// search.js - Logica per la pagina RICERCA

import { mountFooter } from "../core/footer.js";
import { mountHeader } from "../core/header.js";

import { getWeatherByCoordinates, getCoordinatesByCity } from "../services/api.js";
import { runAsyncSection } from "../core/view-state.js";
import { setupCitySuggestions } from "../components/city-suggestions.js";
import { createFavoriteButton, mountFavoriteButton, setFavoriteButtonState } from "../components/favorite-button.js";
import { showLoading, showError, showEmpty } from "../core/errors.js";
import { addToHistory, addFavorite, isFavorite } from "../services/storage.js";
import { renderWeatherPanels } from "../components/weather-rendering.js";

let currentWeather = null;
let currentLocationName = "";

// ===== DOM Elements =====
const cityInput = document.getElementById("city-input");
const btnSearchCity = document.getElementById("btn-search-city");
const citySuggestions = document.getElementById("city-suggestions");
const latitudeInput = document.getElementById("latitude-input");
const longitudeInput = document.getElementById("longitude-input");
const btnSearchCoords = document.getElementById("btn-search-coords");
const resultContainer = document.getElementById("result-container");
const forecastContainer = document.getElementById("forecast-container");
let btnAddFavorite = null;

// ===== Event Listeners =====

function setupEventListeners() {
    btnSearchCity.addEventListener("click", searchByCity);
    btnSearchCoords.addEventListener("click", searchByCoordinates);
    cityInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") searchByCity();
    });

    setupCitySuggestions({
        input: cityInput,
        suggestions: citySuggestions,
        fetchSuggestions: getCoordinatesByCity,
        onSelect: ({ name, latitude, longitude }) => {
            cityInput.value = name;
            loadWeather(latitude, longitude, name);
        },
    });
}

// ===== Funzioni =====

/**
 * Ricerca per città
 */
async function searchByCity() {
    const query = cityInput.value.trim();

    if (!query) {
        alert("Inserisci il nome di una città");
        return;
    }

    try {
        showLoading(resultContainer);

        const results = await getCoordinatesByCity(query);

        if (results.length === 0) {
            showEmpty(resultContainer, "Città non trovata");
            return;
        }

        const city = results[0];
        loadWeather(city.latitude, city.longitude, `${city.name}, ${city.country}`);
    } catch (error) {
        showError(resultContainer, "Errore nella ricerca", error.message);
    }
}

/**
 * Ricerca per coordinate
 */
async function searchByCoordinates() {
    const lat = parseFloat(latitudeInput.value);
    const lon = parseFloat(longitudeInput.value);

    if (isNaN(lat) || isNaN(lon)) {
        alert("Inserisci coordinate valide");
        return;
    }

    loadWeather(lat, lon, `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`);
}

/**
 * Carica e visualizza il meteo
 */
async function loadWeather(latitude, longitude, locationName = "Posizione") {
    btnAddFavorite.classList.add("hidden");

    return runAsyncSection({
        loadingContainer: resultContainer,
        loadingMessage: "⏳ Caricamento...",
        clearContainers: [forecastContainer],
        request: () => getWeatherByCoordinates(latitude, longitude),
        onSuccess: (weather) => {
            currentWeather = weather;
            currentLocationName = locationName;

            addToHistory(locationName, latitude, longitude);

            renderWeatherPanels({
                weather: currentWeather,
                locationName,
                resultContainer,
                forecastContainer,
                compact: true,
                forecastTitle: "📅 Previsioni",
                onCardCreated: (weatherCard) => {
                    mountFavoriteButton(weatherCard, btnAddFavorite);
                },
            });

            updateFavoriteButton();
        },
        onError: (error) => {
            showError(resultContainer, "Errore nel caricamento del meteo", error.message);
        },
    });
}

/**
 * Aggiorna stato button favorito
 */
function updateFavoriteButton() {
    if (!currentWeather) return;

    const lat = currentWeather.latitude;
    const lon = currentWeather.longitude;
    const isFav = isFavorite(lat, lon);

    setFavoriteButtonState(btnAddFavorite, isFav);
}

/**
 * Aggiungi ai favoriti
 */
function addToFavorites() {
    if (!currentWeather) return;

    const result = addFavorite(
        currentLocationName,
        currentWeather.latitude,
        currentWeather.longitude
    );

    if (result) {
        alert("✅ Aggiunto ai preferiti!");
        updateFavoriteButton();
    }
}



/**
 * Inizializza la pagina di ricerca.
 * Monta header e footer, crea il pulsante dei preferiti, e imposta i listener.
 */
function init() {
    const currentPage = "search";
    mountHeader(currentPage);
    mountFooter();

    btnAddFavorite = createFavoriteButton(addToFavorites);
    setupEventListeners();
}

init();
