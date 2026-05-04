// favorite-button.js - Il pulsante ⭐ per aggiungere ai preferiti
//
// Crea un pulsante che si monta dentro la card del meteo.
// Mostra ⭐ se non è nei preferiti, ✅ se lo è già.


/**
 * Crea il pulsante ⭐ per aggiungere ai preferiti
 * 
 * @param {Function} onClick - Cosa fare quando clicco il pulsante
 * @returns {HTMLButtonElement} - Il pulsante pronto da usare
 */
export function createFavoriteButton(onClick) {
    const button = document.createElement("button");
    button.id = "btn-add-favorite";
    button.type = "button";
    button.className = "btn btn-favorite-inline hidden";
    button.textContent = "⭐";
    button.title = "Aggiungi ai preferiti";

    if (typeof onClick === "function") {
        button.addEventListener("click", onClick);
    }

    return button;
}

/**
 * Monta il pulsante dentro la card del meteo
 * 
 * @param {HTMLElement} weatherCard - La card dove montare il pulsante
 * @param {HTMLButtonElement} button - Il pulsante da montare
 */
export function mountFavoriteButton(weatherCard, button) {
    // Trova il titolo della card
    const header = weatherCard.querySelector(".weather-card-header");
    if (!header) return;

    weatherCard.classList.add("has-inline-favorite");
    button.classList.remove("hidden");

    // Inserisci il pulsante dopo il titolo
    header.appendChild(button);
}

/**
 * Aggiorna come appare il pulsante
 * 
 * Se è già nei preferiti: mostra ✅ disabilitato
 * Se non è nei preferiti: mostra ⭐ cliccabile
 * 
 * @param {HTMLButtonElement} button - Il pulsante da aggiornare
 * @param {boolean} isAlreadyFavorite - È già nei preferiti?
 */
export function setFavoriteButtonState(button, isAlreadyFavorite) {
    if (!button) return;

    button.classList.remove("hidden");

    if (isAlreadyFavorite) {
        button.textContent = "✅";
        button.title = "Già nei preferiti";
        button.disabled = true;
        button.style.opacity = "0.5";
    } else {
        button.textContent = "⭐";
        button.title = "Aggiungi ai preferiti";
        button.disabled = false;
        button.style.opacity = "1";
    }
}
