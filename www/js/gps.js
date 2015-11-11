var gps = angular.module("gps", []);

gps.controller("gpsCtrl",  ['$scope', '$window', function($scope, $window) {
	// $scope.$geolocation = $geolocation

    $scope.init = function() {
	    $scope.name = "Boris";
    	$scope.watchID = null;
    	$scope.getCurrentPosition();
    	$scope.options = { maximumAge : 500, timeout: 30000, enableHighAccuracy: true, frequency: 1 };
    	$scope.launchTracker();
    }

	$scope.getCurrentPosition = function() {
		$window.navigator.geolocation.getCurrentPosition(function(position) {
			$scope = getScope('gps');

            $scope.initLongitude = position.coords.longitude;
			$scope.initLatitude  = position.coords.latitude;
		});

	}

    $scope.launchTracker = function() {
        $scope.watchID = $window.navigator.geolocation.watchPosition(
			            function(position) {
			            	$scope = getScope('gps');

			                $scope.longitude = position.coords.longitude;
							$scope.latitude  = position.coords.latitude;
							$scope.speed     = position.coords.speed;
							$scope.timestamp  = position.timestamp;

							$scope.$apply();
			            },
			            function(error) {
			            }, $scope.options);
    }
}]);
