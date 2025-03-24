// adding API from open weather
const WEATHER_API_KEY = '91d7dccb6ca5fede6ed97b0b0c2f570d';

// Get weather data for a location 
async function getWeatherData(location) {
    try {
        // Get coordinates for the location by using given API
        const geoResponse = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${WEATHER_API_KEY}`);
        
        if (!geoResponse.ok) {
            throw new Error('Could not find location');
        }
        
        const geoData = await geoResponse.json();
        
        if (!geoData || geoData.length === 0) {
            throw new Error('Location not found');
        }
        
        const { lat, lon, name } = geoData[0];
        
        // Get current weather data of the place entered
        const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`);
        
        if (!weatherResponse.ok) {
            throw new Error('Could not fetch weather data');
        }
        
        const weatherData = await weatherResponse.json();
        
        // Extract relevant weather information due to the actual information
        return {
            city: name,
            temp: weatherData.main.temp,
            description: weatherData.weather[0].description,
            icon: weatherData.weather[0].icon,
            condition: weatherData.weather[0].main,
            humidity: weatherData.main.humidity,
            wind: weatherData.wind.speed,
            lat,
            lon
        };
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }
}
