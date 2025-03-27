#### Weather-Based Activity Recommender 

## Overview
My Weather-Based Activity Recommender system presents up-to-date weather information for cities users specify. The application retrieves weather updates from OpenWeatherMap API and shows essential weather information along with current temperature, humidity, wind strength, actual weather conditions plus matching visual indicators. my main objective was to develop an interface that users can easily access and which reacts promptly to device movements.

## Features

The application shows weather facts today for any city you choose.
Our system delivers motion plans that match your preferred weather conditions at present timing.
Check activities through both indoor and outdoor categories plus specific time limits
- User-friendly interface with responsive design
The app detects and responds to problems when the API system fails or returns invalid data

## Technologies Used
- Frontend: HTML, CSS, JavaScript
- API: OpenWeatherMap API
- Deployment: Web Server 1 & Web Server 2
- The Nginx software helps direct traffic equally between our two web servers.

## Directory structure
weather-activity-app
├── index.html          
├── css
│   └── styles.css      
├── js
│   ├── app.js          
│   ├── weather.js      
│   └── activities.js   
├── .env                
└── README.md           

## Deployment Details
I launched my application across two web servers named Web Server 1 and Web Server 2 while creating Nginx as the traffic manager between them. This setup ensures:

Each incoming request should go to any available web server to keep one server from getting too busy
-High availability and better performance
Our system keeps working with all traffic despite one server being unavailable.

## How to Use
1. Start using the application through your internet browser.
2. Enter city or provide your location and search using the input box
3. Press the search button to retrieve the weather data.
4. Your web application shows current weather details plus recommended activities based on weather conditions 

## Setup & Installation
1. Clone the repository:
git clone https://github.com/Justineneema/ALU-api-application.git

2. Move to the directory where the ALU-api-application project files are located.
cd web-activity-app
Open index.html from any browser to view the application on your computer.

3. API Configuration
You need an OpenWeatherMap API key to start the process and place it in the JavaScript file.

const config = {
    apiUrl: "https://api.openweathermap.org/data/2.5/weather",
    apiKey: "YOUR_API_KEY"
};

4. You can access the application through the URL http://localhost:5000.
`
## Challenges Faced

- API Key Security: Ensuring that API keys aren't exposed in the client-side code was a challenge. I chose to use environment variables and server-side proxy routes to make API calls securely.
- Error Handling: Developing robust error handling for API failures and invalid user inputs required careful planning.
- Load Balancer Setup: Configuring the load balancer to correctly distribute traffic while maintaining session consistency took some experimentation.

## Future Improvements

- Add more detailed activity information
- Implement caching to reduce API calls
- Add user authentication for personalized recommendations
- Enhance the UI with more weather details and activity images
- Implement progressive web app features for offline functionality

## Credits

- Weather data provided by [OpenWeatherMap](https://openweathermap.org/)
- Activity data powered by [Google Places API](https://developers.google.com/maps/documentation/places/web-service/overview)
- Weather icons from [OpenWeatherMap](https://openweathermap.org/weather-conditions)
-justineneema: For developing and deploying the application.

## licence 
MIT License