var app = angular.module('MyApp', []);

app.controller('Part13', ['$scope', '$http', function ($scope, $http) {
    $scope.CurrentPage = 1;
    $scope.TotalPage = 0;
    $scope.CountryList = [];

    function GetCountryData(page) {
        $scope.IsLoading = true;
        $http({
            method: 'GET',
            url: '/Data/GetAllCountries',
            params: { 'page': page }
        }).then(function (response) {
            angular.forEach(response.data.Countries, function (value) {
                $scope.CountryList.push(value);
            });
            $scope.TotalPage = response.data.TotalPage;
            $scope.IsLoading = false;
        }, function () {
            alert('error');
            $scope.IsLoading = false;
        });
    };

    GetCountryData($scope.CurrentPage);

    $scope.NextPage = function () {
        if ($scope.CurrentPage < $scope.TotalPage) {
            $scope.CurrentPage += 1;
            GetCountryData($scope.CurrentPage);
        }
    };
}]);

app.directive('infinityscroll', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.bind('scroll', function () {
                if ((element[0].scrollTop + element[0].offsetHeight) == element[0].scrollHeight) {
                    scope.$apply(attrs.infinityscroll);
                }
            })
        }
    };
});