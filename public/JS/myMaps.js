var myMaps = {

    gblMapRef: null,
    curPosition: null,

    Init: function () {
        var me = myMaps;
        SetToastrOption();
        $("#labelUserName").text("Welcome "+localStorage.SessionUserName);
        me.InitializeMaps();
        me.BindEvents();
    },

    StartPolling:function(){
        showLoader();
        setTimeout(function () {
            hideLoader();
        }, 5000);
    },

    BindEvents: function () {
        var me = myMaps;
        $("#btnSearch").off("click");
        $("#btnSearch").on("click", function () {
            var msg = me.ValidateSearchInfo();
            if (msg == "") {
                me.FindRoute($("#txtSource").val(), $("#txtDestination").val());
            } else {
                showToastr('error', msg, 'Error');
            }
            
        });

        $("#btnStartPolling").off("click");
        $("#btnStartPolling").on("click", function () {
            me.StartPolling();
        });

        $("#btnLogout").off("click");
        $("#btnLogout").on("click", function () {
            me.LogoutUser();
        });

        $(".liSearchOptions").off("click");
        $(".liSearchOptions").on("click", function (event) {
            var id = this.id;
            if (id == "liShowCurLocatn")
                me.ShowCurrentLocation("liShowCurLocatn");
            else if (id == "liSetCurLocAsSrc")
                me.SetCurrentLocationAsSource("liSetCurLocAsSrc");

        });

    },

    LogoutUser: function () {
        showLoader();
        $.ajax({
            type: 'Get',
            contentType: 'application/json',
            timeout: 360000,
            url: '/logout',
            success: function (data) {
                hideLoader();
                if (data == true) {
                    localStorage.usrname = '';
                    localStorage.pass = '';
                    localStorage.chkbx = '';
                    localStorage.SessionUserName='';
                    window.location = "/";
                }
            }
        });
    },

    ValidateSearchInfo: function () {
        var me = myMaps;
        var msg = "";
        if($("#txtSource").val() == ""){
            msg = "Please enter a Source.";
        }
        if ($("#txtDestination").val() == "") {
            msg = msg == "" ? msg : msg + "<br>";
            msg = msg + "Please enter a Destination.";
        }
        return msg;
    },

    ShowCurrentLocation: function (id) {
        var me = myMaps;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                me.curPosition = pos;
                var marker = null;
                marker = new google.maps.Marker({ position: pos });
                if ($("#" + id + " span:first").css("display") == "none") {
                    $("#" + id).find("span").show();
                    marker.setMap(me.gblMapRef);
                    me.gblMapRef.setCenter(pos);
                } else {
                    $("#" + id).find("span").hide();
                    marker.setMap(null);
                }
            }, function () {

            });
        } else {

        }
    },

    SetCurrentLocationAsSource: function (id) {
        var me = myMaps;
        if ($("#" + id + " span:first").css("display") == "none") {
            $("#" + id).find("span").show();
            if (me.curPosition != null) {
            var geocoder = new google.maps.Geocoder;
            geocoder.geocode({ 'location': me.curPosition }, function (results, status) {
                if (status === 'OK') {
                    if (results[0]) {
                        //map.setZoom(11);
                        var marker = new google.maps.Marker({
                            position: me.curPosition,
                            map: me.gblMapRef
                        });
                        marker.setMap(me.gblMapRef);
                        me.gblMapRef.setCenter(me.curPosition);
                        $("#txtSource").val(results[0].formatted_address);
                    } else {
                        window.alert('No results found');
                    }
                }
            });
        } else {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    var pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    me.curPosition = pos;
                    var geocoder = new google.maps.Geocoder;
                    geocoder.geocode({ 'location': me.curPosition }, function (results, status) {
                        if (status === 'OK') {
                            if (results[0]) {
                                //map.setZoom(11);
                                var marker = new google.maps.Marker({
                                    position: me.curPosition,
                                    map: me.gblMapRef
                                });
                                marker.setMap(me.gblMapRef);
                                me.gblMapRef.setCenter(me.curPosition);
                                $("#txtSource").val(results[0].formatted_address);
                            } else {
                                window.alert('No results found');
                            }
                        }
                    });
                }, function () {

                });
            }
        }
        }else{
            $("#" + id).find("span").hide();
            $("#txtSource").val("");
        }

        

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
                maxWidth: 300
            });
            infowindow.open(me.gblMapRef, marker);
        });

    },

    FindRoute: function (origin, destination) {
        var me = myMaps;

        var directionsService = new google.maps.DirectionsService();
        var directionsDisplay = new google.maps.DirectionsRenderer();
        $("#divDirectionPanel").empty();
        directionsDisplay.setPanel($("#divDirectionPanel")[0]);
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
                $("#divMap").css("width", "65%");
                $("#divOuterDirectionPanel").show();
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

    },

}

$(function () {
    myMaps.Init();
});





