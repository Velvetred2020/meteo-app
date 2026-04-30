// ==========================
// ELEMENTS
// ==========================
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const resultDiv = document.getElementById("result");
const toggleBtn = document.getElementById("toggleMode");
const container = document.querySelector(".container");

// store last searched cities for auto-refresh
let lastCities = [];
let refreshInterval = null;

// ==========================
// API LIMIT CONTROL
// ==========================
const MAX_DAILY_CALLS = 9500; // safe buffer under 10k
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getTodayKey() {
    return new Date().toISOString().split("T")[0];
}

function getApiState() {
    const state = JSON.parse(localStorage.getItem("api_usage") || "{}");
    const today = getTodayKey();

    if (state.date !== today) {
        return { date: today, count: 0 };
    }

    return state;
}

function saveApiState(state) {
    localStorage.setItem("api_usage", JSON.stringify(state));
}

function canMakeApiCall() {
    const state = getApiState();
    return state.count < MAX_DAILY_CALLS;
}

function registerApiCall() {
    const state = getApiState();
    state.count++;
    saveApiState(state);
}

// ==========================
// CACHE
// ==========================
const weatherCache = {};

function getCached(city) {
    const entry = weatherCache[city];
    if (!entry) return null;

    if (Date.now() - entry.timestamp > CACHE_TTL) {
        delete weatherCache[city];
        return null;
    }

    return entry.data;
}

function setCache(city, data) {
    weatherCache[city] = {
        data,
        timestamp: Date.now()
    };
}

// ==========================
// CITY ALIASES
// ==========================
const CITY_ALIASES = {
    roma: ["rome"],
    rome: ["roma"],
    milan: ["milano"],
    milano: ["milan"],
    vienna: ["wien"],
    wien: ["vienna"],
    munich: ["münchen", "munchen"],
    münchen: ["munich"],
    munchen: ["munich"]
};

// normalize string
function normalize(str) {
    return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

// ==========================
// FLAG
// ==========================
function getFlagImg(countryCode) {
    if (!countryCode) return "";
    return `<img class="flag" src="https://flagcdn.com/w40/${countryCode.toLowerCase()}.png">`;
}

// ==========================
// DAY / NIGHT
// ==========================
function isNight(now, sunrise, sunset) {
    return now < sunrise || now > sunset;
}

// ==========================
// WEATHER MAP
// ==========================
function getWeatherInfo(code, night) {
    const map = {
        0: night ? { desc: "Clear night", icon: "🌙" } : { desc: "Clear sky", icon: "☀️" },
        1: night ? { desc: "Mainly clear night", icon: "🌙" } : { desc: "Mainly clear", icon: "🌤️" },
        2: night ? { desc: "Cloudy night", icon: "☁️🌙" } : { desc: "Partly cloudy", icon: "⛅" },
        3: night ? { desc: "Cloudy night", icon: "☁️🌙" } : { desc: "Overcast", icon: "☁️" },
        45: { desc: "Fog", icon: "🌫️" },
        51: night ? { desc: "Drizzle night", icon: "🌧️🌙" } : { desc: "Drizzle", icon: "🌦️" },
        61: night ? { desc: "Rain night", icon: "🌧️🌙" } : { desc: "Rain", icon: "🌧️" },
        63: { desc: "Moderate rain", icon: "🌧️" },
        65: { desc: "Heavy rain", icon: "⛈️" },
        71: { desc: "Snow", icon: "❄️" },
        95: { desc: "Thunderstorm", icon: "⚡" }
    };

    return map[code] || (night
        ? { desc: "Night conditions", icon: "🌙" }
        : { desc: "Cloudy conditions", icon: "☁️" });
}

// ==========================
// GEOCODING
// ==========================
async function geocodeCity(city) {

    if (!canMakeApiCall()) throw new Error("API limit reached");
    registerApiCall();

    const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&language=auto&count=15`
    );

    const data = await res.json();

    if (!data.results || data.results.length === 0) {
        throw new Error("City not found");
    }

    const query = normalize(city);
    const aliases = CITY_ALIASES[query] || [];

    const scored = data.results.map(r => {
        let score = 0;

        const name = normalize(r.name);
        const country = (r.country || "").toLowerCase();

        if ((query === "roma" || query === "rome") && country === "italy") {
            score += 1000;
        }

        if (aliases.includes(name)) score += 300;
        if (name === query) score += 200;
        if (name.includes(query)) score += 50;

        if (r.population) {
            score += Math.min(r.population / 100000, 25);
        }

        return { ...r, score };
    });

    scored.sort((a, b) => b.score - a.score);

    return scored[0];
}

// ==========================
// FETCH WEATHER
// ==========================
async function fetchWeather(city) {

    // CACHE
    const cached = getCached(city);
    if (cached) return cached;

    const geo = await geocodeCity(city);

    const { latitude, longitude, name, country_code } = geo;

    if (!canMakeApiCall()) throw new Error("API limit reached");
    registerApiCall();

    const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=sunrise,sunset&timezone=auto&hourly=relative_humidity_2m`
    );

    const data = await weatherRes.json();

    const temp = data.current_weather.temperature;
    const wind = data.current_weather.windspeed;
    const code = data.current_weather.weathercode;
    const humidity = data.hourly.relative_humidity_2m?.[0] ?? "N/A";

    const now = new Date(data.current_weather.time);
    const sunrise = new Date(data.daily.sunrise[0]);
    const sunset = new Date(data.daily.sunset[0]);

    const night = isNight(now, sunrise, sunset);
    const { desc, icon } = getWeatherInfo(code, night);

    const sunriseStr = sunrise.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const sunsetStr = sunset.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const html = `
        <div class="card">
            <h3>${name} ${getFlagImg(country_code)}</h3>
            <div class="weather-icon">${icon}</div>
            <h2>${temp}°C</h2>
            <p>${desc}</p>
            <div class="details">
                <div class="detail-box">
                    🌅 ${sunriseStr}
                    <span>🌇 ${sunsetStr}</span>
                </div>
                <div class="detail-box">
                    🌬️ ${wind} km/h
                    <span>💧 ${humidity}%</span>
                </div>
            </div>
        </div>
    `;

    setCache(city, html);

    return html;
}

// ==========================
// PARSE INPUT
// ==========================
function getCities() {
    return cityInput.value
        .split(",")
        .map(c => c.trim())
        .filter(Boolean);
}

// ==========================
// RENDER
// ==========================
async function renderCities(cities) {
    resultDiv.innerHTML = "Loading...";

    const cards = await Promise.all(
        cities.map(c =>
            fetchWeather(c).catch(err => {
                if (err.message === "API limit reached") {
                    return `<div class="card">⚠️ Daily API limit reached</div>`;
                }
                return `<div class="card">City not found</div>`;
            })
        )
    );

    resultDiv.innerHTML = cards.join("");
}

// ==========================
// SEARCH
// ==========================
async function handleSearch() {
    const cities = getCities();
    if (!cities.length) return;

    lastCities = cities;

    container.classList.toggle("expanded", cities.length > 1);

    await renderCities(cities);

    startAutoRefresh();
}

// ==========================
// AUTO REFRESH
// ==========================
function startAutoRefresh() {
    if (refreshInterval) clearInterval(refreshInterval);

    refreshInterval = setInterval(() => {
        if (lastCities.length) {
            renderCities(lastCities);
        }
    }, 5 * 60 * 1000);
}

// ==========================
// DARK MODE
// ==========================
toggleBtn.addEventListener("click", () => {
    const dark = document.body.classList.toggle("dark");
    toggleBtn.textContent = dark ? "☀️" : "🌙";
});

// ==========================
// EVENTS
// ==========================
searchBtn.addEventListener("click", handleSearch);

cityInput.addEventListener("keypress", e => {
    if (e.key === "Enter") handleSearch();
});
