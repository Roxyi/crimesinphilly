function closest(lat,lng) {
  // Grab the southwest and northeast points in this rectangle
  var currentTime = new Date();
  var hour = currentTime.getHours();
  var sql = 'SELECT * FROM police_inct WHERE hours = '+hour+' ORDER BY the_geom <-> ST_SetSRID(ST_MakePoint('+lng+','+lat+'),4326) LIMIT 10';


  $.ajax('https://yixu0215.cartodb.com/api/v2/sql/?q=' + sql).done(function(results) {
    $('button').hide();
    $('#demo-controllers').empty();
    _.each(results.rows, function(properties){
      var list = "<dl><dt>Crime Type</dt>"+
      "<dd>" + properties.text_general_code + "</dd>" +
      "<dt>Location</dt>" +
      "<dd>" + properties.location_block + "</dd>" +
      "<dt>Time</dt>" +
      "<dd>" + properties.dispatch_date_time + "</dd>";
      cm = L.circleMarker([properties.point_y,properties.point_x],
        {
          stroke: false,
          fillColor: "red",
          fillOpacity: 1
        }).setRadius(8).bindPopup(list).addTo(map);
      cms.push(cm);
      addOneRecord(properties,cm);
      cm.on('click',function(e){
        for(i=0;i<idlist.length;i++){
          if(idlist[i]==e.target._leaflet_id){
            $('li#'+idlist[i]+'.list-group-item').css('color','orange');
          }else{
            $('li#'+idlist[i]+'.list-group-item').css('color','white');
          }
        }
        _.each(cms,function(cm){
          if(e.target._leaflet_id == cm._leaflet_id){
            cm.setStyle({fillColor: 'orange', radius:10});
          }
          else{
            cm.setStyle({fillColor: 'red', radius:8});
          }
        });
      });
    });
  });
}


function addOneRecord(rec,cm) {
  var title = $('<p></p>')
    .text('Crime Type: ' + rec.text_general_code);

  var location = $('<p></p>')
    .text('Location: ' + rec.location_block);

  var time = $('<p></p>')
    .text('Time: ' + rec.dispatch_date_time);

  var recordElement = $('<li></li>')
    .addClass('list-group-item')
    .attr('id',cm._leaflet_id)
    .attr('style',"background-color:rgba(20,20,20,0.7);color:white;")
    .append(title)
    .append(location)
    .append(time);
  idlist.push(cm._leaflet_id);

  $('#demo-controllers').append(recordElement);
}

/** Given a cartoDB resultset of records, add them to our list */
// function addRecords(cartodbResults) {
//   $('#demo-controllers').empty();
//   _.each(cartodbResults.rows, addOneRecord);
// }

function removecm(array){
  _.each(array,function(ele){
    map.removeLayer(ele);
  });
}
