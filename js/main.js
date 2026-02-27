// main.js

// Inisialisasi peta
const map = L.map('map').setView([-2.5, 121.5], 6);

// Peta dasar OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
maxZoom: 19,
attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Style layer
const styleIUP = { color: 'red', weight: 2, fillOpacity: 0.2 };
const styleLaterit = { color: 'orange', weight: 1, fillOpacity: 0.3 };

// Layer control
const overlays = {};
const controlLayers = L.control.layers(null, overlays).addTo(map);

// Fungsi load GeoJSON
function loadGeoJSON(url, style, layerName) {
fetch(url)
.then(res => res.json())
.then(data => {
const layer = L.geoJSON(data, {
style: style,
onEachFeature: (feature, layer) => {
if (feature.properties) {
let popupContent = `<b>${layerName}</b><br>`;
for (const key in feature.properties) {
popupContent += `<b>${key}</b>: ${feature.properties[key]}<br>`;
}
layer.bindPopup(popupContent);
}
}
}).addTo(map);

overlays[layerName] = layer;
controlLayers.addOverlay(layer, layerName);

const bounds = layer.getBounds();
if (bounds.isValid()) map.fitBounds(bounds);
})
.catch(err => console.error(`Error loading ${layerName}:`, err));
}

// Load layer
loadGeoJSON('IUP.geojson', styleIUP, 'IUP');
loadGeoJSON('laterit.geojson', styleLaterit, 'Laterit');

// Tambahkan legenda
const legend = L.control({ position: 'bottomleft' });
legend.onAdd = function () {
const div = L.DomUtil.create('div', 'legend');
div.innerHTML = `
<h4>Legenda</h4>
<i style="background:red"></i> IUP<br>
<i style="background:orange"></i> Laterit<br>
`;
return div;
};
legend.addTo(map);