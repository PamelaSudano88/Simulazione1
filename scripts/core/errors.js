// errors.js - Gestione errori e utilities

/**
 * Mostra uno stato di caricamento dentro un contenitore.
 * @param {HTMLElement} container - Contenitore da aggiornare.
 * @param {string} [message="⏳ Caricamento..."] - Testo da mostrare.
 * @returns {void}
 */
export function showLoading(container, message = "⏳ Caricamento...") {
    container.innerHTML = `<div class="loading">${message}</div>`;
}

/**
 * Mostra un messaggio di errore dentro un contenitore.
 * @param {HTMLElement} container - Contenitore da aggiornare.
 * @param {string} [title="Errore"] - Titolo dell'errore.
 * @param {string} [message=""] - Dettaglio opzionale dell'errore.
 * @returns {void}
 */
export function showError(container, title = "Errore", message = "") {
    container.innerHTML = `
        <div class="error">
            <strong>❌ ${title}</strong>
            ${message ? `<p>${message}</p>` : ""}
        </div>
    `;
    console.error(`${title}: ${message}`);
}

/**
 * Mostra un messaggio di stato vuoto dentro un contenitore.
 * @param {HTMLElement} container - Contenitore da aggiornare.
 * @param {string} [message="Nessun dato disponibile."] - Messaggio da mostrare.
 * @returns {void}
 */
export function showEmpty(container, message = "Nessun dato disponibile.") {
    container.innerHTML = `<div class="empty">${message}</div>`;
}

/**
 * Pulisce completamente il contenitore passato.
 * @param {HTMLElement} container - Contenitore da svuotare.
 * @returns {void}
 */
export function clearContainer(container) {
    container.innerHTML = "";
}

/**
 * Sanitizza una stringa per l'uso sicuro in HTML.
 * @param {string} html - Testo potenzialmente non sicuro.
 * @returns {string} - Stringa sanitizzata.
 */
export function sanitizeHTML(html) {
    const map = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
    };
    return String(html).replace(/[&<>"']/g, (m) => map[m]);
}
