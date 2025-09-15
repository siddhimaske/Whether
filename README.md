# Weather Dashboard Project

## Overview
This is a simple Weather Dashboard application built with Node.js (Express) backend and a frontend using HTML, CSS, and JavaScript. It fetches real-time weather data from the OpenWeatherMap API and displays current weather and a 5-day forecast for a searched city.

## Prerequisites
- Node.js installed on your machine
- An OpenWeatherMap API key (you can get one for free at https://openweathermap.org/api)

## Setup Instructions

1. Clone or download the project files.

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following content:
```
OPENWEATHER_API_KEY=your_openweathermap_api_key_here
```
Replace `your_openweathermap_api_key_here` with your actual API key.

4. Start the server:
```bash
npm start
```

5. Open your browser and navigate to:
```
http://localhost:3000
```

## Usage
- Enter a city name in the search bar and click "Search".
- The dashboard will display the current weather and a 5-day forecast.
- If the city is invalid or there is an error fetching data, an error message will be shown.

## Troubleshooting
- Ensure your API key is valid and correctly set in the `.env` file.
- Check the terminal for any server errors.
- Check the browser console for frontend errors.

## License
This project is open source and free to use.
