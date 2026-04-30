# 🌤️ Meteo App ✅ https://velvetred2020.github.io/meteo-app/

## 📌 Project Overview

This is a simple and responsive **Weather App** that allows users to search for one or multiple cities and retrieve real-time weather data.

The application uses the **Open-Meteo API** and includes smart optimizations such as **API usage limiting and caching** to stay within the free tier (under 10,000 requests/day).

It also features a **dark/light mode toggle**, **auto-refresh**, a **dynamic multi-city layout**, and **country flags** to clearly identify each city's origin and avoid confusion between similarly named locations.

---


## ⚙️ Installation Instructions

Follow these steps to run the project locally:

1. **Clone or download the repository**

   ```bash
   git clone <your-repo-url>
   cd weather-app
   ```

2. **Ensure file structure**

   ```
   meteo-app/
   ├── img/
   │   ├── light_initial.png
   │   ├── light_one_city.png
   │   ├── light_two_cities.png
   │   ├── light_three_cities.png
   │   ├── dark_initial.png
   │   ├── dark_one_city.png
   │   ├── dark_two_cities.png
   │   ├── dark_three_cities.png
   ├── app.js
   ├── index.html
   ├── style.css
   └── README.md
   ```

3. **Run the app**
   - Simply open `index.html` in your browser
   - No build tools or dependencies required

---

## 🚀 Usage Guide

1. Open the app in your browser
2. Enter one or more city names separated by commas:

London, Paris, Tokyo

3. Click **"Get Weather"**
4. View results displayed as responsive weather cards

---

## 🔄 Auto-Refresh

- Weather data automatically refreshes every **5 minutes**
- Previously searched cities are updated without retyping

---

### 🌙 Dark Mode

Click the moon/sun icon in the top-right corner to toggle between light and dark mode.

---

## 🧭 Multi-City Feature

The app now supports **multiple city searches at once**.

### Example input:

London, Paris, Tokyo

### Behavior:

- 1 city → focused layout (compact view)
- 2+ cities → expanded dashboard layout
- Each city is displayed as an independent weather card

The layout automatically adjusts based on how many cities are entered, improving usability and visual balance.

---


## 🌍 Country Identification

- Each city includes a **country flag icon**
- Prevents confusion between cities with the same name  
*(e.g., Paris 🇫🇷 vs Paris 🇺🇸)*
- Improves clarity and usability during multi-city searches

---

## ⚡ Performance Optimization

To stay within the **Open-Meteo free API limits**, the app includes:

### ✅ API Rate Limiting

- Maximum ~**9,500 API calls/day**
- Automatically resets every day
- Prevents exceeding the **10,000 free tier limit**

### 💾 Smart Caching

- Weather data cached for **5 minutes**
- Prevents duplicate API calls for the same city
- Improves performance and reduces network usage

### 🛑 Graceful Limit Handling

When the daily limit is reached:

- App stops making requests
- Displays:

```text
⚠️ Daily API limit reached
```

## 📸 Screenshots

### 🌤️ Light Mode

Initial State  
![Light Initial](img/light_initial.png)

One City  
![Light One City](img/light_one_city.png)

Two Cities  
![Light Two Cities](img/light_two_cities.png)

Three Cities  
![Light Three Cities](img/light_three_cities.png)

---

### 🌙 Dark Mode

Initial State  
![Dark Initial](img/dark_initial.png)

One City  
![Dark One City](img/dark_one_city.png)

Two Cities  
![Dark Two Cities](img/dark_two_cities.png)

Three Cities  
![Dark Three Cities](img/dark_three_cities.png)

---

## ✨ Features

- 🔍 Search one or multiple cities  
- 🌡️ Temperature in Celsius  
- 🌬️ Wind speed  
- 💧 Humidity levels  
- 🌤️ Weather condition icons (day/night aware)  
- 🌅 Sunrise & 🌇 Sunset times  
- 🌍 Country flags for city identification  
- 🌙 Dark / Light mode toggle  
- 📊 Responsive multi-city layout  
- 🔄 Auto-refresh every 5 minutes  
- ⚡ Optimized API usage (rate limiting + caching)  
- 🧠 Smart city matching (multilingual + aliases)  

---

## ⚠️ Error Handling

The app handles common issues gracefully:

- ❌ Invalid city → `"City not found"`  
- ⚠️ API limit reached → `"Daily API limit reached"`  
- 🌐 Network/API errors → handled safely  
- 🚫 Empty input → ignored 

---

## 🌐 API Information

This app uses the free **Open-Meteo API**.

### Geocoding API

https://geocoding-api.open-meteo.com/v1/search?name={city}

### Weather Forecast API

https://api.open-meteo.com/v1/forecast


### Data Provided

- Temperature  
- Weather codes  
- Wind speed  
- Humidity  
- Sunrise & sunset  

---

## 🔒 API Usage Strategy

To avoid requiring a paid plan:

- Daily usage is capped below **10,000 requests**  
- Duplicate calls are avoided through caching  
- Auto-refresh is optimized for efficiency  

---

## 🔮 Future Enhancements

- 📍 Geolocation auto-detect  
- 📅 5-day forecast  
- 🌡️ Celsius/Fahrenheit toggle  
- 🔎 City autocomplete  
- 💾 Save favorite cities  
- 📊 Weather charts  
- 🌍 Multi-language UI  
- 🎨 UI animations  

---

## 📄 License

This project is open-source and free to use for educational purposes.

---

## 🧑‍💻 Notes

- Built with vanilla HTML, CSS, and JavaScript  
- No frameworks or dependencies  
- Uses Open-Meteo free APIs  
- Lightweight and fast  
- Optimized for API efficiency  

---

## 🎯 Project Goal

This project demonstrates:

- API integration best practices  
- Rate limiting and caching strategies  
- DOM manipulation  
- Responsive UI design  
- Clean, modular JavaScript  
- Real-world performance optimization  
