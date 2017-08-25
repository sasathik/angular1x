angular.module('MyApp')
    .factory('RegisterationService', function ($http, $q) {
        var fac = {};

        fac.RegisterUser = function (inputData) {
            var defer = $q.defer();

            $http({
                url: '/Data/RegisterUser',
                method: 'POST',
                data: JSON.stringify(data),
                headers: { 'content-type': 'application/json' }
            }).success(function (d) {
                defer.resolve(d);
            }).error(function (e) {
                alert('failed');
                defer.reject(e);
            });

            return defer.promise;
        };

        return fac;
    })
    .controller('Part6', function ($scope, RegisterationService) {
        $scope.SubmitText = 'Save';
        $scope.Submitted = false;
        $scope.Message = '';
        $scope.IsFormValid = false;

        $scope.User = {
            UserName:'',
            Password:'',
            FullName:'',
            EmailID:'',
            Gender: '',
        };

        $scope.$watch('f1.$valid', function (newValue) {
            $scope.IsFormValid = newValue;
        });

        $scope.SaveData = function (user) {
            if ($scope.SubmitText == 'Save') {
                $scope.Submitted = ture;
                $scope.Message = '';

                if ($scope.IsFormValid) {
                    $scope.SubmitText = 'Please Wait...'
                    $scope.User = user;
                    RegisterationService.RegisterUser($scope.User).then(function (data) {
                        alert(data);

                        if (data == 'Sucessfully registered') {
                            ClearForm();
                        }
                        $scope.SubmitText = 'Save';
                    });
                }
                else {
                    $scope.Message = 'Please fill required fields value';
                }
            }
        };

        function ClearForm()
        {
            $scope.User = {};
            $scope.f1.$setPristine();
            $scope.Submitted = false;
        }
    });