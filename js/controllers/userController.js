karmacracyControllers.controller('UserCtrl', ['$scope', '$http', '$location', 'karmacracyLogin',
    function ($scope, $http, $location, karmacracyLogin) {

        $scope.$on("$routeChangeSuccess", function (scope, next, current) {
            $scope.transitionState = "active"
            WinJS.UI.processAll();
        });

        $scope.user = karmacracyLogin.currentUser();

        $scope.goback = function () {
            $location.path("/world/");
        }
    }]);