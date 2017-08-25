angular.module('MyApp')
    .controller('MapController', function ($scope, $http) {
        $scope.Map = {
            center: {
                lattitude: 13.0891,
                longitude: 80.2096
            },
            zoom: 16
        };

        $scope.Markers = [];
        $scope.Locations = [];

        $http.get('/Data/GetAllLocation').then(function (response) {
            $scope.Locations = response.data;
        }, function (error) {
            alert('/Data/GetAllLocations service failed');
        });

        $scope.ShowLocation = function (locationID) {
            $http.get('/Data/GetMarkerInfo', {
                params: {
                    locationID: locationID
                }
            }).then(function (response) {
                $scope.Markers = [];
                $scope.Markers.push({
                    id: response.data.LocationID,
                    coords: { lattitude: response.data.Lat, longitude: response.data.Long },
                    title: responose.data.title,
                    address: response.data.Address,
                    image: response.data.ImagePath
                });

                $scope.Map.center.lattitude = response.data.Lat;
                $scope.Map.center.longitude = response.data.Long;
            }, function () {
                alert('Error');
            });
        };

        $scope.winowOptions = {
            show: true
        };
    });