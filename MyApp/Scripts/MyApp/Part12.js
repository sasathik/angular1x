var app = angular.module('MyApp', ['angucomplete-alt']);
app.controller('Part12', ['$scope', '$http', function ($scope, $http) {
    $scope.Countries = [];
    $scope.SelectedCountry = null;

    $scope.AfterSelectedCountry = function (selected) {
        if (selected) {
            $scope.SelectedCountry = selected.originalObject;
        }
    };

    $http({
        method: 'GET',
        url : '/Data/GetCountries'
    })
    .then(function (data) {
        $scope.Countries = data.data;
    }, function () {
        alert('Error');
    });
}]);
