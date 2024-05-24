import './style.css';
import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import { Overlay } from 'ol';
import View from 'ol/View.js';
import { useGeographic } from 'ol/proj';

useGeographic();

const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-bar') as HTMLInputElement;

const container = document.getElementById('popup');
const content = document.getElementById('popup-content');

const apiKey = "933151a3a6b3745dcd99ff7f8df5c640"

const view = new View({
    //center: [0, 0],
    center: [ -53.1805017,-14.2400732 ],
    zoom: 5,
});

const layer = new TileLayer({
    source: new OSM(),
});

const overlay = new Overlay({
    element: container,
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
searchButton.addEventListener('click', (event) => {
    search(searchInput.value);
    event.preventDefault();
});

// search: fetch data from search form, then consult coordinates from API
function search(searchInput: string) {
    // fetch data from API
    const cityName = searchInput;
    const geocodingUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`

    fetch(geocodingUrl).then(response => response.json()).then(success => weather(success));
}

// weather: receive data from search, then generate weather report
function weather(success: any) {
    // pan map to location
    view.animate({
        center: [success[0].lon, success[0].lat],
        zoom: 8,
        duration: 2000,
    });

    // get weather data from API
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${success[0].lat}&lon=${success[0].lon}&appid=${apiKey}&units=metric&lang=pt_br`
    fetch(weatherUrl).then(response => response.json()).then(data => {
        
        // has data?
        if (data.length === 0) {
          console.log('No data found');
          return;
        }

        // set the popup content
        content.innerHTML = `
                            <p class="line-separator">${data.name}</p>  
                            <p align="center"><img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png"></p>
                            <p align="center">(${data.weather[0].description})</p>                      
                            <p>Máxima: ${data.main.temp_max} °C</p>
                            <p>Mínima: ${data.main.temp_min} °C</p>
                            <p>Sensação Térmica: ${data.main.feels_like} °C</p>
                            <p>Umidade: ${data.main.humidity} %</p>
                            <p>Pressão: ${data.main.pressure} hPa</p>
                            <p>Velocidade do Vento: ${data.wind.speed} m/s</p>
                            `;
                            
        overlay.setPosition([success[0].lon, success[0].lat]);
      });
    

}