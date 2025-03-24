async function getWeather() {
    const city = document.getElementById('city').value;
    if (!city) {
        alert('Please enter a city name.');
        return;
    }

    const response = await fetch(`http://localhost:5000/weather?city=${city}`);
    const data = await response.json();

    if (data.error) {
        document.getElementById('weatherResult').innerHTML = `<p>Error: ${data.error}</p>`;
    } else {
        document.getElementById('weatherResult').innerHTML = `
            <h2>${data.name}, ${data.sys.country}</h2>
            <p>Temperature: ${data.main.temp}°C</p>
            <p>Weather: ${data.weather[0].description}</p>
        `;
    }
}
