// view-state.js - Helper per le operazioni asincrone (API calls)

import { clearContainer, showLoading } from "./errors.js";

/**
 * Esegue una richiesta con stato di caricamento e gestione errori.
 */
export async function runAsyncSection({
    loadingContainer,
    loadingMessage = "⏳ Caricamento...",
    request,
    onSuccess,
    onError,
    clearContainers = [],
}) {
    if (!loadingContainer || !request || !onSuccess) {
        console.error("runAsyncSection: parametri mancanti");
        return;
    }

    showLoading(loadingContainer, loadingMessage);
    clearContainers.forEach((container) => {
        if (container) {
            clearContainer(container);
        }
    });

    try {
        const data = await request();
        return onSuccess(data);
    } catch (error) {
        if (onError) {
            return onError(error);
        }
        throw error;
    }
}
