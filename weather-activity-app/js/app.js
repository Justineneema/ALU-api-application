document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const locationInput = document.getElementById('location');
    const getLocationBtn = document.getElementById('get-location');
    const searchBtn = document.getElementById('search');
    const activityTypeSelect = document.getElementById('activity-type');
    const durationSelect = document.getElementById('duration');
    const applyFiltersBtn = document.getElementById('apply-filters');
    
    const weatherDisplay = document.getElementById('weather-display');
    const activityFilters = document.getElementById('activity-filters');
    const activitiesDisplay = document.getElementById('activities-display');
    
    const weatherContainer = document.getElementById('weather-container');
    const activitiesContainer = document.getElementById('activities-container');
    
    // Event listeners
    getLocationBtn.addEventListener('click', getUserLocation);
    searchBtn.addEventListener('click', searchLocation);
    applyFiltersBtn.addEventListener('click', filterActivities);
    
    // Get user's location using geolocation API
    function getUserLocation() {
        if (navigator.geolocation) {
            getLocationBtn.textContent = 'Getting location...';
            getLocationBtn.disabled = true;
            
            navigator.geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    
                    // Get city name using coordinates
                    fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${WEATHER_API_KEY}`)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Failed to get location name');
                            }
                            return response.json();
                        })
                        .then(data => {
                            if (data && data.length > 0) {
                                locationInput.value = data[0].name;
                                searchLocation();
                            } else {
                                showError('Could not determine your location name');
                            }
                        })
                        .catch(error => {
                            showError('Error getting location: ' + error.message);
                        })
                        .finally(() => {
                            getLocationBtn.textContent = 'Use My Location';
                            getLocationBtn.disabled = false;
                        });
                },
                error => {
                    showError('Error accessing your location: ' + error.message);
                    getLocationBtn.textContent = 'Use My Location';
                    getLocationBtn.disabled = false;
                }
            );
        } else {
            showError('Geolocation is not supported by your browser');
        }
    }
    
    // Search for weather based on user's location input
    function searchLocation() {
        const location = locationInput.value.trim();
        
        if (!location) {
            showError('Please enter a location');
            return;
        }
        
        // Reset displays
        weatherDisplay.classList.add('hidden');
        activityFilters.classList.add('hidden');
        activitiesDisplay.classList.add('hidden');
        
        // Get weather data
        getWeatherData(location)
            .then(weatherData => {
                displayWeatherData(weatherData);
                weatherDisplay.classList.remove('hidden');
                
                // Get activities based on weather and location
                return getActivities(location, weatherData);
            })
            .then(activities => {
                // Store original activities for filtering
                window.allActivities = activities;
                
                displayActivities(activities);
                activityFilters.classList.remove('hidden');
                activitiesDisplay.classList.remove('hidden');
            })
            .catch(error => {
                showError('Error: ' + error.message);
            });
    }
    
    // Display weather data on the page (image removed)
    function displayWeatherData(data) {
        const { temp, description, city, humidity, wind } = data;
        
        weatherContainer.innerHTML = `
            <div class="weather-details">
                <h3>${city}</h3>
                <p class="temp">${Math.round(temp)}°C</p>
                <p class="description">${description}</p>
                <p class="humidity">Humidity: ${humidity}%</p>
                <p class="wind">Wind: ${wind} m/s</p>
            </div>
        `;
    }
    
    // Display activities (image removed)
    function displayActivities(activities) {
        if (activities.length === 0) {
            activitiesContainer.innerHTML = '<p>No activities found for this location and weather condition.</p>';
            return;
        }
        
        activitiesContainer.innerHTML = '';
        
        activities.forEach(activity => {
            const activityCard = document.createElement('div');
            activityCard.className = 'activity-card';
            
            activityCard.innerHTML = `
                <div class="activity-details">
                    <h3 class="activity-title">${activity.name}</h3>
                    <div class="activity-info">
                        <span>${activity.type}</span>
                        <span>${activity.duration}</span>
                    </div>
                    <p class="activity-description">${activity.description}</p>
                </div>
            `;
            
            activitiesContainer.appendChild(activityCard);
        });
    }
    
    // Filter activities based on user selections
    function filterActivities() {
        const type = activityTypeSelect.value;
        const duration = durationSelect.value;
        
        let filteredActivities = window.allActivities;
        
        // Filter by type
        if (type !== 'all') {
            filteredActivities = filteredActivities.filter(activity => activity.type === type);
        }
        
        // Filter by duration
        if (duration !== 'all') {
            filteredActivities = filteredActivities.filter(activity => activity.durationCategory === duration);
        }
        
        displayActivities(filteredActivities);
    }
    
    // Show error message
    function showError(message) {
        alert(message);
    }
});
