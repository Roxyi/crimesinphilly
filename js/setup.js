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
$('#finger').hide();

var cms=[];
var marker;
var flag=0;
// Initialise the draw control and pass it the FeatureGroup of editable layers


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

var CARTCSS = [
  'Map {',
'-torque-frame-count:32;',
'-torque-animation-duration:15;',
'-torque-time-attribute:"dispatch_date_time";',
'-torque-aggregation-function:"count(cartodb_id)";',
'-torque-resolution:8;',
'-torque-data-aggregation:linear;',
'}',

'#police_inct{',
  'image-filters: colorize-alpha(blue, cyan, lightgreen, yellow , orange, red);',
  'marker-file: url(http://s3.amazonaws.com/com.cartodb.assets.static/alphamarker.png);',
  'marker-fill-opacity: 0.4*[value];',
  'marker-width: 35;',
'}',
'#police_inct[frame-offset=1] {',
 'marker-width:37;',
 'marker-fill-opacity:0.2;',
'}',
'#police_inct[frame-offset=2] {',
 'marker-width:39;',
 'marker-fill-opacity:0.1;',
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
var torqueLayer;
var myVar;
var idlist=[];
// var torqueLayer = new L.TorqueLayer({
//   user: 'yixu0215',
//   cartocss: CARTOCSS
// });

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
  clearInterval(myVar);
  if(viztype == 'points' || viztype == 'census'){
    if(torqueLayer){
      map.removeLayer(torqueLayer);
      $('.cartodb-timeslider').hide();
    }
    $('#demo-controllers2').hide();
    if(viztype == 'points'){
      $('button').show();
      $('#finger').show();
      var y = 0;
      myVar = setInterval(function(){
        $('#finger').css('top',10*Math.sin(y) + 70 +"px");
        y += 0.1;
      },20);
      $('#btn1').click(function(){
        $('#finger').hide();
        clearInterval(myVar);
        $('#demo-controllers').show();
        if(flag>0){
            map.removeLayer(marker);
            flag=0;
        }
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(show);
        } else {
          alert("Geolocation is not supported by this browser.");
        }
        flag1 = 1;
        $("#demo-controllers").click(function(e){
          for(i=0;i<idlist.length;i++){
            if(idlist[i]==e.target.offsetParent.id){
              $('li#'+idlist[i]+'.list-group-item').css('color','orange');
            }else{
              $('li#'+idlist[i]+'.list-group-item').css('color','white');
            }
          }
              _.each(cms,function(cm){
                cm.closePopup();
                if(e.target.offsetParent.id == cm._leaflet_id){
                  cm.setStyle({fillColor: 'orange', radius:10});
                }
                else{
                  cm.setStyle({fillColor: 'red', radius:8});
                }
              });
            });
      });
      var point1 = $('<p style="padding:20px 20px 20px 20px;background-color:rgba(10,10,10,0.7);color:white;font-size:20px">')
      .text('The layer holds Part I crime for the City of Philadelphia from January 1, 2015 to April 12th, 2016.');
      var point2 = $('<p style="padding:0px 20px 20px 20px;background-color:rgba(10,10,10,0.7);color:white;font-size:20px">')
      .text('Part I crime includes, Homicides, Rapes, Robberies, Aggravated Assaults, Thefts. The data displayed is generalized by the crime type and the block location.');
      var point3 = $('<p style="padding:0px 20px 20px 20px;background-color:rgba(10,10,10,0.7);color:white;font-size:20px">')
      .text('Click the button "My Location" and you will see the nearest 10 crimes occurred in the current time period in the past. '+
      'For example, if the current time is 8:30 AM, the results will be all crimes occurred during 8:00 AM and 9:00 AM in the past.');
      $('#demo-controllers').append(point1).append(point2).append(point3);
      $('#legend').hide();
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
      $('#finger').hide();
      $('#demo-controllers').append(census1).append(census2);
      $('#legend').show();
      $('button').hide();
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
  else if(viztype=='heatmap'){
    var csstype;
    var type;
    $('#finger').hide();
    $('#demo-controllers2').hide();
    $('.cartodb-timeslider').show();
    var torque1 = $('<p style="padding:20px 20px 20px 20px;background-color:rgba(10,10,10,0.7);color:white;font-size:20px">')
    .text('The layer shows the animated heat map of crimes in Philly.');
    $('#demo-controllers').append(torque1);
    $('#legend').hide();
    $('button').hide();
    var currentTime = new Date();
    var hour = currentTime.getHours();
    var sqlquery = 'SELECT * FROM police_inct WHERE hours = '+hour+'';
    var layerSource = {
      type: 'torque',
      options: {
        query: sqlquery,
        user_name: 'yixu0215',
        cartocss: CARTCSS
      }
    };
    cartodb.createLayer(map, layerSource)
    .addTo(map)
    .done(function(layer) {
      torqueLayer = layer;
    })
    .error(function(err) {
      console.log("Error: " + err);
    });
  }
  else if(viztype=="about"){
    $('#finger').hide();
    $('.cartodb-timeslider').hide();
    $('#demo-controllers2').show();
    $('#legend').hide();
    $('button').hide();
    if(torqueLayer){
        map.removeLayer(torqueLayer);
    }
  }
}


$('input[name="viz"]').click(refresh);
