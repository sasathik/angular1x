var app = angular.module('MyApp', ['ui.calendar']);

app.controller('Part14', ['$scope', '$http', 'uiCalendarConfig', function ($scope, $http, uiCalendarConfig) {
    $scope.SelectedEvent = null;
    $scope.Events = [];
    $scope.EventSources = [$scope.Events];

    var isFirstTime = true;

    $http.get('/Data/GetEvents', {
        cache: true,
        params: {}
    }).then(function (data) {
        $scope.Events.slice(0, $scope.Events.length);
        angular.forEach(data.data, function (value) {
            $scope.Events.push({
                title: value.Title,
                description: value.Description,
                start: new Date(parseInt(value.StartAt.substr(6))),
                end: new Date(parseInt(value.EndAt.substr(6))),
                allDay: value.IsFullDay,
                stick: true
            });
        })
    });

    $scope.UIConfig = {
        calendar: {
            height: 450,
            editable: true,
            displayEventTime: false,
            header: {
                left: 'month basicWeek basicDay agendaWeek agendaDay',
                center: 'title',
                right: 'today prev,next'
            },
            eventClick: function (event) {
                $scope.SelectedEvent = event;
            },
            eventAfterAllRender: function () {
                if ($scope.Events.length > 0 && isFirstTime) {
                    uiCalendarConfig.calendars.myCalendar.fullCalendar('gotoDate', $scope.Events[0].start);
                }
            }
        }
    };
}]);

