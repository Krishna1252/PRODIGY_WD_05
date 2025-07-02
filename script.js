// ========= CONFIG =========
const API_KEY = "7b277cf12aef42d896b104217250107"; 
// ========= DOM REFS =========
const form       = document.getElementById("weatherForm");
const input      = document.getElementById("cityInput");
const message    = document.getElementById("message");
const detailsSec = document.getElementById("weatherDetails");

// Elements to fill
const locationEl  = document.getElementById("location");
const tempEl      = document.getElementById("temp");
const conditionEl = document.getElementById("condition");
const iconEl      = document.getElementById("icon");
const humidityEl  = document.getElementById("humidity");
const windEl      = document.getElementById("wind");
const feelsEl     = document.getElementById("feelsLike");
const pressureEl  = document.getElementById("pressure");
const visEl       = document.getElementById("visibility");
const uvEl        = document.getElementById("uv");

// ========= HELPERS =========
const showMessage = (msg) => (message.textContent = msg);

const updateUI = (data) => {
  locationEl.textContent  = `${data.location.name}, ${data.location.country}`;
  tempEl.textContent      = `${data.current.temp_c}°C`;
  conditionEl.textContent = data.current.condition.text;
  iconEl.src              = `https:${data.current.condition.icon}`;
  iconEl.alt              = data.current.condition.text;

  humidityEl.textContent = data.current.humidity;
  windEl.textContent     = data.current.wind_kph;
  feelsEl.textContent    = data.current.feelslike_c;
  pressureEl.textContent = data.current.pressure_mb;
  visEl.textContent      = data.current.vis_km;
  uvEl.textContent       = data.current.uv;

  detailsSec.classList.remove("hidden");
  showMessage("");
};

const fetchWeather = async (query) => {
  showMessage("Loading…");
  detailsSec.classList.add("hidden");
  try {
    const res = await fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${query}`);
    if (!res.ok) throw new Error("Location not found");
    const data = await res.json();
    updateUI(data);
  } catch (err) {
    showMessage("Could not fetch weather. Try another location.");
  }
};

// ========= EVENTS =========
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const city = input.value.trim();
  if (!city) return showMessage("Please enter a city name.");
  fetchWeather(encodeURIComponent(city));
});

// ========= GEOLOCATION ON LOAD =========
window.addEventListener("load", () => {
  if (!navigator.geolocation) return; // not supported
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      fetchWeather(`${latitude},${longitude}`);
    },
    () => {      
    },
    { timeout: 10000 }
  );
});
