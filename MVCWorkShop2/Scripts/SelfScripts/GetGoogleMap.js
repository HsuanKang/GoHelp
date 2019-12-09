$(document).ready(function () {


    var classification = "Index";
    //持續追蹤位置


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





    $('#top_btn_new').click(function () {
        deleteMarkers();
        classification = "Index";
        console.log(classification);
        getLocation();
    });

    //換頁
    $('#top_btn_share').on("vclick", function () {
        classification = "share"; console.log(classification);
        getLocation();
    });
    $('#top_btn_emergency').on("vclick", function () {
        classification = "emergency"; console.log(classification);
        getLocation();
    });
    $('#top_btn_together').on("vclick", function () {
        classification = "together";
        getLocation();
    });
    $('#top_btn_sad').on("vclick", function () {
        classification = "talk";
        getLocation();
    });

    var x = document.getElementById("error_msg");
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(showPosition, showError);
        } else {
            x.innerHTML = "Geolocation is not supported by this browser.";
        }
    }
    //使用者所在地
    function showPosition(position) {
        console.log("show");
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        var latlon = new google.maps.LatLng(lat, lon);
        var myOptions = {
            center: latlon, zoom: 14,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false,
            navigationControlOptions: { style: google.maps.NavigationControlStyle.SMALL }
        };
        var map = new google.maps.Map(document.getElementById("show_post_map"), myOptions);
        var marker = new google.maps.Marker({ position: latlon, map: map, animation: google.maps.Animation.BOUNCE, title: "You are here!" });

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

            function search(place) {
                var latlon = new google.maps.LatLng(place.PostLat, place.PostLong);
                marker = new google.maps.Marker({ position: latlon, map: map, title: place.sna, animation: google.maps.Animation.DROP, icon: "/Content/images/post_logo.png" });
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