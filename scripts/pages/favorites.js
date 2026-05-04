// favorites.js - Logica per la pagina PREFERITI

import { mountFooter } from "../core/footer.js";
import { mountHeader } from "../core/header.js";

import { getFavorites, removeFavorite, addToHistory, clearFavorites } from "../services/storage.js";
import { renderRecordsTable } from "../components/records-table.js";
import { getWeatherDetailsModal } from "../components/weather-details-modal.js";
import { loadWeatherRecord } from "../core/page-loader.js";

// ===== DOM Elements =====
const favoritesContainer = document.getElementById("favorites-container");

// ===== Funzioni =====

/**
 * Visualizza i favoriti
 */
function displayFavorites() {
    const favorites = getFavorites();

    renderRecordsTable({
        container: favoritesContainer,
        emptyMessage: "💔 Nessun preferito salvato. Vai a Ricerca per aggiungerne uno!",
        records: favorites,
        columns: [
            {
                header: "Località",
                render: (fav) => fav.name,
            },
            {
                header: "Coordinate",
                render: (fav) => `${fav.latitude.toFixed(2)}°, ${fav.longitude.toFixed(2)}°`,
            },
        ],
        onRowClick: openFavoriteWeather,
        onDelete: (fav) => {
            removeFavorite(fav.id);
            getWeatherDetailsModal().close();
            displayFavorites();
        },
        onDeleteAll: () => {
            clearFavorites();
            getWeatherDetailsModal().close();
            displayFavorites();
        },
        clearAllLabel: "Cancella preferiti",
        deleteLabel: "Rimuovi",
    });
}

/**
 * Carica il meteo da un favorito e apre la modale.
 * 
 * Utilizza il loader condiviso con aggiunta di side-effect
 * per registrare la ricerca nella cronologia.
 */
function openFavoriteWeather(entry) {
    return loadWeatherRecord(entry, () => addToHistory(entry.name, entry.latitude, entry.longitude));
}



/**
 * Inizializza la pagina.
 * Monta header e footer, quindi mostra i preferiti.
 */
function init() {
    const currentPage = "favorites";
    mountHeader(currentPage);
    mountFooter();

    displayFavorites();
}

init();
