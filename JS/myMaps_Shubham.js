var myMaps = {
    Init: function () {
        var me = myMaps;
        me.BindEvents();
        me.InitializeMaps();
    },

    BindEvents: function () {
        var me = myMaps;
        $("#btnSearch").off("click");
        $("#btnSearch").on("click", function () {
            me.GetGeoCodeForAddress($("#txtSource").val(), $("#txtDestination").val());
        });
    },

    FindRoute: function (addressArray) {
        alert("Source: " + addressArray[0].Latitude + ", " + addressArray[0].Longitude + "\n" + "Destination:" + addressArray[1].Latitude + ", " + addressArray[1].Longitude);
    },

    GetGeoCodeForAddress: function (source, destination) {
        var me = myMaps;
        var geocoder = new google.maps.Geocoder();
        var addressArray = [];
        geocoder.geocode({ 'address': source }, function (results, status) {
            if (status == 'OK') {
                var addObjSrc={};
                addObjSrc.Latitude=results[0].geometry.location.lat();
                addObjSrc.Longitude=results[0].geometry.location.lng();
                addressArray.push(addObjSrc);
                geocoder.geocode({ 'address': destination }, function (results, status) {
                    if (status == 'OK') {
                        var addObjDest={};
                        addObjDest.Latitude=results[0].geometry.location.lat();
                        addObjDest.Longitude=results[0].geometry.location.lng();
                        addressArray.push(addObjDest);
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

    InitializeMaps: function () {
        var me = myMaps;
        var map = new google.maps.Map($("#divMap")[0], {
            center: { lat: 21.1458, lng:79.0882 },
            scrollwheel: false,
            zoom: 8
        });
        var marker = new google.maps.Marker({ position: { lat: 21.1458, lng: 79.0882 } });
        marker.setMap(map);

        new google.maps.places.Autocomplete($("#txtSource")[0]).bindTo('bounds', map);
        new google.maps.places.Autocomplete($("#txtDestination")[0]).bindTo('bounds', map);

    }
}

$(function () {
    myMaps.Init();
});