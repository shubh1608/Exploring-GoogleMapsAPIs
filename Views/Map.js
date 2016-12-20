
/* function myMap() {
  var mapCanvas = document.getElementById("map");
  
  var mapOptions = {
      center: new google.maps.LatLng(),
    zoom: 8
    }
  var map = new google.maps.Map(mapCanvas, mapOptions);
}
 */
function getLocation(){
	var geolocation=navigator.geolocation;
	geolocation.getCurrentPosition(showLocation,errorHandler);
}

function showLocation(position){
	var latitude=position.coords.latitude;
	var longitude=position.coords.longitude;
	console.log(latitude+" "+longitude );
	
	  var mapCanvas = document.getElementById("map");
	  
	  var mapOptions = {
	      center: new google.maps.LatLng(latitude,longitude),
	      zoom: 8
	    }
	  var map = new google.maps.Map(mapCanvas, mapOptions);
}

function errorHandler(error){
	switch(error.code) {
    case error.PERMISSION_DENIED:
        x.innerHTML = "User denied the request for Geolocation."
        break;
    case error.POSITION_UNAVAILABLE:
        x.innerHTML = "Location information is unavailable."
        break;
    case error.TIMEOUT:
        x.innerHTML = "The request to get user location timed out."
        break;
    case error.UNKNOWN_ERROR:
        x.innerHTML = "An unknown error occurred."
        break;
}
}


