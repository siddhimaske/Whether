require('dotenv').config();
const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.OPENWEATHER_API_KEY;

if (!API_KEY) {
  console.error('ERROR: OPENWEATHER_API_KEY is not set in .env file');
  process.exit(1);
}

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/weather', async (req, res) => {
  const city = req.query.city;
  if (!city) {
    return res.status(400).json({ error: 'City parameter is required' });
  }

  try {
    // Fetch current weather
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
    );
    if (!weatherResponse.ok) {
      return res.status(weatherResponse.status).json({ error: 'City not found or API error' });
    }
    const weatherData = await weatherResponse.json();

    // Fetch 5-day forecast
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
    );
    if (!forecastResponse.ok) {
      return res.status(forecastResponse.status).json({ error: 'Forecast data not found or API error' });
    }
    const forecastData = await forecastResponse.json();

    // Fetch UV index (using lat/lon from current weather)
    const { lat, lon } = weatherData.coord;
    const uvResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );
    let uvData = null;
    if (uvResponse.ok) {
      uvData = await uvResponse.json();
    }

    res.json({
      current: weatherData,
      forecast: forecastData,
      uv: uvData,
    });
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
