var geocoder;
var map;
var delay = 10;
var events;

function loadScript() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp' +
      '&signed_in=true&callback=initialize';
  document.body.appendChild(script);
}

function initialize() {
  geocoder = new google.maps.Geocoder();
  var latlng = new google.maps.LatLng(33.775606, -84.396383);
  var mapOptions = {
    zoom: 8,
    center: latlng
  }
  var mapDiv = document.createElement('div');
  mapDiv.style.visibility = "enabled";
  mapDiv.style.position = "absolute";
  mapDiv.style.right = "0px";
  mapDiv.style.top = "0px";
  mapDiv.style.width = "50%";
  mapDiv.style.height = "50%";
  mapDiv.style.zIndex = "1000";
  document.body.appendChild(mapDiv);
  console.log(mapDiv);

  map = new google.maps.Map(mapDiv, mapOptions);

  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = new google.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);
      map.setCenter(pos);
    }, null);
  }

  //codeAddress("Georgia Tech", "GT");

  events = document.querySelectorAll(".eventInfo");
  eventsLoop();  
}

var i = 0;
function eventsLoop()
{
	codeAddress(events[i]);
	i++;
}

function codeAddress(event) {
  var eStr = event.innerHTML;
  var query = eStr.substring(eStr.lastIndexOf('(')+1, eStr.lastIndexOf(')'));
  var title = event.getElementsByTagName("b")[1].innerHTML;
  //var address = document.getElementById('address').value;
  geocoder.geocode( { 'address': query}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      map.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location
      });

      var infowindow = new google.maps.InfoWindow({
        content: title
      });

      google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map,marker);
      });

    } else {
      console.log('Geocode for \"' + query + '\"was not successful for the following reason: ' + status);
      if(status = "OVER_QUERY_LIMIT")
      {
        i--;
        delay += 1;
      }
    }

    setTimeout(eventsLoop, delay);
  });
}

loadScript();
