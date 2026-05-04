// city-suggestions.js - Autocomplete per la ricerca città

import { sanitizeHTML, showLoading } from "../core/errors.js";

/**
 * Configura l'autocomplete per un input di ricerca città.
 * 
 * @param {Object} config
 * @param {HTMLInputElement} config.input - Il campo di testo dove l'utente digita
 * @param {HTMLElement} config.suggestions - Il div dove mostrare i suggerimenti
 * @param {Function} config.fetchSuggestions - Funzione che ricerca le città (es: API call)
 * @param {Function} config.onSelect - Funzione da chiamare quando l'utente clicca un suggerimento
 */
export function setupCitySuggestions({
    input,
    suggestions,
    fetchSuggestions,
    onSelect,
}) {
    if (!input || !suggestions || !fetchSuggestions || !onSelect) {
        console.error("setupCitySuggestions: parametri mancanti");
        return null;
    }

    let timer = null;

    function renderList(items) {
        if (!items || items.length === 0) {
            suggestions.innerHTML = "<div style='padding: 10px;'>Nessuna città trovata</div>";
            suggestions.classList.remove("hidden");
            return;
        }

        // TODO 1: Mappa l'array 'items' (prendendo solo i primi 5 elementi) per creare il markup.
        // Ogni item deve restituire un div con classe "suggestion-item" e attributi:
        // data-name, data-country, data-lat, data-lon (con ognuno il dato il dato corrisponende)
        // Usa la funzione sanitizeHTML() inclusa nel file per sanificare TUTTI i valori.
        const html = /* inserisci la logica map() e join() qui */

        suggestions.innerHTML = html;
        suggestions.classList.remove("hidden");
    }

    async function search() {
        const text = input.value.trim();

        if (text.length < 2) {
            suggestions.innerHTML = "";
            suggestions.classList.add("hidden");
            return;
        }

        try {
            showLoading(suggestions, "🔍 Ricerca...");

            const items = await fetchSuggestions(text);
            renderList(items);
        } catch (error) {
            suggestions.innerHTML = "<div style='padding: 10px; color: red;'>❌ Errore nella ricerca</div>";
            suggestions.classList.remove("hidden");
            console.error("Errore ricerca città:", error);
        }
    }

    input.addEventListener("input", () => {
        clearTimeout(timer);
        timer = setTimeout(search, 300);
    });

    suggestions.addEventListener("click", (evento) => {
        const itemCliccato = evento.target.closest(".suggestion-item");

        if (!itemCliccato) {
            return;
        }

        const city = {
            name: itemCliccato.dataset.name,
            country: itemCliccato.dataset.country,
            latitude: parseFloat(itemCliccato.dataset.lat),
            longitude: parseFloat(itemCliccato.dataset.lon),
        };

        suggestions.innerHTML = "";
        suggestions.classList.add("hidden");
        onSelect(city);
    });

    return {
        nascondi() {
            suggestions.innerHTML = "";
            suggestions.classList.add("hidden");
        },
        distruggi() {
            clearTimeout(timer);
        },
    };
}