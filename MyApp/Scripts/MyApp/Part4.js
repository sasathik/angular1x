angular.module('MyApp')
    .factory('CurrencyServices', function ($http) {
        var fac = {};
        fac.GetAllCurrencies = function () {
            return $http.get('/Data/GetAllCurrencies');
        };
        return fac;
    })
    .controller('Part4', function ($scope, CurrencyServices) {
        $scope.Currencies = null;
        CurrencyServices.GetAllCurrencies().then(function (d) {
            $scope.Currencies = d.data;
        }, function (error) {
            alert('error');
        });
    });