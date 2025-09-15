document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('search-form');
  const cityInput = document.getElementById('city-input');
  const loading = document.getElementById('loading');
  const errorDiv = document.getElementById('error');
  const weatherContainer = document.getElementById('weather-container');
  const currentDetails = document.getElementById('current-details');
  const forecastCards = document.getElementById('forecast-cards');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (!city) return;

    clearUI();
    showLoading(true);

    try {
      const data = await fetchWeather(city);
      showLoading(false);
      if (data.error) {
        showError(data.error);
      } else {
        displayCurrentWeather(data.current, data.uv);
        displayForecast(data.forecast);
        weatherContainer.classList.remove('hidden');
      }
    } catch (err) {
      showLoading(false);
      showError('Failed to fetch weather data. Please try again later.');
      console.error(err);
    }
  });

  function clearUI() {
    errorDiv.classList.add('hidden');
    errorDiv.textContent = '';
    weatherContainer.classList.add('hidden');
    currentDetails.innerHTML = '';
    forecastCards.innerHTML = '';
  }

  function showLoading(show) {
    if (show) {
      loading.classList.remove('hidden');
    } else {
      loading.classList.add('hidden');
    }
  }

  function showError(message) {
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
  }

  async function fetchWeather(city) {
    const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
    return response.json();
  }

  function displayCurrentWeather(current, uv) {
    const iconUrl = `https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`;
    const uvIndex = uv ? uv.value : 'N/A';

    currentDetails.innerHTML = `
      <div class="weather-item">
        <img src="${iconUrl}" alt="${current.weather[0].description}" />
        <div>${current.weather[0].main}</div>
      </div>
      <div class="weather-item">
        <strong>Temperature:</strong> ${current.main.temp} °C
      </div>
      <div class="weather-item">
        <strong>Humidity:</strong> ${current.main.humidity}%
      </div>
      <div class="weather-item">
        <strong>Wind Speed:</strong> ${current.wind.speed} m/s
      </div>
      <div class="weather-item">
        <strong>UV Index:</strong> ${uvIndex}
      </div>
    `;
  }

  function displayForecast(forecast) {
    // OpenWeatherMap forecast is every 3 hours; pick one forecast per day (e.g., 12:00)
    const dailyForecasts = forecast.list.filter(item => item.dt_txt.includes('12:00:00')).slice(0, 5);

    dailyForecasts.forEach(day => {
      const date = new Date(day.dt_txt);
      const options = { weekday: 'short', month: 'short', day: 'numeric' };
      const dateString = date.toLocaleDateString(undefined, options);
      const iconUrl = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;

      const card = document.createElement('div');
      card.className = 'forecast-card';
      card.innerHTML = `
        <h3>${dateString}</h3>
        <img src="${iconUrl}" alt="${day.weather[0].description}" />
        <div><strong>Temp:</strong> ${day.main.temp} °C</div>
        <div><strong>Humidity:</strong> ${day.main.humidity}%</div>
      `;
      forecastCards.appendChild(card);
    });
  }
});
