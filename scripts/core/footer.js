// footer.js - Footer riutilizzabile

/**
 * Crea l'elemento footer condiviso dell'app.
 * @returns {HTMLElement} - Elemento footer pronto da montare.
 */
export function createFooter() {
    const footer = document.createElement("footer");
    footer.className = "footer";

    footer.innerHTML = `
        <div class="footer-content">
            <p>🌦️ Weather App | Dati da <a href="https://open-meteo.com" target="_blank">Open-Meteo</a></p>
            <p>API libera e gratuita, senza registrazione</p>
        </div>
    `;

    return footer;
}

/**
 * Monta il footer nel contenitore specificato.
 * @param {HTMLElement} [container=document.body] - Contenitore in cui inserire il footer.
 * @returns {void}
 */
export function mountFooter(container = document.body) {
    const footer = createFooter();
    container.appendChild(footer);
}
