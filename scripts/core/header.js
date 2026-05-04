// header.js - Header riutilizzabile

/**
 * Crea l'elemento header con la navigazione principale.
 * @param {string} [currentPage="home"] - Pagina attiva, usata per evidenziare il link corrente.
 * @returns {HTMLElement} - Elemento header pronto da montare.
 */
export function createHeader(currentPage = "home") {
    const header = document.createElement("header");
    header.className = "header";

    const pages = [
        { name: "Home", path: "index.html", id: "home" },
        { name: "Ricerca", path: "search.html", id: "search" },
        { name: "Archivio", path: "archive.html", id: "archive" },
        { name: "Cronologia", path: "history.html", id: "history" },
        { name: "Preferiti", path: "favorites.html", id: "favorites" },
    ];

    const navItems = pages
        .map((page) => {
            const isActive = page.id === currentPage ? " active" : "";
            return `<li><a href="${page.path}" class="nav-link${isActive}">${page.name}</a></li>`;
        })
        .join("");

    header.innerHTML = `
        <div class="header-content">
            <h1 class="logo">
                <a href="index.html">🌤️ Weather App</a>
            </h1>
            <nav class="header-nav">
                <ul>
                    ${navItems}
                </ul>
            </nav>
        </div>
    `;

    return header;
}

/**
 * Monta l'header nel contenitore specificato.
 * @param {string} [currentPage="home"] - Pagina attiva della navigazione.
 * @param {HTMLElement} [container=document.body] - Contenitore in cui inserire l'header.
 * @returns {void}
 */
export function mountHeader(currentPage = "home", container = document.body) {
    const header = createHeader(currentPage);
    container.prepend(header);
}
