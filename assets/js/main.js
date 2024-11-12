const apiKey = "5a0a261f16b352ff63cdb857d7a97bd";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather";
const geocodingApiUrl = "https://api.openweathermap.org/geo/1.0/direct";

// Get DOM elements
const weatherButton = document.getElementById("weatherButton");
const locationInput = document.getElementById("locationInput");
const loadingSpinner = document.getElementById("loading-spinner");

// Add event listeners
weatherButton.addEventListener("click", getWeather);
locationInput.addEventListener("input", handleInput);

// Initial weather call - only if there's a location value
if (locationInput.value) {
  getWeather();
}

let debounceTimer;
function handleInput(event) {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    if (event.target.value.length >= 3) {
      getCitySuggestions(event.target.value);
    }
  }, 300);
}

async function getWeather() {
  const location = locationInput.value;
  if (!location) {
    showError("Please enter a location");
    return;
  }

  // Show loading spinner
  showLoading(true);

  try {
    const response = await fetch(
      `${apiUrl}?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric`
    );

    if (!response.ok) {
      throw new Error(`Weather data not found for ${location}`);
    }

    const data = await response.json();

    // Check if we have the required data
    if (!data || !data.main || !data.weather || !data.weather[0]) {
      throw new Error("Invalid weather data received");
    }

    displayWeather(data);
    updateLastUpdated();
    hideError();
  } catch (error) {
    console.error("Error:", error);
    showError(error.message || "Failed to fetch weather data");
    resetDisplay();
  } finally {
    showLoading(false);
  }
}

async function getCitySuggestions(input) {
  try {
    const response = await fetch(
      `${geocodingApiUrl}?q=${encodeURIComponent(
        input
      )}&limit=5&appid=${apiKey}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch city suggestions");
    }

    const cities = await response.json();
    displaySuggestions(cities);
  } catch (error) {
    console.error("Error:", error);
    // Clear suggestions in case of error
    clearSuggestions();
  }
}

function displayWeather(data) {
  if (!data || !data.main || !data.weather || !data.weather[0]) {
    throw new Error("Invalid weather data");
  }

  // Update DOM elements with weather data
  document.getElementById("temperature").textContent = `${Math.round(
    data.main.temp
  )}°C`;
  document.getElementById("location").textContent = data.name;
  document.getElementById("humidity").textContent = `${data.main.humidity}%`;
  document.getElementById("wind").textContent = `${data.wind.speed} m/s`;

  // Update weather icon
  const weatherIcon = document.querySelector(".weather-icon");
  const weatherCondition = data.weather[0].main.toLowerCase();

  // Map weather conditions to icon files
  const weatherIcons = {
    clouds: "clouds.png",
    clear: "clear.png",
    rain: "rain.png",
    drizzle: "drizzle.png",
    mist: "mist.png",
    snow: "snow.png",
    thunderstorm: "thunderstorm.png",
  };

  weatherIcon.src = `assets/images/${
    weatherIcons[weatherCondition] || "default.png"
  }`;
  weatherIcon.alt = data.weather[0].description;
}

function displaySuggestions(cities) {
  const datalist = document.getElementById("cities");
  datalist.innerHTML = "";

  cities.forEach((city) => {
    const option = document.createElement("option");
    option.value = `${city.name}${city.state ? `, ${city.state}` : ""}, ${
      city.country
    }`;
    datalist.appendChild(option);
  });
}

function clearSuggestions() {
  const datalist = document.getElementById("cities");
  datalist.innerHTML = "";
}

function showError(message) {
  const errorElement = document.getElementById("error-message");
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = "block";
  }
}

function hideError() {
  const errorElement = document.getElementById("error-message");
  if (errorElement) {
    errorElement.style.display = "none";
  }
}

function showLoading(show) {
  if (loadingSpinner) {
    loadingSpinner.classList.toggle("hidden", !show);
  }
}

function resetDisplay() {
  document.getElementById("temperature").textContent = "Temperature: --°C";
  document.getElementById("location").textContent = "Location: --";
  document.getElementById("humidity").textContent = "--%";
  document.getElementById("wind").textContent = "-- m/s";
  document.querySelector(".weather-icon").src = "assets/images/default.png";
}

function updateLastUpdated() {
  const lastUpdated = document.getElementById("lastUpdated");
  if (lastUpdated) {
    const now = new Date();
    lastUpdated.textContent = `Last updated: ${now.toLocaleTimeString()}`;
  }
}

// Update weather every 10 minutes if there's a location entered
setInterval(() => {
  if (locationInput.value) {
    getWeather();
  }
}, 600000);
