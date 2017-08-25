angular.module('MyApp')
.controller('Part6', function ($scope) {
    $scope.SubmitText = 'Save';
    $scope.Submitted = false;
    $scope.Message = '';
    $scope.IsFormValid = false;

    $scope.User = {
        UserName: '',
        Password: '',
        FullName: '',
        EmailID: '',
        Gender: '',
    };

    $scope.$swatch('f1.$valid', function (newValue) {
        $scope.IsFormValid = newValue;
    });
});