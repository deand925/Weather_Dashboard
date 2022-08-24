const searchBtn = document.querySelector('#search-btn');
const searchInput = document.querySelector('#city');
const todayEl = document.querySelector('#current-weather');
const futureEl = document.querySelector('#future-weather');
let pastEl = document.querySelector('#past-searches')
let searchedArr = [];
const apiKey = 'c4efde1256af8c7718fe0b08e34be0c1';

searchBtn.addEventListener('click', search)
function search() {
    const cityUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${searchInput.value}&limit=5&appid=${apiKey}`;
    fetch(cityUrl)
        .then(res => res.json())
        .then(data => {
            getWeather(data[0].lat, data[0].lon, data[0].name)
        });
}

function getWeather(lat, lon, city) {
    const currentApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
    fetch(currentApi)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            const formatDate = new Date(data.current.dt * 1000).toDateString()

            let currentIcon = `http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`;
            let futureIcon = `http://openweathermap.org/img/wn/${data.daily[0].weather[0].icon}@2x.png`;

