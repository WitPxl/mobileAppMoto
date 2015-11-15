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
        $scope.getCurrentPosition();
    }

    $scope.startChrono = function() {
        $scope.options = { maximumAge : 500, timeout: 30000, enableHighAccuracy: true};
        $scope.launchTracker();
        $scope.startTimer();
        $scope.canStart = false;
        $scope.finish = false;
        $scope.tabPoint = [];
    }

    $scope.stopChrono = function() {
        $window.navigator.geolocation.clearWatch($scope.watchID);
        $scope.watchID = null;
        $scope.finish = true;
        $scope.initMap();

        $scope.markers = [];
	    $scope.infoWindow = new google.maps.InfoWindow();
	    $scope.bounds = new google.maps.LatLngBounds();
        for (i = 0; i < $scope.tabPoint.length; i++){
	        $scope.createMarker($scope.tabPoint[i]);
	    }
	    $scope.map.fitBounds($scope.bounds);

        if (angular.isDefined($scope.timer)) {
            $interval.cancel($scope.timer);
            $scope.timer = undefined;
        }
    }

    $scope.reinitData = function() {
        $scope.stopChrono();
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
    	var mapOptions = {
    		zoom: 8,
    		center: new google.maps.LatLng($scope.initLatitude, $scope.initLongitude),
    		// center: new google.maps.LatLng(46.2070),
    		mapTypeId: google.maps.MapTypeId.ROAD
    	}

    	$scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
    }
    
    $scope.createMarker = function (info){
        
        var pos = new google.maps.LatLng(info.coords.latitude, info.coords.longitude);
        var marker = new google.maps.Marker({
            map: $scope.map,
            position: pos,
            title: 'Point'
        });
        marker.content = 'Point';
        $scope.bounds.extend(pos);
        $scope.markers.push(marker);
    }  

    $scope.errorWatchPosition = function(position) {
        $scope.errorGps = "No Data";
    }
}]);
