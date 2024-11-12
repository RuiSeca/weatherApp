const apiKey = "5a0a261f16b6352ff63cdb857d7a97bd";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather";

document.getElementById("weatherButton").addEventListener("click", getWeather);

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

    // Update weather icon based on weather condition
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

// Optional: Add this to test the API connection
window.addEventListener("load", () => {
  // Test API connection with a default city
  const testUrl = `${apiUrl}?q=London&appid=${apiKey}&units=metric`;
  fetch(testUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log("API connection successful");
    })
    .catch((error) => {
      console.error("API connection test failed:", error);
    });
});
