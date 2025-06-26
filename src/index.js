function formatDate(date) {
  let minutes = date.getMinutes();
  let hours = date.getHours();
  let day = date.getDay();

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  if (hours < 10) {
    hours = `0${hours}`;
  }

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let formattedDay = days[day];
  return `${formattedDay} ${hours}:${minutes}`;
}

function search(event) {
  event.preventDefault();
  let searchInputElement = document.querySelector("#search-input");
  
  searchCity(searchInputElement.value);
}

function searchCity(city) {
  let apiKey = "c76e84a34d2fca033b21179686d96ed9";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  axios
    .get(apiUrl)
    .then(displayWeather)
    
    .catch(() => {

    })
}

function getForecast(coordinates, currentTemp) {
  let apiKey = "c76e84a34d2fca033b21179686d96ed9";
  let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(response => displayForecast(response, currentTemp));
}

function displayForecast(response, currentTemp) {
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = "";

  let dailyTemps = {};

  response.data.list.forEach(forecast => {
    let date = new Date(forecast.dt * 1000);
    let day = date.toLocaleDateString("en-US", { weekday: "short" });

    if (!dailyTemps[day]) {
      dailyTemps[day] = {
        temps: [],
        icons: [],
      };
    }

    dailyTemps[day].temps.push(forecast.main.temp_min, forecast.main.temp_max);
    dailyTemps[day].icons.push(forecast.weather[0].icon);
  });

  let orderedDays = Object.keys(dailyTemps).slice(0, 5);

  forecastHTML += `<div class="forecast-row">`;

  orderedDays.forEach((day, index) => {
    let temps = dailyTemps[day].temps;
    let max = Math.round(Math.max(...temps));
    let min = Math.round(Math.min(...temps));
    let icon = dailyTemps[day].icons[0];
    let iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    if (index === 0) {
      if (currentTemp > max) max = currentTemp;
      if (currentTemp < min) min = currentTemp;
    }

    forecastHTML += `
      <div class="forecast-day">
        <div class="forecast-day-name">${day}</div>
        <img src="${iconUrl}" alt="" width="50" />
        <div class="forecast-temp">
          <strong>${max}°</strong> / ${min}°
        </div>
      </div>
    `;
  });

  forecastHTML += `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function displayWeather(response) {
  let cityElement = document.querySelector("#current-city");
  cityElement.innerHTML = response.data.name;
  let temperature = Math.round(response.data.main.temp);
  let condition = response.data.weather[0].description;
  let humidity = response.data.main.humidity;
  let wind = response.data.wind.speed;
  let icon = response.data.weather[0].icon;
  let iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  let temperatureElement = document.querySelector(".current-temperature-value");
  let conditionElemrnt = document.querySelector("#weather-condition");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let iconElement = document.querySelector(".current-temperature-icon");

  temperatureElement.innerHTML = temperature;
  conditionElemrnt.innerHTML = condition;
  humidityElement.innerHTML = humidity;
  windElement.innerHTML = wind;
  iconElement.innerHTML = `<img src="${iconUrl}" alt="${condition}" width="80" />`;
  let currentTemp = Math.round(response.data.main.temp);
  getForecast(response.data.coord, currentTemp);
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", search);

let currentDateElement = document.querySelector("#current-date");
let currentDate = new Date();
currentDateElement.innerHTML = formatDate(currentDate);

searchCity("Paris");
