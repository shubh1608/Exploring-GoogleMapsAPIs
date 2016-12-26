var myMaps = {
    gblMapRef:null,
    Init: function () {
        var me = myMaps;
        me.InitializeMaps();
        me.BindEvents();
    },

    BindEvents: function () {
        var me = myMaps;
        $("#btnSearch").off("click");
        $("#btnSearch").on("click", function () {
            me.FindRoute($("#txtSource").val(), $("#txtDestination").val());
            //me.GetGeoCodeForAddress($("#txtSource").val(), $("#txtDestination").val());
        });

        me.gblMapRef.addListener('click', function (event) {
            me.PlaceMarker(event.latLng);
        });

        
    },

    

    PlaceMarker: function (location) {
        var me = myMaps;
        var marker = new google.maps.Marker({
            position: location,
            map: me.gblMapRef
        });


        marker.addListener("dblclick", function () {
            marker.setMap(null);
        });

        marker.addListener("click", function () {
            //marker.setMap(null);
            var infowindow = new google.maps.InfoWindow({
                content: $("#divInfoWindowContent").html(),
                maxWidth:300
            });
            infowindow.open(me.gblMapRef, marker);
        });

    },


    FindRoute: function (origin, destination) {
        var me = myMaps;

        var directionsService = new google.maps.DirectionsService();
        var directionsDisplay = new google.maps.DirectionsRenderer();
        directionsDisplay.setMap(null);
        directionsDisplay.setMap(me.CreateMap(21.1458, 79.0882));
        var request = {
            origin: origin,
            destination: destination,
            travelMode: 'DRIVING'
        };
        directionsService.route(request, function (response, status) {
            if (status == 'OK') {
                directionsDisplay.setDirections(response);
                directionsDisplay.setPanel(document.getElementById('divDirectionPanel'));
            }
        });
        me.BindEvents();
    },

    GetGeoCodeForAddress: function (source, destination) {
        //No need of this function as GoogleDirectionServices takes origin,destination values as Address also,i thought we need to convert it to LatLng
        var me = myMaps;
        var geocoder = new google.maps.Geocoder();
        var addressArray = [];
        geocoder.geocode({ 'address': source }, function (results, status) {
            if (status == 'OK') {
                var addObjSrc = {};
                addObjSrc.Latitude = results[0].geometry.location.lat();
                addObjSrc.Longitude = results[0].geometry.location.lng();
                addressArray.push(addObjSrc);
                geocoder.geocode({ 'address': destination }, function (results, status) {
                    if (status == 'OK') {
                        var addObjDest = {};
                        addObjDest.Latitude = results[0].geometry.location.lat();
                        addObjDest.Longitude = results[0].geometry.location.lng();
                        addressArray.push(addObjDest);
                        //alert("Source: " + addressArray[0].Latitude + ", " + addressArray[0].Longitude + "\n" + "Destination:" + addressArray[1].Latitude + ", " + addressArray[1].Longitude);
                        me.FindRoute(addressArray);
                    } else {
                        alert('Geocode was not successful for the following reason: ' + status);
                    }
                });
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    },

    CreateMap: function (latitude, longitude) {
        var me = myMaps;
        var map = new google.maps.Map($("#divMap")[0], {
            center: { lat: latitude, lng: longitude },
            scrollwheel: false,
            zoom: 15
        });
        me.gblMapRef = map;
        return map;
    },

    InitializeMaps: function () {
        var me = myMaps;
        var map = me.CreateMap(21.1458, 79.0882);

        var marker = new google.maps.Marker({ position: { lat: 21.1458, lng: 79.0882 } });
        marker.setMap(map);

        new google.maps.places.Autocomplete($("#txtSource")[0]).bindTo('bounds', map);
        new google.maps.places.Autocomplete($("#txtDestination")[0]).bindTo('bounds', map);

    }
}

$(function () {
    myMaps.Init();
});


function SaveNote(event) {
    event.preventDefault();
    var jsonObj = {
        
    };
}
