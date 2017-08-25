angular.module('MyApp')
    .factory('ProductService', function ($http) {
        var fac = {};
        fac.GetAllOffers = function () {
            return $http.get('/Data/GetAllOffers');
        };
        fac.GetOfferProduct = function (offerId) {
            return $http.get('/Data/GetOfferProduct?offerId=' + offerId);
        };
        return fac;
    })
    .controller('Part5', function ($scope, ProductService) {
        $scope.Results = '';
        $scope.ProductState = 'Select Product';
        $scope.OfferId = null;
        $scope.Offers = null;
        $scope.ProductId = null;
        $scope.Products = null;

        ProductService.GetAllOffers().then(function (d) {
            $scope.Offers = d.data;
        }, function (error) {
            alert('Offers failed');
        });

        $scope.OfferChange = function () {
            $scope.ProductId = null;
            $scope.Products = null;
            $scope.ProductState = 'Please wait till load...';

            ProductService.GetOfferProduct($scope.OfferId).then(function (d) {
                $scope.Products = d.data;
                $scope.ProductState = 'Select Product';
            }, function (error) {
                alert('Product failed');
            });
        };

        $scope.ShowResult = function () {
            $scope.Results = 'Select Offer : ' + $scope.OfferId + '  Selected Product : ' + $scope.ProductId;
        };
    });