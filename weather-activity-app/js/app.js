document.addEventListener('DOMContentLoaded', () => {
    // elements to be using in project so far
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
    
    // Event listeners added so that the scriptcould read them 
    getLocationBtn.addEventListener('click', getUserLocation);
    searchBtn.addEventListener('click', searchLocation);
    applyFiltersBtn.addEventListener('click', filterActivities);
    
    // Get user's location using geolocation API to know the exact place of the user or the place entered
    function getUserLocation() {
        if (navigator.geolocation) {
            getLocationBtn.textContent = 'Getting location...';
            getLocationBtn.disabled = true;
            
            navigator.geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    
                    // Getting city name using coordinates given by openweather apis
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
    
    // Search for weather based on user's location input to make everthing clear to them
    function searchLocation() {
        const location = locationInput.value.trim();
        
        if (!location) {
            showError('Please enter a location');
            return;
        }
        
        // Displaying resets for user interactiity
        weatherDisplay.classList.add('hidden');
        activityFilters.classList.add('hidden');
        activitiesDisplay.classList.add('hidden');
        
        // Get weather data from openweather apis
        getWeatherData(location)
            .then(weatherData => {
                displayWeatherData(weatherData);
                weatherDisplay.classList.remove('hidden');
                
                // Get activities based on weather and location based on user inputs
                return getActivities(location, weatherData);
            })
            .then(activities => {
                // Store original activities for filtering to allow acting redo
                window.allActivities = activities;
                
                displayActivities(activities);
                activityFilters.classList.remove('hidden');
                activitiesDisplay.classList.remove('hidden');
            })
            .catch(error => {
                showError('Error: ' + error.message);
            });
    }
    
    // Display weather data on the page
    function displayWeatherData(data) {
        const { temp, description, icon, city, humidity, wind } = data;
        
        weatherContainer.innerHTML = `
            <img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}" class="weather-icon">
            <div class="weather-details">
                <h3>${city}</h3>
                <p class="temp">${Math.round(temp)}°C</p>
                <p class="description">${description}</p>
                <p class="humidity">Humidity: ${humidity}%</p>
                <p class="wind">Wind: ${wind} m/s</p>
            </div>
        `;
    }
    
    // Display activities to be done based on weather
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
                <img src="${activity.image || '/api/placeholder/300/150'}" alt="${activity.name}" class="activity-image">
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
        
        // Filter by type based on user selection
        if (type !== 'all') {
            filteredActivities = filteredActivities.filter(activity => activity.type === type);
        }
        
        // Filter by duration
        if (duration !== 'all') {
            filteredActivities = filteredActivities.filter(activity => activity.durationCategory === duration);
        }
        
        displayActivities(filteredActivities);
    }
    
    // Show error message in case of wrong output
    function showError(message) {
        alert(message);
    }
});
