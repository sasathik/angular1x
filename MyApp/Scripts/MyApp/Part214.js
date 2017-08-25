var app = angular.module('MyApp', ['ui.calendar', 'ui.bootstrap']);

app.controller('Part214', ['$scope', '$http', 'uiCalendarConfig', '$uibModal', function ($scope, $http, uiCalendarConfig, $uibModal) {
    $scope.SelectedEvent = null;
    $scope.Events = [];
    $scope.EventSources = [$scope.Events]
    $scope.NewEvent = [];

    var isFirstTime = true;

    function GetDate(datetime) {
        if (datetime != null) {
            var mili = datetime.replace(/\/Date\((-?\d+)\)\//, '$1');
            return new Date(parseInt(mili));
        } else {
            return "";
        }
    }

    function ClearCalendar() {
        if (uiCalendarConfig.calendars.myCalendar != null) {
            uiCalendarConfig.calendars.myCalendar.fullCalendar('removeEvents');
            uiCalendarConfig.calendars.myCalendar.fullCalendar('unselect');
        }
    }

    function Populate() {
        ClearCalendar();
        $http.get('/Data/GetEvents', {
            cache: false,
            params: {}
        }).then(function (data) {
            $scope.Events.slice(0, $scope.Events.length);
            angular.forEach(data.data, function (value) {
                $scope.Events.push({
                    id: value.EventID,
                    title: value.Title,
                    description: value.Description,
                    start: new Date(parseInt(value.StartAt.substr(6))),
                    end: new Date(parseInt(value.EndAt.substr(6))),
                    allDay: value.IsFullDay,
                    stick:true
                });
            });
        });
    }

    Populate();

    $scope.UIConfig = {
        calendar: {
            height: 450,
            editable: true,
            displayEventTime: true,
            header: {
                left: 'month,agendaWeek,agendaDay',
                center: 'title',
                right:'today prev,next'
            },
            timeFormat: {
                month: '',
                agenda:'h:mm t'
            },
            selectable: true,
            selectHelper: true,
            select: function (start, end) {
                var fromDate = moment(start).format('YYYY/MM/DD LT');
                var endDate = moment(end).format('YYYY/MM/DD LT');
                $scope.NewEvent = {
                    EventID: 0,
                    StartAt: fromDate,
                    EndAt: endDate,
                    IsFullDay: false,
                    Title: '',
                    Description:''
                };
                $scope.ShowModal();
            },
            eventClick: function (event) {
                $scope.SelectedEvent = event;
                var fromDate = moment(event.start).format('YYYY/MM/DD LT');
                var endDate = moment(event.end).format('YYYY/MM/DD LT');
                $scope.NewEvent = {
                    EventID: event.id,
                    StartAt: fromDate,
                    EndAt: endDate,
                    IsFullDay: false,
                    Title: event.title,
                    Description: event.description
                };
                $scope.ShowModal();
            },
            eventAfterAllRender: function () {
                if ($scope.Events.length > 0 && isFirstTime) {
                    //Focus first event
                    uiCalendarConfig.calendars.myCalendar.fullCalendar('gotoDate', $scope.Events[0].start);
                    isFirstTime = false;
                }
            }
        },
    };

    $scope.ShowModal = function () {
        $scope.option = {
            templateUrl: 'modalContent.html',
            controller: 'modalController',
            backdrop: 'static',
            resolve: {
                NewEvent: function () {
                    return $scope.NewEvent;
                }
            }
        };
    
        var modal = $uibModal.open($scope.option);

        modal.result.then(function (data) {
            $scope.NewEvent = data.event;
            switch (data.operation) {
                case 'Save':
                    //Save here
                    $http({
                        method: 'POST',
                        url: '/Data/SaveEvent',
                        data:$scope.NewEvent
                    }).then(function (response) {
                        if (response.data.status) {
                            Populate();
                        }
                    });
                    break;
                case 'Delete':
                    //Delete here
                    $http({
                        method: 'POST',
                        url: '/Data/DeleteEvent',
                        data: { 'eventID': $scope.NewEvent.EventID }
                    }).then(function (response) {
                        if (response.data.status) {
                            Populate();
                        }
                    });
                    break;
                default:
                    break;
            }
        }, function () {
            console.log('Modal dialog closed');
        });
    };
}]);

app.controller('modalController', ['$scope', '$uibModalInstance', 'NewEvent', function ($scope, $uibModalInstance, NewEvent) {
    $scope.NewEvent = NewEvent;
    $scope.Message = "";

    $scope.Ok = function () {
        if ($scope.NewEvent.Title.trim() != "") {
            $uibModalInstance.close({
                event: $scope.NewEvent,
                operation: 'Save'
            });
        } else {
            $scope.Message = "Event Title Required";
        }
    };

    $scope.Delete = function () {
        $uibModalInstance.close({
            event: $scope.NewEvent,
            operation: 'Delete'
        });
    };

    $scope.Cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}])
