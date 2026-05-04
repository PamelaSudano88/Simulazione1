// index.js - Logica per la pagina HOME (guida sito)

import { mountFooter } from "../core/footer.js";
import { mountHeader } from "../core/header.js";



/**
 * Inizializza la pagina.
 * Non fa nulla di particolare, solo monta header e footer.
 * La pagina home è statica, quindi non ha bisogno di logica specifica.
 */
function init() {
    const currentPage = "home";
    mountHeader(currentPage);
    mountFooter();
}

init();
