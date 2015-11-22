var gps = angular.module("gps", []);
// var tabPoint = new array();

gps.controller("gpsCtrl",  ['$scope', '$window', '$interval', function($scope, $window, $interval) {

    $scope.init = function() {
        $scope.timer = undefined;
        $scope.watchID = null;
        $scope.centiSecond = 0;
        $scope.second = 0;
        $scope.minute = 0;
        $scope.canStart = true;
        $scope.finish = false;
        $scope.isStop = false;
        $scope.getCurrentPosition();
    }

    $scope.startChrono = function() {
        $scope.options = { maximumAge : 500, timeout: 30000, enableHighAccuracy: true};
        // $scope.getCurrentPosition();
        $scope.launchTracker();
        $scope.startTimer();
        $scope.canStart = false;
        $scope.isStop = false;
        $scope.finish = true;
        $scope.tabPoint = [];
    }

    $scope.stopChrono = function() {
        $window.navigator.geolocation.clearWatch($scope.watchID);
        $scope.watchID = null;
        $scope.finish = false;
        $scope.isStop = true;

        $scope.markers = [];
	    $scope.bounds = new google.maps.LatLngBounds();
	    var arrayLine = [];
        for (i = 0; i < $scope.tabPoint.length; i++){
	        $scope.createMarker($scope.tabPoint[i]);
	        arrayLine.push(new google.maps.LatLng($scope.tabPoint[i].coords.latitude, $scope.tabPoint[i].coords.longitude));
	    }
	    $scope.map.fitBounds($scope.bounds);

	    var optionsPolyline = {
	    	map: $scope.map,
	    	path: arrayLine
	    }

	    var mapPolyline = new google.maps.Polyline(optionsPolyline);

        if (angular.isDefined($scope.timer)) {
            $interval.cancel($scope.timer);
            $scope.timer = undefined;
        }
    }

    $scope.reinitData = function() {
        $scope.isStop = false;
        $scope.canStart = true;
        $scope.initLongitude = null;
        $scope.initLatitude  = null;
        $scope.longitude = null;
        $scope.latitude  = null;
        $scope.speed     = null;
        $scope.timestamp = null;

        $scope.centiSecond = 0;
        $scope.second = 0;
        $scope.minute = 0;
        $scope.finish = false;
        $scope.clearAllMarkers();
        $scope.getCurrentPosition();
    }

    $scope.startTimer = function() {
        $scope.timer = $interval($scope.chrono, 100)        
    }

    $scope.chrono = function() {
        $scope.centiSecond++;

        if ($scope.centiSecond > 9) {
            $scope.centiSecond=0;
            $scope.second++;
        } 

        if ($scope.second > 59) {
            $scope.second=0;
            $scope.minute++;
        }
    }

    $scope.getCurrentPosition = function() {
        $window.navigator.geolocation.getCurrentPosition($scope.successCurrentPosition);
    }

    $scope.successCurrentPosition = function(position) {
        $scope.initLongitude = position.coords.longitude;
        $scope.initLatitude  = position.coords.latitude;
        $scope.$apply();

        $scope.initMap();
    }

    $scope.launchTracker = function() {
        $scope.watchID = $window.navigator.geolocation.watchPosition(
                                $scope.successWatchPosition,
                                $scope.errorWatchPosition, 
                                $scope.options);
    }

    $scope.successWatchPosition = function(position) {
        $scope.longitude = position.coords.longitude;
        $scope.latitude  = position.coords.latitude;
        $scope.speed     = position.coords.speed;
        $scope.timestamp = position.timestamp;
        $scope.tabPoint.push(position);
        $scope.$apply();
    }

    $scope.initMap = function() {
        var pos = new google.maps.LatLng($scope.initLatitude, $scope.initLongitude);
    	var mapOptions = {
    		zoom: 12,
    		center: pos,
    		mapTypeId: google.maps.MapTypeId.ROADMAP
    	}

    	$scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
    }
    
    $scope.createMarker = function (info) {
        var pos = new google.maps.LatLng(info.coords.latitude, info.coords.longitude);
        var marker = new google.maps.Marker({
            map: $scope.map,
            position: pos,
            title: 'Point',
            icon: 'img/markerRed.png'
        });
        marker.content = 'Point';
        $scope.bounds.extend(pos);
        $scope.markers.push(marker);
    }

    $scope.clearAllMarkers = function() {
    	for (var i = 0; i < $scope.markers.length; i++) {
    		$scope.markers[i].setMap(null);
    	}
    	$scope.markers = [];
    }  

    $scope.errorWatchPosition = function(position) {
        $scope.errorGps = "No Data";
    }
}]);
