var app = angular.module('MyApp', []);

app.controller('Part15', ['$scope', '$http', function ($scope, $http) {
    $scope.ChartData = [['Name', 'ReportsTo', 'tooltip']];

    $http.get('/Data/GetChartData').then(function (response) {
        var newObject = [['Name', 'ReportsTo', 'tooltip']];
        angular.forEach(response.data, function (val) {
            newObject.push([
                {
                    v: val.EmployeeID.toString(),
                    f: '<div class="customBox"><div>'+ (val.FirstName + ' ' + val.LastName) +'</div><div class="title">' + val.Title + '</div></div>'
                },
                (val.ReportsTo.toString() == "0" ? "" : val.ReportsTo.toString()),
                (val.FirstName + ' ' + val.LastName)
            ]);
        });
        $scope.ChartData = newObject;
    });
}]);

app.directive('orgChart', function () {

    function link($scope, element, attrs) {
        var chart = new google.visualization.OrgChart(element[0]);
        $scope.$watch('ChartData', function (newValue, oldValue) {
            if (!newValue) {
                return;
            }
            var data = google.visualization.arrayToDataTable(newValue);
            var options = {
                'title': '',
                'allowHtml': true
            };
            chart.draw(data, options)
        });
    }

    return {
        link: link
    };
});