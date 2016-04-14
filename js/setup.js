// Leaflet map setup
var map = L.map('map', {
  zoomControl: false,
  center: [40, -75.196],
  zoom: 12
});
new L.Control.Zoom({ position: 'topright' }).addTo(map);

var layer = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',{
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
}).addTo(map);

var marker;
var flag=0;
// Initialise the draw control and pass it the FeatureGroup of editable layers
$('#button1').click(function(){
  if(flag>0){
      map.removeLayer(marker);
      flag=0;
  }
  navigator.geolocation.getCurrentPosition(show);
  flag1 = 1;
});

var myIcon = L.icon({
    iconUrl: 'http://www.myiconfinder.com/uploads/iconsets/256-256-a5485b563efc4511e0cd8bd04ad0fe9e.png',
    iconRetinaUrl: 'http://www.myiconfinder.com/uploads/iconsets/256-256-a5485b563efc4511e0cd8bd04ad0fe9e.png',
    iconSize: [45, 45]
});

function show(position){
  marker = L.marker([position.coords.latitude, position.coords.longitude],{
    icon: myIcon,
    draggable:true
  }).addTo(map);
  map.setView([position.coords.latitude, position.coords.longitude-0.005],16);
  closest(position.coords.latitude,position.coords.longitude);
  marker.on('drag',function(event){
    closest(marker._latlng.lat,marker._latlng.lng);
  });
}

var layerUrl = 'https://yixu0215.cartodb.com/api/v2/viz/fa797b26-021e-11e6-b8d9-0ea31932ec1d/viz.json';

// Use of CartoDB.js
cartodb.createLayer(map, layerUrl)
  .addTo(map)
  .on('done', function(layer) {
    // layer is a cartodb.js Layer object - can call getSubLayer on it!
    // console.log(layer);
    layer.on('featureClick', function(e, latlng, pos, data) {
      // nClosest(latlng[0], latlng[1], 10);
      // console.log(e, latlng, pos, data);
    });
  }).on('error', function(err) {
    //console.log(err):
  });
