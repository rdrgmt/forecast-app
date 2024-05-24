import './style.css';
import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import { Overlay } from 'ol';
import View from 'ol/View.js';
import { useGeographic } from 'ol/proj';
import * as consts from './utils/constants';

useGeographic();

const view = new View({
    //center: [0, 0],
    center: [ -53.1805017,-14.2400732 ],
    zoom: 5,
});

const layer = new TileLayer({
    source: new OSM(),
});

const overlay = new Overlay({
    element: consts.container,
    autoPan: {
      animation: {
        duration: 250,
      },
    },
  });

const map = new Map({
    target: 'map',
    layers: [layer],
    overlays : [overlay],
    view: view,
});

// click event to check coordinates
map.on('click', function (evt) {
    console.log(evt.coordinate);
});


// handle button click event
consts.searchButton.addEventListener('click', (event) => {
    search(consts.searchInput.value);
    event.preventDefault();
});

// search: fetch data from search form, then consult coordinates from API
async function search(searchInput: string) {
    // build url
    const geocodingUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${searchInput}&limit=1&appid=${consts.apiKey}`

    // has cached data?
    const response = await consts.searchCache.match(geocodingUrl);
    if (response) {
        response.json().then(success => {
            // call weather function
            weather(success);
        });    
    } else {
        // fetch data from api
        fetch(geocodingUrl).then(response => response.json()).then(success => {
            // store content in cache
            consts.searchCache.add(geocodingUrl);

            // call weather function
            weather(success);
        });
    }

    return;
}

function panMapToLocation(lon: number, lat: number) {
    view.animate({
        center: [lon, lat],
        zoom: 8,
        duration: 2000,
    });
}

// weather: fetch data from coordinates, then show weather information
async function weather(query: any) {
    // pan map to location
    panMapToLocation(query[0].lon, query[0].lat);

    // build url
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${query[0].lat}&lon=${query[0].lon}&appid=${consts.apiKey}&units=metric&lang=pt_br`

    // has cached data?
    const response = await consts.weatherCache.match(weatherUrl);
    if (response) {
        response.json().then(success => {
            // call popup function
            buildWeatherPopup(query, success);
        });
    } else {
        // fetch data
        fetch(weatherUrl).then(response => response.json()).then(success => {
            // store content in cache
            consts.weatherCache.add(weatherUrl);

            // call popup function
            buildWeatherPopup(query, success);
        });
    }

    return;
}

function buildWeatherPopup(desc: any, data: any) {
    consts.content.innerHTML = `
        <p align="center" class="line-separator">${desc[0].name}, ${desc[0].state}, ${desc[0].country}</p>
        <p align="center"><img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png"></p>
        <p align="center">(${data.weather[0].description})</p>                      
        <p>Máxima: ${data.main.temp_max} °C</p>
        <p>Mínima: ${data.main.temp_min} °C</p>
        <p>Sensação Térmica: ${data.main.feels_like} °C</p>
        <p>Umidade: ${data.main.humidity} %</p>
        <p>Pressão: ${data.main.pressure} hPa</p>
        <p>Velocidade do Vento: ${data.wind.speed} m/s</p>
    `;

    overlay.setPosition([data.coord.lon, data.coord.lat]);
}
