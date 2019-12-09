//test
(function () {
    $(document).on('pageshow', '#setting', function () {
        var angle = 0;
        _swipe();
        $(window).resize(_swipe);

        function _swipe() {
            var boxWidth = $('#box').width();
            $('#box1').css({
                '-webkit-transform': 'rotateY(0deg) translateZ(' + (boxWidth / 2) + 'px)',
                '-moz-transform': 'rotateY(0deg) translateZ(' + (boxWidth / 2) + 'px)',
                'transform': 'rotateY(0deg) translateZ(' + (boxWidth / 2) + 'px)'
            });
            $('#box2').css({
                '-webkit-transform': 'rotateY(90deg) translateZ(' + (boxWidth / 2) + 'px)',
                '-moz-transform': 'rotateY(90deg) translateZ(' + (boxWidth / 2) + 'px)',
                'transform': 'rotateY(90deg) translateZ(' + (boxWidth / 2) + 'px)'
            });
            $('#box3').css({
                '-webkit-transform': 'rotateY(180deg) translateZ(' + (boxWidth / 2) + 'px)',
                '-moz-transform': 'rotateY(180deg) translateZ(' + (boxWidth / 2) + 'px)',
                'transform': 'rotateY(180deg) translateZ(' + (boxWidth / 2) + 'px)'
            });
            $('#box4').css({
                '-webkit-transform': 'rotateY(270deg) translateZ(' + (boxWidth / 2) + 'px)',
                '-moz-transform': 'rotateY(270deg) translateZ(' + (boxWidth / 2) + 'px)',
                'transform': 'rotateY(270deg) translateZ(' + (boxWidth / 2) + 'px)'
            });
        }

        $('#b1 a').on('click', function () {
            $('#box').css({
                '-webkit-transform': 'rotateY(0deg)',
                '-moz-transform': 'rotateY(0deg)',
                'transform': 'rotateY(0deg)'
            });
            angle = 0;
        });
        $('#b2 a').on('click', function () {
            $('#box').css({
                '-webkit-transform': 'rotateY(-90deg)',
                '-moz-transform': 'rotateY(-90deg)',
                'transform': 'rotateY(-90deg)'
            });
            angle = -90;
        });
        $('#b3 a').on('click', function () {
            $('#box').css({
                '-webkit-transform': 'rotateY(-180deg)',
                '-moz-transform': 'rotateY(-180deg)',
                'transform': 'rotateY(-180deg)'
            });
            angle = -180;
        });
        $('#b4 a').on('click', function () {
            $('#box').css({
                '-webkit-transform': 'rotateY(-270deg)',
                '-moz-transform': 'rotateY(-270deg)',
                'transform': 'rotateY(-270deg)'
            });
            angle = -270;
        });
        $('#setting').on('swipeleft', function () {
            if (angle <= 0 && angle > -270) {
                angle = angle - 90;
                switch (angle) {
                    case -90:
                        $('#b2 a').click();
                        break;
                    case -180:
                        $('#b3 a').click();
                        break;
                    case -270:
                        $('#b4 a').click();
                        break;
                }
            }
        });
        $('#setting').on('swiperight', function () {
            if (angle < 0 && angle >= -270) {
                angle = angle + 90;
                switch (angle) {
                    case 0:
                        $('#b1 a').click();
                        break;
                    case -90:
                        $('#b2 a').click();
                        break;
                    case -180:
                        $('#b3 a').click();
                        break;
                }
            }
        });
    });

    // plus選項
    $(function () {
        $('#toggle-btn').click(function () {
            $('.filter-btn').toggleClass('open');
        });

        $('.filter-btn a').click(function () {
            $('.filter-btn').removeClass('open');
        });

    });

    $('#one').click(function () {
        $('#columns').slideUp(300, function () {
            $('#map').slideDown(300);
        });
    });

    $('#two').click(function () {
        $('#map').slideUp(300, function () {
            $('#columns').slideDown(300);
        });
    });
})();
//GetJsonData
$(document).on("pagecreate","#pageone",function(){
	$("#P1_b1").on("vclick",function(event){
		
            $.ajax({
                type: "GET",
                url: "mydata.json",
                dataType: "json",
                async: true,
                success: function(arr) {
                    console.log("success!");
                    var i;
                    var out = '<table class="table table-striped table-hover">' +
                            '<thead><tr><th scope="col">#</th>' +
                            '<th scope="col">形式</th>' +
                            '<th scope="col">付費方式</th>' +
                            '<th scope="col">位於</th>' +
                            '<th scope="col">中文地址</th></tr></thead><tbody>';
            
                    for(i = 0; i < arr.length; i++) {
                        out += '<tr><th scope="row">' + i + '</th><td>' +
                        arr[i].Kind + "</td><td>" +
                        arr[i].Charge + "</td><td>" +
                        arr[i].Location + "</td><td>" +
                        arr[i].Address + "</td></tr>";
                    }
                    out += "</tbody></table>";
                    document.getElementById("P1").innerHTML = out;
                }
			});
		});

		
        
});
//MarkMyLocation
$(document).on("pagecreate","#LocationPage",function(){
	$("#PL_b1").on("vclick",function(event){
		setInterval(function() {
			getLocation();
        }, 3000);
		
		var x = document.getElementById("mylocation");
			function getLocation(){
			  if (navigator.geolocation) {
				navigator.geolocation.watchPosition(showPosition, showError);
			  } else { 
				x.innerHTML = "Geolocation is not supported by this browser.";
			  }
			}
		

			function showPosition(position) {
			  var lat = position.coords.latitude;
			  var lon = position.coords.longitude;
			  var latlon = new google.maps.LatLng(lat, lon)
			  var mapholder = document.getElementById('mymap')
			  mapholder.style.height = '400px';
			  mapholder.style.width = '100%';

			  var myOptions = {
				center:latlon,zoom:14,
				mapTypeId:google.maps.MapTypeId.ROADMAP,
				mapTypeControl:false,
				navigationControlOptions:{style:google.maps.NavigationControlStyle.SMALL}
			  }
				
			  var map = new google.maps.Map(document.getElementById("mymap"), myOptions);
			  var marker = new google.maps.Marker({position:latlon,map:map,title:"You are here!"});
			  x.innerHTML = "Latitude: " + position.coords.latitude + 
			  "<br>Longitude: " + position.coords.longitude;
			}
			function showError(error) {
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
			
		});
//MarkDataLocation
	$("#PL_b2").on("vclick",function(event){
		getLocation();
		var x = document.getElementById("mylocation");
			function getLocation(){
			  if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(showPosition, showError);
			  } else { 
				x.innerHTML = "Geolocation is not supported by this browser.";
			  }
			}
		

			function showPosition(position) {
			  var lat = position.coords.latitude;
			  var lon = position.coords.longitude;
			  var latlon = new google.maps.LatLng(lat, lon)
			  var mapholder = document.getElementById('mymap')
			  mapholder.style.height = '400px';
			  mapholder.style.width = '100%';

			  var myOptions = {
				center:latlon,zoom:14,
				mapTypeId:google.maps.MapTypeId.ROADMAP,
				mapTypeControl:false,
				navigationControlOptions:{style:google.maps.NavigationControlStyle.SMALL}
			  }
				
			  var map = new google.maps.Map(document.getElementById("mymap"), myOptions);
			  var marker = new google.maps.Marker({position:latlon,map:map,title:"You are here!",icon:"bikelocation.png"});
			  
			  var url = "fooddata.json";
				var jqxhr = $.getJSON(url, function(myobject) {
					var i;
					for(i = 0; i < myobject.length; i++) {
						search(myobject[i]);
					}
					function search(place){
						var latlon = new google.maps.LatLng(place.Py, place.Px);
						marker = new google.maps.Marker({position:latlon,map:map,title:place.sna,icon:"mylocation.png"});
						var placeLoc = {
							  "lat" : place.Py,
							  "lng" : place.Px
						}; 
						content = '店名：' + myobject[i].Name + '</br>敘述：' + myobject[i].Description + '</br>場站名稱：' +
								  '</br>地址：' + myobject[i].Add;
						var infowindow = new google.maps.InfoWindow({
						content: content
						});
						
						marker.addListener('click', function() {
							console.log("click");
							infowindow.open(map,this);
						  });
					}
				});
			  
			}
			function showError(error) {
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
			
		});
//LocationGroup
		$("#PL_b3").on("vclick",function(event){
		getLocation();
		var x = document.getElementById("mylocation");
			function getLocation(){
			  if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(showPosition, showError);
			  } else { 
				x.innerHTML = "Geolocation is not supported by this browser.";
			  }
			}
		

			function showPosition(position) {
			  var lat = position.coords.latitude;
			  var lon = position.coords.longitude;
			  var latlon = new google.maps.LatLng(lat, lon)
			  var mapholder = document.getElementById('mymap')
			  mapholder.style.height = '400px';
			  mapholder.style.width = '100%';

			  var myOptions = {
				center:latlon,zoom:14,
				mapTypeId:google.maps.MapTypeId.ROADMAP,
				mapTypeControl:false,
				navigationControlOptions:{style:google.maps.NavigationControlStyle.SMALL}
			  }
				
			  var map = new google.maps.Map(document.getElementById("mymap"), myOptions);
			  var marker;
			  var markers=[];
			  
			  var url = "fooddata.json";
				var jqxhr = $.getJSON(url, function(myobject) {
					var i;
					for(i = 0; i < myobject.length; i++) {
						search(myobject[i]);
					}
					var markerCluster = new MarkerClusterer(map, markers,
						{imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
					function search(place){
						var latlon = new google.maps.LatLng(place.Py, place.Px);
						marker = new google.maps.Marker({position:latlon,map:map,title:place.sna,icon:"mylocation.png"});
						markers.push(marker);
						var placeLoc = {
							  "lat" : place.Py,
							  "lng" : place.Px
						}; 
						content = '店名：' + myobject[i].Name + '</br>敘述：' + myobject[i].Description + '</br>場站名稱：' +
								  '</br>地址：' + myobject[i].Add;
						var infowindow = new google.maps.InfoWindow({
						content: content
						});
						
						marker.addListener('click', function() {
							//console.log("click");
							infowindow.open(map,this);
						});
					}
				});
			  
			}
			function showError(error) {
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
			
		});

//距離
$(document).on("pagecreate","#RangePage",function(){
	$("#PR_b1").on("vclick",function(event){
		getLocation();
		var range = ($("#rangevalue").val()*1000);
		alert("Range: "+range+" M");
		var x = document.getElementById("showrange");
		var centerLat;  // 記錄目前位置
        var centerLon;  // 記錄目前位置
		
		function getLocation(){
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(showPosition, showError);
			} else { 
				x.innerHTML = "Geolocation is not supported by this browser.";
			}
		}
		function showPosition(position) {
			  centerLat = position.coords.latitude;
			  centerLon = position.coords.longitude;
			  var latlon = new google.maps.LatLng(centerLat, centerLon)
			  var mapholder = document.getElementById('showrange_map')
			  mapholder.style.height = '400px';
			  mapholder.style.width = '100%';
			  var myOptions = {
				center:latlon,zoom:14,
				mapTypeId:google.maps.MapTypeId.ROADMAP,
				mapTypeControl:false,
				navigationControlOptions:{style:google.maps.NavigationControlStyle.SMALL}
			  }
				
			  var map = new google.maps.Map(mapholder, myOptions);
			  var marker = new google.maps.Marker({position:latlon,map:map,title:"You are here!"});
			  
			  
			  var url = "fooddata.json";
				var jqxhr = $.getJSON(url, function(myobject) {
					var i;
					for(i = 0; i < myobject.length; i++) {
						console.log("i="+i);
						search(myobject[i]);
					}
					function search(place){
						if (getGreatCircleDistance(centerLat,centerLon,myobject[i].Py,myobject[i].Px) <= range) {
		                    var latlon = new google.maps.LatLng(myobject[i].Py, myobject[i].Px);
		                    marker = new google.maps.Marker({position:latlon,map:map,title:myobject[i].Name});
		                }
					}
					
				});
			  
			}
			function showError(error) {
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
			function getRad(d){
            var PI = Math.PI;
            return d*PI/180.0;
			}
    
			function getGreatCircleDistance(lat1,lng1,lat2,lng2) {
				var EARTH_RADIUS = 6378137.0;    //Unit: Meter
				var radLat1 = getRad(lat1);
				var radLat2 = getRad(lat2);
		
				var a = radLat1 - radLat2;
				var b = getRad(lng1) - getRad(lng2);
		
				var s = 2*Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) + Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
				s = s*EARTH_RADIUS;
				s = Math.round(s*10000)/10000.0;
		
				return s.toFixed(2);
			}
		});
});


//LocationGroup
		$("#PL_b4").on("vclick",function(event){
		getLocation();
		var x = document.getElementById("mylocation");
			function getLocation(){
			  if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(showPosition, showError);
			  } else { 
				x.innerHTML = "Geolocation is not supported by this browser.";
			  }
			}
		

			function showPosition(position) {
			  var lat = position.coords.latitude;
			  var lon = position.coords.longitude;
			  var latlon = new google.maps.LatLng(lat, lon)
			  var mapholder = document.getElementById('mymap')
			  mapholder.style.height = '400px';
			  mapholder.style.width = '100%';

			  var myOptions = {
				center:latlon,zoom:14,
				mapTypeId:google.maps.MapTypeId.ROADMAP,
				mapTypeControl:false,
				navigationControlOptions:{style:google.maps.NavigationControlStyle.SMALL}
			  }
				
			  var map = new google.maps.Map(document.getElementById("mymap"), myOptions);
			  var marker;
			  var markers=[];
			  
			  var url = "fooddata.json";
				var jqxhr = $.getJSON(url, function(myobject) {
					var i;
					for(i = 0; i < myobject.length; i++) {
						search(myobject[i]);
					}
					//var markerCluster = new MarkerClusterer(map, markers,
						//{imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
					function search(place){
						var latlon = new google.maps.LatLng(place.Py, place.Px);
						marker = new google.maps.Marker({position:latlon,map:map,title:place.sna,
						icon:{
                        path: google.maps.SymbolPath.CIRCLE,  // 使用圖圈圖形
                        strokeColor: "white", // 線條顏色
                        strokeWeight: 1,      // 線條粗細
                        fillColor: "red",     // 填充顏色
                        fillOpacity: 0.3,     // 填充透明度
                        scale: Math.floor((Math.random()*10)+1)}
						});
						markers.push(marker);
						var placeLoc = {
							  "lat" : place.Py,
							  "lng" : place.Px
						}; 
						content = '店名：' + myobject[i].Name + '</br>敘述：' + myobject[i].Description + '</br>場站名稱：' +
								  '</br>地址：' + myobject[i].Add;
						var infowindow = new google.maps.InfoWindow({
						content: content
						});
						
						marker.addListener('click', function() {
							//console.log("click");
							infowindow.open(map,this);
						});
					}
				});
			  
			}
			function showError(error) {
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
			
		});
});
//規劃路線
$(document).on("pagecreate","#plan",function(){
	var directionsService = new google.maps.DirectionsService;
	var directionsDisplay = new google.maps.DirectionsRenderer;
	var centerPos; //中心位置
	var map;
	var infowindow;
	var x = document.getElementById("plan_text");
			getLocation();
			var nowlan; //目前緯度
			var nowlon; //目前經度

	function getLocation() {
			if (navigator.geolocation) {
					var options = {timeout:10000};
					navigator.geolocation.getCurrentPosition(showPosition,showError,options);
			} else {
					x.innerHTML = "Geolocation is not supported by this browser.";
			}
	}

			function showPosition(position) {
					nowlan = position.coords.latitude;
					nowlon = position.coords.longitude;
					centerPos = new google.maps.LatLng(nowlan, nowlon);
					var thisMap = document.getElementById("plan_map");
					thisMap.style.height = '350px';
					thisMap.style.width = '100%';

					map = new google.maps.Map(thisMap,{center: centerPos,zoom: 15}); // 將中心位置地圖存進map物件裡

					infowindow = new google.maps.InfoWindow();
					var url = "fooddata.json";
					var jqxhr = $.getJSON(url, function(arr) {
							console.log("locatsuccess");
							var i;
							for(i = 0; i < arr.length; i++) {
									search(arr[i]);
							}
					function search(place){
							var latlon = new google.maps.LatLng(place.Py,place.Px);
										marker = new google.maps.Marker({position:latlon,map:map,title:place.Name}); 
							content = place.Name;
							var infowindow = new google.maps.InfoWindow({content: content});

							marker.addListener('click', function() {
									infowindow.open(map, this); //this(marker)
							});
			

	
			google.maps.event.addListener(marker,"dblclick",function() {
					directionsDisplay.setMap(map);
					directionsService.route({ //路徑設置
							origin: centerPos, //中心點
							destination: latlon, //要搜尋的點
							travelMode: 'DRIVING'//移動方式
					},function(response, status) {
									if (status === 'OK') {
											directionsDisplay.setDirections(response);
											var dirStepArr = response.routes[0].legs[0]; //路徑陣列
											var dirStep = dirStepArr.steps.length; //陣列長度
											//alert(dirStep);

											if (dirStep>0) { //路徑文字指示顯示
													var stepString = "";
													for (var i=0;i<dirStep;i++) {
															stepString += dirStepArr.steps[i].instructions.trim();
													}
													// alert(stepString);
													x.innerHTML = stepString;
											}
											} else {
													window.alert('Directions request failed due to ' + status);
											}
							});
					});
			};
	});
}

			function showError(error) {
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
});


//Timerpage
$(document).on("pagecreate","#Timerpage",function(){
		var c=0;
		var t;
		$("#TP_B1_start").on("vclick",function(event){
			timedCount();
			function timedCount(){
				document.getElementById('showtime').innerHTML=c;
				c=c+1;
				t=setTimeout(timedCount,1000);
				totalmoney();
			}
		});	
		$("#TP_B2_end").on("vclick",function(event){
			
			stopCount();
			function stopCount(){
			document.getElementById('showtime').innerHTML=c;
			c=0;
			setTimeout("",0);
			clearTimeout(t);
			}
			
		});
		
		

			
			
			function totalmoney(){
				money=Math.floor(c/5);
				document.getElementById('money').innerHTML=money;
				if(c<=3){
					document.getElementById('money').innerHTML=money+"(不收費)";
				}else if(c>3 && c<=24){
					money=(Math.floor(c/3))*10;
					document.getElementById('money').innerHTML=money+"(10元收費)";	
				}else if(c>24 && c<=48){
					money=80+((Math.floor((c-24)/3))*20);
					document.getElementById('money').innerHTML=money+"(20元收費)";	
				}else {
					money=240+((Math.floor((c-48)/3))*30);
					document.getElementById('money').innerHTML=money+"(30元收費)";
				}
			}
		
		
	});




$(document).on("pagecreate","#page3",function(){
	
		var xmlhttp = new XMLHttpRequest();
        var url = "https://cloud.culture.tw/frontsite/trans/SearchShowAction.do?method=doFindTypeJ&category=1";
        xmlhttp.onreadystatechange=function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                myFunction(xmlhttp.responseText);
            }
        }
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
        
        function myFunction(response) {
            var arr = JSON.parse(response);
            var i;
            var out = '<table class="table table-striped table-hover">' +
                        '<thead><tr><th scope="col">#</th>' +
                        '<th scope="col">活動名稱</th>' +
                        '<th scope="col">主辦單位</th>' +
                        '<th scope="col">活動時間</th>' +
                        '<th scope="col">活動售票</th></tr></thead><tbody>';
        
            for(i = 0; i < arr.length; i++) {
                out += '<tr><th scope="row">' + i + '</th><td>' +
                arr[i].title + "</td><td>" +
                arr[i].masterUnit + "</td><td>" +
                arr[i].startDate + "</td><td>" +
                arr[i].sourceWebName + "</td></tr>";
            }
            out += "</tbody></table>";
            document.getElementById("P3_b1").innerHTML = out;
        }
	});