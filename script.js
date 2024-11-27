class WeatherApp {
    constructor() {
        this.cityInput = document.getElementById('cityInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.forecastContainer = document.getElementById('forecastContainer');

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.searchBtn.addEventListener('click', () => this.fetchWeatherData());
        this.cityInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') this.fetchWeatherData();
        });
    }

    fetchWeatherData() {
        const city = this.cityInput.value.trim();
        if (!city) {
            alert('Please enter a city name');
            return;
        }

        this.forecastContainer.innerHTML = '';
        this.fetchCurrentWeather(city);
        this.fetchForecast(city);
    }

    fetchCurrentWeather(city) {
        const API_KEY = 'f39ea5c0ff141f1f03859bf91129e9d4';
        const xhr = new XMLHttpRequest();
        xhr.open(
            'GET',
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`,
            true
        );

        xhr.onload = () => {
            if (xhr.status === 200) {
                const data = JSON.parse(xhr.responseText);
                console.log('Current weather data:', data);
                this.renderCurrentWeather(data);
            } else {
                alert('Błąd w przechwytywaniu pogody');
            }
        };

        xhr.onerror = () => {
            alert('Request się nie powiódł.');
        };

        xhr.send();
    }

    fetchForecast(city) {
        const API_KEY = 'f39ea5c0ff141f1f03859bf91129e9d4';
        fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
        )
            .then((response) => {
                console.log('Odpowiedź: ', response);
                return response.json();
            })
            .then((data) => {
                console.log('Dane prognozy: ', data);
                this.renderForecast(data);
            })
            .catch((error) => {
                console.error('Błąd w pobieraniu pogody:', error);
                alert('Brak powodzenia w pobieraniu prognozy');
            });
    }


    renderCurrentWeather(data) {
        const currentWeatherHTML = `
            <div class="day-forecast current-weather">
                <h2>Current Weather in ${data.name}, ${data.sys.country}</h2>
                <div class="hour-card">
                    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].description}">
                    <h3>${data.weather[0].description}</h3>
                    <div class="hour-details">
                        <div class="detail">
                            <i class="fas fa-thermometer-half"></i>
                            <span>Temp: ${data.main.temp.toFixed(1)}°C</span>
                        </div>
                        <div class="detail">
                            <i class="fas fa-temperature-low"></i>
                            <span>Feels: ${data.main.feels_like.toFixed(1)}°C</span>
                        </div>
                        <div class="detail">
                            <i class="fas fa-tint"></i>
                            <span>Humidity: ${data.main.humidity}%</span>
                        </div>
                        <div class="detail">
                            <i class="fas fa-wind"></i>
                            <span>Wind: ${data.wind.speed.toFixed(1)} m/s</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        this.forecastContainer.innerHTML += currentWeatherHTML;
    }

    renderForecast(data) {
        const forecastByDay = this.groupForecastByDay(data.list);
        let forecastHTML = '<h2>5-Day Forecast</h2>';

        Object.entries(forecastByDay).forEach(([date, forecasts]) => {
            forecastHTML += this.createDayForecastHTML(date, forecasts);
        });

        this.forecastContainer.innerHTML += forecastHTML;
    }

    groupForecastByDay(forecasts) {
        return forecasts.reduce((acc, forecast) => {
            const date = new Date(forecast.dt * 1000).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
            if (!acc[date]) acc[date] = [];
            acc[date].push(forecast);
            return acc;
        }, {});
    }

    createDayForecastHTML(date, forecasts) {
        let hourlyForecastHTML = '';
        forecasts.forEach((forecast) => {
            hourlyForecastHTML += this.createHourCard(forecast);
        });

        return `
            <div class="day-forecast">
                <h3 class="forecast-date">${date}</h3>
                <div class="hour-slider">
                    ${hourlyForecastHTML}
                </div>
            </div>
        `;
    }

    createHourCard(forecast) {
        const time = new Date(forecast.dt * 1000).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });

        const iconUrl = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`;

        return `
        <div class="hour-card">
            <h3>${time}</h3>
            <img src="${iconUrl}" alt="${forecast.weather[0].description}">
            <div class="hour-details">
                <div class="detail">
                    <i class="fas fa-thermometer-half"></i>
                    <span>Temp: ${forecast.main.temp.toFixed(1)}°C</span>
                </div>
                <div class="detail">
                    <i class="fas fa-temperature-low"></i>
                    <span>Feels: ${forecast.main.feels_like.toFixed(1)}°C</span>
                </div>
                <div class="detail">
                    <i class="fas fa-tint"></i>
                    <span>Humidity: ${forecast.main.humidity}%</span>
                </div>
                <div class="detail">
                    <i class="fas fa-wind"></i>
                    <span>Wind: ${forecast.wind.speed.toFixed(1)} m/s</span>
                </div>
            </div>
            <p>${forecast.weather[0].description}</p>
        </div>
    `;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new WeatherApp();
});
