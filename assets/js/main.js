const apiKey = '5a0a261f16b6352ff63cdb857d7a97bd';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
const geocodingApiUrl = 'http://api.openweathermap.org/data/2.5/find';  // OpenWeather Geocoding API

document.getElementById('weatherButton').addEventListener('click', getWeather);

// Initial call to get weather
getWeather();

// Set interval to update weather every 10 minutes (600,000 milliseconds)
setInterval(getWeather, 600000);

// Listen for input changes to suggest city names
document.getElementById('locationInput').addEventListener('input', getCitySuggestions);

async function getWeather() {
  const location = document.getElementById('locationInput').value;
  
  try {
    const response = await fetch(`${apiUrl}?q=${location}&appid=${apiKey}&units=metric`);
    
    // Check if the response is okay (status code 200)
    if (!response.ok) {
      throw new Error('Location not found');
    }

    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    // Handle error, e.g., display a default icon or message
    document.getElementById('location').textContent = 'Location not found';
    document.querySelector('.weather-icon').src = 'assets/images/default.png';
  }
}

async function getCitySuggestions() {
  const input = document.getElementById('locationInput').value;
  
  // Fetch city suggestions if input is at least 3 characters long
  if (input.length >= 3) {
    try {
      const response = await fetch(`${geocodingApiUrl}?q=${input}&appid=${apiKey}&type=like`);
      const data = await response.json();
      
      // Get the datalist element
      const datalist = document.getElementById('cities');
      
      // Clear existing suggestions
      datalist.innerHTML = '';
      
      // Add new suggestions to the datalist
      data.list.forEach(city => {
        const option = document.createElement('option');
        option.value = `${city.name}, ${city.sys.country}`; // Display city name and country
        datalist.appendChild(option);
      });
    } catch (error) {
      console.error('Error fetching city suggestions:', error);
    }
  }
}

function displayWeather(data) {
  // Display weather data
  document.getElementById('location').textContent = `Location: ${data.name}`;
  document.getElementById('temperature').textContent = `Temperature: ${Math.round(data.main.temp)}°C`;
  document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
  document.getElementById('wind').textContent = `Wind Speed: ${data.wind.speed} m/s`;

  const weatherIcon = document.querySelector('.weather-icon');

  // Check for weather condition and set the appropriate icon
  switch (data.weather[0].main) {
    case "Clouds":
      weatherIcon.src = "assets/images/clouds.png";
      break;
    case "Clear":
      weatherIcon.src = "assets/images/clear.png";
      break;
    case "Rain":
      // Handle different types of rain (light, moderate, heavy, etc.)
      if (data.weather[0].description.includes("light rain")) {
        weatherIcon.src = "assets/images/light-rain.png"; // Light rain
      } else if (data.weather[0].description.includes("heavy rain")) {
        weatherIcon.src = "assets/images/heavy-rain.png"; // Heavy rain
      } else {
        weatherIcon.src = "assets/images/rain.png"; // Default rain image
      }
      break;
    case "Drizzle":
      weatherIcon.src = "assets/images/drizzle.png";
      break;
    case "Mist":
      weatherIcon.src = "assets/images/mist.png";
      break;
    default:
      weatherIcon.src = "assets/images/default.png"; // Set a default image
  }
}
