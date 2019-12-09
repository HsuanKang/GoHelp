$(document).ready(function () {

    var myOptions;
    var map;
    var classification = "Index";
    checkClassification();
    //持續追蹤位置
    setInterval(function () {
        getLocation();
    }, 10000);

    google.maps.event.addDomListener(window, 'load', initialize);
    function initialize() {
        var input = document.getElementById('autocomplete_search');
        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.addListener('place_changed', function () {
            var place = autocomplete.getPlace();
            // place variable will have all the information you are looking for.
            $('#lat').val(place.geometry['location'].lat());
            $('#long').val(place.geometry['location'].lng());
        });
    }

    var x = document.getElementById("error_msg");
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(showPosition, showError);
        } else {
            x.innerHTML = "Geolocation is not supported by this browser.";
        }
    }



    $('#top_btn_new').click(function () {
        deleteMarkers();
        checkClassification();
        classification = "Index";
        console.log(classification);
    });

    //換頁
    $('#top_btn_share').on("vclick", function () {
        classification = "share"; console.log(classification);
        checkClassification();

    });
    $('#top_btn_emergency').on("vclick", function () {
        classification = "emergency"; console.log(classification);
        checkClassification();
    });
    $('#top_btn_together').on("vclick", function () {
        classification = "together";
        checkClassification();
    });
    $('#top_btn_sad').on("vclick", function () {
        classification = "talk";
        checkClassification();

    });


    //使用者所在地
    function showPosition(position) {
        console.log("show");
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        var latlon = new google.maps.LatLng(lat, lon);
        myOptions = {
            center: latlon, zoom: 14,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false,
            navigationControlOptions: { style: google.maps.NavigationControlStyle.SMALL }
        };
        map = new google.maps.Map(document.getElementById("show_post_map"), myOptions);
        var marker1 = new google.maps.Marker({ position: latlon, map: map, animation: google.maps.Animation.BOUNCE, title: "You are here!" });
    }

    var marker;
    var markers = [];
    function checkClassification() {
        if (classification == "Index") {
            console.log(classification);
            $.ajax({
                type: "POST",
                url: "/Library/Index",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    console.log(response);
                    markPostPosition(response);

                },
                error: function (error) {
                    console.log(error);
                }
            });
            return false;
        } else {
            deleteMarkers();
            console.log(classification);
            ChangeType(classification);
        }
    }

    function ChangeType(type) {
        $.ajax({
            type: "POST",
            url: "/Library/ChangeType",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ type: type }),
            dataType: "json",
            success: function (response) {
                markPostPosition(response);
            },
            error: function (error) {
                console.log(error);
            }
        });
        return false;
    }
    function markPostPosition(response) {
        console.log("132123");
        for (var i = 0; i < response.length; i++) {
            search(response[i]);
        };
        var markerCluster = new MarkerClusterer(map, markers,
            { imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' });
        function search(place) {
            var latlon = new google.maps.LatLng(place.PostLat, place.PostLong);
            marker = new google.maps.Marker({ position: latlon, map: map, title: place.sna, animation: google.maps.Animation.DROP, icon: "/Content/images/post_logo.png" });
            markers.push(marker);
            var placeLoc = {
                "PostLat": place.PostLat,
                "PostLong": place.PostLong
            };
            content = '分類：' + response[i].Kind + '</br>標題：' + response[i].PostTitle + '</br>地址：' + response[i].MeetAddress +
                '</br>結束時間：' + response[i].EndTime + '';
            var infowindow = new google.maps.InfoWindow({
                content: content
            });

            marker.addListener('click', function () {
                infowindow.open(map, this);
            });
        }

    }
    function deleteMarkers() {
        //console.log("Delete");
        //markers.foreach(function (e) {
        //    e.setmap(null);
        //});
        //markers = [];
    }
    function showError(error) {
        switch (error.code) {
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


});