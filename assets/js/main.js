const apiKey = "5a0a261f16b352ff63cdb857d7a97bd";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather";
const geocodingApiUrl = "https://api.openweathermap.org/data/2.5/find"; // Using find API instead

document.getElementById("weatherButton").addEventListener("click", getWeather);
document.getElementById("locationInput").addEventListener("input", handleInput);

let timeoutId;

function handleInput(event) {
  const input = event.target.value;

  // Clear previous timeout
  clearTimeout(timeoutId);

  // Don't search if input is too short
  if (input.length < 3) {
    clearSuggestions();
    return;
  }

  // Set new timeout
  timeoutId = setTimeout(() => {
    searchCities(input);
  }, 500);
}

async function searchCities(query) {
  try {
    const response = await fetch(
      `${geocodingApiUrl}?q=${encodeURIComponent(
        query
      )}&type=like&appid=${apiKey}&units=metric`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch cities");
    }

    const data = await response.json();
    updateSuggestions(data.list);
  } catch (error) {
    console.error("Error:", error);
    clearSuggestions();
  }
}

function updateSuggestions(cities) {
  const suggestionBox = document.getElementById("suggestions");
  suggestionBox.innerHTML = "";

  if (!cities || cities.length === 0) {
    suggestionBox.style.display = "none";
    return;
  }

  cities.slice(0, 5).forEach((city) => {
    const div = document.createElement("div");
    div.className = "suggestion-item";
    div.textContent = `${city.name}, ${city.sys.country}`;

    div.addEventListener("click", () => {
      document.getElementById("locationInput").value = div.textContent;
      suggestionBox.style.display = "none";
      getWeather();
    });

    suggestionBox.appendChild(div);
  });

  suggestionBox.style.display = "block";
}

function clearSuggestions() {
  const suggestionBox = document.getElementById("suggestions");
  suggestionBox.innerHTML = "";
  suggestionBox.style.display = "none";
}

// Hide suggestions when clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".search-container")) {
    clearSuggestions();
  }
});

async function getWeather() {
  const location = document.getElementById("locationInput").value;

  if (!location) {
    alert("Please enter a city name");
    return;
  }

  try {
    const response = await fetch(
      `${apiUrl}?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric`
    );

    if (!response.ok) {
      throw new Error("City not found");
    }

    const data = await response.json();

    // Update the weather information
    document.getElementById("temperature").textContent = `${Math.round(
      data.main.temp
    )}°C`;
    document.getElementById("location").textContent = data.name;
    document.getElementById("humidity").textContent = `${data.main.humidity}%`;
    document.getElementById("wind").textContent = `${data.wind.speed} m/s`;

    // Update weather icon
    const weatherMain = data.weather[0].main.toLowerCase();
    let iconName = "default.png";

    switch (weatherMain) {
      case "clear":
        iconName = "clear.png";
        break;
      case "clouds":
        iconName = "clouds.png";
        break;
      case "rain":
        iconName = "rain.png";
        break;
      case "drizzle":
        iconName = "drizzle.png";
        break;
      case "mist":
        iconName = "mist.png";
        break;
    }

    const weatherIcon = document.querySelector(".weather-icon");
    weatherIcon.src = `assets/images/${iconName}`;
    weatherIcon.alt = data.weather[0].description;
  } catch (error) {
    console.error("Error:", error);
    alert("Error fetching weather data. Please try again.");
  }
}
