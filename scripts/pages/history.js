// history.js - Logica per la pagina CRONOLOGIA

import { mountFooter } from "../core/footer.js";
import { mountHeader } from "../core/header.js";

import { getHistory, clearHistory, removeHistoryEntry } from "../services/storage.js";
import { renderRecordsTable } from "../components/records-table.js";
import { getWeatherDetailsModal } from "../components/weather-details-modal.js";
import { loadWeatherRecord } from "../core/page-loader.js";

// ===== DOM Elements =====
const historyContainer = document.getElementById("history-container");

// ===== Funzioni =====

/**
 * Visualizza la cronologia
 */
function displayHistory() {
    const history = getHistory().slice().reverse();

    renderRecordsTable({
        container: historyContainer,
        emptyMessage: "📭 Nessuna ricerca nella cronologia. Vai a Ricerca per cercarne una!",
        records: history,
        columns: [
            {
                header: "Data",
                render: (entry) => new Date(entry.timestamp).toLocaleString("it-IT"),
            },
            {
                header: "Località",
                render: (entry) => entry.name,
            },
            {
                header: "Coordinate",
                render: (entry) => `${entry.latitude.toFixed(2)}°, ${entry.longitude.toFixed(2)}°`,
            },
        ],
        onRowClick: openHistoryWeather,
        onDelete: (entry) => {
            removeHistoryEntry(entry.timestamp);
            getWeatherDetailsModal().close();
            displayHistory();
        },
        onDeleteAll: () => {
            clearHistory();
            getWeatherDetailsModal().close();
            displayHistory();
        },
        clearAllLabel: "Cancella cronologia",
        deleteLabel: "Rimuovi",
    });
}

/**
 * Carica il meteo da un elemento della cronologia e apre la modale.
 */
function openHistoryWeather(entry) {
    return loadWeatherRecord(entry);
}



/**
 * Inizializzazione pagina.
 * Monta header e footer, poi mostra la cronologia.
 */
function init() {
    const currentPage = "history";
    mountHeader(currentPage);
    mountFooter();

    displayHistory();
}

init();
