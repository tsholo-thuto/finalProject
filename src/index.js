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
  let cityElement = document.querySelector("#current-city");
  cityElement.innerHTML = searchInputElement.value;

  searchCity(searchInputElement.value);
}

function searchCity(city) {
  let apiKey = "c76e84a34d2fca033b21179686d96ed9";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  axios
    .get(apiUrl)
    .then(displayWeather)
    .catch((error) => {
      alert("City not found. Please try again.");
      console.error(error);
    });
}

function displayWeather(response) {
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
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", search);

let currentDateElement = document.querySelector("#current-date");
let currentDate = new Date();
currentDateElement.innerHTML = formatDate(currentDate);

searchCity("Paris");
