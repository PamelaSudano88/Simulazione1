// api.js - Funzioni per ricevere i dati meteo dall'API Open-Meteo
// API gratuita: https://open-meteo.com/ (non serve registrazione)
//
// Queste funzioni fanno delle "richieste HTTP" per ottenere:
// - Meteo attuale e previsioni
// - Coordinate geografiche di una città
// - Dati meteo storici

const API_METEO = "https://api.open-meteo.com/v1/forecast";
const API_STORICO = "https://archive-api.open-meteo.com/v1/archive";
const API_CITTÀ = "https://geocoding-api.open-meteo.com/v1/search";

/**
 * Ottiene il meteo attuale e le previsioni a 7 giorni
 * 
 * @param {number} latitude - La latitudine (es: 45.46)
 * @param {number} longitude - La longitudine (es: 9.19)
 * @returns {Object} - I dati con temperatura, umidità, vento, previsioni...
 * 
 * @example
 * const meteo = await getWeatherByCoordinates(45.46, 9.19);
 * console.log(meteo.current.temperature_2m); // Es: 18
 */
export async function getWeatherByCoordinates(latitude, longitude) {
    // Costruisce l'URL della richiesta
    const url = `${API_METEO}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_hours&hourly=temperature_2m,weather_code&timezone=auto`;
    
    try {
        const risposta = await fetch(url);

        if (!risposta.ok) {
            throw new Error(`Errore nel meteo (errore ${risposta.status})`);
        }

        const dati = await risposta.json();
        return dati;
    } catch (errore) {
        console.error("Errore meteo:", errore);
        throw errore;
    }
}

/**
 * Cerca una città per nome e ottiene le coordinate
 * 
 * @param {string} nome - Il nome della città (es: "Milano")
 * @returns {Array} - Lista di città che corrisponde al nome
 * 
 * @example
 * const risultati = await getCoordinatesByCity("Milano");
 * console.log(risultati[0]); // { name: "Milan", latitude: 45.46, longitude: 9.19, ... }
 */
export async function getCoordinatesByCity(nome) {
    // TODO 1: Costruisci l'URL per l'API usando la costante API_CITTÀ
    // Parametri richiesti: name (il nome passato alla funzione), count=10, language=it
    // Dopodichè effettua la fetch e lancia un Error se la risposta non è ok
    // Infine estrai il JSON. Se non ci sono risultati (dati.results è vuoto o assente), lancia un Error.
    // Altrimenti, ritorna l'array dei risultati.
}

/**
 * Ottiene i dati meteo storici tra due date
 * 
 * @param {number} latitude - La latitudine
 * @param {number} longitude - La longitudine
 * @param {string} dataInizio - Data nel formato YYYY-MM-DD (es: "2024-01-01")
 * @param {string} dataFine - Data nel formato YYYY-MM-DD (es: "2024-12-31")
 * @returns {Object} - I dati meteo storici
 * 
 * @example
 * const storico = await getHistoricalWeatherByCoordinates(45.46, 9.19, "2024-01-01", "2024-01-31");
 */
export async function getHistoricalWeatherByCoordinates(latitude, longitude, dataInizio, dataFine) {
    // Costruisce l'URL della richiesta
    const url = `${API_STORICO}?latitude=${latitude}&longitude=${longitude}&start_date=${dataInizio}&end_date=${dataFine}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`;

    try {
        const risposta = await fetch(url);

        if (!risposta.ok) {
            throw new Error(`Errore nel meteo storico (errore ${risposta.status})`);
        }

        const dati = await risposta.json();
        return dati;
    } catch (errore) {
        console.error("Errore meteo storico:", errore);
        throw errore;
    }
}
