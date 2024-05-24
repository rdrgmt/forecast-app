import './style.css';
import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import View from 'ol/View.js';
import { useGeographic } from 'ol/proj';

useGeographic();

const view = new View({
    //center: [0, 0],
    center: [ -53.1805017,-14.2400732 ],
    zoom: 5,
});

const layer = new TileLayer({
    source: new OSM(),
});

const map = new Map({
    target: 'map',
    layers: [layer],
    view: view,
});


// click event to check coordinates
map.on('click', function (evt) {
    console.log(evt.coordinate);
});



const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-bar') as HTMLInputElement;

const apiKey = "933151a3a6b3745dcd99ff7f8df5c640"

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
function weather(data: any) {
    // pan map to location
    view.animate({
        center: [data[0].lon, data[0].lat],
        zoom: 8,
        duration: 2000,
      });
}