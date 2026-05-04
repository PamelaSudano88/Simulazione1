// records-table.js - Mostra una tabella con righe cliccabili
//
// Crea una tabella per mostrare la cronologia o i preferiti.
// Ogni riga può essere cliccata e cancellata.

import { sanitizeHTML } from "../core/errors.js";

/**
 * Crea una tabella con cronologia o preferiti
 * 
 * @param {Object} config
 * @param {HTMLElement} config.container - Dove mettere la tabella
 * @param {string} config.emptyMessage - Messaggio se non ci sono record (es: "Nessun favorito")
 * @param {Array<Object>} config.records - I record da mostrare
 * @param {Array<Object>} config.columns - Le colonne della tabella
 *                  Esempio: [{ header: "Data", render: (entry) => entry.name }]
 * @param {Function} config.onRowClick - Cosa fare se clicco una riga
 * @param {Function} config.onDelete - Cosa fare se clicco delete su una riga
 * @param {Function} config.onDeleteAll - Cosa fare se clicco "cancella tutto"
 * @param {string} [config.clearAllLabel="Cancella tutto"] - Testo del pulsante "cancella tutto"
 * @param {string} [config.deleteLabel="Rimuovi"] - Testo del pulsante "rimuovi" per ogni riga
 */
export function renderRecordsTable({
    container,
    emptyMessage,
    records,
    columns,
    onRowClick,
    onDelete,
    onDeleteAll,
    clearAllLabel = "Cancella tutto",
    deleteLabel = "Rimuovi",
}) {
    if (!container) {
        return;
    }

    if (!records || records.length === 0) {
        container.innerHTML = `
            <section style="padding: 20px; text-align: center;">
                <p>${sanitizeHTML(emptyMessage)}</p>
            </section>
        `;
        return;
    }

    const headerHtml = `${columns.map((col) => `<th>${col.header}</th>`).join("")}<th>Azioni</th>`;
    const rowsHtml = records
        .map((record) => {
            const cellsHtml = columns
                .map((col) => `<td>${sanitizeHTML(String(col.render(record)))}</td>`)
                .join("");

            return `
                <tr class="records-row" tabindex="0">
                    ${cellsHtml}
                    <td class="records-actions">
                        <button class="btn btn-danger btn-delete" type="button">
                            ${deleteLabel}
                        </button>
                    </td>
                </tr>
            `;
        })
        .join("");

    // Mette tutto assieme in HTML
    container.innerHTML = `
        <section class="records-panel">
            <div class="records-header" style="display: flex; justify-content: flex-end; align-items: center; padding: 10px 20px;">
                ${onDeleteAll ? `<button id="btn-clear-all" class="btn btn-secondary btn-danger">${clearAllLabel}</button>` : ""}
            </div>
            <div class="records-table-wrapper">
                <table class="records-table">
                    <thead>
                        <tr>${headerHtml}</tr>
                    </thead>
                    <tbody>
                        ${rowsHtml}
                    </tbody>
                </table>
            </div>
        </section>
    `;

    const rows = container.querySelectorAll(".records-row");
    const deleteButtons = container.querySelectorAll(".btn-delete");

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const record = records[i];
        const deleteBtn = deleteButtons[i];

        row.addEventListener("click", () => {
            if (onRowClick) {
                onRowClick(record);
            }
        });

        row.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                if (onRowClick) {
                    onRowClick(record);
                }
            }
        });

        deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation(); // Non far scattare il click della riga

            if (onDelete) {
                onDelete(record);
            }
        });
    }

    if (onDeleteAll) {
        const btnClearAll = container.querySelector("#btn-clear-all");
        if (btnClearAll) {
            btnClearAll.addEventListener("click", () => {
                const conferma = confirm("Sei sicuro?");
                if (!conferma) {
                    onDeleteAll();
                }
            });
        }
    }
}