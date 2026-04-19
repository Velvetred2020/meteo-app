const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const resultDiv = document.getElementById("result");
const toggleBtn = document.getElementById("toggleMode");
const container = document.querySelector(".container");

/**
 * Convert weather codes into readable icons + text
 */
function getWeatherInfo(code) {
    const weatherMap = {
        0: { desc: "Clear sky", icon: "☀️" },
        1: { desc: "Mainly clear", icon: "🌤️" },
        2: { desc: "Partly cloudy", icon: "⛅" },
        3: { desc: "Overcast", icon: "☁️" },
        45: { desc: "Fog", icon: "🌫️" },
        61: { desc: "Rain", icon: "🌧️" },
        63: { desc: "Moderate rain", icon: "🌧️" },
        65: { desc: "Heavy rain", icon: "⛈️" },
        71: { desc: "Snow", icon: "❄️" },
        95: { desc: "Thunderstorm", icon: "⚡" }
    };

    return weatherMap[code] || { desc: "Unknown", icon: "❓" };
}

/**
 * Fetch weather data for one city and return HTML card
 */
async function fetchWeatherCard(city) {
    try {
        const geoRes = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}`
        );

        const geoData = await geoRes.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found");
        }

        const { latitude, longitude, name } = geoData.results[0];

        const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relative_humidity_2m`
        );

        const weatherData = await weatherRes.json();

        const temp = weatherData.current_weather.temperature;
        const wind = weatherData.current_weather.windspeed;
        const code = weatherData.current_weather.weathercode;
        const humidity = weatherData.hourly.relative_humidity_2m?.[0] ?? "N/A";

        const { desc, icon } = getWeatherInfo(code);

        return `
            <div class="card">
                <h3>${name}</h3>
                <div class="weather-icon">${icon}</div>
                <h2>${temp}°C</h2>
                <p>${desc}</p>

                <div class="details">
                    <div class="detail-box">
                        🌬️ <span>${wind} km/h</span>
                    </div>
                    <div class="detail-box">
                        💧 <span>${humidity}%</span>
                    </div>
                </div>
            </div>
        `;

    } catch (err) {
        return `
            <div class="card">
                <h3>${city}</h3>
                <p>❌ ${err.message}</p>
            </div>
        `;
    }
}



/**
 * Handle multiple city search
 */
async function handleSearch() {
    const cities = cityInput.value
        .split(",")
        .map(c => c.trim())
        .filter(Boolean);

    if (cities.length === 0) return;

    updateLayout(cities.length);

    resultDiv.innerHTML = "Loading...";

    const cards = await Promise.all(
        cities.map(city => fetchWeatherCard(city))
    );

    resultDiv.innerHTML = cards.join("");
}

function updateLayout(count) {
    if (count > 1) {
        container.classList.add("expanded");
    } else {
        container.classList.remove("expanded");
    }
}

/**
 * Toggle dark mode
 */
function toggleDarkMode() {
    document.body.classList.toggle("dark");

    toggleBtn.textContent = document.body.classList.contains("dark")
        ? "☀️"
        : "🌙";
}

/* EVENTS */
searchBtn.addEventListener("click", handleSearch);

cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleSearch();
});

toggleBtn.addEventListener("click", toggleDarkMode);
