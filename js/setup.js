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

$('button').hide();
$('#legend').hide();

var cms=[];
var marker;
var flag=0;
// Initialise the draw control and pass it the FeatureGroup of editable layers
$('#btn1').click(function(){
  $('#demo-controllers').show();
  if(flag>0){
      map.removeLayer(marker);
      flag=0;
  }
  navigator.geolocation.getCurrentPosition(show);
  flag1 = 1;
  $("#demo-controllers").click(function(e){
        
        _.each(cms,function(cm){
          if(e.target.offsetParent.id == cm._leaflet_id){
            cm.setStyle({fillColor: 'orange', radius:10})
          }
          else{
            cm.setStyle({fillColor: 'red', radius:8})
          };
        });
      });
});

var myIcon = L.icon({
    iconUrl: 'http://www.myiconfinder.com/uploads/iconsets/256-256-a5485b563efc4511e0cd8bd04ad0fe9e.png',
    iconRetinaUrl: 'http://www.myiconfinder.com/uploads/iconsets/256-256-a5485b563efc4511e0cd8bd04ad0fe9e.png',
    iconSize: [40, 40]
});

function show(position){
  marker = L.marker([position.coords.latitude, position.coords.longitude],{
    icon: myIcon
  }).addTo(map);
  map.setView([position.coords.latitude, position.coords.longitude-0.005],16);
  closest(position.coords.latitude,position.coords.longitude);
}


var layerUrl = 'https://yixu0215.cartodb.com/api/v2/viz/fa797b26-021e-11e6-b8d9-0ea31932ec1d/viz.json';

/** torque visualization */
var CARTOCSS = [
  'Map {',
  '-torque-frame-count:256;',
  '-torque-animation-duration:30;',
  '-torque-time-attribute:"dispatch_date_time";',
  '-torque-aggregation-function:"count(cartodb_id)";',
  '-torque-resolution:2;',
  '-torque-data-aggregation:cumulative;',
  '}',
  '#police_inct{',
  'comp-op: lighter;',
  'marker-fill-opacity: 0.9;',
  'marker-line-color: #FFF;',
  'marker-line-width: 0;',
  'marker-line-opacity: 1;',
  'marker-type: ellipse;',
  'marker-width: 5;',
  'marker-fill: #EB9B07;',
  '}',
  '#police_inct[frame-offset=1] {',
  'marker-width:8;',
  'marker-fill-opacity:0.45; ',
  '}',
  '#police_inct[frame-offset=2] {',
  'marker-width:10;',
  'marker-fill-opacity:0.225; ',
  '}'
].join('\n');

var CENSUSCSS = [
  '#census_crimes_15_16{',
  'polygon-fill: #FFFFB2;',
  'polygon-opacity: 0.8;',
  'line-color: #FFF;',
  'line-width: 0.5;',
  'line-opacity: 1;',
  '}',
  '#census_crimes_15_16 [ crimes <= 1342] {',
  'polygon-fill: #ffa500',
  '}',
  '#census_crimes_15_16 [ crimes <= 406] {',
  'polygon-fill: #ffb649',
  '}',
  '#census_crimes_15_16 [ crimes <= 292] {',
  'polygon-fill: #ffc574',
  '}',
  '#census_crimes_15_16 [ crimes <= 239] {',
  'polygon-fill: #ffd499;',
  '}',
  '#census_crimes_15_16 [ crimes <= 192] {',
  'polygon-fill: #ffe4bd;',
  '}',
  '#census_crimes_15_16 [ crimes <= 138] {',
  'polygon-fill: #fff1df;',
  '}',
  '#census_crimes_15_16 [ crimes <= 91] {',
  'polygon-fill: #ffffff;',
  '}'
].join('\n');

var POINTCSS = [
  '#police_inct{',
  'marker-fill-opacity: 0.9;',
  'marker-line-color: #FFF;',
  'marker-line-width: 1;',
  'marker-line-opacity: 0;',
  'marker-placement: point;',
  'marker-type: ellipse;',
  'marker-width: 1;',
  'marker-fill: #FF6600;',
  'marker-allow-overlap: true;',
'}'
].join('\n');

var census1 = $('<p style="padding:20px 20px 20px 20px;background-color:rgba(10,10,10,0.7);color:white;font-size:20px">')
.text('The layer shows the chorepleth map of crimes in Philly.');
var census2 = $('<p style="padding:0px 20px 20px 20px;background-color:rgba(10,10,10,0.7);color:white;font-size:20px">')
.text('You can hover a census tract to see the number of crimes.');

$('#demo-controllers').hide();
var opts;
var layerFlag = 0;
var layers;
var torqueLayer = new L.TorqueLayer({
  user: 'yixu0215',
  cartocss: CARTOCSS
});

function refresh(){
  $('#project-list').empty();
  $('#demo-controllers').empty();
  map.setView([40, -75.196],12);
  $('#demo-controllers').show();
  if(cms.length>1){
      removecm(cms);
      map.removeLayer(marker);
  }
  if(layers){
    map.removeLayer(layers);
  }
  var viztype = $('input[name="viz"]:checked').val();
  sel_layer(viztype);
}


function sel_layer(viztype){
  if(viztype == 'points' || viztype == 'census'){
    $('#demo-controllers2').hide();
    $('#time-window').hide();
    torqueLayer.stop();
    if(viztype == 'points'){
      var point1 = $('<p style="padding:20px 20px 20px 20px;background-color:rgba(10,10,10,0.7);color:white;font-size:20px">')
      .text('The layer holds Part I crime for the City of Philadelphia from January 1, 2015 to April 12th, 2016.');
      var point2 = $('<p style="padding:0px 20px 20px 20px;background-color:rgba(10,10,10,0.7);color:white;font-size:20px">')
      .text('Part I crime includes, Homicides, Rapes, Robberies, Aggravated Assaults, Thefts. The data displayed is generalized by the crime type and the block location.');
      var point3 = $('<p style="padding:0px 20px 20px 20px;background-color:rgba(10,10,10,0.7);color:white;font-size:20px">')
      .text('Click the button "My Location" and you will see the nearest 10 crimes occurred in the current time period in the past. '+
      'For example, if the current time is 8:30 AM, the results will be all crimes occurred during 8:00 AM and 9:00 AM in the past.');
      $('#demo-controllers').append(point1).append(point2).append(point3);
      $('#legend').hide();
      $('button').show();
      map.removeLayer(torqueLayer);
      opts = {
            type: 'cartodb',
            user_name: "yixu0215",
             sublayers: [{
                sql: "SELECT * FROM police_inct ", // Required
                cartocss:  POINTCSS
            }]
          };
    }else if(viztype == 'census'){
      $('#demo-controllers').append(census1).append(census2);
      $('#legend').show();
      $('button').hide();
      map.removeLayer(torqueLayer);
      opts = {
            type: 'cartodb',
            user_name: "yixu0215",
             sublayers: [{
                sql: "SELECT * FROM census_crimes_15_16 ", // Required
                cartocss:  CENSUSCSS,
                interactivity: 'crimes'
            }]
          };
    }
    cartodb.createLayer(map,opts)
      .addTo(map)
      .on('done', function(layer) {
        layers = layer;
        var sublayer = layer.getSubLayer(0);
        sublayer.setInteraction(true);
        sublayer.on("featureOver", function(e,latlng,pos,data,layerIndex){
          var census3 = $('<p style="padding:0px 20px 20px 20px;background-color:rgba(10,10,10,0.7);color:white;font-size:20px">')
          .text('Crimes: '+data.crimes+'');
          $('#demo-controllers').empty();
          $('#demo-controllers').append(census1).append(census2).append(census3);

        });
      });
  }
  else if(viztype=='torque'){
    $('#demo-controllers2').hide();
    var torque1 = $('<p style="padding:20px 20px 20px 20px;background-color:rgba(10,10,10,0.7);color:white;font-size:20px">')
    .text('The layer shows the timeline map of crimes in Philly.');
    $('#demo-controllers').append(torque1);
    $('#legend').hide();
    $('button').hide();
    $('#time-window').show();
    torqueLayer.addTo(map);
    var currentTime = new Date();
    var hour = currentTime.getHours();
    var sql = 'SELECT * FROM police_inct WHERE hours = '+hour+'';
    torqueLayer.setSQL(sql);
    torqueLayer.on('change:time', function(d) {
      if(d.time.toString().length>12){
        $('#time-window').empty();
        $('#time-window').append($('<h1 style="color:white">').text(d.time.toString().split(" ")[1]+" "+d.time.toString().split(" ")[2]+" "+d.time.toString().split(" ")[3]));
      }
    });
    torqueLayer.play();
  }
  else if(viztype=="about"){
    $('#demo-controllers2').show();
    $('#legend').hide();
    $('button').hide();
    $('#time-window').hide();
    map.removeLayer(torqueLayer);
  }
}

$('input[name="viz"]').click(refresh);
