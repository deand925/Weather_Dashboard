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


            todayEl.innerHTML =
                `<h3>${city} (${formatDate})</h3>
            <div class='row'>
                <div class="current-weather-element">
                    <p>${data.current.temp}&#8457</p>
                    <p>${data.current.wind_speed} MPH</p>
                    <p>${data.current.humidity} %</p>
                    <p class="p-3 mb-2 bg-success text-white">${data.current.uvi} UVI</p>
                </div>
                <div>
                    <img src= "${currentIcon}">
                </div>
            </div>`

            futureEl.innerHTML = '';

            for (let i = 0; i <= 4; i++) {
                let futureFormatDate = new Date(data.daily[i].dt * 1000).toLocaleDateString();
                futureEl.innerHTML += `
            <div class="future-weather">
                <h4>${futureFormatDate}</h4>
                <img src= "${futureIcon}">
                <p>${data.daily[i].temp.day}&#8457</p>
                <p>${data.daily[i].wind_speed} MPH</p>
                <p>${data.daily[i].humidity} %</p>
            </div>`
            }
            storeWeather(city);
        });
}

function storeWeather(city) {
    if (searchedArr.length === 5) {
        searchedArr.shift();
        pastEl.removeChild(pastEl.firstElementChild);
    };
    searchedArr.push(city);
    localStorage.setItem('searched', JSON.stringify(searchedArr));
        let pastBtnEl = document.createElement('button');
        pastBtnEl.textContent = city;
        pastEl.append(pastBtnEl);
}

function updateSearchedButtons() {
    if (localStorage.getItem('searched')) {
        localStorageData = JSON.parse(localStorage.getItem('searched'));
        searchedArr = localStorageData;
    }
    createButtons();
}
updateSearchedButtons();

function pastSearched() {
    futureEl.textContent = '';
    searchInput.value = this.classList.value;
    search();
}

function createButtons() {
    pastEl.textContent = '';
    if (searchedArr.length === 5) {
        searchedArr.shift();
        console.log(searchedArr)
    };
    for (let i = 0; i < searchedArr.length; i++) {
        if (i <= 5) {
            let pastBtnEl = document.createElement('button');
            pastBtnEl.classList.add(searchedArr[i]);
            pastBtnEl.textContent = searchedArr[i];
            pastEl.append(pastBtnEl);
            pastBtnEl.addEventListener('click', pastSearched)
        }
    }
}