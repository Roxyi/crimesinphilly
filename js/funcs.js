function closest(lat,lng) {
  // Grab the southwest and northeast points in this rectangle
  var currentTime = new Date();
  var hour = currentTime.getHours();
  var sql = 'SELECT * FROM police_inct WHERE hours = '+hour+' ORDER BY the_geom <-> ST_Point(' + lng + ',' + lat + ') LIMIT 10';


  $.ajax('https://yixu0215.cartodb.com/api/v2/sql/?q=' + sql).done(function(results) {
    addRecords(results);
    _.each(results.rows, function(properties){
      var cm = L.circleMarker([properties.point_y,properties.point_x],
        {
          stroke: false,
          fillColor: "red",
          fillOpacity: 1
        }).setRadius(8).addTo(map);
        console.log(cm._latlng);
    });
  });
}

function addOneRecord(rec) {
  var title = $('<p></p>')
    .text('Crime Type: ' + rec.text_general_code);

  var location = $('<p></p>')
    .text('Location: ' + rec.location_block);

  var time = $('<p></p>')
    .text('Time: ' + rec.dispatch_date_time);


  var recordElement = $('<li style="background-color:rgba(0,0,0,0);color:white"></li>')
    .addClass('list-group-item')
    .append(title)
    .append(location)
    .append(time);

  $('#project-list').append(recordElement);
}

/** Given a cartoDB resultset of records, add them to our list */
function addRecords(cartodbResults) {
  $('#project-list').empty();
  _.each(cartodbResults.rows, addOneRecord);
}
