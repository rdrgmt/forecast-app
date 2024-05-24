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

map.on('click', function (evt) {
    console.log(evt.coordinate);
}); 