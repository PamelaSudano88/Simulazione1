// weather-codes.js - Conversione codici meteo in emoji e descrizioni
// Basato sui codici di interpretazione WMO

const weatherCodes = {
    0: { emoji: "☀️", description: "Sereno" },
    1: { emoji: "🌤️", description: "Poco nuvoloso" },
    2: { emoji: "⛅", description: "Nuvoloso" },
    3: { emoji: "☁️", description: "Nuvoloso" },
    45: { emoji: "🌫️", description: "Nebbia" },
    48: { emoji: "🌫️", description: "Nebbia con brina" },
    51: { emoji: "🌦️", description: "Pioggia leggera" },
    53: { emoji: "🌧️", description: "Pioggia" },
    55: { emoji: "⛈️", description: "Pioggia forte" },
    61: { emoji: "🌧️", description: "Pioggia leggera" },
    63: { emoji: "🌧️", description: "Pioggia moderata" },
    65: { emoji: "⛈️", description: "Pioggia forte" },
    71: { emoji: "🌨️", description: "Neve leggera" },
    73: { emoji: "🌨️", description: "Neve" },
    75: { emoji: "❄️", description: "Neve forte" },
    77: { emoji: "🌨️", description: "Chicchi di neve" },
    80: { emoji: "🌧️", description: "Pioggia leggera" },
    81: { emoji: "⛈️", description: "Pioggia" },
    82: { emoji: "⛈️", description: "Pioggia forte" },
    85: { emoji: "🌨️", description: "Neve leggera" },
    86: { emoji: "❄️", description: "Neve forte" },
    95: { emoji: "⛈️", description: "Temporale" },
    96: { emoji: "⛈️", description: "Temporale con grandine" },
    99: { emoji: "⛈️", description: "Temporale con grandine forte" },
};

/**
 * Restituisce l'emoji corrispondente a un codice meteo WMO.
 * @param {number} code - Codice meteo WMO.
 * @returns {string} - Emoji associata al codice o fallback.
 */
export function getWeatherEmoji(code) {
    return weatherCodes[code]?.emoji || "❓";
}

/**
 * Restituisce la descrizione leggibile di un codice meteo WMO.
 * @param {number} code - Codice meteo WMO.
 * @returns {string} - Descrizione leggibile o fallback.
 */
export function getWeatherDescription(code) {
    return weatherCodes[code]?.description || "Sconosciuto";
}
