// addding API of google maps
const PLACES_API_KEY = process.env.PLACES_API_KEY;

// Activity categories based on weather
const ACTIVITY_RECOMMENDATIONS = {
    'Clear': { outdoor: ['park', 'hiking', 'beach', 'outdoor dining', 'cycling'], indoor: ['museum', 'cafe', 'shopping mall', 'restaurant', 'library'] },
    'Clouds': { outdoor: ['park', 'walking tour', 'botanical garden', 'outdoor dining'], indoor: ['museum', 'cafe', 'shopping mall', 'cinema', 'restaurant', 'library'] },
    'Rain': { outdoor: ['covered market'], indoor: ['museum', 'cafe', 'shopping mall', 'cinema', 'restaurant', 'library', 'indoor activity', 'bowling'] },
    'default': { outdoor: ['park'], indoor: ['museum', 'cafe', 'restaurant'] }
};

// Activity descriptions based of weather condition of a place
const ACTIVITY_DESCRIPTIONS = {
    'park': 'Enjoy the outdoors with beautiful landscapes and walking paths.',
    'hiking': 'Explore nature trails with scenic views.',
    'beach': 'Relax by the shore, swim, or participate in water activities.',
    'outdoor dining': 'Experience local cuisine in an open-air setting.',
    'cycling': 'Bike through scenic routes and explore the area.',
    'museum': 'Discover art, history, and culture through exhibits.',
    'cafe': 'Relax with a warm drink and a snack in a cozy environment.',
    'shopping mall': 'Browse through stores for shopping and entertainment.',
    'restaurant': 'Savor local and international cuisine.',
    'library': 'Spend time reading or studying in a quiet environment.',
    'walking tour': 'Discover landmarks and history through guided walks.',
    'botanical garden': 'Explore diverse plants and beautifully landscaped gardens.',
    'cinema': 'Watch movies in a comfortable theater.',
    'covered market': 'Explore local products, crafts, and foods in a sheltered market.',
    'indoor activity': 'Enjoy various recreational activities indoors.',
    'bowling': 'Have fun bowling with friends or family.'
};

// Get recommended activities based on location and weather of the user
async function getActivities(location, weatherData) {
    try {
        const { condition, lat, lon } = weatherData;
        const { outdoor, indoor } = ACTIVITY_RECOMMENDATIONS[condition] || ACTIVITY_RECOMMENDATIONS['default'];
        const activities = shuffleArray(condition === 'Clear' || condition === 'Clouds' ? [...outdoor, ...indoor] : [...indoor, ...outdoor]).slice(0, 5);

        // Fetch places for selected activities 
        return activities.map(keyword => ({
            name: `${capitalize(keyword)} in ${location}`,
            type: outdoor.includes(keyword) ? 'outdoor' : 'indoor',
            description: ACTIVITY_DESCRIPTIONS[keyword] || `Enjoy ${keyword} activities in ${location}.`,
        }));
    } catch (error) {
        console.error('Error fetching activities:', error);
        throw error;
    }
}

// utilising the functions to be used 
const shuffleArray = arr => arr.sort(() => Math.random() - 0.5);
const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);
