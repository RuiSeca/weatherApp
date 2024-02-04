// script.js

const apiKey = '5a0a261f16b6352ff63cdb857d7a97bd';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

async function getWeather() {
  const location = document.getElementById('locationInput').value;
  const response = await fetch(`${apiUrl}?q=${location}&appid=${apiKey}&units=metric`);
  const data = await response.json();
  displayWeather(data);
}

function displayWeather(data) {
  document.getElementById('location').textContent = data.name;
  document.getElementById('temperature').textContent = `Temperature: ${data.main.temp}°C`;
  document.getElementById('description').textContent = `Description: ${data.weather[0].description}`;
}