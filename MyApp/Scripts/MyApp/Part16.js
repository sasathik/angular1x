var app = angular.module('MyApp', ['angularTreeview']);

app.controller('Part16', ['$scope', '$http', function ($scope, $http) {
    alert('hello');
    $http.get('/Data/GetFileStructure').then(function (response) {
        $scope.List = response.data.treeList;
    });
}]);