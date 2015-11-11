var gps = angular.module("gps", ['ngGeolocation']);

gps.controller("gpsCtrl",  ['$scope', '$window', function($scope, $window) {
	// $scope.$geolocation = $geolocation

    $scope.init = function() {
	    $scope.name = "Boris";
    	$scope.watchID = null;
    	$scope.options = { maximumAge : 500, timeout: 30000, enableHighAccuracy: true, frequency: 1 };
    	$scope.launchTracker();
    }

    $scope.launchTracker = function() {
     //    $geolocation.watchPosition($scope.options).then(function(location) {
		   //  $scope.location = location;
	    // });

         $scope.watchID = $window.navigator.geolocation.watchPosition(
			            function(position) {
			            	$scope = getScope('gps');

			                $scope.longitude = position.coords.longitude;
							$scope.latitude  = position.coords.latitude;
							$scope.speed     = position.coords.speed;
							$scope.timestamp  = position.timestamp;

							$scope.$apply();
							// $scope.vitesse   = position.coords.speed;
							// $scope.timer     = position.timestamp;
			            },
			            function(error) {
			            }, $scope.options);

        // $scope.onSuccess();
    	// $scope.longitude = $geolocation.position.coords.longitude;
    	// $scope.longitude = "bouh";
    	// $scope.latitude  = $geolocation.position.coords;
    }
}]);
